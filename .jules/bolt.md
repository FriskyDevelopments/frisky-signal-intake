## 2026-04-13 - [Initial Performance Review]
**Learning:** Found that all page components are statically imported in App.tsx, causing the entire application (including the internal operator console) to be loaded upfront even for public users.
**Action:** Implement route-based code splitting using React.lazy and Suspense to improve initial load performance.

## 2026-04-15 - [Optimizing Date Formatting and List Filtering]
**Learning:** Found that 'toLocaleString' was being called on every render within 'formatTimestamp' and that complex list filtering lacked early exits, leading to redundant string operations.
**Action:** Hoist 'Intl.DateTimeFormat' instances outside of components and prioritize simple equality checks (status/type) before expensive string inclusion searches in filter callbacks.
