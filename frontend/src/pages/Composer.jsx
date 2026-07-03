import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import api from "../api/axios.js";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "facebook", label: "Facebook", color: "#1877F2" },
  { id: "x", label: "X", color: "#F5F3EE" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { id: "pinterest", label: "Pinterest", color: "#E60023" },
];

const Composer = () => {
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [file, setFile] = useState(null);
  const [scheduleMode, setScheduleMode] = useState(false);
  const [scheduledFor, setScheduledFor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePlatform = (id) => {
    setPlatforms((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!platforms.length) {
      setError("Choose at least one platform");
      return;
    }
    if (scheduleMode && !scheduledFor) {
      setError("Pick a date and time to schedule for");
      return;
    }

    setLoading(true);
    try {
      let mediaUrls = [];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        mediaUrls = [data.url];
      }

      await api.post("/posts", {
        content,
        platforms,
        mediaUrls,
        scheduledFor: scheduleMode ? scheduledFor : null,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar />
      <main className="flex-1 p-8 max-w-2xl mx-auto w-full">
        <h1 className="font-display text-2xl font-semibold mb-1">New post</h1>
        <p className="text-slate text-sm mb-8">Write once, choose where it lands.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && <p className="text-sm text-red-400 font-mono">{error}</p>}

          <div>
            <label className="text-xs font-mono uppercase text-slate mb-2 block">Content</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share?"
              className="w-full rounded-md bg-ink-2 border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-cyan resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate mb-2 block">Media (optional)</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm text-slate file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-paper file:text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate mb-2 block">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                    platforms.includes(p.id)
                      ? "border-cyan text-paper bg-cyan/10"
                      : "border-white/10 text-slate hover:border-white/25"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-ink-2 p-4">
            <label className="flex items-center gap-2 text-sm mb-3 cursor-pointer">
              <input
                type="checkbox"
                checked={scheduleMode}
                onChange={(e) => setScheduleMode(e.target.checked)}
                className="accent-orange"
              />
              Schedule for later
            </label>
            {scheduleMode && (
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="rounded-md bg-ink border border-white/10 px-3 py-2 text-sm outline-none focus:border-cyan"
              />
            )}
          </div>

          <button
            disabled={loading}
            className="rounded-md bg-orange text-ink font-semibold py-3 text-sm hover:-translate-y-0.5 transition disabled:opacity-60"
          >
            {loading ? "Sending…" : scheduleMode ? "Schedule post" : "Publish now"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Composer;
