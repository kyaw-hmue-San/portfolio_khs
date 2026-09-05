import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { openStore } from './store.mjs';
import { exportContent } from './export-content.mjs';

test('export contains only published fields and referenced images, without CMS secrets or drafts', () => {
  const dir = mkdtempSync(join(tmpdir(), 'portfolio-export-'));
  const path = join(dir, 'cms.sqlite');
  const output = join(dir, 'public');
  const db = openStore(path);
  try {
    db.prepare('INSERT INTO admin VALUES(1,?,?)').run('private-admin@example.test', 'private-password-hash');
    db.prepare('INSERT INTO sessions VALUES(?,?,?)').run('private-session', 'private-csrf', Date.now());
    db.prepare("UPDATE content SET published=0, body=json_set(body,'$.title','PRIVATE DRAFT') WHERE id='cosmiccraft'").run();
    db.prepare('INSERT INTO media VALUES(?,?,?)').run('published-image', 'image/png', Buffer.from('published image bytes'));
    db.prepare('INSERT INTO media VALUES(?,?,?)').run('draft-image', 'image/png', Buffer.from('private draft bytes'));
    db.prepare("UPDATE content SET body=json_set(body,'$.coverImage','/media/published-image') WHERE id='ahnyar-house'").run();
    db.prepare("UPDATE content SET body=json_set(body,'$.coverImage','/media/draft-image') WHERE id='cosmiccraft'").run();
    const counts = exportContent(path, output);
    assert.deepEqual(counts, { projects: 3, skills: 16, experience: 0 });
    const raw = readFileSync(join(output, 'content/portfolio.json'), 'utf8');
    assert.doesNotMatch(raw, /PRIVATE DRAFT|private-|password|csrf|publishedAt|updatedAt|version/);
    const data = JSON.parse(raw);
    const image = data.projects.find(p => p.id === 'ahnyar-house').coverImage;
    assert.match(image, /^\/content\/images\/[a-f0-9]{64}\.png$/);
    assert.equal(readFileSync(join(output, image), 'utf8'), 'published image bytes');
    db.prepare("UPDATE content SET body=json_set(body,'$.coverImage','/media/missing') WHERE id='ahnyar-house'").run();
    assert.throws(() => exportContent(path, output), /Missing uploaded image/);
    assert.equal(readFileSync(join(output, 'content/portfolio.json'), 'utf8'), raw);
    db.prepare('UPDATE content SET published=0').run();
    exportContent(path, output);
    assert.deepEqual(JSON.parse(readFileSync(join(output, 'content/portfolio.json'))), { projects: [], skills: [], experience: [] });
  } finally { db.close(); rmSync(dir, { recursive: true, force: true }); }
});
