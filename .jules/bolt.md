## 2026-04-13 - [Initial Performance Review]
**Learning:** Found that all page components are statically imported in App.tsx, causing the entire application (including the internal operator console) to be loaded upfront even for public users.
**Action:** Implement route-based code splitting using React.lazy and Suspense to improve initial load performance.

## 2026-04-20 - [Optimizing Console Responsiveness]
**Learning:** Search filtering in the Signal Queue was blocking the main thread, causing input lag. Additionally, redundant `new Date()` allocations inside render loops created unnecessary GC pressure.
**Action:** Implemented `useDeferredValue` for search terms to prioritize input responsiveness. Refactored date formatting to pass raw numeric timestamps directly to `Intl.DateTimeFormat`, avoiding redundant object allocations.

## 2026-04-21 - [Effective Memoization Patterns]
**Learning:** Found that several large UI components (like `SignalDeskHeader`) were wrapped in `React.memo`, but their parent components were passing unstable inline arrow functions as props, causing them to re-render on every keystroke in nearby input fields.
**Action:** Stabilized navigation and scroll handlers using `useCallback` in `IntakePage` and `StatusPage`. Memoized the static `SignalFooter` and complex `StatusTimeline` to further reduce the virtual DOM diffing overhead during high-frequency updates.

## 2026-04-23 - [Referential Stability in Memoized Lists]
**Learning:** React.memo on list items is often ineffective if the parent re-creates data objects in a useMemo (e.g., for indexing). Standard mapping always returns new references, breaking child memoization.
**Action:** Implement a manual cache using useRef inside useMemo to preserve stable object references for unchanged data items, ensuring React.memo can skip re-renders correctly.
