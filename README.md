# RunnerMap

Pin every half and full marathon you've run on your own world map — with date, bib number and finish time.

## Features

- **Overview** – world map of your races, stats (races, distance, countries) and personal bests
- **Runs** – add, edit and remove runs; search and filter; PB and upcoming badges
- **Find a run** – catalog of ~95 half & full marathons (World Majors, Portugal, Europe and more) with map, filters and one-click "I ran this"
- **Settings** – per-device theme (system / light / dark), units (km / mi), map style, pace display; Google logout

## Stack

Next.js 16 (App Router, Server Actions) · TypeScript · Tailwind CSS v4 · Auth.js v5 (Google) · Prisma + SQLite · Leaflet (Esri / OpenStreetMap tiles, no API key) · Nominatim geocoding

## Getting started

1. **Install**
   ```bash
   npm install
   ```
2. **Create Google OAuth credentials** at <https://console.cloud.google.com/apis/credentials>
   - Create an *OAuth client ID* → *Web application*
   - Authorized JavaScript origin: `http://localhost:3000`
   - Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
3. **Configure env** – copy `.env.example` to `.env` and fill in:
   ```bash
   AUTH_SECRET=...          # npx auth secret
   AUTH_GOOGLE_ID=...
   AUTH_GOOGLE_SECRET=...
   DATABASE_URL="file:./dev.db"
   ```
4. **Create the database**
   ```bash
   npm run db:push
   ```
5. **Run**
   ```bash
   npm run dev
   ```
   Open <http://localhost:3000>.

## Scripts

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Start the dev server            |
| `npm run build`     | Production build                |
| `npm run typecheck` | TypeScript check                |
| `npm run db:push`   | Sync Prisma schema to the DB    |
| `npm run db:studio` | Browse the DB in Prisma Studio  |

## Project structure

```
prisma/schema.prisma          User/Account/Session (Auth.js) + Run
src/auth.ts                   Auth.js config + requireUser()
src/data/races.ts             Race catalog (add races here)
src/app/page.tsx              Landing / Google sign-in
src/app/(app)/overview        Map + stats
src/app/(app)/runs            List, new, edit + server actions
src/app/(app)/find            Race catalog
src/app/(app)/settings        Device settings + logout
src/app/api/geocode           Nominatim proxy for place search
src/components/map            Leaflet map (client-only)
```

## Deploying

SQLite is for local development. For production (e.g. Vercel), switch `provider` in `prisma/schema.prisma` to `postgresql`, point `DATABASE_URL` at your database, and add your production URL's `/api/auth/callback/google` to the Google OAuth client.
