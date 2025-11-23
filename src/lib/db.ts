// src/lib/db.ts
// This file creates a connection to our Neon PostgreSQL database

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

/**
 * Step 1: Create a SQL client using Neon's serverless driver
 * 
 * The neon() function creates a connection to our database
 * It reads the DATABASE_URL from our .env.local file
 * 
 * Example DATABASE_URL format:
 * postgresql://username:password@host.region.aws.neon.tech/database?sslmode=require
 */
const sql = neon(process.env.DATABASE_URL!);

/**
 * Step 2: Create a Drizzle ORM client
 * 
 * This wraps our SQL client and gives us nice TypeScript methods
 * to query the database (instead of writing raw SQL)
 * 
 * We pass in our schema so Drizzle knows about our tables
 */
export const db = drizzle(sql, { schema });

/**
 * How to use this in other files:
 * 
 * import { db } from '@/lib/db';
 * import { links } from '@/lib/schema';
 * 
 * // Get all links
 * const allLinks = await db.select().from(links);
 * 
 * // Insert a new link
 * await db.insert(links).values({ code: 'abc123', targetUrl: 'https://google.com' });
 * 
 * // Update a link
 * await db.update(links).set({ totalClicks: 5 }).where(eq(links.code, 'abc123'));
 * 
 * // Delete a link
 * await db.delete(links).where(eq(links.code, 'abc123'));
 */