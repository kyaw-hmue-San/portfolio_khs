import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { getContactHandoff, getDemoAnswer, SYSTEM_PROMPT } from "./portfolio-context.mjs";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const DIST = join(ROOT, "dist");
const PORT = Number.parseInt(process.env.PORT ?? "8787", 10);
const API_URL = process.env.AIML_API_URL ?? "https://api.aimlapi.com/v1/chat/completions";
const API_KEY = process.env.AIML_API_KEY;
const MODEL = process.env.AIML_MODEL;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 12;
const MAX_BODY_BYTES = 16_384;
const requestWindows = new Map();
const TRANSIENT_UPSTREAM_STATUSES = new Set([429, 500, 502, 503, 504]);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function json(response, status, body, extraHeaders = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  response.end(JSON.stringify(body));
}

function clientAddress(request) {
  const forwarded = request.headers["x-forwarded-for"];
  return (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0])?.trim()
    || request.socket.remoteAddress
    || "unknown";
}

function rateLimit(address) {
  const now = Date.now();
  const current = requestWindows.get(address);
  if (!current || now >= current.resetAt) {
    const fresh = { count: 1, resetAt: now + WINDOW_MS };
    requestWindows.set(address, fresh);
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: fresh.resetAt };
  }
  current.count += 1;
  return {
    allowed: current.count <= MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - current.count),
    resetAt: current.resetAt,
  };
}

async function readJson(request) {
  let size = 0;
  const chunks = [];
  for await (const chunk of request) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) throw new Error("BODY_TOO_LARGE");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sanitizeMessages(input) {
  if (!Array.isArray(input) || input.length === 0) return null;
  const sanitized = input.slice(-8).map((message) => ({
    role: message?.role,
    content: typeof message?.content === "string" ? message.content.trim() : "",
  }));
  const valid = sanitized.every((message) =>
    ["user", "assistant"].includes(message.role)
    && message.content.length > 0
    && message.content.length <= 1_000
  );
  return valid && sanitized.at(-1)?.role === "user" ? sanitized : null;
}

async function requestAiMl(messages, locale) {
  const language = { en: "English", my: "Myanmar (Burmese)", th: "Thai" }[locale] ?? "English";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const upstream = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "system", content: `Reply in ${language}. Keep technology and product names in their original form.` },
            ...messages,
          ],
          temperature: 0.25,
          max_tokens: 300,
          stream: false,
        }),
        signal: AbortSignal.timeout(18_000),
      });

      const payload = await upstream.json().catch(() => null);
      if (!upstream.ok) {
        const error = new Error("UPSTREAM_ERROR");
        error.status = upstream.status;
        error.detail = payload?.error?.message;
        throw error;
      }

      const content = payload?.choices?.[0]?.message?.content;
      if (typeof content !== "string" || content.trim().length === 0) {
        throw new Error("INVALID_UPSTREAM_RESPONSE");
      }
      return content.trim();
    } catch (error) {
      const transient = error.name === "TimeoutError"
        || (error.message === "UPSTREAM_ERROR" && TRANSIENT_UPSTREAM_STATUSES.has(error.status));
      if (!transient || attempt === 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }

  throw new Error("UPSTREAM_ERROR");
}

async function handleChat(request, response) {
  const limit = rateLimit(clientAddress(request));
  const headers = {
    "X-RateLimit-Limit": String(MAX_REQUESTS),
    "X-RateLimit-Remaining": String(limit.remaining),
    "X-RateLimit-Reset": String(Math.ceil(limit.resetAt / 1000)),
  };
  if (!limit.allowed) {
    json(response, 429, { error: "Too many messages. Please try again in a few minutes." }, headers);
    return;
  }

  try {
    const body = await readJson(request);
    const messages = sanitizeMessages(body?.messages);
    const locale = ["en", "my", "th"].includes(body?.locale) ? body.locale : "en";
    if (!messages) {
      json(response, 400, { error: "Send between 1 and 8 valid chat messages." }, headers);
      return;
    }

    const contactHandoff = getContactHandoff(messages.at(-1).content, locale);
    if (contactHandoff) {
      json(response, 200, { ...contactHandoff, mode: API_KEY && MODEL ? "live" : "demo" }, headers);
      return;
    }

    if (!API_KEY || !MODEL) {
      json(response, 200, {
        message: getDemoAnswer(messages.at(-1).content, locale),
        mode: "demo",
      }, headers);
      return;
    }

    try {
      const message = await requestAiMl(messages, locale);
      json(response, 200, { message, mode: "live" }, headers);
    } catch (error) {
      const transient = error.name === "TimeoutError"
        || (error.message === "UPSTREAM_ERROR" && TRANSIENT_UPSTREAM_STATUSES.has(error.status));
      if (!transient) throw error;

      console.warn("AI/ML temporarily unavailable; serving a portfolio fallback:", error.status ?? error.name);
      json(response, 200, {
        message: getDemoAnswer(messages.at(-1).content, locale),
        mode: "demo",
      }, headers);
    }
  } catch (error) {
    if (error.message === "BODY_TOO_LARGE") {
      json(response, 413, { error: "That message is too large." }, headers);
      return;
    }
    if (error instanceof SyntaxError) {
      json(response, 400, { error: "Invalid JSON request." }, headers);
      return;
    }
    console.error("Chat request failed:", error.message, error.status ?? "", error.detail ?? "");
    json(response, 502, { error: "The assistant is temporarily unavailable." }, headers);
  }
}

async function serveStatic(request, response) {
  const url = new URL(request.url, "http://localhost");
  const requested = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const safePath = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
  let filePath = join(DIST, safePath);

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) filePath = join(filePath, "index.html");
    await access(filePath);
  } catch {
    filePath = join(DIST, "index.html");
    try {
      await access(filePath);
    } catch {
      json(response, 503, { error: "Build the frontend with npm run build first." });
      return;
    }
  }

  response.writeHead(200, {
    "Content-Type": MIME_TYPES[extname(filePath)] ?? "application/octet-stream",
    "Cache-Control": filePath.endsWith("index.html") ? "no-cache" : "public, max-age=31536000, immutable",
  });
  createReadStream(filePath).pipe(response);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, "http://localhost");
  if (url.pathname === "/api/health" && request.method === "GET") {
    json(response, 200, { ok: true, chatMode: API_KEY && MODEL ? "live" : "demo" });
    return;
  }
  if (url.pathname === "/api/chat" && request.method === "POST") {
    await handleChat(request, response);
    return;
  }
  if (url.pathname.startsWith("/api/")) {
    json(response, 404, { error: "API route not found." });
    return;
  }
  if (!["GET", "HEAD"].includes(request.method)) {
    json(response, 405, { error: "Method not allowed." });
    return;
  }
  await serveStatic(request, response);
});

server.listen(PORT, "0.0.0.0", () => {
  const mode = API_KEY && MODEL ? "live AI/ML API" : "safe demo";
  console.log(`Portfolio server running at http://localhost:${PORT} (${mode} mode)`);
});
