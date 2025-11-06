# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables

All environment configuration lives in a single `.env` file (already git‑ignored). Populate it with:

```
GEMINI_API_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_AUTH_BYPASS=
```

Notes:

- Variables prefixed with `NEXT_PUBLIC_` are automatically exposed to the client by Next.js—no need to re‑declare them in `next.config.ts`.
- Keep `GEMINI_API_KEY` secret (not prefixed) so it's only available server-side.
- `NEXT_PUBLIC_AUTH_BYPASS` can be used for local development shortcuts; default to `false` in production.

After editing `.env`, restart the dev server so Next.js picks up changes.

You can obtain Firebase values from your project settings (Project Settings → General → Your Apps).
