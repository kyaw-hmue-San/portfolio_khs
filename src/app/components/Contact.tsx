import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";

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
    label: "Email me",
    value: EMAIL,
    note: "Best for opportunities and project conversations",
    href: `mailto:${EMAIL}`,
    accent: "#f59e0b",
  },
  {
    Icon: Linkedin,
    label: "Connect on LinkedIn",
    value: "kyaw-hmue-san",
    note: "Professional profile and experience",
    href: "https://www.linkedin.com/in/kyaw-hmue-san-448a92270/",
    accent: "#60a5fa",
  },
  {
    Icon: Github,
    label: "Explore GitHub",
    value: "kyaw-hmue-San",
    note: "Code, repositories, and ongoing work",
    href: "https://github.com/kyaw-hmue-San",
    accent: "rgba(255,255,255,0.72)",
  },
];

export function Contact() {
  return (
    <section id="contact" className="contact-section px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="contact-layout">
          <Reveal className="contact-intro">
            <span className="contact-label">Let&apos;s connect</span>
            <h2>
              Have something<br />
              <em>worth building?</em>
            </h2>
            <p>
              I&apos;m open to internships, junior software engineering roles,
              and conversations about useful products.
            </p>
            <div className="contact-availability">
              <span aria-hidden="true" />
              Available for opportunities
            </div>
          </Reveal>

          <div className="contact-links">
            {CONTACT_LINKS.map(({ Icon, label, value, note, href, accent }, index) => (
              <Reveal key={label} delay={0.07 + index * 0.07}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="contact-link"
                >
                  <span className="contact-link-icon" style={{ color: accent }}>
                    <Icon size={19} aria-hidden="true" />
                  </span>
                  <span className="contact-link-copy">
                    <strong>{label}</strong>
                    <span>{value}</span>
                    <small>{note}</small>
                  </span>
                  <ArrowUpRight className="contact-link-arrow" size={16} aria-hidden="true" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
