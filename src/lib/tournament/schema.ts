import { z } from "zod/v4"

export const MatchStatusSchema = z.enum(["scheduled", "live", "finished"])
export type MatchStatus = z.infer<typeof MatchStatusSchema>

export const PlayerSchema = z.object({
  name: z.string(),
  club: z.string().optional(),
})
export type Player = z.infer<typeof PlayerSchema>

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  players: z.array(PlayerSchema),
  seed: z.number().optional(),
  points: z.number().optional(),
  groupId: z.string().optional(),
})
export type Team = z.infer<typeof TeamSchema>

export const MatchSchema = z.object({
  id: z.string(),
  round: z.string().optional(),
  court: z.string().optional(),
  scheduledTime: z.string().optional(),
  status: MatchStatusSchema,
  teamA: z.object({ teamId: z.string(), name: z.string() }).optional(),
  teamB: z.object({ teamId: z.string(), name: z.string() }).optional(),
  score: z.object({
    sets: z.array(z.object({
      teamA: z.number(),
      teamB: z.number(),
    })),
    winner: z.enum(["teamA", "teamB"]).optional(),
  }).optional(),
  bracketRound: z.string().optional(),
  bracketPosition: z.number().optional(),
  groupId: z.string().optional(),
  phase: z.enum(["group", "playoff", "placement"]).optional(),
})
export type Match = z.infer<typeof MatchSchema>

export const GroupStandingSchema = z.object({
  teamId: z.string(),
  teamName: z.string(),
  rank: z.number(),
  played: z.number(),
  won: z.number(),
  lost: z.number(),
  setsWon: z.number(),
  setsLost: z.number(),
  pointsWon: z.number(),
  pointsLost: z.number(),
})
export type GroupStanding = z.infer<typeof GroupStandingSchema>

export const GroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  standings: z.array(GroupStandingSchema),
})
export type Group = z.infer<typeof GroupSchema>

export const BracketMatchSchema = z.object({
  matchId: z.string(),
  round: z.string(),
  position: z.number(),
  teamA: z.object({ teamId: z.string(), name: z.string() }).optional(),
  teamB: z.object({ teamId: z.string(), name: z.string() }).optional(),
  winner: z.enum(["teamA", "teamB"]).optional(),
  score: z.string().optional(),
  nextMatchId: z.string().optional(),
})
export type BracketMatch = z.infer<typeof BracketMatchSchema>

export const BracketSchema = z.object({
  rounds: z.array(z.object({
    name: z.string(),
    matches: z.array(BracketMatchSchema),
  })),
})
export type Bracket = z.infer<typeof BracketSchema>

export const SourceReferenceSchema = z.object({
  name: z.string(),
  url: z.string(),
  type: z.enum(["google-sheet", "pdf", "cvf", "other"]),
})
export type SourceReference = z.infer<typeof SourceReferenceSchema>

export const ParserWarningSchema = z.object({
  source: z.string(),
  message: z.string(),
  timestamp: z.string(),
})
export type ParserWarning = z.infer<typeof ParserWarningSchema>

export const TournamentMetadataSchema = z.object({
  name: z.string(),
  subtitle: z.string().optional(),
  venue: z.string().optional(),
  dates: z.string().optional(),
  category: z.string().optional(),
  organizer: z.string().optional(),
})
export type TournamentMetadata = z.infer<typeof TournamentMetadataSchema>

export const TournamentStatusSchema = z.enum(["upcoming", "live", "finished"])
export type TournamentStatus = z.infer<typeof TournamentStatusSchema>

export const SnapshotMetaSchema = z.object({
  tournamentSlug: z.string(),
  generatedAt: z.string(),
  refreshDurationMs: z.number(),
  parserWarnings: z.array(ParserWarningSchema),
  sourceVersions: z.record(z.string(), z.string()).optional(),
})
export type SnapshotMeta = z.infer<typeof SnapshotMetaSchema>

export const TournamentSnapshotSchema = z.object({
  meta: SnapshotMetaSchema,
  metadata: TournamentMetadataSchema,
  status: TournamentStatusSchema,
  teams: z.array(TeamSchema),
  matches: z.array(MatchSchema),
  groups: z.array(GroupSchema),
  bracket: BracketSchema.optional(),
  sources: z.array(SourceReferenceSchema),
})
export type TournamentSnapshot = z.infer<typeof TournamentSnapshotSchema>
