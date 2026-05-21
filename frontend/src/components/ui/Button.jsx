function Button({
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-violet-400/70";

  const variants = {
    primary:
      "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 text-black hover:opacity-95 shadow-[0_12px_30px_-12px_rgba(168,85,247,0.55)]",
    ghost:
      "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white border border-white/10",
    danger: "bg-red-500/90 text-white hover:bg-red-500",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}

export default Button;

