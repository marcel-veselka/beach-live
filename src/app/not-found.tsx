import Link from "next/link"
import { VolleyballIcon } from "@/components/ui/volleyball-icon"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <div className="mb-4 animate-fade-in-up"><VolleyballIcon size={48} /></div>
      <h2 className="text-xl font-bold mb-2">Stránka nenalezena</h2>
      <p className="text-muted-foreground mb-6">
        Tato stránka neexistuje nebo byla přesunuta.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Zpět na přehled
      </Link>
    </div>
  )
}
