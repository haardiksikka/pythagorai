import { CheckCircle, AlertTriangle, BarChart3, Clock, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

interface ResultsDisplayProps {
  result: {
    isFakeNews: boolean;
    confidenceScore: number;
    timestamp: string;
  } | null;
  onReset: () => void;
}

export function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  if (!result) return null;
  
  const { isFakeNews, confidenceScore, timestamp } = result;
  const formattedScore = Math.round(confidenceScore * 100);
  const formattedTimestamp = new Date(timestamp).toLocaleString();
  
  return (
    <Card className={`w-full shadow-lg border-t-4 ${isFakeNews ? 'border-t-destructive' : 'border-t-green-500'} animate-fade-in`}>
      <CardHeader className={`${isFakeNews ? 'bg-destructive/10' : 'bg-green-500/10'} rounded-t-lg`}>
        <CardTitle className="flex items-center text-2xl font-bold">
          {isFakeNews ? (
            <>
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
              <span className="text-destructive">Likely Fake News</span>
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
              <span className="text-green-500">Likely Authentic</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Confidence Score</span>
            </div>
            <span className="font-bold">{formattedScore}%</span>
          </div>
          <Progress value={formattedScore} className={`h-2 ${isFakeNews ? 'bg-destructive/30' : 'bg-green-500/30'}`} />
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-2 h-4 w-4" />
          <span>Analysis completed at {formattedTimestamp}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button 
          onClick={onReset}
          variant="outline"
          className="flex items-center"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Analyze Another Tweet
        </Button>
      </CardFooter>
    </Card>
  );
}