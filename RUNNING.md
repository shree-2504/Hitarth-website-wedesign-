# Running the site

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- Dependencies already installed (this repo ships with `node_modules`; if it's ever missing, run `npm install` first)

## Start the dev server

Open a terminal (PowerShell or Git Bash) and run:

```
cd "wedesign-next"
npm run dev
```

Wait for:

```
✓ Ready in Xs
- Local: http://localhost:3000
```

Then open **http://localhost:3000** in your browser.

> If port 3000 is already in use, Next.js automatically tries 3001, 3002, etc. — check the terminal output for the actual URL.

Stop the server with `Ctrl+C` in that terminal.

## Other commands

Run these from inside the `wedesign-next` folder:

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local dev server with hot reload |
| `npm run build` | Builds the production bundle (also type-checks) |
| `npm run start` | Serves the production build (run `npm run build` first) |
| `npm run lint` | Runs ESLint |
| `npx tsc --noEmit` | Type-checks without emitting files |

## Notes

- No environment variables are required to run locally — the site falls back to hardcoded project data in `data/projects.ts` if Sanity CMS isn't configured.
- To connect the real Sanity CMS, copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET`.
- The Sanity Studio (content editor UI) is available at `/studio` once the dev server is running and Sanity env vars are set.
