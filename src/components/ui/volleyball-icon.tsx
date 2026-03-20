import { cn } from "@/lib/utils"

interface VolleyballIconProps {
  className?: string
  size?: number
}

/**
 * Mikasa-style beach volleyball icon inspired by the official Olympic ball.
 * Blue and yellow panels on white, with the characteristic curved seam lines.
 */
export function VolleyballIcon({ className, size = 32 }: VolleyballIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="Beach volleyball"
      role="img"
    >
      {/* Ball base */}
      <circle cx="32" cy="32" r="30" fill="#F5F0E8" />

      {/* Blue panels */}
      <path
        d="M32 2C18.2 2 6.4 10.4 2.4 22.4C8 18 16 15 24 15C28 15 31.6 15.8 35 17.2C38 11.6 38.8 6 38 2.4C36.2 2.1 34.1 2 32 2Z"
        fill="#1a6fa0"
      />
      <path
        d="M10.4 52C14 56 18.8 59 24 60.8C24 56 25.6 50.8 28.8 46C31.2 42.4 34.4 39.2 38 36.8C34 34 29.6 32 24.8 31.2C18 30 11.6 31.2 6.4 34C5.2 38.8 6.4 45.6 10.4 52Z"
        fill="#1a6fa0"
      />
      <path
        d="M54 14C50.8 10 46.4 7.2 41.6 5.6C42 10 41.2 15.6 38.4 21.6C37.2 24 35.6 26.2 33.6 28.2C37.6 30 42 30.8 46.4 30.4C52 29.6 56.8 27.2 60 23.6C59.2 20 57 16.8 54 14Z"
        fill="#1a6fa0"
      />

      {/* Yellow/gold panels */}
      <path
        d="M38 36.8C42 34 46.8 32 52 31.6C56 31.2 59.6 31.6 62 32.8C61.6 40 58 46.4 52.8 51.2C48.4 48 44 43.6 41.2 39.6C40 38.4 38.8 37.6 38 36.8Z"
        fill="#d4a853"
      />
      <path
        d="M24 15C16 15 8 18 2.4 22.4C2 24 2 25.6 2 27.2C2.4 28.8 2.8 30.4 3.6 32C4.4 32 5.6 31.6 6.4 34C11.6 31.2 18 30 24.8 31.2C26.4 31.6 28 32 29.6 32.4C31.6 30 33.2 27.2 34.4 24C35 22 35.2 19.6 35 17.2C31.6 15.8 28 15 24 15Z"
        fill="#d4a853"
      />
      <path
        d="M28.8 46C25.6 50.8 24 56 24 60.8C26.4 61.6 29.2 62 32 62C40 62 47.2 58.4 52 52.8C52.4 52.4 52.8 51.6 52.8 51.2C48 48 43.6 44.4 40.4 40.4C36.8 42.4 33.2 44.4 28.8 46Z"
        fill="#d4a853"
      />

      {/* Seam lines */}
      <path
        d="M35 17.2C31.6 15.8 28 15 24 15C16 15 8 18 2.4 22.4"
        stroke="#e0d5c4"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M38 36.8C34 34 29.6 32 24.8 31.2C18 30 11.6 31.2 6.4 34"
        stroke="#e0d5c4"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M38 36.8C42 34 46.8 32 52 31.6C56 31.2 59.6 31.6 62 32.8"
        stroke="#e0d5c4"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M38.4 21.6C37.2 24 35.6 26.2 33.6 28.2"
        stroke="#e0d5c4"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M28.8 46C25.6 50.8 24 56 24 60.8"
        stroke="#e0d5c4"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M52.8 51.2C48 48 43.6 44.4 40.4 40.4"
        stroke="#e0d5c4"
        strokeWidth="0.8"
        fill="none"
      />

      {/* Outer ring shadow/edge */}
      <circle cx="32" cy="32" r="30" stroke="#d5cdc0" strokeWidth="1" fill="none" />

      {/* Subtle 3D highlight */}
      <ellipse cx="24" cy="20" rx="12" ry="8" fill="white" opacity="0.15" transform="rotate(-20 24 20)" />
    </svg>
  )
}
