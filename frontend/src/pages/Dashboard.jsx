import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import PostCard from "../components/PostCard.jsx";
import api from "../api/axios.js";

const TABS = [
  { id: "all", label: "All" },
  { id: "scheduled", label: "Scheduled" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
  { id: "failed", label: "Failed" },
];

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  const load = async () => {
    const { data } = await api.get("/posts");
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handlePublishNow = async (id) => {
    await api.post(`/posts/${id}/publish-now`);
    load();
  };

  const handleDelete = async (id) => {
    await api.delete(`/posts/${id}`);
    load();
  };

  const counts = {
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    published: posts.filter((p) => p.status === "published").length,
    failed: posts.filter((p) => p.status === "failed").length,
  };

  const filteredPosts = tab === "all" ? posts : posts.filter((p) => p.status === tab);

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar />
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
            <p className="text-slate text-sm mt-1">Everything you've posted or queued, in one place.</p>
          </div>
          <Link
            to="/composer"
            className="rounded-md bg-orange text-ink font-semibold px-5 py-2.5 text-sm hover:-translate-y-0.5 transition"
          >
            New post
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-white/10 bg-ink-2 p-5">
            <p className="text-slate text-xs font-mono uppercase">Scheduled</p>
            <p className="font-display text-3xl font-semibold mt-1">{counts.scheduled}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-ink-2 p-5">
            <p className="text-slate text-xs font-mono uppercase">Published</p>
            <p className="font-display text-3xl font-semibold mt-1 text-green">{counts.published}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-ink-2 p-5">
            <p className="text-slate text-xs font-mono uppercase">Failed</p>
            <p className="font-display text-3xl font-semibold mt-1 text-red-400">{counts.failed}</p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b border-white/10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2.5 text-sm border-b-2 -mb-px transition ${
                tab === t.id
                  ? "border-orange text-paper"
                  : "border-transparent text-slate hover:text-paper"
              }`}
            >
              {t.label}
              {t.id !== "all" && (
                <span className="ml-1.5 text-xs text-slate">
                  ({posts.filter((p) => p.status === t.id).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-slate text-sm">Loading…</p>
        ) : filteredPosts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/15 p-12 text-center">
            <p className="text-slate text-sm">
              {tab === "all" ? "No posts yet. Start your first one." : `No ${tab} posts.`}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} onPublishNow={handlePublishNow} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
