# Template Monorepo

A modern monorepo template using **pnpm workspaces** for efficient package management and code sharing.

## 📦 Project Structure

This monorepo contains the following packages:

```
template-monorepo/
├── apps/
│   ├── api/          # Hono.js API server
│   └── web/          # React web application
└── packages/
    └── database/     # Prisma database package
```

## 🛠️ Tech Stack

- **Package Manager**: [pnpm](https://pnpm.io/) with workspaces
- **API Server**: [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Web App**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing**: [React Router](https://reactrouter.com/) - Declarative routing for React
- **Database**: [Prisma](https://www.prisma.io/) - Next-generation ORM

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v10.10.0 or higher)

Install pnpm globally if you haven't already:

```bash
npm install -g pnpm
```

### Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd template-monorepo
pnpm install
```

## 🏃 Running the Applications

### Start API Server

```bash
pnpm dev:api
```

The API server will start on `http://localhost:3000` (or the port specified in your configuration).

### Start Web Application

```bash
pnpm dev:web
```

The web application will start on `http://localhost:5173` (default Vite port).

### Start Both Applications

Run both the API and web app concurrently:

```bash
pnpm dev:all
```

## 🏗️ Building for Production

### Build API

```bash
pnpm build:api
```

### Build Web App

```bash
pnpm build:web
```

### Build All

```bash
pnpm build:all
```

## 📚 Prisma Database Setup

This monorepo uses Prisma in a pnpm workspace configuration. The `@local/database` package contains the Prisma schema and client.

### Setting up Prisma in a Monorepo

For detailed instructions on using Prisma with pnpm workspaces, refer to the official guide:

👉 **[Use Prisma in pnpm Workspaces](https://www.prisma.io/docs/guides/use-prisma-in-pnpm-workspaces)**

### Common Prisma Commands

Navigate to the database package to run Prisma commands:

```bash
cd packages/database

# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Open Prisma Studio
pnpm prisma studio

# Seed the database
pnpm prisma db seed
```

## 📁 Package Details

### `apps/api`

Hono.js-based API server with TypeScript support. Features:
- Fast and lightweight
- Built-in TypeScript support
- Hot reload during development with `tsx watch`

### `apps/web`

React application built with Vite. Features:
- Fast development with HMR
- TypeScript support
- Modern React 19
- React Router for client-side routing

#### Routing Structure

The web app uses React Router with the following structure:

```
src/
├── routes.ts              # Router configuration
├── pages/
│   ├── Root.tsx          # Layout component with navigation
│   ├── Home.tsx          # Home page (/)
│   ├── About.tsx         # About page (/about)
│   └── NotFound.tsx      # 404 page
└── main.tsx              # App entry point
```

Available routes:
- `/` - Home page
- `/about` - About page
- `/*` - 404 Not Found (catch-all)

### `packages/database`

Shared Prisma database package. Features:
- Centralized database schema
- Shared Prisma client
- Type-safe database queries

## 🔗 Workspace Dependencies

The API and web applications can import the database package using:

```typescript
import { prisma } from '@local/database';
```

This allows for seamless code sharing across the monorepo.

## 📝 License

ISC

---

**Happy coding! 🎉**
