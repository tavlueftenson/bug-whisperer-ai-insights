
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

  // Improved CSV row parsing with better handling of quoted fields
  // Specifically optimized for Python-generated CSV with quote_all=True
  const parseCSVRow = (row: string): string[] => {
    if (!row.trim()) return [];
    
    // Handle case where entire row might be empty or just whitespace
    if (row.trim() === '') return [];
    
    const result: string[] = [];
    let inQuotes = false;
    let currentValue = '';
    let i = 0;
    
    while (i < row.length) {
      const char = row[i];
      
      // Handle quotes
      if (char === '"') {
        // Check if this is an escaped quote (double quote) inside a quoted field
        if (i + 1 < row.length && row[i + 1] === '"' && inQuotes) {
          currentValue += '"'; // Add a single quote to the value
          i += 2; // Skip both quotes
          continue;
        }
        
        // Toggle quote state
        inQuotes = !inQuotes;
        i++; // Move to next character
        continue;
      }
      
      // Handle field separators (commas)
      if (char === ',' && !inQuotes) {
        // End of field reached
        result.push(currentValue);
        currentValue = '';
        i++;
        continue;
      }
      
      // For all other characters, add to current value
      currentValue += char;
      i++;
    }
    
    // Add the last field
    result.push(currentValue);
    
    // Trim whitespace from all fields
    return result.map(value => value.trim());
  };

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
        // CSV parsing logic with improved quoted field handling
        const rows = text.split(/\r?\n/).filter(row => row.trim()); // Filter out empty lines
        console.log("Total rows detected:", rows.length);
        
        if (rows.length === 0) {
          throw new Error("CSV file appears to be empty");
        }
        
        const headerRow = rows[0];
        const headers = parseCSVRow(headerRow);
        console.log("CSV Headers detected:", headers);
        
        // More flexible header mapping with fallbacks
        const findHeaderIndex = (possibleNames: string[]) => {
          return headers.findIndex(h => 
            possibleNames.some(name => h.toLowerCase().includes(name.toLowerCase()))
          );
        };
        
        // Map headers to expected fields with multiple possible matches
        const subjectIndex = findHeaderIndex(['subject', 'title', 'summary', 'issue', 'bug']);
        const descIndex = findHeaderIndex(['description', 'desc', 'details', 'summary']);
        const stepsIndex = findHeaderIndex(['steps', 'reproduce', 'reproduction', 'how to']);
        const actualIndex = findHeaderIndex(['actual', 'result', 'observed', 'outcome']);
        const expectedIndex = findHeaderIndex(['expected', 'should', 'desired']);
        const featureIndex = findHeaderIndex(['feature', 'module', 'component', 'area', 'func']);
        const originIndex = findHeaderIndex(['origin', 'environment', 'env', 'found in', 'source']);
        const testCaseIndex = findHeaderIndex(['test', 'case', 'tc', 'testcase']);
        
        console.log("Field mappings:", {
          subject: subjectIndex,
          description: descIndex,
          steps: stepsIndex,
          actual: actualIndex,
          expected: expectedIndex,
          feature: featureIndex,
          origin: originIndex,
          testCase: testCaseIndex
        });
        
        // Check if we found at least the minimal required fields (subject)
        if (subjectIndex === -1) {
          console.warn("Could not find subject/title field in CSV headers");
          throw new Error("Could not identify required fields in CSV headers. Please ensure your CSV includes at least a subject/title column.");
        }
        
        // Process data rows only (skip header)
        const dataRows = rows.slice(1).filter(row => row.trim());
        console.log("Data rows to process:", dataRows.length);
        
        // Create a set to track IDs to avoid duplicates
        const processedIds = new Set<string>();
        
        // Process each row
        for (let i = 0; i < dataRows.length; i++) {
          try {
            // Skip rows that are clearly just whitespace
            if (!dataRows[i].trim()) continue;
            
            const cells = parseCSVRow(dataRows[i]);
            console.log(`Row ${i+1} parsed cells:`, cells.length);
            
            // Skip rows with insufficient cells
            if (cells.length <= 1 || (subjectIndex >= 0 && cells[subjectIndex]?.trim() === "")) {
              console.warn(`Skipping row ${i+1} - insufficient data`);
              continue;
            }
            
            // Generate a unique ID for the defect
            let defectId = `BUG-${i+1}`;
            while (processedIds.has(defectId)) {
              defectId = `BUG-${i+1}-${Math.random().toString(36).substring(2, 5)}`;
            }
            processedIds.add(defectId);
            
            // Create defect with default values for missing fields
            const defect: DefectData = {
              id: defectId,
              subject: "Unknown",
              description: "",
              stepsToReproduce: "",
              actualResult: "",
              expectedResult: "",
              featureTag: "Untagged",
              bugOrigin: "Unknown",
              testCaseId: "N/A"
            };
            
            // Only set fields that exist in the CSV
            if (subjectIndex >= 0 && subjectIndex < cells.length && cells[subjectIndex]) {
              defect.subject = cells[subjectIndex]?.trim() || "Unknown";
            }
            
            if (descIndex >= 0 && descIndex < cells.length && cells[descIndex]) {
              defect.description = cells[descIndex]?.trim() || "";
            }
            
            if (stepsIndex >= 0 && stepsIndex < cells.length && cells[stepsIndex]) {
              defect.stepsToReproduce = cells[stepsIndex]?.trim() || "";
            }
            
            if (actualIndex >= 0 && actualIndex < cells.length && cells[actualIndex]) {
              defect.actualResult = cells[actualIndex]?.trim() || "";
            }
            
            if (expectedIndex >= 0 && expectedIndex < cells.length && cells[expectedIndex]) {
              defect.expectedResult = cells[expectedIndex]?.trim() || "";
            }
            
            if (featureIndex >= 0 && featureIndex < cells.length && cells[featureIndex]) {
              defect.featureTag = cells[featureIndex]?.trim() || "Untagged";
            }
            
            if (originIndex >= 0 && originIndex < cells.length && cells[originIndex]) {
              defect.bugOrigin = cells[originIndex]?.trim() || "Unknown";
            }
            
            if (testCaseIndex >= 0 && testCaseIndex < cells.length && cells[testCaseIndex]) {
              defect.testCaseId = cells[testCaseIndex]?.trim() || "N/A";
            }
            
            defects.push(defect);
          } catch (rowError) {
            console.error(`Error processing row ${i+1}:`, rowError);
            // Continue with next row instead of failing entire import
          }
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
        toast.error("No defect data could be extracted from the file. Please check the format.");
      }
    } catch (err) {
      console.error("Error processing file:", err);
      setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}. Please ensure it follows the expected format.`);
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
