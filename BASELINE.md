# Portfolio improvement baseline

Recorded: 2026-09-03 (Asia/Bangkok)

## Source of truth

- Repository: `https://github.com/kyaw-hmue-San/portfolio_khs.git`
- Base branch: `main`
- Base commit: `3ff7b982247a0fa5d4c29140029410cf44b50111`
- Improvement branch: `codex/portfolio-improvements`
- Original design source: Figma Make export linked from `README.md`

The local production build emits the same hashed application assets observed on
`kyawhmuesan.dev` (`index-CZ9DFoQv.js` and `index-CsnGU92D.css`). This confirms
that this repository is the source for the current live portfolio.

## Verification baseline

- `npm ci`: passes
- `npm run build`: passes
- No lint or test scripts currently exist
- Production JavaScript: 361.54 KB (110.84 KB gzip)
- Production CSS: 93.46 KB (15.48 KB gzip)
- `npm audit --omit=dev`: one high-severity direct dependency finding in
  `react-router`
- Full install audit: six high-severity findings

## Deployment baseline

- No deployment configuration is committed (`render.yaml`, `netlify.toml`,
  `vercel.json`, Dockerfile, or GitHub Actions workflow).
- Hosting configuration therefore lives outside the repository and must be
  verified in the hosting dashboard before production deployment changes.

## Known baseline risks

1. `index.html` includes `noindex, nofollow`, preventing search indexing.
2. Several contact, social, resume, and private-project actions use placeholder
   `#` links.
3. The contact form is a visual demo and does not send messages.
4. The Figma export includes a large generic UI dependency set relative to the
   small portfolio application.
5. The package has no lint, type-check, or test command.
6. Production must remain unchanged until an improvement preview is reviewed.

## Deployment guardrail

Develop and verify changes on `codex/portfolio-improvements`. Do not connect the
production domain or merge into `main` until the preview has been approved and
the build, type checks, tests, links, metadata, and responsive layouts pass.

