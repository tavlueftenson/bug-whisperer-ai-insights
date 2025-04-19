
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUp } from "lucide-react";
import { toast } from "sonner";
import { DefectData } from "@/components/FileUpload";

interface FileUploadModalProps {
  onFileUploaded: (defects: DefectData[]) => void;
  onAnalysisStart: () => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  onFileUploaded,
  onAnalysisStart
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Handler for file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Check file type
      if (selectedFile.type !== "text/plain" && !selectedFile.name.endsWith(".csv")) {
        setError("Please upload a .txt or .csv file");
        toast.error("Invalid file type. Please upload a .txt or .csv file.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  // Parse CSV row with proper handling of quoted fields
  const parseCSVRow = (row: string): string[] => {
    const result: string[] = [];
    let inQuotes = false;
    let currentValue = "";
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      
      if (char === '"' && (i === 0 || row[i-1] !== '\\')) {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(currentValue.trim());
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    
    // Add the last value
    if (currentValue) {
      result.push(currentValue.trim());
    }
    
    // Clean up quotes from values
    return result.map(value => {
      if (value.startsWith('"') && value.endsWith('"')) {
        return value.substring(1, value.length - 1);
      }
      return value;
    });
  }

  // Function to extract value after a label
  const extractValueAfterLabel = (line: string): string => {
    const colonIndex = line.indexOf(":");
    return colonIndex >= 0 ? line.substring(colonIndex + 1).trim() : "";
  };

  // Function to process the uploaded file
  const processFile = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Processing file:", file.name, file.type);
      // Read the file content
      const text = await file.text();
      console.log("File content loaded, length:", text.length);
      
      // Parse the file content based on file type
      let defects: DefectData[] = [];
      
      if (file.name.endsWith(".csv")) {
        // CSV parsing logic
        const rows = text.split(/\r?\n/); // Handle both CRLF and LF line endings
        const headerRow = rows[0];
        const headers = parseCSVRow(headerRow);
        
        // Map headers to expected fields
        const subjectIndex = headers.findIndex(h => 
          h.toLowerCase().includes("subject") || h.toLowerCase().includes("title"));
        const descIndex = headers.findIndex(h => 
          h.toLowerCase().includes("description") || h.toLowerCase().includes("desc"));
        const stepsIndex = headers.findIndex(h => 
          h.toLowerCase().includes("steps") || h.toLowerCase().includes("reproduce"));
        const actualIndex = headers.findIndex(h => 
          h.toLowerCase().includes("actual") || h.toLowerCase().includes("result"));
        const expectedIndex = headers.findIndex(h => 
          h.toLowerCase().includes("expected"));
        const featureIndex = headers.findIndex(h => 
          h.toLowerCase().includes("feature") || h.toLowerCase().includes("module"));
        const originIndex = headers.findIndex(h => 
          h.toLowerCase().includes("origin") || h.toLowerCase().includes("environment"));
        const testCaseIndex = headers.findIndex(h => 
          h.toLowerCase().includes("test") || h.toLowerCase().includes("case"));
        
        // Process each row
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          
          const cells = parseCSVRow(rows[i]);
          
          defects.push({
            id: `BUG-${i}`,
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
      } else {
        // TXT parsing logic - assume structured format with labels
        // Split by defect entries (assuming defects are separated by some delimiter like "---" or empty lines)
        const defectBlocks = text.split(/\n{2,}|---+/g).filter(block => block.trim());
        
        defectBlocks.forEach((block, index) => {
          const lines = block.split("\n");
          const defectData: Partial<DefectData> = { id: `BUG-${index + 1}` };
          
          lines.forEach(line => {
            // Extract data based on common labels in defect logs
            if (line.toLowerCase().includes("subject:") || line.toLowerCase().includes("title:")) {
              defectData.subject = extractValueAfterLabel(line);
            } else if (line.toLowerCase().includes("description:")) {
              defectData.description = extractValueAfterLabel(line);
            } else if (line.toLowerCase().includes("steps to reproduce:") || line.toLowerCase().includes("reproduction:")) {
              defectData.stepsToReproduce = extractValueAfterLabel(line);
            } else if (line.toLowerCase().includes("actual result:") || line.toLowerCase().includes("actual:")) {
              defectData.actualResult = extractValueAfterLabel(line);
            } else if (line.toLowerCase().includes("expected result:") || line.toLowerCase().includes("expected:")) {
              defectData.expectedResult = extractValueAfterLabel(line);
            } else if (line.toLowerCase().includes("feature:") || line.toLowerCase().includes("module:")) {
              defectData.featureTag = extractValueAfterLabel(line);
            } else if (line.toLowerCase().includes("origin:") || line.toLowerCase().includes("environment:")) {
              defectData.bugOrigin = extractValueAfterLabel(line);
            } else if (line.toLowerCase().includes("test case:") || line.toLowerCase().includes("test id:")) {
              defectData.testCaseId = extractValueAfterLabel(line);
            }
          });
          
          // Fill in missing fields with default values
          defects.push({
            id: defectData.id || `BUG-${index + 1}`,
            subject: defectData.subject || "Unknown",
            description: defectData.description || "",
            stepsToReproduce: defectData.stepsToReproduce || "",
            actualResult: defectData.actualResult || "",
            expectedResult: defectData.expectedResult || "",
            featureTag: defectData.featureTag || "Untagged",
            bugOrigin: defectData.bugOrigin || "Unknown",
            testCaseId: defectData.testCaseId || "N/A"
          });
        });
      }
      
      // Pass the parsed defects up to the parent component
      if (defects.length > 0) {
        console.log("Defects parsed successfully:", defects.length);
        onFileUploaded(defects);
        onAnalysisStart();
        toast.success(`Successfully processed ${defects.length} defects`);
        setOpen(false); // Close the modal after successful upload
      } else {
        setError("No defect data could be extracted from the file");
        toast.error("No defect data could be extracted from the file");
      }
    } catch (err) {
      console.error("Error processing file:", err);
      setError("Error processing file. Please ensure it follows the expected format.");
      toast.error("Error processing file. Please ensure it follows the expected format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full flex items-center gap-2">
          <FileUp className="h-5 w-5" />
          Upload Defect File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Defect Log</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="file-upload"
              type="file"
              accept=".txt,.csv"
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            {file && (
              <p className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>
          <Button 
            onClick={processFile} 
            disabled={!file || loading}
            className="w-full"
          >
            {loading ? "Processing..." : "Analyze Defects"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModal;
