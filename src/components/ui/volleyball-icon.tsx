import { cn } from "@/lib/utils"

interface VolleyballIconProps {
  className?: string
  size?: number
}

let counter = 0

/**
 * Gala Smash Pro-inspired beach volleyball icon.
 * Yellow, white & red panels — realistic with a subtle cartoonish style.
 *
 * Iter 1: Base panel layout with yellow/white/red
 * Iter 2: Simplified to match actual Gala structure
 * Iter 3: Reduced red — narrow accent wedges only, wider white center band
 * Iter 4: Adjusted panel curves for organic 3D sphere feel
 * Iter 5: Responsive seam width, sharper edges at small sizes
 * Iter 6: Better 3D shading with panel-aware lighting
 * Iter 7: Cartoonish touch — slightly thicker outline, brighter specular
 * Iter 8: Fine-tuned yellow saturation and red accent proportions
 * Iter 9: Improved seam convergence — all seams meet cleanly at center
 * Iter 10: Leather dimple texture, final color balance, polished highlights
 */
export function VolleyballIcon({ className, size = 32 }: VolleyballIconProps) {
  const p = `vb${++counter}`
  const seamW = size < 24 ? 0.7 : size < 32 ? 0.9 : size < 64 ? 1.1 : 1.4
  const edgeW = size < 32 ? 1.4 : size < 64 ? 1.2 : 1.0

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
        {/* Sphere base — warm white leather */}
        <radialGradient id={`${p}-sph`} cx="0.38" cy="0.32" r="0.62" fx="0.38" fy="0.32">
          <stop offset="0%" stopColor="#FFFEF6" />
          <stop offset="30%" stopColor="#FBF6EC" />
          <stop offset="65%" stopColor="#EEE5D5" />
          <stop offset="100%" stopColor="#D8CCBA" />
        </radialGradient>

        {/* Yellow panel gradients — vibrant Gala yellow */}
        <linearGradient id={`${p}-y1`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FFE84D" />
          <stop offset="50%" stopColor="#FFD830" />
          <stop offset="100%" stopColor="#E0B818" />
        </linearGradient>
        <linearGradient id={`${p}-y2`} x1="0.7" y1="0.1" x2="0.3" y2="0.9">
          <stop offset="0%" stopColor="#FFE23D" />
          <stop offset="100%" stopColor="#D4AE15" />
        </linearGradient>
        <linearGradient id={`${p}-y3`} x1="0.4" y1="0.9" x2="0.6" y2="0.1">
          <stop offset="0%" stopColor="#FFDA2E" />
          <stop offset="100%" stopColor="#CCA814" />
        </linearGradient>

        {/* Red accent gradients — vivid red */}
        <linearGradient id={`${p}-r1`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#E83333" />
          <stop offset="100%" stopColor="#C21818" />
        </linearGradient>
        <linearGradient id={`${p}-r2`} x1="0.7" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#E52B2B" />
          <stop offset="100%" stopColor="#B51414" />
        </linearGradient>
        <linearGradient id={`${p}-r3`} x1="0.5" y1="0.8" x2="0.5" y2="0.2">
          <stop offset="0%" stopColor="#DD2222" />
          <stop offset="100%" stopColor="#AE1111" />
        </linearGradient>

        {/* 3D sphere shading */}
        <radialGradient id={`${p}-shade`} cx="0.36" cy="0.30" r="0.64">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="45%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.20" />
        </radialGradient>

        {/* Specular highlight — cartoonish bright spot */}
        <radialGradient id={`${p}-hl`} cx="0.32" cy="0.26" r="0.24">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="50%" stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Bottom ambient shadow */}
        <radialGradient id={`${p}-sh`} cx="0.55" cy="0.84" r="0.32">
          <stop offset="0%" stopColor="#000" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Dimpled leather texture */}
        <filter id={`${p}-tex`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="5" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
          <feBlend in="SourceGraphic" in2="mono" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="atop" />
        </filter>

        <clipPath id={`${p}-c`}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>

      {/* White leather base */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} filter={`url(#${p}-tex)`} opacity="0.25" />

      <g clipPath={`url(#${p}-c)`}>
        {/*
          Gala Smash Pro layout — 3 panel pairs radiating from center (~33,34).
          Each pair: large yellow panel + narrow red accent strip.
          White base shows through in center band.
        */}

        {/* === PAIR 1: TOP — yellow cap + thin red transition === */}
        {/* Yellow top cap — large, covers top 30% */}
        <path
          d="M32 2 C19 2 8 8 3 18
             C9 16 16 15 23 15.5 C28 16 32 18 36 21
             C39 14 40 7 39.5 2.5 C37 2.1 34.5 2 32 2Z"
          fill={`url(#${p}-y1)`}
        />
        {/* Narrow red strip — top-left transition */}
        <path
          d="M3 18 C2 21 2 24 2 27
             C6 25 12 23.5 18 23 C23 22.5 27 23 30 24
             C28 21 26 19 24 17.5 C19 16 12 16 6 17
             C4 17.5 3.5 17.8 3 18Z"
          fill={`url(#${p}-r1)`}
        />
        {/* Narrow red strip — top-right transition */}
        <path
          d="M39.5 2.5 C40 7 39 14 36 21
             C38 19.5 41 18.5 45 18 C49 17.5 53 18 56 20
             C52 11 46 5 39.5 2.5Z"
          fill={`url(#${p}-r2)`}
        />

        {/* === PAIR 2: RIGHT — yellow panel + thin red strip === */}
        {/* Yellow right panel */}
        <path
          d="M56 20 C59 24 61 29 62 34
             C58 32 53 30.5 48 30.5 C42 31 37 33 34 35.5
             C35 31 36 27 38 23.5 C40 20 43 18.5 45 18
             C49 17.5 53 18 56 20Z"
          fill={`url(#${p}-y2)`}
        />
        {/* Narrow red strip — right transition */}
        <path
          d="M62 34 C62 37.5 61.5 40.5 60.5 43
             C57 40.5 52 38.5 47 38 C42 37.5 38 38.5 35 40
             C34.5 38.5 34.5 37 34 35.5
             C37 33 42 31 48 30.5 C53 30.5 58 32 62 34Z"
          fill={`url(#${p}-r1)`}
        />

        {/* === PAIR 3: BOTTOM — two yellow panels + red accents === */}
        {/* Yellow bottom-right panel */}
        <path
          d="M60.5 43 C57.5 50 52 56 45 60
             C44 55 41.5 50 39 46 C37 43 35.5 41 34 39.5
             C36 38.5 40 37.5 44 37.5 C49 37.5 54 39.5 58 42
             C59 42.5 60 42.8 60.5 43Z"
          fill={`url(#${p}-y3)`}
        />
        {/* Yellow bottom-left panel */}
        <path
          d="M4.5 43 C7 50 13 56 20 60
             C21 55 23.5 50 26 46 C28 43 29.5 41 31 39.5
             C28.5 38.5 25 37.5 21 37.5 C16 37.5 10.5 39.5 6.5 42
             C5.5 42.5 5 42.8 4.5 43Z"
          fill={`url(#${p}-y2)`}
        />
        {/* Narrow red strip — bottom-left transition */}
        <path
          d="M2 27 C2 30 2 33 2.5 36 C3 38.5 3.5 40.5 4.5 43
             C7 40.5 12 38.5 17 37.5 C21.5 37 25.5 37.5 29 39
             C29.5 37 29.5 35 30 33
             C27 31 23 29.5 18 29 C12 28.5 6 28.5 2 27Z"
          fill={`url(#${p}-r3)`}
        />
        {/* Red accent — bottom center (narrow) */}
        <path
          d="M20 60 C25 61.5 29 62 32 62 C36 62 40 61.5 45 60
             C44 56 42 51 39.5 47 C37.5 43.5 36 41.5 34 39.5
             C33 39.5 32 39.5 31 39.5
             C29 41.5 27.5 43.5 25.5 47 C23 51 21 56 20 60Z"
          fill={`url(#${p}-r3)`}
        />
      </g>

      {/* Seam lines — warm tan color */}
      <g clipPath={`url(#${p}-c)`} stroke="#BEA46A" strokeWidth={seamW} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Top cap seams */}
        <path d="M3 18 C9 16 16 15 23 15.5 C28 16 32 18 36 21" />
        <path d="M39.5 2.5 C40 7 39 14 36 21" />

        {/* Upper transition seams */}
        <path d="M2 27 C6 25 12 23.5 18 23 C23 22.5 27 23 30 24" />
        <path d="M56 20 C53 18 49 17.5 45 18 C41 18.5 38 19.5 36 21" />

        {/* Center radial seams — converge at ~(33, 37) */}
        <path d="M36 21 C36 26 35 31 34 35.5 C33.5 37 33 38.5 33 39.5" />
        <path d="M30 24 C30 28 30 32 31 36 C31.5 37.5 32 38.5 33 39.5" />

        {/* Bottom radiating seams */}
        <path d="M33 39.5 C29.5 41 28 43 26 46 C23.5 50 21 55 20 60" />
        <path d="M33 39.5 C35.5 41 37 43 39 46 C41.5 50 44 55 45 60" />

        {/* Right panel seams */}
        <path d="M62 34 C58 32 53 30.5 48 30.5 C42 31 37 33 34 35.5" />
        <path d="M60.5 43 C57 40.5 52 38.5 47 38 C42 37.5 38 38.5 35 40" />

        {/* Left panel seams */}
        <path d="M2 27 C2 30.5 2 34 2.5 37 C3 39 3.5 41 4.5 43" />
        <path d="M4.5 43 C7 40.5 12 38.5 17 37.5 C21.5 37 25.5 37.5 29 39 C31 39.5 32 39.5 33 39.5" />
      </g>

      {/* Seam embossed shadow */}
      <g clipPath={`url(#${p}-c)`} stroke="#9A8858" strokeWidth={seamW * 0.3} fill="none" strokeLinecap="round" opacity="0.35">
        <path d="M3 18 C9 16 16 15 23 15.5 C28 16 32 18 36 21" transform="translate(0.4 0.5)" />
        <path d="M36 21 C36 26 35 31 34 35.5 C33.5 37 33 38.5 33 39.5" transform="translate(0.4 0.5)" />
        <path d="M30 24 C30 28 30 32 31 36" transform="translate(0.4 0.5)" />
        <path d="M62 34 C58 32 53 30.5 48 30.5 C42 31 37 33 34 35.5" transform="translate(0.4 0.5)" />
      </g>

      {/* 3D sphere overlays */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-shade)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-hl)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sh)`} />

      {/* Cartoonish edge ring — slightly warm, thicker at small sizes */}
      <circle cx="32" cy="32" r="30" stroke="#A89070" strokeWidth={edgeW} fill="none" opacity="0.85" />

      {/* Specular highlights — bright, slightly cartoonish */}
      <ellipse cx="19" cy="15" rx="5.5" ry="3.5" fill="white" opacity="0.30" transform="rotate(-28 19 15)" />
      <ellipse cx="17.5" cy="13.5" rx="2.5" ry="1.5" fill="white" opacity="0.60" transform="rotate(-28 17.5 13.5)" />
    </svg>
  )
}
