import { ReactNode, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, DoorOpen, HardDrive, Cpu, ShieldAlert, Archive } from "lucide-react";

interface HallwayProps {
  children: ReactNode[] | ReactNode;
  activeIndex: number;
  onNavigate: (index: number) => void;
}

export function HallwayLayout({ children, activeIndex, onNavigate }: HallwayProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Labels for the hallway "doors"
  const missionLabels = [
    { id: "hero", label: "INIT_SEQUENCE", icon: <Cpu className="w-4 h-4" /> },
    { id: "about", label: "PERSONNEL_FILE", icon: <Lock className="w-4 h-4" /> },
    { id: "experience", label: "OPS_HISTORY", icon: <HardDrive className="w-4 h-4" /> },
    { id: "projects", label: "ACTIVE_ARCHIVE", icon: <DoorOpen className="w-4 h-4" /> },
    { id: "skills", label: "ARSENAL_DATA", icon: <ShieldAlert className="w-4 h-4" /> },
    { id: "contact", label: "SECURE_COMMS", icon: <Lock className="w-4 h-4" /> },
  ];

  const currentLabel = activeIndex === -1 ? { label: "ARCHIVE_DIRECTORY", icon: <Archive className="w-4 h-4" /> } : missionLabels[activeIndex];

  return (
    <div className="relative w-full h-screen overflow-hidden bg-mission-bg perspective-container">
      {/* Cinematic HUD elements that stay fixed */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <div className="vignette" />
        <div className="absolute top-20 left-6 text-[8px] mono opacity-30">
          Z_DEPTH: {(Math.max(0, activeIndex) * 1000).toFixed(0)}MM / ARCHIVE_SECTOR_{activeIndex === -1 ? "HUB" : activeIndex + 1}
        </div>
        <div className="absolute bottom-20 right-6 text-[8px] mono opacity-30 text-right">
          LATENCY: 12MS / ENCRYPTION: AES_256<br />
          BUFFERING_MISSION_DATA...
        </div>
      </div>

      {/* Perspective Tunnel Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            z: Math.max(0, activeIndex) * -400,
            transition: { duration: 1.5, ease: "circOut" }
          }}
          className="relative w-full h-full hallway-room"
        >
          {/* Ambient Fog Layers */}
          <motion.div 
            animate={{ 
              x: [-20, 20],
              y: [-10, 10],
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
            className="fog-layer scale-150 opacity-40"
          />
          <motion.div 
            animate={{ 
              x: [20, -20],
              y: [10, -10],
            }}
            transition={{ duration: 15, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 2 }}
            className="fog-layer scale-110 opacity-30"
          />

          {/* Distant Lighting/Glows */}
          <div className="absolute inset-0 flex items-center justify-center">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`glow-${i}`}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 5 + i * 2, repeat: Infinity, ease: "easeInOut" }}
                className="ambient-glow"
                style={{ 
                  width: `${600 + i * 200}px`, 
                  height: `${600 + i * 200}px`,
                  transform: `translateZ(${-1000 - i * 1000}px)`
                }}
              />
            ))}
          </div>

          <div className="tunnel-grid tunnel-grid-top" />
          <div className="tunnel-grid tunnel-grid-bottom" />
          
          {/* Tunnel Rings with glow */}
          <div className="absolute inset-0 flex items-center justify-center">
             {[...Array(8)].map((_, i) => (
               <div 
                 key={i}
                 className="absolute border border-mission-accent/10 shadow-[0_0_15px_rgba(0,255,65,0.05)]"
                 style={{ 
                   width: `${(i + 1) * 200}px`, 
                   height: `${(i + 1) * 150}px`,
                   transform: `translateZ(${i * -600}px)` 
                 }}
               />
             ))}
          </div>

          {/* Faint Particles/Floating Dust */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`p-${i}`}
                initial={{ 
                  x: `${Math.random() * 100}%`, 
                  y: `${Math.random() * 100}%`,
                  z: Math.random() * -2000,
                  opacity: 0
                }}
                animate={{ 
                  y: ["-10%", "110%"],
                  opacity: [0, 0.4, 0],
                }}
                transition={{ 
                  duration: 20 + Math.random() * 20,
                  repeat: Infinity,
                  delay: Math.random() * 20,
                  ease: "linear"
                }}
                className="particle"
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* The Hallway Container */}
      <div className="relative w-full h-full hallway-room">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ 
              opacity: 0, 
              scale: 0.8, 
              z: -1500,
              rotateX: 10,
              filter: "blur(20px)" 
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              z: 0,
              rotateX: 0,
              filter: "blur(0px)" 
            }}
            exit={{ 
              opacity: 0, 
              scale: 1.2, 
              z: 1500,
              rotateX: -10,
              filter: "blur(40px)" 
            }}
            transition={{ 
              duration: 1.5, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            onAnimationStart={() => setIsTransitioning(true)}
            onAnimationComplete={() => setIsTransitioning(false)}
            className="w-full h-full overflow-y-auto custom-scrollbar"
          >
            {/* Transition Glitch Overlay */}
            {isTransitioning && (
              <div className="fixed inset-0 z-[100] bg-mission-accent/5 door-glitch pointer-events-none" />
            )}

            {/* Header info for the current "room" */}
            <div className="sticky top-0 z-30 pt-24 px-6 md:px-12 pointer-events-none">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 bg-mission-bg/80 backdrop-blur-sm border border-mission-border px-4 py-1.5"
                >
                  <span className="text-mission-accent">{currentLabel?.icon}</span>
                  <span className="mono text-[10px] tracking-[0.4em] text-mission-accent">
                    {currentLabel?.label}
                  </span>
                </motion.div>
                
                <motion.div
                   initial={{ x: 100, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   transition={{ delay: 0.5 }}
                   className="hidden md:block mono text-[8px] text-white/20"
                >
                  ROOM_STABILITY: [ 100% ] // ACCESS_GRANTED
                </motion.div>
              </div>
            </div>

            {/* The main content */}
            <div className="relative z-10 min-h-screen">
               {children}
            </div>

            {/* Hallway Floor/Ceiling Decor for depth feeling */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
               <div className="absolute top-0 w-full h-1/3 bg-linear-to-b from-mission-accent/20 to-transparent" />
               <div className="absolute bottom-0 w-full h-1/3 bg-linear-to-t from-mission-accent/20 to-transparent" />
               <div className="depth-fade" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hallway Footer Navigation (Doors) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-mission-bg border-t border-mission-border/30 h-16 pointer-events-auto">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
           <button
              onClick={() => onNavigate(-1)}
              className={`flex items-center gap-2 px-3 py-1.5 transition-all duration-300 group border ${
                activeIndex === -1 
                ? "bg-mission-accent border-mission-accent text-black scale-110" 
                : "bg-transparent border-mission-border text-white/40 hover:border-mission-accent/50"
              }`}
           >
              <Archive className="w-3 h-3" />
              <span className={`mono text-[9px] font-bold tracking-widest hidden sm:block ${activeIndex === -1 ? "text-black" : "group-hover:text-mission-accent"}`}>
                DIRECTORY
              </span>
           </button>

           {missionLabels.map((item, index) => (
             <button
                key={item.id}
                onClick={() => onNavigate(index)}
                className={`flex items-center gap-2 px-3 py-1.5 transition-all duration-300 group border ${
                  activeIndex === index 
                  ? "bg-mission-accent border-mission-accent text-black scale-110" 
                  : "bg-transparent border-mission-border text-white/40 hover:border-mission-accent/50"
                }`}
             >
                <span className="mono text-[8px] font-bold tracking-tighter">0{index + 1}</span>
                <span className={`mono text-[9px] font-bold tracking-widest hidden sm:block ${activeIndex === index ? "text-black" : "group-hover:text-mission-accent"}`}>
                  {item.id}
                </span>
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
