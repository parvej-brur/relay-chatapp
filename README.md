# Relay

Relay is a real time chat application built with Next.js and the App Router. It handles direct
and group conversations, live message delivery over Socket.IO, cursor paginated history, and a
phone number sign in that also covers first time registration. The frontend consumes a provided
REST and Socket.IO backend, and a large part of the work went into absorbing the quirks of that
live API cleanly at the client boundary.

The project started as a frontend take home assessment for Taghyeer. It is kept here as a
portfolio piece that shows a feature folder architecture with an enforced dependency boundary, a
clear split between server and client state, and a careful approach to an API whose behaviour did
not always match its documentation.

<p>
  <img alt="Next.js 16"      src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white">
  <img alt="React 19"        src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white">
  <img alt="TypeScript"      src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS 4"  src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="TanStack Query"  src="https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white">
  <img alt="Redux Toolkit"   src="https://img.shields.io/badge/Redux_Toolkit-2-764ABC?logo=redux&logoColor=white">
  <img alt="Socket.IO"       src="https://img.shields.io/badge/Socket.IO-4-010101?logo=socketdotio&logoColor=white">
</p>

## Live demo

| Host | Landing page | Chat app |
| :--- | :--- | :--- |
| Netlify | [relay-chatapp.netlify.app](https://relay-chatapp.netlify.app/) | [relay-chatapp.netlify.app/chat](https://relay-chatapp.netlify.app/chat) |
| Vercel (mirror) | [frontend-task-chatapp-seven.vercel.app](https://frontend-task-chatapp-seven.vercel.app/) | [/chat](https://frontend-task-chatapp-seven.vercel.app/chat) |

The chat app sits behind login. Sign in with any phone number and a display name. A number that
has not been seen before is registered automatically.

## Preview

![Relay walkthrough](docs/media/preview.gif)

▶️ [Full quality walkthrough (MP4)](https://github.com/parvej-brur/frontend-task-chatapp/raw/main/docs/media/preview.mp4)

## What this project demonstrates

- **Real time data flow.** Socket events write straight into the TanStack Query cache instead of
  triggering a refetch, so new messages and conversation updates land without a round trip.
- **A strict state boundary.** Everything that comes from the API lives in TanStack Query. Only
  the JWT and a small amount of chat UI state live in Redux Toolkit. Nothing is copied between
  the two.
- **Feature folders with a real boundary.** The rule that `app` depends on `features`, `features`
  depend on shared code, and no feature imports another feature is enforced by ESLint, not by
  convention.
- **Defensive API integration.** Response shape mismatches, an inclusive pagination cursor, a
  case sensitive search, and a server error on phone number lookups are each handled at one
  boundary with normalizers and retry policies.
- **One HTTP path.** Every request goes through a single client that attaches the token,
  normalizes the error shape, and turns network failures into the same error type. Components
  never build a URL or call `fetch`.
- **No unnecessary libraries.** Landing page motion is a small set of CSS keyframes driven by an
  `IntersectionObserver`, not an animation dependency.

## Tech stack

| Concern      | Choice                                          |
| ------------ | ---------------------------------------------- |
| Framework    | Next.js 16 (App Router), React 19              |
| Language     | TypeScript, strict mode                        |
| Styling      | Tailwind CSS 4, tokens defined in `@theme`     |
| Server state | TanStack Query                                 |
| Client state | Redux Toolkit                                  |
| Real time    | `socket.io-client`                             |
| Icons        | `react-icons`                                  |
| Hosting      | Netlify (primary), Vercel (mirror)            |

## Features

- Direct and group conversations
- Live message delivery over WebSocket with no refresh
- Group member and admin management
- User search by name or phone number
- Phone number sign in that registers new numbers automatically
- Cursor paginated message history, with duplicate pages removed on read
- Auto scroll that follows new messages but yields while you read older ones

## Getting started

```bash
npm install
cp .env.example .env.local   # optional, the defaults already point at the hosted API
npm run dev
```

Open http://localhost:3000.

| Route    | Screen                                                             |
| -------- | ---------------------------------------------------------------- |
| `/`      | Public landing page with product copy and links into the app     |
| `/login` | Phone number and display name, a new number registers itself     |
| `/chat`  | Conversation list, chat panel, groups, real time updates         |

## Scripts

| Script              | Description                  |
| ------------------- | --------------------------- |
| `npm run dev`       | Start the development server |
| `npm run build`     | Production build             |
| `npm run start`     | Serve the production build   |
| `npm run lint`      | Lint with ESLint             |
| `npm run lint:fix`  | Lint and auto fix            |
| `npm run typecheck` | Type check with `tsc`        |

## Environment

| Variable                   | Default                                          |
| -------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | `https://frontend-task-chatapp.onrender.com/api` |
| `NEXT_PUBLIC_SOCKET_URL`   | `https://frontend-task-chatapp.onrender.com`   |

Every variable is read through `src/config/env.ts` rather than `process.env` directly, and each
one is listed in `.env.example`. No secrets are involved. Both URLs are public and the JWT is
obtained at runtime through login.

## Project structure

```
src/
  app/         Routing layer only. Routes and layouts, no business logic
  features/    Business domains: auth, chat, landing (api, components, hooks, utils, index.ts)
  components/  Shared UI used by two or more features (ui, layout, shared)
  providers/   Store, Query and Session providers mounted in the root layout
  hooks/       Shared hooks (useSession, useDebouncedValue, useIsHydrated)
  store/       Redux store, slices, typed hooks
  lib/         Shared infrastructure (api, auth, utils, constants)
  config/      env.ts, site.ts
  styles/      globals.css, fonts.ts
  types/       Global types
public/          Static assets
tests/           Mirrors src/
```

A feature owns its own `api`, `components`, `hooks` and `utils`, and exposes a single public
surface through its `index.ts`. Features never import each other. Shared code is promoted to
`components/` or `lib/`, and the boundary is checked by ESLint rather than left to discipline.
Imports resolve through the single `@/*` alias.

### How state is split

Server state belongs to TanStack Query, client state to Redux Toolkit. Nothing that comes from
the API is copied into a slice.

- **TanStack Query** owns conversations, message history (`useInfiniteQuery`, because the API is
  cursor paged), user search, and the signed in user from `/auth/me`. Query keys come from each
  feature's `api/` module. Mutations write their result into the cache instead of invalidating
  whatever they could have updated by hand.
- **Redux Toolkit** owns the JWT (`sessionSlice`, mirrored into `localStorage` by a listener
  middleware so reducers stay pure) and chat UI state (`chatSlice`: the open conversation,
  unread counts, socket connection status).

### How API calls are organised

All HTTP goes through `apiRequest` in `src/lib/api/client.ts`. It attaches the bearer token,
normalizes the API's `{ error: { message, code } }` shape into an `ApiError`, and turns network
failures into that same error type. Paths live in `src/lib/api/endpoints.ts`, so components
never build a URL or call `fetch`. A 401 anywhere is handled once, by the cache level error
handlers in `QueryProvider`, which clear the session and let the route gate redirect.

## Working with the live API

These are real deviations from the published spec, each verified against the running API and
absorbed at the client boundary rather than worked around by changing what the UI asks for.

- `GET /conversations` wraps its results in `{ data: [...] }`. Direct chats carry a singular
  `participant`, groups carry `participants` plus `admins`.
- `POST /conversations` returns only `{ _id, participants: string[] }`, so the direct chat flow
  refetches the list before selecting the new conversation.
- Message history comes back newest first and the `before` cursor is inclusive, so every page
  repeats its anchor message. Pages are reversed and their duplicates removed on read.
- The server accepts blank message text, so the composer blocks whitespace only sends and the
  list filters blank messages back out.
- Socket payloads use `id` and epoch millisecond `createdAt`, while REST uses `_id` and ISO
  strings. `normalizeMessage` converts socket payloads at the boundary.
- The socket connects at the host root, not under the `/api` base used for REST.
- `GET /users/search` matches `name` as a case sensitive prefix and `phone` by exact equality,
  and it interpolates the term into a server side regex without escaping it. A term containing a
  plus sign, meaning any E.164 number, fails with HTTP 500 before the phone comparison runs. The
  client stops retrying that failure and turns it into a message the user can act on.
- Error bodies are `{ error: { message, code } }`, not `{ message }`.

## Documentation

| Document | What it covers |
| :--- | :--- |
| [`docs/API_Documentation.md`](docs/API_Documentation.md) | The API reference, written before any feature code: REST endpoints, request and response shapes, the error format, and the Socket.IO event contract. |

## Notable decisions

- **App Router without a server session.** The backend is a bearer token API with no server
  session, so the JWT lives in `localStorage` and every screen is a client component. The App
  Router still earns its place through route group gating, where `(auth)` and `(protected)`
  layouts redirect once instead of every page guarding itself. The cost is an `AuthGate` that
  holds the gate closed until `useIsHydrated` confirms the client has caught up with
  `localStorage`.
- **TanStack Query over a fetch layer written by hand.** The deciding factor was the socket
  layer. `message:new` and `conversation:updated` need to write into an existing cache entry
  rather than trigger a refetch, and history is cursor paged with an inclusive cursor whose
  repeated rows need filtering. `useInfiniteQuery` with `setQueryData` covers both without
  reimplementing request de duplication and cache invalidation from scratch.
- **Redux Toolkit for exactly two slices.** `session` needs a listener middleware to mirror the
  token into `localStorage` without impure reducers. `chat` is read by components that do not
  share a subtree, such as the nav badge, the chat panel, and the socket hook. Keeping this in
  Redux makes the server state and client state boundary something ESLint can check.
- **Tailwind 4, CSS first.** Design tokens live in `@theme` inside `globals.css` instead of a
  separate config file, so there is one less place to keep in sync. The landing page reuses the
  same tokens as the app so the two read as one product.
- **A mocked chat preview on the landing page.** `ChatPreviewMock.tsx` reuses the real
  component's visual language but is a standalone static component. Wiring the authenticated
  `ChatPanel` through a fake session and fixture data was disproportionate for a first
  impression.

## Possible next steps

- **Automated tests.** `tests/` mirrors `src/` by convention but is currently empty. The message
  list, the `useMessages` pagination and duplicate filtering, and the socket cache writers are
  the highest value things to cover first.
- **Optimistic sends with retry.** A message currently either lands or shows an error. Queuing a
  failed send for retry with a visible state would read better on a flaky connection.
- **Message search.** There is no way to search within a conversation yet, which starts to
  matter once a chat has real history.
- **Read receipts.** You know a message sent, not whether it was delivered or seen.

## A note on tooling

I designed the architecture and the system flows myself. I used Claude to generate boilerplate,
scaffold feature folders, and move faster through repetitive work such as API integration, state
wiring, and this documentation. I reviewed and controlled the implementation, handled the API
edge cases, kept comments minimal, and managed Git history by hand.
