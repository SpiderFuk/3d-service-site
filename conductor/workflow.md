# Workflow - [PRINTO]

## TDD Policy

**Flexible.** Tests are recommended for complex logic only. No testing framework is currently configured.

- Tests are encouraged for utility functions (formatters, validators, WhatsApp URL generation)
- Three.js components should be tested with mocked imports when a test framework is added
- No blocking requirement to write tests before implementation

## Commit Strategy

**Conventional Commits.** All commits follow the structured format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat` - New feature or functionality
- `fix` - Bug fix
- `refactor` - Code restructuring without behavior change
- `chore` - Maintenance, dependencies, config
- `docs` - Documentation only
- `style` - Formatting, whitespace (not CSS)
- `perf` - Performance improvement

### Scopes (common)
- `viewer` - 3D model viewer
- `loaders` - Model loading (STL, 3MF, OBJ)
- `materials` - Filament colors and materials
- `hero` - Hero section
- `layout` - Navbar, Footer
- `flags` - Feature flags
- `ui` - General UI components

## Code Review

**Optional / self-review.** Solo developer workflow. Review at your own discretion.

## Verification Checkpoints

**After each phase completion.** When all tasks in a development phase are done, manually verify the changes before moving to the next phase:

1. Run `npm run dev` and test in browser
2. Check mobile responsiveness
3. Verify Three.js rendering works correctly
4. Run `npm run check` for type errors
5. Run `npm run build` to ensure production build succeeds

## Task Lifecycle

1. **Pending** - Task is defined but not started
2. **In Progress** - Actively being worked on
3. **Completed** - Implementation done and verified

## Branch Strategy

- `main` - Production (auto-deploys to CloudFront)
- `develop` - Development/staging (auto-deploys to CloudFront)
- Feature branches from `develop` for new work
