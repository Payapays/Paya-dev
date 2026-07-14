"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import { useWallet } from "@/context/WalletContext";

// Design tokens
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

type Outcome = "YES" | "NO";

const MOCK_MARKET = {
  id: "1",
  title: "Will BTC close above $70,000 on Dec 31?",
  category: "Crypto",
  description:
    "This market resolves YES if the closing price of BTC/USD on December 31 (23:59 UTC), as reported by both CoinGecko and CoinMarketCap, is strictly greater than $70,000.00. Both oracles must agree on the outcome for settlement to trigger.",
  yesPrice: 0.62,
  noPrice: 0.38,
  totalStaked: 48200, // XLM
  yesStaked: 29800,
  noStaked: 18400,
  participants: 342,
  closeAt: new Date(Date.now() + 6.5 * 24 * 60 * 60 * 1000).toISOString(),
  resolvesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  contractAddress: "CBQHNAX...ZY4F",
  oracles: [
    { name: "CoinGecko", type: "Price feed", status: "reporting", weight: "50%" },
    { name: "CoinMarketCap", type: "Price feed", status: "reporting", weight: "50%" },
  ],
  recentActivity: [
    { user: "GABC…Q7XY", side: "YES" as Outcome, amount: 250, time: "2 min ago" },
    { user: "GXYZ…M2K1", side: "NO" as Outcome, amount: 100, time: "8 min ago" },
    { user: "GH2K…AB33", side: "YES" as Outcome, amount: 500, time: "17 min ago" },
    { user: "GRQZ…PLM4", side: "YES" as Outcome, amount: 75, time: "23 min ago" },
    { user: "G8YU…JN2X", side: "NO" as Outcome, amount: 1200, time: "45 min ago" },
    { user: "GJKL…FR9A", side: "YES" as Outcome, amount: 300, time: "1 hr ago" },
  ],
};

export default function MarketDetailPage() {
  const params = useParams<{ id: string }>();
  const marketId = params?.id ?? "1";
  const market = { ...MOCK_MARKET, id: marketId };

  const [selected, setSelected] = useState<Outcome>("YES");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("XLM");
  const { isAuthenticated, openConnectModal } = useWallet();

  const numAmount = Number(amount) || 0;
  const price = selected === "YES" ? market.yesPrice : market.noPrice;
  const shares = price > 0 ? numAmount / price : 0;
  const potential = shares; // payout at $1 per share if outcome resolves in your favor
  const roi = numAmount > 0 ? ((potential - numAmount) / numAmount) * 100 : 0;

  function handleStake() {
    if (!isAuthenticated) {
      openConnectModal();
      return;
    }
    // TODO: wire to Soroban contract call
    alert(`Staking ${amount} ${asset} on ${selected}`);
  }

  return (
    <div className="min-h-screen" style={{ background: BG, color: TEXT }}>
      <Header />

      <main className="pt-10 pb-24">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-6xl px-6">
          <nav className="mb-6 flex items-center gap-2 text-xs" style={{ color: TEXT_DIM }}>
            <Link href="/markets" className="hover:opacity-80" style={{ color: TEXT_MUTED }}>
              Markets
            </Link>
            <span>›</span>
            <span style={{ color: TEXT }}>{market.category}</span>
          </nav>
        </div>

        {/* Header block */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ borderColor: `${AMBER}44`, color: AMBER, background: `${AMBER}11` }}
            >
              {market.category}
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider"
              style={{ background: ACCENT_SOFT, color: ACCENT }}
            >
              <span aria-hidden style={{ width: 5, height: 5, background: ACCENT, borderRadius: 999 }} />
              Live
            </span>
            <span className="text-xs" style={{ color: TEXT_DIM }}>
              · Contract {market.contractAddress}
            </span>
          </div>

          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl" style={{ color: TEXT }}>
            {market.title}
          </h1>

          {/* Meta row */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <MetaStat label="Total staked" value={`${compact(market.totalStaked)} XLM`} mono />
            <MetaStat label="Participants" value={market.participants.toString()} mono />
            <MetaStat label="Closes in" value={timeUntil(market.closeAt)} />
            <MetaStat label="Resolution" value="2-source oracle" accent />
          </div>
        </section>

        {/* Main content */}
        <section className="mx-auto mt-10 max-w-6xl px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* Left: about + activity */}
            <div className="space-y-6">
              {/* Odds chart placeholder */}
              <Card>
                <CardHeader
                  eyebrow="Market Probability"
                  title={`YES ${Math.round(market.yesPrice * 100)}¢ · NO ${Math.round(market.noPrice * 100)}¢`}
                />
                <OddsBar yes={market.yesPrice} no={market.noPrice} />
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <SideStat label="Staked on YES" value={`${compact(market.yesStaked)} XLM`} color={YES} />
                  <SideStat label="Staked on NO" value={`${compact(market.noStaked)} XLM`} color={NO} />
                </div>
                <PricePlaceholder />
              </Card>

              {/* Resolution details */}
              <Card>
                <CardHeader eyebrow="Resolution" title="How this market settles" />
                <p className="text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>
                  {market.description}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="text-[10px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>
                    Oracle sources
                  </div>
                  {market.oracles.map((o) => (
                    <div
                      key={o.name}
                      className="flex items-center justify-between rounded-lg border p-3"
                      style={{ background: SURFACE_HIGH, borderColor: BORDER }}
                    >
                      <div>
                        <div className="text-sm font-semibold" style={{ color: TEXT }}>
                          {o.name}
                        </div>
                        <div className="text-xs" style={{ color: TEXT_DIM }}>
                          {o.type} · weight {o.weight}
                        </div>
                      </div>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider"
                        style={{ background: ACCENT_SOFT, color: ACCENT }}
                      >
                        <span aria-hidden style={{ width: 5, height: 5, background: ACCENT, borderRadius: 999 }} />
                        {o.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 border-t pt-4 text-xs" style={{ borderColor: BORDER, color: TEXT_DIM }}>
                  <div>
                    <div className="uppercase tracking-widest">Trading closes</div>
                    <div className="mt-1 font-mono" style={{ color: TEXT }}>
                      {fmtDate(market.closeAt)}
                    </div>
                  </div>
                  <div>
                    <div className="uppercase tracking-widest">Resolves</div>
                    <div className="mt-1 font-mono" style={{ color: TEXT }}>
                      {fmtDate(market.resolvesAt)}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Activity feed */}
              <Card>
                <CardHeader eyebrow="Live activity" title="Recent stakes" />
                <div className="overflow-hidden rounded-lg border" style={{ borderColor: BORDER }}>
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>
                        <th className="border-b px-4 py-2 font-medium" style={{ borderColor: BORDER }}>User</th>
                        <th className="border-b px-4 py-2 font-medium" style={{ borderColor: BORDER }}>Side</th>
                        <th className="border-b px-4 py-2 font-medium text-right" style={{ borderColor: BORDER }}>Amount</th>
                        <th className="border-b px-4 py-2 font-medium text-right" style={{ borderColor: BORDER }}>When</th>
                      </tr>
                    </thead>
                    <tbody>
                      {market.recentActivity.map((row, i) => (
                        <tr key={i}>
                          <td className="px-4 py-3 font-mono text-xs" style={{ color: TEXT_MUTED }}>{row.user}</td>
                          <td className="px-4 py-3">
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                              style={{
                                background: row.side === "YES" ? ACCENT_SOFT : "rgba(255, 107, 107, 0.12)",
                                color: row.side === "YES" ? YES : NO,
                              }}
                            >
                              {row.side}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-sm" style={{ color: TEXT }}>{row.amount} XLM</td>
                          <td className="px-4 py-3 text-right text-xs" style={{ color: TEXT_DIM }}>{row.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right: stake panel */}
            <aside className="lg:sticky lg:top-6 lg:self-start">
              <div
                className="rounded-xl border p-5"
                style={{ background: SURFACE, borderColor: BORDER }}
              >
                <div className="text-xs uppercase tracking-widest" style={{ color: TEXT_DIM }}>
                  Place a stake
                </div>

                {/* YES/NO toggle */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <SideButton
                    label="YES"
                    price={market.yesPrice}
                    color={YES}
                    active={selected === "YES"}
                    onClick={() => setSelected("YES")}
                  />
                  <SideButton
                    label="NO"
                    price={market.noPrice}
                    color={NO}
                    active={selected === "NO"}
                    onClick={() => setSelected("NO")}
                  />
                </div>

                {/* Amount input */}
                <div className="mt-5">
                  <label className="text-[10px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>
                    Amount
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="flex flex-1 items-center rounded-lg border px-3"
                      style={{ background: SURFACE_HIGH, borderColor: BORDER }}
                    >
                      <input
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
                        className="w-full bg-transparent py-2.5 font-mono text-lg outline-none"
                        style={{ color: TEXT }}
                      />
                    </div>
                    <select
                      value={asset}
                      onChange={(e) => setAsset(e.target.value)}
                      className="rounded-lg border px-3 py-2.5 text-sm font-semibold outline-none"
                      style={{ background: SURFACE_HIGH, borderColor: BORDER, color: TEXT }}
                    >
                      <option className="text-black">XLM</option>
                      <option className="text-black">USDC</option>
                      <option className="text-black">EURC</option>
                    </select>
                  </div>

                  {/* Quick amounts */}
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[10, 50, 100, 500].map((q) => (
                      <button
                        key={q}
                        onClick={() => setAmount(q.toString())}
                        className="rounded-lg border py-1.5 text-xs font-semibold transition-colors"
                        style={{ borderColor: BORDER, color: TEXT_MUTED, background: SURFACE_HIGH }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div
                  className="mt-5 rounded-lg border p-3"
                  style={{ background: SURFACE_HIGH, borderColor: BORDER }}
                >
                  <PreviewRow label="Shares" value={shares > 0 ? shares.toFixed(2) : "—"} mono />
                  <PreviewRow
                    label="Potential payout"
                    value={potential > 0 ? `${potential.toFixed(2)} ${asset}` : "—"}
                    mono
                    highlight
                  />
                  <PreviewRow
                    label="Potential ROI"
                    value={roi > 0 ? `+${roi.toFixed(1)}%` : "—"}
                    color={roi > 0 ? ACCENT : TEXT}
                  />
                </div>

                {/* CTA */}
                <button
                  onClick={handleStake}
                  disabled={!numAmount}
                  className="mt-5 w-full rounded-lg py-3 text-sm font-bold transition-transform disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    background: selected === "YES" ? YES : NO,
                    color: "#0a0a10",
                  }}
                >
                  {isAuthenticated
                    ? `Back ${selected} with ${amount || "0"} ${asset}`
                    : "Connect wallet to stake"}
                </button>

                <div className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed" style={{ color: TEXT_DIM }}>
                  <span aria-hidden style={{ color: ACCENT }}>◆</span>
                  <span>
                    Your stake is held in a Soroban contract, not by PayaStakes. Settlement
                    triggers automatically when two oracles agree on the outcome.
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5 sm:p-6" style={{ background: SURFACE, borderColor: BORDER }}>
      {children}
    </div>
  );
}

function CardHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] uppercase tracking-widest" style={{ color: ACCENT }}>
        {eyebrow}
      </div>
      <h2 className="mt-1 text-xl font-bold" style={{ color: TEXT }}>
        {title}
      </h2>
    </div>
  );
}

function MetaStat({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="rounded-lg border px-4 py-3" style={{ background: SURFACE, borderColor: BORDER }}>
      <div className="text-[10px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>
        {label}
      </div>
      <div
        className={`mt-1 font-semibold ${mono ? "font-mono" : ""}`}
        style={{ color: accent ? ACCENT : TEXT }}
      >
        {value}
      </div>
    </div>
  );
}

function SideStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border px-4 py-3" style={{ background: SURFACE_HIGH, borderColor: BORDER }}>
      <div className="text-[10px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>
        {label}
      </div>
      <div className="mt-1 font-mono text-lg font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function OddsBar({ yes, no }: { yes: number; no: number }) {
  const yesPct = Math.round(yes * 100);
  const noPct = 100 - yesPct;
  return (
    <div>
      <div className="mb-2 flex justify-between font-mono text-xs">
        <span style={{ color: YES }}>YES {yesPct}%</span>
        <span style={{ color: NO }}>NO {noPct}%</span>
      </div>
      <div className="relative h-3 overflow-hidden rounded-full" style={{ background: `${NO}22` }}>
        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${yesPct}%`, background: YES }} />
      </div>
    </div>
  );
}

function PricePlaceholder() {
  return (
    <div
      className="mt-6 flex items-center justify-center rounded-lg border py-16"
      style={{ background: SURFACE_HIGH, borderColor: BORDER, color: TEXT_DIM }}
    >
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest">Price history</div>
        <div className="mt-2 text-sm">Chart coming — hourly probability over the market's lifetime.</div>
      </div>
    </div>
  );
}

function SideButton({
  label,
  price,
  color,
  active,
  onClick,
}: {
  label: string;
  price: number;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border py-3 transition-all"
      style={{
        background: active ? color : SURFACE_HIGH,
        borderColor: active ? color : BORDER,
        color: active ? "#0a0a10" : color,
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-widest">{label}</div>
      <div className="mt-1 font-mono text-lg font-bold">{Math.round(price * 100)}¢</div>
    </button>
  );
}

function PreviewRow({
  label,
  value,
  mono,
  highlight,
  color,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span style={{ color: TEXT_DIM }}>{label}</span>
      <span
        className={`${mono ? "font-mono" : ""} ${highlight ? "font-bold" : "font-semibold"}`}
        style={{ color: color ?? TEXT }}
      >
        {value}
      </span>
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
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
