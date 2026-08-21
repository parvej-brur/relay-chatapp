# frontend-task-chatapp

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Script          | Description                     |
| --------------- | ------------------------------- |
| `npm run dev`   | Start the development server    |
| `npm run build` | Production build                |
| `npm run start` | Serve the production build      |
| `npm run lint`  | Lint with ESLint                |

## Structure

```
app/         Routes, layouts, global styles
components/  UI components (ui / layout / home)
hooks/       React hooks
lib/         Utilities and shared logic
types/       Shared TypeScript types
public/      Static assets
```

Imports resolve from the project root via the `@/*` alias, e.g. `import { Button } from "@/components/ui/button"`.
