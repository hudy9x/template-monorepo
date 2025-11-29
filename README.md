# Template Monorepo

A modern monorepo template using **pnpm workspaces** for efficient package management and code sharing.

## 📋 Table of Contents

- [📦 Project Structure](#-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables Setup](#environment-variables-setup)
- [🏃 Running the Applications](#-running-the-applications)
  - [Port Configuration](#port-configuration)
  - [API Proxy Configuration](#api-proxy-configuration)
- [🏗️ Building for Production](#️-building-for-production)
- [📚 Prisma Database Setup](#-prisma-database-setup)
- [📁 Package Details](#-package-details)
- [🌊 Streaming with Readable Streams](#-streaming-with-readable-streams)
- [🎨 UI Components with shadcn/ui](#-ui-components-with-shadcnui)
- [🔐 Authentication with Better Auth](#-authentication-with-better-auth)
- [🔗 Workspace Dependencies](#-workspace-dependencies)
- [📝 License](#-license)

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

### Environment Variables Setup

This monorepo uses **individual `.env` files** for each app and package that requires environment-specific configuration. **Do not create a `.env` file in the root directory.**

#### Creating `.env` Files

Each application and package should have its own `.env` file:

```
template-monorepo/
├── apps/
│   ├── api/.env          # API server environment variables
│   └── web/.env          # Web app environment variables
└── packages/
    └── database/.env     # Database connection and Prisma configuration
```

#### Example Configurations

**`apps/api/.env`:**

```env
# API Server Configuration
PORT=3005
NODE_ENV=development

# Database (if needed directly in API)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

**`apps/web/.env`:**

```env
# Vite requires VITE_ prefix for client-side variables
VITE_API_URL=http://localhost:3005
VITE_APP_NAME="My App"
```

**`packages/database/.env`:**

```env
# Prisma Database Connection
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Prisma Accelerate (if using)
# DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=your_api_key"
```

> [!IMPORTANT]
> - Each `.env` file should be added to `.gitignore` to prevent committing sensitive data
> - Create `.env.example` files in each directory as templates for other developers
> - For Vite (web app), only variables prefixed with `VITE_` are exposed to the client

> [!TIP]
> After creating your `.env` files, restart your development servers to ensure the new environment variables are loaded.

## 🏃 Running the Applications

### Start API Server

```bash
pnpm dev:api
```

The API server will start on `http://localhost:3005`.

### Start Web Application

```bash
pnpm dev:web
```

The web application will start on `http://localhost:3000`.

### Start Both Applications

Run both the API and web app concurrently:

```bash
pnpm dev:all
```

### Port Configuration

The default ports are:
- **API Server**: `3005` (configured in `apps/api/src/index.ts`)
- **Web Application**: `3000` (configured in `apps/web/vite.config.ts`)

> [!NOTE]
> If you change the API port, make sure to update the proxy target in `vite.config.ts` and the CORS origin in `apps/api/src/index.ts`.

### API Proxy Configuration

The web application uses Vite's proxy to forward `/api/*` requests to the backend server, avoiding CORS issues during development.

**Example:** Request to `/api/tests` → forwarded to → `http://localhost:3005/tests`

**Configuration in `apps/web/vite.config.ts`:**

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3005',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

**Usage in frontend:**
```typescript
const response = await fetch('/api/tests');
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

## 🌊 Streaming with Readable Streams

This monorepo uses **Readable Streams** for streaming data from backend to frontend. Readable Streams are simpler than WebSockets for one-way data flow and work over standard HTTP/HTTPS.

**Use cases:**
- AI/LLM responses
- Large file downloads
- Real-time logs
- Progress updates

📖 **[Read the full Streaming Guide →](./docs/streaming-with-readable-streams.md)**

## 🎨 UI Components with shadcn/ui

This monorepo recommends using [shadcn/ui](https://ui.shadcn.com/) for building beautiful, accessible UI components.

### What is shadcn/ui?

shadcn/ui is **not a component library**. It's a collection of re-usable components that you can copy and paste into your apps. Built on top of:
- **Radix UI** - Unstyled, accessible components
- **Tailwind CSS** - Utility-first CSS framework

### Installation

**1. Install Tailwind CSS** (if not already installed)

```bash
cd apps/web
pnpm add -D tailwindcss postcss autoprefixer
pnpm dlx tailwindcss init -p
```

**2. Configure Tailwind**

Edit `apps/web/tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**3. Add Tailwind directives**

Edit `apps/web/src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**4. Initialize shadcn/ui**

```bash
cd apps/web
pnpm dlx shadcn@latest init
```

Follow the prompts:
- **TypeScript**: Yes
- **Style**: Default (or your preference)
- **Base color**: Slate (or your preference)
- **CSS variables**: Yes
- **Components location**: `./src/components`
- **Utils location**: `./src/lib/utils`

### Adding Components

Add components as needed:

```bash
cd apps/web

# Add a button component
pnpm dlx shadcn@latest add button

# Add a card component
pnpm dlx shadcn@latest add card

# Add a form component
pnpm dlx shadcn@latest add form

# Add multiple components at once
pnpm dlx shadcn@latest add button card dialog dropdown-menu
```

### Using Components

```typescript
// apps/web/src/pages/Example.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Example() {
  return (
    <div className="p-8">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>This is a shadcn/ui card</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => alert('Hello!')}>
            Click me
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Path Alias Configuration

Ensure `@` alias is configured in `apps/web/tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

And in `apps/web/vite.config.ts`:

```typescript
import path from "path";
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

> [!TIP]
> Browse all available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

## 🔐 Authentication with Better Auth

This monorepo uses [Better Auth](https://www.better-auth.com/) with **bearer token authentication** for API security. Bearer tokens are stateless, mobile-friendly, and perfect for API-first applications.

**Key features:**
- Email/password authentication
- Social OAuth providers (GitHub, Google, etc.)
- Type-safe with full TypeScript support
- Multiple authentication strategies

📖 **[Read the full Authentication Guide →](./docs/authentication-with-better-auth.md)**

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
