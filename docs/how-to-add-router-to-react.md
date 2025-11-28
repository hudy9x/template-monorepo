# How to Add React Router to React App (Data Mode)

This guide explains how to add React Router in **Data Mode** to a React application in your pnpm workspace monorepo.

> **Note**: React Router has three modes: Framework, Data, and Declarative. This guide focuses on **Data Mode**, which provides data loading capabilities with loaders and actions.

## Prerequisites

- A React app already exists in `apps/web` (or similar)
- The app uses Vite or another bundler
- pnpm workspace is configured

## Step 1: Install React Router

Install React Router in your web app:

```bash
# From the monorepo root
pnpm --filter web add react-router
```

Or if you're in the app directory:

```bash
cd apps/web
pnpm add react-router
```

## Step 2: Create Routes Configuration File

Create a separate `routes.ts` (or `routes.tsx`) file to keep routing logic organized:

**`apps/web/src/routes.ts`**

```typescript
import { createBrowserRouter } from 'react-router';
import Root from './pages/Root.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import NotFound from './pages/NotFound.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'about',
        Component: About,
      },
    ],
  },
  {
    path: '*',
    Component: NotFound,
  },
]);
```

> **Important**: Add `.tsx` extensions to imports if using TypeScript with `"moduleResolution": "bundler"` or `"nodenext"`.

## Step 3: Create Page Components

### Root Layout Component

Create a root layout component with navigation and an `<Outlet>` for child routes:

**`apps/web/src/pages/Root.tsx`**

```tsx
import { Outlet, Link } from 'react-router';

export default function Root() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

### Home Page

**`apps/web/src/pages/Home.tsx`**

```tsx
export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}
```

### About Page

**`apps/web/src/pages/About.tsx`**

```tsx
export default function About() {
  return (
    <div>
      <h1>About Page</h1>
      <p>This is the about page.</p>
    </div>
  );
}
```

### 404 Not Found Page

**`apps/web/src/pages/NotFound.tsx`**

```tsx
import { Link } from 'react-router';

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
```

## Step 4: Update Main Entry Point

Update your `main.tsx` to use `RouterProvider`:

**`apps/web/src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './index.css';
import { router } from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
```

## Step 5: Test Your Routes

Start the dev server and test your routes:

```bash
# From the monorepo root
pnpm dev:web

# Or from the app directory
pnpm dev
```

Navigate to:
- `http://localhost:5173/` - Home page
- `http://localhost:5173/about` - About page
- `http://localhost:5173/invalid` - 404 page

## Advanced Features

### Data Loading with Loaders

Add data loading to your routes using loaders:

**`apps/web/src/routes.ts`**

```typescript
import { createBrowserRouter } from 'react-router';
import Team from './pages/Team.tsx';

export const router = createBrowserRouter([
  {
    path: '/teams/:teamId',
    loader: async ({ params }) => {
      const response = await fetch(`/api/teams/${params.teamId}`);
      const team = await response.json();
      return { team };
    },
    Component: Team,
  },
]);
```

**`apps/web/src/pages/Team.tsx`**

```tsx
import { useLoaderData } from 'react-router';

export default function Team() {
  const { team } = useLoaderData();
  
  return (
    <div>
      <h1>{team.name}</h1>
      <p>{team.description}</p>
    </div>
  );
}
```

### Nested Routes

Create nested routes with shared layouts:

```typescript
createBrowserRouter([
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: 'settings',
        Component: Settings,
      },
      {
        path: 'profile',
        Component: Profile,
      },
    ],
  },
]);
```

This creates:
- `/dashboard` - Renders `DashboardHome` inside `DashboardLayout`
- `/dashboard/settings` - Renders `Settings` inside `DashboardLayout`
- `/dashboard/profile` - Renders `Profile` inside `DashboardLayout`

### Dynamic Segments

Use dynamic segments for parameterized routes:

```typescript
createBrowserRouter([
  {
    path: '/users/:userId',
    Component: UserProfile,
  },
  {
    path: '/posts/:postId/comments/:commentId',
    Component: Comment,
  },
]);
```

Access params in loaders or components:

```tsx
import { useParams } from 'react-router';

export default function UserProfile() {
  const { userId } = useParams();
  return <div>User ID: {userId}</div>;
}
```

### Index Routes

Index routes render at the parent's URL:

```typescript
createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        index: true, // Renders at "/"
        Component: Home,
      },
      {
        path: 'about',
        Component: About,
      },
    ],
  },
]);
```

### Layout Routes (No Path)

Create layouts without adding URL segments:

```typescript
createBrowserRouter([
  {
    Component: MarketingLayout, // No path
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'contact',
        Component: Contact,
      },
    ],
  },
]);
```

### Prefix Routes (Path Only)

Group routes with a common path prefix:

```typescript
createBrowserRouter([
  {
    path: '/projects', // No component
    children: [
      {
        index: true,
        Component: ProjectsHome, // /projects
      },
      {
        path: ':pid',
        Component: Project, // /projects/:pid
      },
      {
        path: ':pid/edit',
        Component: EditProject, // /projects/:pid/edit
      },
    ],
  },
]);
```

## Navigation

### Using Link

For simple navigation without active styling:

```tsx
import { Link } from 'react-router';

<Link to="/about">About</Link>
<Link to="/users/123">View User</Link>
```

### Using NavLink

For navigation with active state styling:

```tsx
import { NavLink } from 'react-router';

<NavLink to="/" end>
  Home
</NavLink>

<NavLink 
  to="/about"
  className={({ isActive, isPending }) => 
    isActive ? 'active' : isPending ? 'pending' : ''
  }
>
  About
</NavLink>

<NavLink 
  to="/contact"
  style={({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
  })}
>
  Contact
</NavLink>
```

### Programmatic Navigation

Use `useNavigate` for programmatic navigation:

```tsx
import { useNavigate } from 'react-router';

export default function LoginForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ... login logic
    navigate('/dashboard');
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Using redirect

Redirect from loaders or actions:

```typescript
import { redirect } from 'react-router';

export const router = createBrowserRouter([
  {
    path: '/admin',
    loader: async () => {
      const user = await getCurrentUser();
      if (!user.isAdmin) {
        return redirect('/');
      }
      return { user };
    },
    Component: AdminDashboard,
  },
]);
```

## Pending UI

### Global Pending State

Show a global loading indicator during navigation:

```tsx
import { useNavigation, Outlet } from 'react-router';

export default function Root() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);
  
  return (
    <div>
      {isNavigating && <div className="loading-bar">Loading...</div>}
      <Outlet />
    </div>
  );
}
```

### Local Pending State

Show pending state on individual links:

```tsx
import { NavLink } from 'react-router';

<NavLink to="/slow-page">
  {({ isPending }) => (
    <span>
      Slow Page {isPending && <Spinner />}
    </span>
  )}
</NavLink>
```

### Form Submission Pending State

Show pending state during form submission:

```tsx
import { useFetcher } from 'react-router';

export default function NewProjectForm() {
  const fetcher = useFetcher();
  
  return (
    <fetcher.Form method="post">
      <input type="text" name="title" />
      <button type="submit">
        {fetcher.state !== 'idle' ? 'Submitting...' : 'Submit'}
      </button>
    </fetcher.Form>
  );
}
```

## Route Object Properties

### Common Properties

```typescript
{
  path: '/users/:userId',           // URL path pattern
  Component: UserProfile,           // Component to render
  loader: async ({ params }) => {}, // Data loading function
  action: async ({ request }) => {},// Form submission handler
  children: [],                     // Nested routes
  index: true,                      // Index route flag
  errorElement: <ErrorBoundary />,  // Error boundary component
}
```

### Loader Function

Loaders provide data to components before rendering:

```typescript
loader: async ({ params, request }) => {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get('q');
  
  const data = await fetchData(params.id, searchQuery);
  return { data };
}
```

Access loader data in components:

```tsx
import { useLoaderData } from 'react-router';

export default function MyComponent() {
  const { data } = useLoaderData();
  return <div>{data}</div>;
}
```

### Action Function

Actions handle form submissions and mutations:

```typescript
action: async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title');
  
  await createProject({ title });
  return redirect('/projects');
}
```

## Project Structure

Recommended structure for a React Router app:

```
apps/web/src/
├── routes.ts              # Router configuration
├── pages/                 # Page components
│   ├── Root.tsx          # Root layout
│   ├── Home.tsx          # Home page
│   ├── About.tsx         # About page
│   ├── Dashboard/        # Dashboard section
│   │   ├── Layout.tsx   # Dashboard layout
│   │   ├── Home.tsx     # Dashboard home
│   │   └── Settings.tsx # Dashboard settings
│   └── NotFound.tsx      # 404 page
├── components/            # Shared components
├── main.tsx              # App entry point
└── index.css             # Global styles
```

## Best Practices

1. **Separate Routes Configuration**: Keep routes in a separate `routes.ts` file
2. **Use Loaders for Data**: Load data in route loaders, not in components
3. **Nested Routes**: Use nested routes for shared layouts
4. **Index Routes**: Use index routes for default child routes
5. **Error Boundaries**: Add error boundaries to handle route errors
6. **Pending States**: Show pending UI during navigation and form submissions
7. **Type Safety**: Use TypeScript for better type safety with loaders and params
8. **File Extensions**: Add `.tsx` extensions to imports if required by your TypeScript config

## Common Commands

```bash
# Install React Router
pnpm --filter web add react-router

# Run dev server
pnpm dev:web

# Build for production
pnpm build:web
```

## Troubleshooting

### Module not found errors

If you get "Cannot find module" errors for page imports, add `.tsx` extensions:

```typescript
// ❌ Wrong
import Home from './pages/Home';

// ✅ Correct
import Home from './pages/Home.tsx';
```

### Routes not matching

- Check that paths don't have leading slashes in child routes
- Use `index: true` for default child routes
- Use `end` prop on `NavLink` for exact matching

### Loader data not available

- Ensure you're using `useLoaderData()` in the component
- Check that the loader is returning data
- Verify the loader is attached to the correct route

## References

- [React Router Installation](https://reactrouter.com/start/data/installation)
- [Routing Guide](https://reactrouter.com/start/data/routing)
- [Route Object](https://reactrouter.com/start/data/route-object)
- [Data Loading](https://reactrouter.com/start/data/data-loading)
- [Navigating](https://reactrouter.com/start/framework/navigating)
- [Pending UI](https://reactrouter.com/start/framework/pending-ui)
- [React Router Documentation](https://reactrouter.com/)
