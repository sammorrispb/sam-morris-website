"use client";

import { useState, useEffect, useCallback } from "react";

interface Lead {
  name: string;
  email: string;
  interest: string;
  status: string;
  dateSubmitted: string;
}

interface LeadsData {
  total: number;
  recentCount: number;
  interestBreakdown: { interest: string; count: number }[];
  leads: Lead[];
}

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<LeadsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLeads = useCallback(async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/leads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      setData(await res.json());
    } catch {
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored) {
      setAuthed(true);
      fetchLeads(stored);
    }
  }, [fetchLeads]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setError("Invalid password");
        return;
      }

      sessionStorage.setItem("admin_token", password);
      setAuthed(true);
      fetchLeads(password);
    } catch {
      setError("Something went wrong");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    setAuthed(false);
    setData(null);
    setPassword("");
  }

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="bg-navy-light glow-border rounded-xl p-8 w-full max-w-sm space-y-4"
        >
          <h1 className="font-heading font-bold text-2xl text-center">
            Admin
          </h1>
          <input
            type="password"
            placeholder="Password"
            aria-label="Admin password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:border-accent-blue focus:outline-none transition-colors"
          />
          <button
            type="submit"
            className="w-full text-white font-heading font-semibold py-3 rounded-lg btn-gradient"
          >
            Log In
          </button>
          {error && (
            <p role="alert" className="text-accent-pink text-sm text-center">
              {error}
            </p>
          )}
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-text-muted font-mono animate-pulse">
          Loading leads...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="bg-navy-light glow-border rounded-xl p-8 w-full max-w-sm space-y-4 text-center">
          <h1 className="font-heading font-bold text-2xl">Lead Dashboard</h1>
          {error && (
            <p role="alert" className="text-accent-pink text-sm">
              {error}
            </p>
          )}
          <button
            onClick={() => fetchLeads(sessionStorage.getItem("admin_token") ?? "")}
            className="w-full text-white font-heading font-semibold py-3 rounded-lg btn-gradient"
          >
            Retry
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-text-muted hover:text-text-primary text-sm font-mono transition-colors py-2"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  const maxCount = data.interestBreakdown[0]?.count ?? 1;
  const topInterest = data.interestBreakdown[0]?.interest ?? "—";

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-heading font-bold text-3xl">Lead Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-text-muted hover:text-text-primary text-sm font-mono transition-colors"
        >
          Log Out
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-navy-light glow-border rounded-xl p-6">
          <p className="text-text-muted text-xs uppercase tracking-wider font-mono mb-1">
            Total Leads
          </p>
          <p className="font-heading font-bold text-3xl text-accent-blue">
            {data.total}
          </p>
        </div>
        <div className="bg-navy-light glow-border rounded-xl p-6">
          <p className="text-text-muted text-xs uppercase tracking-wider font-mono mb-1">
            Last 7 Days
          </p>
          <p className="font-heading font-bold text-3xl text-accent-lime">
            {data.recentCount}
          </p>
        </div>
        <div className="bg-navy-light glow-border rounded-xl p-6">
          <p className="text-text-muted text-xs uppercase tracking-wider font-mono mb-1">
            Top Interest
          </p>
          <p className="font-heading font-bold text-xl text-accent-purple truncate">
            {topInterest}
          </p>
        </div>
      </div>

      {/* Interest Breakdown */}
      <div className="bg-navy-light glow-border rounded-xl p-6 mb-10">
        <h2 className="font-heading font-bold text-lg mb-6">
          Interest Breakdown
        </h2>
        <div className="space-y-4">
          {data.interestBreakdown.map(({ interest, count }) => (
            <div key={interest}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-primary">{interest}</span>
                <span className="text-text-muted font-mono">{count}</span>
              </div>
              <div className="h-3 bg-navy rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(count / maxCount) * 100}%`,
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-navy-light glow-border rounded-xl p-6">
        <h2 className="font-heading font-bold text-lg mb-6">Recent Leads</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Date
                </th>
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Interest
                </th>
                <th className="pb-3 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead, i) => (
                <tr
                  key={`${lead.email}-${i}`}
                  className="border-b border-white/5 last:border-0"
                >
                  <td className="py-3 pr-4 text-text-muted whitespace-nowrap">
                    {lead.dateSubmitted
                      ? new Date(lead.dateSubmitted).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 pr-4 text-text-primary whitespace-nowrap">
                    {lead.name || "—"}
                  </td>
                  <td className="py-3 pr-4 text-text-muted whitespace-nowrap">
                    {lead.email || "—"}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">
                      {lead.interest || "—"}
                    </span>
                  </td>
                  <td className="py-3 whitespace-nowrap">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        lead.status === "New"
                          ? "bg-accent-lime/10 text-accent-lime"
                          : "bg-white/5 text-text-muted"
                      }`}
                    >
                      {lead.status || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
