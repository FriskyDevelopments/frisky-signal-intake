# Frisky Developments Signal Intake System

A premium signal intake and operator console system for managing client requests. This is a dual-interface system with a public intake portal and a protected operator console, designed with clear Frisky Developments branding and system-native terminology.

*🐾 Forged with a frisky paw and a daring heart.*

## Key Features

- **Public Signal Submission**: Anonymous form for submitting support/inquiry signals with structured fields.
- **Status Check Interface**: Public page where users enter their Ticket ID to view vertical progress timeline with system-style state labels.
- **Operator Console Dashboard**: Protected internal dashboard with dense signal queue, filtering, search, quick actions, and state management.
- **Signal Detail View**: Full signal information with system event log and internal notes interface.
- **Discord & Telegram Integrations**: Real-time webhook notifications alerting operators of new signal submissions.
- **Local / KV State Management**: Uses Spark KV storage for signal states and history logs.

## Brand Guidelines

This application adheres to strict brand identity terms. The following terms must be preserved exactly with their specific casing and spelling throughout the codebase:

- `STIX MΛGIC` (including the lambda symbol)
- `ClipsFlow`
- Tagline: `🐾 Forged with a frisky paw and a daring heart.`

## Getting Started

### Development

1. Install dependencies:
   `npm install`

2. Start the development server and check the console output for the local URL/port:
   `npm run dev`

### Building for Production

To build the application for production:

`npm run build`

## Configuration

To fully utilize the webhook alerting system, you must configure Discord and/or Telegram webhooks within the Operator Console:

1. Navigate to `/console` in the application.
2. Open the Settings modal.
3. Provide your Discord Webhook URL.
4. Provide your Telegram Bot Token and Chat ID.
5. Save settings.

*Note: Webhook failures do not block user submissions, but failures may be logged for debugging or monitoring purposes.*

## Technologies

- React 19
- TypeScript
- Vite
- Tailwind CSS v4 (with custom "Premium Dark" aesthetic configurations)
- Radix UI Primitives & Framer Motion
- React Router DOM
