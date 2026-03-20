import Link from "next/link"
import { VolleyballIcon } from "@/components/ui/volleyball-icon"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-gradient-to-r from-card/95 via-card/95 to-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <VolleyballIcon size={28} />
          <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Beach Live
          </span>
        </Link>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-live animate-pulse" />
          Živé výsledky
        </span>
      </div>
    </header>
  )
}
