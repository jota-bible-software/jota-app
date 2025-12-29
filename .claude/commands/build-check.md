---
description: Build all packages and check for errors in the monorepo
allowed-tools: Bash(pnpm:*)
---

# Build Check

Build all packages in the monorepo and verify no errors.

## Build Steps

1. Build core package:
```bash
pnpm --filter @jota/core run build
```

2. Build adapters package:
```bash
pnpm --filter @jota/adapters run build
```

3. Build web app:
```bash
pnpm run build
```

4. Type check:
```bash
pnpm tsc --noEmit
```

## Report Format

```markdown
## Build Results

| Package | Status | Time |
|---------|--------|------|
| @jota/core | PASS/FAIL | Xs |
| @jota/adapters | PASS/FAIL | Xs |
| @jota/web | PASS/FAIL | Xs |
| TypeScript | PASS/FAIL | - |

### Errors (if any)
- file:line - Error message
```

If all builds pass, confirm the project is ready for deployment.
