function GlassCard({ children, className = "", as: Component = "div", ...props }) {
  return (
    <Component
      className={
        "rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl " +
        "text-white/90 dark:text-white/90 " +
        "transition-transform duration-300 hover:translate-y-[-2px] " +
        "" +
        className
      }
      {...props}
    >
      {children}
    </Component>
  );
}

export default GlassCard;

