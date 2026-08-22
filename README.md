# Pulse -- real-time chat

Chat application frontend built for the Taghyeer frontend take-home assignment.

Direct and group conversations, live message delivery over Socket.io, cursor-paginated
history, and a phone-number login that doubles as registration.

### Live demo

| Host | Landing page | Chat app |
| --- | --- | --- |
| Netlify | [frontend-task-chatapp.netlify.app](https://frontend-task-chatapp.netlify.app/) | [/chat](https://frontend-task-chatapp.netlify.app/chat) |
| Vercel | [frontend-task-chatapp-seven.vercel.app](https://frontend-task-chatapp-seven.vercel.app/) | [/chat](https://frontend-task-chatapp-seven.vercel.app/chat) |

The chat app is behind login -- use any phone number to sign in, a new number registers
itself automatically.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional -- the defaults point at the hosted API
npm run dev
```

Open http://localhost:3000.

| Route    | Screen                                                      |
| -------- | ----------------------------------------------------------- |
| `/`      | Public landing page -- marketing copy, links to `/chat`      |
| `/login` | Login -- phone number + name (a new number registers itself) |
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
| Icons        | `react-icons` -- Feather for UI, Phosphor for the brand mark |

## Documentation

| Document                                                 | What it covers                                                                                                                                                   |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`docs/API_Documentation.md`](docs/API_Documentation.md) | The Part 1 API documentation deliverable -- endpoints, request/response shapes, error format, and the Socket.io contract. Written first, before any feature code. |

The Part 3 write-up lives further down in this README, under "Part 3 -- Thought process."

## API at a glance

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
├── app/         Routing layer only -- routes and layouts, no business logic
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
public surface through its `index.ts`. Features never import each other -- shared code is
promoted to `components/` or `lib/`, and the boundary is enforced by ESLint rather than
convention. Imports resolve through the single `@/*` alias.

### How state is split

**Server state belongs to TanStack Query, client state to Redux Toolkit.** Nothing that
comes from the API is copied into a slice.

- **TanStack Query** -- conversations, message history (`useInfiniteQuery`, because the API
  is cursor-paged), user search, and the signed-in user from `/auth/me`. Query keys come
  from each feature's `api/` module; mutations write their result into the cache instead of
  invalidating whatever they can update by hand.
- **Redux Toolkit** -- the JWT (`sessionSlice`, mirrored into `localStorage` by a listener
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
  every page repeats its anchor message -- pages are reversed and de-duped on read.
- The server accepts blank message text, so the composer blocks whitespace-only sends and
  the list filters blank messages back out.
- Socket payloads use `id` and epoch-millisecond `createdAt`; REST uses `_id` and ISO
  strings. `normalizeMessage` converts socket payloads at the boundary.
- The socket lives at the host root, **not** under the `/api` base used for REST.
- `GET /users/search` matches `name` as a **case-sensitive prefix** and `phone` by **exact
  equality**, and it interpolates the term into a server-side regex unescaped. A term
  containing `+` -- i.e. any E.164 number -- therefore fails with HTTP 500 `code: 51091`
  before the phone comparison ever runs, so numbers stored in the format the API's own
  Swagger example uses cannot be found at all. The client stops retrying that failure and
  translates it into a message the user can act on.
- Errors are `{ error: { message, code } }`, not `{ message }`.

## Environment

| Variable                   | Default                                          |
| -------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_API_BASE_URL` | `https://frontend-task-chatapp.onrender.com/api` |
| `NEXT_PUBLIC_SOCKET_URL`   | `https://frontend-task-chatapp.onrender.com`     |

Every variable is read through `src/config/env.ts` -- never `process.env` directly -- and
listed in `.env.example`. No secrets are involved: both URLs are public, and the JWT is
obtained at runtime through login.

## Part 3 -- Thought process

### Part 1: why this architecture

The stack is React/Next.js as required, with everything else chosen for the shape of this
specific problem rather than habit:

- **Next.js App Router, but no server session.** The API is a bearer-token API with no
  concept of a server session -- the JWT lives in `localStorage`. That makes every
  screen a client component; App Router earns its place here for route-group gating
  (`(auth)`/`(protected)` layouts redirect once, instead of every page guarding itself) and
  file-system routing, not for RSC data fetching. The trade-off is real: no SSR/streaming
  benefit for a chat screen that's entirely client state anyway, and `AuthGate` has to
  hold the gate closed until `useIsHydrated` confirms the client has caught up with
  `localStorage`. Adding a cookie-based BFF session would remove that hydration gap but was
  out of scope for the API given.
- **TanStack Query over hand-rolled `fetch`+`useState` or SWR.** The deciding factor was
  the socket layer: `message:new` and `conversation:updated` need to write straight into an
  existing cache entry (`utils/chatCache.ts`) rather than trigger a refetch, and message
  history is cursor-paginated with an inclusive cursor that needs de-duping on read.
  `useInfiniteQuery` plus `setQueryData` covers both cleanly; SWR's mutate API is less
  suited to targeted cache surgery, and hand-rolled state would have re-implemented
  request de-duping and cache invalidation from scratch.
- **Redux Toolkit for exactly two slices.** `session` (the JWT + hydration flag) needs a
  listener middleware to mirror the token into `localStorage` without impure reducers, and
  `chat` (`activeConversationId`, `unreadCounts`, `socketConnected`) is read by components
  that don't share a subtree (nav badge, chat panel, the socket hook). Context would have
  meant prop-drilling or broad re-renders for that. The trade-off is bringing in a state
  library for only two small slices -- justified here by keeping the server-state/client-state
  boundary (Query vs. Redux) enforceable rather than a convention nobody checks.
- **Tailwind v4, CSS-first.** Tokens live in `@theme` inside `globals.css` instead of a
  separate config file -- one less place to keep in sync.
- **Feature folders with an ESLint-enforced dependency law.** `app → features → components/lib`
  and no feature importing another feature are real ESLint rules reading `src/features/` at
  lint time, not a README convention -- the trade-off is more upfront lint config for a
  boundary that would otherwise erode the first time two features needed to talk to each
  other under deadline pressure.

### Part 2: reasoning behind the landing page

The landing page had to sell what was actually built, not a generic template, so:

- **Same design tokens as the app, not a separate palette.** The landing page reuses the
  chat app's `@theme` tokens (`brand` = `#6c5ce7`, Plus Jakarta Sans) instead of a punchier,
  unrelated marketing look -- the goal was "this is the app," not "this is an ad for the
  app." `landing/` deliberately has no `api/`, `hooks/`, or `store/` (see `CLAUDE.md`): it's
  static copy and links, and its feature bullets were scoped down to match what actually
  ships (real-time messages, group admins, name/phone search, sticky-but-interruptible
  auto-scroll, paginated history) rather than describing features that don't exist.
- **A mocked chat preview, not the real `ChatPanel`.** `ChatPreviewMock.tsx` reuses the real
  component's visual language (bubble radii, avatar, timestamps) but is a standalone,
  static component with hardcoded messages. Embedding the authenticated `ChatPanel` would
  have needed a fake session and fixture data wired through the real query/socket stack --
  disproportionate for a component whose job is a first impression, not a demo.
- **No animation library.** Motion (`ScrollReveal`'s `IntersectionObserver` + CSS
  transition, and the `fade-in-up` / `float` / `pulse-dot` keyframes in `globals.css`) is
  hand-rolled instead of pulling in Framer Motion or similar. It's less expressive than a
  physics-based animation library, but it's a handful of CSS keyframes for a page that has
  no other JS-driven interaction -- adding a whole animation dependency for three effects
  didn't pay for itself.
- **Mobile-first, same breakpoint discipline as the product.** The nav, hero and feature
  grid collapse at the same `md`/`lg` breakpoints documented for the chat screens, so the
  two don't feel like different products at different widths.

### How AI tools were used

I designed the architecture and system flows myself. I used **Claude** to generate
boilerplate, scaffold feature folders, and speed up repetitive tasks, including API
integration, state management, socket wiring, and this documentation. I reviewed and
controlled the implementation, handled the API edge cases, kept comments minimal, and
managed Git commits manually.

### What I'd improve with more time

- **Automated tests.** `tests/` mirrors `src/` per the folder convention but is currently
  empty -- the message list, `useMessages` pagination/de-dupe logic, and the socket cache
  writers are the highest-value things to cover first.
- **Optimistic sends with retry.** A message currently either lands or shows an error;
  queuing a failed send for retry (with a visible "failed, tap to retry" state) would read
  better on a flaky connection.
- **Message search.** No way to search within a conversation right now -- would matter once
  a chat has real history.
- **Read receipts.** You know a message sent, not whether it was delivered or seen -- that's
  usually the next thing people ask for in a chat app.

### Issues I ran into with the given API

Full detail is under "Live-API quirks the client absorbs" above; the short version, each
handled at the client boundary (normalizers, retry policies, cache de-dupe) rather than
worked around by changing what the UI asks for:

- The `/conversations` response shape is inconsistent between direct and group chats.
- Message history is newest-first with an inclusive cursor, so pages repeat their anchor.
- The server accepts blank message text.
- Socket and REST payloads disagree on field names and timestamp format.
- Error bodies are nested (`{ error: { message, code } }`), not flat.
- `GET /users/search` crashes with a 500 on any search term containing `+`, because the
  term is interpolated unescaped into a server-side regex -- so phone numbers in the exact
  E.164 format the API's own docs use can't be searched at all.
- **No delete endpoints.** There's no `DELETE /messages/{id}` and no
  `DELETE /conversations/{id}` -- the only `DELETE` in the whole spec is
  `DELETE /conversations/{id}/participants/{userId}`, which removes a group member rather
  than deleting any content. Deleting a message or a conversation wasn't in the required
  feature list, so I left it unbuilt rather than fake it against an endpoint that doesn't
  exist. If I were designing the API myself I'd add a sender-only, soft-deleting
  `DELETE /messages/{id}` and a `DELETE /conversations/{id}` that leaves the conversation
  for the current user.
