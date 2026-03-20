import { cs } from "./cs"
export type { Messages } from "./cs"

const messages = { cs } as const
type Locale = keyof typeof messages

const defaultLocale: Locale = "cs"

export function t(): typeof cs {
  return messages[defaultLocale]
}
