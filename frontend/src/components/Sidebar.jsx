import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/composer", label: "New post" },
  { to: "/calendar", label: "Calendar" },
  { to: "/accounts", label: "Connected accounts" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col justify-between border-r border-white/10 bg-ink-2 p-5">
      <div>
        <div className="flex items-center gap-2 px-1 mb-8">
          <span className="h-2 w-2 rounded-full bg-orange shadow-[0_0_10px_#FF6B35]" />
          <span className="font-display text-lg font-bold tracking-tight">Dispatch</span>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm transition ${
                  isActive ? "bg-white/10 text-paper" : "text-slate hover:text-paper hover:bg-white/5"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="px-1 text-sm text-paper truncate">{user?.name}</p>
        <p className="px-1 text-xs text-slate truncate mb-3">{user?.email}</p>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full rounded-md border border-white/10 px-3 py-2 text-sm text-slate hover:text-paper hover:border-white/20 transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
