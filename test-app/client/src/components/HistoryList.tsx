import { useState } from "react";
import { Clock, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Badge } from "./ui/badge";

interface Tweet {
  id: string;
  text: string;
  isFakeNews: boolean;
  confidenceScore: number;
  timestamp: string;
}

interface HistoryListProps {
  tweets: Tweet[];
}

export function HistoryList({ tweets }: HistoryListProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (tweets.length === 0) return null;
  
  return (
    <Card className="w-full shadow-lg mt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full flex justify-between p-0 h-auto">
              <CardTitle className="text-xl font-bold flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Recent Analysis History
              </CardTitle>
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {tweets.map((tweet) => (
                <div key={tweet.id} className="border rounded-md p-3 bg-background/50">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm line-clamp-2">{tweet.text}</p>
                    <Badge variant={tweet.isFakeNews ? "destructive" : "outline"} className={tweet.isFakeNews ? "" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"}>
                      {tweet.isFakeNews ? (
                        <AlertTriangle className="mr-1 h-3 w-3" />
                      ) : (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      )}
                      {tweet.isFakeNews ? "Fake" : "Authentic"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(tweet.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}