import { createInterface } from 'node:readline/promises';
import { Writable } from 'node:stream';
import { openStore, hashPassword } from './store.mjs';

let muted = false;
const output = new Writable({ write(chunk, encoding, done) { if (!muted) process.stdout.write(chunk, encoding); done(); } });
const prompt = createInterface({ input: process.stdin, output, terminal: true });
let db;
try {
  if (!process.stdin.isTTY) throw new Error('Run this command in an interactive terminal.');
  const email = (await prompt.question('Admin email: ')).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error('Enter a valid email.');
  process.stdout.write('Password (at least 12 characters, hidden): ');
  muted = true;
  const password = await prompt.question('');
  muted = false;
  process.stdout.write('\n');
  if (password.length < 12 || password.length > 256) throw new Error('Use a password between 12 and 256 characters.');
  process.stdout.write('Repeat password (hidden): ');
  muted = true;
  const confirmation = await prompt.question('');
  muted = false;
  process.stdout.write('\n');
  if (password !== confirmation) throw new Error('Passwords did not match.');
  db = openStore();
  const passwordHash = await hashPassword(password);
  db.exec('BEGIN IMMEDIATE');
  db.prepare('INSERT INTO admin(id,email,password_hash) VALUES(1,?,?) ON CONFLICT(id) DO UPDATE SET email=excluded.email,password_hash=excluded.password_hash').run(email, passwordHash);
  db.exec('DELETE FROM sessions; COMMIT;');
  console.log('Admin saved. Open /admin on your running portfolio to sign in.');
} catch (error) { muted = false; console.error(error.message); process.exitCode = 1; }
finally { prompt.close(); db?.close(); }
