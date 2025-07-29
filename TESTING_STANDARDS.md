# Testing Standards

Comprehensive testing guidelines for the LottoPass monorepo, ensuring quality and reliability across all applications.

## Table of Contents
1. [Testing Philosophy](#testing-philosophy)
2. [Test Structure](#test-structure)
3. [Unit Testing](#unit-testing)
4. [Integration Testing](#integration-testing)
5. [Component Testing](#component-testing)
6. [E2E Testing](#e2e-testing)
7. [Performance Testing](#performance-testing)
8. [Accessibility Testing](#accessibility-testing)
9. [AI-Generated Test Guidelines](#ai-generated-test-guidelines)

## Testing Philosophy

### Core Principles

1. **Test Behavior, Not Implementation**
   - Focus on what the code does, not how it does it
   - Tests should survive refactoring
   - User-centric test scenarios

2. **Testing Pyramid**
   ```
        /\
       /E2E\
      /------\
     /  Integ  \
    /------------\
   /   Unit Tests  \
   ----------------
   ```
   - Many unit tests (fast, isolated)
   - Some integration tests (component interactions)
   - Few E2E tests (critical user paths)

3. **Coverage Goals**
   - Minimum: 80% overall coverage
   - Critical paths: 100% coverage
   - New code: 90% coverage
   - Focus on quality over quantity

## Test Structure

### File Organization
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.stories.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useAuth.test.ts
├── utils/
│   ├── validation.ts
│   └── validation.test.ts
└── __tests__/
    ├── integration/
    └── e2e/
```

### Test File Naming
- Unit tests: `[name].test.ts(x)`
- Integration tests: `[feature].integration.test.ts`
- E2E tests: `[flow].e2e.test.ts`

## Unit Testing

### Basic Structure
```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('FeatureName', () => {
  // Setup
  beforeEach(() => {
    // Reset state before each test
  });

  describe('methodName', () => {
    it('should handle normal case', () => {
      // Arrange
      const input = { value: 42 };
      
      // Act
      const result = processValue(input);
      
      // Assert
      expect(result).toBe(84);
    });

    it('should handle edge case', () => {
      // Test edge cases
    });

    it('should handle error case', () => {
      // Test error scenarios
    });
  });
});
```

### Testing Utilities

#### Custom Matchers
```typescript
// test-utils/matchers.ts
expect.extend({
  toBeValidLotteryNumber(received: number) {
    const pass = received >= 1 && received <= 45;
    return {
      pass,
      message: () => 
        `expected ${received} to be a valid lottery number (1-45)`,
    };
  },
});
```

#### Test Factories
```typescript
// test-utils/factories.ts
export const createMockDraw = (overrides?: Partial<Draw>): Draw => ({
  id: 'draw_123',
  numbers: [1, 2, 3, 4, 5, 6],
  bonusNumber: 7,
  date: new Date('2024-01-01'),
  ...overrides,
});
```

### Mocking Best Practices

#### Module Mocking
```typescript
// Mock external modules
vi.mock('@/services/api', () => ({
  fetchDraw: vi.fn(),
}));

// Mock with implementation
vi.mock('@/utils/storage', () => ({
  storage: {
    get: vi.fn(() => 'mocked-value'),
    set: vi.fn(),
    clear: vi.fn(),
  },
}));
```

#### Spy and Stub
```typescript
import { vi, expect } from 'vitest';

it('should call API with correct parameters', async () => {
  const fetchSpy = vi.spyOn(api, 'fetch');
  
  await service.getData('123');
  
  expect(fetchSpy).toHaveBeenCalledWith('/api/data/123', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
});
```

## Component Testing

### React Testing Library

#### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('LotteryNumberSelector', () => {
  it('should allow selecting 6 numbers', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    
    render(<LotteryNumberSelector onSelect={onSelect} />);
    
    // Select 6 numbers
    for (const num of [7, 13, 21, 28, 35, 42]) {
      const button = screen.getByRole('button', { name: num.toString() });
      await user.click(button);
    }
    
    // Verify selection
    expect(onSelect).toHaveBeenCalledWith([7, 13, 21, 28, 35, 42]);
    
    // Verify no more selections allowed
    const button = screen.getByRole('button', { name: '1' });
    expect(button).toBeDisabled();
  });
});
```

#### Testing Hooks
```typescript
import { renderHook, act } from '@testing-library/react';
import { useLotteryStats } from './useLotteryStats';

describe('useLotteryStats', () => {
  it('should calculate frequency correctly', () => {
    const { result } = renderHook(() => 
      useLotteryStats([
        { numbers: [1, 2, 3, 4, 5, 6] },
        { numbers: [1, 7, 8, 9, 10, 11] },
      ])
    );
    
    expect(result.current.frequency[1]).toBe(2);
    expect(result.current.frequency[2]).toBe(1);
  });
});
```

#### Testing with Context
```typescript
import { render } from '@testing-library/react';
import { AuthProvider } from '@/contexts/auth';

const renderWithAuth = (ui: React.ReactElement, options = {}) => {
  return render(
    <AuthProvider initialUser={mockUser}>
      {ui}
    </AuthProvider>,
    options
  );
};

it('should show user profile when authenticated', () => {
  renderWithAuth(<Header />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### Testing Async Components

```typescript
import { waitFor, screen } from '@testing-library/react';

it('should load and display lottery results', async () => {
  render(<LotteryResults drawId="123" />);
  
  // Check loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  // Wait for data to load
  await waitFor(() => {
    expect(screen.getByText('Draw #123')).toBeInTheDocument();
  });
  
  // Verify numbers displayed
  expect(screen.getByText('7')).toHaveClass('lottery-ball');
});
```

## Integration Testing

### API Integration Tests
```typescript
// __tests__/integration/lottery-api.test.ts
import { createServer } from '@/test-utils/server';
import { LotteryService } from '@/services/lottery';

describe('Lottery API Integration', () => {
  let server: TestServer;
  let service: LotteryService;
  
  beforeAll(() => {
    server = createServer();
    service = new LotteryService(server.url);
  });
  
  afterAll(() => server.close());
  
  it('should fetch and transform draw data', async () => {
    server.mock('/api/draws/latest', {
      id: 'draw_123',
      numbers: '1,2,3,4,5,6',
      bonus: 7,
    });
    
    const draw = await service.getLatestDraw();
    
    expect(draw).toEqual({
      id: 'draw_123',
      numbers: [1, 2, 3, 4, 5, 6],
      bonusNumber: 7,
    });
  });
});
```

### Database Integration Tests
```typescript
import { setupTestDB, teardownTestDB } from '@/test-utils/db';
import { UserRepository } from '@/repositories/user';

describe('User Repository Integration', () => {
  let db: TestDatabase;
  let repo: UserRepository;
  
  beforeEach(async () => {
    db = await setupTestDB();
    repo = new UserRepository(db);
  });
  
  afterEach(() => teardownTestDB(db));
  
  it('should create and retrieve user', async () => {
    const user = await repo.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    
    const retrieved = await repo.findById(user.id);
    expect(retrieved).toMatchObject({
      email: 'test@example.com',
      name: 'Test User',
    });
  });
});
```

## E2E Testing

### Playwright Setup
```typescript
// e2e/lottery-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Lottery Number Selection Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('complete number selection and purchase', async ({ page }) => {
    // Navigate to number selection
    await page.click('text=Generate Numbers');
    
    // Select generation method
    await page.click('text=Statistical Analysis');
    
    // Generate numbers
    await page.click('button:has-text("Generate")');
    
    // Verify numbers displayed
    await expect(page.locator('.lottery-numbers')).toBeVisible();
    
    // Save combination
    await page.click('text=Save Combination');
    
    // Verify saved
    await expect(page.locator('.toast')).toHaveText('Numbers saved!');
  });
});
```

### Mobile E2E Testing
```typescript
// e2e/mobile/lottery-flow.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test('mobile lottery flow', async ({ page }) => {
  await page.goto('/');
  
  // Test mobile-specific interactions
  await page.tap('text=Menu');
  await page.tap('text=Generate Numbers');
  
  // Test touch gestures
  await page.locator('.number-grid').swipe('up');
});
```

## Performance Testing

### Component Performance
```typescript
import { measureRender } from '@/test-utils/performance';

it('should render large list efficiently', async () => {
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    value: `Item ${i}`,
  }));
  
  const metrics = await measureRender(
    <VirtualList items={items} />
  );
  
  expect(metrics.renderTime).toBeLessThan(100); // ms
  expect(metrics.reRenders).toBe(0);
});
```

### Bundle Size Testing
```typescript
// __tests__/bundle-size.test.ts
import { analyzeBundleSize } from '@/test-utils/bundle';

describe('Bundle Size', () => {
  it('should not exceed size limits', async () => {
    const analysis = await analyzeBundleSize();
    
    expect(analysis.main).toBeLessThan(170_000); // 170KB
    expect(analysis.vendor).toBeLessThan(200_000); // 200KB
    
    // Check for unexpected dependencies
    expect(analysis.packages).not.toContain('moment'); // Use date-fns
  });
});
```

## Accessibility Testing

### Component Accessibility
```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should be accessible', async () => {
  const { container } = render(<LotteryForm />);
  const results = await axe(container);
  
  expect(results).toHaveNoViolations();
});
```

### Keyboard Navigation
```typescript
it('should be keyboard navigable', async () => {
  const user = userEvent.setup();
  render(<NumberSelector />);
  
  // Tab to first number
  await user.tab();
  expect(screen.getByRole('button', { name: '1' })).toHaveFocus();
  
  // Arrow navigation
  await user.keyboard('{ArrowRight}');
  expect(screen.getByRole('button', { name: '2' })).toHaveFocus();
  
  // Select with space
  await user.keyboard(' ');
  expect(screen.getByRole('button', { name: '2' })).toHaveAttribute(
    'aria-pressed',
    'true'
  );
});
```

### Screen Reader Testing
```typescript
it('should announce changes to screen readers', async () => {
  const { container } = render(<LotteryResults />);
  
  // Check for live region
  const liveRegion = container.querySelector('[aria-live]');
  expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  
  // Trigger update
  await userEvent.click(screen.getByText('Refresh'));
  
  // Verify announcement
  await waitFor(() => {
    expect(liveRegion).toHaveTextContent('Results updated');
  });
});
```

## AI-Generated Test Guidelines

### Prompting for Tests

#### Effective Test Prompts
```
Generate comprehensive tests for the LotteryNumberGenerator component:
- Test all user interactions
- Include edge cases (no numbers, max numbers)
- Test error states
- Include accessibility tests
- Mock the random number generator
- Test loading and error states
- Verify proper cleanup
```

#### Test Context Template
```typescript
/**
 * Test Requirements:
 * - Component: LotteryNumberGenerator
 * - Dependencies: NumberService, useAuth
 * - User flows: Generate, save, clear
 * - Edge cases: Network errors, invalid responses
 * - Performance: Should handle rapid clicks
 * - Accessibility: Keyboard navigation, screen reader
 */
```

### Reviewing AI-Generated Tests

#### Quality Checklist
- [ ] Tests are independent (no shared state)
- [ ] Descriptive test names
- [ ] Proper setup and teardown
- [ ] No implementation details tested
- [ ] Async operations handled correctly
- [ ] Mocks are properly restored
- [ ] Error cases covered
- [ ] Performance considerations

#### Common AI Testing Pitfalls

1. **Over-mocking**
   ```typescript
   // ❌ Bad - Mocking too much
   vi.mock('react', () => ({
     useState: vi.fn(() => [false, vi.fn()]),
   }));
   
   // ✅ Good - Mock only external dependencies
   vi.mock('@/services/api');
   ```

2. **Testing Implementation**
   ```typescript
   // ❌ Bad - Testing state directly
   expect(component.state.isLoading).toBe(true);
   
   // ✅ Good - Testing behavior
   expect(screen.getByText(/loading/i)).toBeInTheDocument();
   ```

3. **Improper Async Handling**
   ```typescript
   // ❌ Bad - No waiting
   fireEvent.click(button);
   expect(screen.getByText('Done')).toBeInTheDocument();
   
   // ✅ Good - Proper waiting
   await userEvent.click(button);
   await waitFor(() => {
     expect(screen.getByText('Done')).toBeInTheDocument();
   });
   ```

### Test Generation Commands

Use these commands for test generation:
- `/test-component <path>` - Generate component tests
- `/test-component --coverage` - Include coverage report
- `/test-component --a11y` - Focus on accessibility

## Testing Best Practices Summary

1. **Write Tests First** - TDD when possible
2. **Test Behavior** - Not implementation
3. **Keep Tests Simple** - One concept per test
4. **Use Descriptive Names** - Tests as documentation
5. **Maintain Test Quality** - Refactor tests too
6. **Run Tests Often** - In development and CI
7. **Monitor Coverage** - But don't chase 100%
8. **Test the Important** - Critical paths first
9. **Mock Sparingly** - Only external dependencies
10. **Review Test Code** - Same standards as production

Remember: Good tests give confidence to ship fast and refactor fearlessly.