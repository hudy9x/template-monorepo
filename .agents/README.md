# OpenCode Agent Configuration

This directory contains agent configurations for the OpenCode AI assistant to help build applications using this monorepo template.

## Agent Structure

### Primary Agent: `farmer` 🌾

The main agent you interact with. The "farmer" cultivates and grows your application across all layers.

**Usage**: Default agent, or switch with Tab key

**Responsibilities**:
- Architecture and planning across API, web, and database
- Coordinating work between subagents
- End-to-end feature implementation
- Integration testing

### Subagents

#### `@api` - Backend Specialist
**Focus**: Hono.js API development
- RESTful endpoints
- Authentication with Better Auth
- Database integration via Prisma
- Streaming responses

**Invoke**: `@api create a new endpoint for user posts`

#### `@web` - Frontend Specialist
**Focus**: React + Vite frontend
- UI components with shadcn/ui
- React Router pages
- API integration
- Authentication state

**Invoke**: `@web create a dashboard page with user stats`

#### `@database` - Database Specialist
**Focus**: Prisma schema and migrations
- Schema design
- Migrations
- Seed data
- Query optimization

**Invoke**: `@database add a Post model with user relation`

## Configuration Files

- `opencode.json` - Agent settings (models, tools, temperature)
- `agent/*.md` - Detailed agent prompts and instructions

## How to Use

1. **Default interaction**: Just chat normally, the `farmer` agent handles everything
2. **Delegate to specialist**: Mention a subagent like `@api` or `@web`
3. **Switch primary agent**: Use Tab key to cycle through primary agents

## Examples

```
# General request (farmer handles)
"Add a blog feature with posts and comments"

# Specific backend work
"@api create an endpoint to fetch user posts with pagination"

# Specific frontend work
"@web create a post list component with infinite scroll"

# Specific database work
"@database add a Comment model related to Post and User"
```

## Customization

You can modify agent behavior by:
1. Editing `opencode.json` for settings (model, temperature, tools)
2. Editing `agent/*.md` files for detailed instructions

## Documentation References

All agents have access to:
- `docs/authentication-with-better-auth.md`
- `docs/streaming-with-readable-streams.md`
- `docs/how-to-add-router-to-react.md`
- `docs/add-app-to-apps-folder.md`
- `docs/add-package-to-pacakges-folder.md`
- `README.md`

## Learn More

- [OpenCode Agents Documentation](https://opencode.ai/docs/agents/)
- [OpenCode Rules Documentation](https://opencode.ai/docs/rules/)
- [OpenCode Tools Documentation](https://opencode.ai/docs/tools/)
