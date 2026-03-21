import { VolleyballIcon } from "@/components/ui/volleyball-icon"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/20 py-3 text-center hidden md:block">
      <p className="text-[11px] text-muted-foreground/60 inline-flex items-center justify-center gap-1.5">
        <VolleyballIcon size={14} /> Beach Live • Živé výsledky z turnaje •{" "}
        <a
          href="https://github.com/marcel-veselka"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary/40 hover:text-primary transition-colors underline-offset-2 hover:underline"
        >
          Marcel Veselka
        </a>
      </p>
    </footer>
  )
}
