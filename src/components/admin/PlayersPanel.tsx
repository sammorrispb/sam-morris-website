"use client";

import { useState, useEffect, useCallback } from "react";

import { formatAmountDollars, formatLessonDateTime } from "@/lib/lessons";
import { PLAYER_LEVELS } from "@/lib/players";
import type { PlayerLevel } from "@/lib/players";

interface Player {
  id: string;
  name: string;
  email: string;
  phone: string;
  level: PlayerLevel | "";
  status: string;
  source: string;
  notes: string;
  hoursPurchased: number;
  hoursUsed: number;
  created: string;
}

interface LessonRow {
  id: string;
  date: string;
  location: string;
  durationMin: number;
  amountCents: number;
  status: string;
  invoiceUrl: string;
}

interface PlayerInvoice {
  id: string;
  number: string;
  created: number;
  amountCents: number;
  status: string;
  hostedUrl: string;
  description: string;
}

interface PlayersData {
  total: number;
  levels: PlayerLevel[];
  players: Player[];
  hasMore: boolean;
  nextCursor: string | null;
}

interface PlayerDetail {
  player: Player;
  lessons: LessonRow[];
  lessonsConfigured: boolean;
  invoices: PlayerInvoice[];
  stripeConfigured: boolean;
}

function levelClasses(level: string) {
  switch (level) {
    case "Beginner":
      return "bg-accent-lime/10 text-accent-lime";
    case "Intermediate":
      return "bg-accent-blue/10 text-accent-blue";
    case "Advanced":
      return "bg-accent-purple/10 text-accent-purple";
    default:
      return "bg-white/5 text-text-muted";
  }
}

function invoiceStatusClasses(status: string) {
  switch (status) {
    case "paid":
      return "bg-accent-lime/10 text-accent-lime";
    case "open":
      return "bg-accent-yellow/10 text-accent-yellow";
    case "void":
    case "uncollectible":
      return "bg-white/5 text-text-muted";
    default:
      return "bg-accent-blue/10 text-accent-blue";
  }
}

export function PlayersPanel({ getToken }: { getToken: () => string }) {
  const [data, setData] = useState<PlayersData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const [page, setPage] = useState(1);
  const [currentCursor, setCurrentCursor] = useState<string | undefined>();
  const [cursors, setCursors] = useState<string[]>([]);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<PlayerDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [notesDraft, setNotesDraft] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState("");
  const [addEmail, setAddEmail] = useState("");
  const [addLevel, setAddLevel] = useState<PlayerLevel | "">("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPlayers = useCallback(
    async (opts?: { cursor?: string }) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (levelFilter) params.set("level", levelFilter);
        if (opts?.cursor) params.set("cursor", opts.cursor);
        const qs = params.toString();
        const res = await fetch(`/api/admin/players${qs ? `?${qs}` : ""}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error ?? "Failed to fetch");
        }
        setData(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load players");
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, levelFilter, getToken]
  );

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  function resetPagination() {
    setPage(1);
    setCurrentCursor(undefined);
    setCursors([]);
  }

  async function handleLevelChange(playerId: string, level: PlayerLevel) {
    setOpenDropdownId(null);
    setUpdatingId(playerId);
    try {
      const res = await fetch("/api/admin/players", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageId: playerId, level }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setData((prev) =>
        prev
          ? { ...prev, players: prev.players.map((p) => (p.id === playerId ? { ...p, level } : p)) }
          : prev
      );
      setDetail((prev) =>
        prev && prev.player.id === playerId
          ? { ...prev, player: { ...prev.player, level } }
          : prev
      );
    } catch {
      setError("Failed to update level");
    } finally {
      setUpdatingId(null);
    }
  }

  async function openDetail(playerId: string) {
    setDetailId(playerId);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/players/${playerId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to load player");
      const d: PlayerDetail = await res.json();
      setDetail(d);
      setNotesDraft(d.player.notes ?? "");
    } catch {
      setError("Failed to load player details");
      setDetailId(null);
    } finally {
      setDetailLoading(false);
    }
  }

  async function handleNotesSave() {
    if (!detail) return;
    setNotesSaving(true);
    try {
      const res = await fetch("/api/admin/players", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageId: detail.player.id, notes: notesDraft }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setDetail({ ...detail, player: { ...detail.player, notes: notesDraft } });
      setData((prev) =>
        prev
          ? {
              ...prev,
              players: prev.players.map((p) =>
                p.id === detail.player.id ? { ...p, notes: notesDraft } : p
              ),
            }
          : prev
      );
    } catch {
      setError("Failed to save notes");
    } finally {
      setNotesSaving(false);
    }
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddError("");
    try {
      const res = await fetch("/api/admin/players", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: addName.trim(),
          email: addEmail.trim(),
          level: addLevel || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Failed to add player");
      setShowAdd(false);
      setAddName("");
      setAddEmail("");
      setAddLevel("");
      resetPagination();
      fetchPlayers();
    } catch (err) {
      setAddError(err instanceof Error ? err.message : "Failed to add player");
    } finally {
      setAddLoading(false);
    }
  }

  const hasFilters = !!(debouncedSearch || levelFilter);

  return (
    <div>
      {/* Search & filter bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPagination();
          }}
          className="min-w-[200px] flex-1 bg-navy border border-white/10 rounded-lg px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-accent-blue focus:outline-none transition-colors"
        />
        <select
          value={levelFilter}
          onChange={(e) => {
            setLevelFilter(e.target.value);
            resetPagination();
          }}
          className="bg-navy border border-white/10 rounded-lg px-3 py-2.5 text-sm text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
        >
          <option value="">All Levels</option>
          {PLAYER_LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2.5 text-sm font-heading font-semibold text-white rounded-lg btn-gradient"
        >
          Add player
        </button>
      </div>

      {error && (
        <p role="alert" className="text-accent-pink text-sm mb-4">
          {error}
        </p>
      )}

      {/* Players table */}
      <div className="bg-navy-light glow-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-lg">
            {hasFilters ? "Filtered Players" : "Players"}
            {data && (
              <span className="ml-2 text-text-muted text-sm font-mono">
                {data.total}
              </span>
            )}
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
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Name
                </th>
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Email
                </th>
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Level
                </th>
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Status
                </th>
                <th className="pb-3 pr-4 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Source
                </th>
                <th className="pb-3 text-text-muted font-mono text-xs uppercase tracking-wider">
                  Since
                </th>
              </tr>
            </thead>
            <tbody>
              {(data?.players ?? []).map((player) => (
                <tr
                  key={player.id}
                  onClick={() => openDetail(player.id)}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="py-3 pr-4 text-text-primary whitespace-nowrap font-medium">
                    {player.name || "—"}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-text-muted">
                    {player.email || "—"}
                  </td>
                  <td
                    className="py-3 pr-4 whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {updatingId === player.id ? (
                      <span className="text-xs text-text-muted font-mono animate-pulse">
                        Saving...
                      </span>
                    ) : (
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === player.id ? null : player.id
                            )
                          }
                          className={`text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer transition-opacity hover:opacity-80 ${levelClasses(player.level)}`}
                        >
                          {player.level || "Set level"}
                        </button>
                        {openDropdownId === player.id && (
                          <div className="absolute z-10 mt-1 bg-navy-light border border-white/10 rounded-lg shadow-xl overflow-hidden">
                            {PLAYER_LEVELS.map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleLevelChange(player.id, opt)}
                                className={`block w-full text-left px-4 py-2 text-xs transition-colors hover:bg-white/5 ${
                                  opt === player.level
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
                  <td className="py-3 pr-4 whitespace-nowrap text-text-muted">
                    {player.status || "—"}
                  </td>
                  <td className="py-3 pr-4 whitespace-nowrap text-text-muted">
                    {player.source || "—"}
                  </td>
                  <td className="py-3 whitespace-nowrap text-text-muted">
                    {player.created
                      ? new Date(player.created).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
              {data && data.players.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted">
                    No players found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
            <span className="text-text-muted text-xs font-mono">
              Page {page}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (page <= 1) return;
                  const prevCursors = [...cursors];
                  const prevCursor = prevCursors.pop();
                  setCursors(prevCursors);
                  setCurrentCursor(prevCursor || undefined);
                  setPage((p) => p - 1);
                  fetchPlayers({ cursor: prevCursor || undefined });
                }}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-mono rounded-lg border border-white/10 text-text-primary transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (!data.hasMore || !data.nextCursor) return;
                  setCursors((prev) => [...prev, currentCursor ?? ""]);
                  setCurrentCursor(data.nextCursor);
                  setPage((p) => p + 1);
                  fetchPlayers({ cursor: data.nextCursor });
                }}
                disabled={!data.hasMore}
                className="px-3 py-1.5 text-xs font-mono rounded-lg border border-white/10 text-text-primary transition-colors hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add player modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60">
          <div className="bg-navy-light glow-border rounded-xl p-8 w-full max-w-md space-y-4">
            <h2 className="font-heading font-bold text-xl text-center">
              Add player
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-text-muted text-xs font-mono uppercase tracking-wider mb-1">
                  Level
                </label>
                <select
                  value={addLevel}
                  onChange={(e) => setAddLevel(e.target.value as PlayerLevel | "")}
                  className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-text-primary focus:border-accent-blue focus:outline-none transition-colors"
                >
                  <option value="">Not set</option>
                  {PLAYER_LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              {addError && (
                <p role="alert" className="text-accent-pink text-sm text-center">
                  {addError}
                </p>
              )}
              <button
                type="submit"
                disabled={addLoading}
                className="w-full text-white font-heading font-semibold py-3 rounded-lg btn-gradient disabled:opacity-50"
              >
                {addLoading ? "Adding..." : "Add player"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdd(false);
                  setAddError("");
                }}
                className="w-full text-text-muted hover:text-text-primary text-sm font-mono transition-colors py-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Player detail drawer */}
      {detailId && (
        <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setDetailId(null)}>
          <div
            className="absolute right-0 top-0 h-full w-full max-w-lg bg-navy-light border-l border-white/10 overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {detailLoading || !detail ? (
              <p className="text-text-muted font-mono animate-pulse">
                Loading player...
              </p>
            ) : (
              <div className="space-y-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-heading font-bold text-2xl">
                      {detail.player.name}
                    </h2>
                    <p className="text-text-muted text-sm mt-1">
                      {detail.player.email}
                      {detail.player.phone && ` · ${detail.player.phone}`}
                    </p>
                  </div>
                  <button
                    onClick={() => setDetailId(null)}
                    className="text-text-muted hover:text-text-primary text-sm font-mono"
                  >
                    Close
                  </button>
                </div>

                {/* Level */}
                <div>
                  <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2">
                    Level
                  </p>
                  <div className="flex gap-2">
                    {PLAYER_LEVELS.map((l) => (
                      <button
                        key={l}
                        onClick={() => handleLevelChange(detail.player.id, l)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full transition-opacity hover:opacity-80 ${
                          detail.player.level === l
                            ? levelClasses(l)
                            : "bg-white/5 text-text-muted"
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2">
                    Notes
                  </p>
                  <textarea
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    rows={4}
                    placeholder="Coaching notes — strengths, focus areas, next session plan..."
                    className="w-full bg-navy border border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted/50 focus:border-accent-blue focus:outline-none transition-colors"
                  />
                  <button
                    onClick={handleNotesSave}
                    disabled={notesSaving || notesDraft === (detail.player.notes ?? "")}
                    className="mt-2 px-4 py-2 text-xs font-heading font-semibold text-white rounded-lg btn-gradient disabled:opacity-40"
                  >
                    {notesSaving ? "Saving..." : "Save notes"}
                  </button>
                </div>

                {/* Lesson history */}
                <div>
                  <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2">
                    Lesson history
                  </p>
                  {!detail.lessonsConfigured ? (
                    <p className="text-text-muted text-sm">
                      Lesson history is not configured yet — set NOTION_LESSONS_DB_ID to start recording lessons.
                    </p>
                  ) : detail.lessons.length === 0 ? (
                    <p className="text-text-muted text-sm">
                      No lessons recorded yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {detail.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="bg-navy rounded-lg p-4 text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-text-primary font-medium">
                              {lesson.date
                                ? formatLessonDateTime(lesson.date)
                                : "Date TBD"}
                            </span>
                            <span className="text-text-muted font-mono">
                              {formatAmountDollars(lesson.amountCents)}
                            </span>
                          </div>
                          <p className="text-text-muted mt-1">
                            {lesson.location || "Location TBD"}
                            {lesson.durationMin > 0 && ` · ${lesson.durationMin} min`}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">
                              {lesson.status || "Confirmed"}
                            </span>
                            {lesson.invoiceUrl && (
                              <a
                                href={lesson.invoiceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent-blue hover:underline"
                              >
                                Invoice
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payments */}
                <div>
                  <p className="text-text-muted text-xs font-mono uppercase tracking-wider mb-2">
                    Payments
                  </p>
                  {!detail.stripeConfigured ? (
                    <p className="text-text-muted text-sm">
                      Stripe is not configured.
                    </p>
                  ) : detail.invoices.length === 0 ? (
                    <p className="text-text-muted text-sm">
                      No Stripe invoices found for {detail.player.email}.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {detail.invoices.map((inv) => (
                        <div
                          key={inv.id}
                          className="bg-navy rounded-lg p-4 text-sm"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-text-primary font-medium">
                              {new Date(inv.created * 1000).toLocaleDateString()}
                              {inv.number && (
                                <span className="text-text-muted font-mono ml-2">
                                  {inv.number}
                                </span>
                              )}
                            </span>
                            <span className="text-text-muted font-mono">
                              {formatAmountDollars(inv.amountCents)}
                            </span>
                          </div>
                          {inv.description && (
                            <p className="text-text-muted mt-1">{inv.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${invoiceStatusClasses(inv.status)}`}
                            >
                              {inv.status}
                            </span>
                            {inv.hostedUrl && (
                              <a
                                href={inv.hostedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-accent-blue hover:underline"
                              >
                                View invoice
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
