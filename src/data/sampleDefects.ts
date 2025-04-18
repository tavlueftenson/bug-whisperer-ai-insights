import { DefectData } from "@/components/FileUpload";

// Sample defect data for demonstration purposes
export const sampleDefects: DefectData[] = [
  {
    id: "BUG-1",
    subject: "Login fails with special characters",
    description: "Users cannot login when email contains special characters",
    stepsToReproduce: "1. Go to login 2. Enter special char email 3. Submit",
    actualResult: "Error message shown",
    expectedResult: "Successful login",
    featureTag: "Authentication",
    bugOrigin: "Production",
    testCaseId: "TC-001"
  },
  {
    id: "BUG-2",
    subject: "Dashboard data lag",
    description: "Dashboard not updating in real-time",
    stepsToReproduce: "1. Open dashboard 2. Make changes elsewhere 3. Return to dashboard",
    actualResult: "No updates visible",
    expectedResult: "Auto-refresh every 30s",
    featureTag: "Dashboard",
    bugOrigin: "UAT",
    testCaseId: "TC-002"
  },
  {
    id: "BUG-3",
    subject: "Export corrupts large files",
    description: "Exporting large data sets creates corrupt files",
    stepsToReproduce: "1. Generate large report 2. Export to Excel",
    actualResult: "File corrupted",
    expectedResult: "Valid Excel file",
    featureTag: "Reporting",
    bugOrigin: "Development",
    testCaseId: "TC-003"
  },
  {
    id: "BUG-4",
    subject: "Search filter not working",
    description: "Category filter has no effect on results",
    stepsToReproduce: "1. Open search 2. Apply category filter 3. Search",
    actualResult: "Results ignore filter",
    expectedResult: "Filtered results shown",
    featureTag: "Search",
    bugOrigin: "Production",
    testCaseId: "TC-004"
  },
  {
    id: "BUG-5",
    subject: "Mobile menu stays open",
    description: "Menu doesn't close after selection on mobile",
    stepsToReproduce: "1. Open mobile site 2. Open menu 3. Select item",
    actualResult: "Menu remains open",
    expectedResult: "Menu should close",
    featureTag: "Navigation",
    bugOrigin: "QA",
    testCaseId: "TC-005"
  }
];
