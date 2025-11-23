// src/lib/schema.ts
// This file defines the structure of our database table (like a blueprint)

import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

/**
 * The "links" table structure
 * This is where we store all the short URLs and their data
 */
export const links = pgTable('links', {
  // Primary key: Unique ID for each link (auto-increments: 1, 2, 3, etc.)
  id: serial('id').primaryKey(),
  
  // The short code (e.g., "abc123")
  // - varchar(8) means max 8 characters
  // - .notNull() means this field is required
  // - .unique() means no two links can have the same code
  code: varchar('code', { length: 8 }).notNull().unique(),
  
  // The original long URL we're shortening (e.g., "https://example.com/very/long/url")
  // - text allows unlimited length
  // - Database column name is "target_url" (snake_case)
  // - But we'll use "targetUrl" (camelCase) in our TypeScript code
  targetUrl: text('target_url').notNull(),
  
  // Counter for how many times this link has been clicked
  // - Starts at 0 by default
  // - We'll increment this every time someone visits the short URL
  totalClicks: integer('total_clicks').notNull().default(0),
  
  // Timestamp of the last time someone clicked this link
  // - Can be null (no clicks yet)
  // - We'll update this every time someone visits the short URL
  lastClickedAt: timestamp('last_clicked_at'),
  
  // When this link was created
  // - Automatically set to current time when the link is created
  // - .defaultNow() means "use the current timestamp"
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

/**
 * TypeScript type for a link (useful for type checking)
 * This lets TypeScript know what shape our link objects have
 */
export type Link = typeof links.$inferSelect;

/**
 * TypeScript type for creating a new link
 * This is what we need to provide when inserting a new link
 */
export type NewLink = typeof links.$inferInsert;