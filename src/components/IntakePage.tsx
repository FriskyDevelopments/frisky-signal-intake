import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassPanel } from "@/components/GlassPanel"
import { SignalDeskHeader } from "@/components/SignalDeskHeader"
import { Signal, RequestType } from "@/lib/types"
import { generateUniqueTicketId } from "@/lib/ticket-generator"
import { sendDiscordWebhook } from "@/lib/discord-webhook"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function IntakePage() {
  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const [signals, setSignals] = useKV<Signal[]>("signals", [])
  const [webhookUrl] = useKV<string>("discord-webhook-url", "")
  
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [requestType, setRequestType] = useState<RequestType | "">("")
  const [project, setProject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !contact || !requestType || !message) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      const existingIds = signals?.map(s => s.ticketId) ?? []
      const ticketId = await generateUniqueTicketId(existingIds)
      const now = Date.now()

      const newSignal: Signal = {
        id: `signal-${now}`,
        ticketId,
        name,
        contact,
        requestType: requestType as RequestType,
        project: project || undefined,
        message,
        status: "SIGNAL_RECEIVED",
        createdAt: now,
        updatedAt: now,
        notes: [],
        statusHistory: [{
          status: "SIGNAL_RECEIVED",
          timestamp: now
        }],
        isNew: true
      }

      setSignals((current) => [newSignal, ...(current ?? [])])
      
      await sendDiscordWebhook(newSignal, webhookUrl)

      navigate(`/submitted/${ticketId}`)
    } catch (error) {
      toast.error("Failed to submit signal. Please try again.")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-background">
      <SignalDeskHeader 
        variant="intake"
        onTransmit={scrollToForm}
        onTrack={() => navigate("/status")}
      />
      
      <div className="p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto"
        >

        <GlassPanel>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                ◇ Identity
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="transition-all duration-200 focus:shadow-[0_0_0_3px_oklch(0.68_0.15_45/0.15)] focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm font-medium">
                → Contact Channel
              </Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="email@example.com or @handle"
                required
                className="transition-all duration-200 focus:shadow-[0_0_0_3px_oklch(0.68_0.15_45/0.15)] focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-type" className="text-sm font-medium">
                ✦ Signal Type
              </Label>
              <Select value={requestType} onValueChange={(value) => setRequestType(value as RequestType)}>
                <SelectTrigger id="request-type" className="transition-all duration-200 focus:shadow-[0_0_0_3px_oklch(0.68_0.15_45/0.15)] focus:border-primary">
                  <SelectValue placeholder="Select signal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical Support">Technical Support</SelectItem>
                  <SelectItem value="Billing / Order Help">Billing / Order Help</SelectItem>
                  <SelectItem value="Partnership / Collaboration">Partnership / Collaboration</SelectItem>
                  <SelectItem value="Custom Build Request">Custom Build Request</SelectItem>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium text-muted-foreground">
                Project / Brand <span className="text-xs">(optional)</span>
              </Label>
              <Input
                id="project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Related project or brand"
                className="transition-all duration-200 focus:shadow-[0_0_0_3px_oklch(0.68_0.15_45/0.15)] focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                ✧ Signal Payload
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your request in detail"
                rows={6}
                required
                className="transition-all duration-200 focus:shadow-[0_0_0_3px_oklch(0.68_0.15_45/0.15)] focus:border-primary resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_0_20px_oklch(0.68_0.15_45/0.25)]"
              >
                {isSubmitting ? "Transmitting..." : "✦ Transmit Signal"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/status")}
                className="sm:w-auto transition-all duration-200 hover:border-primary/50"
              >
                ◇ Track Signal
              </Button>
            </div>
          </form>
        </GlassPanel>

          <div className="mt-8 text-center text-xs text-muted-foreground space-y-1">
            <p>All signals are processed through the operator console.</p>
            <p>You'll receive a Ticket ID to track your request.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
