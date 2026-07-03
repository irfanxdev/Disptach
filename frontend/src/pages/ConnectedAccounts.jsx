import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import api from "../api/axios.js";

const ALL_PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "facebook", label: "Facebook", color: "#1877F2" },
  { id: "x", label: "X", color: "#F5F3EE" },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { id: "pinterest", label: "Pinterest", color: "#E60023" },
];

const ConnectedAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const connected = searchParams.get("connected");
  const error = searchParams.get("error");

  const load = () => api.get("/social").then((res) => setAccounts(res.data));

  useEffect(() => {
    load();
    // Clear the ?connected=/?error= params from the URL after showing the banner once.
    if (connected || error) {
      const t = setTimeout(() => setSearchParams({}), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  const isConnected = (platform) => accounts.some((a) => a.platform === platform);

  const handleDisconnect = async (id) => {
    await api.delete(`/social/${id}`);
    load();
  };

  // Full page redirect into the OAuth flow — the user's JWT rides along as a
  // query param since a browser navigation can't carry an Authorization header.
  // From here the user is sent straight to the platform's own login/consent
  // screen; no coding or manual token entry on their part.
  const handleConnect = (platform) => {
    const token = localStorage.getItem("dispatch_token");
    window.location.href = `/api/social/connect/${platform}?token=${token}`;
  };

  return (
    <div className="flex min-h-screen bg-ink">
      <Sidebar />
      <main className="flex-1 p-8 max-w-2xl mx-auto w-full">
        <h1 className="font-display text-2xl font-semibold mb-1">Connected accounts</h1>
        <p className="text-slate text-sm mb-8">
          Connect a platform once, and every future post can go straight to it.
        </p>

        {connected && (
          <div className="mb-6 rounded-md border border-green/30 bg-green/10 px-4 py-3 text-sm text-green">
            {connected.charAt(0).toUpperCase() + connected.slice(1)} connected successfully.
          </div>
        )}
        {error && (
          <div className="mb-6 rounded-md border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {ALL_PLATFORMS.map((p) => {
            const account = accounts.find((a) => a.platform === p.id);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-2 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                  <div>
                    <p className="text-sm font-medium">{p.label}</p>
                    <p className="text-xs text-slate font-mono">
                      {account ? account.accountName : "Not connected"}
                    </p>
                  </div>
                </div>
                {account ? (
                  <button
                    onClick={() => handleDisconnect(account._id)}
                    className="rounded-md border border-white/10 px-4 py-2 text-xs text-slate hover:text-red-400 hover:border-red-400/30"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(p.id)}
                    className="rounded-md bg-orange text-ink font-semibold px-4 py-2 text-xs hover:-translate-y-0.5 transition"
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ConnectedAccounts;
