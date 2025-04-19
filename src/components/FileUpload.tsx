
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import FileUploadModal from "./FileUploadModal";

interface FileUploadProps {
  onFileUploaded: (defects: DefectData[]) => void;
  onAnalysisStart: () => void;
}

// Define the defect data structure that will be extracted from the uploaded files
export interface DefectData {
  id: string;
  subject: string;
  description: string;
  stepsToReproduce: string;
  actualResult: string;
  expectedResult: string;
  featureTag: string;
  bugOrigin: string;
  testCaseId: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileUploaded, 
  onAnalysisStart 
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Defect Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <FileUploadModal 
            onFileUploaded={onFileUploaded} 
            onAnalysisStart={onAnalysisStart} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;
