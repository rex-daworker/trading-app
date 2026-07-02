<div align="center">

<img src="screenshots/logo.svg" alt="TradeFlow" width="72" height="72" />

# TradeFlow

**A real-time paper-trading web app — live market data, a simulated portfolio, and portfolio analytics.**

Built with React + TypeScript, Firebase, and TanStack Query.

</div>

---

## Overview

TradeFlow lets a user track a live stock watchlist, "buy" and "sell" with a simulated cash balance, and see their portfolio's performance — all against **real market prices**. No real money is involved; it's a learning-and-portfolio project that demonstrates real-time data handling, authenticated multi-user state, and a polished, responsive-minded UI.

> **Note:** TradeFlow is desktop-optimized. It is best viewed on a laptop or desktop browser.

## Screenshots

| Dashboard — live watchlist              | Analytics — portfolio & allocation      |
| --------------------------------------- | --------------------------------------- |
| ![Dashboard](screenshots/dashboard.png) | ![Analytics](screenshots/analytics.png) |

## Features

- **Live watchlist** — real-time quotes from Finnhub, with subtle price-flash animations on every update.
- **Search & manage** — add or remove any symbol; each user's watchlist is persisted per-account in Firestore.
- **Expandable sparklines** — click a card to reveal a live price chart that builds up over the session.
- **Paper trading** — start with a simulated balance, then buy/sell at live prices. Trades are written atomically and cost basis is tracked with a weighted average.
- **Portfolio analytics** — cash, holdings value, and total value (with count-up animations), a live profit/loss table, and an allocation donut with a value/percentage breakdown.
- **Company news** — latest headlines for the day's top movers.
- **Multi-currency** — view every figure in USD, EUR, GBP, or NGN using live exchange rates.
- **Accounts & profiles** — email/password auth with an editable profile (name, date of birth, address, avatar).
- **Dark / light mode** — persisted across sessions.
- **Thoughtful UX** — toast notifications, confirm dialogs for destructive actions, and shimmer loading skeletons.

## Tech stack

| Area            | Technology                                |
| --------------- | ----------------------------------------- |
| Framework       | React 19 + TypeScript (strict)            |
| Build tool      | Vite                                      |
| Server state    | TanStack Query (React Query) v5           |
| Styling         | Tailwind CSS v4                           |
| Charts          | Recharts                                  |
| Routing         | React Router v7                           |
| Auth & database | Firebase Authentication + Cloud Firestore |
| Icons           | lucide-react                              |
| Market data     | Finnhub (quotes, search, company news)    |
| Exchange rates  | open.er-api.com                           |

## Architecture

TradeFlow separates **server state** from **application state**:

- **Server state** (live quotes, news, FX rates) is fetched and cached with **TanStack Query** — automatic refetching, deduping, and stale handling.
- **Application state** (auth, profile, currency, watchlist, portfolio, theme, toasts, dialogs) is provided through composable **React context providers**.
- **Persistence** uses **Cloud Firestore** with real-time `onSnapshot` listeners, so the UI reacts the moment data changes. Buy/sell operations use a `writeBatch` so cash and holdings always update together.
- **Security rules** scope every document to its owner, so a signed-in user can only ever read and write their own portfolio, watchlist, and profile.

## Getting started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project (Authentication + Firestore enabled)
- A free Finnhub API key

### Install & run

```bash
git clone https://github.com/rex-daworker/trading-app.git
cd trading-app
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Environment variables

Create a `.env.local` file in the project root (this file is git-ignored and must never be committed):

```bash
VITE_FINNHUB_KEY=your_finnhub_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### Firestore security rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /portfolios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /holdings/{symbol} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /watchlists/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Project structure

```
src/
├── api/          # Finnhub + FX fetchers and their response types
├── hooks/        # Data hooks (quotes, news) + UI hooks (count-up, price-flash, debounce)
├── context/      # Auth, Profile, Currency, Watchlist, Portfolio, Theme, Toast, Confirm
├── components/   # Layout, Sidebar, StockCard, charts, controls, watermark, skeletons
├── pages/        # Dashboard, Analytics, News, Settings, Account, AuthPage
├── lib/          # Firebase initialization
└── types/        # Shared TypeScript types
```

## Disclaimer

TradeFlow is a **paper-trading simulator built for education and portfolio purposes**. It uses live market data but involves no real money, brokerage, or transactions. Prices are provided by third-party APIs and may be delayed. Nothing here is financial advice.

## Roadmap

- Responsive / mobile layout
- Persisted transaction history
- Real historical price charts
- Automated tests (Vitest + React Testing Library)

---

<div align="center">
Built by <a href="https://github.com/rex-daworker">rex-daworker</a>
</div>
