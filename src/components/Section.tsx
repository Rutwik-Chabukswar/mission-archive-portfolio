import { ReactNode } from "react";
import { motion } from "motion/react";

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function Section({ id, title, subtitle, children }: SectionProps) {
  return (
    <section id={id} className="py-16 px-4 md:px-8 lg:px-16 border-b border-mission-border/30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="mono text-mission-accent/50 text-[9px] tracking-[0.4em]">// MISSION_{id.toUpperCase()}</span>
          </div>
          <div className="archive-header p-4">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#00FF41]">
              {title}
            </h2>
            {subtitle && (
              <p className="font-sans text-sm md:text-base text-white/50 mt-3 leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>
        </motion.div>
        <div className="mt-8">
          {children}
        </div>
      </div>
    </section>
  );
}
