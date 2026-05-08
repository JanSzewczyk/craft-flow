---
paths:
  - "**/*.stories.tsx"
  - "**/*.stories.ts"
  - "**/.storybook/**"
---

# Storybook stories and interaction tests

Always invoke the `testing:storybook-testing` skill before creating or modifying `*.stories.tsx`, `*.stories.ts` files, or any configuration under `.storybook/`.

The skill encodes the canonical CSF Next patterns for this project:
- `preview.meta()` / `meta.story()` (not legacy CSF 3 with `Meta` / `StoryObj`)
- `.test()` method on the story (not a separate `play` function)
- Test data only from builders in `features/{domain}/test/builders/`
- Queries like `getByText("...", { selector: '[data-slot="..."]' })` for precise targeting

Skill invocation is **mandatory** — do not write stories or interaction tests without it, even when the pattern seems obvious.
