import { motion } from "motion/react";

interface ArchitectureFlowProps {
  nodes: string[];
}

export function ArchitectureFlow({ nodes }: ArchitectureFlowProps) {
  return (
    <div className="arch-flow-container">
      <div className="arch-flow-label">SYS_ARCHITECTURE</div>
      <div className="arch-flow-pipeline">
        {nodes.map((node, i) => (
          <div key={node + i} className="arch-flow-step">
            <motion.div
              className="arch-flow-node"
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.35, ease: "easeOut" }}
            >
              <span className="arch-flow-node-text">{node}</span>
              {/* Pulse dot */}
              <motion.span
                className="arch-flow-pulse"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
              />
            </motion.div>

            {/* Arrow connector (not after last node) */}
            {i < nodes.length - 1 && (
              <motion.div
                className="arch-flow-arrow"
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.1, duration: 0.3, ease: "easeOut" }}
              >
                <svg width="24" height="8" viewBox="0 0 24 8" fill="none">
                  <line x1="0" y1="4" x2="18" y2="4" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                  <path d="M16 1L20 4L16 7" stroke="currentColor" strokeWidth="1" fill="none" />
                </svg>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
