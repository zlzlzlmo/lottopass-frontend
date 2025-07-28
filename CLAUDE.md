# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LottoPass is a comprehensive lottery statistics and information platform built with React, TypeScript, and Vite. The application provides lottery number statistics, nearby store locations, draw history details, and number generation features.

## Essential Commands

### Development
```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production (runs npm install --legacy-peer-deps first)
npm run start        # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run test         # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

## Architecture Overview

### Core Technology Stack
- **React 18.3** with TypeScript for UI
- **Redux Toolkit** for state management
- **React Query** for server state management
- **React Router v6** for routing
- **Vite** as build tool with SWC for fast refresh
- **Ant Design 5** for UI components
- **Chart.js** for data visualization
- **Sass** with CSS Modules for styling
- **Vitest** for testing
- **Vercel Functions** for serverless API (로또 데이터 프록시)
- **Supabase** for authentication, database, and real-time features

### Key Architectural Patterns

1. **State Management**
   - Redux store (`src/redux/store.ts`) manages global state with slices for:
     - `draw`: Lottery draw data
     - `location`: User location state
     - `auth`: Authentication state
   - React Query handles server-side data fetching and caching

2. **API Layer** (`src/api/`)
   - **로또 데이터** (`drawService.ts`): 동행복권 공식 API 직접 호출 (백엔드 불필요)
     - 개발환경: Vite 프록시 사용
     - 프로덕션: Vercel Functions로 CORS 우회
   - **당첨매장** (`regionService.ts`): 동행복권 크롤링 (Vercel Functions)
   - **사용자 인증** (`supabaseAuthService.ts`): Supabase Auth
   - **사용자 데이터** (`supabaseUserService.ts`): Supabase Database
   - **기록관리** (`supabaseRecordService.ts`): Supabase Database
   - 점진적 마이그레이션: `VITE_USE_SUPABASE` 환경변수로 서비스 전환

3. **Feature-Based Organization** (`src/features/`)
   - Each feature contains its Redux slice, hooks, components, and types
   - Co-located code for better maintainability

4. **Routing**
   - Centralized route definitions in `src/constants/routes.ts`
   - Protected routes using `AuthGuard` component
   - Lazy loading for code splitting

### Path Aliases

The project uses Vite path aliases for clean imports:
- `@/` → `src/`
- `@api` → `src/api`
- `@components` → `src/components`
- `@features` → `src/features`
- `@pages` → `src/pages`
- `@utils` → `src/utils`
- etc.

### Styling Architecture
- SCSS with CSS Modules for component-scoped styles
- Global styles in `src/styles/global.scss`
- Shared variables and functions auto-imported via Vite config
- PostCSS with px-to-rem conversion (1rem = 16px)

### Key Features & Pages

1. **Home** (`/`): Landing page with hero section and feature cards
2. **Number Generation** (`/number-generation`): Generate lottery numbers with various algorithms
3. **Statistics** (`/statistics`): Number frequency analysis with charts
4. **Winning Stores** (`/winning-stores`): Find lottery winners by region
5. **History** (`/history`): Browse all lottery draws
6. **Dashboard** (`/dashboard`): User's saved combinations and statistics (auth required)

### Testing Strategy
- Vitest for unit and integration tests
- Test files co-located with components (`.test.tsx`)
- Jest-DOM matchers for React testing
- Coverage reports in `./coverage/`

### Build & Deployment
- Vite builds to `dist/` directory
- Configured for Vercel deployment (`vercel.json`)
- Environment-specific HTTPS configuration for local development

### Important Dependencies
- `lottopass-shared`: Shared types/utilities from GitHub repository
- `html5-qrcode`: QR code scanning functionality
- `framer-motion`: Animation library
- `dayjs`: Date manipulation
- `@capacitor/cli`: Mobile app capabilities

### Development Notes
- Uses legacy peer deps for compatibility (`--legacy-peer-deps`)
- HTTPS enabled in development with local certificates
- Responsive design with rem units and mobile-first approach
- QR code scanning feature for lottery tickets