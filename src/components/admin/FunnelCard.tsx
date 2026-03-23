"use client";

import { useState, useEffect, useCallback } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface FunnelStep {
  count: number;
  rate: string;
}

interface FunnelReport {
  period: string;
  overall: {
    leads: number;
    hubSignups: FunnelStep;
    profileComplete: FunnelStep;
    rsvpd: FunnelStep;
    attended: FunnelStep;
  };
  byInterest: Record<
    string,
    { leads: number; hubSignups: number; attended: number }
  >;
  recentLeads: Array<{
    name: string;
    email: string;
    interest: string;
    date: string;
    stage: "lead" | "signed_up" | "profile_complete" | "rsvpd" | "attended";
    eventsAttended: number;
  }>;
}

type Stage = "lead" | "signed_up" | "profile_complete" | "rsvpd" | "attended";

/* ------------------------------------------------------------------ */
/*  Stage styling                                                     */
/* ------------------------------------------------------------------ */

const STAGE_CONFIG: Record<Stage, { label: string; classes: string }> = {
  lead: { label: "Lead", classes: "bg-white/10 text-text-muted" },
  signed_up: { label: "Signed Up", classes: "bg-accent-blue/10 text-accent-blue" },
  profile_complete: { label: "Profile Done", classes: "bg-yellow-500/10 text-yellow-400" },
  rsvpd: { label: "RSVP'd", classes: "bg-orange-500/10 text-orange-400" },
  attended: { label: "Attended", classes: "bg-accent-lime/10 text-accent-lime" },
};

/* ------------------------------------------------------------------ */
/*  Funnel bar row                                                    */
/* ------------------------------------------------------------------ */

function FunnelBar({
  label,
  count,
  rate,
  widthPct,
  gradient,
}: {
  label: string;
  count: number;
  rate: string;
  widthPct: number;
  gradient: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-text-primary">
          {label}{" "}
          <span className="text-text-muted font-mono">({count})</span>
        </span>
        <span className="text-text-muted font-mono">{rate}</span>
      </div>
      <div className="h-4 bg-navy rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${widthPct}%`, background: gradient }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export function FunnelCard() {
  const [report, setReport] = useState<FunnelReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [days, setDays] = useState(90);

  const fetchFunnel = useCallback(async (daysParam: number) => {
    const token = sessionStorage.getItem("admin_token");
    if (!token) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/funnel?days=${daysParam}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch funnel data");
      setReport(await res.json());
    } catch {
      setError("Failed to load funnel report");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFunnel(days);
  }, [days, fetchFunnel]);

  if (loading && !report) {
    return (
      <div className="bg-navy-light glow-border rounded-xl p-6 mb-10">
        <h2 className="font-heading font-bold text-lg mb-4">
          Lead-to-Player Funnel
        </h2>
        <p className="text-text-muted font-mono text-sm animate-pulse">
          Loading funnel data...
        </p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="bg-navy-light glow-border rounded-xl p-6 mb-10">
        <h2 className="font-heading font-bold text-lg mb-4">
          Lead-to-Player Funnel
        </h2>
        <p className="text-accent-pink text-sm">{error}</p>
        <button
          onClick={() => fetchFunnel(days)}
          className="mt-2 text-accent-blue text-sm hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!report) return null;

  const { overall, byInterest, recentLeads } = report;
  const maxCount = overall.leads || 1;

  const funnelSteps = [
    {
      label: "Leads",
      count: overall.leads,
      rate: "100%",
      widthPct: 100,
      gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    },
    {
      label: "Hub Signups",
      count: overall.hubSignups.count,
      rate: overall.hubSignups.rate,
      widthPct: (overall.hubSignups.count / maxCount) * 100,
      gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    },
    {
      label: "Profile Done",
      count: overall.profileComplete.count,
      rate: overall.profileComplete.rate,
      widthPct: (overall.profileComplete.count / maxCount) * 100,
      gradient: "linear-gradient(135deg, #eab308, #f59e0b)",
    },
    {
      label: "RSVP'd",
      count: overall.rsvpd.count,
      rate: overall.rsvpd.rate,
      widthPct: (overall.rsvpd.count / maxCount) * 100,
      gradient: "linear-gradient(135deg, #f97316, #ef4444)",
    },
    {
      label: "Attended",
      count: overall.attended.count,
      rate: overall.attended.rate,
      widthPct: (overall.attended.count / maxCount) * 100,
      gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    },
  ];

  const interestEntries = Object.entries(byInterest).sort(
    (a, b) => b[1].leads - a[1].leads
  );

  return (
    <>
      {/* Funnel Visualization */}
      <div className="bg-navy-light glow-border rounded-xl p-6 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading font-bold text-lg">
              Lead-to-Player Funnel
            </h2>
            <p className="text-text-muted text-xs font-mono mt-1">
              {report.period}
              {loading && " — refreshing..."}
            </p>
          </div>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-navy border border-white/10 rounded-lg px-3 py-1.5 text-sm text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>1 year</option>
          </select>
        </div>

        <div className="space-y-3">
          {funnelSteps.map((step) => (
            <FunnelBar key={step.label} {...step} />
          ))}
        </div>

        {/* Conversion highlight */}
        {overall.leads > 0 && (
          <div className="mt-6 pt-4 border-t border-white/5 flex gap-6 text-center">
            <div>
              <p className="text-text-muted text-xs font-mono uppercase tracking-wider">
                Lead &rarr; Signup
              </p>
              <p className="font-heading font-bold text-xl text-accent-blue">
                {overall.hubSignups.rate}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs font-mono uppercase tracking-wider">
                Lead &rarr; Attended
              </p>
              <p className="font-heading font-bold text-xl text-accent-lime">
                {overall.attended.rate}
              </p>
            </div>
            {overall.hubSignups.count > 0 && (
              <div>
                <p className="text-text-muted text-xs font-mono uppercase tracking-wider">
                  Signup &rarr; Attended
                </p>
                <p className="font-heading font-bold text-xl text-orange-400">
                  {overall.attended.count > 0
                    ? `${((overall.attended.count / overall.hubSignups.count) * 100).toFixed(1)}%`
                    : "0%"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interest Breakdown Table */}
      {interestEntries.length > 0 && (
        <div className="bg-navy-light glow-border rounded-xl p-6 mb-10">
          <h2 className="font-heading font-bold text-lg mb-4">
            Funnel by Interest
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                    Interest
                  </th>
                  <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider text-right">
                    Leads
                  </th>
                  <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider text-right">
                    Hub Signups
                  </th>
                  <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider text-right">
                    Attended
                  </th>
                  <th className="pb-3 text-text-muted font-mono text-xs uppercase tracking-wider text-right">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody>
                {interestEntries.map(([interest, data]) => (
                  <tr
                    key={interest}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="py-3 pr-4 text-text-primary">
                      {interest}
                    </td>
                    <td className="py-3 pr-4 text-text-muted font-mono text-right">
                      {data.leads}
                    </td>
                    <td className="py-3 pr-4 text-accent-blue font-mono text-right">
                      {data.hubSignups}
                    </td>
                    <td className="py-3 pr-4 text-accent-lime font-mono text-right">
                      {data.attended}
                    </td>
                    <td className="py-3 text-text-muted font-mono text-right">
                      {data.leads > 0
                        ? `${((data.attended / data.leads) * 100).toFixed(0)}%`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Leads with Stage */}
      {recentLeads.length > 0 && (
        <div className="bg-navy-light glow-border rounded-xl p-6 mb-10">
          <h2 className="font-heading font-bold text-lg mb-4">
            Lead Journey Status
          </h2>
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
                    Interest
                  </th>
                  <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="pb-3 text-text-muted font-mono text-xs uppercase tracking-wider text-right">
                    Events
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.slice(0, 25).map((lead) => {
                  const cfg = STAGE_CONFIG[lead.stage];
                  return (
                    <tr
                      key={lead.email}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="py-3 pr-4 text-text-muted whitespace-nowrap">
                        {lead.date
                          ? new Date(lead.date).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 pr-4 text-text-primary whitespace-nowrap">
                        {lead.name || "—"}
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">
                          {lead.interest || "—"}
                        </span>
                      </td>
                      <td className="py-3 pr-4 whitespace-nowrap">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.classes}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3 text-text-muted font-mono text-right">
                        {lead.eventsAttended}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {recentLeads.length > 25 && (
            <p className="text-text-muted text-xs font-mono mt-4 pt-3 border-t border-white/5">
              Showing 25 of {recentLeads.length} leads
            </p>
          )}
        </div>
      )}
    </>
  );
}
