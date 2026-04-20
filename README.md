# Frisky Signal Intake

A React + Vite signal intake system for Frisky Developments with:

- Public signal submission (`/`)
- Public ticket status lookup (`/status`)
- Operator queue + detail workflow (`/console`, `/console/signal/:signalId`)
- Discord and Telegram notification hooks for new submissions

## Current Features

- Ticket generation in `FRK-####-X` format with duplicate retry logic
- Multi-step signal lifecycle:
  - `SIGNAL_RECEIVED`
  - `OPERATOR_ASSIGNED`
  - `IN_REVIEW`
  - `WAITING_ON_USER`
  - `RESOLUTION_COMPLETE`
- Operator tooling:
  - Search + filter by status/type
  - Signal detail view
  - Internal notes
  - Status update history + system log
  - CSV export
- Telegram WebApp user detection on intake (auto-prefills identity when available)
- Global React error boundary fallback

## Tech Stack

- TypeScript
- React 19 + React Router 7
- Vite 7
- Tailwind CSS 4
- `@github/spark` KV hooks for persisted app state
- Radix UI + custom components
- Framer Motion + Sonner

## Data & Configuration

State and settings are persisted through Spark KV keys:

- `signals`
- `discord-webhook-url`
- `telegram-bot-token`
- `telegram-chat-id`

Webhook setup details:

- Telegram: see [`TELEGRAM_SETUP.md`](./TELEGRAM_SETUP.md)

## Local Development

```bash
npm ci --legacy-peer-deps
npm run dev
```

Other scripts:

- `npm run build`
- `npm run lint`
- `npm run preview`

## Notes

- The operator console is available at `/console`; if deploying publicly, add access control appropriate for your environment.

## Known Development Notes

- `npm run lint` currently needs an `eslint.config.*` flat config to run under ESLint v10.

## License

[MIT](./LICENSE)
