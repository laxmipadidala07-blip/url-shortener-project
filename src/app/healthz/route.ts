// src/app/healthz/route.ts
// This is our health check endpoint
// Automated tests and monitoring tools will call this to check if our app is running

import { NextResponse } from 'next/server';

/**
 * GET /healthz
 * 
 * This endpoint simply returns a success message to prove the app is alive
 * 
 * IMPORTANT: This MUST return exactly this format for automated tests:
 * { "ok": true, "version": "1.0" }
 * 
 * Status code: 200 (success)
 * 
 * Example test:
 * curl http://localhost:3000/healthz
 * 
 * Expected response:
 * {"ok":true,"version":"1.0"}
 */
export async function GET() {
  // Return a JSON response with status 200
  return NextResponse.json(
    {
      ok: true,        // Indicates the server is healthy
      version: '1.0',  // Version number (required by spec)
    },
    {
      status: 200,     // HTTP status code (OK)
    }
  );
}

/**
 * Why do we need this endpoint?
 * 
 * 1. Automated tests will check if this returns 200
 * 2. Deployment platforms (like Railway) can use this to know if the app started successfully
 * 3. Monitoring tools can ping this endpoint to detect downtime
 * 4. Load balancers can check this before sending traffic to the server
 */