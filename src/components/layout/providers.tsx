"use client"

import { FavoritesProvider } from "@/lib/favorites/context"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FavoritesProvider>
      {children}
    </FavoritesProvider>
  )
}
