import React, { createContext, useContext, useState, ReactNode } from "react"

type Language = "en" | "es"

interface Translations {
  [key: string]: {
    en: string
    es: string
  }
}

export const translations: Translations = {
  "app.title": { en: "Signal Desk", es: "Mesa de Señales" },
  "app.subtitle": { en: "Transmit • Track • Route Signals", es: "Transmitir • Rastrear • Enrutar Señales" },
  "action.transmit": { en: "Transmit Signal", es: "Transmitir Señal" },
  "action.transmitting": { en: "Transmitting...", es: "Transmitiendo..." },
  "action.track": { en: "Track Signal", es: "Rastrear Señal" },
  "action.search": { en: "Search", es: "Buscar" },
  "action.checkStatus": { en: "Check Request Status", es: "Verificar Estado" },
  "action.submitAnother": { en: "Submit Another", es: "Enviar Otra" },
  "action.openQueue": { en: "Open Queue", es: "Abrir Cola" },
  "action.activeSignals": { en: "Active Signals", es: "Señales Activas" },
  "form.identity": { en: "◇ Identity", es: "◇ Identidad" },
  "form.identity.placeholder": { en: "Your name", es: "Tu nombre" },
  "form.identity.connected": { en: "Connected via Telegram", es: "Conectado vía Telegram" },
  "form.identity.notConnected": { en: "Enter your name (Telegram not detected)", es: "Ingresa tu nombre (Telegram no detectado)" },
  "form.signalType": { en: "✦ Signal Type", es: "✦ Tipo de Señal" },
  "form.signalType.placeholder": { en: "Select signal type", es: "Selecciona el tipo de señal" },
  "form.project": { en: "Project / Brand", es: "Proyecto / Marca" },
  "form.project.optional": { en: "(optional)", es: "(opcional)" },
  "form.project.placeholder": { en: "Related project or brand", es: "Proyecto o marca relacionada" },
  "form.payload": { en: "✧ Signal Payload", es: "✧ Carga de la Señal" },
  "form.payload.placeholder": { en: "Describe your request, issue, or idea…", es: "Describe tu solicitud, problema o idea…" },
  "form.payload.help": { en: "What do you want us to do or help with?", es: "¿En qué quieres que te ayudemos o qué deseas hacer?" },
  "form.noDMs": { en: "No DMs. Signals are routed through the system.", es: "Cero DMs. Las señales se enrutan a través del sistema." },
  "footer.tagline": {
    en: "🐾 Forged with a frisky paw and a daring heart.",
    es: "🐾 Forged with a frisky paw and a daring heart." // Preserving protected brand phrase
  },
  "footer.matters1": { en: "Your ", es: "Tu " },
  "footer.matters2": { en: "Signal", es: "Señal" },
  "footer.matters3": { en: " matters.", es: " importa." },
  "footer.forward": { en: "We're here to move it forward.", es: "Estamos aquí para avanzar." },
  "submitted.title": { en: "Signal Received", es: "Señal Recibida" },
  "submitted.ticketId": { en: "Ticket ID", es: "ID de Ticket" },
  "submitted.desc1": { en: "Your request is now in the system.", es: "Tu solicitud ya está en el sistema." },
  "submitted.desc2": { en: "Track it with your Ticket ID.", es: "Rastréala con tu ID de Ticket." },
  "submitted.desc3": { en: "No DMs. The desk will handle it from here.", es: "Cero DMs. La mesa se encargará a partir de ahora." },
  "submitted.saveHint": { en: "Save your Ticket ID to check status at any time.", es: "Guarda tu ID de Ticket para verificar el estado en cualquier momento." },
  "status.notFound": { en: "Signal not found. Please verify your Ticket ID and try again.", es: "Señal no encontrada. Verifica tu ID de Ticket e intenta nuevamente." },
  "status.timeline.title": { en: "Signal Status", es: "Estado de la Señal" },
  "status.timeline.ping": { en: "Last ping:", es: "Último ping:" },
  "error.fillRequired": { en: "Please fill in all required fields", es: "Por favor, completa todos los campos requeridos" },
  "error.submitFailed": { en: "Failed to submit signal. Please try again.", es: "Error al enviar la señal. Intenta de nuevo." }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string) => {
    return translations[key]?.[language] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
