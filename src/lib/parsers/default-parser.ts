import { TournamentParser, ParseResult } from "./types"
import { GoogleSheetResult, SheetData } from "@/lib/adapters/google-sheet"
import { TournamentConfig } from "@/lib/tournament/config"
import {
  Team, Match, Group, Bracket, BracketMatch,
  MatchStatus, TournamentStatus, ParserWarning, TournamentSnapshot,
} from "@/lib/tournament/schema"
import { makeId } from "./sheet-utils"

export class DefaultTournamentParser implements TournamentParser {
  parse(sheetData: GoogleSheetResult, config: TournamentConfig): ParseResult {
    const warnings: ParserWarning[] = []
    const sheet = sheetData.sheets["default"] ?? Object.values(sheetData.sheets)[0]

    if (!sheet || sheet.rows.length === 0) {
      warnings.push({
        source: "default-parser",
        message: "No sheet data available",
        timestamp: new Date().toISOString(),
      })

      return {
        snapshot: this.emptySnapshot(config, warnings),
        warnings,
      }
    }

    // Try to extract data - be very tolerant
    const teams = this.parseTeams(sheet, warnings)
    const matches = this.parseMatches(sheet, teams, warnings)
    const groups = this.buildGroups(sheet, teams, matches, warnings)
    const bracket = this.buildBracket(matches, warnings)
    const status = this.determineTournamentStatus(matches)

    const snapshot: TournamentSnapshot = {
      meta: {
        tournamentSlug: config.slug,
        generatedAt: new Date().toISOString(),
        refreshDurationMs: 0,
        parserWarnings: warnings,
      },
      metadata: {
        name: config.name,
        subtitle: config.subtitle,
        venue: config.venue,
        dates: config.dates,
        category: config.category,
        organizer: config.organizer,
      },
      status,
      teams,
      matches,
      groups,
      bracket: bracket.rounds.length > 0 ? bracket : undefined,
      sources: config.sourceReferences,
    }

    return { snapshot, warnings }
  }

  private parseTeams(sheet: SheetData, warnings: ParserWarning[]): Team[] {
    const teams: Map<string, Team> = new Map()

    // Look for team/player patterns in the data
    // Common headers: "Tým", "Team", "Hráč 1", "Hráč 2", "Player 1", "Player 2"
    const teamHeaders = ["tým", "team", "název", "name", "dvojice"]
    const player1Headers = ["hráč 1", "hráč1", "player 1", "player1", "hráčka 1", "hráčka1"]
    const player2Headers = ["hráč 2", "hráč2", "player 2", "player2", "hráčka 2", "hráčka2"]

    const headerLower = sheet.headers.map(h => h.toLowerCase().trim())

    const teamIdx = headerLower.findIndex(h => teamHeaders.some(th => h.includes(th)))
    const p1Idx = headerLower.findIndex(h => player1Headers.some(ph => h.includes(ph)))
    const p2Idx = headerLower.findIndex(h => player2Headers.some(ph => h.includes(ph)))

    if (teamIdx >= 0) {
      for (const row of sheet.rows) {
        const name = (row[teamIdx] ?? "").trim()
        if (!name) continue

        const id = makeId(name)
        if (teams.has(id)) continue

        const players = []
        if (p1Idx >= 0 && row[p1Idx]?.trim()) players.push({ name: row[p1Idx].trim() })
        if (p2Idx >= 0 && row[p2Idx]?.trim()) players.push({ name: row[p2Idx].trim() })

        teams.set(id, { id, name, players })
      }
    } else {
      // Try to extract teams from match data (TeamA vs TeamB pattern)
      this.extractTeamsFromMatches(sheet, teams, warnings)
    }

    if (teams.size === 0) {
      warnings.push({
        source: "default-parser",
        message: "Could not identify team data in sheet",
        timestamp: new Date().toISOString(),
      })
    }

    return Array.from(teams.values())
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private extractTeamsFromMatches(sheet: SheetData, teams: Map<string, Team>, _warnings: ParserWarning[]) {
    // Look for columns that might contain team names in match context
    const teamAHeaders = ["tým a", "team a", "domácí", "home", "tým 1", "team 1"]
    const teamBHeaders = ["tým b", "team b", "hosté", "away", "tým 2", "team 2"]

    const headerLower = sheet.headers.map(h => h.toLowerCase().trim())
    const aIdx = headerLower.findIndex(h => teamAHeaders.some(th => h.includes(th)))
    const bIdx = headerLower.findIndex(h => teamBHeaders.some(th => h.includes(th)))

    if (aIdx >= 0 && bIdx >= 0) {
      for (const row of sheet.rows) {
        for (const idx of [aIdx, bIdx]) {
          const name = (row[idx] ?? "").trim()
          if (!name) continue
          const id = makeId(name)
          if (!teams.has(id)) {
            teams.set(id, { id, name, players: [] })
          }
        }
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private parseMatches(sheet: SheetData, teams: Team[], _warnings: ParserWarning[]): Match[] {
    const matches: Match[] = []
    const headerLower = sheet.headers.map(h => h.toLowerCase().trim())

    // Look for match-related columns
    const teamAHeaders = ["tým a", "team a", "domácí", "home", "tým 1", "team 1"]
    const teamBHeaders = ["tým b", "team b", "hosté", "away", "tým 2", "team 2"]
    const scoreHeaders = ["výsledek", "score", "skóre", "result", "sety"]
    const roundHeaders = ["kolo", "round", "fáze", "phase"]
    const courtHeaders = ["kurt", "court", "hřiště"]
    const timeHeaders = ["čas", "time", "začátek"]

    const aIdx = headerLower.findIndex(h => teamAHeaders.some(th => h.includes(th)))
    const bIdx = headerLower.findIndex(h => teamBHeaders.some(th => h.includes(th)))
    const scoreIdx = headerLower.findIndex(h => scoreHeaders.some(sh => h.includes(sh)))
    const roundIdx = headerLower.findIndex(h => roundHeaders.some(rh => h.includes(rh)))
    const courtIdx = headerLower.findIndex(h => courtHeaders.some(ch => h.includes(ch)))
    const timeIdx = headerLower.findIndex(h => timeHeaders.some(th => h.includes(th)))

    if (aIdx < 0 || bIdx < 0) return matches

    const teamMap = new Map(teams.map(t => [t.name.toLowerCase(), t]))

    for (let i = 0; i < sheet.rows.length; i++) {
      const row = sheet.rows[i]
      const nameA = (row[aIdx] ?? "").trim()
      const nameB = (row[bIdx] ?? "").trim()
      if (!nameA && !nameB) continue

      const teamA = teamMap.get(nameA.toLowerCase())
      const teamB = teamMap.get(nameB.toLowerCase())
      const scoreStr = scoreIdx >= 0 ? (row[scoreIdx] ?? "").trim() : ""
      const round = roundIdx >= 0 ? (row[roundIdx] ?? "").trim() : undefined
      const court = courtIdx >= 0 ? (row[courtIdx] ?? "").trim() : undefined
      const time = timeIdx >= 0 ? (row[timeIdx] ?? "").trim() : undefined

      const score = this.parseScore(scoreStr)
      const status: MatchStatus = score ? "finished" : "scheduled"

      const match: Match = {
        id: makeId("match", String(i + 1)),
        round: round || undefined,
        court: court || undefined,
        scheduledTime: time || undefined,
        status,
        teamA: teamA ? { teamId: teamA.id, name: teamA.name } : nameA ? { teamId: makeId(nameA), name: nameA } : undefined,
        teamB: teamB ? { teamId: teamB.id, name: teamB.name } : nameB ? { teamId: makeId(nameB), name: nameB } : undefined,
        score: score || undefined,
      }

      matches.push(match)
    }

    return matches
  }

  private parseScore(scoreStr: string): Match["score"] | null {
    if (!scoreStr) return null

    // Try patterns like "2:0 (21:15, 21:18)" or "21:15 21:18" or "2-0"
    const setPattern = /(\d{1,2})[:\-](\d{1,2})/g
    const sets: { teamA: number; teamB: number }[] = []
    let m

    while ((m = setPattern.exec(scoreStr)) !== null) {
      sets.push({ teamA: parseInt(m[1]), teamB: parseInt(m[2]) })
    }

    if (sets.length === 0) return null

    // If first match is set count (like 2:0), skip it and use the rest
    if (sets.length > 1 && sets[0].teamA + sets[0].teamB <= 3) {
      const setCount = sets[0]
      const detailSets = sets.slice(1)
      if (detailSets.length > 0) {
        const winner = setCount.teamA > setCount.teamB ? "teamA" as const : "teamB" as const
        return { sets: detailSets, winner }
      }
    }

    // Otherwise treat all as set scores
    const winsA = sets.filter(s => s.teamA > s.teamB).length
    const winsB = sets.filter(s => s.teamB > s.teamA).length
    const winner = winsA > winsB ? "teamA" as const : winsB > winsA ? "teamB" as const : undefined

    return { sets, winner }
  }

  private buildGroups(sheet: SheetData, teams: Team[], matches: Match[], warnings: ParserWarning[]): Group[] {
    // Look for group identifiers
    const headerLower = sheet.headers.map(h => h.toLowerCase().trim())
    const groupIdx = headerLower.findIndex(h => ["skupina", "group", "pool"].some(g => h.includes(g)))

    if (groupIdx < 0) {
      // Try to build from match data if matches have group phase info
      return this.buildGroupsFromMatches(teams, matches, warnings)
    }

    const groupMap = new Map<string, string[]>()
    for (const row of sheet.rows) {
      const groupName = (row[groupIdx] ?? "").trim()
      const teamName = this.findTeamNameInRow(row, headerLower)
      if (groupName && teamName) {
        if (!groupMap.has(groupName)) groupMap.set(groupName, [])
        groupMap.get(groupName)!.push(teamName)
      }
    }

    return Array.from(groupMap.entries()).map(([name, teamNames]) => ({
      id: makeId("group", name),
      name,
      standings: teamNames.map((tn, i) => ({
        teamId: makeId(tn),
        teamName: tn,
        rank: i + 1,
        played: 0, won: 0, lost: 0,
        setsWon: 0, setsLost: 0, pointsWon: 0, pointsLost: 0,
      })),
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private buildGroupsFromMatches(_teams: Team[], _matches: Match[], _warnings: ParserWarning[]): Group[] {
    // Placeholder - will need tournament-specific logic
    return []
  }

  private findTeamNameInRow(row: string[], headerLower: string[]): string {
    const teamHeaders = ["tým", "team", "název", "name", "dvojice"]
    const idx = headerLower.findIndex(h => teamHeaders.some(th => h.includes(th)))
    return idx >= 0 ? (row[idx] ?? "").trim() : ""
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private buildBracket(matches: Match[], _warnings: ParserWarning[]): Bracket {
    const playoffMatches = matches.filter(m => m.bracketRound || m.phase === "playoff")
    if (playoffMatches.length === 0) return { rounds: [] }

    const roundMap = new Map<string, BracketMatch[]>()
    for (const match of playoffMatches) {
      const roundName = match.bracketRound ?? match.round ?? "Unknown"
      if (!roundMap.has(roundName)) roundMap.set(roundName, [])
      roundMap.get(roundName)!.push({
        matchId: match.id,
        round: roundName,
        position: match.bracketPosition ?? roundMap.get(roundName)!.length,
        teamA: match.teamA,
        teamB: match.teamB,
        winner: match.score?.winner,
        score: match.score?.sets.map(s => `${s.teamA}:${s.teamB}`).join(", "),
      })
    }

    return {
      rounds: Array.from(roundMap.entries()).map(([name, matches]) => ({
        name,
        matches: matches.sort((a, b) => a.position - b.position),
      })),
    }
  }

  private determineTournamentStatus(matches: Match[]): TournamentStatus {
    if (matches.length === 0) return "upcoming"
    const hasLive = matches.some(m => m.status === "live")
    if (hasLive) return "live"
    const allFinished = matches.every(m => m.status === "finished")
    if (allFinished && matches.length > 0) return "finished"
    const hasFinished = matches.some(m => m.status === "finished")
    if (hasFinished) return "live" // tournament is in progress
    return "upcoming"
  }

  private emptySnapshot(config: TournamentConfig, warnings: ParserWarning[]): TournamentSnapshot {
    return {
      meta: {
        tournamentSlug: config.slug,
        generatedAt: new Date().toISOString(),
        refreshDurationMs: 0,
        parserWarnings: warnings,
      },
      metadata: {
        name: config.name,
        subtitle: config.subtitle,
        venue: config.venue,
        dates: config.dates,
        category: config.category,
        organizer: config.organizer,
      },
      status: "upcoming",
      teams: [],
      matches: [],
      groups: [],
      sources: config.sourceReferences,
    }
  }
}
