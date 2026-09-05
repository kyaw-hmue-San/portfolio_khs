import { lazy, Suspense } from "react";
import { ContentProvider } from "./providers/ContentProvider";
import { Experience } from "./components/Experience";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { EngineeringPhilosophy } from "./components/EngineeringPhilosophy";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Education } from "./components/Education";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { ChatAssistant } from "./components/ChatAssistant";

const Admin = (import.meta.env.DEV || import.meta.env.MODE === "dashboard") ? lazy(() => import("./components/Admin")) : null;

function SectionDivider() {
  return (
    <div className="relative px-6" aria-hidden="true">
      <div className="max-w-6xl mx-auto">
        <div className="section-divider" />
      </div>
    </div>
  );
}
export default function App() {
  if (/^\/admin(?:\/|$)/.test(window.location.pathname)) {
    if (!Admin) return <main style={{ padding: 40 }}><p>The dashboard is available on your local computer.</p><a href="/">Back to portfolio</a></main>;
    return <Suspense fallback={<p role="status">Loading dashboard…</p>}><Admin /></Suspense>;
  }
  return (
    <ContentProvider>
    <div className="portfolio-shell">
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <EngineeringPhilosophy />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <Experience />
        <Education />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
    </ContentProvider>
  );
}
