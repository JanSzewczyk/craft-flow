# Code Style

Conventions for writing code in this project.

## Conditional rendering

Always use the ternary operator for conditional rendering. Never use `&&` short-circuit.

```tsx
// ✓
{condition ? <Component /> : null}

// ✗
{condition && <Component />}
```

**Why:** `&&` with falsy non-boolean values (e.g. `0`, `""`) renders the value itself instead of nothing. The ternary is always explicit and safe.

This applies to all conditional expressions in JSX — single elements, fragments, and inline text.

```tsx
// ✓
{items.length > 0 ? <List items={items} /> : null}
{error ? <p className="text-error">{error}</p> : null}
{isActive ? "Aktywny" : null}

// ✗
{items.length > 0 && <List items={items} />}
{error && <p className="text-error">{error}</p>}
```
