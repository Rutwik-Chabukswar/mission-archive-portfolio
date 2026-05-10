import { useState, useEffect } from "react";
import { motion } from "motion/react";

const BOOT_STEPS = [
  "AUTHENTICATING USER...",
  "VERIFYING CLEARANCE...",
  "ACCESS GRANTED...",
  "OPENING MISSION ARCHIVE..."
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const runSequence = async () => {
      for (let i = 0; i < BOOT_STEPS.length; i++) {
        if (!isMounted) return;
        setStep(i);
        // Fast but cinematic pacing
        const delay = i === 0 ? 500 : i === 1 ? 700 : i === 2 ? 400 : 500;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Final hold before resolving
      if (!isMounted) return;
      await new Promise(resolve => setTimeout(resolve, 300));
      onComplete();
    };

    runSequence();

    return () => { isMounted = false; };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[200] bg-mission-bg flex flex-col items-center justify-center pointer-events-auto"
    >
      <div className="vignette" />
      <div className="absolute inset-0 bg-mission-accent/5 pointer-events-none mix-blend-screen" />
      
      {/* Glitch lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0, 255, 65, 0.1) 3px, rgba(0, 255, 65, 0.1) 3px)' }} />

      <div className="w-full max-w-md px-8 text-left relative z-10">
        <div className="flex flex-col gap-4 font-mono text-[10px] sm:text-xs uppercase tracking-widest">
          {BOOT_STEPS.map((text, index) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -15 }}
              animate={index <= step ? { opacity: 1, x: 0 } : { opacity: 0, x: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className={`flex items-center gap-4 ${
                index === 2 ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 
                index < step ? 'text-mission-accent opacity-60' : 'text-mission-accent'
              }`}
            >
              <div className="w-3 h-3 border border-current flex items-center justify-center flex-shrink-0">
                {index < step ? (
                  <div className="w-1.5 h-1.5 bg-current" />
                ) : index === step ? (
                  <motion.div 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.5, ease: "steps(2)" }} 
                    className="w-1.5 h-1.5 bg-current" 
                  />
                ) : null}
              </div>
              <span>{text}</span>
            </motion.div>
          ))}
        </div>
        
        {/* Loading Progress Bar */}
        <div className="mt-10 pt-4 border-t border-mission-accent/20">
          <div className="flex justify-between mb-2 mono text-[8px] tracking-[0.3em] text-mission-accent/40">
            <span>SYS_MEM_ALLOC</span>
            <span>{Math.round(((step + 1) / BOOT_STEPS.length) * 100)}%</span>
          </div>
          <div className="h-0.5 bg-mission-accent/10 w-full overflow-hidden">
            <motion.div
              className="h-full bg-mission-accent shadow-[0_0_10px_rgba(0,255,65,0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: `${((step + 1) / BOOT_STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
