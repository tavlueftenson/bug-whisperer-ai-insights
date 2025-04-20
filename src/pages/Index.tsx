import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bug, ChevronRight, FileText, FileUp, BarChart3 } from "lucide-react";
import FileUpload, { DefectData } from "@/components/FileUpload";
import DefectAnalytics, { AnalysisResults } from "@/components/DefectAnalytics";
import DefectTable from "@/components/DefectTable";
import AnalysisLoader from "@/components/AnalysisLoader";
import { AIAnalysisService } from "@/services/aiAnalysisService";
import { sampleDefects } from "@/data/sampleDefects";
import { toast } from "sonner";
import { parseCSV, extractDefectHeaderMappings } from "@/utils/csvParser";
import ApiKeyModal from "@/components/ApiKeyModal";

const Index = () => {
  const [defects, setDefects] = useState<DefectData[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResults | null>(null);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [lastUpdated] = useState(new Date(import.meta.env.VITE_BUILD_TIMESTAMP || Date.now()));
  const [apiKeySet, setApiKeySet] = useState<boolean>(false);

  const handleFileUploaded = (parsedDefects: DefectData[]) => {
    setDefects(parsedDefects);
    setActiveTab("defects");
  };
  
  const handleAnalysisStart = () => {
    setAnalyzing(true);
    setActiveTab("analysis");
    
    AIAnalysisService.analyzeDefects(defects)
      .then((results) => {
        setAnalysis(results);
        setAnalyzing(false);
      })
      .catch((error) => {
        console.error("Error during analysis:", error);
        setAnalyzing(false);
        toast.error("Analysis failed. Please try again.");
      });
  };
  
  const loadSampleData = async () => {
    try {
      const baseUrl = import.meta.env.BASE_URL || '/';
      console.log("Loading sample data from:", `${baseUrl}sample-defects.csv`);
      
      const response = await fetch(`${baseUrl}sample-defects.csv`);
      
      if (!response.ok) {
        console.error(`Failed to fetch sample data: ${response.status} ${response.statusText}`);
        throw new Error(`Failed to fetch sample data: ${response.status}`);
      }
      
      const csvText = await response.text();
      console.log("CSV data loaded, length:", csvText.length);
      
      const rows = parseCSV(csvText, { hasHeader: true });
      console.log("Sample data rows:", rows.length - 1); // Subtract 1 for header
      
      if (rows.length <= 1) { // Just header or empty
        throw new Error("Sample CSV file appears to be empty");
      }
      
      const headers = rows[0];
      
      const {
        subjectIndex,
        descIndex,
        stepsIndex,
        actualIndex,
        expectedIndex,
        featureIndex,
        originIndex,
        testCaseIndex
      } = extractDefectHeaderMappings(headers);
      
      const parsedDefects: DefectData[] = [];
      const dataRows = rows.slice(1);
      
      for (let i = 0; i < dataRows.length; i++) {
        const cells = dataRows[i];
        
        if (cells.length <= 1) {
          console.warn(`Skipping row ${i+1} due to insufficient cells:`, cells);
          continue;
        }
        
        parsedDefects.push({
          id: `BUG-${i+1}`,
          subject: cells[subjectIndex]?.trim() || "Unknown",
          description: cells[descIndex]?.trim() || "",
          stepsToReproduce: cells[stepsIndex]?.trim() || "",
          actualResult: cells[actualIndex]?.trim() || "",
          expectedResult: cells[expectedIndex]?.trim() || "",
          featureTag: cells[featureIndex]?.trim() || "Untagged",
          bugOrigin: cells[originIndex]?.trim() || "Unknown",
          testCaseId: cells[testCaseIndex]?.trim() || "N/A"
        });
      }
      
      setDefects(parsedDefects);
      setActiveTab("defects");
      toast.success("Sample data loaded successfully");
    } catch (error) {
      console.error("Error loading sample data:", error);
      toast.error("Failed to load sample data. Using fallback data instead.");
      console.log("Using fallback sample data");
      setDefects(sampleDefects);
      setActiveTab("defects");
    }
  };
  
  useEffect(() => {
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      AIAnalysisService.setApiKey(storedKey);
      setApiKeySet(true);
    }
  }, []);
  
  const handleApiKeySet = () => {
    setApiKeySet(true);
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <header className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bug size={32} className="text-primary" />
          <h1 className="text-3xl sm:text-4xl font-bold">Bug Whisperer AI</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Analyze defect logs for actionable insights and improvement recommendations
        </p>
        <div className="mt-4">
          <ApiKeyModal onApiKeySet={handleApiKeySet} />
        </div>
      </header>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger 
            value="defects" 
            className="flex items-center gap-2"
            disabled={defects.length === 0}
          >
            <FileText className="h-4 w-4" />
            <span>Defects</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            className="flex items-center gap-2"
            disabled={defects.length === 0}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Analysis</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <FileUpload 
                onFileUploaded={handleFileUploaded}
                onAnalysisStart={handleAnalysisStart}
              />
              <div className="mt-4 text-center">
                <Button 
                  variant="outline" 
                  onClick={loadSampleData}
                >
                  Use Sample Data
                </Button>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>How to Use Bug Whisperer AI</CardTitle>
                <CardDescription>
                  Upload your defect logs to get powerful insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Upload Your Defect Log</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload a TXT or CSV file containing your defect data with fields for subject, 
                      description, steps to reproduce, etc.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Review Your Defects</h3>
                    <p className="text-sm text-muted-foreground">
                      Verify that your defect data was extracted correctly before proceeding with analysis.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Get AI-Powered Insights</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI analyzes your defects to identify root causes, patterns, and provides 
                      actionable recommendations for process improvement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="defects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>Uploaded Defects ({defects.length})</div>
                <Button 
                  onClick={handleAnalysisStart}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  Analyze
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>
                Review your uploaded defects before analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DefectTable defects={defects} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-6">
          {analyzing ? (
            <AnalysisLoader />
          ) : analysis ? (
            <DefectAnalytics defects={defects} analysis={analysis} />
          ) : defects.length > 0 ? (
            <Card className="text-center py-8">
              <CardContent>
                <p className="mb-4">Ready to analyze your defects?</p>
                <Button onClick={handleAnalysisStart}>Start Analysis</Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <CardContent>
                <p className="mb-4">Please upload your defect log to begin analysis</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>Bug Whisperer AI © {new Date().getFullYear()} - Defect Analysis with AI Insights</p>
        <p className="text-xs text-muted-foreground mt-2">
          Last Updated: {lastUpdated.toLocaleString()}
        </p>
      </footer>
    </div>
  );
};

export default Index;
