import { motion } from "motion/react";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: "About", path: "about" },
    { name: "Experience", path: "experience" },
    { name: "Projects", path: "projects" },
    { name: "Skills", path: "skills" },
    { name: "Contact", path: "contact" },
  ];

  const handleNavClick = (path: string) => {
    setIsOpen(false);
    if (window.innerWidth < 768) {
      const el = document.getElementById(path);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/archive/${path}`);
    }
  };

  const handleLogoClick = () => {
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-mission-bg/95 border-b border-mission-accent">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-[9px] opacity-60 tracking-[0.4em] mono mb-0.5">PERSONNEL_ARCHIVE // RC-77812</div>
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <Shield className="w-4 h-4 text-mission-accent group-hover:rotate-12 transition-transform" />
            <span className="font-mono font-bold tracking-tighter text-lg uppercase leading-none hover:text-white">
              RUTWIK CHABUKSWAR
            </span>
          </button>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end mr-6 border-r border-mission-border pr-6">
            <div className="text-[8px] opacity-50 tracking-widest mono">SYSTEM STATUS</div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-mission-accent status-active" />
              <span className="text-xs font-mono font-bold tracking-widest leading-none">OPERATIONAL</span>
            </div>
          </div>
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.path)}
              className="mono text-[10px] hover:text-white border border-transparent hover:border-mission-accent/30 px-2 py-1 transition-all cursor-pointer"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-mission-accent p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-mission-ink border-b border-mission-accent"
      >
        <div className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.path)}
              className="mono py-2 border-b border-mission-border/30 last:border-0 hover:text-white text-left cursor-pointer"
            >
              // {item.name}
            </button>
          ))}
        </div>
      </motion.div>
    </nav>
  );
}
