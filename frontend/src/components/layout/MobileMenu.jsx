import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="lg:hidden fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-label="Close menu"
          />

          <motion.div
            className="absolute left-3 right-3 top-3 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-4"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-xs font-semibold tracking-wide text-white/60 px-2">Menu</div>
            <div className="mt-3 flex flex-col gap-2">
              <NavLink
                to="/dashboard"
                onClick={onClose}
                className={({ isActive }) =>
                  "px-3 py-2 rounded-xl transition border " +
                  (isActive
                    ? "bg-white/10 text-white border-white/15"
                    : "text-white/70 hover:text-white hover:bg-white/5 border-transparent")
                }
              >
                Dashboard
              </NavLink>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default MobileMenu;

