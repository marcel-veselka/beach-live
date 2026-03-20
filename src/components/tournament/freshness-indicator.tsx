import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle } from "lucide-react"
import { t } from "@/lib/i18n"

interface FreshnessIndicatorProps {
  generatedAt: string
  className?: string
}

export function FreshnessIndicator({ generatedAt, className }: FreshnessIndicatorProps) {
  const msg = t().common
  const generated = new Date(generatedAt)
  const now = new Date()
  const diffMs = now.getTime() - generated.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const isStale = diffMin > 15

  return (
    <div className={className}>
      {isStale ? (
        <Badge variant="warning" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          {msg.staleWarning}
        </Badge>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {diffMin < 1 ? "právě teď" : `${diffMin} ${msg.minutesAgo}`}
        </span>
      )}
    </div>
  )
}
