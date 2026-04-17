## 2026-04-13 - [Initial Performance Review]
**Learning:** Found that all page components are statically imported in App.tsx, causing the entire application (including the internal operator console) to be loaded upfront even for public users.
**Action:** Implement route-based code splitting using React.lazy and Suspense to improve initial load performance.

## 2025-05-15 - [Console Performance Optimizations]
**Learning:** In list-heavy pages like the Signal Queue, repeated expensive operations (Intl.DateTimeFormat instantiation, string conversions, and complex filtering) within the render loop significantly impact responsiveness.
**Action:** Pre-allocate expensive objects outside component scopes, hoist constant operations (like .toLowerCase()) out of filter loops, and use early-exit patterns to minimize processing time.

## 2026-04-17 - [Single-Pass Search Optimization]
**Learning:** Combining filtering and secondary derivations (like counting active items) into a single 'for...of' loop inside useMemo avoids multiple array traversals.
**Action:** Always prefer a single-pass loop when multiple derived states are needed from the same filtered dataset.
