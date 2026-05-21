function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={
        "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 " +
        "focus:outline-none focus:ring-2 focus:ring-violet-400/70 focus:border-violet-300/40 " +
        "transition min-h-[110px] " +
        className
      }
      {...props}
    />
  );
}

export default Textarea;

