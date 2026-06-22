"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function RiskCollapse({ mitigated }: { mitigated: boolean }) {
  const [risk, setRisk] = useState(mitigated ? 38 : 71);

  useEffect(() => {
    if (!mitigated) {
      setRisk(71);
      return;
    }

    let frame = 0;
    const totalFrames = 34;
    const timer = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRisk(Math.round(71 - (71 - 38) * eased));
      if (progress === 1) {
        window.clearInterval(timer);
      }
    }, 45);

    return () => window.clearInterval(timer);
  }, [mitigated]);

  return (
    <span className="inline-flex items-center gap-2">
      <motion.span
        key={risk}
        initial={{ y: -4, opacity: 0.65 }}
        animate={{ y: 0, opacity: 1 }}
        className="font-mono text-sm text-white"
      >
        {risk}
      </motion.span>
      {mitigated && (
        <motion.span
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          className="h-px w-8 origin-left bg-emerald-300"
        />
      )}
      {mitigated && <span className="font-mono text-xs text-emerald-200">collapsed</span>}
    </span>
  );
}
