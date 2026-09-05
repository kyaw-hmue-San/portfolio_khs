import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { emptyContent } from '../shared/content.mjs';

const derive = promisify(scrypt);
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await derive(password, salt, 64);
  return `${salt}:${hash.toString('hex')}`;
}
export async function checkPassword(password, stored) {
  const [salt, expected] = stored.split(':');
  const actual = await derive(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}
export function openStore(path = process.env.CMS_DB_PATH || fileURLToPath(new URL('../data/portfolio.sqlite', import.meta.url))) {
  if (path !== ':memory:') mkdirSync(dirname(resolve(path)), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY CHECK(id=1), email TEXT NOT NULL, password_hash TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS content (
      id TEXT PRIMARY KEY, kind TEXT NOT NULL CHECK(kind IN ('projects','skills','experience')),
      body TEXT NOT NULL, published INTEGER NOT NULL DEFAULT 0 CHECK(published IN (0,1)),
      position INTEGER NOT NULL DEFAULT 0, version INTEGER NOT NULL DEFAULT 1, updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_content_listing ON content(kind, published, position);
    CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, mime TEXT NOT NULL, body BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS migrations (id INTEGER PRIMARY KEY);
  `);
  if (!db.prepare('SELECT id FROM migrations WHERE id = 1').get()) {
    const seed = JSON.parse(readFileSync(new URL('../shared/seed.json', import.meta.url), 'utf8'));
    db.exec('BEGIN IMMEDIATE');
    try {
      const insert = db.prepare('INSERT INTO content(id,kind,body,published,position,updated_at) VALUES(?,?,?,1,?,?)');
      for (const [kind, items] of Object.entries(seed)) items.forEach(({ id, ...body }, index) => {
        insert.run(id, kind, JSON.stringify({ ...emptyContent(kind), ...body }), index, new Date().toISOString());
      });
      db.prepare('INSERT INTO migrations(id) VALUES(1)').run();
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  return db;
}
export function contentRow(row) {
  return { id: row.id, ...JSON.parse(row.body), published: Boolean(row.published), position: row.position, version: row.version, updatedAt: row.updated_at };
}
