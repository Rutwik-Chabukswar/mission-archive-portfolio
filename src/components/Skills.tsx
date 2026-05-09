import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Section } from "./Section";
import { SKILLS } from "../data";
import { Terminal, Layers, Server, BrainCircuit, Container, Wrench } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "FRONTEND": <Layers size={14} />,
  "BACKEND": <Server size={14} />,
  "AI SYSTEMS": <BrainCircuit size={14} />,
  "INFRASTRUCTURE": <Container size={14} />,
  "TOOLS": <Wrench size={14} />,
};

export function Skills() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <Section id="skills" title="Technology Arsenal" subtitle="Interactive index of deployed technologies — hover to reveal field deployment history.">
      <div className="arsenal-wall">

        {/* Category tabs */}
        <div className="arsenal-tabs">
          {SKILLS.map((group, index) => (
            <button
              key={group.category}
              onClick={() => setActiveCategory(index)}
              className={`arsenal-tab ${activeCategory === index ? "arsenal-tab--active" : ""}`}
            >
              <span className="text-mission-accent/50">{categoryIcons[group.category] || <Terminal size={14} />}</span>
              <span className="mono text-[9px] tracking-[0.2em]">{group.category}</span>
              <span className="mono text-[7px] opacity-30">{group.items.length}</span>
            </button>
          ))}
        </div>

        {/* Arsenal grid */}
        <div className="arsenal-grid-container">
          {/* Category header */}
          <motion.div
            key={SKILLS[activeCategory].category + "-header"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between mb-5 pb-3 border-b border-mission-accent/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-mission-accent">{categoryIcons[SKILLS[activeCategory].category]}</span>
              <h3 className="text-lg font-bold uppercase tracking-wide">{SKILLS[activeCategory].category}</h3>
            </div>
            <div className="mono text-[8px] text-mission-accent/30 tracking-[0.3em]">
              {SKILLS[activeCategory].items.length} ASSETS_LOADED
            </div>
          </motion.div>

          {/* Tech nodes */}
          <AnimatePresence mode="wait">
            <motion.div
              key={SKILLS[activeCategory].category}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="arsenal-grid"
            >
              {SKILLS[activeCategory].items.map((skill, i) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.06, duration: 0.25 }}
                  className="arsenal-node group"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  {/* Glow border on hover */}
                  <div className="arsenal-node-glow" />

                  {/* Active indicator */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 bg-mission-accent rounded-full status-active shadow-[0_0_6px_rgba(0,255,65,0.6)]" />
                    <span className="mono text-[7px] text-mission-accent/40 tracking-[0.3em]">ASSET_{(i + 1).toString().padStart(2, "0")}</span>
                  </div>

                  {/* Tech name */}
                  <h4 className="font-sans text-base font-semibold text-white/80 group-hover:text-mission-accent transition-colors duration-200 mb-1">
                    {skill.name}
                  </h4>

                  {/* "Used in" reveal */}
                  <AnimatePresence>
                    {hoveredSkill === skill.name ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 pt-2 border-t border-mission-accent/15">
                          <div className="mono text-[6px] text-mission-accent/40 tracking-[0.4em] mb-1">DEPLOYED_IN</div>
                          <p className="font-sans text-[11px] text-mission-accent/70 leading-relaxed">
                            {skill.usedIn}
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2"
                      >
                        <div className="mono text-[6px] text-white/15 tracking-[0.3em]">HOVER_FOR_INTEL</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-mission-accent/8 flex items-center justify-between">
            <div className="mono text-[7px] text-mission-accent/20 tracking-[0.3em]">
              TOTAL_ASSETS: {SKILLS.reduce((sum, g) => sum + g.items.length, 0)}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-mission-accent rounded-full status-active" />
              <span className="mono text-[7px] text-mission-accent/30 tracking-[0.3em]">ALL_SYSTEMS_NOMINAL</span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
