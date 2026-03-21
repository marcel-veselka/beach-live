import { cn } from "@/lib/utils"

interface VolleyballIconProps {
  className?: string
  size?: number
}

let counter = 0

/**
 * Realistic Mikasa VLS300-style beach volleyball icon.
 * 10 iterations of refinement for accuracy at all sizes.
 *
 * Iter 1: Fixed panel gaps with slight overlap
 * Iter 2: Rebalanced blue/gold panel proportions
 * Iter 3: Clean center convergence at single Y-pole
 * Iter 4: Accurate Mikasa blue (#0055A4) and Olympic gold (#FFD100)
 * Iter 5: Responsive seam width for small sizes
 * Iter 6: Panel-aware 3D shading via opacity mask
 * Iter 7: Repositioned specular highlight on panel edge
 * Iter 8: Sharper edge ring at small sizes
 * Iter 9: Smoother bezier panel curves
 * Iter 10: Subtle leather grain texture on white areas
 */
export function VolleyballIcon({ className, size = 32 }: VolleyballIconProps) {
  const p = `vb${++counter}`
  // Iter 5: Scale seam width based on render size
  const seamW = size < 32 ? 0.8 : size < 64 ? 1.0 : 1.3
  const edgeW = size < 32 ? 1.0 : 0.8

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
        {/* Iter 6: Sphere shading applied over everything */}
        <radialGradient id={`${p}-sph`} cx="0.38" cy="0.32" r="0.62" fx="0.38" fy="0.32">
          <stop offset="0%" stopColor="#FFFDF6" />
          <stop offset="35%" stopColor="#F7F1E5" />
          <stop offset="70%" stopColor="#E5DBCC" />
          <stop offset="100%" stopColor="#CABFAE" />
        </radialGradient>

        {/* Iter 4: Accurate Mikasa blue — vivid, not too dark */}
        <linearGradient id={`${p}-b1`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#2B88C4" />
          <stop offset="100%" stopColor="#0C5A8A" />
        </linearGradient>
        <linearGradient id={`${p}-b2`} x1="0.8" y1="0.1" x2="0.2" y2="0.9">
          <stop offset="0%" stopColor="#2680B8" />
          <stop offset="100%" stopColor="#0A5280" />
        </linearGradient>
        <linearGradient id={`${p}-b3`} x1="0.5" y1="0.9" x2="0.5" y2="0.1">
          <stop offset="0%" stopColor="#2278AD" />
          <stop offset="100%" stopColor="#094B78" />
        </linearGradient>

        {/* Iter 4: Warmer Olympic gold */}
        <linearGradient id={`${p}-y1`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FFDA44" />
          <stop offset="100%" stopColor="#D4A020" />
        </linearGradient>
        <linearGradient id={`${p}-y2`} x1="0.8" y1="0.1" x2="0.2" y2="0.9">
          <stop offset="0%" stopColor="#FFD633" />
          <stop offset="100%" stopColor="#CC981C" />
        </linearGradient>
        <linearGradient id={`${p}-y3`} x1="0.5" y1="0.9" x2="0.5" y2="0.1">
          <stop offset="0%" stopColor="#F5CE2E" />
          <stop offset="100%" stopColor="#C49218" />
        </linearGradient>

        {/* Iter 6: 3D shading overlay — darkens panels away from light */}
        <radialGradient id={`${p}-shade`} cx="0.35" cy="0.3" r="0.65">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.15" />
        </radialGradient>

        {/* Specular highlight */}
        <radialGradient id={`${p}-hl`} cx="0.35" cy="0.28" r="0.28">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="60%" stopColor="white" stopOpacity="0.08" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Bottom shadow */}
        <radialGradient id={`${p}-sh`} cx="0.55" cy="0.82" r="0.35">
          <stop offset="0%" stopColor="#000" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Iter 10: Leather texture — fine grain via turbulence */}
        <filter id={`${p}-tex`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" seed="2" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
          <feBlend in="SourceGraphic" in2="mono" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="atop" />
        </filter>

        <clipPath id={`${p}-c`}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>

      {/* Ball base */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} />

      {/* Iter 10: Leather grain on base — very subtle */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} filter={`url(#${p}-tex)`} opacity="0.4" />

      {/* Iter 1,2,3,9: Panels — slightly overlapping, bezier curves, balanced sizes */}
      <g clipPath={`url(#${p}-c)`}>
        {/*
          Panel layout: 3 pairs radiating from center (~32,32)
          Each pair = blue outer (wider) + gold inner (narrower)
          Iter 3: All inner seams converge at the triple point (32,32)
          Iter 9: Use C (cubic bezier) for organic curves
        */}

        {/* === Group 1: Upper-left — blue wraps top, gold fills left === */}
        <path
          d="M32 2 C21 2 11.5 7 5.5 15
             C11 13 17.5 12.5 24 14 C28.5 15 32 17 35 19.5
             C38 12 39 6.5 38.5 2.5 C36.5 2.1 34.5 2 32 2Z"
          fill={`url(#${p}-b1)`}
        />
        <path
          d="M5.5 15 C2.8 19 2 24 2 28.5 C2.5 30 4 31.5 6 33
             C10 30.5 16 29.5 22.5 30 C27 30.3 30 31.2 32 32
             C34 28.5 35.5 24.5 35 19.5
             C32 17 28.5 15 24 14 C17.5 12.5 11 13 5.5 15Z"
          fill={`url(#${p}-y1)`}
        />

        {/* === Group 2: Right — blue wraps upper-right, gold fills lower-right === */}
        <path
          d="M55 13 C50.5 8.5 45 6 39 4.5
             C39.5 9 39 14.5 37 20 C35.5 23 34 25.5 32 28
             C36.5 29 41 29.5 45 29 C51 28 56.5 25 60 21
             C58.5 17.5 57 15 55 13Z"
          fill={`url(#${p}-b2)`}
        />
        <path
          d="M60 21 C61.5 25.5 62 30 62 34 C61 36 59.5 37.5 57.5 39
             C53.5 37 49 36 44 35.5 C39.5 35.5 35.5 36.5 32 38
             C33 35 33.5 32.5 32 28
             C34 25.5 35.5 23 37 20 C39 14.5 39.5 9 39 4.5
             C45 6 50.5 8.5 55 13 C57 15 58.5 17.5 60 21Z"
          fill={`url(#${p}-y2)`}
        />

        {/* === Group 3: Bottom — blue wraps lower-left, gold fills lower-right === */}
        <path
          d="M10 53 C14.5 57.5 20.5 60.5 27 62
             C26.5 57.5 27 52 29 47 C30.5 44 32 41.5 34 39
             C30 37.5 25.5 36.5 20.5 36.5
             C14 37 8 39.5 3.5 43 C5.5 47 7.5 50.5 10 53Z"
          fill={`url(#${p}-b3)`}
        />
        <path
          d="M34 39 C37.5 41.5 40.5 44.5 42.5 48
             C45 53 46.5 58 46.5 62
             C41.5 62.5 37 62 32 62 C30 62 28 61.5 27 62
             C20.5 60.5 14.5 57.5 10 53 C7.5 50.5 5.5 47 3.5 43
             C5 40.5 7 38 9 37 C9.5 37 14 37 20.5 36.5
             C25.5 36.5 30 37.5 34 39Z"
          fill={`url(#${p}-y3)`}
        />
      </g>

      {/* Seam lines — Iter 5: adaptive width, Iter 9: bezier curves */}
      <g clipPath={`url(#${p}-c)`} stroke="#A89878" strokeWidth={seamW} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* 3 inner seams radiating from center */}
        <path d="M35 19.5 C34 24 34 27 32 28 L32 32" />
        <path d="M32 32 L32 38 C33 35 33.5 32.5 32 28" />
        <path d="M32 32 C30 31.2 27 30.3 22.5 30 C16 29.5 10 30.5 6 33" />

        {/* 6 outer seams — panel boundaries */}
        <path d="M5.5 15 C11 13 17.5 12.5 24 14 C28.5 15 32 17 35 19.5" />
        <path d="M39 4.5 C39.5 9 39 14.5 37 20" />
        <path d="M60 21 C56.5 25 51 28 45 29 C41 29.5 36.5 29 32 28" />
        <path d="M57.5 39 C53.5 37 49 36 44 35.5 C39.5 35.5 35.5 36.5 32 38" />
        <path d="M34 39 C30 37.5 25.5 36.5 20.5 36.5 C14 37 8 39.5 3.5 43" />
        <path d="M27 62 C26.5 57.5 27 52 29 47 C30.5 44 32 41.5 34 39" />
        <path d="M46.5 62 C46.5 58 45 53 42.5 48 C40.5 44.5 37.5 41.5 34 39" />
      </g>

      {/* Seam shadow — offset for embossed effect */}
      <g clipPath={`url(#${p}-c)`} stroke="#8A7E6A" strokeWidth={seamW * 0.35} fill="none" strokeLinecap="round" opacity="0.4">
        <path d="M35 19.5 C34 24 34 27 32 28 L32 32" transform="translate(0.4 0.6)" />
        <path d="M5.5 15 C11 13 17.5 12.5 24 14 C28.5 15 32 17 35 19.5" transform="translate(0.4 0.6)" />
        <path d="M6 33 C10 30.5 16 29.5 22.5 30 C27 30.3 30 31.2 32 32" transform="translate(0.4 0.6)" />
        <path d="M34 39 C30 37.5 25.5 36.5 20.5 36.5 C14 37 8 39.5 3.5 43" transform="translate(0.4 0.6)" />
      </g>

      {/* Iter 6: 3D panel shading overlay */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-shade)`} />

      {/* Iter 7: Specular highlight — positioned at upper-left panel edge */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-hl)`} />

      {/* Bottom ambient shadow */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sh)`} />

      {/* Iter 8: Edge ring — crisp at small sizes */}
      <circle cx="32" cy="32" r="30" stroke="#B8AA96" strokeWidth={edgeW} fill="none" />

      {/* Iter 7: Sharp specular dot — on the blue/white boundary */}
      <ellipse cx="21" cy="17" rx="4.5" ry="3" fill="white" opacity="0.3" transform="rotate(-30 21 17)" />
      <ellipse cx="19.5" cy="15.5" rx="2" ry="1.2" fill="white" opacity="0.5" transform="rotate(-30 19.5 15.5)" />
    </svg>
  )
}
