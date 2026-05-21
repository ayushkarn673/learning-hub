import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, LogOut, LayoutDashboard, Menu, X, Moon, Sun } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // ── Dark Mode ──
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const user = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: dark ? "rgba(14,14,20,0.92)" : "rgba(255,255,255,0.92)",
      borderBottom: "1px solid var(--border)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      transition: "background 0.25s ease",
    }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

        {/* Logo */}
        <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            LearningHub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6 }} className="desktop-nav">
          <Link
            to="/dashboard"
            id="nav-dashboard"
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600,
              color: "var(--text-secondary)", transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-subtle)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            <LayoutDashboard size={14} /> Dashboard
          </Link>

          {/* Dark mode toggle */}
          <button
            id="theme-toggle"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="btn btn-ghost"
            style={{ padding: "7px 10px", borderRadius: 8, fontSize: 13, gap: 5 }}
          >
            <motion.div
              key={dark ? "moon" : "sun"}
              initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {dark ? <Sun size={15} /> : <Moon size={15} />}
            </motion.div>
          </button>

          <button
            id="nav-logout"
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ padding: "7px 14px", fontSize: 13, gap: 5, borderRadius: 8 }}
          >
            <LogOut size={13} /> Logout
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            id="theme-toggle-mobile"
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="btn btn-ghost mobile-only"
            style={{ padding: "7px 10px", borderRadius: 8 }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            type="button"
            className="btn btn-ghost mobile-only"
            style={{ padding: "7px 9px", borderRadius: 8 }}
            id="nav-mobile-toggle"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={17} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 200 }}
          >
            <button
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", border: "none", cursor: "pointer" }}
            />
            <motion.div
              initial={{ y: -8, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              style={{
                position: "absolute", top: 12, left: 12, right: 12,
                background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border)",
                boxShadow: "var(--shadow-lg)", padding: 16, zIndex: 1,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Hi, {user?.username || "Learner"}
                </span>
                <button onClick={() => setMenuOpen(false)} className="btn btn-ghost" style={{ padding: "5px 7px", borderRadius: 7 }}>
                  <X size={15} />
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn btn-ghost" style={{ justifyContent: "flex-start", gap: 8 }}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="btn btn-danger" style={{ justifyContent: "flex-start", gap: 8 }}>
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline responsive style */}
      <style>{`
        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: inline-flex !important; }
        }
        @media (min-width: 601px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </header>
  );
}

export default Navbar;
