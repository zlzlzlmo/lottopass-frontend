# /review-architecture

## Description
Performs deep technical review of the codebase architecture, identifying optimization opportunities, potential issues, and modernization paths.

## Usage
```bash
/review-architecture [options]
```

## Options
- `--scope <area>` - Review scope: `frontend`, `backend`, `database`, `infrastructure`, `all` (default)
- `--framework <name>` - Focus on specific framework: `react`, `nextjs`, `react-native`, `all`
- `--concern <type>` - Architecture concern: `performance`, `scalability`, `security`, `maintainability`, `testability`
- `--depth <level>` - Analysis depth: `high-level`, `detailed` (default), `exhaustive`

## Examples
```bash
# Comprehensive architecture review
/review-architecture

# Frontend performance deep dive
/review-architecture --scope frontend --concern performance --depth exhaustive

# React/Next.js specific review
/review-architecture --framework nextjs --concern scalability

# Security-focused review
/review-architecture --concern security
```

## Architecture Review Framework

### 1. Structural Analysis
- **Dependency Graph**: Package relationships and coupling
- **Layer Separation**: Clean architecture principles
- **Module Boundaries**: Interface segregation
- **Code Organization**: Feature vs technical grouping

### 2. Pattern Assessment
- **Design Patterns**: Usage and appropriateness
- **Anti-patterns**: Code smells and violations
- **Best Practices**: Framework-specific guidelines
- **Consistency**: Pattern uniformity across codebase

### 3. Quality Attributes
- **Performance**: Rendering, bundling, runtime efficiency
- **Scalability**: Horizontal/vertical scaling capabilities
- **Security**: Vulnerability assessment
- **Maintainability**: Code complexity metrics
- **Testability**: Test infrastructure and coverage

### 4. Technology Evaluation
- **Stack Appropriateness**: Right tool for the job
- **Version Management**: Dependency updates
- **Future-proofing**: Emerging technology adoption
- **Technical Debt**: Migration and upgrade paths

## Output Format

```markdown
# LottoPass Architecture Review

## Executive Summary
- **Architecture Score**: 83/100
- **Critical Issues**: 2
- **Improvement Opportunities**: 8
- **Technical Debt**: Moderate (23%)
- **Modernization Priority**: High

## Architecture Overview

### Current State
```
┌─────────────────────────────────────────────────────┐
│                   Frontend Apps                      │
├──────────────────────┬──────────────────────────────┤
│    Web (Next.js)     │    Mobile (React Native)     │
├──────────────────────┴──────────────────────────────┤
│                 Shared Packages                      │
├────────┬────────┬──────────┬───────────┬───────────┤
│  Core  │   UI   │  Stores  │ API Client│  Shared   │
├────────┴────────┴──────────┴───────────┴───────────┤
│                Backend Services                      │
├──────────────────────┬──────────────────────────────┤
│   Supabase (Auth/DB) │  Vercel Functions (APIs)    │
└──────────────────────┴──────────────────────────────┘
```

## Critical Issues

### 🚨 1. Bundle Size Optimization
**Severity**: High
**Current State**: 245KB gzipped (target: <170KB)
**Root Causes**:
- Large dependencies not tree-shaken
- Duplicate code across packages
- Unused exports included

**Solution Architecture**:
```typescript
// webpack.config.js optimization
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
}

// Package-level optimization
// packages/ui/package.json
{
  "sideEffects": ["*.css"],
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./components/*": {
      "import": "./dist/components/*.mjs"
    }
  }
}
```

### 🚨 2. State Management Complexity
**Severity**: Medium
**Current State**: Mixed Redux + Zustand + React Query
**Issues**:
- Overlapping responsibilities
- Inconsistent patterns
- Memory leaks in subscriptions

**Recommended Architecture**:
```typescript
// Unified state architecture
interface StateArchitecture {
  // Client state: Zustand only
  ui: UIStore         // UI state (modals, themes)
  user: UserStore     // User preferences
  app: AppStore       // App-level state
  
  // Server state: TanStack Query only
  api: {
    lottery: QueryClient  // Lottery data
    user: QueryClient     // User data
    stats: QueryClient    // Statistics
  }
}

// Clear separation of concerns
const useStore = create<State>()    // Client state
const useQuery = tanstack.useQuery  // Server state
```

## Improvement Opportunities

### 1. Micro-Frontend Architecture
**Current**: Monolithic apps
**Proposed**: Module federation
**Benefits**:
- Independent deployments
- Team autonomy
- Reduced bundle sizes

```typescript
// Module federation config
const ModuleFederationPlugin = {
  name: 'lottery_host',
  remotes: {
    stats: 'stats@http://localhost:3001/remoteEntry.js',
    generator: 'generator@http://localhost:3002/remoteEntry.js'
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
}
```

### 2. Edge Computing Architecture
**Current**: Client-heavy computations
**Proposed**: Edge functions for data processing
**Implementation**:
```typescript
// Move to edge functions
export const config = { runtime: 'edge' }

export default async function handler(req: Request) {
  const stats = await computeStatistics(req)
  return new Response(JSON.stringify(stats), {
    headers: { 'Cache-Control': 's-maxage=3600' }
  })
}
```

### 3. Event-Driven Architecture
**Current**: Direct API calls
**Proposed**: Event bus pattern
**Benefits**:
- Decoupled components
- Better scalability
- Real-time updates

```typescript
// Event bus implementation
class EventBus {
  private events = new Map<string, Set<Handler>>()
  
  emit(event: string, data: any) {
    this.events.get(event)?.forEach(handler => handler(data))
  }
  
  on(event: string, handler: Handler) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }
    this.events.get(event)!.add(handler)
  }
}

// Usage
eventBus.on('lottery:draw', updateStatistics)
eventBus.on('lottery:draw', notifyUsers)
eventBus.emit('lottery:draw', drawResult)
```

### 4. Repository Pattern Implementation
**Current**: Direct Supabase calls
**Proposed**: Abstract data layer
**Benefits**:
- Testability
- Provider independence
- Caching layer

```typescript
// Repository pattern
interface LotteryRepository {
  getLatestDraw(): Promise<Draw>
  getDrawHistory(limit: number): Promise<Draw[]>
  saveUserNumbers(numbers: NumberSet): Promise<void>
}

class SupabaseLotteryRepository implements LotteryRepository {
  // Implementation details hidden
}

class CachedLotteryRepository implements LotteryRepository {
  constructor(
    private repo: LotteryRepository,
    private cache: Cache
  ) {}
  
  async getLatestDraw() {
    const cached = await this.cache.get('latest')
    if (cached) return cached
    
    const draw = await this.repo.getLatestDraw()
    await this.cache.set('latest', draw, 300)
    return draw
  }
}
```

## Performance Architecture

### Current Bottlenecks
1. **Initial Load**: 2.8s TTI
2. **Runtime Performance**: 60fps drops
3. **Memory Usage**: 120MB average

### Optimized Architecture
```typescript
// 1. Route-based code splitting
const LotteryStats = lazy(() => 
  import(/* webpackChunkName: "stats" */ './LotteryStats')
)

// 2. Virtual scrolling for lists
import { VirtualList } from '@tanstack/virtual'

// 3. Web Workers for heavy computation
const worker = new Worker(
  new URL('./stats.worker.ts', import.meta.url)
)

// 4. React Compiler optimization
'use memo'; // Automatic memoization

// 5. Streaming SSR
import { renderToReadableStream } from 'react-dom/server'
```

## Security Architecture

### Current Vulnerabilities
- API keys in client code
- Missing CSRF protection
- Weak input validation

### Secure Architecture
```typescript
// 1. Environment isolation
const config = {
  public: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL
  },
  private: {
    apiKey: process.env.API_KEY // Server only
  }
}

// 2. Input validation layer
const validateInput = z.object({
  numbers: z.array(z.number().min(1).max(45)).length(6),
  userId: z.string().uuid()
})

// 3. Security headers
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=()'
}
```

## Scalability Architecture

### Horizontal Scaling
```yaml
# Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: lottopass
        resources:
          requests:
            memory: "256Mi"
            cpu: "500m"
          limits:
            memory: "512Mi"
            cpu: "1000m"
```

### Database Optimization
```sql
-- Indexing strategy
CREATE INDEX idx_draws_date ON draws(draw_date DESC);
CREATE INDEX idx_user_numbers ON user_numbers(user_id, created_at);

-- Partitioning for scale
CREATE TABLE draws_2024 PARTITION OF draws
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

## Migration Roadmap

### Phase 1: Foundation (Month 1)
- [ ] Implement repository pattern
- [ ] Set up event bus
- [ ] Configure module federation

### Phase 2: Optimization (Month 2)
- [ ] Migrate to edge functions
- [ ] Implement caching layer
- [ ] Optimize bundle sizes

### Phase 3: Scale (Month 3)
- [ ] Deploy micro-frontends
- [ ] Implement horizontal scaling
- [ ] Add monitoring and observability

## Conclusion

The architecture shows good foundation with clear improvement paths. Focus on:
1. **Immediate**: Bundle optimization and state consolidation
2. **Short-term**: Repository pattern and edge computing
3. **Long-term**: Micro-frontends and event-driven architecture

Estimated impact:
- Performance: 40% improvement
- Scalability: 10x capacity increase
- Maintainability: 50% reduction in complexity
- Development velocity: 2x increase
```

## Related Commands
- `/analyze-project` - Overall project health
- `/perf-audit` - Performance deep dive
- `/optimize-bundle` - Bundle size optimization
- `/setup-monitoring` - Architecture observability