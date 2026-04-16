## 2026-04-13 - [Initial Performance Review]
**Learning:** Found that all page components are statically imported in App.tsx, causing the entire application (including the internal operator console) to be loaded upfront even for public users.
**Action:** Implement route-based code splitting using React.lazy and Suspense to improve initial load performance.

## 2025-05-15 - [Console Performance Optimizations]
**Learning:** In list-heavy pages like the Signal Queue, repeated expensive operations (Intl.DateTimeFormat instantiation, string conversions, and complex filtering) within the render loop significantly impact responsiveness.
**Action:** Pre-allocate expensive objects outside component scopes, hoist constant operations (like .toLowerCase()) out of filter loops, and use early-exit patterns to minimize processing time.
