# Kyaw Hmue San — Portfolio

React + Vite portfolio with a Node API, Rim chat assistant, and a private content
management dashboard at `/admin`. The original design came from
[Figma](https://www.figma.com/design/2Q5PCF9Z5eczrwXxoiIFsX/Portfolio-for-Software-Engineer).

## Current publishing workflow

The public release is now a static export; the dashboard stays on your laptop.
See [RENDER.md](RENDER.md) for the free Render setup and publishing steps.
Run `npm run content:export` locally after editing published content, then
`npm run build` and push the exported files. Render never needs your database.
The AI assistant runs separately with `npm run start:chat`.

## First run

Requires **Node.js 24 or newer**.

```bash
npm install
# Only if you don't already have .env:
cp .env.example .env
npm run admin:setup
```

The setup command asks for your email and a password of at least 12 characters.
Password input is hidden. No default password or public registration exists.
Run the command again to reset the single administrator account; this signs out
all existing sessions. Run it against the same `CMS_DB_PATH` used by the API.

Start these in two terminals:

```bash
npm run dev:api
```

```bash
npm run dev
```

Open the URL Vite prints, followed by `/admin` (usually
`http://localhost:5173/admin`). Sign in with the account you just created.
The Vite development server proxies `/api` and `/media` to port 8787. If you
change the API port, update both proxy targets in `vite.config.ts`.

For a single-server local preview:

```bash
npm run build:local
npm start
```

Open `http://localhost:8787/admin`. The same server serves the portfolio at `/`.

## Managing content

- **Projects:** edit the title, category, summary, technologies, cover image,
  links, featured status, accent, icon, and all case-study sections.
- **Skills:** edit names, descriptions, related projects, icons, and colors.
- **Experience:** add roles, companies, dates, responsibilities, and company links.
  The public experience section appears only when at least one role is published.
- New items start as **drafts**. Choose **Published** and **Save & publish** to
  include them in the next public export. Saving a published item as a draft removes it from public
  listings. There is no separate pending revision of a published item.
- Lower display-order numbers appear first. Changes appear immediately in your
  local preview. Export, build, and deploy to update the live site.
- Upload PNG, JPEG, or WebP images up to 5 MB, or enter an existing image URL.
  Uploaded files have public, unguessable URLs even while their content is a draft.
  Uploaded images are retained when items are deleted so shared image links do
  not break. Image-library cleanup is not included in this first version.
- Conflicting edits in two tabs are rejected instead of silently overwriting
  newer content. Reload the list before making the change again.

The first API start or admin setup imports the four existing projects and sixteen
skills from `shared/seed.json`. This migration runs once and never overwrites
later dashboard changes. Experience starts empty. Profile, education, learning
cards, and Rim's factual context still use the existing source files; those are
outside this first dashboard release. The dashboard is in English; content is
shown as entered across portfolio languages.

## Local storage and optional future full-server deployment

Data, password hashes, sessions, and uploaded images live in
`data/portfolio.sqlite` by default. This directory is ignored by Git. It is a
server database, not browser storage. Deleting it deletes dashboard changes.
Keep database files outside `public/` and `dist/`.

The chosen free Render workflow serves the static export from `/content/portfolio.json`.
Only local development and `build:local` load `/api/content`.
The optional full-server setup below is for a future persistent hosting deployment;
it is not needed for the current free static-site workflow.

For production, configure:

```dotenv
NODE_ENV=production
CMS_ENABLED=true
PUBLIC_ORIGIN=https://your-portfolio-domain.example
CMS_DB_PATH=/absolute/path/on/persistent-disk/portfolio.sqlite
PORT=8787
```

Use HTTPS and a persistent disk. `PUBLIC_ORIGIN` must exactly match the browser's
origin (including a port, if present); do not include a path. The service refuses
production startup without an HTTPS origin. Run `npm run admin:setup` on the
host with the same environment before signing in. Deploy one application instance
with its own SQLite database. Shared multi-instance hosting needs a different
storage plan. A Cloudflare Sites deployment is not provided because the existing
Node server and local SQLite storage require a Node host with persistent storage.

Back up the database regularly. For a simple consistent backup, stop the API,
copy the database and any accompanying `-wal` and `-shm` files together, then
restart. Restore to the configured database path while the server is stopped.

Admin passwords use salted scrypt hashes. Server-side sessions expire after eight
hours, use HttpOnly/SameSite cookies (Secure in production), and support logout
and password-reset revocation. Writes require both an allowed origin and a session
CSRF token. Sign-in attempts are rate limited in memory. The limiter deliberately
uses the direct connection address instead of trusting forwarded headers;
visitors behind one reverse proxy share its sign-in budget. It resets on restart.

## Rim assistant

The existing assistant uses the same Node API at `POST /api/chat`. Configure
`AIML_API_KEY`, `AIML_MODEL`, and optionally `AIML_API_URL` in `.env` to use AI/ML
API. Without credentials it returns deterministic portfolio answers. Remove or
leave those variables empty for demo mode. Never prefix private credentials with
`VITE_`, which exposes them to browser code.

The chat stores no conversation history. It validates messages, uses the last
eight, and applies an in-memory request limit. Its factual context remains in
`server/portfolio-context.mjs`; dashboard edits do not yet update Rim's answers.

## Verification

```bash
npm test
npm run build
```

Backend integration tests use isolated databases and local HTTP servers. They
cover seeding, persistence, authentication, session expiry, CSRF/origin protection,
draft visibility, publishing, deletion, conflicting edits, input validation,
image uploads, login throttling, and production cookie settings.
