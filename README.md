# Crema

**A calm place to write, read and share stories.** Crema is a full-stack blogging platform built with React and Supabase. Writers draft in a markdown editor, publish with cover images and tags, and readers like, bookmark and respond in real time.

<!-- Live demo: https://your-app.vercel.app -->
<!-- Screenshots: docs/landing.png, docs/post.png, docs/editor.png -->

> **Try it without signing up:** click **"Try the live demo"** on the landing page, or log in with `demo@crema.app` / `crema-demo`.

## Features

**Reading**
- Landing page with an animated hero built from live stories, community stats and featured posts
- Explore feed with **full-text search** (Postgres `tsvector`), **tag filters** and **infinite scroll**
- Story pages with a reading progress bar, drop cap, markdown typography and related stories
- Public writer profiles at `/u/:id` with bio and stats

**Writing**
- Markdown editor with a formatting toolbar, keyboard shortcuts and live preview
- **Drafts**: save privately, publish when ready, unpublish anytime
- Drag-and-drop cover uploads, resized in the browser and stored in Supabase Storage
- Up to 5 tags per story, with suggestions from popular tags
- Dashboard with published / draft tabs and like and response counts
- **Stats page**: views, likes and responses per day with period-over-period deltas, accessible hand-built SVG charts (keyboard and table view), and top stories

**Community**
- **Likes** with optimistic UI (instant feedback, rolls back on failure)
- **Responses** that appear live through Supabase Realtime; post authors can moderate
- Private **bookmarks** for reading later
- **Notifications** bell with a live unread count when someone likes or responds to your story
- Sign in with **Google or GitHub** (OAuth), or email and password

**Quality**
- Security enforced in the database with **row-level security**: anyone can read, only owners can write, drafts and bookmarks stay private
- Light and dark themes, responsive down to small phones, `prefers-reduced-motion` respected
- Route-level code splitting and vendor chunks for fast loads
- Unit and component tests with Vitest + Testing Library; GitHub Actions runs lint, tests and build on every push

## Tech stack

| Layer | Tools |
|---|---|
| UI | React 19, React Router 7, Material UI 7, react-markdown |
| Backend | Supabase (Postgres, Auth, Storage, Realtime, RLS) |
| Tooling | Vite 6, ESLint, Vitest, Testing Library, GitHub Actions |
| Hosting | Vercel |
| Motion & effects | [React Bits](https://reactbits.dev) (BlurText, SpotlightCard, FuzzyText), Motion |

## Getting started

### 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In **Authentication → Sign In / Providers → Email**, turn off **Confirm email** (optional, smoother for demos).
3. In **SQL Editor**, run the files in [`supabase/`](supabase) in order:
   - `001_schema.sql`: profiles, posts, RLS, storage buckets
   - `002_social_features.sql`: drafts, tags, search, comments, likes, bookmarks
   - `003_notifications_stats.sql`: notifications, story views, writer stats, OAuth profiles
   - `demo_activity.sql` (optional, after `npm run seed:demo`): realistic history for the demo accounts
4. In **Authentication → Users**, add the demo user `demo@crema.app` / `crema-demo` (auto-confirm).

### 2. Run the app

```bash
cp .env.example .env   # fill in your project URL and publishable key
npm install
npm run seed:demo      # optional: demo writers, stories, likes and responses
npm run dev
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm test` | Run the test suite once |
| `npm run lint` | Lint the project |
| `npm run build` | Production build into `dist/` |
| `npm run seed:demo` | Reset the demo content (safe to re-run) |

## Deploying to Vercel

1. Import the GitHub repo in Vercel (framework preset: **Vite**).
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` as environment variables.
3. After the first deploy, set your Vercel URL as the **Site URL** in Supabase → Authentication → URL Configuration.

`vercel.json` rewrites every route to `index.html` so deep links like `/posts/12` work.

## Project structure

```
src/
  api/          # Supabase queries: posts, social (likes, comments, bookmarks), profiles
  components/   # layout, cards, reactions, comments, markdown
    editor/     # post editor, markdown toolbar, cover upload, tag input
    landing/    # landing page sections
  context/      # auth, color mode, notifications
  hooks/        # infinite posts, reactions, in-view animations, demo login
  pages/        # one file per route (lazy-loaded)
  lib/          # Supabase client
supabase/       # SQL migrations
scripts/        # demo seed script
```

## Credits

Text and card effects adapted from [React Bits](https://reactbits.dev) by David Haz (MIT + Commons Clause, see [`src/components/reactbits/LICENSE.md`](src/components/reactbits/LICENSE.md)). Photos from [Unsplash](https://unsplash.com).
