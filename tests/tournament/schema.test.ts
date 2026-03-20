import { describe, it, expect } from "vitest"
import { TournamentSnapshotSchema, MatchSchema, TeamSchema } from "@/lib/tournament/schema"

describe("Tournament Schema Validation", () => {
  it("validates a valid team", () => {
    const team = { id: "team-1", name: "Test Team", players: [{ name: "Player 1" }] }
    const result = TeamSchema.safeParse(team)
    expect(result.success).toBe(true)
  })

  it("rejects team without id", () => {
    const team = { name: "Test Team", players: [] }
    const result = TeamSchema.safeParse(team)
    expect(result.success).toBe(false)
  })

  it("validates a valid match", () => {
    const match = {
      id: "match-1",
      status: "scheduled",
    }
    const result = MatchSchema.safeParse(match)
    expect(result.success).toBe(true)
  })

  it("rejects match with invalid status", () => {
    const match = {
      id: "match-1",
      status: "invalid",
    }
    const result = MatchSchema.safeParse(match)
    expect(result.success).toBe(false)
  })

  it("validates a full tournament snapshot", () => {
    const snapshot = {
      meta: {
        tournamentSlug: "test",
        generatedAt: new Date().toISOString(),
        refreshDurationMs: 100,
        parserWarnings: [],
      },
      metadata: { name: "Test" },
      status: "upcoming",
      teams: [],
      matches: [],
      groups: [],
      bracket: undefined,
      sources: [],
    }
    const result = TournamentSnapshotSchema.safeParse(snapshot)
    expect(result.success).toBe(true)
  })
})
