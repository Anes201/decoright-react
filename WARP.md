# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs TypeScript compilation first)
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run preview` - Preview the production build

### Type Checking
- TypeScript configuration uses project references (tsconfig.json, tsconfig.app.json, tsconfig.node.json)
- Type errors are caught during the build process with `tsc -b`

## Architecture Overview

### Tech Stack
- React 19 + TypeScript for the frontend
- Vite as the build tool and dev server
- Supabase for backend services and database
- Tailwind CSS for styling
- React Router for routing
- react-i18next for internationalization

### Key Architecture Patterns

#### Authentication & Authorization
- Uses Supabase Auth for authentication
- AuthProvider context wraps the app and manages user state
- Role-based access control: 'admin' and 'client' roles (stored as 'customer' in DB)
- Custom hooks: `useAuth()` provides user authentication state
- Protection components: `RequireAuth.tsx` and `RequireRole.tsx` for route protection

#### Routing Structure
- Lazy-loaded components for code splitting
- Three main route groups with separate layouts:
  - Public routes (PublicLayout) - landing, about, services, projects
  - Client routes (ClientLayout) - gallery, chat, requests, profile
  - Admin routes (AdminLayout) - dashboard, user management
- All routes defined in `src/routers/AppRoutes.tsx` and `src/routers/Paths.ts`

#### Database Integration
- Type-safe interaction with Supabase using TypeScript types generated in `src/types/database.types.ts`
- Service layer for API interactions:
  - `request.service.ts` - handles service requests
  - `chat.service.ts` - manages chat messages and file uploads
  - `portfolio.service.ts` - manages portfolio items
- Storage files uploaded to Supabase Storage in 'request-attachments' bucket

#### Component Organization
- Components organized by function in `src/components/`:
  - `auth/` - auth protection components
  - `common/` - shared components like NavBar and Footer
  - `layout/` - page layout components
- Main layouts in `src/layouts/`: AdminLayout, ClientLayout, PublicLayout

#### State Management
- Auth context for user state
- Custom hooks like `useStagedFiles.ts` for specific state needs
- Form state managed at component level (no global state library)

### Key Directories
- `src/services/` - API interaction layer
- `src/contexts/` - React context providers
- `src/hooks/` - custom React hooks
- `src/types/` - TypeScript type definitions
- `src/utils/` - utility functions (including i18n config)
- `src/constants/` - application constants
- `src/icons/` - icon components
- `src/lib/` - library configurations (like supabase client)

### Path Aliases
- `@/` - points to `src/` directory
- `@components/` - points to `src/components/` directory

### Internationalization
- Configured in `src/utils/i18n.ts`
- Uses react-i18next for translations
- English and Arabic language support appears to be configured

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

## Key Application Types
The application appears to be an interior design service platform where:
- Clients can request design services (Interior Design, Fixed Design, Decor Consultation)
- Admin can manage service requests and users
- Chat functionality is available between clients and service providers
- Portfolio items showcase previous work