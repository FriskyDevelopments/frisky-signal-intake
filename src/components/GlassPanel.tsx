import { ReactNode, memo } from "react"
import { cn } from "@/lib/utils"

interface GlassPanelProps {
  children: ReactNode
  className?: string
  id?: string
}

export const GlassPanel = memo(function GlassPanel({ children, className, id }: GlassPanelProps) {
  return (
    <div id={id} className={cn("glass-panel rounded-lg p-6", className)}>
      {children}
    </div>
  )
})
