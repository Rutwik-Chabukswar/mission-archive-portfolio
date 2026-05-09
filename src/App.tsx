/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { HallwayLayout } from "./components/HallwayLayout";
import { Chatbot } from "./components/Chatbot";
import { motion } from "motion/react";

import { ArchiveHub } from "./components/ArchiveHub";

export default function App() {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Synchronize hash with active index for direct linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      const indexMap: Record<string, number> = {
        "hub": -1,
        "hero": 0,
        "about": 1,
        "experience": 2,
        "projects": 3,
        "skills": 4,
        "contact": 5
      };
      if (indexMap[hash] !== undefined) {
        setActiveIndex(indexMap[hash]);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    handleHashChange(); // Initial check
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const sections: ReactNode[] = [
    <Hero key="hero" onEnter={() => setActiveIndex(-1)} />, // Now enters hub
    <About key="about" />,
    <Experience key="experience" />,
    <Projects key="projects" />,
    <Skills key="skills" />,
    <Contact key="contact" />
  ];

  return (
    <div className="relative min-h-screen bg-mission-bg selection:bg-mission-accent selection:text-black font-mono">
      {/* Global Background FX */}
      <div className="scanline" />
      
      <Navigation />
      
      <HallwayLayout activeIndex={activeIndex} onNavigate={setActiveIndex}>
        {activeIndex === -1 ? (
          <ArchiveHub key="hub" onSelect={setActiveIndex} />
        ) : (
          sections[activeIndex]
        )}
      </HallwayLayout>

      {/* vertical return button if in a section */}
      {activeIndex !== -1 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setActiveIndex(-1)}
          className="fixed left-6 bottom-24 z-[60] flex items-center gap-2 mono text-[10px] text-mission-accent hover:text-white transition-colors rotate-270 origin-left"
        >
          <span>[ RETURN_TO_DIRECTORY ]</span>
        </motion.button>
      )}

      {/* Vertical edge decorative elements */}
      <div className="fixed left-2 top-0 bottom-0 w-px bg-mission-accent/10 pointer-events-none z-50" />
      <div className="fixed right-2 top-0 bottom-0 w-px bg-mission-accent/10 pointer-events-none z-50" />
      
      {/* Corner Brackets */}
      <div className="fixed top-20 left-2 w-4 h-4 border-t border-l border-mission-accent/30 pointer-events-none z-50" />
      <div className="fixed top-20 right-2 w-4 h-4 border-t border-r border-mission-accent/30 pointer-events-none z-50" />
      <div className="fixed bottom-20 left-2 w-4 h-4 border-b border-l border-mission-accent/30 pointer-events-none z-50" />
      <div className="fixed bottom-20 right-2 w-4 h-4 border-b border-r border-mission-accent/30 pointer-events-none z-50" />

      <Chatbot />
    </div>
  );
}
