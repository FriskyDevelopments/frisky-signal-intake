## 2025-05-14 - [Route-based Code Splitting]
**Learning:** Implementing `React.lazy` for route components reduced the initial JavaScript bundle size from ~584kB to ~306kB (a ~47% reduction). This is particularly effective in this application as it separates the public intake/status pages from the more complex operator console and detail pages.
**Action:** Always consider lazy loading for distinct page-level components to minimize the "Initial Load" time, especially when there's a clear split between user-facing and admin/internal-facing interfaces.
