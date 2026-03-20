import { TournamentConfig } from "@/lib/tournament/config"
import { registerTournament } from "@/lib/tournament/registry"
import { BvisParser } from "./parser"

export const hmcrU18Praha2026: TournamentConfig = {
  slug: "hmcr-u18-praha-2026",
  name: "HMČR U18 ženy",
  subtitle: "Halové mistrovství ČR v plážovém volejbalu",
  venue: "Praha-Ladví",
  dates: "21. 3. 2026",
  category: "U18 ženy",
  organizer: "ČVS",
  active: true,
  parser: new BvisParser(),
  sources: {
    googleSheet: {
      spreadsheetId: "1rOtwIEPpUXzsZpagn3WPb-B1xaETdLy0_kZpk6mydw0",
      sheets: [
        { name: "startlist", sheetName: "HS - Startovní listina" },
        { name: "bracket", sheetName: "HS - Pavouk" },
        { name: "matches", sheetName: "HS - Zápasy" },
        { name: "groups", sheetName: "HS - Skupiny" },
      ],
    },
    pdf: {
      url: "https://www.cvf.cz/beach_priloha.php?nazev=20260321_Propozice_HMCR_U18z_Praha-Ladvi.pdf&id=4520",
    },
    cvf: {
      url: "https://www.cvf.cz/beach/turnaje/?vysledky=4520",
    },
  },
  sourceReferences: [
    { name: "Google Sheet (živá data)", url: "https://docs.google.com/spreadsheets/d/1rOtwIEPpUXzsZpagn3WPb-B1xaETdLy0_kZpk6mydw0", type: "google-sheet" },
    { name: "Propozice (PDF)", url: "https://www.cvf.cz/beach_priloha.php?nazev=20260321_Propozice_HMCR_U18z_Praha-Ladvi.pdf&id=4520", type: "pdf" },
    { name: "ČVS výsledky", url: "https://www.cvf.cz/beach/turnaje/?vysledky=4520", type: "cvf" },
  ],
}

registerTournament(hmcrU18Praha2026)
