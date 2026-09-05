# Free Render: public site + AI, dashboard stays local

The existing Render Static Site continues hosting your portfolio and domain.
A separate **Free Web Service** runs only Rim's API. No online database is needed.
Your local dashboard, drafts, administrator account, and database stay on your laptop.
The résumé is not part of the export and is unchanged.

## Everyday workflow

1. Run `npm run dev:api` and `npm run dev` in separate terminals.
2. Open the Vite URL + `/admin`. Use `npm run admin:setup` once if needed.
3. Edit content, choose Published for finished items, and preview at the Vite URL.
4. Run `npm run content:export` to export the currently published content and images.
5. Run `npm run build` to check the public release.
6. Review and commit your changes, including `public/content/`, then push the branch
   connected to your Render Static Site. Render deploys the exported copy.

The Publish button affects your **local preview**. The live site changes only after
export, Git push, and a successful Render deployment. Render builds must NOT run
`content:export`: your private database is intentionally absent there.

`npm run build` creates the public static site, without the admin editor bundle.
`npm run build:local` followed by `npm start` creates a single-server local dashboard
preview. These commands both use `dist/`, so rebuild for the mode you intend to view.

Exports include only published projects, skills, experience, and referenced uploaded
images. Content is validated before the snapshot is replaced. Missing images abort
an export instead of silently breaking the site. Previously exported images are retained
to avoid breaking existing links. No drafts, login records, sessions, or database files
are exported. Keep a separate private backup of your `data/` directory.

## One-time Render configuration

### 1. Add Rim's backend

Create a **Web Service** from this repository:

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Instance | Free |
| Branch | The branch containing this release |
| Build command | `npm ci` |
| Start command | `npm run start:chat` |
| Health check | `/api/health` |

Configure server environment variables:

- `NODE_ENV=production`
- `NODE_VERSION=24.20.0`
- `PUBLIC_ORIGIN=https://kyawhmuesan.dev` (exact browser origin; no trailing path)
- `AIML_API_KEY`: your existing AI/ML API key, entered privately in Render
- `AIML_MODEL`: the model ID you use locally
- `AIML_API_URL=https://api.aimlapi.com/v1/chat/completions`

Render supplies `PORT`. Do not copy the local `PORT` or `HOST` into Render.
No disk, admin setup, database credential, or local `.env` upload is needed.
`start:chat` forcibly disables the CMS, even if another environment setting enables it.
Without valid provider credentials, only demo replies are available. A live health
mode indicates credentials are present; verify with an actual chat request too.

### 2. Update the existing Static Site

Keep your current domain and Static Site. Set:

| Setting | Value |
| --- | --- |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |
| `NODE_VERSION` | `24.20.0` |
| `VITE_CHAT_API_URL` | The HTTPS URL Render assigned to the new Rim service |

Use the service origin only, without `/api/chat`. This URL is public configuration.
**Never put `AIML_API_KEY` into the Static Site or any `VITE_` variable.**
Rebuild/redeploy the Static Site after setting the URL; Vite embeds it at build time.
Use the custom domain for chat testing because the API allows exactly `PUBLIC_ORIGIN`.

## What visitors experience

Portfolio content and images are static and do not depend on Rim's backend or your
laptop. Rim's free service can sleep after 15 idle minutes, so the first reply can
be slow. The chat shows a startup notice after eight seconds and waits up to two
minutes before giving a recoverable error. Other portfolio sections remain usable.
No keep-alive ping service is required.

## Release checks

- `/content/portfolio.json` loads on the public domain.
- Project covers load, and projects/skills are visible even if Rim is unavailable.
- The public build contains no Admin JavaScript chunk or database files.
- The API `/api/health` returns JSON, and `/api/admin/session` returns 404.
- A real chat from the public domain returns a live answer after credentials are set.
- Résumé content and links are unchanged.

References: [Render Node deployment](https://render.com/docs/deploy-node-express-app),
[Static Sites](https://render.com/docs/static-sites),
[free instance behavior](https://render.com/docs/free).
