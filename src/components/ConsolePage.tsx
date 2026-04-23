import { useState, useMemo, useCallback, useDeferredValue, memo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { GlassPanel } from "@/components/GlassPanel"
import { SignalDeskHeader } from "@/components/SignalDeskHeader"
import { StatusBadge } from "@/components/StatusBadge"
import { MagnifyingGlass, Funnel, Export, Gear } from "@phosphor-icons/react"
import { Signal, SignalStatus, RequestType, IndexedSignal } from "@/lib/types"
import { useKV } from "@github/spark/hooks"
import { shortDateFormatter } from "@/lib/utils"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { SignalRow } from "@/components/SignalRow"

export function ConsolePage() {
  const navigate = useNavigate()
  const [signals, setSignals] = useKV<Signal[]>("signals", [])
  const [webhookUrl, setWebhookUrl] = useKV<string>("discord-webhook-url", "")
  const [telegramBotToken, setTelegramBotToken] = useKV<string>("telegram-bot-token", "")
  const [telegramChatId, setTelegramChatId] = useKV<string>("telegram-chat-id", "")
  const [tempWebhookUrl, setTempWebhookUrl] = useState("")
  const [tempTelegramBotToken, setTempTelegramBotToken] = useState("")
  const [tempTelegramChatId, setTempTelegramChatId] = useState("")
  const [settingsOpen, setSettingsOpen] = useState(false)
  
  const [searchTerm, setSearchTerm] = useState("")
  const deferredSearchTerm = useDeferredValue(searchTerm)
  const [statusFilter, setStatusFilter] = useState<SignalStatus | "ALL">("ALL")
  const [typeFilter, setTypeFilter] = useState<RequestType | "ALL">("ALL")

  const indexedCache = useRef<Map<string, IndexedSignal>>(new Map())

  /**
   * Index signals with pre-calculated fields and implement object-level stability.
   * Unified search index reduces string operations during the filtering phase.
   */
  const indexedSignals = useMemo(() => {
    const nextCache = new Map<string, IndexedSignal>()
    const result = (signals || []).map(signal => {
      const cached = indexedCache.current.get(signal.id)

      if (cached && cached.originalSignal === signal) {
        nextCache.set(signal.id, cached)
        return cached
      }

      const indexed: IndexedSignal = {
        ...signal,
        originalSignal: signal,
        formattedDate: shortDateFormatter.format(signal.createdAt),
        // Pre-combine fields into a single search string to reduce .includes() calls from 3 to 1 per item.
        searchIndex: `${signal.ticketId} ${signal.name} ${signal.contact}`.toLowerCase()
      }
      nextCache.set(signal.id, indexed)
      return indexed
    })

    indexedCache.current = nextCache
    return result
  }, [signals])

  // Single-pass filtering and counting logic to minimize array traversals.
  // Performs O(N) filtering and O(N) counting in a single loop.
  const { filteredSignals, activeSignalsCount } = useMemo(() => {
    if (!indexedSignals) return { filteredSignals: [], activeSignalsCount: 0 }
    
    const searchLower = deferredSearchTerm.toLowerCase()
    const result: typeof indexedSignals = []
    let activeCount = 0

    for (const signal of indexedSignals) {
      let isMatch = true

      // Early-exit for status and type filters
      if (statusFilter !== "ALL" && signal.status !== statusFilter) isMatch = false
      if (isMatch && typeFilter !== "ALL" && signal.requestType !== typeFilter) isMatch = false

      if (isMatch && searchLower) {
        // Use pre-calculated unified index for O(1) string comparison check per signal.
        isMatch = signal.searchIndex.includes(searchLower)
      }

      if (isMatch) {
        result.push(signal)
        if (signal.status !== "RESOLUTION_COMPLETE") {
          activeCount++
        }
      }
    }

    return { filteredSignals: result, activeSignalsCount: activeCount }
  }, [indexedSignals, deferredSearchTerm, statusFilter, typeFilter])

  const handleMarkAsViewed = useCallback((signalId: string) => {
    setSignals((current) => 
      current?.map(s => s.id === signalId ? { ...s, isNew: false } : s) ?? []
    )
  }, [setSignals])

  const handleSignalClick = useCallback((id: string) => {
    handleMarkAsViewed(id)
    navigate(`/console/signal/${id}`)
  }, [handleMarkAsViewed, navigate])

  const handleExportCSV = () => {
    if (!signals || signals.length === 0) {
      toast.error("No signals to export")
      return
    }

    const headers = ["Ticket ID", "Name", "Contact", "Request Type", "Project", "Status", "Created At", "Updated At"]
    const rows = signals.map(s => [
      s.ticketId,
      s.name,
      s.contact,
      s.requestType,
      s.project || "",
      s.status,
      new Date(s.createdAt).toLocaleString(),
      new Date(s.updatedAt).toLocaleString()
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `signals-export-${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    
    toast.success("Signals exported to CSV")
  }

  const handleSaveSettings = () => {
    setWebhookUrl(tempWebhookUrl)
    setTelegramBotToken(tempTelegramBotToken)
    setTelegramChatId(tempTelegramChatId)
    setSettingsOpen(false)
    toast.success("Settings saved")
  }

  const openSettings = () => {
    setTempWebhookUrl(webhookUrl || "")
    setTempTelegramBotToken(telegramBotToken || "")
    setTempTelegramChatId(telegramChatId || "")
    setSettingsOpen(true)
  }

  const scrollToQueue = useCallback(() => {
    const element = document.getElementById('signal-queue')
    element?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <SignalDeskHeader 
        variant="console"
        onOpenQueue={scrollToQueue}
        onActiveSignals={scrollToQueue}
      />
      
      <div className="p-6 sm:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight mb-2">
                Signal Queue
              </h2>
              <p className="text-muted-foreground">
                {activeSignalsCount} active signal{activeSignalsCount !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={openSettings}>
                    <Gear className="mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Console Settings</DialogTitle>
                    <DialogDescription>
                      Configure webhook notifications for new signals
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Discord Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        value={tempWebhookUrl}
                        onChange={(e) => setTempWebhookUrl(e.target.value)}
                        placeholder="https://discord.com/api/webhooks/..."
                      />
                      <p className="text-xs text-muted-foreground">
                        Discord channel for signal notifications
                      </p>
                    </div>
                    
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-3">Telegram Bot Configuration</h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="telegram-bot-token">Bot Token</Label>
                          <Input
                            id="telegram-bot-token"
                            type="password"
                            value={tempTelegramBotToken}
                            onChange={(e) => setTempTelegramBotToken(e.target.value)}
                            placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                          />
                          <p className="text-xs text-muted-foreground">
                            Get from @BotFather on Telegram
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="telegram-chat-id">Chat ID</Label>
                          <Input
                            id="telegram-chat-id"
                            value={tempTelegramChatId}
                            onChange={(e) => setTempTelegramChatId(e.target.value)}
                            placeholder="-1001234567890"
                          />
                          <p className="text-xs text-muted-foreground">
                            Channel or group chat ID for notifications
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveSettings} className="w-full">
                      Save Settings
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button onClick={handleExportCSV} variant="outline">
                <Export className="mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          <GlassPanel className="mb-6" id="signal-queue">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by Ticket ID, name, or contact"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SignalStatus | "ALL")}>
                  <SelectTrigger className="w-[180px]">
                    <Funnel className="mr-2" size={18} />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="SIGNAL_RECEIVED">Signal Received</SelectItem>
                    <SelectItem value="OPERATOR_ASSIGNED">Operator Assigned</SelectItem>
                    <SelectItem value="IN_REVIEW">In Review</SelectItem>
                    <SelectItem value="WAITING_ON_USER">Waiting On User</SelectItem>
                    <SelectItem value="RESOLUTION_COMPLETE">Resolution Complete</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as RequestType | "ALL")}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="Technical Support">Technical Support</SelectItem>
                    <SelectItem value="Billing / Order Help">Billing / Order Help</SelectItem>
                    <SelectItem value="Partnership / Collaboration">Partnership / Collaboration</SelectItem>
                    <SelectItem value="Custom Build Request">Custom Build Request</SelectItem>
                    <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                    <SelectItem value="STIX MΛGIC Support">STIX MΛGIC Support</SelectItem>
                    <SelectItem value="ClipsFlow Support">ClipsFlow Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="overflow-hidden p-0">
            {filteredSignals.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <p>No active signals</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">Ticket ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSignals.map((signal) => (
                      <SignalRow
                        key={signal.id}
                        signal={signal}
                        onClick={handleSignalClick}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  )
}
