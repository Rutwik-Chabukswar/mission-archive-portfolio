import { motion } from "motion/react";
import { Section } from "./Section";
import { EXPERIENCE } from "../data";
import { Calendar, Briefcase } from "lucide-react";

export function Experience() {
  return (
    <Section id="experience" title="Ops History" subtitle="Verified engagement history and critical contributions across previous deployments in the field.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXPERIENCE.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="mission-card group p-6 overflow-hidden flex flex-col gap-4"
          >
            <div className="metallic-edge" />
            <div className="classified-label">OPS_LOG</div>
            
            <div className="flex justify-between items-start border-b border-mission-border pb-3 relative z-10">
              <div>
              <h3 className="text-base font-bold uppercase tracking-wide text-mission-accent group-hover:text-white transition-colors">
                  {item.company}
                </h3>
                <div className="font-sans text-xs text-white/50 mt-1.5 flex items-center gap-2">
                  <div className="w-1 h-1 bg-mission-accent rounded-full" />
                  {item.role}
                </div>
              </div>
              <div className="flex flex-col items-end opacity-40">
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-mission-accent" />
                  <span className="mono text-[8px] tracking-tighter">{item.period}</span>
                </div>
                <span className="mono text-[6px] mt-1 uppercase">VERIFIED_STAMP</span>
              </div>
            </div>

            <p className="font-sans text-[13px] text-white/50 leading-[1.75] relative z-10">
              {item.desc}
            </p>
            
            <div className="mt-auto flex items-center justify-between mono text-[7px] border-t border-mission-border/30 pt-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-mission-accent status-active" />
                <span className="opacity-40 uppercase tracking-[0.4em]">DEPLOYMENT_STRIKE: 0{index + 1}</span>
              </div>
              <div className="px-1.5 py-0.5 border border-mission-accent/20 text-mission-accent bg-mission-accent/5">
                LVL_{4 - index}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
