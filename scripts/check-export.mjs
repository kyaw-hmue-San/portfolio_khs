import { readFileSync, existsSync } from 'node:fs';
import { collections, validateContent } from '../shared/content.mjs';
const data = JSON.parse(readFileSync(new URL('../public/content/portfolio.json', import.meta.url), 'utf8'));
for (const kind of Object.keys(collections)) {
  if (!Array.isArray(data[kind])) throw new Error(`Export missing ${kind}. Run npm run content:export locally.`);
  for (const row of data[kind]) {
    validateContent(kind, row);
    for (const [key, , type] of collections[kind].fields) {
      if (type !== 'image' || !row[key]?.startsWith('/')) continue;
      if (row[key].startsWith('/media/') || !existsSync(new URL(`../public${row[key]}`, import.meta.url))) throw new Error(`Export references an unavailable image: ${row[key]}`);
    }
  }
}
console.log('Public content export validated.');
