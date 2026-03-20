"use client"

import { Heart } from "lucide-react"
import { useFavorites } from "@/lib/favorites/context"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  teamId: string
  className?: string
}

export function FavoriteButton({ teamId, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const active = isFavorite(teamId)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(teamId)
      }}
      className={cn(
        "p-1.5 rounded-full transition-all",
        active ? "text-red-500 bg-red-50" : "text-muted-foreground/40 hover:text-red-400 hover:bg-red-50/50",
        className
      )}
      aria-label={active ? "Odebrat z oblibených" : "Přidat do oblíbených"}
    >
      <Heart className={cn("h-4 w-4", active && "fill-current")} />
    </button>
  )
}
