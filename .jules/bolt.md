## 2026-04-13 - [Initial Performance Review]
**Learning:** Found that all page components are statically imported in App.tsx, causing the entire application (including the internal operator console) to be loaded upfront even for public users.
**Action:** Implement route-based code splitting using React.lazy and Suspense to improve initial load performance.

## 2026-04-20 - [Optimizing Console Responsiveness]
**Learning:** Search filtering in the Signal Queue was blocking the main thread, causing input lag. Additionally, redundant `new Date()` allocations inside render loops created unnecessary GC pressure.
**Action:** Implemented `useDeferredValue` for search terms to prioritize input responsiveness. Refactored date formatting to pass raw numeric timestamps directly to `Intl.DateTimeFormat`, avoiding redundant object allocations.

## 2026-04-21 - [Effective Memoization Patterns]
**Learning:** Found that several large UI components (like `SignalDeskHeader`) were wrapped in `React.memo`, but their parent components were passing unstable inline arrow functions as props, causing them to re-render on every keystroke in nearby input fields.
**Action:** Stabilized navigation and scroll handlers using `useCallback` in `IntakePage` and `StatusPage`. Memoized the static `SignalFooter` and complex `StatusTimeline` to further reduce the virtual DOM diffing overhead during high-frequency updates.

## 2026-04-22 - [Optimizing List Rendering via Component Isolation]
**Learning:** Found that `useDeferredValue` alone doesn't prevent the re-evaluation of complex JSX trees in the same component. Even if data doesn't change, React still diffs the entire tree on parent re-renders unless children are memoized components receiving stable props.
**Action:** Extracted and memoized the Signal Queue table into dedicated components. Stabilized event handlers with `useCallback` to ensure the memoization remains effective during high-frequency state updates like typing.

## 2026-04-24 - [Referential Stability Cache for Large Lists]
**Learning:** Found that even with memoization and single-pass filtering, O(N) re-renders were still occurring because indexed objects were being re-created on every data update, breaking React.memo.
**Action:** Implemented a useRef-based cache to preserve exact object references for unchanged signals. This reduces the re-render cost of a queue update from O(N) to O(1) by allowing React to skip almost all SignalRow components.
