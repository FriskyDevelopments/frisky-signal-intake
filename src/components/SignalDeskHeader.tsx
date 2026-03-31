import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import wolfLogo from "@/assets/images/IMG_4983_2.PNG"

type HeaderVariant = "intake" | "status" | "console"

interface SignalDeskHeaderProps {
  variant?: HeaderVariant
  onTransmit?: () => void
  onTrack?: () => void
  onOpenQueue?: () => void
  onActiveSignals?: () => void
}

export function SignalDeskHeader({ 
  variant = "intake",
  onTransmit,
  onTrack,
  onOpenQueue,
  onActiveSignals
}: SignalDeskHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F1A] via-[#11131A] to-[#161925]" />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_50%,oklch(0.68_0.15_45/0.06)_0%,transparent_50%)]" />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.025] blur-3xl pointer-events-none">
        <WolfEmblem />
      </div>

      <motion.div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            repeating-conic-gradient(from 45deg at 50% 50%, transparent 0deg, oklch(0.85 0.01 270 / 0.3) 1deg, transparent 2deg 8deg)
          `
        }}
        animate={{
          rotate: [0, 360]
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px"
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="space-y-8">
            <div className="space-y-1">
              <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground/60">
                ◇ Frisky Developments
              </div>
              <div className="flex items-center gap-2">
                <img
                  src={wolfLogo}
                  alt="Frisky"
                  className="w-8 h-8 opacity-80 object-contain select-none"
                  style={{ filter: 'brightness(0.95) contrast(1.05)' }}
                />
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#EAEAF0]">
                  Signal Desk
                </h1>
              </div>
            </div>

            <div className="space-y-4 max-w-2xl">
              <p className="text-[10px] sm:text-xs text-muted-foreground/50 tracking-wide">
                🐾 Forged with a Frisky Paw and a daring heart.
              </p>
              
              <div className="text-lg sm:text-xl text-foreground/90 leading-relaxed">
                <span>Your </span>
                <span className="font-semibold bg-gradient-to-r from-[oklch(0.65_0.25_265)] via-[oklch(0.60_0.22_275)] to-[oklch(0.55_0.20_285)] bg-clip-text text-transparent drop-shadow-[0_0_8px_oklch(0.60_0.22_275/0.3)]">
                  Signal
                </span>
                <span> matters.</span>
              </div>
              
              <p className="text-base sm:text-lg text-muted-foreground">
                We're here to move it forward.
              </p>

              <p className="text-xs sm:text-sm text-muted-foreground/70 italic pt-2">
                — FriskyDevelopments
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {variant === "intake" && (
              <>
                <Button
                  onClick={onTransmit}
                  className={cn(
                    "bg-primary/90 hover:bg-primary text-primary-foreground",
                    "transition-all duration-300",
                    "hover:shadow-[0_0_24px_oklch(0.68_0.15_45/0.25)]",
                    "hover:-translate-y-0.5"
                  )}
                >
                  <span className="mr-2">✦</span>
                  Transmit Signal
                </Button>
                <Button
                  onClick={onTrack}
                  variant="outline"
                  className={cn(
                    "border-border/50 hover:border-primary/50",
                    "bg-transparent hover:bg-primary/5",
                    "transition-all duration-300"
                  )}
                >
                  <span className="mr-2">◇</span>
                  Track Signal
                </Button>
              </>
            )}

            {variant === "status" && (
              <>
                <Button
                  onClick={onTrack}
                  className={cn(
                    "bg-primary/90 hover:bg-primary text-primary-foreground",
                    "transition-all duration-300",
                    "hover:shadow-[0_0_24px_oklch(0.68_0.15_45/0.25)]",
                    "hover:-translate-y-0.5"
                  )}
                >
                  <span className="mr-2">◇</span>
                  Track Signal
                </Button>
                <Button
                  onClick={onTransmit}
                  variant="outline"
                  className={cn(
                    "border-border/50 hover:border-primary/50",
                    "bg-transparent hover:bg-primary/5",
                    "transition-all duration-300"
                  )}
                >
                  <span className="mr-2">✦</span>
                  Transmit Signal
                </Button>
              </>
            )}

            {variant === "console" && (
              <>
                <Button
                  onClick={onOpenQueue}
                  className={cn(
                    "bg-primary/90 hover:bg-primary text-primary-foreground",
                    "transition-all duration-300",
                    "hover:shadow-[0_0_24px_oklch(0.68_0.15_45/0.25)]",
                    "hover:-translate-y-0.5"
                  )}
                >
                  Open Queue
                </Button>
                <Button
                  onClick={onActiveSignals}
                  variant="outline"
                  className={cn(
                    "border-border/50 hover:border-primary/50",
                    "bg-transparent hover:bg-primary/5",
                    "transition-all duration-300"
                  )}
                >
                  Active Signals
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
    </div>
  )
}

function WolfEmblem() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M100 30 L70 60 L60 50 L50 70 L45 65 L40 85 L50 95 L45 110 L55 120 L50 140 L65 145 L70 160 L85 155 L100 170 L115 155 L130 160 L135 145 L150 140 L145 120 L155 110 L150 95 L160 85 L155 65 L150 70 L140 50 L130 60 Z"
        fill="currentColor"
        className="text-foreground"
      />
      <circle cx="80" cy="85" r="6" fill="currentColor" className="text-background" />
      <circle cx="120" cy="85" r="6" fill="currentColor" className="text-background" />
      <path
        d="M90 105 Q100 115 110 105"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        className="text-background"
        fill="none"
      />
      <path
        d="M75 75 L85 80 M125 75 L115 80"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-background"
      />
    </svg>
  )
}
