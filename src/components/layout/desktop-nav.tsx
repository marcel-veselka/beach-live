"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { t } from "@/lib/i18n"

const navItems = [
  { href: "/", labelKey: "overview" as const },
  { href: "/bracket", labelKey: "bracket" as const },
  { href: "/matches", labelKey: "matches" as const },
  { href: "/teams", labelKey: "teams" as const },
]

export function DesktopNav() {
  const pathname = usePathname()
  const msg = t().nav

  return (
    <nav className="hidden md:flex items-center gap-1 border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center gap-1 px-4">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors border-b-2",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {msg[item.labelKey]}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
