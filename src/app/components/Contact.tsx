import { InquiryForm } from "./InquiryForm";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

const EMAIL = "kyawhmuesan@gmail.com";

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.52, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const CONTACT_LINKS = [
  {
    Icon: Mail,
    labelKey: "contactSection.email",
    href: `mailto:${EMAIL}`,
    accent: "#f59e0b",
  },
  {
    Icon: Linkedin,
    labelKey: "contactSection.linkedin",
    href: "https://www.linkedin.com/in/kyaw-hmue-san-448a92270/",
    accent: "#60a5fa",
  },
  {
    Icon: Github,
    labelKey: "contactSection.github",
    href: "https://github.com/kyaw-hmue-San",
    accent: "rgb(var(--portfolio-ink-rgb) / 0.72)",
  },
];

export function Contact() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="contact-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="contact-layout">
          <Reveal className="contact-intro">
            <span className="contact-label">{t("contactSection.label")}</span>
            <h2>
              {t("contactSection.title")}<br />
              <em>{t("contactSection.accent")}</em>
            </h2>
            <p>{t("contactSection.intro")}</p>
            <div className="contact-availability">
              <span aria-hidden="true" />
              {t("contactSection.available")}
            </div>
            <div className="contact-socials">
              {CONTACT_LINKS.map(({ Icon, labelKey, href, accent }) => (
                <a
                  key={labelKey}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="contact-social-icon"
                  style={{ color: accent }}
                  aria-label={t(labelKey)}
                  title={t(labelKey)}
                >
                  <Icon size={21} aria-hidden="true" />
                </a>
              ))}
            </div>
          </Reveal>
          <InquiryForm />
        </div>
      </div>
    </section>
  );
}
