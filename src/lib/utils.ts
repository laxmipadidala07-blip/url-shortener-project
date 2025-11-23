// src/lib/utils.ts
// This file contains utility functions used throughout the application

import { customAlphabet } from 'nanoid';
import type { Link, SerializedLink } from '@/types';

/**
 * Generate a Random Short Code
 * 
 * Creates a unique 6-character code using only alphanumeric characters
 * This is used when the user doesn't provide a custom code
 * 
 * The alphabet: A-Z, a-z, 0-9 (62 possible characters)
 * With 6 characters: 62^6 = 56,800,235,584 possible combinations
 * This makes collisions extremely unlikely!
 * 
 * Examples of generated codes:
 * - "aB3xYz"
 * - "K9mN2p"
 * - "Qr7sT1"
 * 
 * @returns A random 6-character alphanumeric string
 */
export function generateShortCode(): string {
  // Define our custom alphabet (same as assignment spec: [A-Za-z0-9])
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
  // Create a nanoid generator with our custom alphabet
  // The second parameter (6) is the length of the generated code
  const nanoid = customAlphabet(alphabet, 6);
  
  // Generate and return the code
  return nanoid();
}

/**
 * Generate Short Code with Collision Retry
 * 
 * Attempts to generate a unique code with retry logic
 * If a collision is detected, it will try again (up to maxAttempts times)
 * 
 * This function is used in the API when creating links without custom codes
 * 
 * @param checkExists - Async function that checks if a code already exists in DB
 * @param maxAttempts - Maximum number of generation attempts (default: 3)
 * @returns A unique short code, or null if max attempts exceeded
 * 
 * Usage example:
 * const code = await generateUniqueShortCode(async (code) => {
 *   const existing = await db.select().from(links).where(eq(links.code, code));
 *   return existing.length > 0;
 * });
 */
export async function generateUniqueShortCode(
  checkExists: (code: string) => Promise<boolean>,
  maxAttempts: number = 3
): Promise<string | null> {
  // Try up to maxAttempts times
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    // Generate a random code
    const code = generateShortCode();
    
    // Check if this code already exists
    const exists = await checkExists(code);
    
    // If it doesn't exist, we found a unique code!
    if (!exists) {
      return code;
    }
    
    // If we get here, there was a collision (very rare!)
    // Log it for debugging purposes
    console.warn(`Short code collision detected: ${code} (attempt ${attempt}/${maxAttempts})`);
  }
  
  // If we exhausted all attempts, return null
  // The caller should handle this by returning an error to the user
  console.error(`Failed to generate unique short code after ${maxAttempts} attempts`);
  return null;
}

/**
 * Serialize Link for API Response
 * 
 * Converts a Link object from the database into a format suitable for JSON responses
 * 
 * Main changes:
 * - Converts Date objects to ISO 8601 strings (e.g., "2025-01-15T10:30:00.000Z")
 * - Handles null values for lastClickedAt
 * 
 * Why? JSON doesn't support Date objects directly, so we convert to strings
 * 
 * @param link - Link object from the database
 * @returns SerializedLink object ready for JSON.stringify()
 * 
 * Example:
 * Input:  { id: 1, code: "abc123", ..., createdAt: Date object }
 * Output: { id: 1, code: "abc123", ..., createdAt: "2025-01-15T10:30:00.000Z" }
 */
export function serializeLink(link: Link): SerializedLink {
  return {
    id: link.id,
    code: link.code,
    targetUrl: link.targetUrl,
    totalClicks: link.totalClicks,
    // Convert Date to ISO string, or keep as null if never clicked
    lastClickedAt: link.lastClickedAt ? link.lastClickedAt.toISOString() : null,
    // Convert Date to ISO string
    createdAt: link.createdAt.toISOString(),
  };
}

/**
 * Serialize Multiple Links
 * 
 * Converts an array of Link objects for API responses
 * This is a convenience function that maps serializeLink over an array
 * 
 * @param links - Array of Link objects from the database
 * @returns Array of SerializedLink objects
 */
export function serializeLinks(links: Link[]): SerializedLink[] {
  return links.map(serializeLink);
}

/**
 * Get Base URL
 * 
 * Returns the base URL of the application for generating short URLs
 * 
 * In development: http://localhost:3000
 * In production: https://your-app.railway.app (from env var)
 * 
 * @returns The base URL (without trailing slash)
 * 
 * Usage:
 * const shortUrl = `${getBaseUrl()}/${code}`;
 * // Result: "http://localhost:3000/abc123"
 */
export function getBaseUrl(): string {
  // Try to get from environment variable first (set in production)
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }
  
  // Fallback for development
  return 'http://localhost:3000';
}

/**
 * Format Relative Time
 * 
 * Converts a date to a human-readable relative time string
 * 
 * Examples:
 * - "2 minutes ago"
 * - "3 hours ago"
 * - "5 days ago"
 * - "Never" (if date is null)
 * 
 * @param date - The date to format (or null)
 * @returns Human-readable time string
 * 
 * Note: This is a simple implementation. In Phase 5, we might use date-fns for better formatting
 */
export function formatRelativeTime(date: Date | string | null): string {
  if (!date) {
    return 'Never';
  }
  
  // Convert string to Date if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Calculate seconds since the date
  const seconds = Math.floor((Date.now() - dateObj.getTime()) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return 'Just now';
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  
  // Days
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  
  // Months
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  
  // Years
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

/**
 * Truncate URL
 * 
 * Shortens a long URL for display purposes
 * 
 * @param url - The URL to truncate
 * @param maxLength - Maximum length before truncating (default: 50)
 * @returns Truncated URL with "..." if too long
 * 
 * Examples:
 * - "https://google.com" → "https://google.com" (no change)
 * - "https://example.com/very/long/path..." → "https://example.com/very/long/path/that/goes/o..."
 */
export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) {
    return url;
  }
  
  return url.substring(0, maxLength) + '...';
}