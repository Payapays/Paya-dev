# PayaStakes

**A Stellar-native prediction market platform, built on a general-purpose stakes and payouts protocol.**

PayaStakes is a full-stack platform for putting real money on the line — safely, globally, and cheaply — powered by the [Stellar network](https://stellar.org/) and [Soroban](https://stellar.org/soroban) smart contracts.

Prediction markets are our flagship product: sports, crypto prices, and any measurable real-world outcome, with two-source oracle validation, an AI benchmark competitor, autonomous fixture sync, and private leagues with invite codes. But because we built prediction markets on top of a general stakes-and-escrow protocol, the same infrastructure also powers friend-vs-friend wagers, community pools, tournaments, and third-party integrations.

Three layers, one product:

1. **Protocol layer** — a peer-to-peer stakes primitive. Any two (or more) parties can lock any Stellar asset against any outcome, and Soroban settles the winner deterministically.
2. **Infrastructure layer** — programmable escrow and payout rails. Trustless custody, multi-asset support, scheduled and streaming disbursements, and oracle-verified resolution — all as reusable building blocks.
3. **Product layer** — prediction markets first, plus cross-border stakes and tournaments. Private leagues, friend-vs-friend wagers, community pools, and public competitions with instant Stellar settlement in the currency each participant already holds.

The result is a system where a solo user can predict Sunday's game against a friend for $5, a community can run a 10,000-person prediction league, and a business can plug the same trustless escrow into its own app — all on one stack, all settling on Stellar in seconds for fractions of a cent.

---

## Why Stellar

Stellar is purpose-built for what PayaStakes needs. Every design choice below leans directly on a Stellar strength:

| PayaStakes needs                        | Stellar delivers                                                    |
| --------------------------------------- | ------------------------------------------------------------------- |
| Fast, cheap outcome settlement          | ~5s finality, sub-cent fees                                         |
| Multi-currency stakes without bridges   | Native asset issuance — USDC, EURC, XLM, and any issued asset       |
| Cross-border payouts to real people     | Anchors and on/off ramps in 180+ countries                          |
| Trustless custody of participant funds  | Soroban contracts with formally auditable state                     |
| Oracle-verified resolution              | Soroban's deterministic execution + on-chain oracle attestations    |
| Streaming and scheduled disbursements   | Native `ClaimableBalance` + Soroban time-locked contracts           |

Nothing here is retrofitted onto a general-purpose L1. PayaStakes is designed *around* Stellar's payment-first model rather than in spite of it.

---

## Flagship: Prediction Markets

The first and most fully-featured product on the PayaStakes stack. Users submit predictions on real-world outcomes — sports results, crypto prices, milestones, anything measurable — and settle in seconds on Stellar.

- **Public markets** — global prediction events on live sports fixtures, prices, and news. New markets are created automatically by an autonomous fixture sync that pulls schedules hourly, so the platform never runs out of things to predict.
- **Private prediction leagues** — any user can spin up a closed league, generate an invite code, and share it with friends or a community. Participants earn points on prediction accuracy and compete on a private leaderboard.
- **Two-source oracle validation** — every outcome is cross-checked across two independent providers before a Soroban contract will accept it and trigger settlement. No single point of failure, no operator override.
- **AI benchmark competitor** — the platform's own model enters every market as a ranked user, giving every human participant a live baseline to beat.
- **Personalised Leaderboard Coach** — the AI analyses each user's prediction history and delivers tailored weekly insights on how to improve.
- **AI-assisted market creation** — when creators build custom prediction events, the AI recommends the best match selections, optimal deadlines, and competition structures to maximise engagement.
- **Trustless settlement** — all escrow, resolution, and payouts run through Soroban contracts with sub-second finality and near-zero fees. The platform never holds user funds.

Prediction markets ride entirely on the same protocol and infrastructure that power everything else on this stack, which is why the same features (multi-asset stakes, cross-border payouts, private invites, streaming disbursements) work seamlessly for tournaments and P2P wagers too.

---

## Repository Structure

```
PayaStakes/
├── frontend/    # Next.js 16 web app — user product layer
├── backend/     # NestJS API — orchestration, indexing, oracles, notifications
└── contracts/   # Soroban smart contracts (Rust) — stakes, escrow, payouts
```

Each layer maps to one of the three product tiers:

| Directory   | Product tier              | Owns                                                                 |
| ----------- | ------------------------- | -------------------------------------------------------------------- |
| `contracts` | Protocol                  | Stake creation, custody, resolution, settlement — the trust root     |
| `backend`   | Infrastructure            | Oracle aggregation, indexing, scheduled payouts, APIs, notifications |
| `frontend`  | Product                   | Consumer surfaces — tournaments, leagues, wallets, discovery         |

---

## Quick Start

### Prerequisites

- Node.js 20+ → https://nodejs.org
- pnpm 9 → `npm install -g pnpm@9`
- Rust (stable) → `curl https://sh.rustup.rs -sSf | sh`
- wasm32 target → `rustup target add wasm32-unknown-unknown`
- PostgreSQL 14+ → https://postgresql.org
- Make

### 1. Clone

```bash
git clone https://github.com/Payapays/Paya-dev.git
cd Paya-dev
```

### 2. Backend (NestJS API)

```bash
cd backend
cp .env.example .env
# Edit .env — set DATABASE_URL, JWT_SECRET, SERVER_SECRET_KEY, STELLAR_NETWORK
pnpm install
pnpm migration:run
pnpm start:dev
# → http://localhost:3000/api/v1
# → http://localhost:3000/api/v1/docs (Swagger UI)
```

### 3. Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3000
pnpm install
pnpm dev
# → http://localhost:3001
```

### 4. Contracts (Soroban / Rust)

```bash
cd contracts
make build   # compile to WASM
make test    # run unit tests
```

---

## Architecture

```
┌─────────────────┐     REST + WebSocket     ┌──────────────────┐
│   Next.js 16    │ ───────────────────────► │   NestJS API     │
│   Frontend      │ ◄─────────────────────── │   :3000          │
│   :3001         │                          │                  │
└────────┬────────┘                          └────────┬─────────┘
         │                                            │
         │  Freighter / Stellar Wallets Kit           │ TypeORM
         │  (direct wallet signing)                   │
         ▼                                            ▼
┌───────────────────────────────┐            ┌──────────────────┐
│   Soroban Smart Contracts     │            │   PostgreSQL     │
│   • stakes                    │            │   (indexer,      │
│   • escrow                    │            │    users,        │
│   • payout scheduler          │            │    analytics)    │
│   • oracle attester           │            └──────────────────┘
│   on the Stellar network      │
└───────────────────────────────┘
         ▲
         │ multi-source oracle attestations
         │
┌───────────────────────────────┐
│   External Oracles            │
│   (sports APIs, price feeds,  │
│    milestone verifiers)       │
└───────────────────────────────┘
```

The consumer app never custodies funds. Users sign with their own Stellar wallet, and Soroban contracts hold and release stakes. The backend is a facilitator, not a bank.

---

## Core Features

### Protocol layer — peer-to-peer stakes

- **Any-asset staking** — lock XLM, USDC, EURC, or any issued Stellar asset. Cross-currency stakes settle at oracle-verified rates.
- **Composable outcomes** — binary, multi-outcome, scalar, and milestone-based commitments all use the same primitive.
- **Trustless resolution** — outcomes are settled by Soroban contracts against attested oracle data, not by a platform operator.
- **Two-source oracle validation** — every result is cross-checked across independent providers before it can trigger settlement.

### Infrastructure layer — programmable escrow and payouts

- **Multi-party escrow** — from two-person wagers to thousand-participant tournament pools, the same contract handles custody.
- **Scheduled and streaming payouts** — milestone-based releases, cliff schedules, and time-locked disbursements out of the box.
- **Instant cross-border settlement** — payouts land in the recipient's Stellar wallet in seconds, convertible via anchors to local currency in 180+ countries.
- **Oracle attester contracts** — reusable Soroban modules for wiring any external data source into on-chain resolution.

### Product layer — prediction markets and consumer stakes

- **Prediction markets (flagship)** — public and private markets on sports, crypto prices, and any measurable outcome, with two-source oracle validation and AI-assisted market creation. See [Flagship: Prediction Markets](#flagship-prediction-markets) above for the full feature set.
- **Private leagues with invite codes** — closed communities host their own prediction leaderboards and tournaments with unique invite links.
- **Public tournaments** — global competitions with auto-created markets that never go stale (autonomous fixture sync).
- **Friend-vs-friend wagers** — the same protocol that powers markets also powers 1:1 P2P stakes between friends, in any Stellar asset.
- **Community pools** — group stakes where a whole community contributes to a shared prize pool and winners are resolved by oracle-verified outcomes.
- **AI benchmark competitor** — the platform's own model enters every prediction market as a ranked user, giving humans a live baseline to beat.
- **Personalised Leaderboard Coach** — AI analyses each user's prediction history and delivers weekly insights on how to improve.

---

## Technology Stack

| Layer            | Technology                                    |
| ---------------- | --------------------------------------------- |
| Blockchain       | Stellar Network                               |
| Smart contracts  | Soroban (Rust)                                |
| Wallet           | Freighter + Stellar Wallets Kit               |
| Frontend         | Next.js 16 / React 19 / Tailwind CSS 4        |
| Backend          | NestJS 11 (Node.js 20)                        |
| Database         | PostgreSQL 14+ (TypeORM)                      |
| Auth             | JWT + wallet signature verification           |
| Package manager  | pnpm 9                                        |
| Assets supported | XLM, USDC, EURC, and any issued Stellar asset |

---

## Contributing

- Root guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Backend: [backend/CONTRIBUTING.md](backend/CONTRIBUTING.md)
- Contracts: [contracts/CONTRIBUTING.md](contracts/CONTRIBUTING.md)
- Frontend: [frontend/CONTRIBUTING.md](frontend/CONTRIBUTING.md)

---

## Vision

Stellar was built to move value across borders quickly and cheaply. PayaStakes uses that primitive for the moments where value moves *conditionally* — when the outcome of a match, a price, a milestone, or a private wager decides who receives what.

Prediction markets are how most users will first meet PayaStakes: predict Sunday's game, join a private league, back your read on a crypto price. But under the hood it's a peer-to-peer stakes protocol, programmable escrow infrastructure, and a consumer product line — all on a single Stellar-native stack. Same rails, more ways to prove insight and put money on the line.
