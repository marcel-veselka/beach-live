import { TournamentParser, ParseResult } from "@/lib/parsers/types"
import { GoogleSheetResult, SheetData } from "@/lib/adapters/google-sheet"
import { TournamentConfig } from "@/lib/tournament/config"
import {
  Team,
  Match,
  Bracket,
  BracketMatch,
  MatchStatus,
  TournamentStatus,
  ParserWarning,
  TournamentSnapshot,
} from "@/lib/tournament/schema"
import { makeId } from "@/lib/parsers/sheet-utils"

const SOURCE = "bvis-parser"

/** Score pattern: "2:0 (21:15,21:18)" or "0:0 (,)" */
const SCORE_PATTERN = /(\d+):(\d+)\s*\(([^)]*)\)/

/** Round label patterns in Czech bracket sheets */
const ROUND_LABELS: Record<string, string> = {
  "semifinále": "Semifinále",
  "finále o 1. místo": "Finále o 1. místo",
  "finále o 3. místo": "Finále o 3. místo",
  "čtvrtfinále": "Čtvrtfinále",
  "osmifinále": "Osmifinále",
}

export class BvisParser implements TournamentParser {
  parse(sheetData: GoogleSheetResult, config: TournamentConfig): ParseResult {
    const warnings: ParserWarning[] = []

    const startlistSheet = sheetData.sheets["startlist"]
    const bracketSheet = sheetData.sheets["bracket"]
    const matchesSheet = sheetData.sheets["matches"]
    const groupsSheet = sheetData.sheets["groups"]

    // Parse teams from startlist
    const teams = startlistSheet
      ? this.parseTeams(startlistSheet, warnings)
      : []

    if (teams.length === 0) {
      warnings.push({
        source: SOURCE,
        message: "No teams parsed from startlist sheet",
        timestamp: new Date().toISOString(),
      })
    }

    // Parse bracket
    const teamNames = new Set(teams.map((t) => t.name))
    const { bracket, bracketMatches } = bracketSheet
      ? this.parseBracket(bracketSheet, teamNames, warnings)
      : { bracket: undefined, bracketMatches: [] as Match[] }

    // Parse matches from matches sheet (may be empty)
    const sheetMatches = matchesSheet
      ? this.parseMatchesSheet(matchesSheet, teams, warnings)
      : []

    // Parse groups
    const groups = groupsSheet
      ? this.parseGroups(groupsSheet, teams, warnings)
      : []

    // Combine all matches
    const allMatches = [...sheetMatches, ...bracketMatches]

    // Determine status
    const status = this.determineTournamentStatus(allMatches)

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
      matches: allMatches,
      groups,
      bracket: bracket && bracket.rounds.length > 0 ? bracket : undefined,
      sources: config.sourceReferences,
    }

    return { snapshot, warnings }
  }

  /** Parse teams from B-VIS "Startovní listina" format */
  private parseTeams(sheet: SheetData, warnings: ParserWarning[]): Team[] {
    const teams: Team[] = []

    // B-VIS format: all rows including headers are in the flat rows array
    // Row format: Col 0 = seed number, Col 1 = "Player1 / Player2", Col 2 = rating points, Col 3 = "Q" qualifier
    // Skip rows where col 0 is not a number (header/title rows)
    const allRows = [sheet.headers, ...sheet.rows]

    for (const row of allRows) {
      const seedStr = (row[0] ?? "").trim()
      const seed = parseInt(seedStr, 10)
      if (isNaN(seed) || seed <= 0) continue

      const teamName = (row[1] ?? "").trim()
      if (!teamName) continue

      // Split by " / " to get player names
      const playerNames = teamName.split(" / ").map((n) => n.trim()).filter(Boolean)
      const players = playerNames.map((name) => ({ name }))

      const pointsStr = (row[2] ?? "").trim().replace(/\s/g, "").replace(",", ".")
      const _points = parseFloat(pointsStr) || 0

      const qualifier = (row[3] ?? "").trim().toUpperCase() === "Q"

      const id = makeId(teamName)
      teams.push({
        id,
        name: teamName,
        players,
        seed,
        ...(qualifier ? { groupId: "qualifier" } : {}),
      })
    }

    if (teams.length > 0) {
      warnings.push({
        source: SOURCE,
        message: `Parsed ${teams.length} teams from startlist`,
        timestamp: new Date().toISOString(),
      })
    }

    return teams
  }

  /** Parse bracket from B-VIS "Pavouk" sheet */
  private parseBracket(
    sheet: SheetData,
    teamNames: Set<string>,
    warnings: ParserWarning[],
  ): { bracket: Bracket; bracketMatches: Match[] } {
    const allRows = [sheet.headers, ...sheet.rows]
    const matches: Match[] = []
    const roundMatchMap = new Map<string, BracketMatch[]>()
    const foundTeams = new Set<string>()
    let scoreCount = 0

    // Scan all cells for team names, scores, and round labels
    for (let rowIdx = 0; rowIdx < allRows.length; rowIdx++) {
      const row = allRows[rowIdx]
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const cell = (row[colIdx] ?? "").trim()
        if (!cell) continue

        // Check if cell contains a team name
        if (teamNames.has(cell)) {
          foundTeams.add(cell)
        }

        // Check for score pattern
        const scoreMatch = SCORE_PATTERN.exec(cell)
        if (scoreMatch) {
          const setsA = parseInt(scoreMatch[1], 10)
          const setsB = parseInt(scoreMatch[2], 10)
          const detailStr = scoreMatch[3]

          // Skip "0:0 (,)" - not yet played
          if (setsA === 0 && setsB === 0 && detailStr.replace(/,/g, "").trim() === "") {
            continue
          }

          scoreCount++

          // Try to find team names nearby (same row, previous columns)
          const teamA = this.findNearbyTeam(allRows, rowIdx, colIdx, teamNames, -1)
          const teamB = this.findNearbyTeam(allRows, rowIdx, colIdx, teamNames, 1)

          // Try to find round label nearby
          const roundLabel = this.findNearbyRoundLabel(allRows, rowIdx, colIdx)

          const score = this.parseScoreString(cell)
          const status: MatchStatus = score ? "finished" : "scheduled"

          const matchId = makeId("bracket", String(rowIdx), String(colIdx))
          const match: Match = {
            id: matchId,
            round: roundLabel || undefined,
            status,
            teamA: teamA
              ? { teamId: makeId(teamA), name: teamA }
              : undefined,
            teamB: teamB
              ? { teamId: makeId(teamB), name: teamB }
              : undefined,
            score: score || undefined,
            bracketRound: roundLabel || undefined,
            phase: "playoff",
          }
          matches.push(match)

          const roundName = roundLabel || "Unknown"
          if (!roundMatchMap.has(roundName)) roundMatchMap.set(roundName, [])
          roundMatchMap.get(roundName)!.push({
            matchId,
            round: roundName,
            position: roundMatchMap.get(roundName)!.length,
            teamA: match.teamA,
            teamB: match.teamB,
            winner: score?.winner,
            score: score
              ? score.sets.map((s) => `${s.teamA}:${s.teamB}`).join(", ")
              : undefined,
          })
        }
      }
    }

    warnings.push({
      source: SOURCE,
      message: `Bracket: found ${foundTeams.size} teams, ${scoreCount} scores, ${matches.length} matches`,
      timestamp: new Date().toISOString(),
    })

    const bracket: Bracket = {
      rounds: Array.from(roundMatchMap.entries()).map(([name, bMatches]) => ({
        name,
        matches: bMatches.sort((a, b) => a.position - b.position),
      })),
    }

    return { bracket, bracketMatches: matches }
  }

  /** Find a team name near a given cell position */
  private findNearbyTeam(
    rows: string[][],
    rowIdx: number,
    colIdx: number,
    teamNames: Set<string>,
    direction: -1 | 1,
  ): string | null {
    // Search in same row, nearby columns
    const searchCols = direction === -1
      ? [colIdx - 1, colIdx - 2, colIdx - 3]
      : [colIdx + 1, colIdx + 2, colIdx + 3]

    const row = rows[rowIdx]
    for (const col of searchCols) {
      if (col >= 0 && col < row.length) {
        const cell = (row[col] ?? "").trim()
        if (teamNames.has(cell)) return cell
      }
    }

    // Also search adjacent rows at same column offset
    for (const rOffset of [-1, 1]) {
      const r = rowIdx + rOffset
      if (r < 0 || r >= rows.length) continue
      for (const col of searchCols) {
        if (col >= 0 && col < rows[r].length) {
          const cell = (rows[r][col] ?? "").trim()
          if (teamNames.has(cell)) return cell
        }
      }
    }

    return null
  }

  /** Find a round label near a given cell position */
  private findNearbyRoundLabel(
    rows: string[][],
    rowIdx: number,
    _colIdx: number,
  ): string | null {
    // Search in nearby rows, typically round labels are above the match
    for (let rOffset = -5; rOffset <= 0; rOffset++) {
      const r = rowIdx + rOffset
      if (r < 0 || r >= rows.length) continue
      for (const cell of rows[r]) {
        const lower = (cell ?? "").trim().toLowerCase()
        for (const [key, label] of Object.entries(ROUND_LABELS)) {
          if (lower.includes(key)) return label
        }
      }
    }
    return null
  }

  /** Parse score string like "2:0 (21:15,21:18)" */
  private parseScoreString(
    scoreStr: string,
  ): Match["score"] | null {
    const match = SCORE_PATTERN.exec(scoreStr)
    if (!match) return null

    const setsA = parseInt(match[1], 10)
    const setsB = parseInt(match[2], 10)
    const detailStr = match[3]

    if (setsA === 0 && setsB === 0 && detailStr.replace(/,/g, "").trim() === "") {
      return null
    }

    // Parse individual set scores from detail like "21:15,21:18"
    const sets: { teamA: number; teamB: number }[] = []
    const setPattern = /(\d+):(\d+)/g
    let m
    while ((m = setPattern.exec(detailStr)) !== null) {
      sets.push({ teamA: parseInt(m[1], 10), teamB: parseInt(m[2], 10) })
    }

    if (sets.length === 0) return null

    const winner =
      setsA > setsB
        ? ("teamA" as const)
        : setsB > setsA
          ? ("teamB" as const)
          : undefined

    return { sets, winner }
  }

  /** Parse matches from the "Zápasy" sheet */
  private parseMatchesSheet(
    sheet: SheetData,
    teams: Team[],
    warnings: ParserWarning[],
  ): Match[] {
    const matches: Match[] = []

    if (sheet.rows.length === 0) {
      warnings.push({
        source: SOURCE,
        message: "Matches sheet is empty or has no data rows",
        timestamp: new Date().toISOString(),
      })
      return matches
    }

    // Try to find standard match columns
    const headerLower = sheet.headers.map((h) => h.toLowerCase().trim())
    const teamMap = new Map(teams.map((t) => [t.name.toLowerCase(), t]))

    const findCol = (candidates: string[]) =>
      headerLower.findIndex((h) =>
        candidates.some((c) => h === c || h.includes(c)),
      )

    const teamAIdx = findCol(["tým a", "team a", "tým 1", "team 1", "domácí"])
    const teamBIdx = findCol(["tým b", "team b", "tým 2", "team 2", "hosté"])
    const scoreIdx = findCol(["výsledek", "score", "skóre", "sety"])
    const roundIdx = findCol(["kolo", "round", "fáze"])
    const courtIdx = findCol(["kurt", "court"])
    const timeIdx = findCol(["čas", "time", "začátek"])

    if (teamAIdx < 0 || teamBIdx < 0) {
      warnings.push({
        source: SOURCE,
        message: "Matches sheet: could not find team columns",
        timestamp: new Date().toISOString(),
      })
      return matches
    }

    for (let i = 0; i < sheet.rows.length; i++) {
      const row = sheet.rows[i]
      const nameA = (row[teamAIdx] ?? "").trim()
      const nameB = (row[teamBIdx] ?? "").trim()
      if (!nameA && !nameB) continue

      const teamA = teamMap.get(nameA.toLowerCase())
      const teamB = teamMap.get(nameB.toLowerCase())
      const scoreStr = scoreIdx >= 0 ? (row[scoreIdx] ?? "").trim() : ""
      const round = roundIdx >= 0 ? (row[roundIdx] ?? "").trim() : undefined
      const court = courtIdx >= 0 ? (row[courtIdx] ?? "").trim() : undefined
      const time = timeIdx >= 0 ? (row[timeIdx] ?? "").trim() : undefined

      const score = this.parseScoreString(scoreStr)
      const status: MatchStatus = score ? "finished" : "scheduled"

      matches.push({
        id: makeId("match", String(i + 1)),
        round: round || undefined,
        court: court || undefined,
        scheduledTime: time || undefined,
        status,
        teamA: teamA
          ? { teamId: teamA.id, name: teamA.name }
          : nameA
            ? { teamId: makeId(nameA), name: nameA }
            : undefined,
        teamB: teamB
          ? { teamId: teamB.id, name: teamB.name }
          : nameB
            ? { teamId: makeId(nameB), name: nameB }
            : undefined,
        score: score || undefined,
      })
    }

    return matches
  }

  /** Parse groups from the "Skupiny" sheet */
  private parseGroups(
    sheet: SheetData,
    teams: Team[],
    warnings: ParserWarning[],
  ) {
    const allRows = [sheet.headers, ...sheet.rows]

    // B-VIS groups sheet typically has group headers like "Skupina A", "Skupina B"
    // followed by team listings
    const groups: {
      id: string
      name: string
      standings: {
        teamId: string
        teamName: string
        rank: number
        played: number
        won: number
        lost: number
        setsWon: number
        setsLost: number
        pointsWon: number
        pointsLost: number
      }[]
    }[] = []

    const teamNames = new Set(teams.map((t) => t.name))
    let currentGroup: (typeof groups)[number] | null = null
    let teamRank = 0

    for (const row of allRows) {
      const firstCell = (row[0] ?? "").trim()

      // Check if this is a group header
      const groupMatch = /^Skupina\s+(\S+)/i.exec(firstCell)
      if (groupMatch) {
        const groupName = `Skupina ${groupMatch[1]}`
        currentGroup = {
          id: makeId("group", groupName),
          name: groupName,
          standings: [],
        }
        groups.push(currentGroup)
        teamRank = 0
        continue
      }

      // Check if any cell in this row contains a team name
      if (currentGroup) {
        for (const cell of row) {
          const trimmed = (cell ?? "").trim()
          if (teamNames.has(trimmed)) {
            teamRank++
            currentGroup.standings.push({
              teamId: makeId(trimmed),
              teamName: trimmed,
              rank: teamRank,
              played: 0,
              won: 0,
              lost: 0,
              setsWon: 0,
              setsLost: 0,
              pointsWon: 0,
              pointsLost: 0,
            })
            break
          }
        }
      }
    }

    if (groups.length > 0) {
      warnings.push({
        source: SOURCE,
        message: `Parsed ${groups.length} groups from groups sheet`,
        timestamp: new Date().toISOString(),
      })
    }

    return groups
  }

  /** Determine tournament status from matches */
  private determineTournamentStatus(matches: Match[]): TournamentStatus {
    if (matches.length === 0) return "upcoming"
    const hasLive = matches.some((m) => m.status === "live")
    if (hasLive) return "live"
    const finishedCount = matches.filter((m) => m.status === "finished").length
    if (finishedCount === matches.length) return "finished"
    if (finishedCount > 0) return "live"
    return "upcoming"
  }
}
