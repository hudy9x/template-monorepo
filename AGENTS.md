**Purpose**
- Guidance for agent contributors working in this monorepo.

**Documentation**
- CRITICAL: When you need guidance on specific tasks, read the relevant documentation files from `docs/` folder on a need-to-know basis.
- Do NOT preemptively load all documentation - use lazy loading based on the actual task at hand.
- When loaded, treat documentation content as mandatory instructions.

**Available Documentation**
- Adding new apps to workspace: @docs/add-app-to-apps-folder.md
- Adding new packages to workspace: @docs/add-package-to-pacakges-folder.md
- Adding React Router to React app: @docs/how-to-add-router-to-react.md
- Authentication with Better Auth: @docs/authentication-with-better-auth.md
- Streaming with Readable Streams: @docs/streaming-with-readable-streams.md

**When to Read Documentation**
- Read @docs/add-app-to-apps-folder.md when:
  - User asks to create a new app in `apps/` folder
  - User wants to add a new frontend/backend application
  - User needs guidance on pnpm workspace app setup

- Read @docs/add-package-to-pacakges-folder.md when:
  - User asks to create a new shared package in `packages/` folder
  - User wants to create reusable utilities or libraries
  - User needs guidance on pnpm workspace package setup

- Read @docs/how-to-add-router-to-react.md when:
  - User asks to add routing to a React application
  - User wants to implement React Router
  - User needs guidance on React Router data mode setup

- Read @docs/authentication-with-better-auth.md when:
  - User asks to implement authentication
  - User wants to add login/signup functionality
  - User needs guidance on Better Auth with bearer tokens
  - User wants to create protected routes

- Read @docs/streaming-with-readable-streams.md when:
  - User asks to implement streaming (AI responses, logs, etc.)
  - User wants to stream data from backend to frontend
  - User needs guidance on Readable Streams vs WebSockets
  - User wants to implement Server-Sent Events (SSE)

**OpenCode Agent Configuration**
- This project has specialized agents configured in `.opencode/` folder
- Primary agent: `farmer` - Coordinates full-stack development
- Subagents: `@api` (backend), `@web` (frontend), `@database` (Prisma)
- See `.opencode/README.md` for agent usage and customization

**Build / Dev**
- Root dev all: `pnpm run dev:all`
- Start web dev: `pnpm --filter web dev` or `pnpm run dev:web`
- Start api dev: `pnpm --filter api dev` or `pnpm run dev:api`
- Build web: `pnpm --filter web build` or `pnpm run build:web`
- Build api: `pnpm --filter api build` or `pnpm run build:api`
- Prisma DB tasks: `pnpm --filter @local/database run db:migrate` etc.

**Port Configuration**
- API server runs on port `4001` (configured in `apps/api/src/index.ts`)
- Web dev server runs on port `2001` (configured in `apps/web/vite.config.ts`)
- Web app proxies `/api/*` requests to `http://localhost:4001`
  - Proxy config in `apps/web/vite.config.ts` under `server.proxy`
  - Requests to `/api/tests` are rewritten to `/tests` and forwarded to API server
  - The `rewrite` function removes the `/api` prefix before forwarding
- To change ports: update both the server port AND the proxy target in vite.config.ts
- To change CORS: update the origin in `apps/api/src/index.ts` CORS middleware
- To add more proxy rules: add additional entries in the `proxy` object with different path patterns

**Tests / Single test**
- No global test runner configured. Common patterns to run a single test if added:
- With workspace script: `pnpm --filter <pkg> test -- <matcher-or-path>`
- Vitest example: `pnpm --filter web test -- tests/my.spec.ts` or `-t "name"` for single test
- Jest example: `pnpm --filter <pkg> test -- -t "should do X"`

**Lint / Format**
- Web lint: `pnpm --filter web run lint` (runs `eslint .`).
- Prefer adding `prettier` and `format` script if formatting required.

**Code Style**
- Language: TypeScript for packages and apps; keep `"type":"module"`.
- Imports: use workspace package names (`@local/database`) for internal packages; use relative imports for same-package files.
- Formatting: follow Prettier defaults if present; otherwise keep 2-space indent and single blank line between top-level blocks.
- Types: prefer explicit types for public APIs; use `unknown` over `any`; enable strictness in `tsconfig` where possible.
- Naming: `camelCase` for functions/vars, `PascalCase` for React components and classes, `SCREAMING_SNAKE` only for constants.
- Errors: throw `Error` or typed error classes; avoid swallowing errors — log and rethrow or return `Result`-style objects.
- Tests: write small, focused tests; prefer deterministic behavior and avoid network/db in unit tests (use mocks).

**Rules files**
- No `.cursor` or Copilot instructions found; if added, include their path here (`.cursor/rules/`, `.github/copilot-instructions.md`).

**Done**
- Follow existing package scripts; ask before adding workspace-wide tooling changes.