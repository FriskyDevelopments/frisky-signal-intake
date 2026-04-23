import { memo } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/StatusBadge"
import { IndexedSignal } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SignalRowProps {
  signal: IndexedSignal
  onClick: (id: string) => void
}

/**
 * Extracted into a dedicated file for better project structure and type safety.
 * Wrapped in React.memo to skip virtual DOM diffing when parent state (like search)
 * changes, provided the specific signal object reference remains stable.
 */
export const SignalRow = memo(function SignalRow({
  signal,
  onClick
}: SignalRowProps) {
  return (
    <TableRow
      className={cn(
        "cursor-pointer transition-all duration-200",
        signal.isNew && "signal-new"
      )}
      onClick={() => onClick(signal.id)}
    >
      <TableCell className="font-medium">
        {signal.ticketId}
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{signal.name}</div>
          <div className="text-sm text-muted-foreground">{signal.contact}</div>
        </div>
      </TableCell>
      <TableCell className="text-sm">
        {signal.requestType}
      </TableCell>
      <TableCell>
        <StatusBadge status={signal.status} />
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {signal.formattedDate}
      </TableCell>
    </TableRow>
  )
})
