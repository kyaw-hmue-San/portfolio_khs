import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { openStore, hashPassword } from './store.mjs';
import { createCmsHandler } from './cms.mjs';
import { emptyContent, validateContent } from '../shared/content.mjs';

async function fixture(t, options = {}) {
  const db = openStore(':memory:');
  await db.prepare('INSERT INTO admin VALUES(1,?,?)').run('admin@example.com', await hashPassword('a-test-password-only'));
  let clock = Date.now();
  const handler = createCmsHandler(db, { origin: 'http://portfolio.test', secure: false, now: () => clock, ...options });
  const server = createServer(async (req, res) => {
    if (!await handler(req, res, new URL(req.url, 'http://test').pathname)) { res.writeHead(404); res.end(); }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); db.close(); });
  const url = `http://127.0.0.1:${server.address().port}`;
  let cookie = '';
  let csrf = '';
  async function request(path, method = 'GET', body, extras = {}) {
    const response = await fetch(url + path, { method, headers: { Origin: 'http://portfolio.test', ...(cookie ? { Cookie: cookie, 'X-CSRF-Token': csrf } : {}), ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...extras }, body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body) });
    const data = await response.json();
    return { response, data };
  }
  async function login() {
    const result = await request('/api/admin/login', 'POST', { email: 'admin@example.com', password: 'a-test-password-only' });
    assert.equal(result.response.status, 200);
    cookie = result.response.headers.get('set-cookie').split(';')[0];
    csrf = result.data.csrf;
    return result;
  }
  return { db, request, login, url, advance: ms => { clock += ms; }, credentials: () => ({ Cookie: cookie, 'X-CSRF-Token': csrf, Origin: 'http://portfolio.test' }) };
}

test('seed migration preserves existing content and never reseeds deleted content after restart', () => {
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-cms-'));
  try {
    const path = join(dir, 'content.sqlite');
    let db = openStore(path);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM content WHERE kind='projects'").get().n, 4);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM content WHERE kind='skills'").get().n, 16);
    for (const row of db.prepare('SELECT * FROM content').all()) assert.doesNotThrow(() => validateContent(row.kind, JSON.parse(row.body)));
    db.prepare("DELETE FROM content WHERE kind='projects'").run();
    db.close();
    db = openStore(path);
    assert.equal(db.prepare("SELECT COUNT(*) AS n FROM content WHERE kind='projects'").get().n, 0);
    db.close();
  } finally { rmSync(dir, { recursive: true }); }
});

test('authentication, origin, CSRF, logout and expiry protect admin access', async t => {
  const f = await fixture(t);
  assert.equal((await f.request('/api/admin/content/projects')).response.status, 401);
  assert.equal((await f.request('/api/admin/login', 'POST', { email: 'admin@example.com', password: 'bad' })).response.status, 401);
  assert.equal((await f.request('/api/admin/login', 'POST', {}, { Origin: 'https://evil.test' })).response.status, 403);
  const login = await f.login();
  assert.match(login.response.headers.get('set-cookie'), /HttpOnly; SameSite=Strict/);
  assert.ok(!f.db.prepare('SELECT token_hash FROM sessions').get().token_hash.includes(f.credentials().Cookie.split('=')[1]));
  assert.equal((await f.request('/api/admin/session')).data.email, 'admin@example.com');
  assert.equal((await f.request('/api/admin/content/projects', 'POST', {}, { 'X-CSRF-Token': '' })).response.status, 403);
  assert.equal((await f.request('/api/admin/logout', 'POST')).response.status, 200);
  assert.equal((await f.request('/api/admin/session')).response.status, 401);
  await f.login();
  f.advance(8 * 60 * 60 * 1000 + 1);
  assert.equal((await f.request('/api/admin/session')).response.status, 401);
});

test('projects can be drafted, published, edited, unpublished and deleted with stale-write protection', async t => {
  const f = await fixture(t);
  await f.login();
  const content = { ...emptyContent('projects'), title: 'A new project', category: 'Backend', summary: 'A real project summary.' };
  const draft = await f.request('/api/admin/content/projects', 'POST', { content, published: false, position: 0 });
  assert.equal(draft.response.status, 201);
  const id = draft.data.item.id;
  assert.equal((await f.request('/api/content')).data.projects.some(p => p.id === id), false);
  const published = await f.request(`/api/admin/content/projects/${id}`, 'PUT', { content, published: true, position: 0, version: 1 });
  assert.equal(published.response.status, 200);
  assert.equal((await f.request('/api/content')).data.projects.find(p => p.id === id).title, content.title);
  assert.equal((await f.request(`/api/admin/content/projects/${id}`, 'PUT', { content, published: true, position: 0, version: 1 })).response.status, 409);
  assert.equal((await f.request(`/api/admin/content/projects/${id}`, 'PUT', { content, published: false, position: 0, version: 2 })).response.status, 200);
  assert.equal((await f.request('/api/content')).data.projects.some(p => p.id === id), false);
  assert.equal((await f.request(`/api/admin/content/projects/${id}`, 'DELETE', { version: 1 })).response.status, 409);
  assert.equal((await f.request(`/api/admin/content/projects/${id}`, 'DELETE', { version: 3 })).response.status, 200);
  assert.equal((await f.request('/api/admin/content/projects')).data.items.some(p => p.id === id), false);
});

test('skills and experience validate content and appear in public display order', async t => {
  const f = await fixture(t);
  await f.login();
  const skill = { ...emptyContent('skills'), name: 'Testing', context: 'Integration tests' };
  assert.equal((await f.request('/api/admin/content/skills', 'POST', { content: skill, published: true, position: 100 })).response.status, 201);
  assert.equal((await f.request('/api/content')).data.skills.at(-1).name, 'Testing');
  const role = { ...emptyContent('experience'), role: 'Engineer', company: 'Example', summary: 'Built APIs', startDate: '2026-05' };
  assert.equal((await f.request('/api/admin/content/experience', 'POST', { content: role, published: true, position: 0 })).response.status, 201);
  assert.equal((await f.request('/api/content')).data.experience[0].role, 'Engineer');
  for (const invalid of [{ ...role, endDate: '2026-01' }, { ...role, url: 'javascript:alert(1)' }, { ...role, company: '' }]) {
    assert.equal((await f.request('/api/admin/content/experience', 'POST', { content: invalid, published: true, position: 0 })).response.status, 400);
  }
  assert.equal((await f.request('/api/admin/content/skills', 'POST', '{bad json')).response.status, 400);
  assert.equal((await f.request('/api/admin/content/skills', 'POST', 'x'.repeat(140000))).response.status, 413);
  assert.equal((await f.request('/api/admin/content/skills')).response.status, 200);
});

test('uploads require authentication, enforce size and format, and serve images', async t => {
  const f = await fixture(t);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aKAAAAABJRU5ErkJggg==', 'base64');
  let response = await fetch(f.url + '/api/admin/media', { method: 'POST', headers: { Origin: 'http://portfolio.test' }, body: png });
  assert.equal(response.status, 401); await response.arrayBuffer();
  await f.login();
  response = await fetch(f.url + '/api/admin/media', { method: 'POST', headers: f.credentials(), body: '<svg onload="alert(1)"></svg>' });
  assert.equal(response.status, 415); await response.arrayBuffer();
  response = await fetch(f.url + '/api/admin/media', { method: 'POST', headers: f.credentials(), body: Buffer.alloc(5 * 1024 * 1024 + 1) });
  assert.equal(response.status, 413); await response.arrayBuffer();
  response = await fetch(f.url + '/api/admin/media', { method: 'POST', headers: f.credentials(), body: png });
  assert.equal(response.status, 201);
  const { url } = await response.json();
  const image = await fetch(f.url + url);
  assert.equal(image.headers.get('content-type'), 'image/png');
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), png);
});

test('login throttling cannot be bypassed by spoofing forwarded addresses', async t => {
  const f = await fixture(t);
  for (let index = 0; index < 8; index++) assert.equal((await f.request('/api/admin/login', 'POST', {}, { 'X-Forwarded-For': `192.0.2.${index}` })).response.status, 400);
  const result = await f.request('/api/admin/login', 'POST', {}, { 'X-Forwarded-For': '192.0.2.100' });
  assert.equal(result.response.status, 429);
  assert.equal(result.response.headers.get('retry-after'), '900');
});

test('production requires HTTPS origin and marks session cookies Secure', async t => {
  const db = openStore(':memory:');
  assert.throws(() => createCmsHandler(db, { secure: true }), /PUBLIC_ORIGIN/);
  db.close();
  const f = await fixture(t, { secure: true, origin: 'https://portfolio.test' });
  const result = await f.request('/api/admin/login', 'POST', { email: 'admin@example.com', password: 'a-test-password-only' }, { Origin: 'https://portfolio.test' });
  assert.equal(result.response.status, 200);
  assert.match(result.response.headers.get('set-cookie'), /^__Host-portfolio_admin=.*; Secure$/);
});

test('full Node server serves the dashboard, seeded portfolio, images, and existing demo chat', async t => {
  const { spawn } = await import('node:child_process');
  const { readFileSync } = await import('node:fs');
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-server-'));
  const child = spawn(process.execPath, ['server/index.mjs'], {
    env: { ...process.env, CMS_DB_PATH: join(dir, 'portfolio.sqlite'), PORT: '0', HOST: '127.0.0.1', NODE_ENV: 'test', PUBLIC_ORIGIN: '', AIML_API_KEY: '', AIML_MODEL: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(async () => {
    if (child.exitCode === null) { const stopped = once(child, 'exit'); child.kill('SIGTERM'); await stopped; }
    rmSync(dir, { recursive: true, force: true });
  });
  const url = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Server startup timed out.')), 10000);
    child.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
    });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited early: ${code}`)); });
  });
  let response = await fetch(url + '/api/health');
  assert.equal((await response.json()).chatMode, 'demo');
  response = await fetch(url + '/api/content');
  assert.equal((await response.json()).projects.length, 4);
  response = await fetch(url + '/api/admin/session');
  assert.equal(response.status, 401); await response.arrayBuffer();
  response = await fetch(url + '/api/admin/login', { method: 'POST', headers: { Origin: url, 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'someone@example.com', password: 'unused' }) });
  assert.equal(response.status, 503); await response.arrayBuffer();
  response = await fetch(url + '/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'What are his skills?' }] }) });
  const chat = await response.json();
  assert.equal(chat.mode, 'demo'); assert.equal(typeof chat.message, 'string');
  // The integration test works before a build too; when dist exists, verify routing.
  try { readFileSync('dist/index.html'); } catch { return; }
  response = await fetch(url + '/admin');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow');
  assert.match(await response.text(), /<div id="root"><\/div>/);
  response = await fetch(url + '/projects/ahnyar-house-preview.webp');
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('content-type'), 'image/webp'); await response.arrayBuffer();
});

test('chat-only deployment handles CORS without creating a CMS database or exposing admin routes', async t => {
  const { spawn } = await import('node:child_process');
  const { existsSync } = await import('node:fs');
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-chat-'));
  const databasePath = join(dir, 'must-not-exist.sqlite');
  const child = spawn(process.execPath, ['server/start-chat.mjs'], {
    env: { ...process.env, CMS_DB_PATH: databasePath, PORT: '0', HOST: '127.0.0.1', NODE_ENV: 'production', PUBLIC_ORIGIN: 'https://portfolio.test', AIML_API_KEY: '', AIML_MODEL: '' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  t.after(async () => {
    if (child.exitCode === null) { const stopped = once(child, 'exit'); child.kill('SIGTERM'); await stopped; }
    rmSync(dir, { recursive: true, force: true });
  });
  const url = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error('Chat startup timed out.')), 10000);
    child.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/http:\/\/localhost:(\d+)/);
      if (match) { clearTimeout(timer); resolve(`http://127.0.0.1:${match[1]}`); }
    });
    child.once('error', error => { clearTimeout(timer); reject(error); });
    child.once('exit', code => { clearTimeout(timer); reject(new Error(`Server exited early: ${code}`)); });
  });
  assert.equal(existsSync(databasePath), false);
  for (const path of ['/admin', '/api/admin/session', '/api/content', '/media/missing']) {
    const response = await fetch(url + path);
    assert.equal(response.status, 404); await response.arrayBuffer();
  }
  let response = await fetch(url + '/api/chat', { method: 'OPTIONS', headers: { Origin: 'https://portfolio.test', 'Access-Control-Request-Method': 'POST' } });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://portfolio.test');
  response = await fetch(url + '/api/chat', { method: 'POST', headers: { Origin: 'https://evil.test', 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(response.status, 403); await response.arrayBuffer();
  response = await fetch(url + '/api/chat', { method: 'POST', headers: { Origin: 'https://portfolio.test', 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'What are his skills?' }] }) });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://portfolio.test');
  assert.equal((await response.json()).mode, 'demo');
  response = await fetch(url + '/api/contact', { method: 'OPTIONS', headers: { Origin: 'https://portfolio.test' } });
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://portfolio.test');
  response = await fetch(url + '/api/contact', { method: 'POST', headers: { Origin: 'https://evil.test', 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(response.status, 403); await response.arrayBuffer();
  response = await fetch(url + '/api/contact', { method: 'POST', headers: { Origin: 'https://portfolio.test', 'Content-Type': 'application/json' }, body: '{}' });
  assert.equal(response.status, 400);
  assert.equal(response.headers.get('access-control-allow-origin'), 'https://portfolio.test');
  await response.arrayBuffer();
});
