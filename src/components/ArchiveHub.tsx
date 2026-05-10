import { motion } from "motion/react";
import { Lock, FileText, Briefcase, Archive, Shield, MessageSquare, Terminal } from "lucide-react";

interface HubProps {
  onSelect: (index: number) => void;
  key?: string;
}

export function ArchiveHub({ onSelect }: HubProps) {
  const missions = [
    { routeIndex: 1, id: "about", label: "PERSONNEL_FILE", icon: <Lock />, desc: "AGENT BIOMETRICS & HISTORY" },
    { routeIndex: 2, id: "experience", label: "MISSION_LOGS", icon: <Briefcase />, desc: "FIELD ENGAGEMENT LOGS" },
    { routeIndex: 3, id: "projects", label: "OPERATIONS", icon: <Archive />, desc: "SYSTEM DEPLOYMENT DATA" },
    { routeIndex: 4, id: "skills", label: "ARSENAL", icon: <Shield />, desc: "TECHNOLOGICAL CAPABILITIES" },
    { routeIndex: 5, id: "contact", label: "COMMUNICATION_LINE", icon: <MessageSquare />, desc: "TRANSMISSION PORTAL" },
    { routeIndex: 6, id: "chatbot", label: "INTELLIGENCE_TERMINAL", icon: <Terminal />, desc: "AI ARCHIVE ASSISTANT" },
  ];

  return (
    <div className="w-full min-h-screen py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="mono text-mission-accent text-[10px] tracking-[0.5em] mb-2 uppercase">MAIN_ARCHIVE_DIRECTORY</div>
          <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tight font-sans">SELECT MISSION_FILES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission, index) => (
            <motion.button
              key={mission.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, rotateY: 5 }}
              onClick={() => onSelect(mission.routeIndex)}
              className="mission-card group min-h-[220px] flex flex-col items-start gap-6 cursor-pointer text-left overflow-hidden"
            >
              <div className="metallic-edge" />
              <div className="classified-label">CLASSIFIED</div>
              
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="text-mission-accent group-hover:scale-110 transition-transform bg-mission-accent/5 p-2 border border-mission-accent/10">
                    {mission.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="mono text-[7px] opacity-40">INDEX://{(index + 1).toString().padStart(3, '0')}</span>
                    <span className="mono text-[8px] text-mission-accent">SEC_0{index + 1}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-1.5 h-1.5 bg-mission-accent status-active" />
                  <span className="mono text-[6px] mt-1 opacity-30 tracking-[0.5em]">ONLINE</span>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-2 group-hover:text-white transition-colors duration-300">
                  {mission.label}
                </h3>
                <p className="text-[10px] mono text-white/40 uppercase tracking-[0.2em] leading-relaxed">
                  {mission.desc}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 w-full border-t border-mission-border/30 pt-4 mono text-[7px]">
                <div className="flex flex-col">
                  <span className="opacity-30">STATUS:</span>
                  <span className="text-mission-accent">ACTIVE_READY</span>
                </div>
                <div className="flex flex-col">
                  <span className="opacity-30">CLEARANCE:</span>
                  <span className={index > 3 ? "text-yellow-500" : "text-mission-accent"}>LVL_{index > 3 ? "MAX" : index + 1}</span>
                </div>
                <div className="flex flex-col col-span-2 mt-1">
                  <span className="opacity-30">FILE_TYPE:</span>
                  <span className="opacity-60">{mission.id === 'projects' ? 'MISSION_ASSETS' : 'INTEL_DATA_PACKET'}</span>
                </div>
              </div>

              <div className="mt-auto w-full h-0.5 bg-mission-accent/5 overflow-hidden">
                <div className="h-full bg-mission-accent w-0 group-hover:w-full transition-all duration-700 ease-out" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
