import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Sparkles, KeyRound, ArrowRight, RotateCcw } from "lucide-react";

import API from "../services/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

function Register() {
  const navigate = useNavigate();
  const [username, setUsername]       = useState("");
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);

  // OTP flow
  const [otpSent, setOtpSent]         = useState(false);
  const [otp, setOtp]                 = useState("");
  const [verifying, setVerifying]     = useState(false);

  // ── STEP 1: Send OTP ──
  const sendOtp = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all fields first");
      return;
    }
    setLoading(true);
    try {
      await API.post("/api/auth/send-otp", { email });
      toast.success("OTP sent to " + email + "! Check your inbox.");
      setOtpSent(true);
    } catch (err) {
      const msg = err.response?.data || "Failed to send OTP";
      toast.error(typeof msg === "string" ? msg : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 2: Verify OTP + Register ──
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) { toast.error("Please enter the OTP"); return; }
    setVerifying(true);
    try {
      await API.post("/api/auth/verify-otp", { username, email, password, otp });
      toast.success("Account created! Please sign in 🎉");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data || "Invalid OTP";
      toast.error(typeof msg === "string" ? msg : "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{ minHeight: "100svh", background: "var(--bg-base)", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <div style={{ borderBottom: "1px solid var(--border)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={14} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>LearningHub</span>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Step indicator */}
          <motion.div {...fadeUp(0)} style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 24 }}>
            {["Details", "Verify OTP"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 99,
                  background: (otpSent ? i === 1 : i === 0) ? "var(--accent)" : "var(--bg-subtle)",
                  color: (otpSent ? i === 1 : i === 0) ? "#fff" : "var(--text-muted)",
                  fontSize: 12, fontWeight: 600, transition: "all 0.3s",
                }}>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: (otpSent ? i === 1 : i === 0) ? "rgba(255,255,255,0.25)" : "var(--border)",
                    fontSize: 10, fontWeight: 700,
                  }}>{i + 1}</span>
                  {label}
                </div>
                {i === 0 && <div style={{ width: 24, height: 1, background: "var(--border)" }} />}
              </div>
            ))}
          </motion.div>

          {/* Header */}
          <motion.div {...fadeUp(0.04)} style={{ marginBottom: 24, textAlign: "center" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
              {otpSent ? "Verify your email" : "Create account"}
            </h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
              {otpSent
                ? `We sent a 6-digit OTP to ${email}`
                : "Join LearningHub and start tracking your progress."}
            </p>
          </motion.div>

          {/* Card */}
          <AnimatePresence mode="wait">
            {!otpSent ? (
              /* ── STEP 1: Details form ── */
              <motion.div
                key="details"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="card"
                style={{ padding: "28px 24px" }}
              >
                <form onSubmit={sendOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* Username */}
                  <div>
                    <label htmlFor="register-username" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                      Username
                    </label>
                    <div style={{ position: "relative" }}>
                      <User size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        id="register-username"
                        type="text"
                        placeholder="your_username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="input-field"
                        style={{ paddingLeft: 36 }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="register-email" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                      Email
                    </label>
                    <div style={{ position: "relative" }}>
                      <Mail size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        id="register-email"
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
                    <label htmlFor="register-password" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                      Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <Lock size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        id="register-password"
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
                        id="register-toggle-pw"
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

                  {/* Submit */}
                  <button
                    id="register-send-otp"
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "12px", fontSize: 14, borderRadius: 10, marginTop: 2, gap: 8 }}
                  >
                    {loading ? "Sending OTP…" : <><ArrowRight size={15} /> Send OTP to Email</>}
                  </button>
                </form>
              </motion.div>
            ) : (
              /* ── STEP 2: OTP verification ── */
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                className="card"
                style={{ padding: "28px 24px" }}
              >
                <form onSubmit={verifyOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* OTP input */}
                  <div>
                    <label htmlFor="register-otp" style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                      Enter 6-digit OTP
                    </label>
                    <div style={{ position: "relative" }}>
                      <KeyRound size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                      <input
                        id="register-otp"
                        type="text"
                        placeholder="e.g. 483921"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        required
                        maxLength={6}
                        autoFocus
                        className="input-field"
                        style={{ paddingLeft: 36, letterSpacing: "0.2em", fontSize: 18, fontWeight: 700, textAlign: "center" }}
                      />
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
                      Check your inbox (and spam folder) for the OTP.
                    </p>
                  </div>

                  {/* Verify button */}
                  <button
                    id="register-verify-otp"
                    type="submit"
                    disabled={verifying || otp.length < 6}
                    className="btn btn-primary"
                    style={{ width: "100%", padding: "12px", fontSize: 14, borderRadius: 10, gap: 8 }}
                  >
                    {verifying ? "Verifying…" : <><KeyRound size={15} /> Verify & Create Account</>}
                  </button>

                  {/* Resend */}
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtp(""); }}
                    className="btn btn-ghost"
                    style={{ width: "100%", fontSize: 13, gap: 6 }}
                  >
                    <RotateCcw size={13} /> Change details / Resend OTP
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login link */}
          <motion.p {...fadeUp(0.14)} style={{ textAlign: "center", fontSize: 13, color: "var(--text-secondary)", marginTop: 20 }}>
            Already have an account?{" "}
            <Link to="/" id="register-to-login" style={{ color: "var(--accent)", fontWeight: 600 }}>Sign in</Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
}

export default Register;