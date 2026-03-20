import { cs } from "./cs"
export type { Messages } from "./cs"

const messages = { cs } as const
type Locale = keyof typeof messages

const defaultLocale: Locale = "cs"

export function t(): typeof cs {
  return messages[defaultLocale]
}

export function pluralize(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one
  if (n >= 2 && n <= 4) return few
  return many
}
