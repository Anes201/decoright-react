# AGENTS.md — DecoRight

Guidelines for AI agents working in this React + TypeScript + Vite codebase.

---

## 1. Project Overview

**Project Name:** DecoRight
**Type:** Service-request platform for a local Algerian decoration & interior design company
**Target:** Early customer engagement only (leads qualification, portfolio showcase, discussions)
**Phase:** Production (deployed)

### Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19 + TypeScript 5.9 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 + tw-animate-css |
| Backend | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| i18n | i18next (EN/AR/FR) |
| Package Manager | pnpm |

### Deployment

- **Platform:** Netlify
- **URL:** https://decoright.netlify.app

---

## 2. Core Business Logic

### User Roles

1. **Guest (Unauthenticated)**
   - View landing page, limited portfolio, services, FAQ
   - Sign up / log in

2. **Customer (Authenticated)**
   - View full portfolio
   - Submit service requests
   - Chat with admins about their requests
   - Upload files to requests

3. **Admin**
   - Full access to all data
   - Manage service requests (status updates via Kanban)
   - Chat with customers
   - Upload/manage portfolio, gallery, FAQs, service types
   - View basic metrics

### Services Offered

- Interior Design
- Fixed Design
- Decor Consultation

*Note: No pricing logic - all pricing discussions happen via chat/off-platform.*

### Service Request Lifecycle

```
Submitted → Under Review → Waiting for Client Info → Approved → In Progress → Completed
                                                           ↓
                                                        Rejected
```

- Status changes are **admin-only**
- Customers can view status but cannot modify

### Chat System

- Real-time messaging via Supabase Realtime
- Always tied to a specific service request
- Supports text, images, audio, system messages
- File attachments via Supabase Storage

### Portfolio & Gallery

- Admin-only upload/management
- Before/after showcases
- Multilingual content (EN/AR/FR)
- Visibility controls (PUBLIC / AUTHENTICATED_ONLY / HIDDEN)

---

## 3. Database Schema

All tables in `public` schema with RLS enabled:

| Table | Description |
|-------|-------------|
| `profiles` | User profiles linked to auth.users (role: customer/admin) |
| `service_requests` | Client requests with status, dimensions, location |
| `messages` | Chat messages (TEXT, IMAGE, AUDIO, SYSTEM) |
| `chat_rooms` | Chat rooms linked to service requests |
| `projects` | Portfolio projects with multilingual fields |
| `project_images` | Images for projects |
| `gallery_items` | Before/after marketing showcases |
| `likes` | User likes on projects |
| `testimonials` | User reviews on projects |
| `service_types` | Service type definitions (Interior Design, etc.) |
| `space_types` | Space type definitions (Houses, Shops, Schools, etc.) |
| `request_attachments` | File attachments for service requests |
| `contact_messages` | Contact form submissions |
| `faqs` | FAQ entries (multilingual) |
| `site_settings` | Key-value site configuration |
| `admin_activities` | Audit log of admin actions |

---

## 4. Build & Development Commands

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

## 5. Architecture Overview

### Authentication & Authorization

- Supabase Auth (email-based with OTP verification)
- Role stored in `profiles.role` ('customer' | 'admin')
- AuthProvider context wraps the app
- Custom `useAuth()` hook for authentication state
- Route protection: `RequireAuth.tsx`, `RequireRole.tsx`

### Routing Structure

- Lazy-loaded components for code splitting
- Three main route groups with separate layouts:
  - **Public routes** - Landing, About, Services, Projects, Gallery, FAQ, Contact
  - **Client routes** - Dashboard, Requests, Chat, Profile
  - **Admin routes** - Dashboard, Users, Requests (Kanban), Services, Gallery, FAQs, Chat
- Routes defined in `src/routers/AppRoutes.tsx` and `src/routers/Paths.ts`

### Service Layer

- `src/services/request.service.ts` - Service requests CRUD
- `src/services/chat.service.ts` - Messages, file uploads
- `src/services/portfolio.service.ts` - Projects, gallery items
- Storage bucket: `request-attachments`

### State Management

- Auth context for user state
- Component-level form state (react-hook-form)
- Custom hooks for specific state needs

---

## 6. Code Style Guidelines

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

## 7. Git & Deployment Workflow

### Branch Strategy

| Branch | Purpose | Auto-Deploy |
|--------|---------|-------------|
| `main` | Production - stable, validated code | Yes (Netlify) |
| `dev` | Development - bug fixes & improvements | No |

### Workflow

1. All development work (features, bug fixes, improvements) goes in `dev`
2. Once validated locally, merge/push `dev` to `main`
3. `main` automatically deploys to Netlify

### Commits

Use Conventional Commits format:
```
feat(auth): add login endpoint
fix(api): correct 500 error when payload is empty
refactor(user): simplify name parsing logic
```

---

## 8. Environment Variables

Required in `.env`:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## 9. Key Dependencies

| Package | Purpose |
|---------|---------|
| react 19 | UI framework |
| react-router-dom 7 | Routing |
| @supabase/supabase-js | Backend client |
| tailwindcss 4 | Styling |
| react-hook-form | Form handling |
| react-hot-toast | Notifications |
| i18next / react-i18next | Internationalization |
| @dnd-kit | Drag & drop (Kanban) |
| recharts | Charts |
| swiper | Carousels |
| @img-comparison-slider/react | Before/after images |

---

## 10. Supabase MCP Tools

When working with the database, use these MCP tools:

- `supabase_list_tables` - List all tables
- `supabase_execute_sql` - Run queries
- `supabase_apply_migration` - Run DDL migrations
- `supabase_get_logs` - View service logs
- `supabase_generate_typescript_types` - Generate DB types

