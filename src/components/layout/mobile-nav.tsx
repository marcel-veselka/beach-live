"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { GitBranch, Users, Swords, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"
import { t } from "@/lib/i18n"

const navItems = [
  { href: "/", icon: LayoutGrid, labelKey: "overview" as const },
  { href: "/bracket", icon: GitBranch, labelKey: "bracket" as const },
  { href: "/matches", icon: Swords, labelKey: "matches" as const },
  { href: "/teams", icon: Users, labelKey: "teams" as const },
]

export function MobileNav() {
  const pathname = usePathname()
  const msg = t().nav

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-card/98 backdrop-blur-xl supports-[backdrop-filter]:bg-card/85 safe-area-bottom md:hidden pb-safe">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-evenly px-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-1.5 text-[10px] font-medium transition-all duration-200 rounded-xl press-scale",
                isActive ? "text-primary nav-active-dot bg-primary/5" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform", isActive && "stroke-[2.5] scale-110")} />
              <span className={cn(isActive && "font-semibold")}>{msg[item.labelKey]}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
