import { cn } from "@/lib/utils"

interface VolleyballIconProps {
  className?: string
  size?: number
}

let counter = 0

/**
 * Realistic Mikasa VLS300-style beach volleyball icon.
 * Blue and yellow panels on white with 3D shading and seam lines.
 * Uses unique gradient IDs per instance to avoid SVG conflicts.
 */
export function VolleyballIcon({ className, size = 32 }: VolleyballIconProps) {
  const p = `vb${++counter}`
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
      <defs>
        <radialGradient id={`${p}-s`} cx="0.35" cy="0.3" r="0.65" fx="0.35" fy="0.3">
          <stop offset="0%" stopColor="#FFFEF8" />
          <stop offset="40%" stopColor="#F5F0E6" />
          <stop offset="75%" stopColor="#E8DFD0" />
          <stop offset="100%" stopColor="#D5CBBA" />
        </radialGradient>
        <linearGradient id={`${p}-b1`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B7AB5" />
          <stop offset="50%" stopColor="#155F8A" />
          <stop offset="100%" stopColor="#0F4A6E" />
        </linearGradient>
        <linearGradient id={`${p}-b2`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A72A8" />
          <stop offset="50%" stopColor="#14608D" />
          <stop offset="100%" stopColor="#104D72" />
        </linearGradient>
        <linearGradient id={`${p}-b3`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#186FA0" />
          <stop offset="50%" stopColor="#125B85" />
          <stop offset="100%" stopColor="#0E4868" />
        </linearGradient>
        <linearGradient id={`${p}-g1`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8BD5A" />
          <stop offset="50%" stopColor="#D4A843" />
          <stop offset="100%" stopColor="#C49835" />
        </linearGradient>
        <linearGradient id={`${p}-g2`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0B54E" />
          <stop offset="50%" stopColor="#CFA040" />
          <stop offset="100%" stopColor="#BF9232" />
        </linearGradient>
        <linearGradient id={`${p}-g3`} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0%" stopColor="#DCAF48" />
          <stop offset="50%" stopColor="#C99C38" />
          <stop offset="100%" stopColor="#B88D2C" />
        </linearGradient>
        <radialGradient id={`${p}-h`} cx="0.32" cy="0.28" r="0.35">
          <stop offset="0%" stopColor="white" stopOpacity="0.35" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${p}-sh`} cx="0.5" cy="0.85" r="0.4">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${p}-c`}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>

      {/* Ball base sphere */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-s)`} />

      {/* Colored panels */}
      <g clipPath={`url(#${p}-c)`}>
        {/* Panel group 1: Top-left */}
        <path d="M32 2C22 2 13 6.5 7 13.5C12 12 18 11.5 24 13C28 14 31.5 15.8 34.5 18C37.5 12 38.5 6.5 38 2.5C36 2.2 34 2 32 2Z" fill={`url(#${p}-b1)`} />
        <path d="M7 13.5C3.5 17.5 2 22.5 2 28C2.5 29 3.5 30.5 5 32C9 30 15 29 22 29.5C26 29.8 29.5 30.8 32.5 32C34 29 35 25.5 34.5 18C31.5 15.8 28 14 24 13C18 11.5 12 12 7 13.5Z" fill={`url(#${p}-g1)`} />

        {/* Panel group 2: Right */}
        <path d="M54 14C50 9.5 44.5 6.5 38.5 5C39 9 38.5 14 36.5 19.5C35.5 22 34 24.5 32.5 27C36 28 40 28.5 44 28C50 27 55.5 24.5 59.5 21C58 18 56 16 54 14Z" fill={`url(#${p}-b2)`} />
        <path d="M59.5 21C61 25 62 29 62 33C61.5 34 60.5 35.5 59 37C55 35 50 34 44.5 34C40 34 36 35 32.5 37C33.5 34 34 31 32.5 27C34 24.5 35.5 22 36.5 19.5C38.5 14 39 9 38.5 5C44.5 6.5 50 9.5 54 14C56 16 58 18 59.5 21Z" fill={`url(#${p}-g2)`} />

        {/* Panel group 3: Bottom */}
        <path d="M12 52C16 56.5 21.5 59.5 28 61C27 57 27.5 52 29.5 47C30.5 44.5 32 42 34 40C30 38.5 25.5 37.5 20.5 37.5C14 38 8 40.5 4 44C6 47 9 50 12 52Z" fill={`url(#${p}-b3)`} />
        <path d="M34 40C37 42 39.5 44.5 41.5 47.5C44.5 52 46 57 46 61C42 62 38 62 34 61.5C30 62 28.5 61.5 28 61C21.5 59.5 16 56.5 12 52C9 50 6 47 4 44C5 41 6 39 8 37C8 38 14 38 20.5 37.5C25.5 37.5 30 38.5 34 40Z" fill={`url(#${p}-g3)`} />
      </g>

      {/* Seam lines */}
      <g clipPath={`url(#${p}-c)`} stroke="#BEB09C" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M34.5 18C35 22 34.5 25.5 32.5 27L32.5 32" />
        <path d="M32.5 37C33.5 34 34 31 32.5 27" />
        <path d="M59 37C55 35 50 34 44.5 34C40 34 36 35 32.5 37" />
        <path d="M5 32C9 30 15 29 22 29.5C26 29.8 29.5 30.8 32.5 32" />
        <path d="M7 13.5C12 12 18 11.5 24 13C28 14 31.5 15.8 34.5 18" />
        <path d="M38.5 5C39 9 38.5 14 36.5 19.5" />
        <path d="M59.5 21C55.5 24.5 50 27 44 28C40 28.5 36 28 32.5 27" />
        <path d="M34 40C30 38.5 25.5 37.5 20.5 37.5C14 38 8 40.5 4 44" />
        <path d="M28 61C27 57 27.5 52 29.5 47C30.5 44.5 32 42 34 40" />
        <path d="M46 61C46 57 44.5 52 41.5 47.5C39.5 44.5 37 42 34 40" />
      </g>

      {/* Seam shadow for depth */}
      <g clipPath={`url(#${p}-c)`} stroke="#A89880" strokeWidth="0.4" fill="none" strokeLinecap="round" opacity="0.5">
        <path d="M34.5 18C35 22 34.5 25.5 32.5 27L32.5 32" transform="translate(0.3 0.5)" />
        <path d="M32.5 37C33.5 34 34 31 32.5 27" transform="translate(0.3 0.5)" />
        <path d="M5 32C9 30 15 29 22 29.5C26 29.8 29.5 30.8 32.5 32" transform="translate(0.3 0.5)" />
      </g>

      {/* 3D lighting */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-h)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sh)`} />
      <circle cx="32" cy="32" r="30" stroke="#C8BBAA" strokeWidth="0.8" fill="none" />

      {/* Specular highlights */}
      <ellipse cx="22" cy="18" rx="5" ry="3.5" fill="white" opacity="0.25" transform="rotate(-25 22 18)" />
      <ellipse cx="20" cy="16" rx="2" ry="1.5" fill="white" opacity="0.35" transform="rotate(-25 20 16)" />
    </svg>
  )
}
