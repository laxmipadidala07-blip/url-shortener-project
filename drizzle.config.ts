// drizzle.config.ts
// This file tells Drizzle ORM how to connect to our database and where to find our schema

import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local file
// This is needed because drizzle-kit doesn't automatically load .env.local
dotenv.config({ path: '.env.local' });

export default defineConfig({
  // Where our database schema is defined (table structure)
  schema: './src/lib/schema.ts',
  
  // Where Drizzle will save migration files (SQL commands to create/update tables)
  out: './drizzle/migrations',
  
  // What type of database we're using (PostgreSQL in our case)
  dialect: 'postgresql',
  
  // Connection details for the database
  dbCredentials: {
    // Read the database URL from environment variables (.env.local file)
    // The ! tells TypeScript "this will definitely exist, trust me"
    url: process.env.DATABASE_URL!,
  },
});