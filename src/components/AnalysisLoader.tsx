
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Code, Cog, LineChart } from "lucide-react";

const AnalysisLoader: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5" />
          AI Analysis in Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="animate-pulse">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="h-2.5 bg-muted rounded-full w-full mb-2.5"></div>
              <div className="h-2 bg-muted rounded-full w-3/4"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="animate-pulse">
              <Cog className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="h-2.5 bg-muted rounded-full w-full mb-2.5"></div>
              <div className="h-2 bg-muted rounded-full w-1/2"></div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="animate-pulse">
              <LineChart className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="h-2.5 bg-muted rounded-full w-full mb-2.5"></div>
              <div className="h-2 bg-muted rounded-full w-4/5"></div>
            </div>
          </div>

          <div className="text-sm text-center text-muted-foreground mt-4">
            Our AI is analyzing your defect data and generating insights...
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisLoader;
