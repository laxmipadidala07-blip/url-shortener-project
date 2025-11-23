// src/app/[code]/route.ts
// This file handles the redirect logic for short URLs
// When someone visits /:code, this redirects them to the target URL

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { links } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';

/**
 * GET /:code
 * 
 * Redirects to the target URL and tracks the click
 * 
 * Example: GET /abc123
 * 
 * Success Response (302):
 * - Redirects to the target URL
 * - Increments totalClicks by 1
 * - Updates lastClickedAt to current timestamp
 * 
 * Error Response (404):
 * - Returns 404 if code doesn't exist
 * 
 * IMPORTANT: This route must NOT conflict with:
 * - /api/* (API routes)
 * - /code/* (stats pages)
 * - /healthz (health check)
 * 
 * Next.js App Router automatically prioritizes specific routes,
 * so this dynamic route only matches if no other route matches.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    // Step 1: Extract the code from the URL
    // Next.js 15+ requires awaiting params
    const { code } = await params;

    // Step 2: Query the database for this code
    const link = await db
      .select()
      .from(links)
      .where(eq(links.code, code))
      .limit(1);

    // Step 3: Check if the link exists
    if (link.length === 0) {
      // Link not found - return 404
      return new Response('Not Found', { status: 404 });
    }

    // Step 4: Update click statistics atomically
    // IMPORTANT: We use SQL expressions to ensure atomic updates
    // This prevents race conditions when multiple users click simultaneously
    await db
      .update(links)
      .set({
        // Increment totalClicks by 1 using SQL expression
        // This ensures the increment happens atomically in the database
        totalClicks: sql`${links.totalClicks} + 1`,
        // Update lastClickedAt to current timestamp
        lastClickedAt: new Date(),
      })
      .where(eq(links.code, code));

    // Step 5: Redirect to the target URL with 302 (temporary redirect)
    // Using NextResponse.redirect for proper Next.js handling
    return NextResponse.redirect(link[0].targetUrl, { status: 302 });

  } catch (error) {
    // Log the error for debugging
    console.error('Error handling redirect:', error);

    // Return generic 500 error
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * Why we use atomic SQL increment:
 * 
 * ❌ WRONG WAY (race condition):
 * const link = await db.select()...;
 * const newCount = link.totalClicks + 1;
 * await db.update().set({ totalClicks: newCount });
 * 
 * Problem: If two users click simultaneously:
 * - User 1 reads totalClicks = 5
 * - User 2 reads totalClicks = 5
 * - User 1 writes totalClicks = 6
 * - User 2 writes totalClicks = 6
 * - Result: Only counted 1 click instead of 2!
 * 
 * ✅ CORRECT WAY (atomic increment):
 * await db.update().set({ totalClicks: sql`${links.totalClicks} + 1` });
 * 
 * This tells the database: "increment the value by 1"
 * The database handles this atomically, preventing race conditions
 * 
 * Result: Both clicks are counted correctly
 */