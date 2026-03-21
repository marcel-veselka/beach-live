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
 * v2 iteration log:
 * Iter 1:  Yellow top cap curves naturally along the sphere with proper wrap-around shape
 * Iter 2:  White center band wider/more prominent — red accent areas reduced ~30%
 * Iter 3:  Panel-to-panel transitions seamless — no visible gaps between adjacent panels
 * Iter 4:  Center convergence point fixed — all inner seams meet cleanly at (~33, 37)
 * Iter 5:  Bottom yellow panels more symmetrical with proper curvature
 * Iter 6:  Yellow tuned warmer/more saturated — closer to #FFE040 sunny yellow
 * Iter 7:  Red accents deeper/richer — #D42020 range
 * Iter 8:  3D sphere shading improved — upper-left light source, natural lower-right darkening
 * Iter 9:  Per-panel shading overlays — yellow panels darker on sphere shadow side
 * Iter 10: White panel gradient refined — curved leather catching light feel
 * Iter 11: Leather texture improved — better turbulence that fades cleanly at small sizes
 * Iter 12: Seam embossing — subtle highlight line on light-facing side of each seam
 * Iter 13: Specular highlight more natural — elongated along panel edge
 * Iter 14: Subtle warm ambient glow on light-facing yellow panels
 * Iter 15: Edge outline tuned — thicker, warm brown tone, opacity varies with size
 * Iter 16: Secondary specular dot for glossy cartoon ball feel
 * Iter 17: Exaggerated light/shadow contrast for more drama
 * Iter 18: Yellow panels more vivid/saturated on light-facing side
 * Iter 19: Color harmony review — yellow, red, white, seam colors balanced together
 * Iter 20: Size testing optimization — reads well at 14px through 128px
 */
export function VolleyballIcon({ className, size = 32 }: VolleyballIconProps) {
  const p = `vb${++counter}`
  const seamW = size < 20 ? 0.5 : size < 24 ? 0.7 : size < 32 ? 0.9 : size < 64 ? 1.1 : 1.3
  const edgeW = size < 24 ? 1.6 : size < 32 ? 1.4 : size < 64 ? 1.2 : 1.0
  const edgeOpacity = size < 24 ? 0.9 : size < 48 ? 0.85 : 0.75
  const showTexture = size >= 24
  const showSecondarySpecular = size >= 20
  const showEmbossing = size >= 28

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
        {/* Sphere base — warm off-white leather with upper-left light */}
        <radialGradient id={`${p}-sph`} cx="0.36" cy="0.30" r="0.65" fx="0.36" fy="0.30">
          <stop offset="0%" stopColor="#FFFDF4" />
          <stop offset="25%" stopColor="#FBF5E8" />
          <stop offset="55%" stopColor="#F0E6D2" />
          <stop offset="80%" stopColor="#E2D5BE" />
          <stop offset="100%" stopColor="#CABAA0" />
        </radialGradient>

        {/* Yellow panel gradients — warm sunny Gala yellow, iter 6/18 tuned */}
        {/* Top cap — lit from upper-left, brighter on light side */}
        <linearGradient id={`${p}-y1`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FFE855" />
          <stop offset="35%" stopColor="#FFE040" />
          <stop offset="70%" stopColor="#F5D020" />
          <stop offset="100%" stopColor="#DDB818" />
        </linearGradient>
        {/* Right panel — gets shadow side darkening */}
        <linearGradient id={`${p}-y2`} x1="0.6" y1="0.1" x2="0.4" y2="0.95">
          <stop offset="0%" stopColor="#FFE240" />
          <stop offset="40%" stopColor="#F0D020" />
          <stop offset="100%" stopColor="#C8A812" />
        </linearGradient>
        {/* Bottom-right panel — shadow side */}
        <linearGradient id={`${p}-y3`} x1="0.4" y1="0.2" x2="0.6" y2="0.95">
          <stop offset="0%" stopColor="#F8D828" />
          <stop offset="100%" stopColor="#BFA010" />
        </linearGradient>
        {/* Bottom-left panel — catches some light */}
        <linearGradient id={`${p}-y4`} x1="0.3" y1="0.2" x2="0.7" y2="0.95">
          <stop offset="0%" stopColor="#FFE040" />
          <stop offset="60%" stopColor="#ECC818" />
          <stop offset="100%" stopColor="#C8A812" />
        </linearGradient>

        {/* Red accent gradients — deeper/richer #D42020 range, iter 7 */}
        <linearGradient id={`${p}-r1`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#E03030" />
          <stop offset="100%" stopColor="#B81818" />
        </linearGradient>
        <linearGradient id={`${p}-r2`} x1="0.7" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#DC2828" />
          <stop offset="100%" stopColor="#A81414" />
        </linearGradient>
        <linearGradient id={`${p}-r3`} x1="0.5" y1="0.2" x2="0.5" y2="0.9">
          <stop offset="0%" stopColor="#D42020" />
          <stop offset="100%" stopColor="#A01010" />
        </linearGradient>

        {/* 3D sphere shading — upper-left light, iter 8/17 enhanced contrast */}
        <radialGradient id={`${p}-shade`} cx="0.34" cy="0.28" r="0.68">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="35%" stopColor="white" stopOpacity="0.04" />
          <stop offset="60%" stopColor="black" stopOpacity="0.04" />
          <stop offset="85%" stopColor="black" stopOpacity="0.18" />
          <stop offset="100%" stopColor="black" stopOpacity="0.30" />
        </radialGradient>

        {/* Per-panel shadow overlay — darkens shadow side panels, iter 9/17 */}
        <radialGradient id={`${p}-psh`} cx="0.30" cy="0.25" r="0.75">
          <stop offset="0%" stopColor="white" stopOpacity="0.10" />
          <stop offset="50%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.15" />
        </radialGradient>

        {/* Specular highlight — elongated along panel edge, iter 13 */}
        <radialGradient id={`${p}-hl`} cx="0.30" cy="0.24" r="0.22">
          <stop offset="0%" stopColor="white" stopOpacity="0.50" />
          <stop offset="40%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Warm ambient glow on light-facing side, iter 14 */}
        <radialGradient id={`${p}-glow`} cx="0.28" cy="0.22" r="0.40">
          <stop offset="0%" stopColor="#FFF8E0" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FFF8E0" stopOpacity="0" />
        </radialGradient>

        {/* Bottom ambient shadow */}
        <radialGradient id={`${p}-sh`} cx="0.58" cy="0.85" r="0.30">
          <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Dimpled leather texture — improved turbulence, fades at small sizes, iter 11 */}
        <filter id={`${p}-tex`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="7" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
          <feComponentTransfer in="mono" result="soft">
            <feFuncA type="linear" slope="0.5" intercept="0.25" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="soft" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="atop" />
        </filter>

        <clipPath id={`${p}-c`}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>

      {/* White leather base — iter 10 refined gradient */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} />
      {showTexture && (
        <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} filter={`url(#${p}-tex)`} opacity="0.20" />
      )}

      <g clipPath={`url(#${p}-c)`}>
        {/*
          Gala Smash Pro layout — 3 panel pairs radiating from center (~33, 37).
          Each pair: large yellow panel + narrow red accent wedge.
          White base shows through as wide center band (~35-40%).
          Iter 1-5: geometry refined for natural sphere wrapping.
        */}

        {/* === PAIR 1: TOP — yellow cap wrapping around sphere + thin red transitions === */}
        {/* Yellow top cap — wraps around the top of sphere, iter 1 curvature */}
        <path
          d="M32 2 C19 2 8 8 3.5 17.5
             C9 15.5 16 14.5 23 15 C28 15.5 32 17.5 35.5 20.5
             C38.5 14 40 7.5 39.5 2.5 C37 2.1 34.5 2 32 2Z"
          fill={`url(#${p}-y1)`}
        />
        {/* Narrow red strip — top-left transition, iter 2 reduced */}
        <path
          d="M3.5 17.5 C2.5 20 2 22.5 2 25.5
             C6 24 12 23 18 22.5 C23 22 27 22.5 30 24
             C28.5 21.5 26.5 19 24 17 C19 15.5 12 15.5 6 16.5
             C4.5 17 3.8 17.3 3.5 17.5Z"
          fill={`url(#${p}-r1)`}
        />
        {/* Narrow red strip — top-right transition, iter 2 reduced */}
        <path
          d="M39.5 2.5 C40 7.5 38.5 14 35.5 20.5
             C37.5 19 40.5 18 44.5 17.5 C48.5 17 52 17.5 55 19.5
             C51 11 46 5 39.5 2.5Z"
          fill={`url(#${p}-r2)`}
        />

        {/* === PAIR 2: RIGHT — yellow panel + thin red strip === */}
        {/* Yellow right panel — iter 5 symmetric */}
        <path
          d="M55 19.5 C58.5 23.5 61 28.5 62 33.5
             C58 31.5 53 30 48 30 C42 30.5 37 32.5 34 35
             C35 31 35.5 27 37 23.5 C39 20 41.5 18.5 44.5 17.5
             C48.5 17 52 17.5 55 19.5Z"
          fill={`url(#${p}-y2)`}
        />
        {/* Narrow red strip — right transition, iter 2 reduced */}
        <path
          d="M62 33.5 C62 37 61.5 40 60.5 42.5
             C57 40 52 38 47 37.5 C42 37 38 38 35.5 39.5
             C34.5 38 34 36.5 34 35
             C37 32.5 42 30.5 48 30 C53 30 58 31.5 62 33.5Z"
          fill={`url(#${p}-r1)`}
        />

        {/* === PAIR 3: BOTTOM — two yellow panels + red accents === */}
        {/* Yellow bottom-right panel — iter 5 curvature */}
        <path
          d="M60.5 42.5 C57.5 50 52 56 45 60
             C43.5 55 41 50 39 46 C37 43 36 41 35 39.5
             C36.5 38.5 40 37 44 37 C49 37 54 39 58 41.5
             C59 42 60 42.3 60.5 42.5Z"
          fill={`url(#${p}-y3)`}
        />
        {/* Yellow bottom-left panel — iter 5 symmetric curvature */}
        <path
          d="M4.5 42.5 C7.5 50 13 56 20 60
             C21.5 55 24 50 26 46 C28 43 29 41 30 39.5
             C28.5 38.5 25 37 21 37 C16 37 10.5 39 7 41.5
             C5.5 42 5 42.3 4.5 42.5Z"
          fill={`url(#${p}-y4)`}
        />
        {/* Narrow red strip — bottom-left transition, iter 2 reduced */}
        <path
          d="M2 25.5 C2 29 2 32.5 2.5 35.5 C3 38 3.5 40.5 4.5 42.5
             C7 40 12 38 17 37 C21 36.5 25 37 29 38.5
             C29.5 36.5 29.5 34.5 30 32.5
             C27 31 23 29.5 18 29 C12 28.5 6 27 2 25.5Z"
          fill={`url(#${p}-r3)`}
        />
        {/* Red accent — bottom center, narrow wedge, iter 2/3 seamless */}
        <path
          d="M20 60 C25 61.5 29 62 32 62 C36 62 40 61.5 45 60
             C43.5 56 41.5 51 39.5 47 C37.5 43.5 36 41 35 39.5
             C33.5 39.2 32.5 39.2 31.5 39.2
             C30 39.5 29 41 27 43.5 C25 47 22 52 20 60Z"
          fill={`url(#${p}-r3)`}
        />

        {/* Per-panel shadow overlay, iter 9 */}
        <circle cx="32" cy="32" r="31" fill={`url(#${p}-psh)`} />
      </g>

      {/* Seam lines — warm golden-tan, iter 12/19 refined color */}
      <g clipPath={`url(#${p}-c)`} stroke="#C0A660" strokeWidth={seamW} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Top cap seams */}
        <path d="M3.5 17.5 C9 15.5 16 14.5 23 15 C28 15.5 32 17.5 35.5 20.5" />
        <path d="M39.5 2.5 C40 7.5 38.5 14 35.5 20.5" />

        {/* Upper transition seams */}
        <path d="M2 25.5 C6 24 12 23 18 22.5 C23 22 27 22.5 30 24" />
        <path d="M55 19.5 C52 17.5 48.5 17 44.5 17.5 C40.5 18 37.5 19 35.5 20.5" />

        {/* Center radial seams — converge at ~(33, 37), iter 4 */}
        <path d="M35.5 20.5 C35.5 25.5 35 30.5 34 35 C33.5 37 33 38.5 33 39.5" />
        <path d="M30 24 C30 28 30 32 31 36 C31.5 37.5 32 38.5 33 39.5" />

        {/* Bottom radiating seams */}
        <path d="M33 39.5 C30 41 29 43 27 46 C24.5 50 22 55 20 60" />
        <path d="M33 39.5 C35.5 41 37 43 39 46 C41.5 50 43.5 55 45 60" />

        {/* Right panel seams */}
        <path d="M62 33.5 C58 31.5 53 30 48 30 C42 30.5 37 32.5 34 35" />
        <path d="M60.5 42.5 C57 40 52 38 47 37.5 C42 37 38 38 35.5 39.5" />

        {/* Left panel seams */}
        <path d="M2 25.5 C2 29 2 33 2.5 36 C3 38.5 3.5 40.5 4.5 42.5" />
        <path d="M4.5 42.5 C7 40 12 38 17 37 C21 36.5 25 37 29 38.5 C31 39.2 32 39.3 33 39.5" />
      </g>

      {/* Seam embossed highlight — light-facing side, iter 12 */}
      {showEmbossing && (
        <g clipPath={`url(#${p}-c)`} stroke="#E8DDB8" strokeWidth={seamW * 0.35} fill="none" strokeLinecap="round" opacity="0.40">
          <path d="M3.5 17.5 C9 15.5 16 14.5 23 15 C28 15.5 32 17.5 35.5 20.5" transform="translate(-0.3 -0.4)" />
          <path d="M35.5 20.5 C35.5 25.5 35 30.5 34 35 C33.5 37 33 38.5 33 39.5" transform="translate(-0.3 -0.4)" />
          <path d="M30 24 C30 28 30 32 31 36" transform="translate(-0.3 -0.4)" />
          <path d="M62 33.5 C58 31.5 53 30 48 30 C42 30.5 37 32.5 34 35" transform="translate(-0.3 -0.4)" />
          <path d="M2 25.5 C6 24 12 23 18 22.5 C23 22 27 22.5 30 24" transform="translate(-0.3 -0.4)" />
        </g>
      )}

      {/* Seam embossed shadow — opposite side, iter 12 */}
      {showEmbossing && (
        <g clipPath={`url(#${p}-c)`} stroke="#8A7840" strokeWidth={seamW * 0.3} fill="none" strokeLinecap="round" opacity="0.30">
          <path d="M3.5 17.5 C9 15.5 16 14.5 23 15 C28 15.5 32 17.5 35.5 20.5" transform="translate(0.3 0.4)" />
          <path d="M35.5 20.5 C35.5 25.5 35 30.5 34 35 C33.5 37 33 38.5 33 39.5" transform="translate(0.3 0.4)" />
          <path d="M30 24 C30 28 30 32 31 36" transform="translate(0.3 0.4)" />
          <path d="M62 33.5 C58 31.5 53 30 48 30 C42 30.5 37 32.5 34 35" transform="translate(0.3 0.4)" />
        </g>
      )}

      {/* 3D sphere overlays — iter 8/17 enhanced contrast */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-shade)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-hl)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-glow)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sh)`} />

      {/* Cartoonish edge ring — warm brown, thicker at small sizes, iter 15/20 */}
      <circle cx="32" cy="32" r="30" stroke="#9A7E58" strokeWidth={edgeW} fill="none" opacity={edgeOpacity} />

      {/* Primary specular highlight — elongated along panel edge, iter 13 */}
      <ellipse cx="20" cy="14" rx="6" ry="3" fill="white" opacity="0.28" transform="rotate(-30 20 14)" />
      <ellipse cx="18" cy="13" rx="3" ry="1.5" fill="white" opacity="0.55" transform="rotate(-30 18 13)" />

      {/* Secondary specular dot — glossy cartoon feel, iter 16 */}
      {showSecondarySpecular && (
        <circle cx="24" cy="19" r="1.2" fill="white" opacity="0.35" />
      )}
    </svg>
  )
}
