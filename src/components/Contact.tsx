import { motion } from "motion/react";
import { Section } from "./Section";
import { CONFIG } from "../data";
import { Github, Linkedin, Mail, FileText, Send } from "lucide-react";

export function Contact() {
  const contacts = [
    { name: "GITHUB", icon: <Github size={14} />, href: CONFIG.socials.github, display: "/rutwik-c" },
    { name: "LINKEDIN", icon: <Linkedin size={14} />, href: CONFIG.socials.linkedin, display: "/in/rutwikc" },
    { name: "EMAIL", icon: <Mail size={14} />, href: `mailto:${CONFIG.socials.email}`, display: "rutwikc2004@gmail.com" },
  ];

  return (
    <Section id="contact" title="Comms Link" subtitle="Establish contact for mission collaboration or operative briefing through secure channels.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <div className="mission-border bg-mission-ink/50 p-6 flex-grow">
            <h3 className="mono text-[10px] mb-6 opacity-60">// COMMAND_CENTER</h3>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <a
                  key={contact.name}
                  href={contact.href}
                  className="flex items-center justify-between border border-mission-border/30 p-3 hover:bg-mission-accent/10 hover:border-mission-accent/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-mission-accent opacity-40 group-hover:opacity-100 transition-opacity">
                      {contact.icon}
                    </span>
                    <span className="mono text-[10px] font-bold">{contact.name}</span>
                  </div>
                  <span className="mono text-[9px] opacity-40 group-hover:opacity-100">{contact.display}</span>
                </a>
              ))}
            </div>
          </div>

          <a
            href="#"
            className="mission-border flex items-center justify-between bg-mission-accent text-black font-bold p-4 hover:bg-white transition-colors uppercase tracking-[0.2em] text-[11px]"
          >
            <span>DOWNLOAD_FULL_INTEL_PDF</span>
            <FileText size={16} />
          </a>
        </div>

        <div className="mission-border bg-mission-ink/50 p-6">
          <h3 className="mono text-[10px] mb-6 opacity-60">// TRANSMISSION_PORTAL</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="mono text-[9px] opacity-40 uppercase">operative_id</label>
                <input 
                  type="text" 
                  className="w-full bg-black/50 border border-mission-border p-3 focus:border-mission-accent outline-none font-sans text-sm text-white/80"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-1">
                <label className="mono text-[9px] opacity-40 uppercase">comms_frequency</label>
                <input 
                  type="email" 
                  className="w-full bg-black/50 border border-mission-border p-3 focus:border-mission-accent outline-none font-sans text-sm text-white/80"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="mono text-[9px] opacity-40 uppercase">mission_brief</label>
              <textarea 
                rows={4}
                className="w-full bg-black/50 border border-mission-border p-3 focus:border-mission-accent outline-none font-sans text-sm text-white/80 resize-none"
                placeholder="Write your message..."
              />
            </div>
            <button className="flex items-center gap-3 px-8 py-3 border border-mission-accent text-mission-accent font-bold uppercase tracking-widest hover:bg-mission-accent hover:text-black transition-colors w-full justify-center text-xs">
              <Send size={14} />
              <span>INITIATE_TRANSMISSION</span>
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
}
