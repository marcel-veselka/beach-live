import { SourceReference } from "@/lib/tournament/schema"
import { ExternalLink } from "lucide-react"
import { t } from "@/lib/i18n"

interface SourceLinksProps {
  sources: SourceReference[]
}

export function SourceLinks({ sources }: SourceLinksProps) {
  const msg = t().common
  if (sources.length === 0) return null

  return (
    <div className="text-xs text-muted-foreground">
      <span className="font-medium">{msg.sources}: </span>
      {sources.map((source, i) => (
        <span key={i}>
          {i > 0 && " • "}
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 hover:text-primary transition-colors"
          >
            {source.name}
            <ExternalLink className="h-2.5 w-2.5" />
          </a>
        </span>
      ))}
    </div>
  )
}
