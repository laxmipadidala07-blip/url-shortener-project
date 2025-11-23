# TinyLink - URL Shortener (Take-Home Assignment)

A clean, functional URL shortener built as a take-home project. It's like Bitly but simpler — paste a long URL, get a short link, track clicks, and manage everything from a dashboard.

## 🔗 Live Demo

- **Deployed App**: https://url-shortener-project-obd7h56g1.vercel.app
- **Health Check**: https://url-shortener-project-obd7h56g1.vercel.app/healthz

## 📋 Overview

This is a URL shortener web app I built following the assignment spec. You can create short links with custom codes or let it auto-generate one for you. Every redirect tracks clicks and updates a "last clicked" timestamp. There's a dashboard to see all links and a stats page for detailed info on each one.

No authentication system — everything's public as required.

## 🛠️ Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Drizzle ORM** + **Neon Postgres** (serverless)
- **@neondatabase/serverless** driver
- **nanoid** (for generating short codes)
- **validator.js** (URL validation)
- **lucide-react** (icons)

Deployed on **Railway** with automatic HTTPS.

## ✨ Features

- ✅ Create short links with optional custom code (6-8 alphanumeric characters)
- ✅ Auto-generated 6-character codes when no custom code is provided
- ✅ Global uniqueness check → returns 409 Conflict if code already exists
- ✅ `GET /{code}` → 302 redirect + atomic click counter increment
- ✅ Dashboard with table showing: Short code, Target URL, Total clicks, Last clicked, Actions
- ✅ Copy button for short URLs
- ✅ Delete with confirmation dialog
- ✅ Stats page at `/code/:code` with detailed analytics
- ✅ Health check endpoint at `/healthz`
- ✅ Fully responsive design (works on mobile)
- ✅ Loading, empty, and error states handled

## 📡 API Endpoints

| Method  | Path                | Description                    |
|---------|---------------------|--------------------------------|
| GET     | /healthz            | Health check (200)             |
| POST    | /api/links          | Create link (201 / 409)        |
| GET     | /api/links          | List all links (200)           |
| GET     | /api/links/:code    | Get single link (200 / 404)    |
| DELETE  | /api/links/:code    | Delete link (200 / 404)        |

## 🚀 Local Development Setup

1. **Clone the repository**
```bash
   git clone https://github.com/yourusername/tinylink.git
   cd tinylink
```

2. **Install dependencies**
```bash
   pnpm install
   # or npm install / yarn install
```

3. **Set up environment variables**
```bash
   cp .env.example .env.local
```
   Add your Neon Postgres connection string to `.env.local`

4. **Create database table**
```bash
   pnpm db:push
```

5. **Start development server**
```bash
   pnpm dev
```
   Open http://localhost:3000

## 🔐 Environment Variables
```env
# Database connection (Neon Postgres)
DATABASE_URL=postgresql://user:password@host.region.aws.neon.tech/database?sslmode=require

# Application base URL (for generating short URLs)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For Railway deployment:**
- `DATABASE_URL` is automatically provided by the PostgreSQL plugin
- Set `NEXT_PUBLIC_BASE_URL` manually to your Railway app URL (e.g., `https://url-shortener-project-obd7h56g1.vercel.app/`)

## 🌐 Deployment (Railway)

1. Push your code to GitHub
2. Create a new project on Railway → connect your GitHub repo
3. Add the PostgreSQL plugin (this sets `DATABASE_URL` automatically)
4. Add environment variable: `NEXT_PUBLIC_BASE_URL` = your Railway app URL
5. Deploy → Railway runs the build and starts the app

## 📜 Scripts
```json
{
  "dev": "next dev",
  "build": "drizzle-kit generate && drizzle-kit migrate && next build",
  "start": "next start",
  "db:push": "drizzle-kit push"
}
```

## 📝 Notes

- Short codes must be 6-8 characters, alphanumeric only (`A-Za-z0-9`)
- Click counts are incremented atomically using SQL expressions (no race conditions)
- No authentication system (all routes are public as per spec)
- I used AI assistance (Claude & Grok) to build this, but I understand every part of the code and can explain it

## 🎥 Video Walkthrough

[Link will be added before submission]

## 💬 LLM Transcript

[Link to conversation export will be added]

---

Thanks for reviewing! 🙏


