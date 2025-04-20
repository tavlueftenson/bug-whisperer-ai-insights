
/**
 * CSV Parser utility specifically designed to handle Python-generated CSVs with quote_all=True
 * Handles quoted fields, escaped quotes, and properly preserves commas within quoted fields
 */

export interface CSVParseOptions {
  hasHeader?: boolean;
  delimiter?: string;
  quoteChar?: string;
}

export type CSVRow = string[];

/**
 * Parses a CSV string into an array of rows (arrays of string values)
 * Properly handles quoted fields and escaped quotes
 */
export function parseCSV(csvText: string, options: CSVParseOptions = {}): CSVRow[] {
  // Default options
  const delimiter = options.delimiter || ',';
  const quoteChar = options.quoteChar || '"';
  const hasHeader = options.hasHeader !== false; // Default to true
  
  // Guard against empty input
  if (!csvText || !csvText.trim()) {
    return [];
  }
  
  // Split by line breaks (handle both \r\n and \n)
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) {
    return [];
  }
  
  // Parse each row
  const rows = lines.map(line => parseCSVRow(line, delimiter, quoteChar));
  
  // Return results with or without header
  return hasHeader ? rows : rows;
}

/**
 * Parse a single CSV row string into an array of field values
 * Handles quoted fields and escaped quotes (like double quotes in Python CSV)
 */
export function parseCSVRow(row: string, delimiter = ',', quoteChar = '"'): string[] {
  // Guard against empty rows
  if (!row || !row.trim()) {
    return [];
  }
  
  const result: string[] = [];
  let inQuotes = false;
  let currentValue = '';
  let i = 0;
  
  while (i < row.length) {
    const char = row[i];
    
    // Handle quote character
    if (char === quoteChar) {
      // Check if this is an escaped quote (represented as double quote) inside a quoted field
      if (i + 1 < row.length && row[i + 1] === quoteChar && inQuotes) {
        currentValue += quoteChar; // Add a single quote to the value
        i += 2; // Skip both quotes
        continue;
      }
      
      // Toggle quote state
      inQuotes = !inQuotes;
      i++; // Move to next character
      continue;
    }
    
    // Handle delimiter (comma) - but only if we're not inside quotes
    if (char === delimiter && !inQuotes) {
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
}

/**
 * Find the index of a header column by checking for various possible names
 * Returns -1 if not found
 */
export function findHeaderIndex(headers: string[], possibleNames: string[]): number {
  return headers.findIndex(header => 
    possibleNames.some(name => 
      header.toLowerCase().includes(name.toLowerCase())
    )
  );
}

/**
 * Extract header mappings for defect data from CSV headers
 */
export function extractDefectHeaderMappings(headers: string[]) {
  return {
    subjectIndex: findHeaderIndex(headers, ['subject', 'title', 'summary', 'issue', 'bug']),
    descIndex: findHeaderIndex(headers, ['description', 'desc', 'details', 'summary']),
    stepsIndex: findHeaderIndex(headers, ['steps', 'reproduce', 'reproduction', 'how to']),
    actualIndex: findHeaderIndex(headers, ['actual', 'result', 'observed', 'outcome']),
    expectedIndex: findHeaderIndex(headers, ['expected', 'should', 'desired']),
    featureIndex: findHeaderIndex(headers, ['feature', 'module', 'component', 'area', 'func']),
    originIndex: findHeaderIndex(headers, ['origin', 'environment', 'env', 'found in', 'source']),
    testCaseIndex: findHeaderIndex(headers, ['test', 'case', 'tc', 'testcase'])
  };
}
