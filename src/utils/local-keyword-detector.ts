/**
 * Local Keyword Detection System
 * Detects if a keyword contains local identifiers (cities, states, ZIP codes)
 * Uses comprehensive 29,880 US cities database
 */

import citiesData from '../../us_cities_lookup.json';

// Type for city lookup
interface CitiesLookup {
  cities: {
    [key: string]: {
      state: string;
      stateName: string;
    };
  };
}

const citiesLookup = citiesData as CitiesLookup;

// US State full names
const US_STATES_FULL = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
  'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
  'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
  'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
  'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
  'new hampshire', 'new jersey', 'new mexico', 'new york',
  'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon',
  'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
  'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
  'west virginia', 'wisconsin', 'wyoming'
];

// US State abbreviations (excluding common words)
const US_STATES_ABBREV = [
  'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga',
  'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la', 'me', 'md',
  'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj',
  'nm', 'ny', 'nc', 'nd', 'oh', 'ok', 'or', 'pa', 'ri', 'sc',
  'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
];

// Common false positives to exclude
const FALSE_POSITIVES = [
  'near me',
  'near you',
  'local',
  'nearby',
  'city',
  'town',
  'area',
  'region'
];

// Geographic descriptors
const GEOGRAPHIC_DESCRIPTORS = [
  'north shore', 'south shore', 'east shore', 'west shore',
  'north side', 'south side', 'east side', 'west side',
  'north end', 'south end', 'east end', 'west end',
  'north coast', 'south coast', 'east coast', 'west coast',
  'downtown', 'uptown', 'midtown'
];

/**
 * Extract words from keyword for matching
 */
function extractWords(keyword: string): string[] {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 0);
}

/**
 * Check if keyword contains a ZIP code
 */
function hasZipCode(keyword: string): boolean {
  // Match 5-digit ZIP or ZIP+4 format
  const zipPattern = /\b\d{5}(?:-\d{4})?\b/;
  return zipPattern.test(keyword);
}

/**
 * Check if keyword contains a US state (full name)
 */
function hasStateName(keyword: string): boolean {
  const lowerKeyword = keyword.toLowerCase();
  
  for (const state of US_STATES_FULL) {
    // Use word boundaries to avoid partial matches
    const statePattern = new RegExp(`\\b${state}\\b`, 'i');
    if (statePattern.test(lowerKeyword)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if keyword contains a state abbreviation
 * Excludes common words like "in", "or", "me"
 */
function hasStateAbbreviation(keyword: string): boolean {
  const words = extractWords(keyword);
  
  // Exclude common false positives
  const excludeAbbrev = ['in', 'or', 'me', 'hi', 'ok', 'pa', 'ma'];
  
  for (const word of words) {
    if (US_STATES_ABBREV.includes(word) && !excludeAbbrev.includes(word)) {
      return true;
    }
    
    // Special handling for excluded ones - only match if standalone or after space
    if (excludeAbbrev.includes(word)) {
      const pattern = new RegExp(`\\s${word}\\b`, 'i');
      if (pattern.test(` ${keyword.toLowerCase()}`)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Check if keyword contains a geographic descriptor
 */
function hasGeographicDescriptor(keyword: string): boolean {
  const lowerKeyword = keyword.toLowerCase();
  
  for (const descriptor of GEOGRAPHIC_DESCRIPTORS) {
    if (lowerKeyword.includes(descriptor)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if keyword is a known false positive
 */
function isFalsePositive(keyword: string): boolean {
  const lowerKeyword = keyword.toLowerCase();
  
  for (const falsePos of FALSE_POSITIVES) {
    if (lowerKeyword.includes(falsePos)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if keyword contains a city name from database
 * Supports single-word, two-word, and three-word city names
 * Prioritizes multi-word cities to avoid false positives
 */
function hasCityName(keyword: string): boolean {
  const words = extractWords(keyword);
  
  // FIRST: Check three-word city names (most specific)
  for (let i = 0; i < words.length - 2; i++) {
    const threeWords = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
    if (citiesLookup.cities[threeWords]) {
      return true;
    }
  }
  
  // SECOND: Check two-word city names (e.g., "Beverly Hills", "Los Angeles")
  for (let i = 0; i < words.length - 1; i++) {
    const twoWords = `${words[i]} ${words[i + 1]}`;
    if (citiesLookup.cities[twoWords]) {
      return true;
    }
  }
  
  // THIRD: Check single-word cities (only well-known cities to reduce false positives)
  // Only match cities with population > 100k or very distinct names
  const wellKnownCities = [
    'chicago', 'houston', 'phoenix', 'philadelphia', 'antonio', 'diego', 'dallas',
    'jose', 'austin', 'jacksonville', 'columbus', 'charlotte', 'francisco',
    'indianapolis', 'seattle', 'denver', 'nashville', 'memphis', 'portland',
    'vegas', 'detroit', 'milwaukee', 'baltimore', 'atlanta', 'miami', 'oakland',
    'minneapolis', 'tulsa', 'cleveland', 'wichita', 'orleans', 'tampa', 'honolulu',
    'anaheim', 'louis', 'riverside', 'cincinnati', 'pittsburgh', 'sacramento',
    'orlando', 'brooklyn', 'manhattan', 'bronx', 'queens'
  ];
  
  for (const word of words) {
    if (wellKnownCities.includes(word) && citiesLookup.cities[word]) {
      return true;
    }
  }
  
  return false;
}

/**
 * Main function: Check if a keyword contains a local identifier
 * 
 * @param keyword - The keyword to check
 * @returns true if keyword is local, false otherwise
 * 
 * Detection priority:
 * 1. Exclude false positives ("near me", "local", etc.)
 * 2. Check for US state names
 * 3. Check for state abbreviations
 * 4. Check for ZIP codes
 * 5. Check for geographic descriptors
 * 6. Check against city database (29,880 cities)
 */
export function hasLocalIdentifier(keyword: string): boolean {
  if (!keyword || keyword.trim().length === 0) {
    return false;
  }
  
  // STEP 1: Exclude known false positives
  if (isFalsePositive(keyword)) {
    return false;
  }
  
  // STEP 2: Check for US State names (full names)
  if (hasStateName(keyword)) {
    return true;
  }
  
  // STEP 3: Check for state abbreviations (2-letter)
  if (hasStateAbbreviation(keyword)) {
    return true;
  }
  
  // STEP 4: Check for ZIP codes
  if (hasZipCode(keyword)) {
    return true;
  }
  
  // STEP 5: Check for geographic descriptors
  if (hasGeographicDescriptor(keyword)) {
    return true;
  }
  
  // STEP 6: Check against comprehensive city database
  if (hasCityName(keyword)) {
    return true;
  }
  
  return false;
}

/**
 * Get detailed information about why a keyword is considered local
 * Useful for debugging and displaying to users
 */
export function getLocalIdentifierInfo(keyword: string): {
  isLocal: boolean;
  reasons: string[];
  cityFound?: string;
  stateFound?: string;
} {
  const reasons: string[] = [];
  let cityFound: string | undefined;
  let stateFound: string | undefined;
  
  if (isFalsePositive(keyword)) {
    return { isLocal: false, reasons: ['False positive detected'] };
  }
  
  if (hasStateName(keyword)) {
    const lowerKeyword = keyword.toLowerCase();
    for (const state of US_STATES_FULL) {
      if (lowerKeyword.includes(state)) {
        stateFound = state;
        reasons.push(`Contains state name: ${state}`);
        break;
      }
    }
  }
  
  if (hasStateAbbreviation(keyword)) {
    reasons.push('Contains state abbreviation');
  }
  
  if (hasZipCode(keyword)) {
    const match = keyword.match(/\b\d{5}(?:-\d{4})?\b/);
    if (match) {
      reasons.push(`Contains ZIP code: ${match[0]}`);
    }
  }
  
  if (hasGeographicDescriptor(keyword)) {
    reasons.push('Contains geographic descriptor');
  }
  
  if (hasCityName(keyword)) {
    const words = extractWords(keyword);
    
    // Check three-word cities FIRST (most specific)
    for (let i = 0; i < words.length - 2; i++) {
      const threeWords = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (citiesLookup.cities[threeWords]) {
        cityFound = threeWords;
        stateFound = citiesLookup.cities[threeWords].stateName;
        reasons.push(`Contains city: ${threeWords}, ${stateFound}`);
        break;
      }
    }
    
    // Check two-word cities SECOND
    if (!cityFound) {
      for (let i = 0; i < words.length - 1; i++) {
        const twoWords = `${words[i]} ${words[i + 1]}`;
        if (citiesLookup.cities[twoWords]) {
          cityFound = twoWords;
          stateFound = citiesLookup.cities[twoWords].stateName;
          reasons.push(`Contains city: ${twoWords}, ${stateFound}`);
          break;
        }
      }
    }
    
    // Check single-word cities LAST (only well-known ones)
    if (!cityFound) {
      const wellKnownCities = [
        'chicago', 'houston', 'phoenix', 'philadelphia', 'antonio', 'diego', 'dallas',
        'jose', 'austin', 'jacksonville', 'columbus', 'charlotte', 'francisco',
        'indianapolis', 'seattle', 'denver', 'nashville', 'memphis', 'portland',
        'vegas', 'detroit', 'milwaukee', 'baltimore', 'atlanta', 'miami', 'oakland',
        'minneapolis', 'tulsa', 'cleveland', 'wichita', 'orleans', 'tampa', 'honolulu',
        'anaheim', 'louis', 'riverside', 'cincinnati', 'pittsburgh', 'sacramento',
        'orlando', 'brooklyn', 'manhattan', 'bronx', 'queens'
      ];
      
      for (const word of words) {
        if (wellKnownCities.includes(word) && citiesLookup.cities[word]) {
          cityFound = word;
          stateFound = citiesLookup.cities[word].stateName;
          reasons.push(`Contains city: ${word}, ${stateFound}`);
          break;
        }
      }
    }
  }
  
  return {
    isLocal: reasons.length > 0,
    reasons,
    cityFound,
    stateFound
  };
}

/**
 * Filter keywords to return only local keywords
 */
export function filterLocalKeywords(keywords: string[]): string[] {
  return keywords.filter(kw => hasLocalIdentifier(kw));
}

/**
 * Separate keywords into local and non-local
 */
export function separateLocalKeywords(keywords: string[]): {
  local: string[];
  nonLocal: string[];
} {
  const local: string[] = [];
  const nonLocal: string[] = [];
  
  for (const kw of keywords) {
    if (hasLocalIdentifier(kw)) {
      local.push(kw);
    } else {
      nonLocal.push(kw);
    }
  }
  
  return { local, nonLocal };
}
