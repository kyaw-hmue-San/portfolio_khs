import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, BriefcaseBusiness, FolderKanban, Layers, LogOut, Plus, Save, Trash2 } from 'lucide-react';
import { collections, emptyContent, getField, setField } from '../../../shared/content.mjs';
import '../../styles/admin.css';

type Kind = 'projects' | 'skills' | 'experience';
type Item = { id?: string; published: boolean; position: number; version?: number; [key: string]: any };
type Session = { email: string; csrf: string };
const icons = { projects: FolderKanban, skills: Layers, experience: BriefcaseBusiness };

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [kind, setKind] = useState<Kind>('projects');
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState<Item | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const loadId = useRef(0);
  const descriptor = collections[kind];

  async function api(path: string, method = 'GET', body?: unknown, raw = false) {
    const response = await fetch(path, { method, credentials: 'same-origin', headers: {
      ...(body !== undefined && !raw ? { 'Content-Type': 'application/json' } : {}),
      ...(session ? { 'X-CSRF-Token': session.csrf } : {}),
    }, body: body === undefined ? undefined : raw ? body as BodyInit : JSON.stringify(body) });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status === 401) setSession(null);
      throw new Error(data?.error || 'Could not reach the portfolio server. Please try again.');
    }
    return data;
  }
  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/session').then(async response => {
      if (response.status === 401) return null;
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load admin session.');
      return data;
    }).then(data => { if (!cancelled) setSession(data); })
      .catch(() => { if (!cancelled) setError('Could not reach the portfolio API. Make sure the backend is running.'); })
      .finally(() => { if (!cancelled) setChecking(false); });
    const previous = document.title;
    document.title = 'Portfolio Studio · Admin';
    return () => { cancelled = true; document.title = previous; };
  }, []);
  async function load() {
    const id = ++loadId.current;
    setLoading(true);
    try {
      const data = await api(`/api/admin/content/${kind}`);
      if (id === loadId.current) setItems(data.items);
    } catch (err) { if (id === loadId.current) setError((err as Error).message); }
    finally { if (id === loadId.current) setLoading(false); }
  }
  useEffect(() => {
    if (session) { setItems([]); void load(); }
    return () => { loadId.current += 1; };
  }, [kind, session]);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [dirty]);
  const discard = () => !dirty || window.confirm('Discard your unsaved changes?');
  function choose(next: Item | null) {
    if (!discard()) return;
    setItem(next ? structuredClone(next) : null); setDirty(false); setError(''); setNotice('');
  }
  function change(key: string, value: unknown) {
    setItem(current => { const next = structuredClone(current!); setField(next, key, value); return next; });
    setDirty(true); setNotice('');
  }
  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const data = new FormData(event.currentTarget);
    try { setSession(await api('/api/admin/login', 'POST', { email: data.get('email'), password: data.get('password') })); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); if (!item) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const data = await api(`/api/admin/content/${kind}${item.id ? `/${item.id}` : ''}`, item.id ? 'PUT' : 'POST', { content: item, published: item.published, position: item.position, version: item.version });
      setItem(data.item); setDirty(false);
      setNotice(data.item.published ? 'Published locally. Export your content and deploy to update the live site.' : 'Draft saved. This item is hidden locally and excluded from the next export.');
      await load();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!item?.id || !window.confirm(`Delete “${item[descriptor.title]}”? This cannot be undone.`)) return;
    setBusy(true); setError('');
    try {
      await api(`/api/admin/content/${kind}/${item.id}`, 'DELETE', { version: item.version });
      setItem(null); setDirty(false); setNotice('Item deleted.'); await load();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }
  async function upload(file: File | undefined, key: string) {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('Choose an image smaller than 5 MB.'); return; }
    setBusy(true); setError('');
    try { const data = await api('/api/admin/media', 'POST', file, true); change(key, data.url); }
    catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  if (checking) return <main className="cms cms-signin"><p role="status">Loading your workspace…</p></main>;
  if (!session) return <main className="cms cms-signin">
    <form className="cms-login-card" onSubmit={signIn}>
      <span className="cms-brand-mark"><Layers size={24} /></span><p className="cms-kicker">KYAW HMUE SAN / PORTFOLIO</p>
      <h1>Welcome to your studio.</h1><p>Sign in to manage what the world sees.</p>
      {error && <div className="cms-error" role="alert">{error}</div>}
      <label>Email<input name="email" type="email" autoComplete="username" required autoFocus /></label>
      <label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={256} /></label>
      <button className="cms-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      <a href="/">Back to portfolio <ArrowUpRight size={15} /></a>
    </form>
  </main>;

  return <main className="cms cms-workspace">
    <aside className="cms-sidebar">
      <a className="cms-brand" href="/" target="_blank" rel="noreferrer"><span className="cms-brand-mark"><Layers size={20} /></span><span>Portfolio Studio<small>KYAW HMUE SAN</small></span></a>
      <p className="cms-kicker">CONTENT</p>
      <nav aria-label="Content collections">{(Object.keys(collections) as Kind[]).map(key => {
        const Icon = icons[key];
        return <button key={key} disabled={busy} className={kind === key ? 'active' : ''} aria-current={kind === key ? 'page' : undefined} onClick={() => {
          if (key === kind || !discard()) return;
          // Clear the previous collection before rendering the new field schema.
          // Doing this in an effect is too late: project rows have no skill name or job role.
          loadId.current += 1;
          setItems([]); setLoading(true);
          setKind(key); setItem(null); setDirty(false); setError(''); setNotice(''); setQuery('');
        }}><Icon size={18} />{collections[key].label}</button>;
      })}</nav>
      <div className="cms-account"><span>{session.email}</span><button disabled={busy} onClick={async () => {
        if (!discard()) return;
        setBusy(true);
        try { await api('/api/admin/logout', 'POST'); setSession(null); setItem(null); setDirty(false); setError(''); }
        catch (err) { setError((err as Error).message); }
        finally { setBusy(false); }
      }}><LogOut size={16} />Sign out</button></div>
    </aside>
    <div className="cms-main">
      <header className="cms-topbar"><span>Local editing workspace.</span><a href="/" target="_blank" rel="noreferrer">View portfolio <ArrowUpRight size={16} /></a></header>
      <div className="cms-page-heading"><div><p className="cms-kicker">MANAGE YOUR PORTFOLIO</p><h1>{descriptor.label}</h1><p>{loading ? 'Loading…' : `${items.length} items · ${items.filter(row => row.published).length} published`}</p></div>
        <button className="cms-primary" disabled={busy || loading} onClick={() => choose({ ...emptyContent(kind), published: false, position: items.length })}><Plus size={18} />Add {kind === 'projects' ? 'project' : kind === 'skills' ? 'skill' : 'experience'}</button>
      </div>
      {error && <div className="cms-error" role="alert">{error} <button disabled={busy} onClick={() => { if (discard()) { setItem(null); setDirty(false); setError(''); void load(); } }}>Reload list</button></div>}
      {notice && <div className="cms-success" role="status">{notice}</div>}
      <div className={`cms-content-grid ${item ? 'has-editor' : ''}`}>
        <section className="cms-list" aria-label={`${descriptor.label} list`}>
          <label className="cms-search">Search {descriptor.label.toLowerCase()}<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={`Find ${descriptor.label.toLowerCase()}…`} /></label>
          {!loading && items.length === 0 && <div className="cms-empty"><h2>Room for your next chapter.</h2><p>Add your first {kind === 'experience' ? 'role' : kind === 'projects' ? 'project' : 'skill'} and save it as a draft.</p></div>}
          {!loading && items.length > 0 && !items.some(row => row[descriptor.title].toLowerCase().includes(query.toLowerCase())) && <p className="cms-empty">No matching items.</p>}
          {items.filter(row => row[descriptor.title].toLowerCase().includes(query.toLowerCase())).map(row => <button disabled={busy} className={`cms-item ${row.id === item?.id ? 'selected' : ''}`} key={row.id} onClick={() => choose(row)}>
            {kind === 'projects' && row.coverImage && <img src={row.coverImage} alt="" />}
            <span className="cms-item-copy"><strong>{row[descriptor.title]}</strong><small>{row.category || row.company || row.context}</small><span className={`cms-badge ${row.published ? 'published' : ''}`}>{row.published ? 'Published' : 'Draft'}</span></span>
            <span className="cms-item-order">{row.position}</span>
          </button>)}
        </section>
        {item && <form className="cms-editor" onSubmit={save}>
          <header><div><p className="cms-kicker">{item.id ? 'EDIT CONTENT' : 'NEW CONTENT'}</p><h2>{item[descriptor.title] || 'Untitled'}</h2></div><button type="button" disabled={busy} onClick={() => choose(null)}>Close</button></header>
          <fieldset disabled={busy}>
            <div className="cms-publish-settings"><label>Visibility<select value={String(item.published)} onChange={e => change('published', e.target.value === 'true')}><option value="false">Draft — hidden</option><option value="true">Published — visible</option></select></label><label>Display order<input type="number" min={0} max={10000} required value={item.position} onChange={e => change('position', e.target.value === '' ? '' : Number(e.target.value))} /></label></div>
            <p className="cms-hint">Lower order numbers appear first. Saving as a draft hides the item locally and excludes it from the next export.</p>
            {descriptor.fields.map(([key, label, type, option]: any[]) => {
              const value = getField(item, key);
              const id = `cms-${key}`;
              return <div className="cms-field" key={key}>
                <label htmlFor={id}>{label}{option === true ? ' *' : ''}</label>
                {type === 'textarea' || type === 'list' ? <textarea id={id} rows={type === 'textarea' ? 4 : 3} required={option === true} maxLength={type === 'textarea' ? 8000 : undefined} value={type === 'list' ? value.join('\n') : value} onChange={e => change(key, type === 'list' ? e.target.value.split('\n') : e.target.value)} />
                  : type === 'select' ? <select id={id} value={value} onChange={e => change(key, e.target.value)}>{option.map((v: string) => <option key={v}>{v}</option>)}</select>
                  : type === 'checkbox' ? <input id={id} type="checkbox" checked={value} onChange={e => change(key, e.target.checked)} />
                  : <input id={id} type={type === 'image' ? 'text' : type} required={option === true} value={value} maxLength={500} onChange={e => change(key, e.target.value)} />}
                {type === 'image' && <div className="cms-upload"><label>Upload image<input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => { void upload(e.target.files?.[0], key); e.target.value = ''; }} /></label><small>PNG, JPEG or WebP · up to 5 MB. Uploaded images have public URLs, including images used in drafts.</small>{value && <img src={value} alt="Selected image preview" />}</div>}
              </div>;
            })}
          </fieldset>
          <footer><span className="cms-hint">{busy ? 'Working…' : dirty ? 'Unsaved changes' : item.id ? 'All changes saved' : 'Not saved yet'}</span><div>{item.id && <button className="cms-danger" type="button" disabled={busy} onClick={remove}><Trash2 size={16} />Delete</button>}<button className="cms-primary" disabled={busy}><Save size={16} />{busy ? 'Please wait…' : item.published ? 'Save & publish' : 'Save draft'}</button></div></footer>
        </form>}
      </div>
    </div>
  </main>;
}
