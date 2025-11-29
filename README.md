# Profile App

## Testing

This project includes comprehensive tests for all functionality using multiple testing frameworks.

### Testing Frameworks

#### Vitest (Primary)
Modern testing framework for unit and integration tests.
- Fast with native ESM support
- Used for most unit tests and component tests

#### Jest (Alternative)
Traditional testing framework as an alternative approach.
- Well-established with extensive plugin ecosystem
- Good for comparison and migration scenarios

#### Cypress (E2E)
End-to-end testing for full application workflows.
- Browser-based testing
- Tests real user interactions

### Running Tests

```bash
# Run Vitest tests (primary, all tests)
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch

# Run Jest tests (alternative)
yarn test:jest

# Run Cypress E2E tests
yarn test:cypress

# Open Cypress Test Runner
yarn test:cypress:open
```

### Test Structure

#### Unit Tests (Vitest/Jest)
- **Actions** (`test/action/`): Server actions for blog, comment, email, generate, git, like, project
- **UI Components** (`test/ui/`): React components (Button, BorderProgress, Text)
- **Widgets** (`test/widgets/`): Higher-level components (Hero)
- **Lib** (`test/lib/`): Utility functions (cn for Tailwind merging)
- **Stores** (`test/stores/`): Zustand store tests
- **Helpers** (`test/helpers/`): Date, i18n, text, URL utilities

#### E2E Tests (Cypress)
- **Navigation** (`cypress/e2e/navigation.cy.ts`): Page navigation and routing
- **Blog** (`cypress/e2e/blog.cy.ts`): Blog functionality, comments, pagination

### Test Coverage

#### Vitest Results:
- 75+ passed tests from 17 test files
- Tests cover unit and integration scenarios

#### Jest Results:
- Alternative unit testing framework setup
- Ready for component and utility testing
- Configured for JavaScript/TypeScript with Babel

#### Cypress Results:
- E2E testing framework configured
- Navigation and blog functionality tests prepared
- Requires running dev server for full execution

#### Coverage Areas:
- Component rendering and interactions (Button, BorderProgress, Hero)
- Server action functionality (blog, comment, generate, git, like, project actions)
- Utility functions (cn for Tailwind merging)
- Store management (Zustand language store)
- External API integrations (GitHub, Google Gemini, GigaChat)
- Database operations (Drizzle ORM mocks)

### Writing Tests

#### Vitest Example
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Test</Button>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

#### Jest Example
```javascript
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';

test('renders button', () => {
  render(<Button>Test</Button>);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

#### Cypress E2E Example
```typescript
describe('Blog', () => {
  it('should display posts', () => {
    cy.visit('/blog');
    cy.get('[data-testid="blog-post"]').should('have.length.greaterThan', 0);
  });
});
```

### Best Practices

1. **Mock external dependencies** (database, APIs, file system)
2. **Test user interactions** using React Testing Library
3. **Use data-testid attributes** for E2E test selectors
4. **Test error states** and edge cases
5. **Mock timers** for time-dependent functionality
6. **Test accessibility** where applicable

### CI/CD Integration

Tests can be integrated into CI/CD pipelines for automated testing on commits and deployments.
