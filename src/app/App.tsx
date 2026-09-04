import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { EngineeringPhilosophy } from "./components/EngineeringPhilosophy";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Education } from "./components/Education";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { ChatAssistant } from "./components/ChatAssistant";

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
  return (
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
        <Education />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
      <ChatAssistant />
    </div>
  );
}
