const Tweet = require('../models/Tweet');
const pythonBridgeService = require('./pythonBridgeService');

// In-memory storage for tweets when database is not available
const inMemoryTweets = [];

const analyzeTweet = async (text) => {
  try {
    // Use the Python bridge to analyze the tweet with GNN-FakeNews
    const analysis = await pythonBridgeService.analyzeTweetWithGNN(text);
    
    // Check if there was an error from the Python script
    if (analysis.error) {
      throw new Error(analysis.error);
    }

    // Create a tweet object
    const tweetData = {
      text,
      isFakeNews: analysis.isFakeNews,
      confidenceScore: analysis.confidenceScore,
      timestamp: new Date()
    };

    // Try to save to database if available, otherwise use in-memory storage
    let tweetId;
    try {
      if (process.env.DATABASE_URL) {
        const tweet = new Tweet(tweetData);
        await tweet.save();
        tweetId = tweet._id;
      } else {
        // Generate a simple ID for in-memory storage
        tweetId = Date.now().toString();
        inMemoryTweets.push({ _id: tweetId, ...tweetData });
      }
    } catch (dbError) {
      console.warn("Failed to save tweet to database, using in-memory storage:", dbError.message);
      tweetId = Date.now().toString();
      inMemoryTweets.push({ _id: tweetId, ...tweetData });
    }

    return {
      id: tweetId,
      isFakeNews: tweetData.isFakeNews,
      confidenceScore: tweetData.confidenceScore,
      timestamp: tweetData.timestamp
    };
  } catch (error) {
    throw new Error(`Error analyzing tweet: ${error.message}`);
  }
};

const getTweetHistory = async (limit = 10) => {
  try {
    let tweets;
    
    // Try to get from database if available, otherwise use in-memory storage
    try {
      if (process.env.DATABASE_URL) {
        tweets = await Tweet.find()
          .sort({ timestamp: -1 })
          .limit(limit);
      } else {
        tweets = inMemoryTweets
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, limit);
      }
    } catch (dbError) {
      console.warn("Failed to retrieve tweets from database, using in-memory storage:", dbError.message);
      tweets = inMemoryTweets
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    }

    return tweets.map(tweet => ({
      id: tweet._id,
      text: tweet.text,
      isFakeNews: tweet.isFakeNews,
      confidenceScore: tweet.confidenceScore,
      timestamp: tweet.timestamp
    }));
  } catch (error) {
    throw new Error(`Error fetching tweet history: ${error.message}`);
  }
};

module.exports = {
  analyzeTweet,
  getTweetHistory
};