# Dispatch — cross-platform social post scheduler (MERN)

Write a post once, schedule it, and publish it to Instagram, Facebook, X, LinkedIn,
and Pinterest at the same time.

## Structure

```
project/
├── backend/     Node.js + Express + MongoDB API
└── frontend/    React (Vite) + Tailwind CSS
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env    # fill in MONGO_URI, JWT_SECRET, ENCRYPTION_KEY at minimum
npm run dev              # starts on http://localhost:5000
```

You need a running MongoDB instance — either local (`mongodb://127.0.0.1:27017/dispatch`)
or a free MongoDB Atlas cluster (recommended, since it's cloud-hosted).

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

The Vite dev server proxies `/api` requests to `http://localhost:5000`, so both
just need to be running at the same time — no CORS config needed locally.

## What's implemented

- JWT auth (register/login/me)
- No-code account connection: a user clicks Connect next to a platform, is sent
  to that platform's own login/consent screen, and returns already connected —
  no tokens, no code on their end (`backend/controllers/oauthController.js`)
- Post model with draft / scheduled / publishing / published / failed states
- A cron-based scheduler (`node-cron`) that checks every minute for posts whose
  `scheduledFor` time has arrived and publishes them automatically
- One adapter file per platform (`backend/services/platforms/*.js`) — each
  implements a single `publish(post, account)` function
- Media upload to Cloudinary, returning a public URL to attach to posts
- A React dashboard with status tabs (All / Scheduled / Published / Draft /
  Failed), each post deletable including scheduled ones, plus a composer,
  calendar view, and connected-accounts page

## How the "connect without coding" flow works

1. User clicks Connect next to a platform on `/accounts`.
2. Frontend redirects to `/api/social/connect/:platform?token=<jwt>`.
3. Backend verifies the JWT, builds a signed state param, and redirects to
   the platform's own OAuth consent screen.
4. User logs in and approves on the platform's own site.
5. Platform redirects to `/api/social/callback/:platform` with a code.
6. Backend exchanges the code for an access token, fetches the account's
   profile info, encrypts the token, and saves it.
7. User lands back on `/accounts` already connected.

## What you still need to do: register one developer app per platform

One-time setup for the whole app, not per user — same as Buffer or Hootsuite:

| Platform  | Where to register              | Notes |
|-----------|--------------------------------|-------|
| Instagram/Facebook | developers.facebook.com | Business/Creator IG account, linked FB Page, app review for public use |
| X         | developer.x.com                | Paid API tier required; uses PKCE |
| LinkedIn  | developer.linkedin.com         | Needs Marketing Developer Platform access for org posting |
| Pinterest | developers.pinterest.com       | Standard OAuth 2.0 |

Once you have each app's client ID/secret, add them to `backend/.env` — the
redirect URIs there must exactly match what you register in each platform's
developer dashboard.

## Security notes

- Access tokens are encrypted at rest with AES-256-GCM (`backend/utils/encrypt.js`)
  before being saved to MongoDB — set a real 32-character `ENCRYPTION_KEY` in `.env`.
- Passwords are hashed with bcrypt.
- Swap `JWT_SECRET` and `ENCRYPTION_KEY` for long random values before deploying.
