# /product-ideas

## Description
Analyzes the current codebase and generates strategic product ideas for features, UI/UX improvements, and architectural enhancements. For Korean lottery (로또) projects, it considers local regulations and market characteristics.

## Usage
```bash
/product-ideas [options]
```

## Options
- `--focus <area>` - Specific area to focus on: `features`, `ui-ux`, `architecture`, `performance`, `monetization`, `korean-market`
- `--persona <type>` - Target user persona: `casual`, `power-user`, `enterprise`, `korean-40s`, `korean-50s`
- `--timeline <period>` - Implementation timeline: `quick-win` (1-2 weeks), `medium` (1-2 months), `long-term` (3+ months)
- `--market <region>` - Target market: `global`, `korea` (considers local regulations)

## Examples
```bash
# Generate comprehensive product ideas
/product-ideas

# Focus on UI/UX improvements for casual users
/product-ideas --focus ui-ux --persona casual

# Quick win features for power users
/product-ideas --focus features --persona power-user --timeline quick-win

# Long-term architecture improvements
/product-ideas --focus architecture --timeline long-term

# Korean market specific ideas
/product-ideas --market korea --persona korean-40s --focus features

# Quick wins for Korean lottery market
/product-ideas --market korea --timeline quick-win --focus korean-market
```

## Implementation

This command will:

1. **Analyze Current State**
   - Review existing features and codebase structure
   - Identify gaps and opportunities
   - Check user flow and experience patterns

2. **Generate Ideas Based on Analysis**
   - Feature enhancements aligned with lottery industry trends
   - UI/UX improvements based on modern design patterns
   - Architecture optimizations for scalability
   - Performance enhancements
   - Monetization strategies

3. **Prioritize and Structure Ideas**
   - Impact vs Effort matrix
   - User value assessment
   - Technical feasibility
   - Business value alignment

4. **Output Format**
   - Executive summary
   - Detailed proposals with rationale
   - Implementation roadmap
   - Success metrics
   - Resource requirements

## Sample Output Structure

```markdown
# LottoPass Product Ideas Report

## Executive Summary
Brief overview of key recommendations...

## Feature Enhancements
### 1. Smart Number Prediction Engine
- **Description**: AI-powered number suggestions based on statistical analysis
- **User Value**: Increase engagement and perceived value
- **Technical Approach**: Implement ML model with TensorFlow.js
- **Timeline**: 4-6 weeks
- **Success Metrics**: User engagement, retention rate

### 2. Social Lottery Pools
- **Description**: Create and manage lottery pools with friends
- **User Value**: Social engagement and shared excitement
- **Technical Approach**: Real-time collaboration with Supabase
- **Timeline**: 6-8 weeks
- **Success Metrics**: Pool creation rate, viral coefficient

## UI/UX Improvements
### 1. Personalized Dashboard
- **Current State**: Generic dashboard for all users
- **Improvement**: Adaptive UI based on user behavior
- **Implementation**: User preference system with Zustand
- **Impact**: 30% increase in daily active users

### 2. Progressive Disclosure
- **Current State**: Complex statistics shown upfront
- **Improvement**: Gradual complexity reveal
- **Implementation**: Tiered information architecture
- **Impact**: Reduced bounce rate for new users

## Architecture Enhancements
### 1. Edge Computing for Stats
- **Current**: Client-side calculations
- **Improvement**: Edge functions for faster response
- **Implementation**: Vercel Edge Functions
- **Benefits**: 50% faster load times

### 2. Offline-First Mobile
- **Current**: Online-only functionality
- **Improvement**: Core features work offline
- **Implementation**: Service Workers + IndexedDB
- **Benefits**: Better mobile experience

## Quick Wins (< 2 weeks)
1. Add haptic feedback for number selection
2. Implement number history heatmap
3. Add lucky number generator variations
4. Create shareable result cards

## Implementation Roadmap
Phase 1 (Month 1): Quick wins and UI polish
Phase 2 (Month 2-3): Core feature development
Phase 3 (Month 4-6): Architecture improvements
```

## Integration Points

- Leverages existing codebase analysis
- Uses project patterns from CLAUDE.md
- Considers current tech stack limitations
- Aligns with monorepo structure
- Respects existing user flows
- For Korean market: Considers local regulations (no mobile purchases, 5,000원 weekly limit)
- References KOREAN_LOTTO_ANALYSIS.md for market-specific insights