// src/types/index.ts
// This file contains TypeScript type definitions used throughout the app
// These types ensure we handle data consistently and catch errors at compile time

/**
 * Link Type
 * Represents a complete link record from the database
 * This matches the structure defined in src/lib/schema.ts
 */
export interface Link {
  id: number;                      // Unique identifier (auto-generated)
  code: string;                    // Short code (e.g., "abc123")
  targetUrl: string;               // Original long URL
  totalClicks: number;             // How many times this link was clicked
  lastClickedAt: Date | null;      // When it was last clicked (null if never clicked)
  createdAt: Date;                 // When the link was created
}

/**
 * CreateLinkRequest Type
 * Represents the data needed to create a new link
 * Used in POST /api/links endpoint
 */
export interface CreateLinkRequest {
  targetUrl: string;               // The long URL to shorten (REQUIRED)
  customCode?: string;             // Optional custom short code (if not provided, auto-generate)
}

/**
 * CreateLinkResponse Type
 * What the API returns when a link is successfully created
 * HTTP Status: 201 Created
 */
export interface CreateLinkResponse {
  id: number;
  code: string;
  targetUrl: string;
  totalClicks: number;
  lastClickedAt: string | null;   // ISO 8601 date string (or null)
  createdAt: string;               // ISO 8601 date string
}

/**
 * ErrorResponse Type
 * Standard error response format for all API errors
 * Used for 400, 404, 409, 500 errors
 */
export interface ErrorResponse {
  error: string;                   // Human-readable error message
  details?: string;                // Optional additional details
}

/**
 * LinkListResponse Type
 * What GET /api/links returns
 * An array of all links in the database
 */
export type LinkListResponse = CreateLinkResponse[];

/**
 * ValidationResult Type
 * Used by validation functions to indicate success or failure
 */
export interface ValidationResult {
  valid: boolean;                  // Is the input valid?
  error?: string;                  // If invalid, what's the error message?
}

/**
 * Helper Type: Convert database Date objects to ISO strings for API responses
 * This is useful when preparing data to send as JSON
 */
export type SerializedLink = Omit<Link, 'createdAt' | 'lastClickedAt'> & {
  createdAt: string;
  lastClickedAt: string | null;
};