# Pulse — real-time chat

Chat application frontend built for the Taghyeer frontend take-home assignment.

Direct and group conversations, live message delivery over Socket.io, cursor-paginated
history, and a phone-number login that doubles as registration.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — the defaults point at the hosted API
npm run dev
```

Open http://localhost:3000.

| Route    | Screen                                                      |
| -------- | ----------------------------------------------------------- |
| `/`      | Entry point — redirects to `/login` or `/chat`              |
| `/login` | Login — phone number + name (a new number registers itself) |
| `/chat`  | Conversation list, chat panel, groups, real-time updates    |

## Tech stack

| Concern      | Choice                                                      |
| ------------ | ----------------------------------------------------------- |
| Framework    | Next.js (App Router) · React                                |
| Language     | TypeScript (strict)                                         |
| Styling      | Tailwind CSS (CSS-first, tokens in `@theme`)                |
| Server state | TanStack Query                                              |
| Client state | Redux Toolkit                                               |
| Real-time    | `socket.io-client`                                          |
| Icons        | `react-icons` — Feather for UI, Phosphor for the brand mark |

## Documentation

| Document                                                               | What it covers                                                                                                                                                   |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/API_Documentation.md`](docs/API_Documentation.md)               | The Part 1 API documentation deliverable — endpoints, request/response shapes, error format, and the Socket.io contract. Written first, before any feature code. |
| [`docs/PROJECT_DOCUMENTATION.bn.md`](docs/PROJECT_DOCUMENTATION.bn.md) | Implementation walkthrough in Bangla — architecture, state split, API organisation, auth flow, and the trade-offs behind each decision.                          |

|               |                                                                                   |
| ------------- | --------------------------------------------------------------------------------- |
| REST base URL | `https://frontend-task-chatapp.onrender.com/api`                                  |
| Socket.io URL | `https://frontend-task-chatapp.onrender.com` (root)                               |
| Auth          | `Authorization: Bearer <token>` on every route except `/auth/login` and `/health` |

## Scripts

| Script              | Description                  |
| ------------------- | ---------------------------- |
| `npm run dev`       | Start the development server |
| `npm run build`     | Production build             |
| `npm run start`     | Serve the production build   |
| `npm run lint`      | Lint with ESLint             |
| `npm run lint:fix`  | Lint and auto-fix            |
| `npm run typecheck` | Type-check with `tsc`        |

## Structure

```
src/
├── app/         Routing layer only — routes and layouts, no business logic
├── features/    Business domains: auth, chat (api/ components/ hooks/ utils/ index.ts)
├── components/  Shared UI used by 2+ features (ui/ layout/ shared/)
├── providers/   Store, Query and Session providers mounted in the root layout
├── hooks/       Shared hooks (useSession, useDebouncedValue, useIsHydrated)
├── store/       Redux store, slices, typed hooks
├── lib/         Shared infrastructure (api/ auth/ utils/ constants/)
├── config/      env.ts, site.ts
├── styles/      globals.css, fonts.ts
└── types/       Global types
public/          Static assets
tests/           Mirrors src/
```

A feature owns its own `api/`, `components/`, `hooks/` and `utils/`, and exposes a single
public surface through its `index.ts`. Features never import each other — shared code is
promoted to `components/` or `lib/`, and the boundary is enforced by ESLint rather than
convention. Imports resolve through the single `@/*` alias.

### How state is split

**Server state belongs to TanStack Query, client state to Redux Toolkit.** Nothing that
comes from the API is copied into a slice.

- **TanStack Query** — conversations, message history (`useInfiniteQuery`, because the API
  is cursor-paged), user search, and the signed-in user from `/auth/me`. Query keys come
  from each feature's `api/` module; mutations write their result into the cache instead of
  invalidating whatever they can update by hand.
- **Redux Toolkit** — the JWT (`sessionSlice`, mirrored into `localStorage` by a listener
  middleware so reducers stay pure) and chat UI state (`chatSlice`: the open conversation,
  unread counts, socket connection status).

### How API calls are organised

All HTTP goes through `apiRequest` in `src/lib/api/client.ts`, which attaches the bearer
token itself, normalises the API's `{ error: { message, code } }` shape into an `ApiError`,
and turns network failures into the same error type. Paths live in
`src/lib/api/endpoints.ts`; components never build a URL or call `fetch`. A 401 anywhere is
handled once, by the cache-level error handlers in `QueryProvider`, which clear the session
and let the route gate redirect.

### Live-API quirks the client absorbs

These are real deviations from the published spec, each verified against the live API:

- `GET /conversations` wraps results in `{ data: [...] }`; direct chats carry a singular
  `participant`, groups carry `participants` + `admins`.
- `POST /conversations` returns only `{ _id, participants: string[] }`, so the direct-chat
  flow refetches the list before selecting the new conversation.
- Message history comes back **newest-first** and the `before` cursor is **inclusive**, so
  every page repeats its anchor message — pages are reversed and de-duped on read.
- The server accepts blank message text, so the composer blocks whitespace-only sends and
  the list filters blank messages back out.
- Socket payloads use `id` and epoch-millisecond `createdAt`; REST uses `_id` and ISO
  strings. `normalizeMessage` converts socket payloads at the boundary.
- The socket lives at the host root, **not** under the `/api` base used for REST.
- `GET /users/search` matches `name` as a **case-sensitive prefix** and `phone` by **exact
  equality**, and it interpolates the term into a server-side regex unescaped. A term
  containing `+` — i.e. any E.164 number — therefore fails with HTTP 500 `code: 51091`
  before the phone comparison ever runs, so numbers stored in the format the API's own
  Swagger example uses cannot be found at all. The client stops retrying that failure and
  translates it into a message the user can act on.
- Errors are `{ error: { message, code } }`, not `{ message }`.

## Environment

| Variable                   | Default                                          |
| -------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | `https://frontend-task-chatapp.onrender.com/api` |
| `NEXT_PUBLIC_SOCKET_URL`   | `https://frontend-task-chatapp.onrender.com`     |

Every variable is read through `src/config/env.ts` — never `process.env` directly — and
listed in `.env.example`. No secrets are involved: both URLs are public, and the JWT is
obtained at runtime through login.
