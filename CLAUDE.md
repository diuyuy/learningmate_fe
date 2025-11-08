# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LearningMate Frontend - A React-based learning platform built with Vite, TypeScript, and modern React patterns. The application helps users manage study materials, articles, reviews, and learning progress with Korean (KST) timezone support.

## Development Commands

```bash
# Development
yarn dev              # Start dev server (Vite)
yarn build            # Type check with tsc -b, then build for production
yarn start            # Preview production build locally
yarn lint             # Run ESLint
yarn format           # Format code with Prettier

# Storybook (if needed)
yarn storybook        # Run Storybook on port 6006
yarn build-storybook  # Build Storybook for production
```

**Important**: This project uses Yarn 4.9.2 (check `packageManager` in package.json). Always use `yarn` commands, not `npm`.

## Environment Variables

The application requires `VITE_BASE_URL` environment variable:
- Set in `.env` file (not committed to git)
- Used in `src/lib/axios.ts` for API base URL configuration
- Access via `import.meta.env.VITE_BASE_URL`

## Architecture Overview

### Feature-Based Structure

The codebase follows a feature-based modular architecture. Each feature is self-contained in `src/features/[feature-name]/`:

```
src/features/[feature-name]/
├── api/          # API calls using axios
├── components/   # Feature-specific React components
├── hooks/        # Custom React hooks for the feature
├── store/        # Zustand state management
├── types/        # TypeScript types/interfaces
└── utils/        # Feature-specific utility functions (if needed)
```

**Existing features**: `admin`, `articles`, `auth`, `calendar`, `keywords`, `members`, `quizzes`, `recommends`, `reviews`, `statistics`, `studies`, `videos`

When adding new functionality, follow this structure. Place code in the appropriate feature directory.

### Key Directories

- **`src/pages/`**: Top-level page components (e.g., `MainPage.tsx`, `LearningPage.tsx`)
- **`src/layouts/`**: Layout components including `ProtectedRoute`, `AuthLayout`, `RootLayout`
- **`src/components/`**: Shared/global components (Header, Footer, UI primitives in `ui/`)
- **`src/router/`**: React Router configuration (`router.tsx`)
- **`src/lib/`**: Core utilities:
  - `axios.ts`: Axios instance with interceptors for auth token refresh
  - `timezone.ts`: KST timezone utilities using `date-fns` and `@date-fns/tz`
  - `useKstMidnightRollover.ts`: Hook that invalidates queries at KST midnight
  - `utils.ts`: General utilities (e.g., `cn` for class names)
- **`src/providers/`**: React context providers (QueryProvider for TanStack Query)
- **`src/constants/`**: Shared constants (route paths, query keys, missions)
- **`src/hooks/`**: Global/shared custom hooks
- **`src/types/`**: Global TypeScript type definitions

### Path Aliases

Use `@/*` imports to reference `src/` directory:
```typescript
import { api } from '@/lib/axios';
import { ROUTE_PATHS } from '@/constants/routepaths';
```

Configured in `tsconfig.json` and `vite.config.ts`.

## Core Patterns

### Authentication & Session Management

- **Session Context**: `src/features/auth/context/SessionProvider.tsx` provides global auth state
  - Use `useSession()` hook to access: `isLoggedIn`, `member`, `logout`, `provideSession`, `updateMember`
  - Session is loaded on app initialization via `fetchMember()`
- **Protected Routes**: `src/layouts/ProtectedRoute.tsx` wraps authenticated pages
- **Token Management**: Axios interceptors in `src/lib/axios.ts` handle:
  - Automatic token refresh on 401 errors
  - Request queuing during refresh
  - Automatic logout if refresh fails

### Data Fetching

- **TanStack Query**: Primary data fetching library (configured in `src/providers/QueryProvider.tsx`)
- **Pattern**: Each feature has:
  - `api/api.ts` - Raw API calls using `api` from `@/lib/axios`
  - `hooks/` - React Query hooks (e.g., `useArticleQuery`, `useReviewMutation`)
- **Query Keys**: Centralized in `src/constants/querykeys.ts`
- **Example**:
  ```typescript
  // api/api.ts
  export const fetchArticle = async (articleId: number) => {
    const response = await api.get(`/articles/${articleId}`);
    return response.data.result as Article;
  };

  // hooks/useArticleQuery.ts
  export const useArticleQuery = (articleId: number) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ARTICLES, articleId],
      queryFn: () => fetchArticle(articleId),
    });
  };
  ```

### State Management

- **TanStack Query**: Server state (API data)
- **Zustand**: Local UI state (e.g., modal open/close, filters)
  - Each feature can have its own store in `store/store.ts`
- **Context API**: Global app state (auth session)

### Timezone Handling

This app is built for Korean users and uses KST (Asia/Seoul) timezone throughout:

- **`src/lib/timezone.ts`**: Comprehensive utilities for KST operations
- **Key functions**:
  - `kstDateKey(date)`: Convert any date to `'yyyy-MM-dd'` in KST
  - `isSameKSTDay(a, b)`: Compare if two dates are the same KST day
  - `formatKST(date, format)`: Format dates in KST
  - `coerceNaiveAsUTC(iso)`: Backend sends naive ISO strings; treat as UTC
- **Midnight Rollover**: `useKstMidnightRollover()` in `main.tsx` automatically invalidates keyword, review, and calendar queries at KST midnight

### Routing

- **React Router v7**: Configured in `src/router/router.tsx`
- **Structure**:
  - `/` - Landing page (with loader to fetch member data)
  - Protected routes (require auth):
    - `/main` - Main page
    - `/learning` - Learning page
    - `/article/:articleId` - Article detail
    - `/my` - User profile
    - `/admin` - Admin page
  - Auth routes:
    - `/login`, `/signup` - Authentication
    - `/password-resets` - Password reset flow
  - `/oauth-redirect` - OAuth callback handler

### Styling

- **Tailwind CSS v4**: Configured with `@tailwindcss/vite` plugin
- **shadcn/ui**: Component library (components in `src/components/ui/`)
- **Utilities**: Use `cn()` from `@/lib/utils` to merge Tailwind classes conditionally

## Common Development Tasks

### Adding a New Feature

1. Create feature directory: `src/features/[feature-name]/`
2. Create subdirectories: `api/`, `components/`, `hooks/`, `types/`, `store/` (as needed)
3. Define types in `types/types.ts`
4. Create API functions in `api/api.ts` using `api` from `@/lib/axios`
5. Create React Query hooks in `hooks/`
6. Build components in `components/`
7. Add routes in `src/router/router.tsx` if needed
8. Add query keys to `src/constants/querykeys.ts`

### Working with Dates

Always use the KST utilities from `@/lib/timezone`:
- Backend returns naive ISO strings - parse with `coerceNaiveAsUTC()` or use `kstDateKeyFromBackend()`
- Display dates using `formatKST()`
- Compare dates using `isSameKSTDay()` or `kstDateKey()`

### API Calls

- Use `api` instance from `@/lib/axios` (includes auth interceptors)
- API calls are automatically configured with `withCredentials: true` for cookie-based auth
- Don't manually handle 401 errors - interceptors handle token refresh

### Form Handling

- **react-hook-form**: Form state management
- **zod**: Schema validation (with `@hookform/resolvers`)
- Pattern: Define Zod schema → use with `useForm` → connect to shadcn/ui form components

## Technology Stack

- **Framework**: React 19 + TypeScript 5.8
- **Build Tool**: Vite 7
- **Routing**: React Router 7
- **Data Fetching**: TanStack Query v5 + Axios
- **State**: Zustand, React Context
- **Forms**: react-hook-form + zod
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives + shadcn/ui
- **Icons**: lucide-react, react-icons
- **Animation**: framer-motion
- **Dates**: date-fns + @date-fns/tz
- **i18n**: react-intl (configured for ko-KR)
- **Package Manager**: Yarn 4.9.2

## Code Quality

- **ESLint**: Configured with `eslint.config.js`
- **Prettier**: Configured with `.prettierrc`
- Format before committing: `yarn format`
- Lint before committing: `yarn lint`
