import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { lazy, Suspense } from "react"

// Route-based code splitting to improve initial load performance
// and separate operator console logic from public intake pages.
const IntakePage = lazy(() => import("./components/IntakePage").then(m => ({ default: m.IntakePage })))
const SubmittedPage = lazy(() => import("./components/SubmittedPage").then(m => ({ default: m.SubmittedPage })))
const StatusPage = lazy(() => import("./components/StatusPage").then(m => ({ default: m.StatusPage })))
const ConsolePage = lazy(() => import("./components/ConsolePage").then(m => ({ default: m.ConsolePage })))
const SignalDetailPage = lazy(() => import("./components/SignalDetailPage").then(m => ({ default: m.SignalDetailPage })))

// Simple loading fallback for lazy-loaded routes
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="animate-pulse text-muted-foreground uppercase tracking-widest text-sm">
      Loading Signal Desk...
    </div>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<IntakePage />} />
          <Route path="/submitted/:ticketId" element={<SubmittedPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/console" element={<ConsolePage />} />
          <Route path="/console/signal/:signalId" element={<SignalDetailPage />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" theme="dark" />
    </BrowserRouter>
  )
}

export default App
