---
description: Review staged or recent code changes for quality, patterns, and issues
allowed-tools: Bash(git:*), Read, Grep, Glob
---

# Code Review

Review code changes using the code-reviewer agent.

## Context to Gather

1. Check staged changes:
```bash
git diff --staged
```

2. If no staged changes, check unstaged:
```bash
git diff
```

3. Recent commits:
```bash
git log --oneline -5
```

## Review Focus Areas

- **Type safety**: No `any`, proper typing
- **Vue patterns**: Composition API, reactive state
- **Bible data**: Both formats handled, correct indexing
- **Security**: No exposed secrets, XSS prevention
- **Testing**: New features have tests

## Output

Provide a structured review with:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (nice to have)
- Summary
