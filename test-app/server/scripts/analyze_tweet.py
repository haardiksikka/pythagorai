#!/usr/bin/env python3
import sys
import json
import os
import numpy as np
import torch
import torch.nn.functional as F
from transformers import BertTokenizer

# Assuming GNN-FakeNews is installed and available
# You may need to add the path to the GNN-FakeNews repo
sys.path.append(os.path.join(os.path.dirname(__file__), '../../GNN-FakeNews'))

# Import necessary modules from GNN-FakeNews
from models.BERT import BertClassifier
from data_loader.data_loaders import get_loader, get_sets

def preprocess_tweet(tweet_text):
    """
    Preprocess the tweet text to match the expected input format of GNN-FakeNews
    
    Args:
        tweet_text (str): The tweet text to analyze
        
    Returns:
        dict: Preprocessed tweet data
    """
    # Initialize the BERT tokenizer
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    
    # Tokenize the tweet text
    encoded_tweet = tokenizer.encode_plus(
        tweet_text,
        add_special_tokens=True,
        max_length=128,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors='pt'
    )
    
    return {
        'input_ids': encoded_tweet['input_ids'],
        'attention_mask': encoded_tweet['attention_mask']
    }

def analyze_tweet_with_gnn_fakenews(tweet_text):
    """
    Analyze a tweet using the GNN-FakeNews model
    
    Args:
        tweet_text (str): The tweet text to analyze
        
    Returns:
        dict: Analysis results with isFakeNews and confidenceScore
    """
    try:
        # Load the pre-trained model
        model_path = os.path.join(os.path.dirname(__file__), '../../GNN-FakeNews/saved_models/bert_model.pt')
        
        # If the model doesn't exist, return an error
        if not os.path.exists(model_path):
            return {
                "error": "GNN-FakeNews model not found. Please download and place it in the correct location."
            }
        
        # Load the model
        model = BertClassifier()
        model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
        model.eval()
        
        # Preprocess the tweet
        preprocessed_tweet = preprocess_tweet(tweet_text)
        
        # Run the model
        with torch.no_grad():
            outputs = model(
                input_ids=preprocessed_tweet['input_ids'],
                attention_mask=preprocessed_tweet['attention_mask']
            )
            
            # Apply softmax to get probabilities
            probabilities = F.softmax(outputs, dim=1)
            
            # Get the probability of fake news (assuming index 1 is for fake news)
            fake_news_probability = probabilities[0][1].item()
            
            # Determine if it's fake news based on probability threshold
            is_fake_news = fake_news_probability > 0.5
            
            return {
                "isFakeNews": bool(is_fake_news),
                "confidenceScore": float(fake_news_probability)
            }
    except Exception as e:
        return {
            "error": f"Error analyzing tweet: {str(e)}"
        }

def main():
    # Get tweet text from command line argument
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No tweet text provided"}))
        sys.exit(1)

    tweet_text = sys.argv[1]

    try:
        # Use the GNN-FakeNews model to analyze the tweet
        result = analyze_tweet_with_gnn_fakenews(tweet_text)
        
        # Check if there was an error
        if "error" in result:
            print(json.dumps(result))
            sys.exit(1)
            
        # Output the result as JSON
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()