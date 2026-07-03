import { Link } from "react-router-dom";

const PLATFORMS = [
  { label: "Instagram", color: "#E1306C" },
  { label: "Facebook", color: "#1877F2" },
  { label: "X", color: "#F5F3EE" },
  { label: "Pinterest", color: "#E60023" },
  { label: "LinkedIn", color: "#0A66C2" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/75 backdrop-blur">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="h-2 w-2 rounded-full bg-orange shadow-[0_0_10px_#FF6B35]" />
            Dispatch
          </div>
          <div className="hidden md:flex gap-9 text-sm text-slate">
            <a href="#features" className="hover:text-paper">Features</a>
            <a href="#how" className="hover:text-paper">How it works</a>
          </div>
          <Link to="/register" className="rounded-md bg-paper text-ink font-semibold text-sm px-5 py-2.5 hover:-translate-y-0.5 transition">
            Start free
          </Link>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-8 pt-24 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-orange mb-5 flex items-center gap-2">
            <span className="w-4 h-px bg-orange" /> Built for founders &amp; small teams
          </p>
          <h1 className="font-display font-bold text-5xl md:text-6xl leading-[1.03] tracking-tight mb-6">
            Write it once. It lands <span className="text-orange">everywhere.</span>
          </h1>
          <p className="text-slate text-lg leading-relaxed max-w-md mb-8">
            Dispatch is the control room for your social presence — compose a post, schedule it, and
            send it to every platform at once.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/register" className="rounded-md bg-orange text-ink font-semibold px-6 py-3.5 text-sm hover:-translate-y-0.5 transition">
              Start free — no card needed
            </Link>
            <a href="#how" className="rounded-md border border-white/10 px-5 py-3.5 text-sm hover:border-white/25 transition">
              See how it works
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-ink-2 p-8 flex flex-wrap gap-3 justify-center items-center min-h-[280px]">
          {PLATFORMS.map((p) => (
            <span key={p.label} className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
              {p.label}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="font-display text-3xl font-semibold mb-10">Everything a lean team needs</h2>
        <div className="grid md:grid-cols-3 gap-px bg-white/10 border border-white/10 rounded-xl overflow-hidden">
          {[
            ["Compose once", "One post, tailored per platform without duplicating your work."],
            ["Schedule ahead", "Queue a week of content in one sitting."],
            ["Cross-post everywhere", "Connect every platform once, post to all of them going forward."],
          ].map(([title, desc]) => (
            <div key={title} className="bg-ink p-8 hover:bg-ink-2 transition">
              <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
              <p className="text-slate text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-ink-2 text-center py-24 px-8">
        <h2 className="font-display font-bold text-4xl mb-4">Stop posting one platform at a time.</h2>
        <Link to="/register" className="inline-block rounded-md bg-orange text-ink font-semibold px-6 py-3.5 text-sm hover:-translate-y-0.5 transition">
          Start free — no card needed
        </Link>
      </section>

      <footer className="max-w-6xl mx-auto px-8 py-8 flex justify-between text-xs text-slate font-mono">
        <span>© 2026 Dispatch</span>
        <span>Made for founders who'd rather build than copy-paste captions</span>
      </footer>
    </div>
  );
};

export default Landing;
