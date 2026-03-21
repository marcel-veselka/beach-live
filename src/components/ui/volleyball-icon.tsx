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
 *
 * v3 iteration log:
 * Iter 21: Yellow top cap asymmetric — lower boundary deeper on left (~y=18), shallower on right (~y=4)
 * Iter 22: White center band widened — left-side red strip height cut ~40%, narrower accent
 * Iter 23: Bottom-right yellow panel enlarged — more prominent triangular shape
 * Iter 24: Bottom-center red wedge narrowed — thinner V shape
 * Iter 25: Panel edge adjacency verified — seamless joins, no gaps or overlap artifacts
 * Iter 26: Bezier curves smoothed — each seam flows as one organic S-curve
 * Iter 27: Center convergence shifted to (~32.5, 36.5) for better visual balance
 * Iter 28: Right-side yellow panel boundary curves naturally along the sphere
 * Iter 29: Yellow brighter/warmer — top cap #FFE550 highlight to #EABC15 shadow
 * Iter 30: Red tuned warmer — #D43030 tomato red, less blue-red
 * Iter 31: White base brighter/cleaner — luminous center band with #FAF4EA base
 * Iter 32: Per-panel shading improved — right panel noticeably darker than top cap
 * Iter 33: Subtle yellow tint on white areas near yellow panel edges (reflected color)
 * Iter 34: Leather texture improved — more uniform dimple pattern with adjusted turbulence
 * Iter 35: Micro-texture added to yellow panels (not just white base)
 * Iter 36: Seam embossing refined — highlight/shadow offset proportional to seam direction
 * Iter 37: Primary specular highlight repositioned across yellow-white boundary
 * Iter 38: Sphere shading gradient — more dramatic shadow falloff on lower-right
 * Iter 39: Faint rim light on bottom-left edge (environmental reflection)
 * Iter 40: Final harmony pass — bright yellow cap, big white center, red accents only at edges
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
        {/* Sphere base — warm luminous off-white leather, iter 31 brighter */}
        <radialGradient id={`${p}-sph`} cx="0.36" cy="0.30" r="0.65" fx="0.36" fy="0.30">
          <stop offset="0%" stopColor="#FFFEF6" />
          <stop offset="20%" stopColor="#FAF4EA" />
          <stop offset="50%" stopColor="#F4ECDA" />
          <stop offset="75%" stopColor="#E8DCC8" />
          <stop offset="100%" stopColor="#D0BFA5" />
        </radialGradient>

        {/* Yellow reflected light on white areas near yellow panels, iter 33 */}
        <radialGradient id={`${p}-yref`} cx="0.35" cy="0.20" r="0.50">
          <stop offset="0%" stopColor="#FFF0B0" stopOpacity="0.08" />
          <stop offset="60%" stopColor="#FFF0B0" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#FFF0B0" stopOpacity="0" />
        </radialGradient>

        {/* Yellow panel gradients — iter 29: brighter/warmer #FFE550 highlight to #EABC15 shadow */}
        {/* Top cap — lit from upper-left */}
        <linearGradient id={`${p}-y1`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#FFE860" />
          <stop offset="30%" stopColor="#FFE550" />
          <stop offset="65%" stopColor="#F5D228" />
          <stop offset="100%" stopColor="#EABC15" />
        </linearGradient>
        {/* Right panel — shadow side, iter 32 noticeably darker */}
        <linearGradient id={`${p}-y2`} x1="0.6" y1="0.1" x2="0.4" y2="0.95">
          <stop offset="0%" stopColor="#F8DA30" />
          <stop offset="40%" stopColor="#E8C518" />
          <stop offset="100%" stopColor="#BFA010" />
        </linearGradient>
        {/* Bottom-right panel — deep shadow side */}
        <linearGradient id={`${p}-y3`} x1="0.4" y1="0.1" x2="0.6" y2="0.95">
          <stop offset="0%" stopColor="#F0D020" />
          <stop offset="50%" stopColor="#D8B818" />
          <stop offset="100%" stopColor="#B09808" />
        </linearGradient>
        {/* Bottom-left panel — catches some light */}
        <linearGradient id={`${p}-y4`} x1="0.3" y1="0.2" x2="0.7" y2="0.95">
          <stop offset="0%" stopColor="#FFE040" />
          <stop offset="55%" stopColor="#EABC15" />
          <stop offset="100%" stopColor="#C0A010" />
        </linearGradient>

        {/* Red accent gradients — iter 30: warmer tomato red #D43030 */}
        <linearGradient id={`${p}-r1`} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#DA3838" />
          <stop offset="100%" stopColor="#B82020" />
        </linearGradient>
        <linearGradient id={`${p}-r2`} x1="0.7" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#D43030" />
          <stop offset="100%" stopColor="#A81818" />
        </linearGradient>
        <linearGradient id={`${p}-r3`} x1="0.5" y1="0.2" x2="0.5" y2="0.9">
          <stop offset="0%" stopColor="#D43030" />
          <stop offset="100%" stopColor="#A01414" />
        </linearGradient>

        {/* 3D sphere shading — iter 38: more dramatic shadow falloff on lower-right */}
        <radialGradient id={`${p}-shade`} cx="0.32" cy="0.26" r="0.68">
          <stop offset="0%" stopColor="white" stopOpacity="0.20" />
          <stop offset="30%" stopColor="white" stopOpacity="0.05" />
          <stop offset="55%" stopColor="black" stopOpacity="0.03" />
          <stop offset="75%" stopColor="black" stopOpacity="0.16" />
          <stop offset="90%" stopColor="black" stopOpacity="0.28" />
          <stop offset="100%" stopColor="black" stopOpacity="0.36" />
        </radialGradient>

        {/* Per-panel shadow overlay, iter 32 improved */}
        <radialGradient id={`${p}-psh`} cx="0.28" cy="0.23" r="0.75">
          <stop offset="0%" stopColor="white" stopOpacity="0.12" />
          <stop offset="45%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.18" />
        </radialGradient>

        {/* Specular highlight — iter 37: repositioned across yellow-white boundary */}
        <radialGradient id={`${p}-hl`} cx="0.28" cy="0.28" r="0.20">
          <stop offset="0%" stopColor="white" stopOpacity="0.45" />
          <stop offset="45%" stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Warm ambient glow on light-facing side */}
        <radialGradient id={`${p}-glow`} cx="0.26" cy="0.20" r="0.38">
          <stop offset="0%" stopColor="#FFF8E0" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#FFF8E0" stopOpacity="0" />
        </radialGradient>

        {/* Bottom ambient shadow */}
        <radialGradient id={`${p}-sh`} cx="0.60" cy="0.88" r="0.28">
          <stop offset="0%" stopColor="#000" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* Rim light — iter 39: faint environmental reflection on bottom-left edge */}
        <radialGradient id={`${p}-rim`} cx="0.18" cy="0.78" r="0.25">
          <stop offset="0%" stopColor="#FFF8E8" stopOpacity="0.10" />
          <stop offset="60%" stopColor="#FFF8E8" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#FFF8E8" stopOpacity="0" />
        </radialGradient>

        {/* Dimpled leather texture — iter 34: more uniform dimples */}
        <filter id={`${p}-tex`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="7" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
          <feComponentTransfer in="mono" result="soft">
            <feFuncA type="linear" slope="0.45" intercept="0.28" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="soft" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="atop" />
        </filter>

        {/* Yellow panel texture — iter 35: micro-texture for yellow panels */}
        <filter id={`${p}-ytex`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.50" numOctaves="3" seed="12" result="noise" />
          <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
          <feComponentTransfer in="mono" result="soft">
            <feFuncA type="linear" slope="0.3" intercept="0.35" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="soft" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="atop" />
        </filter>

        <clipPath id={`${p}-c`}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>

      {/* White leather base — iter 31 luminous center band */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} />
      {showTexture && (
        <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} filter={`url(#${p}-tex)`} opacity="0.18" />
      )}
      {/* Yellow reflected color on white near yellow edges, iter 33 */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-yref)`} />

      <g clipPath={`url(#${p}-c)`}>
        {/*
          Gala Smash Pro layout — 3 panel pairs radiating from center (~32.5, 36.5).
          Iter 21-28: Panel geometry overhauled for reference-accurate layout.
          Yellow top cap asymmetric, white band widened, bottom-right yellow enlarged.
        */}

        {/* === PAIR 1: TOP — asymmetric yellow cap + thin red transitions === */}
        {/* Yellow top cap — iter 21: asymmetric lower boundary, deeper left (~y=18), shallower right (~y=4) */}
        <path
          d="M32 2 C18 2 7 8.5 3 18
             C8 16 15 15 22 15.5 C28 16 33 19 36 22
             C39 15 41 8 40 3 C37.5 2.2 35 2 32 2Z"
          fill={`url(#${p}-y1)`}
        />
        {/* iter 35: yellow texture overlay on top cap */}
        {showTexture && (
          <path
            d="M32 2 C18 2 7 8.5 3 18
               C8 16 15 15 22 15.5 C28 16 33 19 36 22
               C39 15 41 8 40 3 C37.5 2.2 35 2 32 2Z"
            fill={`url(#${p}-y1)`}
            filter={`url(#${p}-ytex)`}
            opacity="0.12"
          />
        )}
        {/* Narrow red strip — top-left transition, iter 22: much narrower */}
        <path
          d="M3 18 C2.5 20 2 22.5 2 25
             C6 23.5 12 22.5 18 22 C23 22 27 22.5 30 24
             C28.5 21.5 26 19 23.5 17.5 C18 16 11 16 6 17
             C4.5 17.5 3.5 17.8 3 18Z"
          fill={`url(#${p}-r1)`}
        />
        {/* Narrow red strip — top-right transition, iter 22 reduced */}
        <path
          d="M40 3 C41 8 39 15 36 22
             C38 20 41 18.5 45 18 C49 17.5 53 18 56 20
             C51.5 11.5 46.5 5.5 40 3Z"
          fill={`url(#${p}-r2)`}
        />

        {/* === PAIR 2: RIGHT — yellow panel + thin red strip === */}
        {/* Yellow right panel — iter 28: curves naturally along sphere */}
        <path
          d="M56 20 C59 24 61 29 62 34
             C58 32 53 30.5 48 30.5 C42 31 37 33 34.5 35.5
             C35 31 35.5 27 37 24 C39 21 42 19 45 18
             C49 17.5 53 18 56 20Z"
          fill={`url(#${p}-y2)`}
        />
        {showTexture && (
          <path
            d="M56 20 C59 24 61 29 62 34
               C58 32 53 30.5 48 30.5 C42 31 37 33 34.5 35.5
               C35 31 35.5 27 37 24 C39 21 42 19 45 18
               C49 17.5 53 18 56 20Z"
            fill={`url(#${p}-y2)`}
            filter={`url(#${p}-ytex)`}
            opacity="0.10"
          />
        )}
        {/* Narrow red strip — right transition */}
        <path
          d="M62 34 C62 37.5 61.5 40.5 60.5 43
             C57 40.5 52 38.5 47 38 C42 37.5 38 38.5 35.5 40
             C35 38.5 34.5 37 34.5 35.5
             C37 33 42 31 48 30.5 C53 30.5 58 32 62 34Z"
          fill={`url(#${p}-r1)`}
        />

        {/* === PAIR 3: BOTTOM — two yellow panels + red accents === */}
        {/* Yellow bottom-right panel — iter 23: enlarged, more prominent triangle */}
        <path
          d="M60.5 43 C57.5 50.5 51.5 56.5 44 60.5
             C42.5 55 40.5 50 38.5 46 C37 43 36 41 35 39.5
             C36 38.5 39 37.5 43 37.5 C48.5 37.5 54 39.5 58.5 42
             C59.5 42.5 60 42.8 60.5 43Z"
          fill={`url(#${p}-y3)`}
        />
        {showTexture && (
          <path
            d="M60.5 43 C57.5 50.5 51.5 56.5 44 60.5
               C42.5 55 40.5 50 38.5 46 C37 43 36 41 35 39.5
               C36 38.5 39 37.5 43 37.5 C48.5 37.5 54 39.5 58.5 42
               C59.5 42.5 60 42.8 60.5 43Z"
            fill={`url(#${p}-y3)`}
            filter={`url(#${p}-ytex)`}
            opacity="0.08"
          />
        )}
        {/* Yellow bottom-left panel */}
        <path
          d="M4.5 43 C7.5 50 13 56 20 60
             C21.5 55 24 50 26 46 C27.5 43 28.5 41 29.5 39.5
             C28.5 38.5 25.5 37.5 22 37.5 C17 37.5 11 39.5 7.5 42
             C5.5 42.5 5 42.8 4.5 43Z"
          fill={`url(#${p}-y4)`}
        />
        {showTexture && (
          <path
            d="M4.5 43 C7.5 50 13 56 20 60
               C21.5 55 24 50 26 46 C27.5 43 28.5 41 29.5 39.5
               C28.5 38.5 25.5 37.5 22 37.5 C17 37.5 11 39.5 7.5 42
               C5.5 42.5 5 42.8 4.5 43Z"
            fill={`url(#${p}-y4)`}
            filter={`url(#${p}-ytex)`}
            opacity="0.08"
          />
        )}
        {/* Narrow red strip — bottom-left transition, iter 22: significantly narrower */}
        <path
          d="M2 25 C2 28.5 2.2 32 2.5 35 C3 38 3.5 40.5 4.5 43
             C7 41 11.5 39 16.5 38 C20.5 37.5 24.5 37.5 28 38.5
             C28.5 37 28.5 35 29 33
             C26 31.5 22 30 18 29.5 C12 29 6 27.5 2 25Z"
          fill={`url(#${p}-r3)`}
        />
        {/* Red accent — bottom center, iter 24: thinner V wedge */}
        <path
          d="M20 60 C25 61.5 29 62 32 62 C36 62 40 61.5 44 60.5
             C42.5 56 41 51.5 39.5 47.5 C38 44 37 42 35.5 40
             C34 39.5 33 39.2 32.5 39.2
             C31.5 39.2 30.5 39.5 29.5 40
             C28 42 27 44 25.5 47.5 C23.5 52 21.5 56.5 20 60Z"
          fill={`url(#${p}-r3)`}
        />

        {/* Per-panel shadow overlay, iter 32 */}
        <circle cx="32" cy="32" r="31" fill={`url(#${p}-psh)`} />
      </g>

      {/* Seam lines — warm golden-tan, iter 26: smoothed bezier curves */}
      <g clipPath={`url(#${p}-c)`} stroke="#C0A660" strokeWidth={seamW} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Top cap seams — iter 21/26 asymmetric smooth curves */}
        <path d="M3 18 C8 16 15 15 22 15.5 C28 16 33 19 36 22" />
        <path d="M40 3 C41 8 39 15 36 22" />

        {/* Upper transition seams */}
        <path d="M2 25 C6 23.5 12 22.5 18 22 C23 22 27 22.5 30 24" />
        <path d="M56 20 C53 18 49 17.5 45 18 C41 18.5 38 20 36 22" />

        {/* Center radial seams — converge at ~(32.5, 36.5), iter 27 */}
        <path d="M36 22 C35.5 26 35 31 34.5 35.5 C33.5 37 33 38 32.5 39" />
        <path d="M30 24 C30 28 30 32 31 36 C31.5 37.5 32 38.5 32.5 39" />

        {/* Bottom radiating seams — iter 26 smooth S-curves */}
        <path d="M32.5 39 C30 41 28.5 43.5 26 47.5 C23.5 52 21.5 56.5 20 60" />
        <path d="M32.5 39 C35 41 37 43.5 39 47 C41 51.5 42.5 56 44 60.5" />

        {/* Right panel seams */}
        <path d="M62 34 C58 32 53 30.5 48 30.5 C42 31 37 33 34.5 35.5" />
        <path d="M60.5 43 C57 40.5 52 38.5 47 38 C42 37.5 38 38.5 35.5 40" />

        {/* Left panel seams */}
        <path d="M2 25 C2 28.5 2.2 32 2.5 35 C3 38 3.5 40.5 4.5 43" />
        <path d="M4.5 43 C7 41 11.5 39 16.5 38 C20.5 37.5 24.5 37.5 28 38.5 C30.5 39.2 31.5 39.5 32.5 39" />
      </g>

      {/* Seam embossed highlight — iter 36: offset proportional to seam direction */}
      {showEmbossing && (
        <g clipPath={`url(#${p}-c)`} stroke="#EAE0C0" strokeWidth={seamW * 0.35} fill="none" strokeLinecap="round" opacity="0.38">
          <path d="M3 18 C8 16 15 15 22 15.5 C28 16 33 19 36 22" transform="translate(-0.3 -0.4)" />
          <path d="M36 22 C35.5 26 35 31 34.5 35.5 C33.5 37 33 38 32.5 39" transform="translate(-0.4 -0.3)" />
          <path d="M30 24 C30 28 30 32 31 36" transform="translate(-0.3 -0.4)" />
          <path d="M62 34 C58 32 53 30.5 48 30.5 C42 31 37 33 34.5 35.5" transform="translate(-0.2 -0.4)" />
          <path d="M2 25 C6 23.5 12 22.5 18 22 C23 22 27 22.5 30 24" transform="translate(-0.3 -0.4)" />
          <path d="M56 20 C53 18 49 17.5 45 18 C41 18.5 38 20 36 22" transform="translate(-0.3 -0.4)" />
        </g>
      )}

      {/* Seam embossed shadow — iter 36: direction-aware offset */}
      {showEmbossing && (
        <g clipPath={`url(#${p}-c)`} stroke="#887840" strokeWidth={seamW * 0.3} fill="none" strokeLinecap="round" opacity="0.28">
          <path d="M3 18 C8 16 15 15 22 15.5 C28 16 33 19 36 22" transform="translate(0.3 0.4)" />
          <path d="M36 22 C35.5 26 35 31 34.5 35.5 C33.5 37 33 38 32.5 39" transform="translate(0.4 0.3)" />
          <path d="M30 24 C30 28 30 32 31 36" transform="translate(0.3 0.4)" />
          <path d="M62 34 C58 32 53 30.5 48 30.5 C42 31 37 33 34.5 35.5" transform="translate(0.2 0.4)" />
          <path d="M32.5 39 C30 41 28.5 43.5 26 47.5" transform="translate(0.3 0.3)" />
          <path d="M32.5 39 C35 41 37 43.5 39 47" transform="translate(0.3 0.3)" />
        </g>
      )}

      {/* 3D sphere overlays — iter 38: more dramatic lower-right shadow */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-shade)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-hl)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-glow)`} />
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sh)`} />
      {/* Rim light — iter 39 */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-rim)`} />

      {/* Cartoonish edge ring — warm brown, iter 40 final tuning */}
      <circle cx="32" cy="32" r="30" stroke="#9A7E58" strokeWidth={edgeW} fill="none" opacity={edgeOpacity} />

      {/* Primary specular highlight — iter 37: across yellow-white boundary */}
      <ellipse cx="22" cy="17" rx="6.5" ry="3.5" fill="white" opacity="0.26" transform="rotate(-25 22 17)" />
      <ellipse cx="20" cy="16" rx="3.5" ry="1.8" fill="white" opacity="0.50" transform="rotate(-25 20 16)" />

      {/* Secondary specular dot — iter 40 final position */}
      {showSecondarySpecular && (
        <circle cx="25" cy="21" r="1.1" fill="white" opacity="0.32" />
      )}
    </svg>
  )
}
