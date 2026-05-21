import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, CheckCircle2, Circle, ExternalLink, X, Zap } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import API from "../services/api";
import { generateNoteContent } from "../api/geminiApi";
import { fetchVideos } from "../api/youtubeApi";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});
const stagger = { initial: {}, animate: { transition: { staggerChildren: 0.06 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.32 } } };

function PathDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [resources, setResources] = useState([]);
  const [progress, setProgress] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [path, setPath] = useState(null);
  const [videos, setVideos] = useState([]);

  const fetchNotes = async () => {
    try { const r = await API.get(`/api/notes/path/${id}`); setNotes(r.data); } catch (e) { console.log(e); }
  };
  const fetchResources = async () => {
    try { const r = await API.get(`/api/resources/${id}`); setResources(r.data); } catch (e) { console.log(e); }
  };
  const fetchProgress = async () => {
    try { const r = await API.get(`/api/progress/${id}`); setProgress(r.data); } catch (e) { console.log(e); }
  };
  const fetchPath = async () => {
    try { 
      const r = await API.get(`/api/paths/${id}`); 
      setPath(r.data);
      if (r.data && r.data.title) {
        const videoData = await fetchVideos(r.data.title);
        setVideos(videoData);
      }
    } catch (e) { console.log(e); }
  };

  useEffect(() => {
    const run = async () => { 
      await fetchPath();
      await fetchNotes(); 
      await fetchResources(); 
      await fetchProgress(); 
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const createNote = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setAddingNote(true);
    try {
      await API.post("/api/notes", { title, content, pathId: id });
      setTitle(""); setContent("");
      setNoteModalOpen(false);
      toast.success("Note added!");
      fetchNotes(); fetchProgress();
    } catch (error) { toast.error("Failed to add note."); console.log(error); }
    finally { setAddingNote(false); }
  };

  const handleGenerateNote = async () => {
    if (!title.trim()) {
      toast.error("Please enter a Note Title first!");
      return;
    }
    setGeneratingAI(true);
    try {
      const result = await generateNoteContent(title);
      setContent(result);
      toast.success("AI Notes loaded successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate notes.");
    } finally {
      setGeneratingAI(false);
    }
  };

  const markAsDone = async (noteId) => {
    try { await API.put(`/api/notes/${noteId}`); toast.success("Marked as done!"); fetchNotes(); fetchProgress(); }
    catch (error) { console.log(error); }
  };

  const pct = progress?.completionPercentage ?? 0;

  return (
    <div style={{ minHeight: "100svh", background: "var(--bg-base)" }}>
      <Navbar />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 64px" }}>

        {/* Back */}
        <motion.button
          {...fadeUp(0)}
          id="path-back-btn"
          onClick={() => navigate("/dashboard")}
          className="btn btn-ghost"
          style={{ marginBottom: 22, padding: "8px 14px", fontSize: 13, gap: 5, borderRadius: 9 }}
        >
          <ArrowLeft size={14} /> Back
        </motion.button>

        {/* Title */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 800, color: "var(--text-primary)" }}>
            Path Details
          </h1>
        </motion.div>

        {/* Progress */}
        <AnimatePresence>
          {progress && (
            <motion.div {...fadeUp(0.08)} className="card" style={{ padding: "20px 22px", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Progress</div>
                  <div style={{ fontSize: 26, fontWeight: 900, color: "var(--accent)" }}>{pct}%</div>
                </div>
                <span style={{ fontSize: 28 }}>{pct >= 100 ? "🏆" : pct >= 50 ? "🔥" : "🚀"}</span>
              </div>
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--text-muted)" }}>
                <span>{notes.filter(n => n.status === "done").length} done</span>
                <span>{notes.length} total</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes */}
        <motion.div {...fadeUp(0.12)}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Notes</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
            </div>
            <button id="add-note-btn" onClick={() => setNoteModalOpen(true)} className="btn btn-primary" style={{ padding: "8px 14px", fontSize: 13, gap: 5 }}>
              <Plus size={14} /> Add Note
            </button>
          </div>

          {notes.length === 0 ? (
            <div style={{ padding: "40px 20px", textAlign: "center", border: "2px dashed var(--border)", borderRadius: 14, marginBottom: 28 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>📝</div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>No notes yet. Add one to get started!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12, marginBottom: 32 }}>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className="card card-hover"
                  style={{ padding: 18, display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                      background: note.status === "done" ? "#dcfce7" : "var(--accent-light)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {note.status === "done"
                        ? <CheckCircle2 size={15} color="#16a34a" />
                        : <Circle size={15} color="var(--accent)" />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 4 }}>{note.title}</h3>
                      <span className={`badge ${note.status === "done" ? "badge-green" : "badge-violet"}`}>
                        {note.status === "done" ? "Done" : "In progress"}
                      </span>
                    </div>
                  </div>
                  {note.content && (
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{note.content}</p>
                  )}
                  {note.status !== "done" && (
                    <button
                      id={`note-done-${note.id}`}
                      onClick={() => markAsDone(note.id)}
                      className="btn btn-ghost"
                      style={{ fontSize: 12, padding: "7px 12px", gap: 5, borderRadius: 8, width: "100%" }}
                    >
                      <CheckCircle2 size={13} /> Mark done
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Resources */}
        {resources.length > 0 && (
          <motion.div {...fadeUp(0.16)}>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 2 }}>Resources</h2>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{resources.length} resource{resources.length !== 1 ? "s" : ""}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {resources.map((resource) => (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.28 }}
                  className="card card-hover"
                  style={{ padding: 18 }}
                >
                  {resource.type && (
                    <span className="badge badge-cyan" style={{ marginBottom: 8 }}>{resource.type}</span>
                  )}
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    id={`resource-link-${resource.id}`}
                    style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 14, fontWeight: 600, color: "var(--accent)", wordBreak: "break-word" }}
                  >
                    {resource.title} <ExternalLink size={12} style={{ flexShrink: 0 }} />
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Videos */}
        {videos && videos.length > 0 && (
          <div className="mt-10" style={{ marginTop: 24 }}>
            <h2 className="text-2xl font-bold mb-6" style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 14 }}>
              Recommended Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {videos.map((video) => (
                <a
                  key={video.id.videoId}
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 rounded-xl overflow-hidden shadow-lg card card-hover"
                  style={{ display: "flex", flexDirection: "column", textDecoration: "none" }}
                >
                  <img
                    src={video.snippet.thumbnails.high.url}
                    alt={video.snippet.title}
                    style={{ width: "100%", height: "140px", objectFit: "cover", borderTopLeftRadius: "14px", borderTopRightRadius: "14px" }}
                  />
                  <div className="p-4" style={{ padding: 18 }}>
                    <h3 className="font-bold" style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.3 }}>
                      {video.snippet.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2" style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 6 }}>
                      {video.snippet.channelTitle}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Note Modal */}
      <AnimatePresence>
        {noteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          >
            <button aria-label="Close" onClick={() => setNoteModalOpen(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", border: "none", cursor: "pointer" }} />
            <motion.div
              initial={{ y: 16, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="card"
              style={{ position: "relative", width: "100%", maxWidth: 440, borderRadius: 18, padding: "26px 24px", zIndex: 1 }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)" }}>Add Note</h2>
                <button id="note-modal-close" onClick={() => setNoteModalOpen(false)} className="btn btn-ghost" style={{ padding: "7px 9px", borderRadius: 8 }}>
                  <X size={15} />
                </button>
              </div>
              <form onSubmit={createNote} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>Title *</label>
                  <input id="note-title-input" type="text" placeholder="What did you learn?" value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" autoFocus />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                      Content <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span>
                    </label>
                    <button
                      type="button"
                      id="ai-generate-note-btn"
                      onClick={handleGenerateNote}
                      disabled={generatingAI}
                      style={{
                        padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 6,
                        color: "var(--accent)", border: "1px solid var(--border)",
                        background: "var(--accent-light)", display: "flex", alignItems: "center", gap: 4,
                        cursor: "pointer"
                      }}
                    >
                      {generatingAI ? (
                        <>Generating guide…</>
                      ) : (
                        <>⚡ AI Auto-Fill Guide</>
                      )}
                    </button>
                  </div>
                  <textarea id="note-content-input" placeholder="Write your notes…" value={content} onChange={(e) => setContent(e.target.value)} className="input-field" rows={5} style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="button" onClick={() => setNoteModalOpen(false)} className="btn btn-ghost" style={{ flex: 1 }}>Cancel</button>
                  <button id="note-submit-btn" type="submit" disabled={addingNote} className="btn btn-primary" style={{ flex: 2 }}>
                    {addingNote ? "Saving…" : <><Zap size={14} /> Save Note</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PathDetail;