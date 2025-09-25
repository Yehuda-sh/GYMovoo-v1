---
description: Apply after making changes to TypeScript types or when modifying
  type-related code
alwaysApply: true
---

1. Always run 'tsc --noEmit' after type changes to verify no type errors
2. Run 'npm run lint' if exists to check for linting errors
3. For React Native projects, verify with 'npm run typecheck' or equivalent
4. Report any errors found and fix them before completing
5. If compilation/lint commands aren't known, ask the user for the correct commands