
  # Portfolio for Software Engineer

  This is a code bundle for Portfolio for Software Engineer. The original project is available at https://www.figma.com/design/2Q5PCF9Z5eczrwXxoiIFsX/Portfolio-for-Software-Engineer.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Rim portfolio assistant

  The recruiter-facing chat assistant uses a small same-origin Node API. It
  runs in a safe, deterministic demo mode until AI/ML API credentials are
  configured.

  1. Copy `.env.example` to `.env`.
  2. Set `AIML_API_KEY` and `AIML_MODEL` in `.env`. Never use a `VITE_` prefix
     for the API key because Vite exposes those variables to browser code.
  3. Run `npm run dev:api` in one terminal.
  4. Run `npm run dev` in another terminal.

  For a production-style local run:

  ```bash
  npm run build
  npm start
  ```

  The Node server serves `dist/` and handles `POST /api/chat`. The MVP keeps no
  database or conversation history. It validates input, sends only the last
  eight messages, limits message length, applies an in-memory rate limit, and
  keeps the AI/ML API credential on the server.
