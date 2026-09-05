// Shared field definitions keep dashboard forms and server validation aligned.
export const collections = {
  projects: {
    label: 'Projects', title: 'title', fields: [
      ['title', 'Project title', 'text', true], ['category', 'Category', 'text', true],
      ['summary', 'Summary', 'textarea', true], ['stack', 'Technologies (one per line)', 'list'],
      ['coverImage', 'Cover image URL', 'image'], ['coverAlt', 'Image description', 'text'],
      ['demoUrl', 'Demo URL', 'url'], ['sourceUrl', 'Source code URL', 'url'],
      ['accent', 'Accent', 'select', ['amber', 'emerald', 'blue', 'violet']],
      ['icon', 'Icon', 'select', ['Layers', 'Rocket', 'GraduationCap', 'Smartphone']],
      ['featured', 'Featured project', 'checkbox'],
      ...['overview', 'problem', 'solution', 'architecture', 'contribution', 'learned'].map(key => [`sections.${key}`, key[0].toUpperCase() + key.slice(1), 'textarea']),
      ...['decisions', 'challenges', 'visuals'].map(key => [`sections.${key}`, `${key[0].toUpperCase() + key.slice(1)} (one per line)`, 'list']),
    ],
  },
  skills: {
    label: 'Skills', title: 'name', fields: [
      ['name', 'Skill name', 'text', true], ['context', 'How you use it', 'textarea', true],
      ['projects', 'Related projects', 'text'], ['icon', 'Icon URL', 'image'], ['color', 'Accent color', 'color'],
    ],
  },
  experience: {
    label: 'Experience', title: 'role', fields: [
      ['role', 'Job title', 'text', true], ['company', 'Company', 'text', true],
      ['location', 'Location', 'text'], ['startDate', 'Start month', 'month', true],
      ['endDate', 'End month (leave empty for present)', 'month'],
      ['summary', 'Responsibilities and achievements', 'textarea', true],
      ['url', 'Company URL', 'url'],
    ],
  },
};

export function getField(object, key) {
  return key.split('.').reduce((value, part) => value?.[part], object);
}
export function setField(object, key, value) {
  const parts = key.split('.');
  let target = object;
  for (const part of parts.slice(0, -1)) target = target[part] ??= {};
  target[parts.at(-1)] = value;
}
export function emptyContent(kind) {
  const content = {};
  for (const [key, , type, options] of collections[kind].fields) {
    setField(content, key, type === 'list' ? [] : type === 'checkbox' ? false : type === 'select' ? options[0] : type === 'color' ? '#f59e0b' : '');
  }
  return content;
}

export function validateContent(kind, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Content must be an object.');
  const result = {};
  for (const [key, label, type, option] of collections[kind].fields) {
    let value = getField(input, key);
    if (type === 'checkbox') {
      if (typeof value !== 'boolean') throw new Error(`${label} must be true or false.`);
    } else if (type === 'list') {
      if (!Array.isArray(value) || value.length > 40 || value.some(v => typeof v !== 'string' || v.length > 1500)) throw new Error(`${label} must contain up to 40 short lines.`);
      value = value.map(v => v.trim()).filter(Boolean);
    } else {
      if (typeof value !== 'string') throw new Error(`${label} must be text.`);
      value = value.trim();
      if (value.length > (type === 'textarea' ? 8000 : 500)) throw new Error(`${label} is too long.`);
      if (option === true && !value) throw new Error(`${label} is required.`);
      if (type === 'select' && !option.includes(value)) throw new Error(`${label} is invalid.`);
      if (type === 'color' && !/^#[a-f0-9]{6}$/i.test(value)) throw new Error('Use a six-digit hex color.');
      if (type === 'month' && value && !/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) throw new Error(`${label} must be YYYY-MM.`);
      if (['url', 'image'].includes(type) && value) {
        const local = type === 'image' && /^\/(?!\/)[a-zA-Z0-9/_\-.]+$/.test(value) && !value.includes('..');
        let external = false;
        try { const url = new URL(value); external = ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password; } catch { /* handled below */ }
        if (!local && !external) throw new Error(`${label} must be an HTTP(S) URL${type === 'image' ? ' or a local image path' : ''}.`);
      }
    }
    setField(result, key, value);
  }
  if (kind === 'experience' && result.endDate && result.endDate < result.startDate) throw new Error('End month must follow the start month.');
  return result;
}
