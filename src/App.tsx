/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Contact } from "./components/Contact";
import { HallwayLayout } from "./components/HallwayLayout";
import { Chatbot } from "./components/Chatbot";
import { motion, AnimatePresence } from "motion/react";

import { ArchiveHub } from "./components/ArchiveHub";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile(); // Check immediately
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getActiveIndex = (pathname: string) => {
    if (pathname === "/") return 0;
    if (pathname === "/archive/about") return 1;
    if (pathname === "/archive/experience") return 2;
    if (pathname === "/archive/projects") return 3;
    if (pathname === "/archive/skills") return 4;
    if (pathname === "/archive/contact") return 5;
    return -1; // Hub is /archive
  };

  const activeIndex = getActiveIndex(location.pathname);

  const navigateTo = (index: number) => {
    if (index === -1) {
      navigate("/archive");
      return;
    }
    
    if (index === 6) { // Chatbot trigger
      window.dispatchEvent(new CustomEvent('open-chatbot'));
      return;
    }
    
    const paths = ["/", "/archive/about", "/archive/experience", "/archive/projects", "/archive/skills", "/archive/contact"];
    navigate(paths[index] || "/");
  };

  const AppRoutes = (
    <Routes location={location} key={location.pathname === "/" ? "hero" : "archive"}>
      <Route path="/" element={<Hero onEnter={() => navigateTo(-1)} />} />
      <Route path="/archive" element={<ArchiveHub key="hub" onSelect={navigateTo} />} />
      <Route path="/archive/about" element={<About />} />
      <Route path="/archive/experience" element={<Experience />} />
      <Route path="/archive/projects" element={<Projects />} />
      <Route path="/archive/skills" element={<Skills />} />
      <Route path="/archive/contact" element={<Contact />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <div className="relative min-h-screen bg-mission-bg selection:bg-mission-accent selection:text-black font-mono overflow-x-hidden">
      {/* Global Background FX */}
      <div className="scanline" />
      
      <Navigation />
      
      {isMobile ? (
        <div className="pt-20 pb-24">
          {AppRoutes}
        </div>
      ) : (
        <HallwayLayout activeIndex={activeIndex} onNavigate={navigateTo}>
          {AppRoutes}
        </HallwayLayout>
      )}

      {/* vertical return button if in a section (Mobile and Desktop) */}
      {activeIndex !== -1 && activeIndex !== 0 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigateTo(-1)}
          className={`fixed left-4 ${isMobile ? "top-20 z-[200] origin-left scale-90" : "bottom-24 z-[60] rotate-270 origin-left"} flex items-center gap-2 mono text-[10px] text-mission-accent hover:text-white transition-colors bg-mission-bg/80 px-2 py-1 border border-mission-accent/20 backdrop-blur-sm`}
        >
          <span>[ RETURN_TO_DIRECTORY ]</span>
        </motion.button>
      )}

      {/* Vertical edge decorative elements (Desktop Only) */}
      {!isMobile && (
        <>
          <div className="fixed left-2 top-0 bottom-0 w-px bg-mission-accent/10 pointer-events-none z-50" />
          <div className="fixed right-2 top-0 bottom-0 w-px bg-mission-accent/10 pointer-events-none z-50" />
          
          {/* Corner Brackets */}
          <div className="fixed top-20 left-2 w-4 h-4 border-t border-l border-mission-accent/30 pointer-events-none z-50" />
          <div className="fixed top-20 right-2 w-4 h-4 border-t border-r border-mission-accent/30 pointer-events-none z-50" />
          <div className="fixed bottom-20 left-2 w-4 h-4 border-b border-l border-mission-accent/30 pointer-events-none z-50" />
          <div className="fixed bottom-20 right-2 w-4 h-4 border-b border-r border-mission-accent/30 pointer-events-none z-50" />
        </>
      )}

      <Chatbot />
    </div>
  );
}
