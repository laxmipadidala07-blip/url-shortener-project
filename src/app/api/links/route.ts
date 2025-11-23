// src/app/api/links/route.ts
// This file handles two API endpoints:
// - POST /api/links: Create a new short link
// - GET /api/links: Get all links

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { validateCreateLinkRequest } from '@/lib/validation';
import { generateUniqueShortCode, serializeLinks } from '@/lib/utils';
import { eq } from 'drizzle-orm';
import type { CreateLinkRequest } from '@/types';

/**
 * POST /api/links
 * 
 * Creates a new short link
 * 
 * Request Body:
 * {
 *   "targetUrl": "https://example.com",
 *   "customCode": "abc123"  // Optional
 * }
 * 
 * Success Response (201):
 * {
 *   "id": 1,
 *   "code": "abc123",
 *   "targetUrl": "https://example.com",
 *   "totalClicks": 0,
 *   "lastClickedAt": null,
 *   "createdAt": "2025-01-15T10:30:00.000Z"
 * }
 * 
 * Error Responses:
 * - 400: Invalid URL or code format
 * - 409: Code already exists (duplicate)
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse the JSON body from the request
    const body: CreateLinkRequest = await request.json();
    const { targetUrl, customCode } = body;

    // Step 2: Validate the request (URL format, code format if provided)
    const validation = validateCreateLinkRequest(targetUrl, customCode);
    if (!validation.valid) {
      // Return 400 Bad Request with the validation error message
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Step 3: Determine the code to use
    let codeToUse: string;

    if (customCode) {
      // User provided a custom code - check if it already exists
      const existingLink = await db
        .select()
        .from(links)
        .where(eq(links.code, customCode))
        .limit(1);

      if (existingLink.length > 0) {
        // Code already exists! Return 409 Conflict
        // This is REQUIRED by the automated tests
        return NextResponse.json(
          { error: 'Code already exists' },
          { status: 409 }
        );
      }

      codeToUse = customCode;
    } else {
      // No custom code provided - generate a random one
      // This function will retry if there's a collision (very unlikely)
      const generatedCode = await generateUniqueShortCode(async (code) => {
        const existing = await db
          .select()
          .from(links)
          .where(eq(links.code, code))
          .limit(1);
        return existing.length > 0;
      });

      if (!generatedCode) {
        // Failed to generate a unique code after multiple attempts
        return NextResponse.json(
          { error: 'Failed to generate unique code. Please try again.' },
          { status: 500 }
        );
      }

      codeToUse = generatedCode;
    }

    // Step 4: Insert the new link into the database
    const newLink = await db
      .insert(links)
      .values({
        code: codeToUse,
        targetUrl: targetUrl,
        totalClicks: 0,
        lastClickedAt: null,
        // createdAt will be set automatically by the database (defaultNow())
      })
      .returning(); // Returns the inserted row

    // Step 5: Format the response
    // Convert Date objects to ISO strings for JSON serialization
    const link = newLink[0];
    const response = {
      id: link.id,
      code: link.code,
      targetUrl: link.targetUrl,
      totalClicks: link.totalClicks,
      lastClickedAt: link.lastClickedAt ? link.lastClickedAt.toISOString() : null,
      createdAt: link.createdAt.toISOString(),
    };

    // Step 6: Return success response with 201 Created status
    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    // Log the error for debugging
    console.error('Error creating link:', error);

    // Check if it's a database unique constraint violation
    // (This shouldn't happen due to our checks above, but just in case)
    if (error instanceof Error && error.message.includes('unique')) {
      return NextResponse.json(
        { error: 'Code already exists' },
        { status: 409 }
      );
    }

    // Return generic 500 error for any other issues
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/links
 * 
 * Retrieves all links from the database
 * 
 * Success Response (200):
 * [
 *   {
 *     "id": 1,
 *     "code": "abc123",
 *     "targetUrl": "https://example.com",
 *     "totalClicks": 5,
 *     "lastClickedAt": "2025-01-15T12:00:00.000Z",
 *     "createdAt": "2025-01-15T10:30:00.000Z"
 *   },
 *   {
 *     "id": 2,
 *     "code": "xyz789",
 *     ...
 *   }
 * ]
 * 
 * Note: Returns empty array [] if no links exist
 */
export async function GET() {
  try {
    // Step 1: Query all links from the database
    // Order by most recently created first (newest on top)
    const allLinks = await db
      .select()
      .from(links)
      .orderBy(links.createdAt); // You can change to .orderBy(desc(links.createdAt)) for reverse order

    // Step 2: Convert Date objects to ISO strings for JSON
    const serializedLinks = serializeLinks(allLinks);

    // Step 3: Return the array of links with 200 OK status
    return NextResponse.json(serializedLinks, { status: 200 });

  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching links:', error);

    // Return generic 500 error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}