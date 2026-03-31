import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassPanel } from "@/components/GlassPanel"
import { PaperPlaneRight } from "@phosphor-icons/react"
import { Signal, RequestType } from "@/lib/types"
import { generateUniqueTicketId } from "@/lib/ticket-generator"
import { sendDiscordWebhook } from "@/lib/discord-webhook"
import { useKV } from "@github/spark/hooks"
import { toast } from "sonner"
import { motion } from "framer-motion"

export function IntakePage() {
  const navigate = useNavigate()
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

  return (
    <div className="min-h-screen bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto"
      >
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-semibold tracking-tight mb-4">
            Frisky Developments
          </h1>
          <p className="text-lg text-muted-foreground">
            Signal Intake Desk
          </p>
        </div>

        <GlassPanel className="mb-8">
          <div className="space-y-4">
            <h2 className="text-xl font-medium">Submit Your Request</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Send your request through the desk.</p>
              <p>No DMs. Everything flows through the system.</p>
              <p>Track your request with your Ticket ID.</p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Email or Preferred Contact *</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="email@example.com or @handle"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="request-type">Request Type *</Label>
              <Select value={requestType} onValueChange={(value) => setRequestType(value as RequestType)}>
                <SelectTrigger id="request-type">
                  <SelectValue placeholder="Select a request type" />
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
              <Label htmlFor="project">Project / Brand (Optional)</Label>
              <Input
                id="project"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Related project or brand name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your request in detail"
                rows={6}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                <PaperPlaneRight className="mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Signal"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/status")}
              >
                Check Status
              </Button>
            </div>
          </form>
        </GlassPanel>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>All requests are processed through the operator console.</p>
          <p>You'll receive a Ticket ID to track your signal.</p>
        </div>
      </motion.div>
    </div>
  )
}
