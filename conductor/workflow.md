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

### Parallel Mode (agents)

When several tracks run at the same time with agents, each phase checkpoint is split in two:

**Phase checkpoint (automated, gated by the main agent).** The track agent implements one phase, commits, and stops with a report: commits, command output, and the phase's Verification items marked done or pending. The main agent reruns the checks in that worktree, reviews the diff against the spec and the plan's Verification list, and then either sends the agent on to the next phase or sends back concrete fixes. Automated checks:

1. `npm run check`, `npm run test` and `npm run build` pass
2. No hex colors outside `tokens.css` (filament stock excepted), no icons or emojis
3. Copy matches BUILD.md exactly; headings, `aria-*` and decorative `aria-hidden` as the spec says
4. Any track-specific checks in the plan that can run from the command line (e.g. no Three.js in the initial bundle)

**Visual checkpoint (manual, once per track).** When all phases are approved, the developer runs `npm run dev -- --port <port>` in the track's worktree and does every visual/manual Verification item of the track at once (reference breakpoints, forced hours, screen reader, keyboard). The branch is merged only after this passes.

Rules:

- One worktree and branch per track, created from the integration branch (`feature/rebrand` for the rebrand series).
- Track agents do not edit `conductor/tracks.md`; it is updated when the track is merged.
- New variants in shared `ui/` primitives go to the integration branch first, then the track branches rebase.
- Merge one track at a time with `--no-ff`, running `npm run check && npm run build` after each merge.
- High-risk tracks (e.g. the 3D viewer) get one extra independent code review before the visual checkpoint.

## Task Lifecycle

1. **Pending** - Task is defined but not started
2. **In Progress** - Actively being worked on
3. **Completed** - Implementation done and verified

## Branch Strategy

- `main` - Production (auto-deploys to CloudFront)
- `develop` - Development/staging (auto-deploys to CloudFront)
- Feature branches from `develop` for new work
