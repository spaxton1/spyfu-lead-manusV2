/**
 * CSV Parser for Lead Intelligence Platform
 * Handles flexible CSV formats with smart website detection
 */

import Papa from 'papaparse';
import type { ParsedLead, CsvParseResult } from '../types/database';

/**
 * Detect which CSV column contains the website/domain
 * @param headers - Array of CSV header names
 * @returns Name of the website column, or null if not found
 */
export function detectWebsiteColumn(headers: string[]): string | null {
  // Exact matches (case-insensitive)
  const exactMatches = [
    'website',
    'domain',
    'url',
    'web site',
    'web_site',
    'company website',
    'company_website',
    'company url',
    'company_url',
    'web address',
    'web_address',
    'site url',
    'site_url',
  ];

  // Convert headers to lowercase for comparison
  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  // Try exact matches first
  for (const match of exactMatches) {
    const index = lowerHeaders.indexOf(match);
    if (index !== -1) {
      return headers[index]; // Return original casing
    }
  }

  // Try partial matches (contains "website", "domain", or "url")
  for (let i = 0; i < lowerHeaders.length; i++) {
    const header = lowerHeaders[i];
    if (
      header.includes('website') ||
      header.includes('domain') ||
      (header.includes('url') &&
        !header.includes('linkedin') &&
        !header.includes('person'))
    ) {
      return headers[i];
    }
  }

  return null; // No website column found
}

/**
 * Validate and clean website URL
 * @param url - Raw URL from CSV
 * @returns Cleaned domain, or null if invalid
 */
export function cleanWebsiteUrl(url: string): string | null {
  if (!url || url.trim() === '') return null;

  // Skip LinkedIn URLs (common in Person Linkedin Url field)
  if (url.includes('linkedin.com')) return null;

  let cleaned = url.trim();

  // Add https:// if no protocol
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }

  try {
    const urlObj = new URL(cleaned);
    // Return just the hostname (domain)
    return urlObj.hostname.replace(/^www\./, '');
  } catch (e) {
    console.warn(`Invalid URL: ${url}`);
    return null;
  }
}

/**
 * Detect possible phone number columns
 */
function detectPhoneColumn(headers: string[]): string | null {
  const phonePatterns = [
    'phone',
    'mobile',
    'cell',
    'work phone',
    'direct phone',
    'corporate phone',
    'company phone',
  ];

  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  for (const pattern of phonePatterns) {
    for (let i = 0; i < lowerHeaders.length; i++) {
      if (lowerHeaders[i].includes(pattern)) {
        return headers[i];
      }
    }
  }

  return null;
}

/**
 * Detect company name column
 */
function detectCompanyColumn(headers: string[]): string | null {
  const companyPatterns = ['company', 'company name', 'business', 'organization'];

  const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

  for (const pattern of companyPatterns) {
    const index = lowerHeaders.indexOf(pattern);
    if (index !== -1) {
      return headers[index];
    }
  }

  return null;
}

/**
 * Parse CSV file and extract leads with smart column detection
 * @param file - File object or string content
 * @returns Promise with parsed leads
 */
export async function parseLeadsCsv(
  file: File | string
): Promise<CsvParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const headers = results.meta.fields || [];
        const errors: string[] = [];

        // Detect website column
        const websiteColumn = detectWebsiteColumn(headers);
        if (!websiteColumn) {
          reject(
            new Error(
              'Could not detect website column in CSV. Expected columns like: Website, Domain, URL, Company Website'
            )
          );
          return;
        }

        // Detect other columns
        const phoneColumn = detectPhoneColumn(headers);
        const companyColumn = detectCompanyColumn(headers);

        // Parse leads
        const leads: ParsedLead[] = [];
        for (const [index, row] of results.data.entries()) {
          const rowData = row as Record<string, any>;

          // Extract and clean website
          const domain = cleanWebsiteUrl(rowData[websiteColumn]);
          if (!domain) {
            errors.push(
              `Row ${index + 2}: Invalid or missing website URL: ${rowData[websiteColumn]}`
            );
            continue; // Skip rows without valid website
          }

          // Extract other fields with flexible column detection
          const lead: ParsedLead = {
            domain: domain,
            company: rowData[companyColumn || 'Company Name'] || rowData['company_name'] || rowData['Company'] || '',
            firstName: rowData['First Name'] || rowData['first_name'] || rowData['FirstName'] || '',
            lastName: rowData['Last Name'] || rowData['last_name'] || rowData['LastName'] || '',
            email: rowData['Email'] || rowData['email'] || rowData['E-mail'] || '',
            phone: phoneColumn ? rowData[phoneColumn] : (rowData['Phone'] || rowData['phone'] || ''),
            originalData: rowData,
          };

          leads.push(lead);
        }

        resolve({
          leads: leads,
          totalRows: results.data.length,
          validLeads: leads.length,
          websiteColumn: websiteColumn,
          errors: errors,
        });
      },
      error: (error) => reject(new Error(`CSV parsing error: ${error.message}`)),
    });
  });
}

/**
 * Validate CSV file before upload
 * @param file - File to validate
 * @returns Validation result
 */
export async function validateCsvFile(file: File): Promise<{
  valid: boolean;
  error?: string;
  preview?: ParsedLead[];
}> {
  // Check file type
  if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
    return {
      valid: false,
      error: 'File must be a CSV file (.csv)',
    };
  }

  // Check file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return {
      valid: false,
      error: 'File size must be less than 10MB',
    };
  }

  try {
    // Parse first 5 rows for preview
    const result = await parseLeadsCsv(file);

    if (result.validLeads === 0) {
      return {
        valid: false,
        error: 'No valid leads found. Please check website column format.',
      };
    }

    return {
      valid: true,
      preview: result.leads.slice(0, 5),
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing CSV',
    };
  }
}
