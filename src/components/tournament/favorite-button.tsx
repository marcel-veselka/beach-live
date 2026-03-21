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
        "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-all duration-200",
        active
          ? "text-red-500 bg-red-50 scale-110"
          : "text-muted-foreground/50 hover:text-red-400 hover:bg-red-50/50 border border-transparent hover:border-red-200/40",
        className
      )}
      aria-label={active ? "Odebrat z oblibených" : "Přidat do oblíbených"}
    >
      <Heart className={cn(
        "h-5 w-5 transition-transform duration-200",
        active && "fill-current animate-[heartbeat_0.3s_ease-in-out]",
        !active && "stroke-[2.5]"
      )} />
    </button>
  )
}
