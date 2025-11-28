# How to Add a New App to the `apps/` Folder

This guide explains how to add a new application to the `apps/` folder in your pnpm workspace monorepo.

## Prerequisites

- pnpm workspace is already configured in `pnpm-workspace.yaml`
- The workspace includes `'apps/*'` in the packages list

## Step-by-Step Guide

### 1. Create the App Directory

Create a new directory for your app inside the `apps/` folder:

```bash
mkdir apps/your-app-name
cd apps/your-app-name
```

### 2. Initialize the Package

Create a `package.json` file for your new app. The `name` field should be simple (without scope prefix like `@local/`):

```json
{
  "name": "your-app-name",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "your-dev-command",
    "build": "your-build-command",
    "start": "your-start-command"
  },
  "dependencies": {},
  "devDependencies": {}
}
```

> **Note**: Apps typically use simple names (e.g., `"api"`, `"web"`) without scoped prefixes.

### 3. Add Dependencies

Install dependencies for your new app using pnpm's filter flag:

```bash
# From the monorepo root
pnpm --filter your-app-name add <package-name>

# Example: Add Express to a new backend app
pnpm --filter backend add express

# Add dev dependencies
pnpm --filter your-app-name add -D <dev-package>
```

### 4. Reference Workspace Packages

To use shared packages from the `packages/` folder, add them as dependencies using the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@local/database": "workspace:*",
    "@local/shared-utils": "workspace:*"
  }
}
```

Then install:

```bash
pnpm install
```

### 5. Add Scripts to Root `package.json`

Add convenience scripts to the root `package.json` to run your app:

```json
{
  "scripts": {
    "dev:your-app": "pnpm --filter your-app-name dev",
    "build:your-app": "pnpm --filter your-app-name build",
    "start:your-app": "pnpm --filter your-app-name start"
  }
}
```

### 6. Create Your App Structure

Set up your app's source code structure. For example:

```
apps/your-app-name/
├── src/
│   └── index.ts
├── package.json
└── tsconfig.json (if using TypeScript)
```

### 7. Verify the Setup

Test that your app is recognized by the workspace:

```bash
# List all workspace packages
pnpm list --depth 0

# Run your app
pnpm dev:your-app
```

## Examples

### Example 1: Adding a Node.js API with Hono

```bash
# Create directory
mkdir apps/api
cd apps/api

# Create package.json
cat > package.json << 'EOF'
{
  "name": "api",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
EOF

# Install dependencies
cd ../..
pnpm --filter api add hono @hono/node-server
pnpm --filter api add -D tsx typescript @types/node

# Add workspace package
pnpm --filter api add @local/database@workspace:*
```

### Example 2: Adding a React App with Vite

```bash
# Use Vite's create command
cd apps
pnpm create vite web --template react-ts

# Update package.json name to be simple
cd web
# Edit package.json: change "name" to "web"

# Add workspace package if needed
cd ../..
pnpm --filter web add @local/shared-utils@workspace:*
```

### Example 3: Adding a Next.js App

```bash
# Create Next.js app
cd apps
pnpm create next-app@latest admin --typescript --tailwind --app

# The name in package.json should be "admin"
cd ../..

# Add workspace packages
pnpm --filter admin add @local/database@workspace:*
```

## Common Commands

```bash
# Install dependencies for a specific app
pnpm --filter your-app-name install

# Add a dependency to a specific app
pnpm --filter your-app-name add <package>

# Run a script in a specific app
pnpm --filter your-app-name <script-name>

# Run a script in all apps
pnpm --filter "./apps/*" <script-name>

# Run dev for multiple apps concurrently
pnpm --parallel --filter api --filter web dev
```

## Best Practices

1. **Naming Convention**: Use simple, lowercase names for apps (e.g., `api`, `web`, `admin`)
2. **TypeScript**: Include a `tsconfig.json` that extends from a root or shared config
3. **Environment Variables**: Use `.env` files and add them to `.gitignore`
4. **Scripts**: Always include `dev`, `build`, and `start` scripts for consistency
5. **Workspace Dependencies**: Use `workspace:*` protocol for internal packages
6. **Documentation**: Update the root `README.md` to document the new app

## Troubleshooting

### App not recognized by workspace

- Verify `pnpm-workspace.yaml` includes `'apps/*'`
- Run `pnpm install` from the root to refresh the workspace
- Check that `package.json` exists in your app directory

### Cannot find workspace package

- Ensure the package name in dependencies matches exactly (e.g., `@local/database`)
- Use `workspace:*` protocol for workspace packages
- Run `pnpm install` after adding workspace dependencies

### TypeScript errors with workspace packages

- Ensure the workspace package has proper `exports` in its `package.json`
- Check that the workspace package is built/compiled if necessary
- Add path mappings in `tsconfig.json` if needed

## References

- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [pnpm Filtering](https://pnpm.io/filtering)
- [Workspace Protocol](https://pnpm.io/workspaces#workspace-protocol-workspace)
