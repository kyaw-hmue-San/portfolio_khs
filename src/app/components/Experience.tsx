import { BriefcaseBusiness, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useContent } from '../providers/ContentProvider';

export function Experience() {
  const { experience } = useContent();
  const { i18n } = useTranslation();
  if (!experience.length) return null;
  const locale = (i18n.resolvedLanguage || 'en').split('-')[0];
  const labels = {
    en: { label: 'EXPERIENCE', title: 'Where I’ve', accent: 'contributed.', intro: 'Roles, responsibilities, and the work behind them.', present: 'Present', website: 'Company website' },
    my: { label: 'အတွေ့အကြုံ', title: 'ပါဝင်လုပ်ဆောင်ခဲ့သော', accent: 'လုပ်ငန်းများ။', intro: 'လုပ်ငန်းတာဝန်များနှင့် လုပ်ဆောင်ခဲ့သောအလုပ်များ။', present: 'လက်ရှိ', website: 'ကုမ္ပဏီဝဘ်ဆိုဒ်' },
    th: { label: 'ประสบการณ์', title: 'งานที่ได้', accent: 'มีส่วนร่วม', intro: 'บทบาท ความรับผิดชอบ และผลงานที่ผ่านมา', present: 'ปัจจุบัน', website: 'เว็บไซต์บริษัท' },
  }[locale] || { label: 'EXPERIENCE', title: 'Where I’ve', accent: 'contributed.', intro: 'Roles, responsibilities, and the work behind them.', present: 'Present', website: 'Company website' };
  const month = (value: string) => new Date(`${value}-01T00:00:00Z`).toLocaleDateString(locale, { month: 'short', year: 'numeric', timeZone: 'UTC' });
  return <section id="experience" className="education-section px-4 sm:px-6">
    <div className="max-w-6xl mx-auto education-layout">
      <div className="education-intro"><span className="education-label">{labels.label}</span><h2>{labels.title}<br /><em>{labels.accent}</em></h2><p>{labels.intro}</p></div>
      <ol className="education-path" aria-label={labels.label}>{experience.map((item, index) => <li key={item.id}>
        <article className="education-card">
          <div className="education-card-topline"><span className="education-card-icon"><BriefcaseBusiness size={17} /></span><span className="education-eyebrow">{item.company}</span><span><time dateTime={item.startDate}>{month(item.startDate)}</time> – {item.endDate ? <time dateTime={item.endDate}>{month(item.endDate)}</time> : labels.present}</span></div>
          <div className="education-card-copy"><h3>{item.role}</h3><p className="education-focus" style={{ whiteSpace: 'pre-line' }}>{item.summary}</p><p className="education-meta">{item.location}{item.url && <a href={item.url} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>{labels.website}<ArrowUpRight size={14} /></a>}</p></div>
          <span className="education-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        </article>
      </li>)}</ol>
    </div>
  </section>;
}
