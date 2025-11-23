// src/lib/validation.ts
// This file contains validation functions for URLs and short codes
// These ensure data quality before saving to the database

import validator from 'validator';
import type { ValidationResult } from '@/types';

/**
 * Validate URL Format
 * 
 * Checks if a string is a valid URL with proper protocol
 * 
 * Requirements:
 * - Must be a valid URL format
 * - Must start with http:// or https://
 * - Must have a valid domain
 * 
 * @param url - The URL string to validate
 * @returns ValidationResult object with valid flag and optional error message
 * 
 * Examples:
 * ✅ "https://google.com" → valid
 * ✅ "http://example.com/path?query=1" → valid
 * ❌ "google.com" → invalid (no protocol)
 * ❌ "not a url" → invalid
 * ❌ "" → invalid (empty)
 */
export function validateUrl(url: string): ValidationResult {
  // Check if URL is empty or just whitespace
  if (!url || url.trim().length === 0) {
    return {
      valid: false,
      error: 'URL is required',
    };
  }

  // Use validator library to check URL format
  // Options:
  // - protocols: only allow http and https
  // - require_protocol: must have http:// or https://
  // - require_valid_protocol: protocol must be in the allowed list
  const isValidUrl = validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true,
    require_valid_protocol: true,
  });

  if (!isValidUrl) {
    return {
      valid: false,
      error: 'Invalid URL format. Must start with http:// or https://',
    };
  }

  // Additional check: URL shouldn't be too long (most browsers have limits)
  if (url.length > 2048) {
    return {
      valid: false,
      error: 'URL is too long (max 2048 characters)',
    };
  }

  // All checks passed!
  return {
    valid: true,
  };
}

/**
 * Validate Short Code Format
 * 
 * Checks if a short code follows the required format
 * 
 * Requirements (from assignment spec):
 * - Must be 6-8 characters long
 * - Can only contain: A-Z, a-z, 0-9 (alphanumeric)
 * - No special characters, spaces, or Unicode
 * 
 * Regex explanation: /^[A-Za-z0-9]{6,8}$/
 * - ^ = start of string
 * - [A-Za-z0-9] = any letter (upper/lower) or number
 * - {6,8} = exactly 6 to 8 characters
 * - $ = end of string
 * 
 * @param code - The short code to validate
 * @returns ValidationResult object with valid flag and optional error message
 * 
 * Examples:
 * ✅ "abc123" → valid (6 chars, alphanumeric)
 * ✅ "Test01" → valid (6 chars, mixed case)
 * ✅ "MyLink99" → valid (8 chars)
 * ❌ "ab12" → invalid (only 4 chars, minimum is 6)
 * ❌ "toolongcode" → invalid (11 chars, maximum is 8)
 * ❌ "abc-123" → invalid (contains hyphen)
 * ❌ "abc 123" → invalid (contains space)
 */
export function validateCode(code: string): ValidationResult {
  // Check if code is empty or just whitespace
  if (!code || code.trim().length === 0) {
    return {
      valid: false,
      error: 'Code is required',
    };
  }

  // The regex pattern from the assignment specification
  const codeRegex = /^[A-Za-z0-9]{6,8}$/;

  if (!codeRegex.test(code)) {
    // Figure out what's wrong with the code to give a helpful error message
    if (code.length < 6) {
      return {
        valid: false,
        error: 'Code must be at least 6 characters long',
      };
    }

    if (code.length > 8) {
      return {
        valid: false,
        error: 'Code must be at most 8 characters long',
      };
    }

    // If length is OK but regex failed, must be invalid characters
    return {
      valid: false,
      error: 'Code can only contain letters (A-Z, a-z) and numbers (0-9)',
    };
  }

  // All checks passed!
  return {
    valid: true,
  };
}

/**
 * Validate Create Link Request
 * 
 * Validates the entire request body for creating a new link
 * This combines URL and code validation
 * 
 * @param targetUrl - The URL to shorten
 * @param customCode - Optional custom code (can be undefined)
 * @returns ValidationResult with specific error if validation fails
 */
export function validateCreateLinkRequest(
  targetUrl: string,
  customCode?: string
): ValidationResult {
  // First, validate the URL (required)
  const urlValidation = validateUrl(targetUrl);
  if (!urlValidation.valid) {
    return urlValidation;
  }

  // If a custom code is provided, validate it
  // (if not provided, we'll auto-generate one later)
  if (customCode) {
    const codeValidation = validateCode(customCode);
    if (!codeValidation.valid) {
      return codeValidation;
    }
  }

  // Everything is valid!
  return {
    valid: true,
  };
}