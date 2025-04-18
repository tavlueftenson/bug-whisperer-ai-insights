
import { DefectData } from "@/components/FileUpload";

// Sample defect data for demonstration purposes when no file is uploaded
export const sampleDefects: DefectData[] = [
  {
    id: "BUG-001",
    subject: "Login fails when email contains special characters",
    description: "Users with emails containing '+' or '.' before @ cannot login to the system.",
    stepsToReproduce: "1. Navigate to login page\n2. Enter email with '+' character\n3. Enter password\n4. Click login",
    actualResult: "Error message: 'Invalid email format'",
    expectedResult: "User should be able to log in successfully",
    featureTag: "Authentication",
    bugOrigin: "Production",
    testCaseId: "TC-AUTH-103"
  },
  {
    id: "BUG-002",
    subject: "Profile picture upload fails for large images",
    description: "When uploading profile pictures larger than 2MB, the upload fails with no error message.",
    stepsToReproduce: "1. Go to profile page\n2. Click 'Change Picture'\n3. Select an image larger than 2MB",
    actualResult: "Upload spinner keeps spinning indefinitely",
    expectedResult: "Error message should inform user about file size limitations",
    featureTag: "User Profile",
    bugOrigin: "UAT",
    testCaseId: "TC-PROF-205"
  },
  {
    id: "BUG-003",
    subject: "Dashboard data doesn't refresh automatically",
    description: "Dashboard statistics are not updated in real-time as specified in requirements.",
    stepsToReproduce: "1. Login to system\n2. Navigate to dashboard\n3. Make changes that should affect dashboard in another tab\n4. Return to dashboard",
    actualResult: "Data remains unchanged until manual refresh",
    expectedResult: "Dashboard should update automatically every 30 seconds",
    featureTag: "Dashboard",
    bugOrigin: "Development",
    testCaseId: "TC-DASH-118"
  },
  {
    id: "BUG-004",
    subject: "Pagination breaks on search results page",
    description: "When searching with certain filters, pagination doesn't work correctly.",
    stepsToReproduce: "1. Go to search page\n2. Apply category and date filters\n3. Search for 'test'\n4. Try to go to page 2",
    actualResult: "Page reloads but shows same results from page 1",
    expectedResult: "Page 2 of search results should be displayed",
    featureTag: "Search",
    bugOrigin: "UAT",
    testCaseId: "TC-SRCH-312"
  },
  {
    id: "BUG-005",
    subject: "Permission error when accessing admin section after password reset",
    description: "After resetting password, admin users lose their permissions temporarily.",
    stepsToReproduce: "1. Trigger password reset for admin account\n2. Set new password\n3. Try to access admin section",
    actualResult: "Error: 'You don't have permission to access this page'",
    expectedResult: "Admin user should retain all permissions after password reset",
    featureTag: "Authentication",
    bugOrigin: "Production",
    testCaseId: "TC-AUTH-217"
  },
  {
    id: "BUG-006",
    subject: "Report export creates corrupt Excel file",
    description: "When exporting a report with more than 1000 rows, the resulting Excel file is corrupted.",
    stepsToReproduce: "1. Go to reports section\n2. Generate a report with >1000 items\n3. Click 'Export to Excel'",
    actualResult: "Excel reports error when opening file",
    expectedResult: "Valid Excel file should be downloaded",
    featureTag: "Reporting",
    bugOrigin: "UAT",
    testCaseId: "TC-RPT-089"
  },
  {
    id: "BUG-007",
    subject: "Error 500 when submitting form with emoji in text field",
    description: "Server error occurs when submitting any form with emoji characters.",
    stepsToReproduce: "1. Go to feedback form\n2. Enter text with emoji (e.g. 😊)\n3. Submit form",
    actualResult: "Server responds with 500 error",
    expectedResult: "Form should be submitted successfully or show valid error",
    featureTag: "Forms",
    bugOrigin: "Production",
    testCaseId: "TC-FORM-156"
  },
  {
    id: "BUG-008",
    subject: "Mobile menu doesn't close after selection",
    description: "On mobile devices, the navigation menu stays open after selecting an item.",
    stepsToReproduce: "1. Open site on mobile device\n2. Open hamburger menu\n3. Select a menu item",
    actualResult: "Page changes but menu remains open",
    expectedResult: "Menu should close after selection",
    featureTag: "Navigation",
    bugOrigin: "Development",
    testCaseId: "TC-NAV-043"
  },
  {
    id: "BUG-009",
    subject: "Notification count incorrect after marking as read",
    description: "The notification counter doesn't update immediately after marking notifications as read.",
    stepsToReproduce: "1. User with notifications\n2. Open notification panel\n3. Click 'Mark all as read'\n4. Close and reopen panel",
    actualResult: "Counter still shows previous number",
    expectedResult: "Notification counter should update to zero",
    featureTag: "Notifications",
    bugOrigin: "UAT",
    testCaseId: "TC-NOTIF-078"
  },
  {
    id: "BUG-010",
    subject: "API rate limiting not working properly",
    description: "API endpoints are not correctly enforcing rate limits specified in documentation.",
    stepsToReproduce: "1. Send 100 requests in 10 seconds to /api/data\n2. Check response codes",
    actualResult: "All 100 requests processed with 200 OK",
    expectedResult: "Requests exceeding limit should return 429 Too Many Requests",
    featureTag: "API",
    bugOrigin: "Production",
    testCaseId: "TC-API-201"
  },
  {
    id: "BUG-011",
    subject: "Print layout cuts off content in reports",
    description: "When printing reports, some content is cut off at the page breaks.",
    stepsToReproduce: "1. Generate monthly report\n2. Click print preview\n3. Observe content at page breaks",
    actualResult: "Tables and charts cut off between pages",
    expectedResult: "Content should flow properly across page breaks",
    featureTag: "Reporting",
    bugOrigin: "UAT",
    testCaseId: "TC-RPT-115"
  },
  {
    id: "BUG-012",
    subject: "Filter settings lost after session timeout",
    description: "Complex filter selections on the data page are lost after session times out and user logs back in.",
    stepsToReproduce: "1. Set complex filters on data page\n2. Let session timeout\n3. Log back in\n4. Return to data page",
    actualResult: "Filters reset to default",
    expectedResult: "Filter settings should persist across sessions",
    featureTag: "Data Analysis",
    bugOrigin: "Development",
    testCaseId: "TC-DATA-147"
  },
];

export default sampleDefects;
