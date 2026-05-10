import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Cpu, Lock } from "lucide-react";
import { CONFIG } from "../data";
import { BootSequence } from "./BootSequence";

interface HeroProps {
  onEnter?: () => void;
  key?: string | number;
}

export function Hero({ onEnter }: HeroProps) {
  const [isBooting, setIsBooting] = useState(false);

  const handleEnterClick = () => {
    setIsBooting(true);
  };

  return (
    <>
      <AnimatePresence>
        {isBooting && <BootSequence onComplete={() => { if(onEnter) onEnter(); }} />}
      </AnimatePresence>
      <motion.section 
        animate={isBooting ? { 
          scale: [1, 1.02, 1.01, 1.05, 1.1], 
          opacity: [1, 0.8, 0.9, 0.4, 0], 
          filter: ["brightness(1) blur(0px)", "brightness(1.5) contrast(1.5) blur(1px)", "brightness(1) blur(0px)", "brightness(2) blur(2px)", "brightness(3) blur(4px)"] 
        } : { scale: 1, opacity: 1, filter: "brightness(1) blur(0px)" }}
        transition={{ duration: 1.6, times: [0, 0.2, 0.4, 0.8, 1], ease: "easeInOut" }}
        className="relative min-h-[90vh] flex items-center justify-center pt-24 overflow-hidden"
      >
      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8">
        {/* Left Column: Mission Brief */}
        <div className="col-span-12 lg:col-span-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mission-border p-8 bg-mission-accent/5"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 bg-mission-accent rounded-full status-active" />
                <span className="mono text-[10px] tracking-[0.4em]">INITIATING_SEQUENCE_77812</span>
              </div>
              <span className="mono text-[8px] opacity-40">ENCRYPTION: AES-256</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tighter mb-8 leading-[0.9] font-mono"
            >
              RUTWIK <span className="block text-mission-bg bg-mission-accent px-4 py-2 inline-block">CHABUKSWAR</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              {CONFIG.role.split(" | ").map((role) => (
                <span key={role} className="border border-mission-accent px-3 py-1.5 text-[11px] font-mono font-bold tracking-widest uppercase">
                  {role}
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-sans text-white/60 text-base md:text-lg font-light tracking-normal max-w-2xl mb-12 leading-[1.8]"
            >
              {CONFIG.intro}
            </motion.p>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <button
                type="button"
                onClick={handleEnterClick}
                className="w-full sm:w-auto bg-mission-accent text-black font-mono font-bold py-4 px-12 text-sm hover:bg-white transition-colors tracking-widest cursor-pointer group"
              >
                <span>ENTER MISSION ARCHIVE</span>
                <span className="hidden group-hover:inline-block ml-2 animate-pulse">_</span>
              </button>
              <div className="flex items-center gap-4 text-mission-text-muted animate-pulse">
                <Lock className="w-3 h-3" />
                <span className="mono text-[9px]">CLEARANCE: TOP SECRET</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Status Data */}
        <div className="hidden lg:col-span-4 lg:flex flex-col gap-6">
          <div className="mission-border p-6 flex-grow flex flex-col justify-between">
            <h2 className="mono text-[10px] opacity-60 mb-4 tracking-[0.3em]">SYSTEM_METRICS</h2>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>RELIABILITY</span>
                  <span>99.9%</span>
                </div>
                <div className="h-1 bg-mission-accent/10">
                  <div className="h-full bg-mission-accent w-[99.9%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>LATENCY</span>
                  <span>12ms</span>
                </div>
                <div className="h-1 bg-mission-accent/10">
                  <div className="h-full bg-mission-accent w-[10%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span>UPTIME</span>
                  <span>782D</span>
                </div>
                <div className="h-1 bg-mission-accent/10">
                  <div className="h-full bg-mission-accent w-full" />
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-mission-border pt-4">
              <div className="flex justify-between mono text-[8px] opacity-40">
                <span>COORD_LAT</span>
                <span>18.5204 N</span>
              </div>
              <div className="flex justify-between mono text-[8px] opacity-40">
                <span>COORD_LONG</span>
                <span>73.8567 E</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
    </>
  );
}
