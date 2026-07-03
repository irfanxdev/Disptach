import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
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
          <h1 className="font-display text-xl font-semibold mb-1">Create your account</h1>

          {error && <p className="text-sm text-red-400 font-mono">{error}</p>}

          <input
            required
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md bg-ink border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-cyan"
          />
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
            minLength={6}
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md bg-ink border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-cyan"
          />

          <button
            disabled={loading}
            className="mt-2 rounded-md bg-orange text-ink font-semibold py-2.5 text-sm hover:-translate-y-0.5 transition disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="text-center text-sm text-slate mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
