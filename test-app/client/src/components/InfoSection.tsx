import { Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export function InfoSection() {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Info className="mr-2 h-5 w-5 text-blue-500" />
          About our Fake News Detection
        </CardTitle>
        <CardDescription>
          Understanding how our system analyzes tweets for misinformation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="model">
            <AccordionTrigger>How does it work?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                Our system uses the GNN-FakeNews model, a state-of-the-art Graph Neural Network approach
                for fake news detection developed by researchers at safe-graph.
              </p>
              <p>
                The model analyzes both the content of the tweet and its propagation
                patterns to determine the likelihood of it containing misinformation.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="accuracy">
            <AccordionTrigger>How accurate is it?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-2">
                The GNN-FakeNews model achieves high accuracy in detecting fake news, with 
                performance that exceeds many traditional methods by leveraging both textual 
                and structural information.
              </p>
              <p>
                However, no model is perfect. The confidence score indicates the model's 
                certainty in its prediction, but we recommend using this tool as one of 
                several methods to verify information.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="usage">
            <AccordionTrigger>How to use this tool</AccordionTrigger>
            <AccordionContent>
              <ol className="list-decimal list-inside space-y-1">
                <li>Paste or type a tweet in the text area.</li>
                <li>Click "Analyze Tweet" to process it.</li>
                <li>Review the results, which show:</li>
                <ul className="list-disc list-inside ml-5 mt-1">
                  <li>Whether it's likely authentic or fake news</li>
                  <li>The confidence score of the prediction</li>
                  <li>When the analysis was performed</li>
                </ul>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}