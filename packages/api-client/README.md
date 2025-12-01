# @local/api-client

A TypeScript-based API client for making HTTP requests with support for interceptors, error handling, and modular API endpoints.

## Installation

```bash
pnpm install
```

## Build

```bash
pnpm build
```

## Usage

### Basic Setup

```typescript
import { createApiClient } from '@local/api-client';

const apiClient = createApiClient({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'X-Custom-Header': 'value',
  },
});
```

### Authentication

```typescript
// Login
const loginResponse = await apiClient.auth.login({
  email: 'user@example.com',
  password: 'password123',
});

console.log(loginResponse.data.token);
console.log(loginResponse.data.user);

// Register
const registerResponse = await apiClient.auth.register({
  email: 'newuser@example.com',
  password: 'password123',
  name: 'New User',
});

// Get current user
const currentUser = await apiClient.auth.getCurrentUser();

// Logout
await apiClient.auth.logout();
```

### Users

```typescript
// Get all users with pagination
const usersResponse = await apiClient.users.getUsers({
  page: 1,
  limit: 10,
  search: 'john',
});

// Get user by ID
const user = await apiClient.users.getUserById('user-id');

// Update user
const updatedUser = await apiClient.users.updateUser('user-id', {
  name: 'Updated Name',
});

// Delete user
await apiClient.users.deleteUser('user-id');
```

### Using Interceptors

```typescript
// Add request interceptor (e.g., for adding auth token)
apiClient.interceptors.addRequestInterceptor((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Add response interceptor
apiClient.interceptors.addResponseInterceptor((response) => {
  console.log('Response received:', response.status);
  return response;
});

// Add error interceptor
apiClient.interceptors.addErrorInterceptor((error) => {
  console.error('API Error:', error.message);
  return error;
});
```

### Error Handling

```typescript
import { ApiClientError, UnauthorizedError } from '@local/api-client';

try {
  await apiClient.auth.login({ email: 'test@test.com', password: 'wrong' });
} catch (error) {
  if (error instanceof UnauthorizedError) {
    console.log('Invalid credentials');
  } else if (error instanceof ApiClientError) {
    console.log(`API Error: ${error.message} (${error.status})`);
  }
}
```

## Structure

```
src/
├── client/
│   ├── base.ts           # Base HTTP client
│   ├── interceptors.ts   # Request/response interceptors
│   └── types.ts          # Common types
├── modules/
│   ├── auth/
│   │   ├── auth.api.ts
│   │   └── auth.types.ts
│   └── users/
│       ├── users.api.ts
│       └── users.types.ts
├── __mocks__/
│   └── index.ts          # Mock for testing
├── errors/
│   └── index.ts          # Custom error classes
└── index.ts              # Main export
```

## Adding New Modules

To add a new API module (e.g., `posts`):

1. Create a new directory: `src/modules/posts/`
2. Add types: `posts.types.ts`
3. Add API methods: `posts.api.ts`
4. Update `src/index.ts` to export the new module
5. Add the module to the `ApiClient` class

Example:

```typescript
// src/modules/posts/posts.api.ts
export class PostsApi {
  constructor(private client: BaseHttpClient) {}

  async getPosts() {
    return this.client.get('/posts');
  }
}

// src/index.ts
import { PostsApi } from './modules/posts/posts.api';

export class ApiClient {
  // ...
  public posts: PostsApi;

  constructor(config: ApiClientConfig) {
    // ...
    this.posts = new PostsApi(this.httpClient);
  }
}
```
