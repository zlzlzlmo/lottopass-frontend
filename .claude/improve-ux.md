# /improve-ux

## Description
Analyzes current UI/UX implementation and provides actionable improvements based on modern design principles and user behavior patterns.

## Usage
```bash
/improve-ux [options]
```

## Options
- `--platform <type>` - Target platform: `web`, `mobile`, `all` (default)
- `--persona <type>` - User persona focus: `new-user`, `casual`, `power-user`, `all`
- `--aspect <area>` - Specific UX aspect: `onboarding`, `navigation`, `forms`, `data-viz`, `accessibility`, `performance`
- `--priority` - Sort by implementation priority

## Examples
```bash
# Comprehensive UX analysis
/improve-ux

# Mobile-specific improvements for new users
/improve-ux --platform mobile --persona new-user

# Focus on data visualization improvements
/improve-ux --aspect data-viz

# Prioritized accessibility improvements
/improve-ux --aspect accessibility --priority
```

## UX Analysis Framework

### 1. Usability Heuristics Evaluation
- **Visibility of System Status**
- **Match Between System and Real World**
- **User Control and Freedom**
- **Consistency and Standards**
- **Error Prevention**
- **Recognition Rather Than Recall**
- **Flexibility and Efficiency**
- **Aesthetic and Minimalist Design**
- **Error Recovery**
- **Help and Documentation**

### 2. User Journey Mapping
- **Entry Points**
- **Critical Paths**
- **Pain Points**
- **Drop-off Points**
- **Conversion Opportunities**

### 3. Interaction Design Patterns
- **Microinteractions**
- **Feedback Mechanisms**
- **Loading States**
- **Empty States**
- **Error States**

### 4. Visual Design Analysis
- **Typography Hierarchy**
- **Color Psychology**
- **Spacing and Layout**
- **Visual Flow**
- **Brand Consistency**

## Output Format

```markdown
# LottoPass UX Improvement Report

## Executive Summary
Current UX Score: 72/100
Quick wins available: 12
High-impact improvements: 5
Estimated user satisfaction increase: +35%

## Critical Improvements

### 🎯 1. Simplified Number Selection
**Current Issue**: Users find number selection overwhelming
**Solution**: Progressive disclosure pattern
**Implementation**:
```tsx
// Before: All 45 numbers shown at once
<NumberGrid numbers={[1...45]} />

// After: Grouped selection with smart defaults
<NumberSelector 
  quickPicks={['Lucky 7s', 'Birthday Special', 'Random']}
  advancedMode={false}
  onToggleAdvanced={() => setAdvancedMode(true)}
/>
```
**Impact**: 40% faster number selection
**Effort**: 2 days

### 📱 2. Mobile-First Navigation
**Current Issue**: Desktop-oriented navigation on mobile
**Solution**: Bottom tab navigation with gesture support
**Implementation**:
```tsx
<MobileNavigation>
  <TabBar position="bottom" hapticFeedback>
    <Tab icon="home" label="홈" />
    <Tab icon="generate" label="번호생성" primary />
    <Tab icon="history" label="기록" badge={unread} />
  </TabBar>
</MobileNavigation>
```
**Impact**: 60% reduction in navigation time
**Effort**: 3 days

### 🎨 3. Visual Hierarchy Enhancement
**Current Issue**: Important information gets lost
**Solution**: Card-based layout with clear CTAs
**Design Tokens**:
```scss
--primary-action: 48px height, high contrast
--secondary-action: 40px height, medium contrast
--info-cards: elevated with subtle shadows
--number-balls: 3D effect with gradients
```
**Impact**: 25% increase in conversion
**Effort**: 2 days

### ♿ 4. Accessibility Improvements
**Current Issue**: WCAG AA compliance at 68%
**Solutions**:
- Add ARIA labels to interactive elements
- Implement keyboard navigation
- Increase color contrast ratios
- Add screen reader announcements
**Impact**: 100% accessible to all users
**Effort**: 4 days

### ⚡ 5. Performance Perception
**Current Issue**: Feels slow despite good metrics
**Solutions**:
- Skeleton screens for loading states
- Optimistic UI updates
- Micro-animations for feedback
- Progressive image loading
**Impact**: 50% improvement in perceived speed
**Effort**: 3 days

## Quick Wins (< 1 day each)

1. **Add haptic feedback** on number selection (mobile)
2. **Implement pull-to-refresh** for latest results
3. **Show success animations** after actions
4. **Add number tooltips** showing frequency
5. **Create onboarding tour** for new users
6. **Implement dark mode** toggle
7. **Add shake-to-random** gesture
8. **Show loading progress** indicators
9. **Add swipe gestures** for navigation
10. **Implement auto-save** for selections
11. **Add contextual help** buttons
12. **Create empty state** illustrations

## Detailed Recommendations

### Onboarding Flow
```
1. Welcome Screen
   - Value proposition
   - Skip option for returning users
   
2. Quick Tutorial
   - Interactive number selection demo
   - Swipe through key features
   
3. Personalization
   - Favorite numbers setup
   - Notification preferences
   
4. First Action
   - Generate first combination
   - Immediate success feedback
```

### Form Optimization
- **Auto-advance** after number selection
- **Inline validation** with helpful messages
- **Smart defaults** based on popular choices
- **One-tap actions** for common tasks

### Data Visualization
- **Interactive charts** with touch/hover details
- **Animated transitions** between data sets
- **Color-coded patterns** for quick scanning
- **Comparison mode** for multiple draws

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Implement design system tokens
- [ ] Add accessibility framework
- [ ] Create component library

### Phase 2: Core UX (Week 3-4)
- [ ] Redesign navigation
- [ ] Optimize forms
- [ ] Enhance feedback

### Phase 3: Delight (Week 5-6)
- [ ] Add microinteractions
- [ ] Implement animations
- [ ] Polish visual design

## Success Metrics
- Task completion rate: Target +30%
- Time to first action: Target -50%
- User satisfaction: Target 4.5/5
- Accessibility score: Target 100%
- Bounce rate: Target -40%

## Next Steps
1. Run A/B tests on proposed changes
2. Gather user feedback on prototypes
3. Prioritize based on impact/effort
4. Implement in iterative sprints
```

## Related Commands
- `/analyze-project` - Get overall project health
- `/test-component` - Test UX improvements
- `/check-a11y` - Verify accessibility compliance