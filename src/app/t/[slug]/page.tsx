import { redirect } from "next/navigation"
import { getActiveTournament, getTournament } from "@/lib/tournament/registry"
import "@/tournaments"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function TournamentPage({ params }: PageProps) {
  const { slug } = await params
  const config = getTournament(slug)
  const active = getActiveTournament()

  // If this is the active tournament, redirect to /
  if (config && active && config.slug === active.slug) {
    redirect("/")
  }

  // For non-active tournaments, show the same overview but with slug-specific data
  // For now, redirect to / since we only have one tournament
  redirect("/")
}
