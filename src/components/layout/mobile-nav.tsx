"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Trophy, GitBranch, Users, Swords, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { t } from "@/lib/i18n"

const navItems = [
  { href: "/", icon: LayoutGrid, labelKey: "overview" as const },
  { href: "/bracket", icon: GitBranch, labelKey: "bracket" as const },
  { href: "/groups", icon: Trophy, labelKey: "groups" as const },
  { href: "/matches", icon: Swords, labelKey: "matches" as const },
  { href: "/teams", icon: Users, labelKey: "teams" as const },
]

export function MobileNav() {
  const pathname = usePathname()
  const msg = t().nav

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-area-bottom md:hidden">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-evenly px-1 pb-safe">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{msg[item.labelKey]}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
