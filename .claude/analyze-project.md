# /analyze-project

## Description
Performs comprehensive analysis of the LottoPass project, identifying strengths, improvement areas, and strategic development opportunities.

## Usage
```bash
/analyze-project [options]
```

## Options
- `--depth <level>` - Analysis depth: `overview` (quick), `standard` (default), `deep` (exhaustive)
- `--output <format>` - Output format: `summary`, `detailed` (default), `executive`
- `--focus <areas>` - Comma-separated focus areas: `code-quality,performance,scalability,maintainability,security`

## Examples
```bash
# Comprehensive project analysis
/analyze-project

# Quick overview for stakeholders
/analyze-project --depth overview --output executive

# Deep dive into performance and scalability
/analyze-project --depth deep --focus performance,scalability

# Standard analysis with summary output
/analyze-project --output summary
```

## Analysis Framework

### 1. Codebase Health Assessment
- **Code Quality Metrics**
  - TypeScript coverage and strictness
  - ESLint violations and code consistency
  - Test coverage and quality
  - Documentation completeness
  
- **Technical Debt Evaluation**
  - Legacy code identification
  - Deprecated dependencies
  - Architectural anti-patterns
  - Migration progress tracking

### 2. Architecture Analysis
- **Structure & Organization**
  - Monorepo effectiveness
  - Package boundaries and dependencies
  - Code coupling and cohesion
  - Separation of concerns

- **Scalability Assessment**
  - Performance bottlenecks
  - Bundle size optimization
  - Database query efficiency
  - API design patterns

### 3. Development Experience
- **Developer Productivity**
  - Build times and hot reload speed
  - Development workflow efficiency
  - Tooling and automation coverage
  - Debugging capabilities

- **Team Collaboration**
  - Code review process
  - Documentation quality
  - Onboarding experience
  - Knowledge sharing

### 4. User Experience Analysis
- **Performance Metrics**
  - Page load times
  - Time to interactive
  - Core Web Vitals scores
  - Mobile performance

- **Feature Completeness**
  - User journey mapping
  - Feature adoption rates
  - Pain point identification
  - Competitive analysis

### 5. Business Alignment
- **Market Positioning**
  - Feature differentiation
  - Target audience fit
  - Growth opportunities
  - Monetization potential

- **Risk Assessment**
  - Security vulnerabilities
  - Compliance requirements
  - Technical risks
  - Business continuity

## Output Structure

```markdown
# LottoPass Project Analysis Report

## Executive Summary
- Overall Health Score: 85/100
- Key Strengths: Modern tech stack, good architecture
- Critical Issues: Bundle size, test coverage
- Strategic Opportunities: Mobile optimization, AI features

## Detailed Analysis

### 📊 Code Quality (Score: 87/100)
#### Strengths
- ✅ 95% TypeScript coverage with strict mode
- ✅ Consistent code style with automated formatting
- ✅ Well-organized monorepo structure

#### Areas for Improvement
- ⚠️ Test coverage at 68% (target: 80%)
- ⚠️ Some components exceed 300 lines
- ⚠️ Inconsistent error handling patterns

### 🏗️ Architecture (Score: 82/100)
#### Strengths
- ✅ Clear separation between packages
- ✅ Efficient state management with Zustand
- ✅ Good API abstraction layers

#### Recommendations
1. Implement domain-driven design patterns
2. Add service worker for offline support
3. Optimize database queries with indexes

### 🚀 Performance (Score: 78/100)
#### Current Metrics
- First Contentful Paint: 1.2s
- Time to Interactive: 2.8s
- Bundle Size: 245KB (gzipped)

#### Optimization Opportunities
1. Implement route-based code splitting
2. Lazy load heavy components
3. Use React Server Components

### 📈 Growth Opportunities
1. **AI-Powered Insights**
   - Predictive analytics for number patterns
   - Personalized recommendations
   - Estimated impact: +40% user engagement

2. **Social Features**
   - Lottery pools and syndicates
   - Community predictions
   - Estimated impact: 3x viral coefficient

3. **Mobile-First Optimization**
   - Progressive Web App features
   - Native app performance
   - Estimated impact: +60% mobile retention

## Action Plan
### Immediate (1-2 weeks)
- [ ] Increase test coverage to 80%
- [ ] Optimize bundle size below 200KB
- [ ] Fix critical accessibility issues

### Short-term (1-2 months)
- [ ] Implement performance monitoring
- [ ] Add progressive enhancement
- [ ] Complete UI component migration

### Long-term (3-6 months)
- [ ] Launch AI prediction engine
- [ ] Build social features
- [ ] Scale to international markets

## Conclusion
LottoPass shows strong fundamentals with clear paths for improvement. Focus on performance optimization and user engagement features will drive significant growth.
```

## Integration with Other Commands
- Use with `/product-ideas` for feature planning
- Combine with `/perf-audit` for detailed performance analysis
- Follow up with `/improve-ux` for UI/UX enhancements
- Apply `/review-architecture` for deep technical review