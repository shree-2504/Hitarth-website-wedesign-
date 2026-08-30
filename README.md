# We Design Architects — Website

Next.js rebuild of the studio site: smooth-scroll (Lenis), GSAP ScrollTrigger animations,
a pinned Practice section, a Swiper coverflow project gallery, and an optional Sanity CMS
so projects can be added without touching code.

## Requirements

- Node.js 18.18+ (Node 20 or 22 recommended)
- npm (comes with Node)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 — the site works immediately with the hardcoded projects in
`data/projects.ts`, no CMS setup required.

## Connecting the Sanity CMS (optional)

The site runs fine without this — it just falls back to the hardcoded project list.
Set it up whenever you want non-developers to add/edit projects from a dashboard.

1. Create a free Sanity project:
   ```bash
   npx sanity@latest init
   ```
   Choose "Create new project," give it any name, and use `production` as the dataset
   name (or whatever you like — just match it in step 2).

2. Copy `.env.local.example` to `.env.local` and fill in the project ID it gives you:
   ```bash
   cp .env.local.example .env.local
   ```
   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

3. Restart `npm run dev`, then open **http://localhost:3000/studio** — that's your CMS
   editor, embedded right in the site. No separate app to deploy.

4. Add a "Project" document for each portfolio piece (title, location tag, category,
   image). They'll appear in the "Selected Work" gallery automatically, replacing the
   hardcoded fallback the moment at least one project exists.

## Deploying

This is a standard Next.js app — the easiest path is
[Vercel](https://vercel.com/new): push this folder to a GitHub repo, import it in
Vercel, add the same `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`
environment variables in the Vercel project settings, and deploy.

## Project structure

```
app/                  Routes (App Router). page.tsx is the homepage.
app/studio/           Embedded Sanity Studio at /studio
components/           All page sections + the Lenis/GSAP providers
data/projects.ts      Hardcoded fallback project data
lib/sanity/           Sanity client, image URL builder, GROQ queries
sanityCms/            Sanity schema definitions
public/images/        Portfolio renders (used by the fallback data)
```

## Build phases — status

- [x] **Phase 0** — Next.js + Tailwind scaffold, design tokens, fonts, Lenis smooth scroll
- [x] **Phase 1** — Layout shell: header, hero (scroll-scrubbed grayscale reveal), stats, studio
- [x] **Phase 2** — GSAP ScrollTrigger reveals + pinned "Practice" tabs section
- [x] **Phase 3** — Three.js background skyline (construction scene, camera flythrough)
- [x] **Phase 4** — Selected Work gallery via Swiper coverflow, wired to Sanity with fallback
- [ ] **Phase 5** — Mobile/performance polish pass, accessibility audit
- [ ] **Phase 6** — Deploy to Vercel + custom domain

## About the skyline (Phase 3)

`components/Skyline.tsx` is a fixed full-screen `<canvas>` sitting behind every section
(`z-index: -10`) — that's why the light sections use `/90`–`/92` background opacity, so
the scene reads through them. It disappears behind the hero photo and the dark contact
panel on purpose (both are fully opaque), so the visual arc reads as: skyline rises
behind the informational sections, then the site "arrives" at a clean, finished panel.

Eleven buildings rise on a smoothstep curve as you scroll through the whole page, each
with its own start/end scroll window so they don't all finish at once. A few have
construction cranes that fade out once that building tops out, and the camera flies
across the skyline in sync with scroll progress. It reads scroll position from Lenis
directly (`window.__lenis`) so it stays in lockstep with the smooth-scroll easing rather
than raw `scrollY`.

Respects `prefers-reduced-motion` (renders once, statically, no animation loop) and caps
pixel ratio on small screens for performance.

## Notes

- Fonts (Fraunces / Inter / IBM Plex Mono) load via `next/font/google` at build time —
  this requires internet access during `npm run build` / `npm run dev` the first time,
  same as any Next.js site using Google Fonts.
- Everything respects `prefers-reduced-motion`: Lenis, GSAP reveals, and the pinned
  section all degrade to instant/static states if the user has that OS setting on.
# Hitarth-website-wedesign-
