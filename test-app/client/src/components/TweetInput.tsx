import { useState } from "react";
import { useForm } from "react-hook-form";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";

interface TweetInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

interface FormValues {
  tweetText: string;
}

const MAX_TWEET_LENGTH = 280;

export function TweetInput({ onAnalyze, isLoading }: TweetInputProps) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      tweetText: ""
    }
  });
  
  const tweetText = watch("tweetText");
  const characterCount = tweetText?.length || 0;
  const isOverLimit = characterCount > MAX_TWEET_LENGTH;
  
  const onSubmit = (data: FormValues) => {
    if (!isOverLimit) {
      onAnalyze(data.tweetText);
    }
  };
  
  const handleClear = () => {
    reset();
  };
  
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Tweet Analysis</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste or type a tweet here to check if it contains fake news..."
              className="min-h-[120px] resize-none"
              {...register("tweetText", { 
                required: "Tweet text is required",
                maxLength: {
                  value: MAX_TWEET_LENGTH,
                  message: `Tweet cannot exceed ${MAX_TWEET_LENGTH} characters`
                }
              })}
            />
            
            <div className="flex justify-between items-center text-sm">
              <div className={`${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
                {characterCount}/{MAX_TWEET_LENGTH} characters
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                disabled={isLoading || characterCount === 0}
              >
                Clear
              </Button>
            </div>
            
            {errors.tweetText && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errors.tweetText.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading || characterCount === 0 || isOverLimit}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Tweet'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}