# frontend-task-chatapp

Chat application frontend built with Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

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
├── app/         Routing layer only — routes, layouts, API handlers
├── features/    Business domains (api/ actions.ts components/ hooks/ schemas/ store/ utils/ index.ts)
├── components/  Shared UI used by 2+ features (ui/ layout/ forms/ shared/)
├── providers/   Context providers mounted in the root layout
├── hooks/       Shared hooks
├── store/       Root store, hooks, StoreProvider
├── lib/         Shared infrastructure (api/ auth/ utils/ constants/)
├── config/      env.ts, site.ts, navigation.ts
├── styles/      globals.css, fonts.ts
└── types/       Global types
public/          Static assets (images/ icons/ fonts/ videos/)
tests/           Mirrors src/
```

Project name and public-facing details live in [`src/config/site.ts`](src/config/site.ts).
See [AGENTS.md](AGENTS.md) for the full architecture blueprint and naming rules.

Imports resolve through the single `@/*` alias, e.g. `import { SITE } from "@/config/site"`.
