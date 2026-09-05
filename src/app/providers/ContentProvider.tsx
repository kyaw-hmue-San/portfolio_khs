import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Skill = { id: string; name: string; icon: string; color: string; context: string; projects: string };
export type ExperienceItem = { id: string; role: string; company: string; location: string; startDate: string; endDate: string; summary: string; url: string };
export type ProjectContent = {
  id: string; title: string; category: string; summary: string; stack: string[];
  accent: 'amber' | 'emerald' | 'blue' | 'violet'; icon: 'Layers' | 'Rocket' | 'GraduationCap' | 'Smartphone';
  featured?: boolean; coverImage?: string; coverAlt?: string; demoUrl?: string; sourceUrl?: string;
  sections: { overview: string; problem: string; solution: string; architecture: string; decisions: string[]; challenges: string[]; contribution: string; learned: string; visuals: string[] };
};
type Content = { projects: ProjectContent[]; skills: Skill[]; experience: ExperienceItem[] };
type State = Content & { loading: boolean; error: boolean; retry: () => void };
const ContentContext = createContext<State>({ projects: [], skills: [], experience: [], loading: true, error: false, retry: () => {} });
export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content>({ projects: [], skills: [], experience: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 12000);
    let active = true;
    setLoading(true); setError(false);
    const source = import.meta.env.DEV || import.meta.env.MODE === 'dashboard' ? '/api/content' : '/content/portfolio.json';
    fetch(source, { signal: controller.signal, cache: 'no-cache' }).then(async response => {
      if (!response.ok) throw new Error('Content unavailable');
      const data = await response.json();
      if (!['projects', 'skills', 'experience'].every(key => Array.isArray(data[key]))) throw new Error('Invalid content');
      if (active) setContent(data);
    }).catch(() => { if (active) setError(true); })
      .finally(() => { clearTimeout(timer); if (active) setLoading(false); });
    return () => { active = false; clearTimeout(timer); controller.abort(); };
  }, [attempt]);
  return <ContentContext.Provider value={{ ...content, loading, error, retry: () => setAttempt(value => value + 1) }}>{children}</ContentContext.Provider>;
}
export const useContent = () => useContext(ContentContext);
export function ContentStatus() {
  const { loading, error, retry } = useContent();
  if (!loading && !error) return null;
  return <p role={error ? 'alert' : 'status'} style={{ color: 'var(--portfolio-text-muted)', padding: '24px 0' }}>{loading ? 'Loading portfolio content…' : <>Portfolio content is temporarily unavailable. <button type="button" onClick={retry} style={{ textDecoration: 'underline' }}>Try again</button></>}</p>;
}
