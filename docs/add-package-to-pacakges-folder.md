# How to Add a New Package to the `packages/` Folder

This guide explains how to add a new shared package to the `packages/` folder in your pnpm workspace monorepo.

## Prerequisites

- pnpm workspace is already configured in `pnpm-workspace.yaml`
- The workspace includes `'packages/*'` in the packages list

## Step-by-Step Guide

### 1. Create the Package Directory

Create a new directory for your package inside the `packages/` folder:

```bash
mkdir packages/your-package-name
cd packages/your-package-name
```

### 2. Initialize the Package

Create a `package.json` file. Packages should use a **scoped name** (e.g., `@local/package-name`) to distinguish them from apps:

```json
{
  "name": "@local/your-package-name",
  "version": "1.0.0",
  "type": "module",
  "description": "Description of your package",
  "main": "index.js",
  "exports": {
    ".": "./index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

> **Important**: Use scoped names like `@local/package-name` for packages to avoid conflicts and clearly identify internal packages.

### 3. Set Up TypeScript (Recommended)

Create a `tsconfig.json` for your package:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "declaration": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 4. Create Package Structure

Set up your package's source code structure:

```
packages/your-package-name/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md (optional)
```

### 5. Export Your Package

In `src/index.ts`, export the functionality you want to share:

```typescript
// src/index.ts
export function yourFunction() {
  return "Hello from shared package!";
}

export const yourConstant = "Some value";

export class YourClass {
  // ...
}
```

### 6. Build the Package (if needed)

If your package uses TypeScript or needs compilation:

```bash
# From the package directory
pnpm build

# Or from the root
pnpm --filter @local/your-package-name build
```

Update `package.json` to point to the built files:

```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"]
}
```

### 7. Use the Package in Apps

Add the package to any app that needs it:

```bash
# From the monorepo root
pnpm --filter api add @local/your-package-name@workspace:*
pnpm --filter web add @local/your-package-name@workspace:*
```

Or manually add to the app's `package.json`:

```json
{
  "dependencies": {
    "@local/your-package-name": "workspace:*"
  }
}
```

Then run:

```bash
pnpm install
```

### 8. Import and Use in Apps

In your apps, import the package:

```typescript
// In apps/api/src/index.ts
import { yourFunction } from '@local/your-package-name';

console.log(yourFunction());
```

## Examples

### Example 1: Creating a Shared Utilities Package

```bash
# Create directory
mkdir packages/shared-utils
cd packages/shared-utils

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@local/shared-utils",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF

# Create source file
mkdir src
cat > src/index.ts << 'EOF'
export function formatDate(date: Date): string {
  return date.toISOString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(7);
}
EOF

# Use in apps
cd ../..
pnpm --filter api add @local/shared-utils@workspace:*
```

### Example 2: Creating a Prisma Database Package

```bash
# Create directory
mkdir packages/database
cd packages/database

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@local/database",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js"
  },
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.0.0"
  },
  "devDependencies": {
    "prisma": "^5.0.0",
    "typescript": "^5.0.0"
  }
}
EOF

# Initialize Prisma
cd ../..
pnpm --filter @local/database add prisma @prisma/client
pnpm --filter @local/database exec prisma init

# Create client export
cat > packages/database/index.js << 'EOF'
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
EOF
```

### Example 3: Creating a Shared TypeScript Config Package

```bash
# Create directory
mkdir packages/typescript-config
cd packages/typescript-config

# Create package.json
cat > package.json << 'EOF'
{
  "name": "@local/typescript-config",
  "version": "1.0.0",
  "files": ["base.json", "react.json", "node.json"]
}
EOF

# Create base config
cat > base.json << 'EOF'
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF

# Use in apps' tsconfig.json
# "extends": "@local/typescript-config/base.json"
```

## Common Commands

```bash
# Install dependencies for a specific package
pnpm --filter @local/your-package-name install

# Add a dependency to a specific package
pnpm --filter @local/your-package-name add <package>

# Build a specific package
pnpm --filter @local/your-package-name build

# Build all packages
pnpm --filter "./packages/*" build

# Run a script in all packages
pnpm --filter "./packages/*" <script-name>
```

## Best Practices

1. **Naming Convention**: Use scoped names like `@local/package-name` for all packages
2. **Versioning**: Start with `1.0.0` and use semantic versioning
3. **Exports**: Clearly define exports in `package.json` using the `exports` field
4. **TypeScript**: Include type definitions (`declaration: true`) for better DX
5. **Documentation**: Add a `README.md` explaining the package's purpose and usage
6. **Testing**: Include tests for shared packages as they're used across multiple apps
7. **Dependencies**: Keep packages lightweight; only include necessary dependencies
8. **Build Output**: If building, use a `dist/` folder and include it in `files` field

## Package Types

### 1. Source-Only Packages (No Build Step)

For simple packages that don't need compilation:

```json
{
  "name": "@local/constants",
  "main": "src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

### 2. Built Packages (With Compilation)

For packages that need to be compiled:

```json
{
  "name": "@local/ui-components",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc"
  }
}
```

### 3. Multi-Entry Packages

For packages with multiple entry points:

```json
{
  "name": "@local/utils",
  "exports": {
    ".": "./src/index.ts",
    "./string": "./src/string.ts",
    "./date": "./src/date.ts",
    "./number": "./src/number.ts"
  }
}
```

Usage:
```typescript
import { formatDate } from '@local/utils/date';
import { capitalize } from '@local/utils/string';
```

## Troubleshooting

### Package not found in apps

- Verify the package name matches exactly (including `@local/` scope)
- Ensure you used `workspace:*` protocol when adding the dependency
- Run `pnpm install` from the root after adding the dependency

### TypeScript cannot find types

- Ensure `declaration: true` is set in the package's `tsconfig.json`
- Check that the `types` field in `package.json` points to the correct `.d.ts` file
- Verify the package is built if it requires compilation

### Changes not reflected in apps

- If the package needs building, rebuild it after changes
- For source-only packages, restart the app's dev server
- Use `pnpm --filter <app> dev` to ensure proper watching

### Circular dependencies

- Avoid having packages depend on each other
- Restructure shared code to prevent circular references
- Use a "core" package that other packages can depend on

## Advanced: Package Scripts in Root

Add convenience scripts to the root `package.json`:

```json
{
  "scripts": {
    "build:packages": "pnpm --filter \"./packages/*\" build",
    "dev:packages": "pnpm --filter \"./packages/*\" dev",
    "test:packages": "pnpm --filter \"./packages/*\" test"
  }
}
```

## References

- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [Package.json Exports Field](https://nodejs.org/api/packages.html#exports)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Prisma in Monorepos](https://www.prisma.io/docs/guides/use-prisma-in-pnpm-workspaces)
