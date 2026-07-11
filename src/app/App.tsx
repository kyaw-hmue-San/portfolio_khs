import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { EngineeringPhilosophy } from "./components/EngineeringPhilosophy";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Education } from "./components/Education";
import { Resume } from "./components/Resume";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

function SectionDivider() {
  return (
    <div className="relative px-6">
      <div className="max-w-6xl mx-auto">
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)" }} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#07090f", color: "rgba(255,255,255,0.9)" }}
    >
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
        <Resume />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
