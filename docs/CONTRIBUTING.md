# Contributing to Universal AI App Generator

Thank you for your interest in contributing to the Universal AI App Generator! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)

## Code of Conduct

This project adheres to a code of conduct that all contributors are expected to follow:

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git
- A code editor (VS Code recommended)

### Setup Development Environment

1. Fork the repository on GitHub

2. Clone your fork:
```bash
git clone https://github.com/YOUR_USERNAME/theaidashboard.git
cd theaidashboard
```

3. Add the upstream repository:
```bash
git remote add upstream https://github.com/original/theaidashboard.git
```

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npm run dev
```

### Recommended VS Code Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- GitLens

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch for integration
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Creating a Feature Branch

```bash
# Update your local repository
git checkout develop
git pull upstream develop

# Create a new feature branch
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in the feature branch
2. Write or update tests as needed
3. Ensure all tests pass: `npm test`
4. Run linting: `npm run lint`
5. Build the project: `npm run build`

### Committing Changes

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(quality-labs): add AI test generation feature"
git commit -m "fix(deployment): resolve deployment progress tracking bug"
git commit -m "docs(readme): update installation instructions"
```

## Project Structure

```
src/
├── components/          # React components
│   ├── [Feature].tsx   # Feature components
│   └── ...
├── hooks/              # Custom React hooks
│   ├── use[Feature].ts # Feature hooks
│   └── ...
├── types/              # TypeScript type definitions
│   └── index.ts
├── data/               # Mock data and constants
│   └── mockData.ts
├── utils/              # Utility functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

### Component Guidelines

**Functional Components:**
```typescript
import React from 'react';
import type { ComponentProps } from '../types';

interface Props {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

export default MyComponent;
```

**Custom Hooks:**
```typescript
import { useState, useCallback } from 'react';
import type { DataType } from '../types';

export const useMyFeature = () => {
  const [data, setData] = useState<DataType[]>([]);

  const updateData = useCallback((newData: DataType) => {
    setData(prev => [...prev, newData]);
  }, []);

  return {
    data,
    updateData
  };
};
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types for all props and state
- Avoid `any` type - use `unknown` if type is truly unknown
- Use type inference where appropriate
- Define interfaces for complex objects

**Good:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = (id: string): User | null => {
  // implementation
};
```

**Bad:**
```typescript
const getUser = (id: any): any => {
  // implementation
};
```

### React Best Practices

1. **Use Functional Components:**
```typescript
// Good
const MyComponent: React.FC<Props> = ({ prop }) => {
  return <div>{prop}</div>;
};

// Avoid
class MyComponent extends React.Component {
  render() {
    return <div>{this.props.prop}</div>;
  }
}
```

2. **Use Hooks Properly:**
```typescript
// Good
const MyComponent = () => {
  const [state, setState] = useState(0);

  useEffect(() => {
    // effect logic
  }, [state]);

  return <div>{state}</div>;
};

// Bad - hooks in conditional
const MyComponent = () => {
  if (condition) {
    const [state, setState] = useState(0); // Wrong!
  }
};
```

3. **Memoization:**
```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // render logic
});

// Use useCallback for callbacks passed to children
const Parent = () => {
  const handleClick = useCallback(() => {
    // logic
  }, [dependencies]);

  return <Child onClick={handleClick} />;
};

// Use useMemo for expensive calculations
const computed = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### Styling with Tailwind CSS

1. **Use Utility Classes:**
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-900">Title</h2>
</div>
```

2. **Responsive Design:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* content */}
</div>
```

3. **Dynamic Classes:**
```tsx
const statusColor = status === 'active'
  ? 'bg-green-500'
  : 'bg-gray-500';

<span className={`px-2 py-1 rounded ${statusColor}`}>
  {status}
</span>
```

### File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `QualityLabs.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useQualityLabs.ts`)
- Types: `PascalCase` for interfaces and types
- Utilities: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE`

### Code Organization

```typescript
// 1. Imports (external first, then internal)
import React, { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';
import { useCustomHook } from '../hooks/useCustomHook';
import type { TypeName } from '../types';

// 2. Type definitions
interface Props {
  // ...
}

// 3. Constants
const CONSTANT_VALUE = 'value';

// 4. Component
const Component: React.FC<Props> = (props) => {
  // 4.1. Hooks
  const [state, setState] = useState();
  const { data } = useCustomHook();

  // 4.2. Effects
  useEffect(() => {
    // effect logic
  }, []);

  // 4.3. Handlers
  const handleClick = () => {
    // handler logic
  };

  // 4.4. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 5. Export
export default Component;
```

## Testing Guidelines

### Unit Tests

Write unit tests for:
- Custom hooks
- Utility functions
- Complex business logic

```typescript
// useQualityLabs.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useQualityLabs } from './useQualityLabs';

describe('useQualityLabs', () => {
  it('should run all tests', async () => {
    const { result } = renderHook(() => useQualityLabs());

    await act(async () => {
      await result.current.runAllTests();
    });

    expect(result.current.activeTestRun).toBeDefined();
  });
});
```

### Integration Tests

Test component integration with hooks:

```typescript
// QualityLabs.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import QualityLabs from './QualityLabs';

describe('QualityLabs', () => {
  it('should display test suites', () => {
    render(<QualityLabs />);

    expect(screen.getByText('Unit Tests')).toBeInTheDocument();
    expect(screen.getByText('Integration Tests')).toBeInTheDocument();
  });

  it('should run tests when button clicked', async () => {
    render(<QualityLabs />);

    const runButton = screen.getByText('Run All Tests');
    fireEvent.click(runButton);

    // Assert test execution started
  });
});
```

### Test Coverage

Aim for:
- 90%+ coverage for hooks and utilities
- 80%+ coverage for components
- 100% coverage for critical business logic

Run coverage:
```bash
npm run test:coverage
```

## Pull Request Process

### Before Submitting

1. Update your branch with the latest changes:
```bash
git checkout develop
git pull upstream develop
git checkout your-feature-branch
git rebase develop
```

2. Ensure all tests pass:
```bash
npm test
```

3. Run linting:
```bash
npm run lint
```

4. Build the project:
```bash
npm run build
```

### Submitting a Pull Request

1. Push your branch to your fork:
```bash
git push origin feature/your-feature-name
```

2. Go to GitHub and create a Pull Request

3. Fill out the PR template with:
   - Description of changes
   - Related issue number (if applicable)
   - Screenshots (for UI changes)
   - Testing performed
   - Checklist confirmation

### PR Template

```markdown
## Description
Brief description of the changes

## Related Issue
Fixes #(issue number)

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review performed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added and passing
- [ ] Dependent changes merged
```

### Review Process

- PRs require at least one approval from a maintainer
- Address all review comments
- Keep PRs focused and small when possible
- Be responsive to feedback

## Issue Guidelines

### Creating an Issue

Use the appropriate issue template:

**Bug Report:**
```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS:
- Browser:
- Node version:
- npm version:

## Screenshots
If applicable
```

**Feature Request:**
```markdown
## Feature Description
Clear description of the feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other solutions you've thought about

## Additional Context
Any other relevant information
```

### Issue Labels

- `bug`: Something isn't working
- `feature`: New feature request
- `documentation`: Documentation improvements
- `enhancement`: Improvement to existing feature
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention needed
- `priority: high`: High priority
- `priority: low`: Low priority

## Development Best Practices

### Performance

1. **Lazy Loading:**
```typescript
const QualityLabs = React.lazy(() => import('./components/QualityLabs'));
```

2. **Code Splitting:**
```typescript
// Separate bundle for heavy dependencies
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));
```

3. **Memoization:**
```typescript
const ExpensiveComponent = React.memo(Component);
```

### Accessibility

1. **Semantic HTML:**
```tsx
<nav aria-label="Main navigation">
  <button aria-label="Open menu">Menu</button>
</nav>
```

2. **Keyboard Navigation:**
```tsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</div>
```

3. **ARIA Labels:**
```tsx
<button aria-label="Close dialog">
  <X className="w-4 h-4" />
</button>
```

### Security

1. **Sanitize User Input:**
```typescript
import DOMPurify from 'dompurify';

const sanitized = DOMPurify.sanitize(userInput);
```

2. **Avoid Dangerous Props:**
```tsx
// Avoid
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// Prefer
<div>{userContent}</div>
```

3. **Environment Variables:**
```typescript
// Never commit .env files
// Use VITE_ prefix for public variables
const apiUrl = import.meta.env.VITE_API_URL;
```

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## Questions?

- Check existing issues and discussions
- Join our Discord community
- Email: dev@theaidashboard.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Universal AI App Generator! 🚀
