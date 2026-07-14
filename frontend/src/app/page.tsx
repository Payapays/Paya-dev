"use client";

import React from "react";
import Link from "next/link";
import Header from "@/component/Header";
import Footer from "@/component/Footer";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (aligned with globals.css --primary #4FD1C5 accent)
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-24 pb-32 sm:pt-32 sm:pb-40">
      {/* radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1000px 500px at 50% -10%, rgba(79,209,197,0.14), transparent 60%)",
        }}
      />
      {/* grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-[--border] bg-[--surface] px-3 py-1.5 text-xs font-medium text-[--text-muted]"
          style={{
            // fallback for browsers without css var support in inline
            ["--border" as any]: BORDER,
            ["--surface" as any]: SURFACE,
            ["--text-muted" as any]: TEXT_MUTED,
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: ACCENT }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: ACCENT }} />
          </span>
          <span>Live on Stellar Testnet</span>
          <span className="text-[10px]" style={{ color: TEXT_DIM }}>·</span>
          <span style={{ color: TEXT }}>Mainnet audit in progress</span>
        </div>

        <h1 className="mt-8 text-center text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl" style={{ color: TEXT }}>
          Predict outcomes.
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(90deg, ${ACCENT} 0%, #7cf0e2 40%, ${AMBER} 100%)`,
            }}
          >
            Settle on Stellar.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed" style={{ color: TEXT_MUTED }}>
          PayaStakes is a non-custodial prediction market platform powered by Soroban
          smart contracts. Stake any Stellar asset on real-world outcomes, settle
          trustlessly in seconds, and pay less than a cent in fees.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/markets"
            className="group inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: ACCENT, color: "#0a0a10" }}
          >
            Browse markets
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/docs"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors"
            style={{ borderColor: BORDER, color: TEXT, background: SURFACE }}
          >
            Read the docs
          </Link>
        </div>

        {/* trust row */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs uppercase tracking-widest" style={{ color: TEXT_DIM }}>
          <span>Non-custodial</span>
          <Dot />
          <span>Two-source oracle</span>
          <Dot />
          <span>Multi-asset (XLM · USDC · EURC)</span>
          <Dot />
          <span>Soroban settled</span>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return <span aria-hidden style={{ color: TEXT_DIM }}>·</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Live stat bar
// ─────────────────────────────────────────────────────────────────────────────
const STATS = [
  { label: "Markets live", value: "1,284", delta: "+42 today" },
  { label: "Total staked", value: "3.2M XLM", delta: "+128k this week" },
  { label: "Active users", value: "8,417", delta: "+312 this week" },
  { label: "Payouts settled", value: "$1.9M", delta: "in the last 30d" },
];

function StatBar() {
  return (
    <section className="relative border-y" style={{ borderColor: BORDER, background: SURFACE }}>
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x px-6 py-8 md:grid-cols-4" style={{ ["--tw-divide-opacity" as any]: 1 }}>
        {STATS.map((s, i) => (
          <div key={s.label} className={`px-4 ${i > 0 ? "md:border-l" : ""}`} style={{ borderColor: BORDER }}>
            <div className="text-xs uppercase tracking-widest" style={{ color: TEXT_DIM }}>
              {s.label}
            </div>
            <div className="mt-2 font-mono text-2xl font-bold tracking-tight md:text-3xl" style={{ color: TEXT }}>
              {s.value}
            </div>
            <div className="mt-1 text-xs" style={{ color: ACCENT }}>
              ↑ {s.delta}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Featured markets
// ─────────────────────────────────────────────────────────────────────────────
type PreviewMarket = {
  category: string;
  question: string;
  yes: number;
  no: number;
  volume: string;
  closesIn: string;
  hot?: boolean;
};

const FEATURED: PreviewMarket[] = [
  { category: "Crypto", question: "Will BTC close above $70k on Dec 31?", yes: 62, no: 38, volume: "48.2k XLM", closesIn: "6d 12h", hot: true },
  { category: "Sports", question: "Real Madrid to win La Liga this season", yes: 74, no: 26, volume: "22.7k XLM", closesIn: "42d 3h" },
  { category: "Politics", question: "US Fed to cut rates in next FOMC", yes: 41, no: 59, volume: "31.4k XLM" , closesIn: "18d 20h" },
  { category: "Crypto", question: "XLM to trade above $0.20 in Q1", yes: 55, no: 45, volume: "17.9k XLM", closesIn: "27d 5h" },
  { category: "Sports", question: "Man City to reach UCL final", yes: 33, no: 67, volume: "14.1k XLM", closesIn: "63d 11h", hot: true },
  { category: "Culture", question: "Oppenheimer to win Best Picture", yes: 81, no: 19, volume: "9.3k XLM", closesIn: "8d 4h" },
];

function FeaturedMarkets() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
              Flagship product
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: TEXT }}>
              Live prediction markets
            </h2>
            <p className="mt-3 max-w-xl" style={{ color: TEXT_MUTED }}>
              Sports, crypto, politics, culture — any measurable outcome, resolved by two
              independent oracles and settled on Soroban.
            </p>
          </div>
          <Link
            href="/markets"
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold sm:inline-flex"
            style={{ color: ACCENT }}
          >
            View all markets →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((m) => (
            <MarketPreviewCard key={m.question} market={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketPreviewCard({ market }: { market: PreviewMarket }) {
  return (
    <Link
      href="/markets"
      className="group relative flex flex-col overflow-hidden rounded-xl border p-5 transition-all hover:-translate-y-0.5"
      style={{ background: SURFACE, borderColor: BORDER }}
    >
      <div className="flex items-center justify-between text-xs" style={{ color: TEXT_MUTED }}>
        <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] uppercase tracking-wider" style={{ borderColor: BORDER, color: TEXT_DIM }}>
          {market.category}
        </span>
        {market.hot && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: AMBER }}>
            ● Trending
          </span>
        )}
      </div>

      <h3 className="mt-4 min-h-[3.25rem] text-base font-semibold leading-snug transition-colors group-hover:text-white" style={{ color: TEXT }}>
        {market.question}
      </h3>

      {/* probability bar */}
      <div className="mt-5">
        <div className="mb-1.5 flex items-center justify-between text-xs font-mono" style={{ color: TEXT_MUTED }}>
          <span style={{ color: YES }}>YES {market.yes}¢</span>
          <span style={{ color: NO }}>NO {market.no}¢</span>
        </div>
        <div className="relative h-1.5 overflow-hidden rounded-full" style={{ background: `${NO}22` }}>
          <div
            className="absolute inset-y-0 left-0"
            style={{ width: `${market.yes}%`, background: YES }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t pt-4 text-xs font-mono" style={{ borderColor: BORDER, color: TEXT_DIM }}>
        <span>Vol {market.volume}</span>
        <span>Closes in {market.closesIn}</span>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// How it works
// ─────────────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    n: "01",
    title: "Connect your Stellar wallet",
    body: "Sign in with Freighter or any wallet supported by Stellar Wallets Kit. No email, no custodian, no account balance to top up.",
  },
  {
    n: "02",
    title: "Stake any Stellar asset",
    body: "Back YES or NO on any market in XLM, USDC, EURC, or any issued Stellar asset. Your stake locks in a Soroban contract, not our database.",
  },
  {
    n: "03",
    title: "Get paid in seconds",
    body: "When two independent oracles agree on the outcome, Soroban settles automatically and pays winners directly to their wallet. No withdrawal button.",
  },
];

function HowItWorks() {
  return (
    <section className="relative border-t py-24" style={{ borderColor: BORDER, background: BG }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
            How it works
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: TEXT }}>
            Three steps. Zero custody.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="rounded-xl border p-6" style={{ background: SURFACE, borderColor: BORDER }}>
              <div className="font-mono text-xs" style={{ color: ACCENT }}>{s.n}</div>
              <h3 className="mt-3 text-lg font-semibold" style={{ color: TEXT }}>{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Why Stellar
// ─────────────────────────────────────────────────────────────────────────────
const STELLAR_POINTS = [
  { k: "~5s", v: "Finality — a $1 wager settles faster than your coffee order." },
  { k: "<$0.01", v: "Per-transaction fee. Sub-cent settlement makes micro-stakes economical." },
  { k: "180+", v: "Countries with Stellar anchors on/off ramping to local currency." },
  { k: "Any", v: "Stellar asset works out of the box — XLM, USDC, EURC, or your own." },
];

function WhyStellar() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <div className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
              Built on Stellar
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: TEXT }}>
              Not deployed on Stellar. Designed for it.
            </h2>
            <p className="mt-3" style={{ color: TEXT_MUTED }}>
              PayaStakes leans on Stellar's payment-native design for every hard
              requirement of a stakes platform. Porting elsewhere would cost more
              per transaction, need synthetic wrappers, and lose the anchor network.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STELLAR_POINTS.map((p) => (
            <div key={p.k} className="rounded-xl border p-6" style={{ background: SURFACE, borderColor: BORDER }}>
              <div
                className="font-mono text-3xl font-bold"
                style={{
                  backgroundImage: `linear-gradient(180deg, ${ACCENT}, #7cf0e2)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {p.k}
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{p.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Trust panel
// ─────────────────────────────────────────────────────────────────────────────
function TrustPanel() {
  return (
    <section className="relative border-y py-24" style={{ borderColor: BORDER, background: SURFACE }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <div className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
              Trust model
            </div>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: TEXT }}>
              You never trust us. You trust Stellar and open code.
            </h2>
            <p className="mt-4 leading-relaxed" style={{ color: TEXT_MUTED }}>
              Every stake is held by a Soroban smart contract. The backend cannot
              move your funds — it aggregates oracles, indexes events, and orchestrates
              scheduled payouts. Settlement is triggered by attested oracle data, not
              by any human operator.
            </p>
            <ul className="mt-6 space-y-3 text-sm" style={{ color: TEXT }}>
              <TrustPoint text="Non-custodial by construction — the platform is a facilitator, not a bank." />
              <TrustPoint text="Two independent oracles must agree before settlement is allowed." />
              <TrustPoint text="Contract source, audit checklist, and on-chain state are all public." />
              <TrustPoint text="Third-party audit gate before mainnet launch." />
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TrustStat label="Contracts" value="Open-source" note="MIT-licensed, on GitHub" />
            <TrustStat label="Oracles per resolution" value="2" note="Independent providers" mono />
            <TrustStat label="Custody" value="Zero" note="Backend never holds funds" mono />
            <TrustStat label="Audit status" value="Pre-mainnet" note="Third-party in progress" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustPoint({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden
        className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
        style={{ background: ACCENT_SOFT, color: ACCENT }}
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M2 6l2.5 2.5L10 3" />
        </svg>
      </span>
      <span className="leading-relaxed" style={{ color: TEXT_MUTED }}>{text}</span>
    </li>
  );
}

function TrustStat({ label, value, note, mono }: { label: string; value: string; note: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border p-5" style={{ background: SURFACE_HIGH, borderColor: BORDER }}>
      <div className="text-[10px] uppercase tracking-widest" style={{ color: TEXT_DIM }}>{label}</div>
      <div className={`mt-2 text-2xl font-bold ${mono ? "font-mono" : ""}`} style={{ color: TEXT }}>{value}</div>
      <div className="mt-1 text-xs" style={{ color: TEXT_MUTED }}>{note}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Product surfaces
// ─────────────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: "Prediction markets",
    tag: "Flagship",
    body: "Public markets on sports, crypto, politics, culture — auto-created every hour by the fixture sync so the marketplace never runs dry.",
  },
  {
    name: "Private leagues",
    tag: "Communities",
    body: "Spin up a closed prediction league in seconds. Share an invite code with friends, DAOs, alumni groups. Private leaderboards, private prize pools.",
  },
  {
    name: "P2P wagers",
    tag: "Friends",
    body: "Bet a friend $5 on Sunday's game in the currency you both already hold. Same escrow, no bookmaker, no house edge.",
  },
];

function ProductSurfaces() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
            One stack, many products
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: TEXT }}>
            Everything is a stake.
          </h2>
          <p className="mt-3" style={{ color: TEXT_MUTED }}>
            The same protocol that powers public prediction markets also powers
            private leagues and 1:1 wagers. Different surfaces, same trust root.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {PRODUCTS.map((p) => (
            <div
              key={p.name}
              className="relative overflow-hidden rounded-xl border p-6"
              style={{ background: SURFACE, borderColor: BORDER }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold" style={{ color: TEXT }}>{p.name}</h3>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                  style={{ background: ACCENT_SOFT, color: ACCENT }}
                >
                  {p.tag}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: TEXT_MUTED }}>{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap
// ─────────────────────────────────────────────────────────────────────────────
const ROADMAP = [
  { phase: "Testnet α", status: "Complete", body: "Prediction market MVP on Stellar testnet." },
  { phase: "Testnet β", status: "Complete", body: "Private leagues, invite codes, AI benchmark competitor." },
  { phase: "Testnet γ", status: "In progress", body: "Multi-asset staking (XLM · USDC · EURC), autonomous fixture sync." },
  { phase: "Audit", status: "Planned", body: "Third-party Soroban audit before mainnet." },
  { phase: "Mainnet", status: "Planned", body: "Prediction markets and private leagues generally available." },
];

function Roadmap() {
  return (
    <section className="relative border-t py-24" style={{ borderColor: BORDER, background: BG }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
            Roadmap
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: TEXT }}>
            Ship in the open.
          </h2>
        </div>

        <ol className="mt-12 space-y-3">
          {ROADMAP.map((r) => (
            <li
              key={r.phase}
              className="flex flex-col gap-3 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between"
              style={{ background: SURFACE, borderColor: BORDER }}
            >
              <div className="flex items-center gap-4">
                <div className="font-mono text-sm font-semibold" style={{ color: TEXT }}>{r.phase}</div>
                <StatusPill status={r.status} />
              </div>
              <div className="text-sm" style={{ color: TEXT_MUTED }}>{r.body}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: string }) {
  const color =
    status === "Complete" ? ACCENT :
    status === "In progress" ? AMBER :
    TEXT_DIM;
  const bg =
    status === "Complete" ? ACCENT_SOFT :
    status === "In progress" ? "rgba(245, 184, 61, 0.12)" :
    "rgba(255,255,255,0.05)";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider"
      style={{ background: bg, color }}
    >
      <span aria-hidden style={{ width: 6, height: 6, background: color, borderRadius: 999 }} />
      {status}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CTA band
// ─────────────────────────────────────────────────────────────────────────────
function CTABand() {
  return (
    <section className="relative overflow-hidden py-20">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `radial-gradient(600px 300px at 50% 50%, ${ACCENT_SOFT}, transparent 70%)`,
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: TEXT }}>
          Put your money where your insight is.
        </h2>
        <p className="mx-auto mt-4 max-w-xl" style={{ color: TEXT_MUTED }}>
          Connect your Stellar wallet, back a market, and settle in seconds.
          No custodian. No account. No withdrawal button.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5"
            style={{ background: ACCENT, color: "#0a0a10" }}
          >
            Enter the app →
          </Link>
          <Link
            href="https://github.com/Payapays/Paya-dev"
            className="inline-flex items-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold"
            style={{ borderColor: BORDER, color: TEXT, background: SURFACE }}
          >
            Star on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: BG, color: TEXT }}>
      <Header />
      <main>
        <Hero />
        <StatBar />
        <FeaturedMarkets />
        <HowItWorks />
        <ProductSurfaces />
        <WhyStellar />
        <TrustPanel />
        <Roadmap />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}
