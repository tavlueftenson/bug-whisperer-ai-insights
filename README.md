
# Bug Whisperer AI - Defect Analysis Tool

A powerful web application that analyzes software defects/bugs and provides AI-generated insights for process improvement and quality enhancement.

## Features

- **Defect Log Upload**: Upload TXT or CSV files containing structured defect data
- **Intelligent Parsing**: Automatically extracts defect information from various formats
- **AI-Powered Analysis**: Identifies patterns, root causes, and metrics from defect data
- **Visual Insights**: Interactive charts and visualizations of defect distribution
- **Actionable Recommendations**: AI-generated suggestions for:
  - Process improvements
  - Test coverage enhancements
  - Training needs

## Data Format

The application expects defect logs with the following information:

1. **Subject**: Brief description of the defect
2. **Description**: Detailed explanation of the issue
3. **Steps to Reproduce**: Instructions to recreate the defect
4. **Actual Result**: What happens when the defect occurs
5. **Expected Result**: What should happen instead
6. **Feature Tag**: The feature/component affected
7. **Bug Origin Tag**: Environment where the defect was found (Production, UAT, etc.)
8. **Test Case ID**: Reference to related test case

## How to Use

1. **Upload Your Defect Log**:
   - Click "Upload" and select your TXT or CSV file
   - Alternatively, use the "Use Sample Data" button for a demo

2. **Review Extracted Defects**:
   - Verify the defect data was parsed correctly
   - View a tabular representation of your defects

3. **Generate AI Analysis**:
   - Click "Analyze" to process your defect data
   - Wait for the AI to generate insights (typically a few seconds)

4. **Explore Insights**:
   - View key metrics like rework rate, bug bounce rate, and bad fix rate
   - Examine root cause analysis and distribution charts
   - Review AI-generated recommendations

## Technical Details

This application is built with:

- **React**: Frontend framework
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **shadcn/ui**: Component library
- **Recharts**: Data visualization library

The AI analysis is performed locally through pattern matching and statistical analysis of defect patterns. In a production environment, this could be connected to more sophisticated AI services.

## Development

To run the application locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## License

Copyright © 2025 Bug Whisperer AI - All rights reserved
