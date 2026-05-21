import { motion } from "framer-motion";

function ProgressBarAnimated({ value = 0, className = "" }) {
  const safe = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className={`w-full bg-white/10 rounded-full h-3 overflow-hidden ${className}`}>
      <motion.div
        className="h-full rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400"
        initial={{ width: 0 }}
        animate={{ width: `${safe}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

export default ProgressBarAnimated;

