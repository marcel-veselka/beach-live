export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-gradient-to-b from-card to-muted/30 py-6 text-center hidden md:block">
      <div className="mx-auto max-w-5xl px-4 space-y-1.5">
        <p className="text-sm font-medium text-foreground/70">
          🏐 Beach Live
        </p>
        <p className="text-[11px] text-muted-foreground">
          Živé výsledky plážového volejbalu • Data se aktualizují automaticky
        </p>
        <p className="text-[10px] text-muted-foreground/40 pt-1">
          Vytvořil{" "}
          <a
            href="https://github.com/marcel-veselka"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary/40 hover:text-primary transition-colors underline-offset-2 hover:underline"
          >
            Marcel Veselka
          </a>
        </p>
      </div>
    </footer>
  )
}
