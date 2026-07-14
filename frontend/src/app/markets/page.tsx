"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { useWallet } from "@/context/WalletContext";

// Design tokens (aligned with landing page)
const BG = "#07080f";
const SURFACE = "#0f1220";
const SURFACE_HIGH = "#141a2e";
const BORDER = "#1f2540";
const TEXT = "#e8eaf2";
const TEXT_MUTED = "#8b90a8";
const TEXT_DIM = "#5c6178";
const ACCENT = "#4FD1C5";
const ACCENT_SOFT = "rgba(79, 209, 197, 0.12)";
const YES = "#4FD1C5";
const NO = "#ff6b6b";
const AMBER = "#f5b83d";

type MarketStatus = "active" | "resolved" | "upcoming";
type Market = {
  id: string;
  title: string;
  category: string;
  probability: number; // 0..1
  totalStaked: number; // in XLM
  closeAt: string; // ISO date
  status: MarketStatus;
};

const PAGE_SIZE = 9;

const MOCK: Market[] = [
  { id: "1", title: "Will BTC close above $70,000 on Dec 31?", category: "Crypto", probability: 0.62, totalStaked: 48200, closeAt: iso(6.5), status: "active" },
  { id: "2", title: "Real Madrid to win La Liga this season", category: "Sports", probability: 0.74, totalStaked: 22700, closeAt: iso(42.1), status: "active" },
  { id: "3", title: "US Fed to cut rates in the next FOMC", category: "Politics", probability: 0.41, totalStaked: 31400, closeAt: iso(18.8), status: "active" },
  { id: "4", title: "XLM to trade above $0.20 in Q1", category: "Crypto", probability: 0.55, totalStaked: 17900, closeAt: iso(27.2), status: "active" },
  { id: "5", title: "Manchester City to reach the Champions League final", category: "Sports", probability: 0.33, totalStaked: 14100, closeAt: iso(63.5), status: "active" },
  { id: "6", title: "Oppenheimer to win Best Picture", category: "Culture", probability: 0.81, totalStaked: 9300, closeAt: iso(8.2), status: "active" },
  { id: "7", title: "Will inflation drop below 3% this year?", category: "Economics", probability: 0.28, totalStaked: 18000, closeAt: iso(60.0), status: "upcoming" },
  { id: "8", title: "Novak Djokovic to win Wimbledon", category: "Sports", probability: 0.48, totalStaked: 26400, closeAt: iso(35.6), status: "active" },
  { id: "9", title: "ETH to break $5,000 by end of quarter", category: "Crypto", probability: 0.36, totalStaked: 21800, closeAt: iso(19.1), status: "active" },
  { id: "10", title: "New Stellar validator activation this month", category: "Crypto", probability: 0.72, totalStaked: 7600, closeAt: iso(11.9), status: "active" },
  { id: "11", title: "Argentina to reach Copa America final", category: "Sports", probability: 0.58, totalStaked: 13800, closeAt: iso(48.3), status: "upcoming" },
  { id: "12", title: "SpaceX Starship to reach orbit successfully", category: "Science", probability: 0.67, totalStaked: 15200, closeAt: iso(22.5), status: "active" },
];

function iso(daysFromNow: number) {
  return new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000).toISOString();
}

const CATEGORY_META: Record<string, { color: string }> = {
  All: { color: ACCENT },
  Crypto: { color: "#f5b83d" },
  Sports: { color: "#6ee7b7" },
  Politics: { color: "#c084fc" },
  Culture: { color: "#f472b6" },
  Economics: { color: "#60a5fa" },
  Science: { color: "#4FD1C5" },
};

const STATUSES: Array<"All" | "Active" | "Resolved" | "Upcoming"> = [
  "All",
  "Active",
  "Upcoming",
  "Resolved",
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most staked" },
  { value: "closing", label: "Closing soon" },
  { value: "newest", label: "Newest" },
];

export default function MarketsPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [status, setStatus] = useState<"All" | "Active" | "Resolved" | "Upcoming">("All");
  const [sort, setSort] = useState("popular");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${base}/api/v1/markets`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (mounted && Array.isArray(data) && data.length > 0) {
          setMarkets(data);
        } else if (mounted) {
          setMarkets(MOCK);
        }
      } catch {
        if (mounted) setMarkets(MOCK);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(markets.map((m) => m.category));
    return ["All", ...Array.from(set)];
  }, [markets]);

  const filtered = useMemo(() => {
    let list = markets.slice();
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(s));
    }
    if (category !== "All") list = list.filter((m) => m.category === category);
    if (status !== "All") list = list.filter((m) => m.status === status.toLowerCase());

    if (sort === "newest") list.sort((a, b) => +new Date(b.closeAt) - +new Date(a.closeAt));
    if (sort === "popular") list.sort((a, b) => b.totalStaked - a.totalStaked);
    if (sort === "closing") list.sort((a, b) => +new Date(a.closeAt) - +new Date(b.closeAt));

    return list;
  }, [markets, search, category, status, sort]);

  const paged = filtered.slice(0, page * PAGE_SIZE);

  const { isAuthenticated, openConnectModal } = useWallet();

  const totalVolume = useMemo(
    () => markets.reduce((sum, m) => sum + m.totalStaked, 0),
    [markets],
  );
  const activeCount = markets.filter((m) => m.status === "active").length;

  function handlePredict(market: Market) {
    if (!isAuthenticated) {
      openConnectModal();
      return;
    }
    window.location.href = `/markets/${market.id}`;
  }

  return (
    <div className="min-h-screen" style={{ background: BG, color: TEXT }}>
      <Header />

      <main className="pt-10 pb-24">
        {/* Page header */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-end lg:justify-between" style={{ borderColor: BORDER }}>
            <div>
              <div className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
                Flagship product
              </div>
              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: TEXT }}>
                Prediction markets
              </h1>
              <p className="mt-3 max-w-xl text-sm sm:text-base" style={{ color: TEXT_MUTED }}>
                Back the outcomes you believe in. Every stake is held by a Soroban
                contract and settled by two independent oracles — no operator override.
              </p>
            </div>

            {/* volume/activity strip */}
            <div className="flex gap-3">
              <StatChip label="Live" value={activeCount.toString()} />
              <StatChip label="Volume" value={compact(totalVolume) + " XLM"} mono />
              <StatChip label="Network" value="Testnet" accent />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mx-auto mt-8 max-w-6xl px-6">
          <div className="flex flex-col gap-4">
            {/* Search + sort row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <svg
                  aria-hidden
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                  style={{ color: TEXT_DIM }}
                >
                  <circle cx="9" cy="9" r="6" strokeWidth={1.5} />
                  <path d="M14 14l3 3" strokeWidth={1.5} strokeLinecap="round" />
                </svg>
                <input
                  aria-label="Search markets"
                  placeholder="Search markets by keyword…"
                  className="w-full rounded-lg border px-10 py-2.5 text-sm outline-none transition-colors placeholder:opacity-60 focus:border-[color:var(--accent)]"
                  style={{
                    background: SURFACE,
                    borderColor: BORDER,
                    color: TEXT,
                    ["--accent" as any]: ACCENT,
                  }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                aria-label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value} className="text-black">
                    {o.label}
                  </option>
                ))}
              </select>

              <select
                aria-label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="rounded-lg border px-3 py-2.5 text-sm outline-none"
                style={{ background: SURFACE, borderColor: BORDER, color: TEXT }}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="text-black">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => {
                const active = category === c;
                const meta = CATEGORY_META[c] ?? { color: ACCENT };
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className="rounded-full border px-3 py-1.5 text-xs font-medium transition-all"
                    style={{
                      borderColor: active ? meta.color : BORDER,
                      color: active ? "#0a0a10" : TEXT_MUTED,
                      background: active ? meta.color : SURFACE,
                    }}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs" style={{ color: TEXT_DIM }}>
              <span>
                Showing <span style={{ color: TEXT }}>{paged.length}</span> of{" "}
                <span style={{ color: TEXT }}>{filtered.length}</span> markets
              </span>
              {(search || category !== "All" || status !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                    setStatus("All");
                  }}
                  className="font-semibold"
                  style={{ color: ACCENT }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Market grid */}
        <section className="mx-auto mt-8 max-w-6xl px-6">
          {loading && <SkeletonGrid />}

          {!loading && paged.length === 0 && (
            <div
              className="rounded-xl border p-16 text-center"
              style={{ background: SURFACE, borderColor: BORDER }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full" style={{ background: ACCENT_SOFT, color: ACCENT }}>
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold" style={{ color: TEXT }}>
                No markets match those filters
              </h3>
              <p className="mt-2 text-sm" style={{ color: TEXT_MUTED }}>
                Try clearing the search or picking a different category.
              </p>
            </div>
          )}

          {!loading && paged.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paged.map((m) => (
                <MarketCard key={m.id} market={m} onPredict={() => handlePredict(m)} />
              ))}
            </div>
          )}

          {paged.length < filtered.length && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border px-6 py-2.5 text-sm font-semibold transition-colors"
                style={{ borderColor: BORDER, color: TEXT, background: SURFACE }}
              >
                Load more markets
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function StatChip({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div
      className="min-w-[110px] rounded-lg border px-4 py-2"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      <div className="text-[10px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>
        {label}
      </div>
      <div
        className={`mt-1 text-lg font-bold ${mono ? "font-mono" : ""}`}
        style={{ color: accent ? ACCENT : TEXT }}
      >
        {value}
      </div>
    </div>
  );
}

function MarketCard({ market, onPredict }: { market: Market; onPredict: () => void }) {
  const yesPct = Math.round(market.probability * 100);
  const noPct = 100 - yesPct;
  const meta = CATEGORY_META[market.category] ?? { color: ACCENT };

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl border transition-all hover:-translate-y-0.5"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      <div className="flex items-center justify-between px-5 pt-5">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider"
          style={{ borderColor: `${meta.color}44`, color: meta.color, background: `${meta.color}11` }}
        >
          {market.category}
        </span>
        <StatusBadge status={market.status} />
      </div>

      <Link href={`/markets/${market.id}`} className="px-5 pt-4">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-base font-semibold leading-snug transition-colors group-hover:text-white" style={{ color: TEXT }}>
          {market.title}
        </h3>
      </Link>

      {/* YES / NO probability */}
      <div className="px-5 pt-5">
        <div className="mb-2 flex items-center justify-between font-mono text-xs">
          <span style={{ color: YES }}>YES · {yesPct}¢</span>
          <span style={{ color: NO }}>NO · {noPct}¢</span>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded-full" style={{ background: `${NO}22` }}>
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${yesPct}%`, background: YES }}
          />
        </div>
      </div>

      {/* meta row */}
      <div
        className="mt-5 flex items-center justify-between border-t px-5 py-4 font-mono text-xs"
        style={{ borderColor: BORDER, color: TEXT_DIM }}
      >
        <span>Vol {compact(market.totalStaked)} XLM</span>
        <span>{timeUntil(market.closeAt)}</span>
      </div>

      {/* action */}
      <div className="grid grid-cols-2 gap-px" style={{ background: BORDER }}>
        <button
          onClick={onPredict}
          className="py-3 text-sm font-semibold transition-colors"
          style={{ background: SURFACE, color: YES }}
        >
          Back YES
        </button>
        <button
          onClick={onPredict}
          className="py-3 text-sm font-semibold transition-colors"
          style={{ background: SURFACE, color: NO }}
        >
          Back NO
        </button>
      </div>
    </article>
  );
}

function StatusBadge({ status }: { status: MarketStatus }) {
  const map: Record<MarketStatus, { color: string; bg: string; label: string }> = {
    active: { color: ACCENT, bg: ACCENT_SOFT, label: "Live" },
    upcoming: { color: AMBER, bg: "rgba(245, 184, 61, 0.12)", label: "Upcoming" },
    resolved: { color: TEXT_DIM, bg: "rgba(255,255,255,0.05)", label: "Resolved" },
  };
  const s = map[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider"
      style={{ background: s.bg, color: s.color }}
    >
      <span aria-hidden style={{ width: 5, height: 5, background: s.color, borderRadius: 999 }} />
      {s.label}
    </span>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-56 animate-pulse rounded-xl border"
          style={{ background: SURFACE, borderColor: BORDER }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toFixed(0);
}

function timeUntil(iso: string): string {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "Closed";
  const minutes = Math.floor(ms / 60_000);
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  if (days > 0) return `Closes in ${days}d ${hours}h`;
  if (hours > 0) return `Closes in ${hours}h ${minutes % 60}m`;
  return `Closes in ${minutes}m`;
}
