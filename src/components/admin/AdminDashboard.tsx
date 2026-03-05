"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Lead {
  id: string;
  name: string;
  email: string;
  interest: string;
  status: string;
  dateSubmitted: string;
  source: string;
  emailSent: boolean;
}

interface LeadsData {
  total: number;
  recentCount: number;
  paidCount: number;
  attentionCount: number;
  interestBreakdown: { interest: string; count: number }[];
  leads: Lead[];
  hasMore: boolean;
  nextCursor: string | null;
}

const STATUS_OPTIONS = ["New", "Contacted", "Converted", "Paid"] as const;
const SOURCE_OPTIONS = ["Website", "Stripe"] as const;

function statusClasses(status: string) {
  switch (status) {
    case "New":
      return "bg-accent-lime/10 text-accent-lime";
    case "Contacted":
      return "bg-accent-blue/10 text-accent-blue";
    case "Converted":
      return "bg-accent-purple/10 text-accent-purple";
    case "Paid":
      return "bg-accent-pink/10 text-accent-pink";
    default:
      return "bg-white/5 text-text-muted";
  }
}

function needsAttention(lead: Lead): string | null {
  if (!lead.dateSubmitted) return null;
  const daysOld = (Date.now() - new Date(lead.dateSubmitted).getTime()) / 86400000;

  if (lead.status === "Paid" && !lead.emailSent) return "Paid — no email sent";
  if (lead.status === "New" && daysOld > 2) return "New — over 2 days";
  if (!lead.emailSent && daysOld > 1) return "No email sent — over 1 day";
  return null;
}

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<LeadsData | null>(null);
  const [loading, setLoading] = useState(false);

  // Search & filter state
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  // Pagination state (cursor stack for backward nav)
  const [page, setPage] = useState(1);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>();
  const [cursors, setCursors] = useState<string[]>([]);

  // Inline status dropdown state
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(
    async (token: string, opts?: { cursor?: string }) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (statusFilter) params.set("status", statusFilter);
        if (interestFilter) params.set("interest", interestFilter);
        if (sourceFilter) params.set("source", sourceFilter);
        if (opts?.cursor) params.set("cursor", opts.cursor);

        const qs = params.toString();
        const res = await fetch(`/api/admin/leads${qs ? `?${qs}` : ""}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch");
        setData(await res.json());
      } catch {
        setError("Failed to load leads");
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, statusFilter, interestFilter, sourceFilter]
  );

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
    setCurrentCursor(undefined);
    setCursors([]);
    const token = sessionStorage.getItem("admin_token");
    if (token && authed) {
      fetchLeads(token);
    }
  }, [debouncedSearch, statusFilter, interestFilter, sourceFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Initial load from stored token
  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored) {
      setAuthed(true);
      fetchLeads(stored);
    }
  }, [fetchLeads]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!openDropdownId) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [openDropdownId]);

  async function handleStatusChange(leadId: string, newStatus: string) {
    setOpenDropdownId(null);
    setUpdatingLeadId(leadId);
    const token = sessionStorage.getItem("admin_token") ?? "";

    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageId: leadId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Optimistic local update
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          leads: prev.leads.map((l) =>
            l.id === leadId ? { ...l, status: newStatus } : l
          ),
        };
      });
    } catch {
      setError("Failed to update status");
      // Refetch to restore correct state
      fetchLeads(token, { cursor: currentCursor });
    } finally {
      setUpdatingLeadId(null);
    }
  }

  function handleNextPage() {
    if (!data?.hasMore || !data.nextCursor) return;
    const token = sessionStorage.getItem("admin_token") ?? "";
    setCursors((prev) => [...prev, currentCursor ?? ""]);
    setCurrentCursor(data.nextCursor);
    setPage((p) => p + 1);
    fetchLeads(token, { cursor: data.nextCursor });
  }

  function handlePrevPage() {
    if (page <= 1) return;
    const token = sessionStorage.getItem("admin_token") ?? "";
    const prevCursors = [...cursors];
    const prevCursor = prevCursors.pop();
    setCursors(prevCursors);
    setCurrentCursor(prevCursor || undefined);
    setPage((p) => p - 1);
    fetchLeads(token, { cursor: prevCursor || undefined });
  }

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

  if (loading && !data) {
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
  const hasFilters = !!(debouncedSearch || statusFilter || interestFilter || sourceFilter);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <h1 className="font-heading font-bold text-3xl">Lead Dashboard</h1>
          {data.attentionCount > 0 && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-accent-pink/10 text-accent-pink">
              {data.attentionCount} need attention
            </span>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="text-text-muted hover:text-text-primary text-sm font-mono transition-colors"
        >
          Log Out
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
        <div className="bg-navy-light glow-border rounded-xl p-6">
          <p className="text-text-muted text-xs uppercase tracking-wider font-mono mb-1">
            Paid Leads
          </p>
          <p className="font-heading font-bold text-3xl text-accent-pink">
            {data.paidCount}
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

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-accent-blue focus:outline-none transition-colors"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-navy border border-white/10 rounded-lg px-3 py-2.5 text-sm text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={interestFilter}
          onChange={(e) => setInterestFilter(e.target.value)}
          className="bg-navy border border-white/10 rounded-lg px-3 py-2.5 text-sm text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
        >
          <option value="">All Interests</option>
          {data.interestBreakdown.map(({ interest }) => (
            <option key={interest} value={interest}>
              {interest}
            </option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-navy border border-white/10 rounded-lg px-3 py-2.5 text-sm text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
        >
          <option value="">All Sources</option>
          {SOURCE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Leads Table */}
      <div className="bg-navy-light glow-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg">
            {hasFilters ? "Filtered Leads" : "Recent Leads"}
          </h2>
          {loading && (
            <span className="text-text-muted text-xs font-mono animate-pulse">
              Loading...
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="pb-3 pr-2 w-6" />
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
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Source
                </th>
                <th className="pb-3 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Sent
                </th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead) => {
                const attention = needsAttention(lead);
                return (
                  <tr
                    key={lead.id}
                    className={`border-b border-white/5 last:border-0 ${
                      attention ? "border-l-2 border-l-accent-pink" : ""
                    }`}
                  >
                    {/* Attention dot */}
                    <td className="py-3 pr-2">
                      {attention && (
                        <span
                          title={attention}
                          className="inline-block w-2 h-2 rounded-full bg-accent-pink animate-pulse"
                        />
                      )}
                    </td>
                    <td className="py-3 pr-4 text-text-muted whitespace-nowrap">
                      {lead.dateSubmitted
                        ? new Date(lead.dateSubmitted).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 text-text-primary whitespace-nowrap">
                      {lead.name || "—"}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {lead.email ? (
                        <a
                          href={`mailto:${lead.email}?subject=Following up — ${lead.interest || "your inquiry"}`}
                          className="text-accent-blue hover:underline"
                        >
                          {lead.email}
                        </a>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">
                        {lead.interest || "—"}
                      </span>
                    </td>
                    {/* Inline status dropdown */}
                    <td className="py-3 pr-4 whitespace-nowrap relative">
                      {updatingLeadId === lead.id ? (
                        <span className="text-xs text-text-muted font-mono animate-pulse">
                          Saving...
                        </span>
                      ) : (
                        <div ref={openDropdownId === lead.id ? dropdownRef : undefined}>
                          <button
                            onClick={() =>
                              setOpenDropdownId(
                                openDropdownId === lead.id ? null : lead.id
                              )
                            }
                            className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${statusClasses(lead.status)}`}
                          >
                            {lead.status || "—"}
                          </button>
                          {openDropdownId === lead.id && (
                            <div className="absolute z-10 mt-1 bg-navy-light border border-white/10 rounded-lg shadow-xl overflow-hidden">
                              {STATUS_OPTIONS.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => handleStatusChange(lead.id, opt)}
                                  className={`block w-full text-left px-4 py-2 text-xs transition-colors hover:bg-white/5 ${
                                    opt === lead.status
                                      ? "text-accent-blue font-semibold"
                                      : "text-text-primary"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          lead.source === "Stripe"
                            ? "bg-accent-lime/10 text-accent-lime"
                            : "bg-accent-blue/10 text-accent-blue"
                        }`}
                      >
                        {lead.source || "Website"}
                      </span>
                    </td>
                    <td className="py-3 whitespace-nowrap text-center">
                      {lead.emailSent ? (
                        <span className="text-accent-lime" title="Email sent">
                          &#10003;
                        </span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {data.leads.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-text-muted">
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          <span className="text-text-muted text-xs font-mono">
            Page {page}
            {!hasFilters && data.total > 0 && (
              <> of ~{Math.ceil(data.total / 25)}</>
            )}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs font-mono rounded-lg border border-white/10 text-text-primary transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={!data.hasMore}
              className="px-3 py-1.5 text-xs font-mono rounded-lg border border-white/10 text-text-primary transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Error toast */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-accent-pink/10 border border-accent-pink/30 text-accent-pink text-sm px-4 py-3 rounded-lg shadow-xl">
          {error}
          <button
            onClick={() => setError("")}
            className="ml-3 text-accent-pink/60 hover:text-accent-pink"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
