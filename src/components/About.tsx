import { motion } from "motion/react";
import { Section } from "./Section";
import { DOSSIER } from "../data";
import { FileCode, Database, BrainCircuit, MapPin, GraduationCap, Radio, Shield, User, Fingerprint, Scan } from "lucide-react";

export function About() {
  const steps = [
    {
      icon: <FileCode className="w-4 h-4" />,
      title: "Frontend Foundations",
      desc: "Starting with the physics of user interaction and responsive design systems."
    },
    {
      icon: <Database className="w-4 h-4" />,
      title: "Backend Core",
      desc: "Scaling architectures and optimizing performance for high-traffic operations."
    },
    {
      icon: <BrainCircuit className="w-4 h-4" />,
      title: "AI Systems",
      desc: "Building autonomous agents and complex intelligence layers for modern systems."
    }
  ];

  const dossierFields = [
    { label: "DESIGNATION", value: DOSSIER.role, icon: <User size={12} /> },
    { label: "LOCATION", value: DOSSIER.location, icon: <MapPin size={12} /> },
    { label: "GRADUATION", value: DOSSIER.graduationYear, icon: <GraduationCap size={12} /> },
    { label: "AVAILABILITY", value: DOSSIER.availability, icon: <Radio size={12} />, highlight: true },
    { label: "CLEARANCE", value: DOSSIER.clearanceLevel, icon: <Shield size={12} /> },
    { label: "SPECIALIZATION", value: DOSSIER.specialization, icon: <Fingerprint size={12} /> },
  ];

  return (
    <Section id="about" title="Personnel File" subtitle="Classified operative dossier — core identity, capabilities, and current deployment status.">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* ── Left Column: Classified Dossier Card ── */}
        <div className="md:col-span-7">
          <div className="dossier-card relative overflow-hidden">
            {/* Holographic scan line */}
            <div className="dossier-scanline" />

            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-mission-accent/60 z-10" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-mission-accent/60 z-10" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-mission-accent/60 z-10" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-mission-accent/60 z-10" />

            {/* Header bar */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-between mb-6 pb-4 border-b border-mission-accent/20"
            >
              <div className="flex items-center gap-3">
                <Scan size={14} className="text-mission-accent" />
                <span className="mono text-[9px] text-mission-accent tracking-[0.5em]">CLASSIFIED_PERSONNEL_DOSSIER</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-mission-accent rounded-full status-active" />
                <span className="mono text-[7px] text-mission-accent/50">VERIFIED</span>
              </div>
            </motion.div>

            {/* Identity block */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-5 mb-6"
            >
              {/* Avatar silhouette */}
              <div className="dossier-avatar flex-shrink-0">
                <div className="w-20 h-24 border border-mission-accent/30 bg-mission-accent/5 flex items-center justify-center relative overflow-hidden">
                  <User size={32} className="text-mission-accent/40" />
                  {/* Holographic shimmer */}
                  <div className="absolute inset-0 dossier-holo-shimmer" />
                </div>
                <div className="mono text-[6px] text-center mt-1.5 text-mission-accent/40 tracking-[0.4em]">
                  ID_PHOTO
                </div>
              </div>

              {/* Name + codename + bio */}
              <div className="flex-1 min-w-0">
                <div className="mono text-[7px] text-mission-accent/40 mb-1 tracking-[0.4em]">
                  CODENAME: {DOSSIER.codename}
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-mission-accent mb-2">
                  {DOSSIER.name}
                </h3>
                <p className="font-sans text-[13px] text-white/55 leading-[1.8] line-clamp-3">
                  {DOSSIER.bio}
                </p>
              </div>
            </motion.div>

            {/* Data grid */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-x-4 gap-y-0.5"
            >
              {dossierFields.map((field, i) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className="dossier-field group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-mission-accent/30 group-hover:text-mission-accent/60 transition-colors">{field.icon}</span>
                    <span className="mono text-[7px] text-mission-accent/40 tracking-[0.3em]">{field.label}</span>
                  </div>
                  <div className={`font-sans text-[13px] font-medium pl-5 ${
                    field.highlight
                      ? "text-mission-accent"
                      : "text-white/70"
                  }`}>
                    {field.value}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Fields of operations */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-5 pt-4 border-t border-mission-accent/10"
            >
              <div className="mono text-[7px] text-mission-accent/35 mb-2.5 tracking-[0.4em]">FIELDS_OF_OPERATIONS</div>
              <div className="flex flex-wrap gap-2">
                {DOSSIER.fieldsOfOps.map((field, i) => (
                  <motion.span
                    key={field}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55 + i * 0.05 }}
                    className="px-2.5 py-1 border border-mission-accent/20 bg-mission-accent/5 font-mono text-[8px] text-mission-accent/70 uppercase tracking-widest hover:border-mission-accent/50 hover:bg-mission-accent/10 transition-all cursor-default"
                  >
                    {field}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Footer stamp */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65 }}
              className="mt-5 pt-3 border-t border-mission-accent/10 flex items-center justify-between"
            >
              <div className="mono text-[6px] text-mission-accent/25 tracking-[0.4em]">
                DOC_REF: PF-{DOSSIER.codename}-ALPHA
              </div>
              <div className="flex items-center gap-3">
                <div className="mono text-[6px] text-red-500/40 tracking-[0.3em]">
                  AUTHORIZED_ACCESS_ONLY
                </div>
                <div className="w-8 h-3 border border-red-500/20 flex items-center justify-center">
                  <span className="mono text-[5px] text-red-500/40">TS</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Right Column: Capability Cards (unchanged) ── */}
        <div className="md:col-span-5 grid grid-cols-1 gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="mission-card group p-4"
            >
              <div className="flex items-start gap-4">
                <div className="text-mission-accent p-2 bg-mission-accent/5 mission-border">
                  {step.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide mb-1.5 group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <p className="font-sans text-white/40 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
