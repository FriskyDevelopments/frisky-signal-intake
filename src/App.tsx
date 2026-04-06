import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster } from "sonner"
import { IntakePage } from "./components/IntakePage"
import { SubmittedPage } from "./components/SubmittedPage"
import { StatusPage } from "./components/StatusPage"
import { ConsolePage } from "./components/ConsolePage"
import { SignalDetailPage } from "./components/SignalDetailPage"
import { LanguageProvider } from "./lib/i18n"

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IntakePage />} />
          <Route path="/submitted/:ticketId" element={<SubmittedPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/console" element={<ConsolePage />} />
          <Route path="/console/signal/:signalId" element={<SignalDetailPage />} />
        </Routes>
        <Toaster position="top-right" theme="dark" />
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App