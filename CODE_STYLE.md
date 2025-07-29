# Code Style Guide

This document outlines the coding standards and conventions for the LottoPass project. These guidelines are based on industry best practices and are designed to work seamlessly with AI coding assistants.

## TypeScript

### General Rules

1. **Always use strict mode**
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "strictNullChecks": true,
       "noImplicitAny": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true
     }
   }
   ```

2. **Prefer `unknown` over `any`**
   ```typescript
   // ❌ Bad
   function processData(data: any) {
     return data.value;
   }
   
   // ✅ Good
   function processData(data: unknown) {
     if (isValidData(data)) {
       return data.value;
     }
     throw new Error('Invalid data');
   }
   ```

3. **Use type guards for runtime validation**
   ```typescript
   interface User {
     id: string;
     name: string;
   }
   
   function isUser(value: unknown): value is User {
     return (
       typeof value === 'object' &&
       value !== null &&
       'id' in value &&
       'name' in value &&
       typeof value.id === 'string' &&
       typeof value.name === 'string'
     );
   }
   ```

### Naming Conventions

- **Interfaces**: PascalCase, no `I` prefix
  ```typescript
  interface UserProfile { } // ✅
  interface IUserProfile { } // ❌
  ```

- **Types**: PascalCase
  ```typescript
  type UserRole = 'admin' | 'user';
  ```

- **Enums**: PascalCase for name, UPPER_CASE for values
  ```typescript
  enum Status {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
  }
  ```

- **Functions/Methods**: camelCase
  ```typescript
  function calculateTotal() { }
  const getUserById = () => { };
  ```

- **Constants**: UPPER_CASE with underscores
  ```typescript
  const MAX_RETRY_COUNT = 3;
  const API_BASE_URL = 'https://api.example.com';
  ```

- **File names**: 
  - Components: PascalCase (e.g., `UserProfile.tsx`)
  - Utilities/Hooks: camelCase (e.g., `useAuth.ts`, `formatDate.ts`)
  - Services: camelCase with `.service.ts` suffix (e.g., `auth.service.ts`)

### Type Definitions

1. **Prefer interfaces for objects**
   ```typescript
   // ✅ Good
   interface UserData {
     id: string;
     name: string;
   }
   
   // Use type for unions, intersections, or primitives
   type Status = 'active' | 'inactive';
   type ID = string | number;
   ```

2. **Use readonly for immutable data**
   ```typescript
   interface Config {
     readonly apiUrl: string;
     readonly maxRetries: number;
   }
   ```

3. **Avoid optional chaining in type definitions**
   ```typescript
   // ❌ Bad
   interface User {
     profile?: {
       name?: string;
       email?: string;
     };
   }
   
   // ✅ Good
   interface UserProfile {
     name: string;
     email: string;
   }
   
   interface User {
     profile?: UserProfile;
   }
   ```

## React

### Component Structure

1. **Function components only**
   ```typescript
   // ✅ Good
   export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
     return <button onClick={onClick}>{label}</button>;
   };
   
   // ❌ Bad - No class components
   class Button extends React.Component { }
   ```

2. **Props interface naming**
   ```typescript
   // Component file: Button.tsx
   interface ButtonProps {
     label: string;
     onClick: () => void;
     variant?: 'primary' | 'secondary';
   }
   
   export const Button: React.FC<ButtonProps> = (props) => {
     // ...
   };
   ```

3. **Component file structure**
   ```typescript
   // 1. Imports
   import React, { useState, useEffect } from 'react';
   import { useQuery } from '@tanstack/react-query';
   
   // 2. Type definitions
   interface Props {
     // ...
   }
   
   // 3. Component definition
   export const Component: React.FC<Props> = (props) => {
     // 4. Hooks
     const [state, setState] = useState();
     
     // 5. Effects
     useEffect(() => {
       // ...
     }, []);
     
     // 6. Event handlers
     const handleClick = () => {
       // ...
     };
     
     // 7. Render
     return <div>...</div>;
   };
   ```

### Hooks

1. **Custom hooks naming**
   ```typescript
   // Always start with 'use'
   function useAuth() { }
   function useLocalStorage() { }
   ```

2. **Hook dependencies**
   ```typescript
   // ✅ Good - All dependencies listed
   useEffect(() => {
     fetchData(userId);
   }, [userId, fetchData]);
   
   // ❌ Bad - Missing dependencies
   useEffect(() => {
     fetchData(userId);
   }, []);
   ```

3. **Prefer multiple useState over single object**
   ```typescript
   // ✅ Good
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   
   // ❌ Bad
   const [form, setForm] = useState({ name: '', email: '' });
   ```

### State Management

1. **TanStack Query for server state**
   ```typescript
   // ✅ Good
   const { data, isPending, error } = useQuery({
     queryKey: ['users', userId],
     queryFn: () => fetchUser(userId),
   });
   ```

2. **Zustand for client state**
   ```typescript
   // ✅ Good
   const useStore = create<State>((set) => ({
     count: 0,
     increment: () => set((state) => ({ count: state.count + 1 })),
   }));
   ```

## Styling

### CSS/SCSS Conventions

1. **Use CSS Modules for component styles**
   ```scss
   // Button.module.scss
   .button {
     padding: 0.5rem 1rem;
     
     &--primary {
       background: var(--primary-color);
     }
     
     &--secondary {
       background: var(--secondary-color);
     }
   }
   ```

2. **Use CSS variables for theming**
   ```scss
   :root {
     --primary-color: #3b82f6;
     --secondary-color: #8b5cf6;
     --text-color: #1f2937;
     --background-color: #ffffff;
   }
   ```

3. **Mobile-first approach**
   ```scss
   .container {
     padding: 1rem;
     
     @media (min-width: 768px) {
       padding: 2rem;
     }
     
     @media (min-width: 1024px) {
       padding: 3rem;
     }
   }
   ```

## Testing

### Test Structure

1. **Describe blocks for organization**
   ```typescript
   describe('UserProfile', () => {
     describe('when user is logged in', () => {
       it('should display user name', () => {
         // ...
       });
     });
     
     describe('when user is logged out', () => {
       it('should redirect to login', () => {
         // ...
       });
     });
   });
   ```

2. **Test user behavior, not implementation**
   ```typescript
   // ✅ Good
   it('should allow user to select lottery numbers', async () => {
     render(<NumberSelector />);
     
     const number7 = screen.getByText('7');
     await userEvent.click(number7);
     
     expect(screen.getByText('Selected: 7')).toBeInTheDocument();
   });
   
   // ❌ Bad
   it('should call setState when clicked', () => {
     // Testing implementation details
   });
   ```

## Git Commit Messages

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements

### Examples
```
feat(lottery): add number frequency analysis

- Implement frequency calculation for lottery numbers
- Add visualization with Chart.js
- Include last 100 draws in analysis

Closes #123
```

```
fix(auth): resolve token refresh race condition

Prevent multiple simultaneous token refresh requests
by implementing request queue

Fixes #456
```

## Code Organization

### Import Order

1. React/Next.js imports
2. Third-party library imports
3. Internal package imports (`@lottopass/*`)
4. Relative imports
5. Style imports

```typescript
// 1. React/Next.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 2. Third-party
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';

// 3. Internal packages
import { DrawService } from '@lottopass/core';
import { Button } from '@lottopass/ui';

// 4. Relative imports
import { formatNumber } from '../utils';
import { UserProfile } from './UserProfile';

// 5. Styles
import styles from './Component.module.scss';
```

### File Organization

```
feature/
├── components/
│   ├── FeatureComponent.tsx
│   ├── FeatureComponent.test.tsx
│   └── FeatureComponent.module.scss
├── hooks/
│   ├── useFeatureData.ts
│   └── useFeatureData.test.ts
├── services/
│   ├── feature.service.ts
│   └── feature.service.test.ts
├── types/
│   └── feature.types.ts
└── index.ts
```

## Performance Guidelines

1. **Use React.memo sparingly**
   ```typescript
   // Only for expensive components
   export const ExpensiveList = React.memo(({ items }) => {
     // Complex rendering logic
   });
   ```

2. **Lazy load routes**
   ```typescript
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   ```

3. **Optimize images**
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/hero.jpg"
     alt="Hero"
     width={1200}
     height={600}
     priority
   />
   ```

## Accessibility

1. **Always include ARIA labels**
   ```typescript
   <button aria-label="Close dialog">×</button>
   ```

2. **Use semantic HTML**
   ```typescript
   // ✅ Good
   <nav>
     <ul>
       <li><a href="/home">Home</a></li>
     </ul>
   </nav>
   
   // ❌ Bad
   <div class="nav">
     <div class="nav-item">Home</div>
   </div>
   ```

3. **Keyboard navigation support**
   ```typescript
   <div
     role="button"
     tabIndex={0}
     onKeyDown={(e) => {
       if (e.key === 'Enter' || e.key === ' ') {
         handleClick();
       }
     }}
   >
     Click me
   </div>
   ```

## Security

1. **Sanitize user input**
   ```typescript
   import DOMPurify from 'dompurify';
   
   const sanitizedHtml = DOMPurify.sanitize(userInput);
   ```

2. **Never expose sensitive data**
   ```typescript
   // ❌ Bad
   console.log('API Key:', process.env.API_KEY);
   
   // ✅ Good
   console.log('API configured');
   ```

3. **Validate data from external sources**
   ```typescript
   import { z } from 'zod';
   
   const UserSchema = z.object({
     id: z.string(),
     email: z.string().email(),
   });
   
   const user = UserSchema.parse(apiResponse);
   ```

## AI-Assisted Development Guidelines

### Working with AI Coding Assistants

1. **Provide Clear Context**
   ```typescript
   /**
    * Lottery number generator that creates combinations based on statistical analysis
    * 
    * Requirements:
    * - Generate 6 unique numbers between 1-45
    * - Optional bonus number between 1-45
    * - Must not include more than 3 consecutive numbers
    * - Should balance odd/even distribution
    * 
    * @param options - Generation options including exclude numbers and patterns
    * @returns Array of 6 main numbers and 1 bonus number
    */
   export function generateNumbers(options?: GenerationOptions): LotteryNumbers {
     // Implementation
   }
   ```

2. **Document AI Usage**
   ```typescript
   // AI-GENERATED: Statistical analysis algorithm for number frequency
   // Reviewed by: @username on 2024-01-15
   // Modifications: Added edge case handling for empty datasets
   export function analyzeFrequency(draws: Draw[]): FrequencyMap {
     // Implementation
   }
   ```

3. **AI Prompt Templates**
   ```typescript
   // When asking AI to generate code, include:
   // 1. Function purpose and context
   // 2. Input/output types
   // 3. Performance requirements
   // 4. Error handling expectations
   // 5. Testing requirements
   
   // Example prompt:
   // "Create a React hook that fetches lottery statistics with:
   // - TanStack Query for caching
   // - Proper TypeScript types
   // - Error boundary support
   // - Loading and error states
   // - Tests using React Testing Library"
   ```

### AI Code Review Checklist

Before accepting AI-generated code:

- [ ] Follows TypeScript strict mode
- [ ] Includes proper error handling
- [ ] Has comprehensive JSDoc comments
- [ ] Passes all linting rules
- [ ] Includes unit tests
- [ ] No hardcoded values or magic numbers
- [ ] Follows project naming conventions
- [ ] Implements proper logging
- [ ] Handles edge cases
- [ ] Optimized for performance

### Prompt Engineering Best Practices

1. **Structure Your Prompts**
   ```
   Task: [What you want to achieve]
   Context: [Project details, constraints]
   Requirements:
   - [Specific requirement 1]
   - [Specific requirement 2]
   Example: [Optional code example]
   Constraints: [Performance, security, etc.]
   ```

2. **Iterative Refinement**
   - Start with high-level requirements
   - Review generated code
   - Request specific improvements
   - Validate against style guide

3. **Security Considerations**
   - Never share sensitive data in prompts
   - Review all API endpoints for security
   - Validate input sanitization
   - Check for exposed credentials

## Monorepo-Specific Guidelines

### Package Boundaries

1. **Clear Separation of Concerns**
   ```typescript
   // @lottopass/core - Business logic only
   export class LotteryService {
     // No UI dependencies
   }
   
   // @lottopass/ui - Presentation components
   export const LotteryDisplay: React.FC = () => {
     // No business logic
   }
   ```

2. **Shared Types**
   ```typescript
   // @lottopass/shared/types
   export interface LotteryDraw {
     id: string;
     numbers: number[];
     date: Date;
   }
   ```

3. **Cross-Package Imports**
   ```typescript
   // ✅ Good
   import { DrawService } from '@lottopass/core';
   import type { User } from '@lottopass/shared';
   
   // ❌ Bad - Direct file imports
   import { something } from '../../../packages/core/src/something';
   ```

## Documentation Standards

### Component Documentation

```typescript
/**
 * Button component with multiple variants and states
 * 
 * @example
 * ```tsx
 * <Button 
 *   variant="primary" 
 *   onClick={handleClick}
 *   loading={isLoading}
 * >
 *   Submit
 * </Button>
 * ```
 * 
 * @see {@link https://design.lottopass.com/components/button} Design System
 */
export const Button: React.FC<ButtonProps> = (props) => {
  // Implementation
};
```

### API Documentation

```typescript
/**
 * Fetches lottery draw results with caching
 * 
 * @param drawNumber - The draw number to fetch
 * @param options - Query options
 * @throws {DrawNotFoundError} When draw doesn't exist
 * @returns Promise resolving to draw data
 * 
 * @example
 * ```ts
 * const draw = await fetchDraw(1234, { 
 *   cache: true,
 *   retries: 3 
 * });
 * ```
 */
export async function fetchDraw(
  drawNumber: number, 
  options?: FetchOptions
): Promise<Draw> {
  // Implementation
}
```

## Code Quality Metrics

### Target Metrics
- Test Coverage: ≥ 80%
- Bundle Size: < 170KB initial load
- Lighthouse Score: ≥ 90
- TypeScript Strict: 100% compliance
- Zero `any` types
- Zero ESLint warnings

### Enforcement Tools
- `/enforce-style` - Style guide compliance
- `/check-conventions` - Architecture validation
- `/perf-audit` - Performance analysis
- `/check-a11y` - Accessibility audit