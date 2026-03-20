"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"

interface FavoritesContextType {
  favorites: Set<string>
  isFavorite: (teamId: string) => boolean
  toggleFavorite: (teamId: string) => void
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: new Set(),
  isFavorite: () => false,
  toggleFavorite: () => {},
})

const STORAGE_KEY = "beach-live-favorites"

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(new Set(JSON.parse(stored)))
      }
    } catch {}
    setLoaded(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
    } catch {}
  }, [favorites, loaded])

  const isFavorite = useCallback((teamId: string) => favorites.has(teamId), [favorites])

  const toggleFavorite = useCallback((teamId: string) => {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(teamId)) {
        next.delete(teamId)
      } else {
        next.add(teamId)
      }
      return next
    })
  }, [])

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
