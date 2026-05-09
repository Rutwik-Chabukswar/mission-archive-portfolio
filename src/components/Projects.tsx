import { motion } from "motion/react";
import { Section } from "./Section";
import { PROJECTS } from "../data";
import { ExternalLink, Hash } from "lucide-react";
import { ArchitectureFlow } from "./ArchitectureFlow";

export function Projects() {
  return (
    <Section id="projects" title="Active Deployments" subtitle="Catalogue of critical deployments and system developments identified in the field.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="mission-card flex flex-col group p-6 overflow-hidden"
          >
            <div className="metallic-edge" />
            <div className="classified-label">ASSET_ID</div>
            
            <div className="flex items-center justify-between mb-4 border-b border-mission-border pb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-mission-accent status-active shadow-[0_0_8px_#00FF41]" />
                <div className="flex flex-col">
                  <span className="mono text-[8px] text-mission-accent leading-none">STATUS: DEPLOYED</span>
                  <span className="mono text-[7px] text-mission-accent/40 mt-1 uppercase tracking-widest">{project.id}</span>
                </div>
              </div>
              <a 
                href={project.link}
                className="text-mission-accent/40 hover:text-mission-accent transition-colors p-1.5 border border-mission-accent/10 hover:border-mission-accent/40 bg-mission-accent/5"
                title="ACCESS_NODE"
              >
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="relative z-10 mb-4">
              <h3 className="text-lg font-bold uppercase mb-3 group-hover:text-white transition-colors tracking-wide">
                {project.title}
              </h3>
              <p className="font-sans text-[13px] text-white/50 leading-[1.75] line-clamp-3">
                {project.description}
              </p>
            </div>

            {/* Architecture Flow Visual */}
            {project.architectureFlow && (
              <ArchitectureFlow nodes={project.architectureFlow} />
            )}

            <div className="mt-4 grid grid-cols-2 gap-2 w-full mono text-[7px] opacity-40 mb-4">
              <div className="border-l border-mission-accent/20 pl-2">
                TYPE: SYS_APP
              </div>
              <div className="border-l border-mission-accent/20 pl-2 text-right">
                OBJ_S: CRITICAL
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-1.5 pt-4 border-t border-mission-border/30 relative z-10">
              {project.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2.5 py-1 bg-mission-accent/5 border border-mission-accent/20 text-[8px] font-mono tracking-widest text-mission-accent group-hover:border-mission-accent/40"
                >
                  {tag.toUpperCase()}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
