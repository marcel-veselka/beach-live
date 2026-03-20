export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-card to-muted/30 py-8 text-center hidden md:block">
      <div className="mx-auto max-w-5xl px-4 space-y-2">
        <p className="text-sm font-medium text-foreground/70">Beach Live</p>
        <p className="text-xs text-muted-foreground">
          Živé výsledky plážového volejbalu • Data se aktualizují automaticky
        </p>
      </div>
    </footer>
  )
}
