---
description: Run unit tests and lint checks, report any failures
allowed-tools: Bash(pnpm:*)
---

# Run Tests

Execute the test suite and report results.

## Steps

1. Run lint check:
```bash
pnpm run lint
```

2. Run unit tests in CI mode:
```bash
pnpm run test:unit:ci
```

3. Run TypeScript type check:
```bash
pnpm tsc --noEmit
```

## Report Format

Summarize results:
- Lint: PASS/FAIL (error count)
- Unit Tests: X passed, Y failed
- Types: PASS/FAIL

If any failures, list the specific errors with file:line references.
