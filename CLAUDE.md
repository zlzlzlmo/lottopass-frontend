# CLAUDE.md

This file provides comprehensive guidance to Claude Code (claude.ai/code) when working with the LottoPass monorepo.

## Project Overview

LottoPass is a modern lottery statistics and information platform built as a monorepo supporting both web and mobile applications. The project uses cutting-edge technologies and follows enterprise-grade architectural patterns.

## Custom Commands

Claude Code has been configured with powerful custom commands to accelerate development. Use these commands to automate common tasks:

### Feature Development
- `/init-feature <name>` - Initialize a new feature module with standard structure
- `/migrate-component <path>` - Migrate legacy components to latest patterns

### Testing & Quality
- `/test-component <path>` - Generate and run component tests
- `/check-a11y <path>` - Check and fix accessibility issues
- `/perf-audit [app]` - Run performance audit and get optimization suggestions

### Code Generation & Optimization
- `/api-types <endpoint>` - Generate TypeScript types from API responses
- `/optimize-bundle [app]` - Analyze and optimize bundle size
- `/refactor-imports [path]` - Clean up and optimize import statements
- `/generate-docs [scope]` - Auto-generate documentation

### Product Planning & Strategy
- `/product-ideas [options]` - Generate strategic product ideas and improvements (Korean market aware)
- `/analyze-project [options]` - Comprehensive project analysis and health check
- `/improve-ux [options]` - UI/UX improvement suggestions and best practices
- `/suggest-features [options]` - Innovative feature ideas based on user needs
- `/review-architecture [options]` - Deep technical architecture review and optimization

### DevOps & Monitoring
- `/setup-monitoring <service>` - Configure application monitoring

See `commands/` directory for detailed documentation of each command.

## Architecture

### Monorepo Structure
```
lottopass-frontend/
├── apps/
│   ├── web/          # Next.js 15 web application
│   └── mobile/       # React Native mobile application
├── packages/
│   ├── core/         # Business logic and services
│   ├── ui-universal/ # Shared UI components (web & mobile)
│   ├── ui/           # Platform-specific UI (Tamagui)
│   ├── shared/       # Shared types and utilities
│   ├── stores/       # State management (Zustand)
│   └── api-client/   # API client and hooks
└── src/              # Legacy Vite React app (being migrated)
```

### Technology Stack

#### Core Technologies
- **Monorepo**: Turborepo with pnpm workspaces
- **TypeScript**: 5.7+ with strict mode
- **React**: 19.1.0 (latest stable)
- **State Management**: 
  - Zustand for client state
  - TanStack Query v5 for server state
- **Styling**: 
  - Tailwind CSS for web
  - Tamagui for cross-platform
  - CSS-in-JS with emotion for specific needs

#### Web Stack
- **Framework**: Next.js 15 (App Router)
- **Build Tool**: Turbopack (Next.js built-in)
- **UI Library**: Shadcn/ui (copy-paste pattern)
- **Animation**: Framer Motion
- **Charts**: Chart.js with react-chartjs-2

#### Mobile Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **UI Library**: Tamagui (universal components)
- **Native Features**: Expo SDK

#### Backend Integration
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **External APIs**: 
  - 동행복권 API (lottery data)
  - Vercel Functions for CORS proxy

## Essential Commands

### Development
```bash
# Legacy Vite app
npm run dev          # Start development server (Vite)
npm run build        # Build for production (runs npm install --legacy-peer-deps first)
npm run start        # Preview production build

# Monorepo commands
pnpm dev             # Start all apps in dev mode
pnpm web             # Start only web app
pnpm mobile          # Start only mobile app
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run test         # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Monorepo
pnpm lint            # Run ESLint across monorepo
pnpm type-check      # Run TypeScript checks
pnpm test            # Run all tests
```

### Package Management
```bash
# Add dependency to specific workspace
pnpm add <package> --filter=@lottopass/web

# Add dev dependency to root
pnpm add -D <package> -w

# Update all dependencies
pnpm update -r
```

## Development Guidelines

### Code Organization

#### Feature-Based Structure
Each feature should be self-contained with:
```
features/
└── lottery-stats/
    ├── components/
    ├── hooks/
    ├── services/
    ├── types/
    └── index.ts
```

#### Shared Code Principles
1. **Business Logic**: Always in `@lottopass/core`
2. **UI Components**: 
   - Universal components in `@lottopass/ui-universal`
   - Platform-specific in respective apps
3. **Types**: Shared types in `@lottopass/shared`
4. **State**: Global state in `@lottopass/stores`

### TypeScript Best Practices

```typescript
// ✅ Good: Use strict types
interface LotteryDraw {
  id: string;
  numbers: readonly [number, number, number, number, number, number];
  bonusNumber: number;
  drawDate: Date;
}

// ❌ Bad: Avoid any
const processData = (data: any) => { ... }

// ✅ Good: Use unknown and type guards
const processData = (data: unknown) => {
  if (isLotteryDraw(data)) {
    // Process safely
  }
}
```

### React Patterns

#### Component Structure
```typescript
// ✅ Preferred: Function components with TypeScript
interface Props {
  title: string;
  onAction: () => void;
}

export const Component: React.FC<Props> = ({ title, onAction }) => {
  // Implementation
};

// ✅ Use React 19 features
const [isPending, startTransition] = useTransition();
const [optimisticState, setOptimistic] = useOptimistic(state);
```

#### State Management
```typescript
// ✅ Server state with TanStack Query
const { data, isPending } = useQuery({
  queryKey: ['lottery', roundNumber],
  queryFn: () => fetchLotteryData(roundNumber),
});

// ✅ Client state with Zustand
const useStore = create<State>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

### Performance Optimization

1. **Code Splitting**: Use dynamic imports for routes
2. **Lazy Loading**: Implement with React.lazy and Suspense
3. **Memoization**: Use React Compiler (automatic) or manual memo
4. **Bundle Size**: Keep initial JS under 170KB

### Testing Strategy

```typescript
// ✅ Test user behavior, not implementation
test('user can select lottery numbers', async () => {
  render(<NumberSelector />);
  
  const number7 = screen.getByText('7');
  await userEvent.click(number7);
  
  expect(number7).toHaveAttribute('data-selected', 'true');
});
```

## Legacy App Architecture (src/)

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

### Korean Market Considerations

- **Regulatory Compliance**: No mobile lottery purchases allowed (PC web only)
- **Purchase Limits**: 5,000원 weekly limit for online purchases
- **Target Demographics**: 40-50대 중심의 보수적 시장
- **Key Features**: QR 당첨 확인, 판매점 찾기, 소비 관리
- See `KOREAN_LOTTO_ANALYSIS.md` for detailed market analysis

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

## API Integration

### Lottery Data Service
```typescript
// Use the centralized service from @lottopass/core
import { DrawService } from '@lottopass/core';

const drawService = DrawService.getInstance();
const latestDraw = await drawService.getLatestDrawResult();
```

### Authentication
```typescript
// Use Supabase client from @lottopass/core
import { supabase } from '@lottopass/core';

const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

## Deployment

### Environment Variables
```env
# Required for all environments
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# API endpoints
NEXT_PUBLIC_API_BASE_URL=
VITE_API_BASE_URL= # For legacy Vite app
```

### Build Configuration
- **Web**: Optimized for Vercel deployment
- **Mobile**: Expo EAS Build for app stores
- **Preview**: Automatic deployments for PRs

## Migration Notes

Currently migrating from:
- Redux Toolkit → Zustand + TanStack Query
- Vite → Next.js 15 (web)
- Ant Design → Shadcn/ui + Tailwind CSS
- JavaScript → TypeScript (strict mode)

## Common Issues & Solutions

### CORS Issues
- Use Vercel Functions as proxy for external APIs
- Configure proper headers in next.config.js

### Type Errors
- Run `pnpm type-check` to catch errors early
- Use `pnpm build` to ensure production builds work

### Performance Issues
- Check bundle size with `pnpm analyze`
- Use React DevTools Profiler
- Implement proper code splitting

## Best Practices Summary

1. **Always use TypeScript** with strict mode
2. **Separate concerns** between packages
3. **Test user behavior**, not implementation
4. **Optimize for performance** from the start
5. **Follow React 19 patterns** and best practices
6. **Use monorepo features** for efficient development
7. **Document complex logic** with JSDoc comments

## AI-Powered Development Workflow

### 1. Planning Mode (Shift+Tab twice)
Use planning mode for complex tasks to:
- Research codebase patterns before implementation
- Create comprehensive implementation strategies
- Avoid accidental modifications during exploration

### 2. Proactive Tool Usage
- **Search First**: Use Grep/Glob before making assumptions about code structure
- **Batch Operations**: Run multiple tool calls in parallel for efficiency
- **Context Awareness**: Leverage CLAUDE.md for project-specific knowledge

### 3. Code Quality Automation
- Run `npm run lint` and `npm run test` after significant changes
- Use `/check-a11y` for accessibility compliance
- Execute `/perf-audit` before major releases

### 4. Intelligent Code Generation
- Use `/api-types` to maintain type safety with external APIs
- Apply `/migrate-component` for gradual modernization
- Leverage `/generate-docs` for automatic documentation

### 5. Performance Optimization
- Monitor bundle size with `/optimize-bundle`
- Profile components with `/perf-audit --components`
- Clean imports regularly with `/refactor-imports`

### 6. Testing Strategy
- Use `/test-component` for comprehensive test generation
- Include accessibility tests by default
- Focus on user interactions over implementation details

### 7. Feature Development Flow
1. Plan with `/init-feature` to create standard structure
2. Implement with type-safe patterns
3. Test with `/test-component`
4. Optimize with `/perf-audit`
5. Document with `/generate-docs`

### 8. Continuous Improvement
- Use Exa MCP for researching latest best practices
- Reference Context7 MCP for framework documentation
- Keep commands updated based on team feedback