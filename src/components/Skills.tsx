import { motion } from "motion/react";
import { Section } from "./Section";
import { SKILLS } from "../data";
import { Terminal } from "lucide-react";

export function Skills() {
  const levels: Record<string, number> = {
    "FRONTEND": 95,
    "BACKEND": 90,
    "AI / ML": 85,
    "INFRASTRUCTURE": 75
  };

  return (
    <Section id="skills" title="Operative Stack" subtitle="Technological capabilities and specialist tools in the operative's stack.">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SKILLS.map((skillGroup, index) => (
          <motion.div
            key={skillGroup.category}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="mission-card group p-5 overflow-hidden flex flex-col"
          >
            <div className="metallic-edge" />
            
            <div className="flex items-center justify-between mb-4 border-b border-mission-border pb-3 relative z-10">
              <div className="flex items-center gap-2">
                <Terminal className="w-3 h-3 text-mission-accent" />
                <h3 className="mono text-[10px] tracking-widest text-mission-accent">{skillGroup.category}</h3>
              </div>
              <div className="flex flex-col items-end">
                <span className="mono text-[9px] text-mission-accent">{levels[skillGroup.category]}%</span>
                <span className="mono text-[5px] opacity-30">LOAD_CAPACITY</span>
              </div>
            </div>

            <div className="h-1 bg-mission-accent/5 mb-6 relative z-10 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${levels[skillGroup.category]}%` }}
                className="h-full bg-mission-accent shadow-[0_0_8px_rgba(0,255,65,0.5)]"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>

            <ul className="space-y-2.5 relative z-10">
              {skillGroup.items.map((skill) => (
                <li key={skill} className="flex items-center justify-between group/item">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-px bg-mission-accent/30 group-hover/item:w-3 transition-all" />
                    <span className="font-sans text-xs font-medium tracking-normal group-hover/item:text-mission-accent transition-colors">
                      {skill}
                    </span>
                  </div>
                  <div className="w-1 h-1 bg-mission-accent/20 group-hover/item:bg-mission-accent rounded-full transition-colors" />
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-4 border-t border-mission-border/20 flex flex-col gap-1 mono text-[6px] opacity-30 relative z-10 italic">
              <div>ENCRYPTION: ENABLED</div>
              <div>AUTH_LEVEL: {85 + index}%</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
