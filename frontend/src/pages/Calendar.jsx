import { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import api from "../api/axios.js";

const platformColors = {
  instagram: "#E1306C",
  facebook: "#1877F2",
  x: "#F5F3EE",
  linkedin: "#0A66C2",
  pinterest: "#E60023",
};

const Calendar = () => {
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState(new Date());

  useEffect(() => {
    api.get("/posts").then((res) => setPosts(res.data));
  }, []);

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [cursor]);

  const handleDelete = async (id) => {
    await api.delete(`/posts/${id}`);
    setPosts((prev) => prev.filter((p) => p._id !== id));
  };

  const postsForDay = (date) => {
    if (!date) return [];
    return posts.filter((p) => {
      const ref = p.scheduledFor || p.createdAt;
      const d = new Date(ref);
      return (
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
    });
  };

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar />
      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-semibold">
            {cursor.toLocaleString("default", { month: "long", year: "numeric" })}
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-slate hover:text-paper"
            >
              ← Prev
            </button>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="rounded-md border border-white/10 px-3 py-1.5 text-sm text-slate hover:text-paper"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-mono text-slate uppercase">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date, i) => {
            const dayPosts = postsForDay(date);
            return (
              <div
                key={i}
                className={`min-h-[90px] rounded-lg border p-2 text-xs ${
                  date ? "border-white/10 bg-ink-2" : "border-transparent"
                }`}
              >
                {date && <p className="text-slate font-mono mb-1">{date.getDate()}</p>}
                <div className="flex flex-col gap-1">
                  {dayPosts.slice(0, 3).map((p) => (
                    <div key={p._id} className="group flex items-center gap-1 truncate">
                      {p.platforms.slice(0, 3).map((pl) => (
                        <span
                          key={pl}
                          className="h-1.5 w-1.5 rounded-full shrink-0"
                          style={{ background: platformColors[pl] }}
                        />
                      ))}
                      <span className="truncate text-paper flex-1">{p.content}</span>
                      {p.status === "scheduled" && (
                        <button
                          onClick={() => handleDelete(p._id)}
                          title="Delete scheduled post"
                          className="hidden group-hover:inline text-slate hover:text-red-400 shrink-0"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Calendar;
