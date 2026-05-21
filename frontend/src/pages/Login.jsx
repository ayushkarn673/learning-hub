import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";

import API from "../services/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend returns a JWT token string on success (200 OK)
      const response = await API.post("/api/auth/login", { email, password });
      const token = response.data;

      if (token && typeof token === "string") {
        // Store JWT token and user info
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify({ email, username: email.split("@")[0] }));
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error("Invalid response from server");
      }
    } catch (error) {
      console.log(error);
      const msg = error.response?.data || "Login failed. Check your credentials.";
      toast.error(typeof msg === "string" ? msg : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100svh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{
        borderBottom: "1px solid var(--border)", padding: "14px 24px",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Sparkles size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          LearningHub
        </span>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Header */}
          <motion.div {...fadeUp(0)} style={{ marginBottom: 28, textAlign: "center" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8 }}>
              Sign in
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              Welcome back — continue your learning journey.
            </p>
          </motion.div>

          {/* Card */}
          <motion.div {...fadeUp(0.07)} className="card" style={{ padding: "28px 24px" }}>
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Email */}
              <div>
                <label htmlFor="login-email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@university.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-field"
                    style={{ paddingLeft: 36 }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <Lock size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-field"
                    style={{ paddingLeft: 36, paddingRight: 42 }}
                  />
                  <button
                    type="button"
                    id="login-toggle-pw"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((s) => !s)}
                    style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: "var(--text-muted)", display: "flex", alignItems: "center", padding: 4,
                    }}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-secondary)", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--accent)" }} />
                  Remember me
                </label>
                <Link
                  to="#"
                  id="login-forgot"
                  onClick={(e) => e.preventDefault()}
                  style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", fontSize: 14, borderRadius: 10, marginTop: 2 }}
              >
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </motion.div>

          {/* Register link */}
          <motion.p {...fadeUp(0.14)} style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)", marginTop: 20 }}>
            Don't have an account?{" "}
            <Link to="/register" id="login-to-register" style={{ color: "var(--accent)", fontWeight: 600 }}>
              Create one
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}
