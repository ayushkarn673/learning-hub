import { motion } from "framer-motion";

function Spinner({ className = "" }) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      aria-label="Loading"
    >
      <span className="h-10 w-10 rounded-full border-2 border-white/20 border-t-white/90" />
    </motion.div>
  );
}

export default Spinner;

