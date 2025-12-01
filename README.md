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
PORT=4001
NODE_ENV=development

# Database (if needed directly in API)
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

**`apps/web/.env`:**

```env
# Web Server Configuration
PORT=2001

# Vite requires VITE_ prefix for client-side variables
VITE_API_URL=http://localhost:4001
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

The API server will start on `http://localhost:4001`.

### Start Web Application

```bash
pnpm dev:web
```

The web application will start on `http://localhost:2001`.

### Start Both Applications

Run both the API and web app concurrently:

```bash
pnpm dev:all
```

### Port Configuration

The default ports are:
- **API Server**: `4001` (configured in `apps/api/src/index.ts` or via `PORT` env variable)
- **Web Application**: `2001` (configured in `apps/web/vite.config.ts` or via `PORT` env variable)

> [!NOTE]
> If you change the API port, make sure to update the proxy target in `vite.config.ts` and the CORS origin in `apps/api/src/index.ts`.

### API Proxy Configuration

The web application uses Vite's proxy to forward `/api/*` requests to the backend server, avoiding CORS issues during development.

**Example:** Request to `/api/tests` → forwarded to → `http://localhost:4001/api/tests`

**Configuration in `apps/web/vite.config.ts`:**

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:4001',
      changeOrigin: true,
    },
  },
}
```

> [!IMPORTANT]
> The `/api` prefix is **preserved** when forwarding to the backend. This means:
> - Frontend calls: `/api/tests`
> - Backend receives: `/api/tests`
> - Backend routes must include the `/api` prefix (e.g., `app.get('/api/tests', ...)`)



### Calling the API from Web App

Here's an example of how to call the API from your React components using the fetch API:

```typescript
// apps/web/src/pages/CreateTest.tsx
const response = await fetch('/api/tests', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name, description }),
});

if (!response.ok) {
  throw new Error('Failed to create test');
}

const data = await response.json();

```


> [!TIP]
> - All API endpoints in the backend should include the `/api` prefix (e.g., `app.get('/api/users', ...)`)
> - When calling from the frontend, use the same path: `fetch('/api/users')`
> - The proxy forwards requests to the backend server while preserving the `/api` prefix
> - Add proper error handling and loading states for better UX

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

## 🎨 UI Components with Tailwind CSS & shadcn/ui

This template comes pre-configured with:
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework with zero-config setup
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful, accessible components built on Radix UI

> [!NOTE]
> Tailwind CSS v4 is already installed and configured. No config file needed - just use utility classes!

### Using Tailwind CSS

Simply use Tailwind utility classes in your components:

```tsx
export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Hello Tailwind!
      </h1>
    </div>
  )
}
```

### Adding shadcn/ui Components

Add components as needed using the CLI:

```bash
cd apps/web

# Add a single component
pnpm dlx shadcn@latest add button

# Add multiple components at once
pnpm dlx shadcn@latest add button card dialog dropdown-menu
```

### Using shadcn/ui Components

Import and use components with the `@/` path alias:

```tsx
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

> [!TIP]
> Browse all available components at [ui.shadcn.com/docs/components](https://ui.shadcn.com/docs/components)

## 🔌 API Client Integration

This monorepo includes a fully-typed API client package (`@local/api-client`) for making HTTP requests from the web application.

### Package Structure

The API client currently includes two modules:
- **`auth`** - Authentication endpoints (login, register, logout, etc.)
- **`test`** - Test data endpoints (get all tests, create test)

### Installation

The `@local/api-client` package is already added to the web app's dependencies. After running `pnpm install`, it will be available for use.

### Configuration

The API client is configured in `apps/web/src/lib/api-client.ts` with:
- Base URL from environment variables (`VITE_API_URL`)
- Request interceptor for adding authentication tokens
- Response interceptor for logging
- Error interceptor for centralized error handling

**Example configuration:**

```typescript
import { createApiClient } from '@local/api-client';

export const apiClient = createApiClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4001/api',
});

// Add request interceptor to include auth token
apiClient.interceptors.addRequestInterceptor((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});
```

### Usage Examples

#### Basic Import

```typescript
import apiClient from '@/lib/api-client';
```

#### Authentication Module

```typescript
// Login
const response = await apiClient.auth.login({
  email: 'user@example.com',
  password: 'password123',
});

// Save token
localStorage.setItem('authToken', response.data.token);

// Register
await apiClient.auth.register({
  email: 'new@example.com',
  password: 'password123',
  name: 'New User',
});

// Get current user
const currentUser = await apiClient.auth.getCurrentUser();

// Logout
await apiClient.auth.logout();
```

#### Test Module

```typescript
// Get all tests
const testsResponse = await apiClient.test.getAll();
console.log(testsResponse.data); // Array of Test objects

// Create a new test
const newTest = await apiClient.test.create({
  name: 'My Test',
  description: 'Optional description',
});
console.log(newTest.data); // Created Test object
```

#### Error Handling

```typescript
import { ApiClientError } from '@local/api-client';

try {
  await apiClient.test.getAll();
} catch (error) {
  if (error instanceof ApiClientError) {
    console.log(`API Error: ${error.message} (${error.status})`);
  }
}
```

#### Using in React Components

```typescript
import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import type { Test } from '@local/api-client';

export default function TestList() {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTests() {
      try {
        const response = await apiClient.test.getAll();
        setTests(response.data);
      } catch (error) {
        console.error('Failed to fetch tests:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {tests.map(test => (
        <li key={test.id}>{test.name}</li>
      ))}
    </ul>
  );
}
```

### Environment Variables

Add to your `apps/web/.env` file:

```env
VITE_API_URL=http://localhost:4001/api
```

### TypeScript Support

The API client is fully typed. Import types as needed:

```typescript
import type { Test, CreateTestRequest, LoginResponse, ApiResponse } from '@local/api-client';
```

### Adding Custom Interceptors

You can add custom interceptors in `apps/web/src/lib/api-client.ts`:

```typescript
// Custom request interceptor
apiClient.interceptors.addRequestInterceptor((config) => {
  // Modify request config
  return config;
});

// Custom response interceptor
apiClient.interceptors.addResponseInterceptor((response) => {
  // Handle response
  return response;
});

// Custom error interceptor
apiClient.interceptors.addErrorInterceptor((error) => {
  // Handle errors
  return error;
});
```

### Adding New Modules

To add a new module to the API client:

1. Create a new directory in `packages/api-client/src/modules/[module-name]/`
2. Add `[module-name].types.ts` for TypeScript interfaces
3. Add `[module-name].api.ts` with the API class
4. Export the module in `packages/api-client/src/index.ts`
5. Add the module to the `ApiClient` class

**Example structure:**
```
packages/api-client/src/modules/
├── auth/
│   ├── auth.types.ts
│   └── auth.api.ts
└── test/
    ├── test.types.ts
    └── test.api.ts
```

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
