import { useState, useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import { TweetInput } from "@/components/TweetInput";
import { ResultsDisplay } from "@/components/ResultsDisplay";
import { HistoryList } from "@/components/HistoryList";
import { InfoSection } from "@/components/InfoSection";
import { analyzeTweet, getTweetHistory } from "@/api/tweets";
import { AlertCircle } from "lucide-react";

interface AnalysisResult {
  isFakeNews: boolean;
  confidenceScore: number;
  timestamp: string;
  id: string;
}

interface Tweet {
  id: string;
  text: string;
  isFakeNews: boolean;
  confidenceScore: number;
  timestamp: string;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<Tweet[]>([]);
  const [currentTweet, setCurrentTweet] = useState("");
  const { toast } = useToast();
  
  useEffect(() => {
    // We're not saving history anymore, so we don't need to load it
    // But we'll keep the function to maintain compatibility
    loadHistory();
  }, []);
  
  const loadHistory = async () => {
    try {
      const response = await getTweetHistory();
      setHistory(response.tweets || []);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Error loading history",
          description: error.message,
        });
      }
    }
  };
  
  const handleAnalyze = async (text: string) => {
    setIsLoading(true);
    setCurrentTweet(text);
    
    try {
      const response = await analyzeTweet({ text });
      setResult(response);
      
      // Add to local history (not saved on backend)
      const newTweet = {
        id: response.id,
        text,
        isFakeNews: response.isFakeNews,
        confidenceScore: response.confidenceScore,
        timestamp: response.timestamp
      };
      
      // Update local history
      setHistory(prev => [newTweet, ...prev]);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Analysis failed",
          description: error.message,
          icon: <AlertCircle className="h-5 w-5" />,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setCurrentTweet("");
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-8 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Fake News Tweet Detector
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Analyze tweets to detect potential misinformation using GNN-FakeNews AI
        </p>
      </div>
      
      {!result ? (
        <TweetInput onAnalyze={handleAnalyze} isLoading={isLoading} />
      ) : (
        <ResultsDisplay result={result} onReset={handleReset} />
      )}
      
      {history.length > 0 && <HistoryList tweets={history} />}
      
      <InfoSection />
    </div>
  );
}