

PayaStakes turns Stellar's payments infrastructure into a general purpose settlement layer for outcomes. Any user — anywhere in the world, holding any Stellar asset  can put money on a prediction, a private wager, or a tournament and have it settled trustlessly by Soroban smart contracts in seconds, for fractions of a cent.

Prediction markets are our flagship product. On top of the same protocol we also power friend-to-friend wagers, community pools, and public tournaments — because the underlying primitive (conditional escrow of any Stellar asset, resolved by oracle attestations) is the same for all of them.

The platform is designed around three principles:

- **Non-custodial by construction.** The backend never holds user funds. Stakes are locked in Soroban contracts; users sign every transfer with their own Stellar wallet.
- **Trust-minimized outcomes.** Every result is cross-checked across two independent oracles before a Soroban contract will settle. No operator override, no single point of failure.
- **Payments-first design.** We chose Stellar because global settlement, native multi-asset support, and anchors-in-180+-countries are exactly what a stakes platform needs. Nothing here is bolted onto a general-purpose L1.

---

## The Problem

Prediction markets and peer-to-peer stakes have three chronic problems on legacy blockchains and centralized platforms alike:

1. **Custodial risk.** Centralized platforms hold user funds. Every year, some of them fail.
2. **Settlement friction.** On general-purpose L1s, fees are volatile and finality is slow. A $5 wager is impossible when gas costs $8.
3. **Cross-border currency mismatch.** A user in Nigeria staking against a user in Argentina should not have to bridge through USD, ETH, or a wrapped stablecoin to settle a bet.

The result: a global market — sports, price predictions, private wagers — that is theoretically enormous but is served today by either untrustworthy centralized operators or by decentralized systems that price out the median user.

## What PayaStakes Provides

A single-purpose, Stellar-native stack that eliminates all three problems:

| Problem                | PayaStakes Solution                                                                      |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| Custodial risk         | Soroban smart contracts hold all stakes. The platform is a facilitator, not a custodian. |
| Settlement friction    | ~5 second finality and sub-cent fees on Stellar. A $1 bet costs less than $0.01 to settle. |
| Cross-border mismatch  | Native multi-asset support: XLM, USDC, EURC, and any issued Stellar asset. Anchors on/off ramp to 180+ countries. |
| Outcome integrity      | Two-source oracle validation on every result before settlement can trigger.              |
| Discovery              | Autonomous fixture sync creates fresh public prediction markets every hour, no admin input. |
| Skill improvement      | AI-powered leaderboard coach delivers personalised weekly insights to every user.        |

---

## Why Stellar

We built PayaStakes on Stellar because every hard requirement of a global stakes platform maps directly to a first-class Stellar feature. This is not a portability argument — the platform is designed *around* Stellar, and would require significant redesign to run elsewhere.

| Requirement                              | Stellar / Soroban feature we lean on                                            |
| ---------------------------------------- | -------------------------------------------------------------------------------- |
| Fast, cheap outcome settlement           | Stellar Consensus Protocol — ~5s finality, sub-cent fees                        |
| Multi-currency stakes with no bridging   | Native asset issuance — XLM, USDC, EURC, and any issued asset are first-class   |
| Cross-border payouts to real people      | Stellar Anchors and on/off ramps in 180+ countries                              |
| Trustless custody of participant funds   | Soroban contracts with deterministic, auditable state                           |
| Time-locked and scheduled disbursements  | Native `ClaimableBalance` predicates + Soroban time-based execution             |
| Oracle-verified outcome resolution       | Soroban's deterministic execution + on-chain oracle attestation contracts       |
| High throughput for global events        | Stellar's high-throughput, low-latency network                                  |
| Small-value transactions (micro-stakes)  | Sub-cent fees make a $1 wager economically viable                               |

Ports of this system to other chains would cost more per transaction, require synthetic wrappers for cross-currency stakes, and lose the anchor network that lets a real user cash out in their local currency. Stellar is the substrate, not a deployment target.

---

## Flagship Product: Prediction Markets

The first and most fully-featured product on the PayaStakes stack. Users predict real-world outcomes — sports fixtures, crypto prices, milestones, elections, anything measurable — and settle in seconds on Stellar.

### Public markets

- Global prediction events on live sports fixtures, price feeds, and news
- **Autonomous fixture sync** — the platform pulls schedules hourly and creates markets with zero admin input, so the marketplace never runs out of things to predict
- Cross-currency staking: back your prediction in XLM, USDC, or any issued Stellar asset

### Private prediction leagues

- Any user can spin up a closed league in seconds and generate an invite code
- Participants join via the invite link, stake in the league's chosen asset, and compete on a private leaderboard
- Ideal for friend groups, DAOs, alumni networks, corporate communities

### AI-augmented experience

- **AI benchmark competitor** — the platform's own model enters every market as a ranked user, giving humans a live baseline to beat
- **Personalised Leaderboard Coach** — the AI analyses each user's prediction history and delivers tailored weekly insights on how to improve accuracy
- **AI-assisted market creation** — when creators build custom prediction events, the AI recommends optimal match selections, deadlines, and structures to maximise engagement

### Trust-minimized settlement

- **Two-source oracle validation** — every outcome is cross-checked across two independent providers before a Soroban contract will accept it and settle
- **No operator override** — settlement is triggered by attested oracle data, not by a platform admin
- **Non-custodial** — the platform never holds prediction stakes; Soroban contracts do

---

## Architecture

PayaStakes is a three-tier system. Each tier maps to one directory in the repo and one concrete role in the trust model.

```text
                        ┌─────────────────────────────────────┐
                        │   Product tier (frontend/)          │
                        │   Next.js 16 — user surfaces        │
                        │   markets · leagues · wagers        │
                        └────────────────┬────────────────────┘
                                         │  REST + WebSocket
                                         │  wallet signs directly
                                         ▼
                        ┌─────────────────────────────────────┐
                        │   Infrastructure tier (backend/)    │
                        │   NestJS API — never custodies      │
                        │   • oracle aggregation              │
                        │   • event indexing                  │
                        │   • payout scheduling               │
                        │   • notifications                   │
                        │   • analytics                       │
                        └────────────────┬────────────────────┘
                                         │  Soroban RPC
                                         ▼
                        ┌─────────────────────────────────────┐
                        │   Protocol tier (contracts/)        │
                        │   Soroban smart contracts on Stellar│
                        │   • stakes primitive                │
                        │   • escrow                          │
                        │   • payout scheduler                │
                        │   • oracle attester                 │
                        │   • dispute resolution              │
                        └────────────────┬────────────────────┘
                                         ▲
                                         │
                        ┌────────────────┴────────────────────┐
                        │   External oracles                  │
                        │   sports APIs · price feeds ·       │
                        │   milestone verifiers               │
                        └─────────────────────────────────────┘
```

Users sign every stake and every payout with their own Stellar wallet (Freighter or any wallet supported by Stellar Wallets Kit). The backend is a facilitator — it aggregates oracles, indexes on-chain events, and orchestrates scheduled payouts, but it can never move funds unilaterally. All value sits in Soroban contracts until a two-oracle-verified outcome triggers settlement.

---

## Smart Contracts

The `contracts/` directory contains the Soroban contract suite. All contracts are written in Rust and compiled to WASM for the Soroban runtime.

| Contract                | Role                                                                       |
| ----------------------- | -------------------------------------------------------------------------- |
| `open-market`           | Prediction market lifecycle — creation, staking, resolution, settlement    |
| `creator-event-manager` | Private league / creator event orchestration and invite management         |

Key design properties across the suite:

- **Deterministic settlement** — outcomes are decided by attested oracle data hashed and stored on-chain, not by mutable admin state
- **Multi-asset staking** — every contract accepts any issued Stellar asset via the standard Soroban token interface
- **Escrow invariants** — the sum of all pending payouts is always ≤ total contract balance (verified by unit tests)
- **Reentrancy-safe** — cross-contract calls follow the Soroban authorization model; no dynamic dispatch to user-supplied code
- **Storage-efficient** — Soroban's temporary/persistent/instance storage tiers used deliberately to minimise settlement cost

Each contract ships with unit tests, integration tests, and (for `open-market`) a security audit checklist in `contracts/open-market/SECURITY_AUDIT.md`.

---

## Repository Structure

```text
PayaStakes/
├── frontend/    # Next.js 16 web app — product tier (user surfaces)
├── backend/     # NestJS 11 REST + WebSocket API — infrastructure tier
└── contracts/   # Soroban smart contracts (Rust) — protocol tier
```

| Directory   | Tier            | Responsibility                                                       |
| ----------- | --------------- | -------------------------------------------------------------------- |
| `contracts` | Protocol        | Stake creation, custody, resolution, settlement — the trust root     |
| `backend`   | Infrastructure  | Oracle aggregation, indexing, scheduled payouts, APIs, notifications |
| `frontend`  | Product         | Consumer surfaces — markets, leagues, wallets, discovery             |

---

## Quick Start

### Prerequisites

- Node.js **20+** — https://nodejs.org
- pnpm **9** — `npm install -g pnpm@9`
- Rust (stable) — `curl https://sh.rustup.rs -sSf | sh`
- `wasm32` target — `rustup target add wasm32-unknown-unknown`
- PostgreSQL **14+** — https://postgresql.org
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
# API      → http://localhost:3000/api/v1
# Swagger  → http://localhost:3000/api/v1/docs
```

### 3. Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3000
pnpm install
pnpm dev
# App → http://localhost:3001
```

### 4. Smart Contracts (Soroban / Rust)

```bash
cd contracts/open-market
make build   # compile to WASM
make test    # run unit tests
```

See each subdirectory's `README.md` for deployment, migration, and testnet instructions.

---

## Technology Stack

| Layer            | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| Blockchain       | [Stellar Network](https://stellar.org/)                 |
| Smart contracts  | [Soroban](https://stellar.org/soroban) (Rust)           |
| Wallet           | Freighter + Stellar Wallets Kit                         |
| Frontend         | Next.js 16 · React 19 · Tailwind CSS 4 · Framer Motion  |
| Backend          | NestJS 11 · Node.js 20 · TypeScript 5                   |
| Database         | PostgreSQL 14+ · TypeORM                                |
| Auth             | JWT + Stellar wallet signature verification             |
| Realtime         | WebSockets (Socket.IO)                                  |
| Testing          | Jest (backend) · Cargo test (contracts)                 |
| API docs         | Swagger / OpenAPI                                       |
| Package manager  | pnpm 9                                                  |
| Assets supported | XLM, USDC, EURC, and any issued Stellar asset           |

---

## Security & Trust Model

Security is a design property, not a feature. The trust model of PayaStakes is:

- **Users trust the Soroban contracts and the Stellar network.** They do not need to trust the platform operator.
- **The platform operator cannot move user funds.** Every transfer requires a user signature or a deterministic on-chain trigger (a resolved outcome with valid oracle attestations).
- **Oracle results cannot be forged by a single operator.** Two independent oracle sources must agree before a Soroban contract will accept an outcome for settlement.
- **Contract state is auditable.** All storage, all events, and all authorization decisions are on-chain.

### Security artefacts

- `contracts/open-market/SECURITY_AUDIT.md` — line-item audit checklist for the flagship contract
- `backend/SECURITY.md` (in progress) — API-side threat model and mitigations
- Formal third-party audit — planned before mainnet launch (see [Roadmap](#roadmap))

### Reporting a vulnerability

Please report security issues privately to the maintainers before public disclosure. See `SECURITY.md` (root) once published.

---

## Contributing

We welcome contributions from the Stellar and broader open-source community. New contributors typically start by reading:

- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — root contribution guide, CI expectations, PR checklist
- [`backend/CONTRIBUTING.md`](./backend/CONTRIBUTING.md) — NestJS-specific setup and testing conventions
- [`contracts/open-market/CONTRIBUTING.md`](./contracts/open-market/CONTRIBUTING.md) — Soroban / Rust guidelines and audit process
- [`frontend/CONTRIBUTING.md`](./frontend/CONTRIBUTING.md) — Next.js and design system conventions

Good first issues are labelled on GitHub. Every PR runs the full CI pipeline (lint · test · build · WASM compile) before it can be merged.

---
