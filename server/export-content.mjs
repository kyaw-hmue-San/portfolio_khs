import { DatabaseSync } from 'node:sqlite';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, renameSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { collections, validateContent } from '../shared/content.mjs';

export function exportContent(databasePath, publicPath) {
  // Read-only: a mistyped path must not create an empty database and replace the export.
  const db = new DatabaseSync(databasePath, { readOnly: true });
  const images = new Map();
  const snapshot = {};
  db.exec('BEGIN');
  try {
    for (const kind of Object.keys(collections)) {
      snapshot[kind] = db.prepare('SELECT id,body FROM content WHERE kind=? AND published=1 ORDER BY position,id').all(kind).map(row => {
        const content = validateContent(kind, JSON.parse(row.body));
        for (const [key, , type] of collections[kind].fields) {
          if (type !== 'image' || !content[key]?.startsWith('/media/')) continue;
          const image = db.prepare('SELECT mime,body FROM media WHERE id=?').get(content[key].slice(7));
          if (!image) throw new Error(`Missing uploaded image for ${kind}/${row.id}; export cancelled.`);
          const extension = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[image.mime];
          if (!extension) throw new Error('Unsupported uploaded image format.');
          const name = `${createHash('sha256').update(image.body).digest('hex')}.${extension}`;
          images.set(name, image.body);
          content[key] = `/content/images/${name}`;
        }
        return { id: row.id, ...content };
      });
    }
    db.exec('COMMIT');
  } finally { db.close(); }
  // Validate everything first; publish JSON last so a failed export preserves the old snapshot.
  const output = join(publicPath, 'content');
  mkdirSync(join(output, 'images'), { recursive: true });
  for (const [name, bytes] of images) writeFileSync(join(output, 'images', name), bytes);
  const pending = join(output, 'portfolio.json.tmp');
  writeFileSync(pending, JSON.stringify(snapshot, null, 2) + '\n');
  renameSync(pending, join(output, 'portfolio.json'));
  return Object.fromEntries(Object.entries(snapshot).map(([kind, rows]) => [kind, rows.length]));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const counts = exportContent(process.env.CMS_DB_PATH || fileURLToPath(new URL('../data/portfolio.sqlite', import.meta.url)), fileURLToPath(new URL('../public', import.meta.url)));
    console.log('Exported published content:', counts);
    console.log('Review public/content, then commit and push it with your site updates. Drafts and credentials were not exported.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
