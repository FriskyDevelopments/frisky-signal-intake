import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"

// Route-based code splitting to improve initial load performance
const IntakePage = lazy(() => import("./components/IntakePage").then(m => ({ default: m.IntakePage })))
const SubmittedPage = lazy(() => import("./components/SubmittedPage").then(m => ({ default: m.SubmittedPage })))
const StatusPage = lazy(() => import("./components/StatusPage").then(m => ({ default: m.StatusPage })))
const ConsolePage = lazy(() => import("./components/ConsolePage").then(m => ({ default: m.ConsolePage })))
const SignalDetailPage = lazy(() => import("./components/SignalDetailPage").then(m => ({ default: m.SignalDetailPage })))

// Simple loading fallback for Suspense
const Loading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
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
