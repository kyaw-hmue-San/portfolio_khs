import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { collections, validateContent } from '../shared/content.mjs';
import { checkPassword, contentRow } from './store.mjs';

const SESSION_MS = 8 * 60 * 60 * 1000;
const digest = value => createHash('sha256').update(value).digest('hex');
class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}
function reply(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
  res.end(JSON.stringify(body));
}
function readBody(req, limit = 131072) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    const data = chunk => {
      size += chunk.length;
      if (size > limit) {
        chunks.length = 0;
        req.off('data', data);
        reject(new HttpError(413, 'Upload or request is too large.'));
        req.resume();
      } else chunks.push(chunk);
    };
    req.on('data', data);
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
    req.on('aborted', () => reject(new HttpError(400, 'Request interrupted.')));
  });
}
async function readJson(req) {
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') throw new HttpError(415, 'Send application/json.');
  try { return JSON.parse((await readBody(req)).toString('utf8')); }
  catch (error) { if (error instanceof SyntaxError) throw new HttpError(400, 'Invalid JSON.'); throw error; }
}
function sameOrigin(req, configuredOrigin) {
  if (req.headers['sec-fetch-site'] === 'cross-site') return false;
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    if (configuredOrigin) return parsed.origin === configuredOrigin;
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.host === req.headers.host;
  } catch { return false; }
}

export function createCmsHandler(db, { origin = process.env.PUBLIC_ORIGIN, secure = process.env.NODE_ENV === 'production', now = Date.now } = {}) {
  if (origin) origin = new URL(origin).origin;
  if (secure && !origin?.startsWith('https://')) throw new Error('Set PUBLIC_ORIGIN to the HTTPS portfolio URL in production.');
  const attempts = new Map();
  const cookieName = secure ? '__Host-portfolio_admin' : 'portfolio_admin';
  const cookie = (token, age) => `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${secure ? '; Secure' : ''}`;
  const sessionToken = req => (req.headers.cookie ?? '').split(';').map(s => s.trim()).find(s => s.startsWith(`${cookieName}=`))?.slice(cookieName.length + 1) ?? '';
  function session(req) {
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(now());
    return db.prepare('SELECT * FROM sessions WHERE token_hash = ? AND expires_at > ?').get(digest(sessionToken(req)), now());
  }
  function limitLogin(req) {
    const time = now();
    for (const [key, value] of attempts) if (value.until <= time) attempts.delete(key);
    const address = req.socket.remoteAddress || 'unknown'; // Never trust arbitrary forwarded headers.
    for (const [key, max] of [[address, 8], ['global', 80]]) {
      const value = attempts.get(key) ?? { count: 0, until: time + 15 * 60 * 1000 };
      value.count += 1;
      attempts.set(key, value);
      if (value.count > max) throw new HttpError(429, 'Too many sign-in attempts. Try again in 15 minutes.');
    }
  }
  return async function handle(req, res, pathname) {
    if (!pathname.startsWith('/api/admin/') && pathname !== '/api/content' && !pathname.startsWith('/media/')) return false;
    try {
      if (pathname === '/api/content') {
        if (req.method !== 'GET') throw new HttpError(405, 'Method not allowed.');
        const data = Object.fromEntries(Object.keys(collections).map(kind => [kind,
          db.prepare('SELECT * FROM content WHERE kind = ? AND published = 1 ORDER BY position, id').all(kind).map(row => ({ id: row.id, ...JSON.parse(row.body) })),
        ]));
        reply(res, 200, data);
        return true;
      }
      if (pathname.startsWith('/media/')) {
        if (!['GET', 'HEAD'].includes(req.method)) throw new HttpError(405, 'Method not allowed.');
        const media = db.prepare('SELECT * FROM media WHERE id = ?').get(pathname.slice(7));
        if (!media) throw new HttpError(404, 'Image not found.');
        res.writeHead(200, { 'Content-Type': media.mime, 'Content-Length': media.body.length, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'" });
        res.end(req.method === 'HEAD' ? undefined : Buffer.from(media.body));
        return true;
      }
      if (req.method !== 'GET' && !sameOrigin(req, origin)) throw new HttpError(403, 'Request origin is not allowed.');
      if (pathname === '/api/admin/login' && req.method === 'POST') {
        limitLogin(req);
        const body = await readJson(req);
        const admin = db.prepare('SELECT * FROM admin WHERE id=1').get();
        if (!admin) throw new HttpError(503, 'Admin account is not configured. Run npm run admin:setup in the server terminal.');
        if (typeof body?.email !== 'string' || typeof body?.password !== 'string' || body.password.length > 256) throw new HttpError(400, 'Enter your email and password.');
        const valid = await checkPassword(body.password, admin.password_hash);
        if (!valid || body.email.trim().toLowerCase() !== admin.email) throw new HttpError(401, 'Email or password is incorrect.');
        db.prepare('DELETE FROM sessions WHERE token_hash = ? OR expires_at <= ?').run(digest(sessionToken(req)), now());
        const token = randomBytes(32).toString('hex');
        const csrf = randomBytes(32).toString('hex');
        db.prepare('INSERT INTO sessions(token_hash, csrf, expires_at) VALUES(?,?,?)').run(digest(token), csrf, now() + SESSION_MS);
        reply(res, 200, { email: admin.email, csrf }, { 'Set-Cookie': cookie(token, SESSION_MS / 1000) });
        return true;
      }
      const auth = session(req);
      if (!auth) throw new HttpError(401, 'Please sign in to continue.');
      if (req.method !== 'GET' && req.headers['x-csrf-token'] !== auth.csrf) throw new HttpError(403, 'Session verification failed. Refresh and sign in again.');
      if (pathname === '/api/admin/session' && req.method === 'GET') {
        reply(res, 200, { email: db.prepare('SELECT email FROM admin WHERE id=1').get()?.email, csrf: auth.csrf });
      } else if (pathname === '/api/admin/logout' && req.method === 'POST') {
        db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(auth.token_hash);
        reply(res, 200, { ok: true }, { 'Set-Cookie': cookie('', 0) });
      } else if (pathname === '/api/admin/media' && req.method === 'POST') {
        const bytes = await readBody(req, 5 * 1024 * 1024);
        const mime = bytes.length > 8 && bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png'
          : bytes.length > 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg'
          : bytes.length > 12 && bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' ? 'image/webp' : null;
        if (!mime) throw new HttpError(415, 'Choose a PNG, JPEG, or WebP image up to 5 MB.');
        const id = randomUUID();
        db.prepare('INSERT INTO media(id,mime,body) VALUES(?,?,?)').run(id, mime, bytes);
        reply(res, 201, { url: `/media/${id}` });
      } else {
        const match = pathname.match(/^\/api\/admin\/content\/(projects|skills|experience)(?:\/([a-zA-Z0-9-]+))?$/);
        if (!match) throw new HttpError(404, 'Admin route not found.');
        const [, kind, id] = match;
        if (req.method === 'GET' && !id) {
          reply(res, 200, { items: db.prepare('SELECT * FROM content WHERE kind=? ORDER BY position,id').all(kind).map(contentRow) });
        } else if (req.method === 'POST' && !id || req.method === 'PUT' && id) {
          const body = await readJson(req);
          let content;
          try { content = validateContent(kind, body?.content); } catch (error) { throw new HttpError(400, error.message); }
          if (typeof body.published !== 'boolean' || !Number.isInteger(body.position) || body.position < 0 || body.position > 10000) throw new HttpError(400, 'Choose a publication status and an order between 0 and 10000.');
          const key = id || randomUUID();
          const stamp = new Date(now()).toISOString();
          if (id) {
            const result = db.prepare('UPDATE content SET body=?,published=?,position=?,version=version+1,updated_at=? WHERE id=? AND kind=? AND version=?').run(JSON.stringify(content), Number(body.published), body.position, stamp, id, kind, Number.isInteger(body.version) ? body.version : -1);
            if (!result.changes) throw new HttpError(409, 'This item changed or was deleted. Reload the list before editing again.');
          } else {
            db.prepare('INSERT INTO content(id,kind,body,published,position,updated_at) VALUES(?,?,?,?,?,?)').run(key, kind, JSON.stringify(content), Number(body.published), body.position, stamp);
          }
          reply(res, id ? 200 : 201, { item: contentRow(db.prepare('SELECT * FROM content WHERE id=?').get(key)) });
        } else if (req.method === 'DELETE' && id) {
          const body = await readJson(req);
          const result = db.prepare('DELETE FROM content WHERE id=? AND kind=? AND version=?').run(id, kind, Number.isInteger(body?.version) ? body.version : -1);
          if (!result.changes) throw new HttpError(409, 'This item changed or was deleted. Reload the list before deleting again.');
          reply(res, 200, { ok: true });
        } else throw new HttpError(405, 'Method not allowed.');
      }
    } catch (error) {
      if (!error.status) console.error('CMS request failed:', error.message);
      if (!res.headersSent) reply(res, error.status || 500, { error: error.status ? error.message : 'Something went wrong. Please try again.' }, error.status === 429 ? { 'Retry-After': '900' } : {});
      else res.end();
    }
    return true;
  };
}
