import Link from "next/link"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <span>🏐</span>
          <span>Beach Live</span>
        </Link>
      </div>
    </header>
  )
}
