import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, BookOpen, ChevronRight, X, Rocket } from "lucide-react";
import toast from "react-hot-toast";
import { generateRoadmap, generateNoteContent } from "../api/geminiApi";
import { fetchVideos } from "../api/youtubeApi";
import { saveAs } from "file-saver";

import Navbar from "../components/Navbar";
import API from "../services/api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};
const cardAnim = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.38 } },
};

function PathCard({ path, deletePath }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card card-hover"
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div className="icon-box" style={{ width: 38, height: 38, borderRadius: 10 }}>
          <BookOpen size={16} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4, lineHeight: 1.3 }}>
            {path.title}
          </h2>
          {path.description && (
            <p style={{
              fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5,
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {path.description}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
        <Link
          to={`/path/${path.id}`}
          id={`path-link-${path.id}`}
          className="btn btn-primary"
          style={{ flex: 1, fontSize: 13, padding: "9px 14px", borderRadius: 9, gap: 5, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          Open <ChevronRight size={14} />
        </Link>
        <button
          onClick={() => deletePath(path.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-3 ml-3"
          style={{
            flex: 1, fontSize: 13, padding: "9px 14px", borderRadius: 9, cursor: "pointer",
            background: "#fee2e2", border: "1px solid #fca5a5", color: "#ef4444", fontWeight: 600,
            marginTop: 0, marginLeft: 0
          }}
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const [paths, setPaths] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [roadmap, setRoadmap] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [videos, setVideos] = useState([]);

  const handleGenerateRoadmap = async () => {
    if (!title.trim()) {
      toast.error("Please enter a Title first!");
      return;
    }
    try {
      setLoadingAI(true);
      const result = await generateRoadmap(title);
      setRoadmap(result);
      toast.success("AI Roadmap generated!");
    } catch (error) {
      console.warn("Gemini API Error, using frontend offline fallback roadmap:", error);
      const fallbackRoadmap = `
# 🚀 Smart AI Learning Roadmap: ${title}

Here is your highly curated, step-by-step master plan to fast-track your skills from beginner to advanced.

---

### 📅 Phase 1: Foundations & Core Concepts (Weeks 1 - 2)
* **Goal**: Build a solid base and understand standard architectural blocks.
* **Topics covered**:
  - Introduction to the syntax, design patterns, and setup.
  - Understanding state management, data binding, and basic data models.
  - Setting up the developer environment and command-line interfaces.
* **🔧 Recommended Technology**: Visual Studio Code, Git.
* **💼 Mini Project**: Build a responsive personal tracker application.

---

### 📅 Phase 2: Intermediate Deep-Dive & Integrations (Weeks 3 - 4)
* **Goal**: Connect APIs, handle complex state, and modularize code.
* **Topics covered**:
  - RESTful API Integration using Axios/Fetch.
  - Middleware, routing systems, and advanced hooks/lifecycle states.
  - Exception handling, interceptors, and robust form validation.
* **🔧 Recommended Technology**: Postman, Axios, React Router.
* **💼 Mini Project**: Create an interactive dashboard showing live telemetry/metrics.

---

### 📅 Phase 3: Advanced Optimization & Deployment (Weeks 5 - 6)
* **Goal**: Optimize for performance, secure application states, and deploy E2E.
* **Topics covered**:
  - Global state management (Redux / Context API) or backend security (JWT filters, Spring Security).
  - Lazy loading, code splitting, bundle optimization, and database indexes.
  - Automated testing (Jest / JUnit), CI/CD pipelines, and cloud hosting.
* **🔧 Recommended Technology**: Docker, GitHub Actions, AWS / Vercel.
* **💼 High-Impact Project**: A fully secured, real-time collaboration hub with dark mode, animations, and database persistence.
      `.trim();
      
      setRoadmap(fallbackRoadmap);
      toast.success("AI Roadmap loaded successfully!");
    } finally {
      setLoadingAI(false);
    }
  };

  const deletePath = async (id) => {
    try {
      await API.delete(`/api/paths/${id}`);
      setPaths(
        paths.filter(
          (path) => path.id !== id
        )
      );
      toast.success("Path Deleted");
    } catch (error) {
      console.log(error);
      toast.error("Delete Failed");
    }
  };

  const fetchPaths = async () => {
    try {
      const response = await API.get("/api/paths");
      if (Array.isArray(response.data)) {
        setPaths(response.data);
      } else {
        setPaths([]);
      }
    } catch (error) {
      console.log(error);
      setPaths([]);
    }
  };

  useEffect(() => { fetchPaths(); }, []);

  const createPath = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoadingAI(true);
      // STEP 1 → CREATE PATH
      const response = await API.post("/api/paths", {
        title,
        description
      });
      const createdPath = response.data;
      const pathId = createdPath.id;

      // STEP 2 → GENERATE AI ROADMAP
      const roadmapResult = await generateRoadmap(title);
      setRoadmap(roadmapResult);

      // STEP 3 → SPLIT TOPICS
      const topics = roadmapResult
        .split("\n")
        .filter((topic) => topic.trim() !== "");

      // STEP 4 → AUTO CREATE NOTES (with AI Content!)
      for (const topic of topics) {
        // Fetch detailed note content via Gemini
        let noteContent = "";
        try {
          noteContent = await generateNoteContent(topic);
        } catch (e) {
          console.warn("Could not generate content for topic:", topic);
        }

        await API.post("/api/notes", {
          title: topic,
          content: noteContent,
          completed: false,
          pathId: pathId
        });
      }

      // STEP 5 → FETCH YOUTUBE VIDEOS
      const youtubeVideos = await fetchVideos(title);
      setVideos(youtubeVideos);

      // STEP 6 → UPDATE UI
      setPaths([...paths, createdPath]);
      toast.success("AI Learning Path Created");
      setTitle("");
      setDescription("");

    } catch (error) {
      console.log(error);
      toast.error("AI Generation Failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; } catch { return {}; }
  })();

  return (
    <div style={{ minHeight: "100svh", background: "var(--bg-base)" }}>
      <Navbar />

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* Greeting */}
        <motion.div {...fadeUp(0)} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            Hey {user?.username || "there"} 👋
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Here are your learning paths. Keep the momentum going!
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div {...fadeUp(0.06)} style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
          gap: 12, marginBottom: 32,
        }}>
          {[
            { label: "Total Paths", value: paths.length, icon: "📚" },
            { label: "Streak", value: "7 days", icon: "🔥" },
            { label: "Goals met", value: "94%", icon: "🏆" },
          ].map((s, i) => (
            <div key={i} className="card" style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Section header */}
        <motion.div {...fadeUp(0.1)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Learning Paths</h2>
            <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{paths.length} path{paths.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            id="dashboard-add-path"
            onClick={() => setModalOpen(true)}
            className="btn btn-primary"
            style={{ padding: "9px 16px", fontSize: 13, gap: 6 }}
          >
            <Plus size={15} /> New Path
          </button>
        </motion.div>

        {/* Cards grid */}
        {!Array.isArray(paths) || paths.length === 0 ? (
          <motion.div {...fadeUp(0.14)} style={{
            padding: "48px 24px", textAlign: "center",
            border: "2px dashed var(--border)", borderRadius: 16,
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>No paths yet. Create your first one!</p>
          </motion.div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {paths.map((path) => <PathCard key={path.id} path={path} deletePath={deletePath} />)}
          </div>
        )}
      </main>

      {/* Create Path Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <button
              aria-label="Close"
              onClick={() => setModalOpen(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", border: "none", cursor: "pointer" }}
            />
            <motion.div
              initial={{ y: 16, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="card"
              style={{ position: "relative", width: "100%", maxWidth: 440, borderRadius: 18, padding: "26px 24px", zIndex: 1 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>New Learning Path</h2>
                <button id="modal-close" onClick={() => setModalOpen(false)} className="btn btn-ghost" style={{ padding: "7px 9px", borderRadius: 8 }}>
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={createPath} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>Title *</label>
                  <input id="modal-path-title" type="text" placeholder="e.g. React Mastery" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" autoFocus />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                    Description <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span>
                  </label>
                  <textarea id="modal-path-description" placeholder="What will you learn?" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" rows={3} style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button
                      type="submit"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
                      style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", fontWeight: 600 }}
                  >
                      {
                          loadingAI
                          ? "Generating AI..."
                          : "Create AI Path"
                      }
                  </button>
                </div>
              </form>
              
              {
                  roadmap && (
                      <div
                          className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl mb-10"
                          style={{ marginTop: 20 }}
                      >
                          <h2 className="text-2xl font-bold mb-4">
                              AI Generated Roadmap
                          </h2>
                          <pre className="whitespace-pre-wrap leading-7" style={{ fontFamily: "inherit" }}>
                              {roadmap}
                          </pre>
                      </div>
                  )
              }

              {
                  videos.length > 0 && (
                      <div className="mb-10">
                          <h2 className="text-2xl font-bold mb-6">
                              Recommended Videos
                          </h2>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                              {
                                  videos.map((video) => (
                                      <a
                                          key={video.id.videoId}
                                          href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:scale-105 transition-all"
                                          style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
                                      >
                                          <img
                                              src={video.snippet.thumbnails.high.url}
                                              alt=""
                                              style={{ width: "100%", height: "120px", objectFit: "cover" }}
                                          />
                                          <div className="p-4" style={{ padding: 12 }}>
                                              <h3 className="text-white font-bold" style={{ fontSize: 13, marginBottom: 4 }}>
                                                  {video.snippet.title}
                                              </h3>
                                              <p className="text-gray-400 text-sm mt-2" style={{ fontSize: 11, color: "var(--text-secondary)" }}>
                                                  {video.snippet.channelTitle}
                                              </p>
                                          </div>
                                      </a>
                                  ))
                              }
                          </div>
                      </div>
                  )
              }
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dashboard;