import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-72 shrink-0">
      <div className="sticky top-20 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
        <div className="px-2 py-1 text-xs font-semibold tracking-wide text-white/60">Student Hub</div>
        <nav className="mt-2 flex flex-col gap-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              "px-3 py-2 rounded-xl transition " +
              (isActive
                ? "bg-white/10 text-white border border-white/10"
                : "text-white/70 hover:text-white hover:bg-white/5 border border-transparent")
            }
          >
            Dashboard
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;

