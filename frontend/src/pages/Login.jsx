import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <span className="h-2 w-2 rounded-full bg-orange shadow-[0_0_10px_#FF6B35]" />
          <span className="font-display text-xl font-bold">Dispatch</span>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-ink-2 p-7 flex flex-col gap-4">
          <h1 className="font-display text-xl font-semibold mb-1">Welcome back</h1>

          {error && <p className="text-sm text-red-400 font-mono">{error}</p>}

          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md bg-ink border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-cyan"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md bg-ink border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-cyan"
          />

          <button
            disabled={loading}
            className="mt-2 rounded-md bg-orange text-ink font-semibold py-2.5 text-sm hover:-translate-y-0.5 transition disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-slate mt-2">
            No account?{" "}
            <Link to="/register" className="text-cyan hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
