# PayaStakes

**A Stellar-native stakes, escrow, and payouts platform.**

PayaStakes is a full-stack platform for putting real money on the line — safely, globally, and cheaply — powered by the [Stellar network](https://stellar.org/) and [Soroban](https://stellar.org/soroban) smart contracts. It combines three layers into one product:

1. **Protocol layer** — a peer-to-peer stakes primitive. Any two (or more) parties can lock any Stellar asset against any outcome, and Soroban settles the winner deterministically.
2. **Infrastructure layer** — programmable escrow and payout rails. Trustless custody, multi-asset support, scheduled and streaming disbursements, and oracle-verified resolution — all as reusable building blocks.
3. **Product layer** — cross-border stakes and tournaments for real users. Private leagues, friend-vs-friend wagers, community pools, and public competitions with instant Stellar settlement in the currency each participant already holds.

The result is a system where a solo user can bet a friend $5 on Sunday's game, a community can run a 10,000-person prediction league, and a business can plug a trustless escrow into its own app — all on the same infrastructure, all settling on Stellar in seconds for fractions of a cent.

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

### Product layer — tournaments and consumer stakes

- **Private leagues with invite codes** — closed communities can host their own leaderboards with unique invite links.
- **Public tournaments** — global competitions with auto-created markets that never go stale (autonomous fixture sync).
- **AI-assisted event creation** — recommended matches, deadlines, and structures to maximise participation.
- **Personalised Leaderboard Coach** — AI analyses each user's history and delivers weekly insights on how to improve.
- **AI benchmark competitor** — the platform's own model enters every market as a ranked user, giving humans a live baseline to beat.
- **Predictions as a first-class use case** — the original prediction-market experience is now one product on the PayaStakes stack, not the whole platform.

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

Stellar was built to move value across borders quickly and cheaply. PayaStakes uses that primitive for the moments where value moves *conditionally* — when the outcome of a game, a milestone, a tournament, or a private wager decides who receives what.

By combining a peer-to-peer stakes protocol, programmable escrow infrastructure, and a consumer tournament product on a single Stellar-native stack, PayaStakes turns "put your money where your mouth is" into something anyone in the world can do — trustlessly, instantly, and in the currency they already hold.
