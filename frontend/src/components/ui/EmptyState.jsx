import { motion } from "framer-motion";

function EmptyState({ title, description, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center text-center gap-2 px-6 py-10"
    >
      <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        {children}
      </div>
      <div className="text-white font-semibold">{title}</div>
      {description ? <div className="text-white/70 text-sm max-w-md">{description}</div> : null}
    </motion.div>
  );
}

export default EmptyState;

