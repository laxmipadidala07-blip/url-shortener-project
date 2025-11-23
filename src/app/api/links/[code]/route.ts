// src/app/api/links/[code]/route.ts
// This file handles two API endpoints for a specific link:
// - GET /api/links/:code: Get stats for a single link
// - DELETE /api/links/:code: Delete a link

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/links/:code
 * 
 * Gets detailed stats for a single link by its code
 * 
 * Example: GET /api/links/abc123
 * 
 * Success Response (200):
 * {
 *   "id": 1,
 *   "code": "abc123",
 *   "targetUrl": "https://example.com",
 *   "totalClicks": 5,
 *   "lastClickedAt": "2025-01-15T12:00:00.000Z",
 *   "createdAt": "2025-01-15T10:30:00.000Z"
 * }
 * 
 * Error Response (404):
 * {
 *   "error": "Link not found"
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Step 1: Extract the code from the URL
    // Next.js 15+ requires awaiting params
    const { code } = await params;

    // Step 2: Query the database for this specific code
    const link = await db
      .select()
      .from(links)
      .where(eq(links.code, code))
      .limit(1);

    // Step 3: Check if the link exists
    if (link.length === 0) {
      // Link not found - return 404
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Step 4: Format the response (convert Dates to ISO strings)
    const foundLink = link[0];
    const response = {
      id: foundLink.id,
      code: foundLink.code,
      targetUrl: foundLink.targetUrl,
      totalClicks: foundLink.totalClicks,
      lastClickedAt: foundLink.lastClickedAt 
        ? foundLink.lastClickedAt.toISOString() 
        : null,
      createdAt: foundLink.createdAt.toISOString(),
    };

    // Step 5: Return the link data with 200 OK
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    // Log the error for debugging
    console.error('Error fetching link:', error);

    // Return generic 500 error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/links/:code
 * 
 * Deletes a link by its code
 * 
 * Example: DELETE /api/links/abc123
 * 
 * Success Response (200):
 * {
 *   "message": "Link deleted successfully",
 *   "code": "abc123"
 * }
 * 
 * Error Response (404):
 * {
 *   "error": "Link not found"
 * }
 * 
 * IMPORTANT: After deletion, visiting /:code must return 404
 * (This will be tested in Phase 3)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Step 1: Extract the code from the URL
    // Next.js 15+ requires awaiting params
    const { code } = await params;

    // Step 2: Check if the link exists before attempting to delete
    const existingLink = await db
      .select()
      .from(links)
      .where(eq(links.code, code))
      .limit(1);

    if (existingLink.length === 0) {
      // Link doesn't exist - return 404
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    // Step 3: Delete the link from the database
    await db
      .delete(links)
      .where(eq(links.code, code));

    // Step 4: Return success message with 200 OK
    return NextResponse.json(
      {
        message: 'Link deleted successfully',
        code: code,
      },
      { status: 200 }
    );

  } catch (error) {
    // Log the error for debugging
    console.error('Error deleting link:', error);

    // Return generic 500 error
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Why we check existence before deleting:
 * 
 * The automated tests expect a 404 response when trying to delete
 * a non-existent link. Without the check, Drizzle would just delete
 * 0 rows and return success, which wouldn't match the test expectations.
 * 
 * This pattern (check, then delete) ensures we return the correct
 * status codes for both success (200) and not found (404) cases.
 */