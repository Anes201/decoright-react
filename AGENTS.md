# AGENTS.md — DecoRight React

Guidelines for AI agents working in this React + TypeScript + Vite codebase.

---

## Project Overview

- **Framework**: React 19 + TypeScript 5.9
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 + tw-animate-css
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Package Manager**: pnpm

---

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

---

## Code Style Guidelines

### Imports

- Use path aliases: `@/` for src root, `@components/` for components
- Group imports: React → Libraries → Aliases → Relative
- Use `type` keyword for type-only imports

```typescript
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ChatRoom } from '@/types/chat'
import { supabase } from '@/lib/supabase'
import { LoginLayout } from './Login'
```

### Types & Naming

- **PascalCase**: Components, types, interfaces, enums
- **camelCase**: Variables, functions, hooks, properties
- **UPPER_SNAKE_CASE**: Constants
- Prefix custom hooks with `use`
- Suffix service objects with `Service`

```typescript
// Types in src/types/
export type UserRole = 'admin' | 'client'
export interface ChatMessage { id: string }

// Hooks in src/hooks/
export function useAuth() { }

// Services in src/services/
export const ChatService = { }
```

### File Structure

```
src/
  components/     # Reusable UI components
    auth/         # Auth-related components
    chat/         # Chat components
    common/       # Shared components (Spinner, etc)
    layout/       # Layout components
    ui/           # Base UI components (Input, Button)
  contexts/       # React contexts
  hooks/          # Custom hooks
  lib/            # Library configs (supabase.ts)
  pages/          # Route-level page components
    Admin/        # Admin role pages
    Client/       # Client role pages
    Public/       # Public pages
  routers/        # Route definitions
  services/       # API/service logic
  types/          # TypeScript types
  utils/          # Utility functions
```

### Error Handling

- Throw errors in services, catch in components/hooks
- Use toast notifications for user-facing errors (react-hot-toast)
- Always cleanup subscriptions in useEffect

```typescript
// Service layer - throw errors
try {
  const { data, error } = await supabase.from('table').select()
  if (error) throw error
  return data
} catch (err) {
  throw err
}

// Component layer - handle gracefully
try {
  await ChatService.sendMessage(data)
} catch (err: any) {
  setError(err.message)
  toast.error(err.message)
}
```

### React Patterns

- Use functional components with hooks
- Context for global state (Auth, Chat)
- Services for API calls (supabase)
- Always use StrictMode

```typescript
export function Component() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  
  useEffect(() => {
    const sub = ChatService.subscribeToRooms(callback)
    return () => { sub.unsubscribe() }
  }, [])
  
  return <div>...</div>
}
```

---

## Git Conventions

See `git_conventions.md` for full details.

**Commits**: Conventional Commits format
```
feat(auth): add login endpoint
fix(api): correct 500 error when payload is empty
refactor(user): simplify name parsing logic
```

**Branches**: `type/issue-number-short-description`
```
feature/123-add-user-authentication
bugfix/89-fix-login-crash
```

---

## Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Key Dependencies

- React 19 + React Router 7
- Supabase JS client
- Tailwind CSS 4 + @tailwindcss/vite
- react-hook-form, react-hot-toast
- i18next (internationalization)
- @dnd-kit (drag & drop)
- recharts (charts)
- swiper (carousels)
