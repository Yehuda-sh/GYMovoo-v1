---
globs: "**/*.{ts,tsx}"
description: Apply when working with TypeScript type definitions to maintain
  consistency and avoid duplication
alwaysApply: true
---

1. Always reuse existing types from project instead of creating duplicates
2. Types should represent actual dynamic data structures used in the application
3. Check core/types folder first before creating new types
4. Use union types from string literals only for truly dynamic values
5. Place shared types in core/types, component-specific types should be defined in the component file
6. Prefer interface over type for object definitions
7. Export types that are used in multiple files