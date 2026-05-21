import { AnimatePresence, motion } from "framer-motion";

function Modal({ open, title, children, onClose, footer }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close modal" />
          <motion.div
            className="relative mx-auto mt-16 max-w-lg rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl text-white p-6"
            initial={{ y: 10, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-bold">{title}</div>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="mt-4">{children}</div>
            {footer ? <div className="mt-6">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Modal;

