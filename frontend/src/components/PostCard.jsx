const statusStyles = {
  draft: "text-slate border-white/10",
  scheduled: "text-cyan border-cyan/30",
  publishing: "text-orange border-orange/30",
  published: "text-green border-green/30",
  failed: "text-red-400 border-red-400/30",
};

const platformColors = {
  instagram: "#E1306C",
  facebook: "#1877F2",
  x: "#F5F3EE",
  linkedin: "#0A66C2",
  pinterest: "#E60023",
};

const PostCard = ({ post, onPublishNow, onDelete }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-ink-2 p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-paper leading-relaxed line-clamp-3">{post.content}</p>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-mono uppercase tracking-wide ${statusStyles[post.status]}`}
        >
          {post.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {post.platforms.map((p) => (
          <span
            key={p}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate"
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: platformColors[p] }} />
            {p}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate font-mono">
        <span>
          {post.scheduledFor
            ? `scheduled: ${new Date(post.scheduledFor).toLocaleString()}`
            : `created: ${new Date(post.createdAt).toLocaleString()}`}
        </span>
        <div className="flex gap-3">
          {post.status !== "published" && (
            <button onClick={() => onPublishNow(post._id)} className="text-cyan hover:underline">
              Publish now
            </button>
          )}
          <button onClick={() => onDelete(post._id)} className="text-slate hover:text-red-400">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
