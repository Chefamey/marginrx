# MarginRx Deployment

## Current App

MarginRx is a static app, so Vercel can deploy it directly from this repository.

## Vercel Settings

- Framework preset: Other
- Build command: leave blank
- Output directory: leave blank
- Install command: leave blank

## GitHub Flow

1. Create a GitHub repository named `marginrx`.
2. Push this folder to that repository.
3. In Vercel, choose Add New Project.
4. Import the `marginrx` GitHub repository.
5. Deploy with default static settings.

## Supabase Later

Supabase is not required for the current static pilot.

Use Supabase in V1 for:

- restaurant accounts
- outlet records
- saved audits
- uploaded payout files
- vendor bill lines
- recipe ingredient costing
- monthly report history

Add environment variables from `.env.example` only when the app starts using Supabase.
