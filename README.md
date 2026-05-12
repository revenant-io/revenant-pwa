# revenant-pwa

Progressive Web App for Revenant — personal and shared expense tracking. Built with Next.js 16 + React 19 + Tailwind v4.

## Stack

- **Next.js 16.2.4** (App Router) · **React 19** · **TypeScript**
- **Tailwind v4** — CSS-first config via `@theme` in `app/globals.css`
- **Dexie** (IndexedDB) — offline storage
- **Service Worker** (`public/sw.js`) — asset caching

## Commands

```bash
npm install       # install deps
npm run dev       # dev server → http://localhost:3000
npm run build     # production build
npm run lint      # eslint
```

## Pages

| Route | Description |
|---|---|
| `/login` | Email + password login |
| `/expenses` | Personal and shared expense tabs |
| `/expenses/new` | Create expense with optional participant sharing |
| `/debug` | PWA install status, network status, iOS guide |
| `/notifications` | Push notification test |

## Key Architecture Notes

**Auth:** JWT stored in an HttpOnly cookie (`token`) set by the Next.js API route `/api/auth/login`. Never accessible to client JS. A non-HttpOnly `user_info` cookie carries display data only.

**API proxy:** All backend calls go through `app/api/` server-side routes that read the `token` cookie and forward it to the backend. Use `BACKEND_URL` env var (not `NEXT_PUBLIC_*`) — it's runtime-only and safe inside Docker.

**Route guard:** `proxy.ts` (Next.js 16's name for `middleware.ts`) protects `/expenses/*` and redirects to `/login` if no token cookie.

**Chat widget:** Floating button → SSE stream to `/api/chat/[session_id]` → Next.js proxy forwards to chatbot with token injected server-side.

**SSR safety:** Pages using browser APIs (`navigator`, `window`) must have `export const dynamic = 'force-dynamic'` to prevent SSR prerendering crashes.

## Environment Variables

| Variable | Description |
|---|---|
| `BACKEND_URL` | Backend base URL (runtime, server-only). Default: `http://localhost:8080` |
| `CHATBOT_URL` | Chatbot base URL (runtime, server-only). Default: `http://localhost:8000` |
