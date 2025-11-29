# 🔐 Authentication with Better Auth

This guide shows you how to implement authentication using [Better Auth](https://www.better-auth.com/) with **bearer token authentication** (not cookies) for API security.

## Why Better Auth?

- **Modern**: Built for modern web applications
- **Type-safe**: Full TypeScript support
- **Flexible**: Multiple authentication strategies
- **Extensible**: Plugin-based architecture
- **Database-agnostic**: Works with any database via Prisma

## Why Bearer Tokens?

- **Stateless**: No server-side session storage needed
- **Mobile-friendly**: Works seamlessly with mobile apps
- **API-first**: Perfect for REST APIs and microservices
- **Cross-domain**: No CORS cookie issues
- **Scalable**: Easy to distribute across multiple servers

## Installation

### 1. Install Better Auth

```bash
# Install in the API app
cd apps/api
pnpm add better-auth

# Install in the web app
cd apps/web
pnpm add better-auth
```

### 2. Install Bearer Plugin

The bearer plugin is included in Better Auth, no additional installation needed.

## Backend Setup (Hono.js)

### 1. Create Better Auth instance

Create `apps/api/src/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { bearer } from "better-auth/plugins";
import { prisma } from "@local/database";

export const auth = betterAuth({
  database: {
    provider: "postgresql",
    url: process.env.DATABASE_URL!,
  },
  
  // Enable bearer token authentication
  plugins: [
    bearer()
  ],
  
  emailAndPassword: {
    enabled: true,
  },
  
  // Optional: Add social providers
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
```

### 2. Add auth routes to Hono

Update `apps/api/src/index.ts`:

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth';

const app = new Hono();

app.use('/*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Mount Better Auth routes
app.all('/api/auth/*', async (c) => {
  return auth.handler(c.req.raw);
});

// Protected route example
app.get('/api/protected', async (c) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  
  // Verify token with Better Auth
  const session = await auth.api.getSession({
    headers: new Headers({ 'Authorization': `Bearer ${token}` })
  });

  if (!session) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  return c.json({ 
    message: 'Protected data',
    user: session.user 
  });
});

export default app;
```

### 3. Create auth middleware (optional)

Create `apps/api/src/middleware/auth.ts`:

```typescript
import { Context, Next } from 'hono';
import { auth } from '../auth';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.substring(7);
  
  const session = await auth.api.getSession({
    headers: new Headers({ 'Authorization': `Bearer ${token}` })
  });

  if (!session) {
    return c.json({ error: 'Invalid token' }, 401);
  }

  // Attach user to context
  c.set('user', session.user);
  c.set('session', session);
  
  await next();
}

// Usage in routes:
// app.get('/api/protected', authMiddleware, async (c) => {
//   const user = c.get('user');
//   return c.json({ user });
// });
```

### 4. Update database schema

Better Auth requires specific tables. Add to `packages/database/prisma/schema.prisma`:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified Boolean   @default(false)
  name          String?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sessions      Session[]
  accounts      Account[]
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  accountId         String
  providerId        String
  accessToken       String?
  refreshToken      String?
  idToken           String?
  expiresAt         DateTime?
  password          String?
  
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  @@unique([providerId, accountId])
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  @@unique([identifier, value])
}
```

Run migrations:

```bash
cd packages/database
pnpm prisma migrate dev --name add_better_auth
```

### 5. Configure environment variables

Add to `apps/api/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Optional: Social providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

## Frontend Setup (React)

### 1. Create Better Auth client

Create `apps/web/src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3005", // Your API URL
  
  // Use bearer tokens instead of cookies
  plugins: [
    // Bearer plugin is automatically used when making requests
  ]
});

export const { signIn, signUp, signOut, useSession } = authClient;
```

### 2. Create login page

Create `apps/web/src/pages/Login.tsx`:

```typescript
import { useState } from 'react';
import { signIn } from '@/lib/auth-client';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      // Token is automatically stored and included in future requests
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
```

### 3. Create signup page

Create `apps/web/src/pages/Signup.tsx`:

```typescript
import { useState } from 'react';
import { signUp } from '@/lib/auth-client';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      navigate('/login');
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="w-96 space-y-4">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
        
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
```

### 4. Use session in components

```typescript
import { useSession, signOut } from '@/lib/auth-client';

export default function Dashboard() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const handleSignOut = async () => {
    await signOut();
    // Redirect to login
    window.location.href = '/login';
  };

  return (
    <div>
      <h1>Welcome, {session.user.name || session.user.email}!</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
```

### 5. Create protected route component

Create `apps/web/src/components/ProtectedRoute.tsx`:

```typescript
import { useSession } from '@/lib/auth-client';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

Usage in routes:

```typescript
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);
```

### 6. Make authenticated requests

```typescript
// The auth client automatically includes the bearer token
const response = await fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('better-auth.token')}`,
  },
});

const data = await response.json();
```

Or create a custom fetch wrapper:

```typescript
// apps/web/src/lib/api.ts
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('better-auth.token');
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}

// Usage:
const response = await authenticatedFetch('/api/protected');
```

## Social Authentication

### GitHub OAuth

1. **Create GitHub OAuth App**: https://github.com/settings/developers
2. **Set callback URL**: `http://localhost:3005/api/auth/callback/github`
3. **Add credentials to `.env`**:

```env
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

4. **Add GitHub button to login page**:

```typescript
import { signIn } from '@/lib/auth-client';

export default function Login() {
  const handleGitHubLogin = async () => {
    await signIn.social({
      provider: 'github',
      callbackURL: '/dashboard',
    });
  };

  return (
    <div>
      <button onClick={handleGitHubLogin}>
        Sign in with GitHub
      </button>
    </div>
  );
}
```

## Security Best Practices

> [!IMPORTANT]
> - **Bearer tokens are stored in localStorage by default**
> - **Always use HTTPS in production** to protect tokens
> - **Implement token refresh logic** for long-lived sessions
> - **Set appropriate token expiration times**
> - **Validate tokens on every request** on the backend

> [!WARNING]
> - Never expose your `GITHUB_CLIENT_SECRET` or other sensitive credentials in client-side code
> - Keep all secrets in your `apps/api/.env` file only
> - Never commit `.env` files to version control
> - Use environment variables for all sensitive configuration

## Token Refresh

Implement automatic token refresh:

```typescript
// apps/web/src/lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3005",
  
  // Automatically refresh tokens before they expire
  plugins: [
    {
      id: "token-refresh",
      hooks: {
        onRequest: async (request) => {
          // Check if token is about to expire
          // Refresh if needed
          return request;
        },
      },
    },
  ],
});
```

## Testing

### Testing protected routes

```typescript
import { describe, it, expect } from 'vitest';

describe('Protected Routes', () => {
  it('should reject requests without token', async () => {
    const response = await fetch('http://localhost:3005/api/protected');
    expect(response.status).toBe(401);
  });

  it('should accept requests with valid token', async () => {
    const token = 'valid-token-here';
    const response = await fetch('http://localhost:3005/api/protected', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    expect(response.status).toBe(200);
  });
});
```

## Additional Resources

- [Better Auth Documentation](https://www.better-auth.com/docs/installation)
- [Bearer Plugin Guide](https://www.better-auth.com/docs/plugins/bearer)
- [Better Auth Examples](https://github.com/better-auth/better-auth/tree/main/examples)
- [OAuth 2.0 Bearer Token Usage](https://datatracker.ietf.org/doc/html/rfc6750)

## Troubleshooting

### Token not being sent

Make sure you're including the Authorization header:

```typescript
fetch('/api/protected', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('better-auth.token')}`,
  },
});
```

### CORS issues

Ensure CORS is configured correctly in your API:

```typescript
app.use('/*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

### Session not persisting

Check that tokens are being stored in localStorage:

```typescript
console.log(localStorage.getItem('better-auth.token'));
```
