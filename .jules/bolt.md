## 2025-05-14 - [Route-based Code Splitting]
**Learning:** Implementing `React.lazy` for route components reduced the initial JavaScript bundle size from ~584kB to ~306kB (a ~47% reduction). This is particularly effective in this application as it separates the public intake/status pages from the more complex operator console and detail pages.
**Action:** Always consider lazy loading for distinct page-level components to minimize the "Initial Load" time, especially when there's a clear split between user-facing and admin/internal-facing interfaces.

## 2025-05-15 - [Console Performance Optimizations]
**Learning:** In list-heavy pages like the Signal Queue, repeated expensive operations (Intl.DateTimeFormat instantiation, string conversions, and complex filtering) within the render loop significantly impact responsiveness.
**Action:** Pre-allocate expensive objects outside component scopes, hoist constant operations (like .toLowerCase()) out of filter loops, and use early-exit patterns to minimize processing time.

## 2026-04-13 - [Initial Performance Review]
**Learning:** Found that all page components are statically imported in App.tsx, causing the entire application (including the internal operator console) to be loaded upfront even for public users.
**Action:** Implement route-based code splitting using React.lazy and Suspense to improve initial load performance.
