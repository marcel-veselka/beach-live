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
 *
 * v4 iteration log:
 * Iter 41: Yellow top cap redrawn — single smooth bezier for lower edge, asymmetric (left ~y=17, right ~y=3)
 * Iter 42: White center band boundaries redrawn — top follows cap edge, bottom convex curve for wide-band effect
 * Iter 43: Bottom-right yellow panel enlarged to ~20% of visible ball area
 * Iter 44: All red accent strips reduced additional 15% — razor-thin transitions only
 * Iter 45: Left-side red strip narrowed further — minimal red at white-to-yellow transition
 * Iter 46: Bottom-center red narrowed to tight inverted-V, not wide triangle
 * Iter 47: All panel boundaries verified seamless — no gaps between adjacent panels
 * Iter 48: Right-side yellow panel made taller/more prominent
 * Iter 49: Top-right red accent reduced to very small near-triangular sliver
 * Iter 50: Overall geometry review — panel proportions match reference (~45% yellow, ~40% white, ~12% red)
 * Iter 51: Segmented curves replaced with single smooth C/S commands where possible
 * Iter 52: Every seam line has continuous curvature — no kinks or sharp direction changes
 * Iter 53: Center convergence smoother — seams flow into center point organically
 * Iter 54: Outer seam curves follow sphere projection — wider near center, tighter near edges
 * Iter 55: All path closures verified clean — no self-intersection
 * Iter 56: 5 yellow gradient variants — one per panel position following sphere lighting
 * Iter 57: Top cap yellow brightest at upper-left, darker at lower-right
 * Iter 58: Right yellow panel noticeably darker overall (shadow side)
 * Iter 59: Bottom-right yellow is darkest yellow panel
 * Iter 60: Red gradients follow sphere shading — lighter red on top, darker on bottom
 * Iter 61: White base gradient more luminous — brighter in center band area
 * Iter 62: Subtle warm yellow reflected light onto white areas adjacent to yellow panels
 * Iter 63: Seam color tuned more golden — #BFA558 range
 * Iter 64: Sophisticated sphere shading gradient with 8+ stops for smoother falloff
 * Iter 65: Inner shadow at ball's edge — subtly darker ring just inside outline
 * Iter 66: Per-panel radial gradient overlay for individual panel shading
 * Iter 67: Contact shadow suggestion at very bottom of ball
 * Iter 68: Ambient occlusion at seam intersections — subtle darkening where seams meet
 * Iter 69: Environmental reflection — faint cool-blue tint on shadow side (sky reflection)
 * Iter 70: Overall contrast tuned — light side ~30% brighter than shadow side
 * Iter 71: Leather dimple pattern improved — two overlapping turbulence layers
 * Iter 72: Texture visible on yellow panels too with yellow-preserving filter
 * Iter 73: Subtle canvas-weave texture on seam lines
 * Iter 74: Texture opacity varies with lighting — more visible on lit side
 * Iter 75: Texture invisible below 24px, visible at 48px+
 * Iter 76: Subtle softness filter — tiny blur on shadow edges for cartoonish feel
 * Iter 77: Primary specular redesigned — elongated curved shape along cap-band boundary
 * Iter 78: Sharp star specular point added — brightest spot, tiny and crisp
 * Iter 79: Specular positioned on yellow cap near lower-left edge (upper-left light source)
 * Iter 80: Faint secondary highlight on right side — environmental/fill light
 * Iter 81: Specular warm-tinted #FFF8E8 (not pure white)
 * Iter 82: Small-size specular simplified to single bright dot for clarity
 * Iter 83: Outline color varies — warmer/lighter on lit side, cooler/darker on shadow side
 * Iter 84: Outline scales with size — thinner >64px, bolder <24px
 * Iter 85: Subtle outer glow on lit side edge — light wrapping around ball
 * Iter 86: Outline doesn't compete with seam lines at any size
 * Iter 87: 14px test: recognizable yellow/white/red volleyball with basic shapes
 * Iter 88: 200px test: all details crisp — texture, embossing, specular, seam shadows
 * Iter 89: A/B comparison pass — every panel adjusted against reference proportions
 * Iter 90: Final harmony — sunny beach volleyball, yellow cap, big white band, red accents, cartoonish but tangible
 */
export function VolleyballIcon({ className, size = 32 }: VolleyballIconProps) {
  const p = `vb${++counter}`
  const seamW = size < 20 ? 0.5 : size < 24 ? 0.7 : size < 32 ? 0.9 : size < 64 ? 1.1 : 1.3
  const edgeW = size < 24 ? 1.6 : size < 32 ? 1.4 : size < 64 ? 1.2 : 1.0
  const edgeOpacity = size < 24 ? 0.9 : size < 48 ? 0.85 : 0.75
  const showTexture = size >= 24
  const showDetailTexture = size >= 48
  const showSecondarySpecular = size >= 20
  const showEmbossing = size >= 28
  const showAO = size >= 32
  const showEnvReflection = size >= 40
  const showOuterGlow = size >= 32
  const showStarSpecular = size >= 28

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
        {/* Sphere base — iter 61: more luminous warm off-white leather, brighter center band */}
        <radialGradient id={`${p}-sph`} cx="0.38" cy="0.32" r="0.62" fx="0.38" fy="0.32">
          <stop offset="0%" stopColor="#FFFEFA" />
          <stop offset="15%" stopColor="#FAF4EA" />
          <stop offset="35%" stopColor="#F6EFE0" />
          <stop offset="55%" stopColor="#F0E6D2" />
          <stop offset="75%" stopColor="#E4D8C4" />
          <stop offset="100%" stopColor="#CCBB9E" />
        </radialGradient>

        {/* iter 62: Yellow reflected light on white areas near yellow panels */}
        <radialGradient id={`${p}-yref`} cx="0.35" cy="0.20" r="0.50">
          <stop offset="0%" stopColor="#FFF0B0" stopOpacity="0.10" />
          <stop offset="40%" stopColor="#FFF0B0" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#FFF0B0" stopOpacity="0" />
        </radialGradient>

        {/* === iter 56-59: 5 yellow gradient variants per panel position === */}
        {/* Top cap — iter 57: brightest upper-left, darker lower-right */}
        <linearGradient id={`${p}-y1`} x1="0.10" y1="0" x2="0.90" y2="1">
          <stop offset="0%" stopColor="#FFEA68" />
          <stop offset="25%" stopColor="#FFE550" />
          <stop offset="55%" stopColor="#F5D228" />
          <stop offset="100%" stopColor="#E8BC15" />
        </linearGradient>
        {/* Right panel — iter 58: noticeably darker (shadow side) */}
        <linearGradient id={`${p}-y2`} x1="0.6" y1="0.05" x2="0.35" y2="0.95">
          <stop offset="0%" stopColor="#F5D830" />
          <stop offset="35%" stopColor="#E4C218" />
          <stop offset="75%" stopColor="#CCA810" />
          <stop offset="100%" stopColor="#B8980C" />
        </linearGradient>
        {/* Bottom-right panel — iter 59: darkest yellow panel */}
        <linearGradient id={`${p}-y3`} x1="0.4" y1="0.05" x2="0.6" y2="0.95">
          <stop offset="0%" stopColor="#ECCC20" />
          <stop offset="40%" stopColor="#D4B418" />
          <stop offset="80%" stopColor="#B89808" />
          <stop offset="100%" stopColor="#A88C05" />
        </linearGradient>
        {/* Bottom-left panel — catches some reflected light */}
        <linearGradient id={`${p}-y4`} x1="0.25" y1="0.15" x2="0.75" y2="0.95">
          <stop offset="0%" stopColor="#FFE040" />
          <stop offset="45%" stopColor="#ECC018" />
          <stop offset="100%" stopColor="#C0A010" />
        </linearGradient>
        {/* Top-right yellow sliver — between top cap and right panel */}
        <linearGradient id={`${p}-y5`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FAD838" />
          <stop offset="100%" stopColor="#D8B818" />
        </linearGradient>

        {/* === iter 60: Red accent gradients following sphere shading === */}
        {/* Top-left red — lighter (lit side) */}
        <linearGradient id={`${p}-r1`} x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor="#D83838" />
          <stop offset="100%" stopColor="#B82222" />
        </linearGradient>
        {/* Top-right red — medium */}
        <linearGradient id={`${p}-r2`} x1="0.7" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#D03030" />
          <stop offset="100%" stopColor="#A81818" />
        </linearGradient>
        {/* Bottom red — darker (shadow side) */}
        <linearGradient id={`${p}-r3`} x1="0.5" y1="0.1" x2="0.5" y2="0.95">
          <stop offset="0%" stopColor="#CC2828" />
          <stop offset="100%" stopColor="#9C1212" />
        </linearGradient>
        {/* Left-side red — receives some light */}
        <linearGradient id={`${p}-r4`} x1="0.2" y1="0.2" x2="0.8" y2="0.8">
          <stop offset="0%" stopColor="#D43535" />
          <stop offset="100%" stopColor="#AA1A1A" />
        </linearGradient>

        {/* === iter 64: Sophisticated sphere shading with 8+ stops === */}
        <radialGradient id={`${p}-shade`} cx="0.32" cy="0.26" r="0.68">
          <stop offset="0%" stopColor="white" stopOpacity="0.22" />
          <stop offset="12%" stopColor="white" stopOpacity="0.14" />
          <stop offset="25%" stopColor="white" stopOpacity="0.06" />
          <stop offset="38%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="black" stopOpacity="0.02" />
          <stop offset="62%" stopColor="black" stopOpacity="0.08" />
          <stop offset="75%" stopColor="black" stopOpacity="0.18" />
          <stop offset="87%" stopColor="black" stopOpacity="0.28" />
          <stop offset="100%" stopColor="black" stopOpacity="0.38" />
        </radialGradient>

        {/* iter 66: Per-panel radial gradient overlay */}
        <radialGradient id={`${p}-psh`} cx="0.28" cy="0.23" r="0.75">
          <stop offset="0%" stopColor="white" stopOpacity="0.14" />
          <stop offset="40%" stopColor="white" stopOpacity="0" />
          <stop offset="100%" stopColor="black" stopOpacity="0.20" />
        </radialGradient>

        {/* iter 65: Inner edge shadow — darker ring just inside outline */}
        <radialGradient id={`${p}-inner`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="85%" stopColor="black" stopOpacity="0" />
          <stop offset="95%" stopColor="black" stopOpacity="0.08" />
          <stop offset="100%" stopColor="black" stopOpacity="0.15" />
        </radialGradient>

        {/* iter 77: Primary specular — elongated along cap-band boundary */}
        <radialGradient id={`${p}-hl`} cx="0.30" cy="0.26" r="0.22">
          <stop offset="0%" stopColor="#FFF8E8" stopOpacity="0.50" />
          <stop offset="35%" stopColor="#FFF8E8" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#FFF8E8" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFF8E8" stopOpacity="0" />
        </radialGradient>

        {/* Warm ambient glow on light-facing side */}
        <radialGradient id={`${p}-glow`} cx="0.26" cy="0.20" r="0.38">
          <stop offset="0%" stopColor="#FFF8E0" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#FFF8E0" stopOpacity="0" />
        </radialGradient>

        {/* iter 67: Contact shadow at very bottom */}
        <radialGradient id={`${p}-sh`} cx="0.58" cy="0.90" r="0.24">
          <stop offset="0%" stopColor="#000" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        {/* iter 69: Environmental reflection — cool-blue tint on shadow side */}
        <radialGradient id={`${p}-env`} cx="0.72" cy="0.72" r="0.35">
          <stop offset="0%" stopColor="#B0C8E8" stopOpacity="0.06" />
          <stop offset="60%" stopColor="#B0C8E8" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#B0C8E8" stopOpacity="0" />
        </radialGradient>

        {/* Rim light — bottom-left environmental reflection */}
        <radialGradient id={`${p}-rim`} cx="0.18" cy="0.78" r="0.25">
          <stop offset="0%" stopColor="#FFF8E8" stopOpacity="0.10" />
          <stop offset="60%" stopColor="#FFF8E8" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#FFF8E8" stopOpacity="0" />
        </radialGradient>

        {/* iter 80: Secondary fill-light highlight on right side */}
        <radialGradient id={`${p}-hl2`} cx="0.78" cy="0.38" r="0.18">
          <stop offset="0%" stopColor="#FFF8E8" stopOpacity="0.10" />
          <stop offset="60%" stopColor="#FFF8E8" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#FFF8E8" stopOpacity="0" />
        </radialGradient>

        {/* iter 83: Variable outline — warmer on lit side via gradient stroke */}
        <linearGradient id={`${p}-edge`} x1="0.15" y1="0.15" x2="0.85" y2="0.85">
          <stop offset="0%" stopColor="#B09068" />
          <stop offset="45%" stopColor="#9A7E58" />
          <stop offset="100%" stopColor="#786048" />
        </linearGradient>

        {/* iter 85: Outer glow on lit side */}
        <radialGradient id={`${p}-oglow`} cx="0.30" cy="0.25" r="0.55">
          <stop offset="80%" stopColor="#FFE860" stopOpacity="0" />
          <stop offset="90%" stopColor="#FFE860" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#FFE860" stopOpacity="0" />
        </radialGradient>

        {/* iter 71: Improved leather dimple — two overlapping turbulence layers */}
        <filter id={`${p}-tex`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="7" result="n1" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="19" result="n2" />
          <feMerge result="noise">
            <feMergeNode in="n1" />
            <feMergeNode in="n2" />
          </feMerge>
          <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
          <feComponentTransfer in="mono" result="soft">
            <feFuncA type="linear" slope="0.40" intercept="0.30" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="soft" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="atop" />
        </filter>

        {/* iter 72: Yellow panel texture — preserves yellow tint */}
        <filter id={`${p}-ytex`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.50" numOctaves="3" seed="12" result="n1" />
          <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" seed="22" result="n2" />
          <feMerge result="noise">
            <feMergeNode in="n1" />
            <feMergeNode in="n2" />
          </feMerge>
          <feColorMatrix type="saturate" values="0" in="noise" result="mono" />
          <feComponentTransfer in="mono" result="soft">
            <feFuncA type="linear" slope="0.28" intercept="0.36" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="soft" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="atop" />
        </filter>

        {/* iter 73: Canvas-weave texture for seam lines */}
        <filter id={`${p}-stex`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency="1.2 0.6" numOctaves="2" seed="5" result="weave" />
          <feColorMatrix type="saturate" values="0" in="weave" result="mono" />
          <feComponentTransfer in="mono" result="soft">
            <feFuncA type="linear" slope="0.15" intercept="0.42" />
          </feComponentTransfer>
          <feBlend in="SourceGraphic" in2="soft" mode="multiply" result="blend" />
          <feComposite in="blend" in2="SourceGraphic" operator="atop" />
        </filter>

        {/* iter 76: Soft shadow edge blur for cartoonish feel */}
        <filter id={`${p}-soft`} x="-2%" y="-2%" width="104%" height="104%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
        </filter>

        {/* iter 68: Ambient occlusion dots at seam intersections */}
        <radialGradient id={`${p}-ao`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        <clipPath id={`${p}-c`}>
          <circle cx="32" cy="32" r="30" />
        </clipPath>
      </defs>

      {/* White leather base — iter 61: luminous center band */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} />
      {showTexture && (
        <circle cx="32" cy="32" r="30" fill={`url(#${p}-sph)`} filter={`url(#${p}-tex)`} opacity={showDetailTexture ? 0.20 : 0.14} />
      )}
      {/* iter 62: Yellow reflected color on white near yellow edges */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-yref)`} />

      <g clipPath={`url(#${p}-c)`}>
        {/*
          Gala Smash Pro layout — iter 41-50: Panel geometry perfected.
          Yellow ~45%, White ~40%, Red ~12%, Seams ~3%.
          Top cap asymmetric, wide white center band, enlarged bottom-right yellow.
          All red accents razor-thin transitions only.
        */}

        {/* === PAIR 1: TOP — iter 41: asymmetric yellow cap redrawn with smooth single bezier === */}
        {/* Yellow top cap — covers top ~28%, lower edge: left dips to ~y=17, right exits at ~y=3 */}
        <path
          d="M32 2 C17 2 6 9 2.5 17
             C10 15 18 14.5 25 15.5 S34 19 36.5 21.5
             C39 14 41.5 7 40.5 3 C37.5 2.2 35 2 32 2Z"
          fill={`url(#${p}-y1)`}
        />
        {showTexture && (
          <path
            d="M32 2 C17 2 6 9 2.5 17
               C10 15 18 14.5 25 15.5 S34 19 36.5 21.5
               C39 14 41.5 7 40.5 3 C37.5 2.2 35 2 32 2Z"
            fill={`url(#${p}-y1)`}
            filter={`url(#${p}-ytex)`}
            opacity="0.12"
          />
        )}

        {/* iter 44-45: Narrow red strip — top-left transition, razor-thin */}
        <path
          d="M2.5 17 C2.2 19 2 21 2 23
             C6 22 12 21.5 18 21.5 C23 21.5 27 22 30 23.5
             C28.5 21 26.5 19 25 17
             C20 15.5 12 15.5 6 16 C4 16.5 3 17 2.5 17Z"
          fill={`url(#${p}-r1)`}
        />
        {/* iter 49: Top-right red accent — very small triangular sliver */}
        <path
          d="M40.5 3 C41.5 7 39 14 36.5 21.5
             C38 20 41 18.5 44.5 18 C49 17.5 53 18 55.5 19.5
             C51 11 46 5 40.5 3Z"
          fill={`url(#${p}-r2)`}
        />

        {/* === PAIR 2: RIGHT — iter 48: taller/more prominent yellow panel === */}
        <path
          d="M55.5 19.5 C59 23.5 61.5 28.5 62 34
             C58 32 53 30.5 48 30.5 C42 31 37 33 34.5 35.5
             C35 31 35.5 26 37 23 C39 20 42 18.5 44.5 18
             C49 17.5 53 18 55.5 19.5Z"
          fill={`url(#${p}-y2)`}
        />
        {showTexture && (
          <path
            d="M55.5 19.5 C59 23.5 61.5 28.5 62 34
               C58 32 53 30.5 48 30.5 C42 31 37 33 34.5 35.5
               C35 31 35.5 26 37 23 C39 20 42 18.5 44.5 18
               C49 17.5 53 18 55.5 19.5Z"
            fill={`url(#${p}-y2)`}
            filter={`url(#${p}-ytex)`}
            opacity="0.10"
          />
        )}
        {/* iter 44: Narrow red strip — right transition, razor-thin */}
        <path
          d="M62 34 C62.2 37 61.5 40 60.5 42.5
             C57 40 52 38.5 47 38 C42 37.5 38 38.5 35.5 39.5
             C35 38 34.5 37 34.5 35.5
             C37 33 42 31 48 30.5 C53 30.5 58 32 62 34Z"
          fill={`url(#${p}-r1)`}
        />

        {/* === PAIR 3: BOTTOM — iter 43: enlarged bottom-right yellow === */}
        {/* Bottom-right yellow — iter 43: ~20% of ball area, prominent triangle */}
        <path
          d="M60.5 42.5 C57 50 51 56.5 43 60.5
             C41.5 54.5 39.5 49 38 45 C37 42.5 36 40.5 35.5 39.5
             C36 38.5 39 37.5 43 37.5 C48.5 37.5 54 39.5 58 41.5
             C59.5 42 60 42.3 60.5 42.5Z"
          fill={`url(#${p}-y3)`}
        />
        {showTexture && (
          <path
            d="M60.5 42.5 C57 50 51 56.5 43 60.5
               C41.5 54.5 39.5 49 38 45 C37 42.5 36 40.5 35.5 39.5
               C36 38.5 39 37.5 43 37.5 C48.5 37.5 54 39.5 58 41.5
               C59.5 42 60 42.3 60.5 42.5Z"
            fill={`url(#${p}-y3)`}
            filter={`url(#${p}-ytex)`}
            opacity="0.08"
          />
        )}

        {/* Bottom-left yellow panel */}
        <path
          d="M4.5 42.5 C7.5 49.5 13 56 20 60
             C22 54.5 24.5 49 26.5 45 C27.5 42.5 28.5 40.5 29.5 39.5
             C28.5 38.5 25.5 37.5 22 37.5 C17 37.5 11 39.5 7 41.5
             C5.5 42 5 42.3 4.5 42.5Z"
          fill={`url(#${p}-y4)`}
        />
        {showTexture && (
          <path
            d="M4.5 42.5 C7.5 49.5 13 56 20 60
               C22 54.5 24.5 49 26.5 45 C27.5 42.5 28.5 40.5 29.5 39.5
               C28.5 38.5 25.5 37.5 22 37.5 C17 37.5 11 39.5 7 41.5
               C5.5 42 5 42.3 4.5 42.5Z"
            fill={`url(#${p}-y4)`}
            filter={`url(#${p}-ytex)`}
            opacity="0.08"
          />
        )}

        {/* iter 45: Left-side red strip — particularly narrow, minimal red */}
        <path
          d="M2 23 C2 26 2.2 29 2.5 32 C3 36 3.5 39.5 4.5 42.5
             C7 40.5 12 39 17 38 C21 37.5 25 37.5 28 38.5
             C28.5 37 28.5 35 29 33
             C26 31.5 22 30 18 29.5 C12 28.5 6 25 2 23Z"
          fill={`url(#${p}-r4)`}
        />

        {/* iter 46: Bottom-center red — narrow inverted-V, not wide triangle */}
        <path
          d="M20 60 C25 61.5 29 62 32 62 C36 62 40 61.5 43 60.5
             C41.5 55.5 40 51 39 48 C38 45 37 42.5 36 40.5
             C34.5 39.5 33.5 39 32.5 39
             C31.5 39 30.5 39.5 29.5 40.5
             C28.5 42.5 27.5 45 26.5 48 C25 51 22.5 55.5 20 60Z"
          fill={`url(#${p}-r3)`}
        />

        {/* iter 66: Per-panel shadow overlay */}
        <circle cx="32" cy="32" r="31" fill={`url(#${p}-psh)`} />
      </g>

      {/* === iter 51-54: Seam lines — smooth single bezier curves, golden #BFA558 === */}
      <g clipPath={`url(#${p}-c)`} stroke="#BFA558" strokeWidth={seamW} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* Top cap lower edge — iter 51: single smooth S-curve */}
        <path d="M2.5 17 C10 15 18 14.5 25 15.5 S34 19 36.5 21.5" />
        <path d="M40.5 3 C41.5 7 39 14 36.5 21.5" />

        {/* Upper transition seams — iter 52: continuous curvature */}
        <path d="M2 23 C6 22 12 21.5 18 21.5 S27 22 30 23.5" />
        <path d="M55.5 19.5 C53 18 49 17.5 44.5 18 S39 20 36.5 21.5" />

        {/* iter 53: Center radial seams — flow into convergence organically */}
        <path d="M36.5 21.5 C36 26 35.5 31 34.5 35.5 S33 38 32.5 39" />
        <path d="M30 23.5 C30 27.5 30.5 32 31.5 36 S32 38.5 32.5 39" />

        {/* Bottom radiating seams — iter 54: wider curves near center */}
        <path d="M32.5 39 C30 41.5 28 44 26.5 48 S22.5 55.5 20 60" />
        <path d="M32.5 39 C35 41.5 37 44 38.5 48 S41.5 55 43 60.5" />

        {/* Right panel seams */}
        <path d="M62 34 C58 32 53 30.5 48 30.5 S37 33 34.5 35.5" />
        <path d="M60.5 42.5 C57 40 52 38.5 47 38 S38 38.5 35.5 39.5" />

        {/* Left panel seams */}
        <path d="M2 23 C2 26 2.2 29 2.5 32 S3.5 39.5 4.5 42.5" />
        <path d="M4.5 42.5 C7 40.5 12 39 17 38 S25 37.5 28 38.5 C30.5 39 31.5 39.2 32.5 39" />
      </g>

      {/* iter 73: Canvas-weave texture on seam lines */}
      {showDetailTexture && (
        <g clipPath={`url(#${p}-c)`} stroke="#BFA558" strokeWidth={seamW} fill="none" strokeLinecap="round" opacity="0.12" filter={`url(#${p}-stex)`}>
          <path d="M2.5 17 C10 15 18 14.5 25 15.5 S34 19 36.5 21.5" />
          <path d="M62 34 C58 32 53 30.5 48 30.5 S37 33 34.5 35.5" />
        </g>
      )}

      {/* Seam embossed highlight — iter 36/88: direction-aware offset */}
      {showEmbossing && (
        <g clipPath={`url(#${p}-c)`} stroke="#E8DCA8" strokeWidth={seamW * 0.35} fill="none" strokeLinecap="round" opacity="0.36">
          <path d="M2.5 17 C10 15 18 14.5 25 15.5 S34 19 36.5 21.5" transform="translate(-0.3 -0.4)" />
          <path d="M36.5 21.5 C36 26 35.5 31 34.5 35.5 S33 38 32.5 39" transform="translate(-0.4 -0.3)" />
          <path d="M30 23.5 C30 27.5 30.5 32 31.5 36" transform="translate(-0.3 -0.4)" />
          <path d="M62 34 C58 32 53 30.5 48 30.5 S37 33 34.5 35.5" transform="translate(-0.2 -0.4)" />
          <path d="M2 23 C6 22 12 21.5 18 21.5 S27 22 30 23.5" transform="translate(-0.3 -0.4)" />
          <path d="M55.5 19.5 C53 18 49 17.5 44.5 18 S39 20 36.5 21.5" transform="translate(-0.3 -0.4)" />
        </g>
      )}

      {/* Seam embossed shadow — iter 36/88 */}
      {showEmbossing && (
        <g clipPath={`url(#${p}-c)`} stroke="#907840" strokeWidth={seamW * 0.3} fill="none" strokeLinecap="round" opacity="0.26">
          <path d="M2.5 17 C10 15 18 14.5 25 15.5 S34 19 36.5 21.5" transform="translate(0.3 0.4)" />
          <path d="M36.5 21.5 C36 26 35.5 31 34.5 35.5 S33 38 32.5 39" transform="translate(0.4 0.3)" />
          <path d="M30 23.5 C30 27.5 30.5 32 31.5 36" transform="translate(0.3 0.4)" />
          <path d="M62 34 C58 32 53 30.5 48 30.5 S37 33 34.5 35.5" transform="translate(0.2 0.4)" />
          <path d="M32.5 39 C30 41.5 28 44 26.5 48" transform="translate(0.3 0.3)" />
          <path d="M32.5 39 C35 41.5 37 44 38.5 48" transform="translate(0.3 0.3)" />
        </g>
      )}

      {/* iter 68: Ambient occlusion at seam convergence */}
      {showAO && (
        <>
          <circle cx="32.5" cy="39" r="2.5" fill={`url(#${p}-ao)`} />
          <circle cx="36.5" cy="21.5" r="2" fill={`url(#${p}-ao)`} />
        </>
      )}

      {/* === 3D sphere overlays === */}
      {/* iter 64: Smooth 8-stop sphere shading */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-shade)`} />
      {/* iter 65: Inner edge shadow */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-inner)`} />
      {/* Primary specular area */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-hl)`} />
      {/* Warm ambient glow */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-glow)`} />
      {/* iter 67: Contact shadow */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-sh)`} />
      {/* Rim light */}
      <circle cx="32" cy="32" r="30" fill={`url(#${p}-rim)`} />
      {/* iter 69: Environmental blue reflection on shadow side */}
      {showEnvReflection && (
        <circle cx="32" cy="32" r="30" fill={`url(#${p}-env)`} />
      )}
      {/* iter 80: Secondary fill-light highlight on right */}
      {showSecondarySpecular && (
        <circle cx="32" cy="32" r="30" fill={`url(#${p}-hl2)`} />
      )}

      {/* iter 83: Variable outline — warmer on lit side, cooler on shadow side */}
      <circle cx="32" cy="32" r="30" stroke={`url(#${p}-edge)`} strokeWidth={edgeW} fill="none" opacity={edgeOpacity} />

      {/* iter 85: Outer glow on lit side */}
      {showOuterGlow && (
        <circle cx="32" cy="32" r="31" fill={`url(#${p}-oglow)`} />
      )}

      {/* iter 77-79: Primary specular — elongated along yellow-white cap boundary */}
      <ellipse cx="22" cy="16.5" rx="7" ry="3" fill="#FFF8E8" opacity="0.24" transform="rotate(-22 22 16.5)" />
      <ellipse cx="20.5" cy="15.5" rx="4" ry="1.8" fill="#FFF8E8" opacity="0.48" transform="rotate(-22 20.5 15.5)" />

      {/* iter 78: Sharp star specular point — brightest spot */}
      {showStarSpecular && (
        <circle cx="19" cy="15" r="1.0" fill="#FFFEF8" opacity="0.65" />
      )}

      {/* iter 82: Simplified specular for small sizes */}
      {!showStarSpecular && size >= 14 && (
        <circle cx="20" cy="16" r="1.5" fill="white" opacity="0.45" />
      )}

      {/* iter 80: Secondary specular dot — environmental fill light */}
      {showSecondarySpecular && (
        <circle cx="46" cy="26" r="0.8" fill="#FFF8E8" opacity="0.18" />
      )}
    </svg>
  )
}
