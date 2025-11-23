#!/bin/bash

# TinyLink Project Structure Setup Script
# Run this from the project root: /mnt/f/dev-workspace/tinylink

echo "🚀 Setting up TinyLink project structure..."

# Create main directories
mkdir -p src/app/api/links/[code]
mkdir -p src/app/code/[code]
mkdir -p src/app/healthz
mkdir -p "src/app/[code]"
mkdir -p src/components
mkdir -p src/lib
mkdir -p src/types
mkdir -p drizzle/migrations

echo "✅ Directories created"

# Create placeholder files for src/lib
touch src/lib/db.ts
touch src/lib/schema.ts
touch src/lib/validation.ts
touch src/lib/utils.ts

echo "✅ Library files created"

# Create placeholder files for src/types
touch src/types/index.ts

echo "✅ Type definitions file created"

# Create placeholder files for src/components
touch src/components/Header.tsx
touch src/components/Footer.tsx
touch src/components/AddLinkForm.tsx
touch src/components/LinkTable.tsx
touch src/components/CopyButton.tsx

echo "✅ Component files created"

# Create API route files
touch src/app/api/links/route.ts
touch src/app/api/links/[code]/route.ts

echo "✅ API route files created"

# Create page files
touch src/app/layout.tsx
touch src/app/page.tsx
touch src/app/code/[code]/page.tsx
touch "src/app/[code]/route.ts"

echo "✅ Page files created"

# Create health check route
touch src/app/healthz/route.ts

echo "✅ Health check route created"

# Create Drizzle config
touch drizzle.config.ts

echo "✅ Drizzle config file created"

# Create environment file examples
cat > .env.example << 'EOF'
# Database Connection
DATABASE_URL=postgresql://user:password@host:port/database

# Application URL (for generating short links)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
EOF

echo "✅ .env.example created"

# Create .env.local template (user will need to fill this)
cat > .env.local << 'EOF'
# IMPORTANT: Replace with your actual Neon database URL
DATABASE_URL=your_neon_database_url_here

# Local development URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
EOF

echo "✅ .env.local template created"

# Update .gitignore to ensure sensitive files are ignored
cat >> .gitignore << 'EOF'

# Environment variables
.env.local
.env*.local

# Database
drizzle/migrations/*.sql
EOF

echo "✅ .gitignore updated"

# Create a detailed README
cat > IMPLEMENTATION_PLAN.md << 'EOF'
# TinyLink Implementation Plan - Phase by Phase

## Project Status Tracker
- [ ] Phase 1: Database Setup & Health Check (FOUNDATION)
- [ ] Phase 2: API Endpoints (BACKEND)
- [ ] Phase 3: Redirect Logic (CORE FEATURE)
- [ ] Phase 4: UI Components & Pages (FRONTEND)
- [ ] Phase 5: Polish & Deploy (FINALIZATION)

---

## PHASE 1: Database Setup & Health Check (FOUNDATION)
**Goal:** Get database connected, schema created, and health endpoint working

### Files to implement:
1. `drizzle.config.ts` - Drizzle configuration
2. `src/lib/schema.ts` - Database schema definition
3. `src/lib/db.ts` - Database connection
4. `src/app/healthz/route.ts` - Health check endpoint
5. `src/app/layout.tsx` - Root layout with basic header/footer
6. Update `package.json` scripts

### Success Criteria:
- ✅ Database connection established
- ✅ `links` table created with correct schema
- ✅ `GET /healthz` returns `{"ok": true, "version": "1.0"}`
- ✅ Can run `pnpm db:migrate` successfully
- ✅ Basic layout renders

### Commands to run:
```bash
pnpm db:push  # Push schema to database
pnpm dev      # Start dev server
curl http://localhost:3000/healthz  # Test health endpoint
```

---

## PHASE 2: API Endpoints (BACKEND)
**Goal:** All CRUD API endpoints working with proper validation and error handling

### Files to implement:
1. `src/lib/validation.ts` - URL and code validation functions
2. `src/lib/utils.ts` - Helper functions (code generation, etc.)
3. `src/types/index.ts` - TypeScript interfaces
4. `src/app/api/links/route.ts` - POST & GET /api/links
5. `src/app/api/links/[code]/route.ts` - GET & DELETE /api/links/:code

### Success Criteria:
- ✅ POST /api/links creates link (returns 201)
- ✅ POST /api/links with duplicate code returns 409
- ✅ POST /api/links validates URL format
- ✅ POST /api/links validates code format
- ✅ POST /api/links generates random code if none provided
- ✅ GET /api/links returns all links
- ✅ GET /api/links/:code returns single link
- ✅ DELETE /api/links/:code deletes link
- ✅ All endpoints return correct status codes

### Testing commands:
```bash
# Create link
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://google.com","customCode":"test01"}'

# Get all links
curl http://localhost:3000/api/links

# Get single link
curl http://localhost:3000/api/links/test01

# Delete link
curl -X DELETE http://localhost:3000/api/links/test01
```

---

## PHASE 3: Redirect Logic (CORE FEATURE)
**Goal:** Short URL redirects working with click tracking

### Files to implement:
1. `src/app/[code]/route.ts` - Dynamic redirect route

### Success Criteria:
- ✅ GET /:code redirects to target URL (302)
- ✅ Clicks are incremented atomically
- ✅ lastClickedAt timestamp updates
- ✅ Non-existent codes return 404
- ✅ Deleted links return 404

### Testing commands:
```bash
# Create a test link first
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://google.com","customCode":"test02"}'

# Test redirect (should redirect to google.com)
curl -L http://localhost:3000/test02

# Check if clicks incremented
curl http://localhost:3000/api/links/test02

# Delete and verify 404
curl -X DELETE http://localhost:3000/api/links/test02
curl -I http://localhost:3000/test02  # Should return 404
```

---

## PHASE 4: UI Components & Pages (FRONTEND)
**Goal:** Complete, functional, beautiful UI

### Files to implement (in order):
1. `src/components/Header.tsx` - Navigation header
2. `src/components/Footer.tsx` - Footer component
3. `src/components/CopyButton.tsx` - Reusable copy button
4. `src/components/AddLinkForm.tsx` - Form to create links
5. `src/components/LinkTable.tsx` - Table to display links
6. `src/app/page.tsx` - Dashboard page
7. `src/app/code/[code]/page.tsx` - Stats page

### Success Criteria:
- ✅ Dashboard loads and displays links
- ✅ Can create new link via form
- ✅ Can create link with custom code
- ✅ Form shows validation errors
- ✅ Form shows loading state
- ✅ Form shows success message
- ✅ Can delete link with confirmation
- ✅ Can copy short URL to clipboard
- ✅ Long URLs are truncated with ellipsis
- ✅ Stats page shows all link details
- ✅ Empty state when no links
- ✅ Error states handled gracefully

---

## PHASE 5: Polish & Deploy (FINALIZATION)
**Goal:** Production-ready application deployed to Railway

### Tasks:
1. Responsive design testing (mobile, tablet, desktop)
2. Add loading spinners and transitions
3. Improve error messages
4. Add search/filter functionality
5. Test all edge cases
6. Deploy to Railway
7. Set environment variables in Railway
8. Test production deployment
9. Create video walkthrough
10. Prepare GitHub repository

### Success Criteria:
- ✅ Works on all screen sizes
- ✅ All automated test scenarios pass
- ✅ Deployed and accessible via public URL
- ✅ Health check returns 200 in production
- ✅ All features work in production
- ✅ README.md complete
- ✅ Video recorded and uploaded

---

## How to Resume in a New Conversation

### If you're starting a new conversation, provide:

1. **Current Phase Number** - "I'm on Phase X"
2. **Completed Files** - List which files are already done
3. **Current File** - Which file you're working on now
4. **Any Errors** - Share error messages if stuck

### Example Resume Message:
```
I'm implementing TinyLink (URL shortener project). 

Current Status:
- ✅ Phase 1: COMPLETE (database, health check working)
- ✅ Phase 2: COMPLETE (all API endpoints working)
- 🔄 Phase 3: IN PROGRESS - working on src/app/[code]/route.ts

Need help with: [describe specific issue or next step]

Here's my current code: [paste relevant code if needed]
```

### Critical Files to Keep Track Of:
- `src/lib/schema.ts` - Database schema (needed for all queries)
- `src/lib/db.ts` - Database connection (needed for all DB operations)
- `src/types/index.ts` - Type definitions (needed for type safety)
- `.env.local` - Environment variables (needed for DB connection)

---

## Quick Reference: Key Technical Decisions

### Database Schema:
```typescript
{
  id: serial (primary key)
  code: varchar(8) UNIQUE NOT NULL
  targetUrl: text NOT NULL
  totalClicks: integer DEFAULT 0
  lastClickedAt: timestamp NULL
  createdAt: timestamp DEFAULT NOW()
}
```

### Code Validation Regex:
```typescript
/^[A-Za-z0-9]{6,8}$/
```

### Critical Status Codes:
- 200: Success (GET, DELETE)
- 201: Created (POST)
- 302: Redirect (/:code)
- 404: Not Found
- 409: Conflict (duplicate code)

### Critical Endpoints:
- POST /api/links
- GET /api/links
- GET /api/links/:code
- DELETE /api/links/:code
- GET /:code (redirect)
- GET /healthz

### Atomic Click Increment (Drizzle):
```typescript
await db.update(links)
  .set({ 
    totalClicks: sql`${links.totalClicks} + 1`,
    lastClickedAt: new Date()
  })
  .where(eq(links.code, params.code));
```

---

## Testing Checklist

### Manual Testing:
- [ ] Create link with custom code
- [ ] Create link without code (auto-generated)
- [ ] Try duplicate code (expect 409)
- [ ] Visit short URL (expect redirect)
- [ ] Check clicks incremented
- [ ] View stats page
- [ ] Delete link
- [ ] Try deleted link (expect 404)
- [ ] Test invalid URL
- [ ] Test invalid code format
- [ ] Test on mobile device

### Automated Testing Simulation:
```bash
# Health check
curl http://localhost:3000/healthz

# Create link
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://example.com","customCode":"abc123"}'

# Duplicate should fail
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"targetUrl":"https://example.com","customCode":"abc123"}'

# Redirect
curl -I http://localhost:3000/abc123

# Delete
curl -X DELETE http://localhost:3000/api/links/abc123

# Should 404 now
curl -I http://localhost:3000/abc123
```

---

## Deployment Checklist

### Before Deploying:
- [ ] All tests passing locally
- [ ] .env.example up to date
- [ ] README.md complete
- [ ] No console errors
- [ ] No sensitive data in repo

### Railway Setup:
1. Create new project in Railway
2. Add PostgreSQL database
3. Connect GitHub repo
4. Set environment variables:
   - `DATABASE_URL` (auto-provided)
   - `NEXT_PUBLIC_BASE_URL` (set to Railway URL)
5. Deploy
6. Test health endpoint
7. Test all features in production

### Post-Deployment:
- [ ] Health check returns 200
- [ ] Can create links
- [ ] Redirects work
- [ ] Stats page works
- [ ] Delete works
- [ ] Mobile responsive

EOF

echo "✅ IMPLEMENTATION_PLAN.md created"

# Create a quick start guide
cat > QUICK_START.md << 'EOF'
# TinyLink Quick Start Guide

## Initial Setup (Already Done ✅)
- ✅ Next.js project created
- ✅ Dependencies installed
- ✅ Project structure created

## Next Steps

### 1. Set Up Database
1. Go to https://neon.tech and create a free account
2. Create a new project
3. Copy the connection string
4. Update `.env.local` with your database URL:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### 2. Start Implementation
Follow the phases in `IMPLEMENTATION_PLAN.md`:

**PHASE 1: Database Setup**
```bash
# We'll implement:
- drizzle.config.ts
- src/lib/schema.ts
- src/lib/db.ts
- src/app/healthz/route.ts
- src/app/layout.tsx

# Then run:
pnpm db:push
pnpm dev
```

**Test Phase 1:**
```bash
curl http://localhost:3000/healthz
# Should return: {"ok":true,"version":"1.0"}
```

### 3. Continue with Remaining Phases
- Phase 2: API Endpoints
- Phase 3: Redirect Logic
- Phase 4: UI Components
- Phase 5: Polish & Deploy

## Important Commands

```bash
# Development
pnpm dev              # Start dev server

# Database
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations

# Production
pnpm build            # Build for production
pnpm start            # Start production server
```

## Project Structure
```
tinylink/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API routes
│   │   ├── code/         # Stats pages
│   │   ├── healthz/      # Health check
│   │   ├── [code]/       # Redirect handler
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Dashboard
│   ├── components/       # React components
│   ├── lib/              # Utilities & DB
│   └── types/            # TypeScript types
├── drizzle/              # Database migrations
└── drizzle.config.ts     # Drizzle configuration
```

## Need Help?

Start a new conversation with:
```
I'm implementing TinyLink. Currently on Phase X.
Completed: [list completed phases]
Need help with: [specific issue or next file]
```

EOF

echo "✅ QUICK_START.md created"

# Update package.json scripts
echo ""
echo "📝 IMPORTANT: Update your package.json scripts section to:"
echo ""
cat << 'EOF'
"scripts": {
  "dev": "next dev",
  "build": "drizzle-kit push && next build",
  "start": "next start",
  "lint": "next lint",
  "db:push": "drizzle-kit push",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate"
}
EOF

echo ""
echo "🎉 Project structure setup complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Set up your Neon database and update .env.local"
echo "2. Read IMPLEMENTATION_PLAN.md for detailed phase-by-phase guide"
echo "3. Read QUICK_START.md for immediate next steps"
echo "4. Start with Phase 1: Database Setup & Health Check"
echo ""
echo "🚀 Ready to start coding!"