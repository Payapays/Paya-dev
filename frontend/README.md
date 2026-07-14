# PayaStakes — Frontend

Next.js web application — the consumer product tier of PayaStakes. Surfaces the underlying Stellar stakes protocol as tournaments, private leagues, friend-vs-friend wagers, and community pools. Users sign transactions directly with their own Stellar wallet (Freighter / Stellar Wallets Kit) — the app never holds funds.

Built with React 19, Tailwind CSS 4, and Framer Motion.

---

## Tech Stack

| Layer           | Technology              |
| --------------- | ----------------------- |
| Framework       | Next.js 16 (App Router) |
| Language        | TypeScript 5            |
| Styling         | Tailwind CSS 4          |
| Animations      | Framer Motion           |
| UI Primitives   | Radix UI                |
| Icons           | Lucide React            |
| Package Manager | pnpm                    |

---

## Prerequisites

- Node.js 20+
- pnpm — `npm install -g pnpm`

---

## Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm run dev
```

Open `http://localhost:3000` in your browser.

---

## Scripts

```bash
pnpm run dev      # Start development server (Turbopack)
pnpm run build    # Build for production
pnpm run start    # Start production server
pnpm run lint     # Run Next.js ESLint
```

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (authenticated)/        # Protected routes (dashboard, profile, etc.)
│   │   ├── dashboard/
│   │   ├── markets/
│   │   ├── competitions/
│   │   ├── leaderboards/
│   │   ├── my-predictions/
│   │   ├── rewards/
│   │   ├── wallet/
│   │   ├── profile/
│   │   └── settings/
│   ├── events/                 # Public events page
│   ├── leaderboard/            # Public leaderboard
│   ├── docs/                   # Documentation page
│   ├── trading/                # Trading interface
│   ├── login/ & signin/        # Auth pages
│   ├── terms/ & privacy/       # Legal pages
│   └── page.tsx                # Landing page
├── component/                  # Reusable components
│   ├── Homepage/               # Landing page sections
│   ├── dashboard/              # Dashboard components
│   ├── leaderboard/            # Leaderboard components
│   ├── events/                 # Events components
│   ├── rewards/                # Rewards components
│   ├── trading/                # Trading components
│   └── ui/                     # Base UI primitives
└── lib/                        # Utilities and helpers
```

---

## Pages Overview

| Route           | Description                              |
| --------------- | ---------------------------------------- |
| `/`             | Landing page                             |
| `/events`       | Public events and competitions           |
| `/leaderboard`  | Global leaderboard                       |
| `/docs`         | Platform documentation                   |
| `/trading`      | Trading interface                        |
| `/dashboard`    | User dashboard (authenticated)           |
| `/markets`      | Prediction markets (authenticated)       |
| `/competitions` | Competitions (authenticated)             |
| `/rewards`      | Rewards and achievements (authenticated) |
| `/wallet`       | Wallet management (authenticated)        |
| `/profile`      | User profile (authenticated)             |
| `/settings`     | Account settings (authenticated)         |

---

## Building for Production

```bash
pnpm run build
pnpm run start
```

The build output goes to `.next/`. Make sure all environment variables are set before building.

---

## Contributing

See the root [CONTRIBUTING.md](../CONTRIBUTING.md) for the full contribution guide.
