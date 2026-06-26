# Blimely

**Blimely** is an autopilot TikTok content engine for founders and small businesses.
The user plugs in their website URL and connects (or creates) a TikTok account; Blimely
figures out what the company does, who the target customer is, and their pain points, then
automatically generates **slideshow-style TikToks** (text over background footage across
swipeable frames), schedules them, and posts to the account — hands-off. The differentiator
is the **hands-off autopilot running the whole account on a schedule**, not just generation.
Scope for now: **slideshow format only**.

(Built on a React + Supabase starter template; renamed from the template's "flowy" demo to Blimely.)

## Architecture

pnpm monorepo with Turborepo:

- `apps/web` — the Vite + React + TanStack Router app (Tailwind v4 + shadcn via `@workspace/ui`)
- `packages/` — shared libraries (`ui`, `supabase`, `lint-config`)
- `supabase/` — Supabase config, migrations, edge functions (Deno; NOT a workspace package)

## Key locations

- **Homepage**: `apps/web/src/routes/index.tsx` renders `apps/web/src/features/landing/`
  (`landing.html` injected as raw string + scoped `.blimely` CSS in `landing.css` +
  vanilla `initLanding.ts` for interactions). Hand-authored design, not component-based.
- **Auth**: `apps/web/src/auth/` (forms, hooks, mutations, queries, schemas) +
  `apps/web/src/routes/auth/` (login, signup, confirm-email, logout). Forms use the
  themed `.auth-*` styling (glass card + cloud-sky `AuthShell`) to match the homepage.
- **Supabase client**: `apps/web/src/integrations/supabase/client.ts`, env validated in
  `apps/web/src/env.ts` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).

## Supabase

- Hosted project ref `yrvfscoeeqojsrtfjhsx`. The app points at it in dev via a gitignored
  `apps/web/.env.development.local` (overrides the template's local-Supabase `.env.development`).
  Never commit the publishable key.
- Supabase ↔ GitHub integration is connected (production branch `main`, working dir `.`);
  migrations in `supabase/migrations/` apply to the hosted DB on merge to `main`. Currently
  no migrations exist — email/password auth runs on Supabase's built-in `auth` schema.

## Conventions

- Group feature code by domain (vertical slices), not by technology.
- Use `pnpm`, never `npm` or `yarn`.
- **Commits must follow Conventional Commits** (husky + commitlint enforce this; e.g. `feat:`, `fix:`).
- Vite env precedence: `.env.[mode].local` > `.env.[mode]` > `.env.local` > `.env`.

## Commands

See `scripts` in the root `package.json`. Use `pnpm <script>`. Dev server: `pnpm dev`
(turbo) or run `vite` in `apps/web` (host `::`, port `8080`).

## Current state / next steps

- ✅ Homepage + themed auth built and wired; app connected to hosted Supabase; repo connected to Supabase.
- ⏭️ **Pending: rewrite homepage/auth copy** from the placeholder "AI employee" wording to
  Blimely's real pitch (autopilot TikTok slideshows), to be done from reference-site screenshots.
- ⏭️ Product schema (TikTok accounts, scheduled posts, generated slideshows) via `supabase/migrations/`.
- ⏭️ Frontend hosting/deploy (e.g. Vercel) — not set up yet.
- Minor: `supabase/config.toml` still has template `project_id = "react-supabase-template"`;
  `confirm-email` page not yet themed.
