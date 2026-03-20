import { TournamentParser, ParseResult } from "@/lib/parsers/types"
import { GoogleSheetResult, SheetData } from "@/lib/adapters/google-sheet"
import { TournamentConfig } from "@/lib/tournament/config"
import {
  Team,
  Match,
  Group,
  Bracket,
  BracketMatch,
  MatchStatus,
  TournamentStatus,
  ParserWarning,
  TournamentSnapshot,
  GroupStanding,
} from "@/lib/tournament/schema"
import { makeId } from "@/lib/parsers/sheet-utils"

const SOURCE = "bvis-parser"

/** Round code → Czech round name for main event */
const HS_ROUND_CODE_MAP: Record<string, string> = {
  I: "1. kolo",
  II: "2. kolo",
  III: "Čtvrtfinále",
  SF: "Semifinále",
  F1: "Finále",
  F3: "O 3. místo",
}

/** Round code → bracket order (for sorting bracket rounds) */
const BRACKET_ROUND_ORDER: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  SF: 4,
  F3: 5,
  F1: 6,
}

/** Match type code → phase */
const MATCH_TYPE_PHASE: Record<string, "playoff" | "placement"> = {
  e: "playoff",
  q: "placement",
  s: "playoff",
  f: "playoff",
}

export class BvisParser implements TournamentParser {
  parse(sheetData: GoogleSheetResult, config: TournamentConfig): ParseResult {
    const warnings: ParserWarning[] = []

    const hsStartlist = sheetData.sheets["hs-startlist"]
    const hsMatches = sheetData.sheets["hs-matches"]
    const qStartlist = sheetData.sheets["q-startlist"]
    const qMatches = sheetData.sheets["q-matches"]
    const qGroups = sheetData.sheets["q-groups"]

    // Parse main event teams
    const hsTeams = hsStartlist
      ? this.parseHsTeams(hsStartlist, warnings)
      : []

    // Parse qualification teams
    const qTeams = qStartlist
      ? this.parseQTeams(qStartlist, warnings)
      : []

    // Deduplicate: HS teams take priority, merge Q teams that aren't already in HS
    const teamMap = new Map<string, Team>()
    for (const t of hsTeams) teamMap.set(t.name.toLowerCase(), t)
    for (const t of qTeams) {
      if (!teamMap.has(t.name.toLowerCase())) teamMap.set(t.name.toLowerCase(), t)
    }
    const allTeams = Array.from(teamMap.values())

    if (allTeams.length === 0) {
      warnings.push({
        source: SOURCE,
        message: "No teams parsed from any startlist sheet",
        timestamp: new Date().toISOString(),
      })
    }

    // Parse main event matches
    const hsMatchList = hsMatches
      ? this.parseHsMatches(hsMatches, allTeams, warnings)
      : []

    // Parse qualification matches
    const qMatchList = qMatches
      ? this.parseQMatches(qMatches, allTeams, warnings)
      : []

    const allMatches = [...hsMatchList, ...qMatchList]

    // Parse qualification groups
    const groups = qGroups
      ? this.parseQGroups(qGroups, qTeams, warnings)
      : []

    // Build bracket from main event playoff matches only
    const bracket = this.buildBracketFromMatches(hsMatchList)

    // Determine status based on main event matches
    const status = this.determineTournamentStatus(hsMatchList)

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
      teams: allTeams,
      matches: allMatches,
      groups,
      bracket: bracket && bracket.rounds.length > 0 ? bracket : undefined,
      sources: config.sourceReferences,
    }

    return { snapshot, warnings }
  }

  // ---------------------------------------------------------------------------
  // Team parsing
  // ---------------------------------------------------------------------------

  /** Parse main event teams from "HS - Startovní listina" */
  private parseHsTeams(sheet: SheetData, warnings: ParserWarning[]): Team[] {
    const teams: Team[] = []
    const allRows = [sheet.headers, ...sheet.rows]

    for (const row of allRows) {
      const seedStr = (row[0] ?? "").trim()
      const seed = parseInt(seedStr, 10)
      if (isNaN(seed) || seed <= 0) continue

      const teamName = (row[1] ?? "").trim()
      if (!teamName) continue

      const playerNames = teamName.split(" / ").map((n) => n.trim()).filter(Boolean)
      const players = playerNames.map((name) => ({ name }))

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
        message: `Parsed ${teams.length} main event teams from HS startlist`,
        timestamp: new Date().toISOString(),
      })
    }

    return teams
  }

  /** Parse qualification teams from "Q - Startovní listina" */
  private parseQTeams(sheet: SheetData, warnings: ParserWarning[]): Team[] {
    const teams: Team[] = []
    const allRows = [sheet.headers, ...sheet.rows]

    for (const row of allRows) {
      const seedStr = (row[0] ?? "").trim()
      const seed = parseInt(seedStr, 10)
      if (isNaN(seed) || seed <= 0) continue
      // Only parse seeded qualification teams (1-18), skip the full entry list below
      if (seed > 18) break

      const teamName = (row[1] ?? "").trim()
      if (!teamName) continue

      const playerNames = teamName.split(" / ").map((n) => n.trim()).filter(Boolean)
      const players = playerNames.map((name) => ({ name }))

      // Col 3: group assignment like "Skupina A"
      const groupStr = (row[3] ?? "").trim()
      const groupMatch = /Skupina\s+(\S+)/i.exec(groupStr)
      const groupId = groupMatch ? makeId("q-group", groupMatch[1]) : undefined

      const id = makeId(teamName)

      // Check for duplicate (team may already exist in HS startlist)
      teams.push({
        id,
        name: teamName,
        players,
        seed,
        ...(groupId ? { groupId } : {}),
      })
    }

    if (teams.length > 0) {
      warnings.push({
        source: SOURCE,
        message: `Parsed ${teams.length} qualification teams from Q startlist`,
        timestamp: new Date().toISOString(),
      })
    }

    return teams
  }

  // ---------------------------------------------------------------------------
  // Match parsing
  // ---------------------------------------------------------------------------

  /** Parse main event matches from "HS - utkání" */
  private parseHsMatches(
    sheet: SheetData,
    teams: Team[],
    warnings: ParserWarning[],
  ): Match[] {
    const matches = this.parseMatchSheet(sheet, teams, warnings, "hs")
    warnings.push({
      source: SOURCE,
      message: `Parsed ${matches.length} main event matches (${matches.filter((m) => m.status === "finished").length} finished)`,
      timestamp: new Date().toISOString(),
    })
    return matches
  }

  /** Parse qualification matches from "Q - utkání" */
  private parseQMatches(
    sheet: SheetData,
    teams: Team[],
    warnings: ParserWarning[],
  ): Match[] {
    const matches = this.parseMatchSheet(sheet, teams, warnings, "q")
    warnings.push({
      source: SOURCE,
      message: `Parsed ${matches.length} qualification matches (${matches.filter((m) => m.status === "finished").length} finished)`,
      timestamp: new Date().toISOString(),
    })
    return matches
  }

  /** Shared match sheet parser for both HS and Q formats */
  private parseMatchSheet(
    sheet: SheetData,
    teams: Team[],
    warnings: ParserWarning[],
    prefix: "hs" | "q",
  ): Match[] {
    const matches: Match[] = []
    const allRows = [sheet.headers, ...sheet.rows]

    if (allRows.length <= 1) {
      warnings.push({
        source: SOURCE,
        message: `${prefix.toUpperCase()} matches sheet is empty or has no data rows`,
        timestamp: new Date().toISOString(),
      })
      return matches
    }

    const teamMap = new Map(teams.map((t) => [t.name.toLowerCase(), t]))

    for (let i = 1; i < allRows.length; i++) {
      const row = allRows[i]

      // Col 0: match number
      const matchNumStr = (row[0] ?? "").trim()
      const matchNum = parseInt(matchNumStr, 10)
      if (isNaN(matchNum) || matchNum <= 0) continue

      // Col 1: round code
      const roundCode = (row[1] ?? "").trim()

      // Col 2: date (e.g. "21/3", "22/3")
      const dateStr = (row[2] ?? "").trim()

      // Col 3: time (e.g. "9:00")
      const timeStr = (row[3] ?? "").trim()

      // Col 4: court
      const courtStr = (row[4] ?? "").trim()

      // Col 5: team A name
      const teamAName = (row[5] ?? "").trim()

      // Col 7: team B name
      const teamBName = (row[7] ?? "").trim()

      // Skip rows where both team names are empty (phantom/trailing rows)
      if (!teamAName && !teamBName) continue

      // Col 8, 10: set score (e.g. "2":"0")
      const scoreAStr = (row[8] ?? "").trim()
      const scoreA = parseInt(scoreAStr, 10)
      const scoreBStr = (row[10] ?? "").trim()
      const scoreB = parseInt(scoreBStr, 10)

      // Set scores from cols 12, 14, 16
      const set1Str = (row[12] ?? "").trim()
      const set2Str = (row[14] ?? "").trim()
      const set3Str = (row[16] ?? "").trim()

      // Col 22: match type code
      const matchTypeCode = (row[22] ?? "").trim().toLowerCase()

      // Map round code to name and determine phase/groupId
      let roundName: string | undefined
      let phase: Match["phase"]
      let groupId: string | undefined

      if (prefix === "hs") {
        // Main event round mapping
        if (HS_ROUND_CODE_MAP[roundCode]) {
          roundName = HS_ROUND_CODE_MAP[roundCode]
        } else {
          // Placement rounds: numeric codes like "17", "13", "9", "7", "5"
          const placementNum = parseInt(roundCode, 10)
          if (!isNaN(placementNum) && placementNum > 0) {
            roundName = `O ${placementNum}. místo`
          }
        }
        // Phase from match type code
        phase = MATCH_TYPE_PHASE[matchTypeCode] || "playoff"
      } else {
        // Qualification round mapping
        // Group rounds: "A-I", "A-II", "B-I", etc.
        // Crossover rounds: just "I"
        const qGroupRoundMatch = /^([A-F])-(.+)$/i.exec(roundCode)
        if (qGroupRoundMatch) {
          const groupLetter = qGroupRoundMatch[1].toUpperCase()
          const subRound = qGroupRoundMatch[2]
          roundName = `Sk. ${groupLetter} - ${subRound}. zápas`
          phase = "group"
          groupId = makeId("q-group", groupLetter)
        } else {
          // Crossover/playoff round in qualification
          roundName = `Kvalifikace - ${roundCode}. kolo`
          phase = "playoff"
        }
      }

      // Determine match status
      const hasScore = (!isNaN(scoreA) && scoreA > 0) || (!isNaN(scoreB) && scoreB > 0)
      const status: MatchStatus = hasScore ? "finished" : "scheduled"

      // Parse set scores
      const score = this.parseSetScores(scoreA, scoreB, set1Str, set2Str, set3Str)

      // Resolve teams
      const teamAResolved = this.resolveTeam(teamAName, teamMap)
      const teamBResolved = this.resolveTeam(teamBName, teamMap)

      // Build scheduled time
      const scheduledTime = this.buildScheduledTime(dateStr, timeStr)

      matches.push({
        id: makeId(prefix, "match", String(matchNum)),
        round: roundName,
        court: courtStr || undefined,
        scheduledTime: scheduledTime || undefined,
        status,
        teamA: teamAResolved,
        teamB: teamBResolved,
        score: score || undefined,
        bracketRound: prefix === "hs" ? roundName : undefined,
        phase,
        groupId,
      })
    }

    return matches
  }

  /** Resolve a team name to a match team reference */
  private resolveTeam(
    name: string,
    teamMap: Map<string, Team>,
  ): { teamId: string; name: string } | undefined {
    if (!name) return undefined

    const team = teamMap.get(name.toLowerCase())
    if (team) {
      return { teamId: team.id, name: team.name }
    }

    // Make TBD references readable and aligned with bracket match numbers (#N)
    const vitezMatch = /^vítěz\s*#(\d+)\s*$/i.exec(name)
    if (vitezMatch) {
      return { teamId: makeId(name), name: `Vítěz #${vitezMatch[1]}` }
    }
    const porazenyMatch = /^poražený\s*#(\d+)\s*$/i.exec(name)
    if (porazenyMatch) {
      return { teamId: makeId(name), name: `Poražený #${porazenyMatch[1]}` }
    }
    return { teamId: makeId(name), name }
  }

  /** Parse set scores from individual columns.
   * B-VIS format: positive number = team A won that set (number is opponent's score),
   * negative number = team A lost that set (abs value is team A's score).
   * Winner gets 21 in regular sets, 15 in tiebreak (set 3).
   */
  private parseSetScores(
    scoreA: number,
    scoreB: number,
    set1Str: string,
    set2Str: string,
    set3Str: string,
  ): Match["score"] | null {
    const setsA = isNaN(scoreA) ? 0 : scoreA
    const setsB = isNaN(scoreB) ? 0 : scoreB

    // Not yet played
    if (setsA === 0 && setsB === 0) return null

    const sets: { teamA: number; teamB: number }[] = []
    const isTiebreak = setsA + setsB === 3 // 2:1 match has a tiebreak set 3

    const parseSetScore = (str: string, setIndex: number): { teamA: number; teamB: number } | null => {
      if (!str) return null
      // Try "X:Y" format first
      const colonMatch = /^(\d+):(\d+)$/.exec(str)
      if (colonMatch) {
        return { teamA: parseInt(colonMatch[1], 10), teamB: parseInt(colonMatch[2], 10) }
      }
      // B-VIS single number format:
      // Positive = team A won set, number is opponent's (team B) score
      // Negative = team A lost set, abs value is team A's score
      const num = parseInt(str, 10)
      if (!isNaN(num)) {
        const winScore = (isTiebreak && setIndex === 2) ? 15 : 21
        // Ensure winning score is at least loser's score + 2
        const loserScore = Math.abs(num)
        const actualWinScore = loserScore >= winScore - 1 ? loserScore + 2 : winScore
        if (num > 0) {
          // Team A won this set
          return { teamA: actualWinScore, teamB: loserScore }
        } else if (num < 0) {
          // Team B won this set
          return { teamA: loserScore, teamB: actualWinScore }
        }
      }
      return null
    }

    const s1 = parseSetScore(set1Str, 0)
    if (s1) sets.push(s1)
    const s2 = parseSetScore(set2Str, 1)
    if (s2) sets.push(s2)
    const s3 = parseSetScore(set3Str, 2)
    if (s3) sets.push(s3)

    const winner =
      setsA > setsB
        ? ("teamA" as const)
        : setsB > setsA
          ? ("teamB" as const)
          : undefined

    return { sets, winner }
  }

  /** Build scheduled time string from date and time columns */
  private buildScheduledTime(dateStr: string, timeStr: string): string | null {
    if (!dateStr) return null

    // dateStr is like "21/3" or "22/3"
    const dateParts = dateStr.split("/")
    if (dateParts.length !== 2) return dateStr

    const day = dateParts[0].trim()
    const month = dateParts[1].trim()

    const formatted = `${day}. ${month}.`
    if (timeStr) {
      return `${formatted} ${timeStr}`
    }
    return formatted
  }

  // ---------------------------------------------------------------------------
  // Qualification groups
  // ---------------------------------------------------------------------------

  /** Parse qualification groups from "Q - Skupiny" */
  private parseQGroups(
    sheet: SheetData,
    qTeams: Team[],
    warnings: ParserWarning[],
  ): Group[] {
    const allRows = [sheet.headers, ...sheet.rows]
    const groups: Group[] = []

    const teamsByName = new Map(qTeams.map((t) => [t.name.toLowerCase(), t]))

    let currentGroup: Group | null = null

    for (const row of allRows) {
      const firstCell = (row[0] ?? "").trim()

      // Detect group header: "SKUPINA X" (may appear anywhere in the cell, e.g. title row)
      const groupHeaderMatch = /SKUPINA\s+(\S+)/i.exec(firstCell)
      if (groupHeaderMatch) {
        const letter = groupHeaderMatch[1].toUpperCase()
        currentGroup = {
          id: makeId("q-group", letter),
          name: `Skupina ${letter}`,
          standings: [],
        }
        groups.push(currentGroup)
        continue
      }

      if (!currentGroup) continue

      // Team rows have ID like "A1", "A2", "A3" in col 0 and team name in col 1
      const idCell = (row[0] ?? "").trim()
      const teamIdMatch = /^[A-F]\d$/i.exec(idCell)
      if (!teamIdMatch) continue

      const teamName = (row[1] ?? "").trim()
      if (!teamName) continue

      const team = teamsByName.get(teamName.toLowerCase())

      // Parse sets ratio from col 23 (format like "4:1" or "2:4")
      const setsRatioStr = (row[23] ?? "").trim()
      const setsMatch = /^(\d+)\s*:\s*(\d+)$/.exec(setsRatioStr)
      const setsWon = setsMatch ? parseInt(setsMatch[1], 10) : 0
      const setsLost = setsMatch ? parseInt(setsMatch[2], 10) : 0

      // Parse points ratio from col 24 (format like "120:80")
      const pointsRatioStr = (row[24] ?? "").trim()
      const pointsMatch = /^(\d+)\s*:\s*(\d+)$/.exec(pointsRatioStr)
      const pointsWon = pointsMatch ? parseInt(pointsMatch[1], 10) : 0
      const pointsLost = pointsMatch ? parseInt(pointsMatch[2], 10) : 0

      // Parse rank from col 25
      const rankStr = (row[25] ?? "").trim()
      const rank = parseInt(rankStr, 10) || (currentGroup.standings.length + 1)

      // Calculate played/won/lost from sets
      const totalSets = setsWon + setsLost
      // In groups of 3, each team plays 2 matches
      const played = totalSets > 0 ? Math.min(2, Math.ceil(totalSets / 2)) : 0
      // A match win = winning 2 sets
      const won = Math.floor(setsWon / 2)
      const lost = played - won

      const standing: GroupStanding = {
        teamId: team?.id ?? makeId(teamName),
        teamName,
        rank,
        played,
        won,
        lost,
        setsWon,
        setsLost,
        pointsWon,
        pointsLost,
      }

      currentGroup.standings.push(standing)
    }

    // Sort standings by rank within each group
    for (const group of groups) {
      group.standings.sort((a, b) => a.rank - b.rank)
    }

    if (groups.length > 0) {
      warnings.push({
        source: SOURCE,
        message: `Parsed ${groups.length} qualification groups from Q groups sheet`,
        timestamp: new Date().toISOString(),
      })
    }

    return groups
  }

  // ---------------------------------------------------------------------------
  // Bracket building
  // ---------------------------------------------------------------------------

  /** Build bracket structure from main event playoff matches */
  private buildBracketFromMatches(matches: Match[]): Bracket {
    const bracketMatches = matches.filter(
      (m) => m.phase === "playoff" && m.bracketRound,
    )

    // Group by round name
    const roundMap = new Map<string, { order: number; matches: Match[] }>()

    for (const m of bracketMatches) {
      const roundName = m.bracketRound!
      if (!roundMap.has(roundName)) {
        const order = this.getRoundOrder(roundName)
        roundMap.set(roundName, { order, matches: [] })
      }
      roundMap.get(roundName)!.matches.push(m)
    }

    // Sort rounds by order
    const sortedRounds = Array.from(roundMap.entries())
      .sort((a, b) => a[1].order - b[1].order)

    const rounds = sortedRounds.map(([name, { matches: roundMatches }]) => ({
      name,
      matches: roundMatches.map((m, idx): BracketMatch => ({
        matchId: m.id,
        round: name,
        position: idx,
        teamA: m.teamA,
        teamB: m.teamB,
        winner: m.score?.winner,
        score: m.score
          ? m.score.sets.map((s) => `${s.teamA}:${s.teamB}`).join(", ")
          : undefined,
      })),
    }))

    return { rounds }
  }

  /** Get bracket round ordering from Czech round name */
  private getRoundOrder(roundName: string): number {
    for (const [code, name] of Object.entries(HS_ROUND_CODE_MAP)) {
      if (name === roundName) {
        return BRACKET_ROUND_ORDER[code] ?? 99
      }
    }
    return 99
  }

  // ---------------------------------------------------------------------------
  // Tournament status
  // ---------------------------------------------------------------------------

  /** Determine tournament status from main event matches */
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
