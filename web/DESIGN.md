# Silo — Master Design System & Style Reference
> Dark Security Console (Void Plum / Doppler) — Zero-knowledge privacy meets high-voltage neon aurora and volumetric frosted glass.

**Theme:** Dark (Void Plum / Midnight Security Console)  
**Tone:** Cryptographic, High-End Futuristic, Tactile, Fluid & Human.

---

## 1. Design Philosophy

Silo is built upon the **Doppler / Void Plum** design language:
- **Atmosphere over Flatness**: Deep, rich plum and obsidian surfaces (`#1c1624`, `#2d2734`, `#0f0f11`) replace generic SaaS grays with volumetric depth and ambient luminescence.
- **Controlled Neon Voltage**: High-voltage aurora accents—**Neon Violet** (`#6b13f5`), **Lavender Spark** (`#b997ff`), **Plasma Pink / Fuchsia** (`#c026d3`, `#f43f5e`), **Mint Cyan** (`#06b6d4`), and **Signal Green** (`#00f575`)—serve as functional security beacons and visual signifiers.
- **Tactile Frosted Glass & Subsurface Glow**: Translucent materials, specular edge lighting, and inner radiant light bleeds give hardware-grade physical presence to digital zero-knowledge cryptography.
- **Asymmetrical Harmony**: Visual balance through organic, weighted asymmetry—embodied by the signature cloud-pin mark and fluid reactive UI modules.

---

## 2. Color Palette & Tokens

### Surfaces & Backgrounds
| Name | Hex / Value | CSS Variable | Purpose & Role |
|------|-------------|--------------|----------------|
| **Void Plum / Midnight** | `#1c1624` | `--color-void-plum` | Primary page canvas & application background |
| **Shadow Plum** | `#2d2734` | `--color-shadow-plum` | Elevated card surfaces, dialogs, dropdowns, and sidebars |
| **Deep Charcoal** | `#18181b` | `--color-charcoal-base` | App icon background, secondary container fills |
| **Abyss Black** | `#0f0f11` | `--color-abyss-black` | Deepest recessed surfaces, code blocks, terminal console |

### Neon Aurora Accents & Security Beacons
| Name | Hex / Value | CSS Variable | Purpose & Role |
|------|-------------|--------------|----------------|
| **Laser Violet** | `#6b13f5` | `--color-laser-violet` | Brand primary color, glowing focus rings, active states |
| **Lavender Spark** | `#b997ff` | `--color-lavender-spark` | Interactive highlights, gradient mid-tones, secondary badges |
| **Plasma Pink / Fuchsia** | `#c026d3` / `#f43f5e` | `--color-plasma-pink` | Left cloud aurora lobe, warning pulses, high-energy accents |
| **Mint Aqua / Cyan** | `#06b6d4` / `#2dd4bf` | `--color-mint-cyan` | Right cloud aurora lobe, data stream flows, scanning beams |
| **Signal Green** | `#00f575` | `--color-signal-green` | Cryptographic confirmation, success states, verified badges |

### Typography & Border Tokens
| Name | Hex / Value | CSS Variable | Purpose & Role |
|------|-------------|--------------|----------------|
| **Bone White** | `#f1f0ec` | `--color-bone-white` | Primary headlines, key metrics, high-emphasis text |
| **Ash Veil** | `#d0c9c4` | `--color-ash-veil` | Secondary body text, subheadings, descriptive copy |
| **Mid Ash / Muted** | `#a5a2a5` | `--color-mid-ash` | Helper text, timestamps, inactive icons |
| **Fog Line** | `rgba(255,255,255,0.1)` | `--color-fog-line` | Subtle structural borders, divider lines, card perimeters |
| **Iron Edge** | `#55505b` | `--color-iron-edge` | Form input borders, hover outline enhancements |

---

## 3. Typography System

### Typefaces
- **Display Brand Face:** `Freckle Face`, sans-serif (`--font-freckle`)
  - *Usage:* Primary brand wordmark ("Silo"), hero emotional moments, large stat callouts.
- **Primary UI & Body:** `Inter`, system-ui, -apple-system, sans-serif (`--font-inter`)
  - *Usage:* Navigation, button labels, card headers, tables, general body copy.
  - *Weights:* 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold).
- **Monospace Code & Security:** `JetBrains Mono`, monospace (`--font-mono`)
  - *Usage:* Cryptographic hashes, encryption keys, terminal logs, file sizes, token counters.

---

## 4. Logo & Brand Mark Anatomy

```
               .---.              
             /       \            <-- Volumetric Frosted Glass Teardrop Pin
            |  (   )  |               (Specular dome highlight + silvery gradient)
          .-'   \ /   '-.         
        /   \    V    /   \       
       | LEFT|       |RIGHT|      <-- Asymmetrical Aurora Cloud
        \___/=========\___/           Left: Large purple-fuchsia puff (x: 130-552, y: 388-778)
                                      Right: Compact cyan-mint capsule (x: 552-872, y: 492-778)
```

### Key Anatomy Details
1. **Asymmetrical Cloud Lobes**:
   - **Left Lobe:** Substantially larger and higher-reaching bulb. Gradients from deep violet (`#7033ea`) through vivid fuchsia (`#c026d3`) to hot rose (`#f43f5e`) with volumetric radial glow and neon pink rim lighting.
   - **Right Lobe:** Smaller, lower capsule tucked under the right wing. Gradients from cyan (`#06b6d4`) through mint (`#14b8a6`) to emerald (`#34d399`) with neon aqua rim lighting.
2. **Center Frosted Glass Teardrop Pin**:
   - Symmetrical teardrop geometry with a wide top dome (diameter ~440px) tapering to a sharp triangular apex at the baseline junction `(x: 552, y: 778)`.
   - Frosted silvery gradient (`#ffffff` → `#cbd5e1` → `#94a3b8`), top specular dome highlight, and smooth internal subsurface color diffusion from the surrounding cloud lobes.
3. **App Squircle Container**:
   - 1024×1024 viewBox, Apple-style `rx="224"` superellipse in dark obsidian (`#19191d` → `#0e0e11`) with subtle perimeter rim light and ambient drop shadow.

---

## 5. Component & Icon Architecture (`@/components/icons`)

The application uses a centralized, modular icon and brand system:

```
components/icons/
├── types.ts                     # Interfaces (LogoProps, SilviIconProps, BaseIconProps)
├── logo/
│   ├── logo-icon.tsx            # Standalone Mark (Asymmetrical Cloud-Pin)
│   ├── logo.tsx                 # Full Logo (Color / Monochrome, Squircle / Circle)
│   ├── logo-lockup.tsx          # Brand Mark + "Silo" Wordmark + ZK Status Badge
│   ├── logo-badge.tsx           # App Squircle Showcase Badge
│   └── index.ts
├── silvi/
│   ├── silvi-avatar.tsx         # Expressive AI Mascot Avatar (9 mood states)
│   ├── silvi-icon.tsx           # Compact Command-Bar & Navigation Glyph
│   ├── silvi-badge.tsx          # Live Assistant Status Pill Badge
│   ├── silvi-sparkle.tsx        # Cyber Starburst Sparkle Accent
│   └── index.ts
├── custom/
│   ├── vault-icons.tsx          # VaultIcon, FolderVaultIcon, CloudSyncIcon, StorageGaugeIcon
│   ├── security-icons.tsx       # ZeroKnowledgeKeyIcon, ShieldCheckGlowIcon, RevocableLinkIcon, FingerprintAuthIcon
│   ├── file-icons.tsx           # VaultFilePdfIcon, VaultFileMediaIcon, VaultFileCodeIcon, VaultFileZipIcon, VaultFileSheetIcon
│   ├── brand-icons.tsx          # DopplerAsteriskIcon, CyberUploadIcon, TerminalPromptIcon
│   └── index.ts
└── index.ts                     # Root barrel export
```

---

## 6. Silvi AI Mascot State Engine

Silvi, the Zero-Knowledge Vault Assistant, features 9 vector facial modes:

| Mood State | Eye & Visor Geometry | Visual Expression | Trigger Scenario |
|------------|----------------------|-------------------|------------------|
| `idle` | Rounded calm pupil dots | Relaxed & ready | Default state, ambient rest |
| `thinking` | Horizontal cyan visor slits | Analyzing queries | Search, semantic vault queries |
| `typing` | Wide eager eyes + green center dots | Generating responses | Streaming text generation |
| `checking` | Shield-shaped security eyes | Vigilant inspection | Permission & key audits |
| `processing`| Quantum ring aperture | High-speed computation | File encryption & chunking |
| `success` | Arched happy eyes + green glow | Confirmed / verified | Upload / share completed |
| `happy` | Joyful smile + sparkling eyes | Pleased interaction | Positive feedback, greeting |
| `alert` | Sharp warning pupils | Security notification | Expiring links, revoked access |
| `sleepy` | Low-power eyelid crescents | Standby mode | Inactive sessions |

---

## 7. Elevation, Shadows & Glassmorphism

- **Squircle Card Elevation**:
  ```css
  background: rgba(45, 39, 52, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  ```
- **Neon Glow Filter**:
  ```css
  filter: drop-shadow(0 0 16px rgba(185, 151, 255, 0.35));
  ```
- **Security Beacon Glow**:
  ```css
  filter: drop-shadow(0 0 12px rgba(0, 245, 117, 0.5));
  ```

---

## 8. Tailwind v4 Theme Tokens (`globals.css`)

```css
@theme {
  --color-void-plum: #1c1624;
  --color-shadow-plum: #2d2734;
  --color-laser-violet: #6b13f5;
  --color-lavender-spark: #b997ff;
  --color-plasma-pink: #c026d3;
  --color-mint-cyan: #06b6d4;
  --color-signal-green: #00f575;
  --color-bone-white: #f1f0ec;
  --color-ash-veil: #d0c9c4;
  --color-mid-ash: #a5a2a5;
  --color-fog-line: rgba(255, 255, 255, 0.1);
  --color-iron-edge: #55505b;

  --font-freckle: "Freckle Face", system-ui, cursive;
  --font-mono: "JetBrains Mono", monospace;
  --font-sans: "Inter", system-ui, sans-serif;
}
```

---

## 9. Interactive Brand Showcase Platform

Preview, test, and copy all brand assets interactively on the live platform:
- **Route:** [`/brand`](file:///e:/Silo/web/app/brand/page.tsx)
- **Features:**
  - Interactive scale slider (32px to 180px) & multi-canvas background switcher.
  - Silvi AI Mascot state switcher across all 9 moods.
  - 1-click JSX & SVG copy for all custom vault and security icons.
  - Real-time OpenGraph (1200×630), Twitter Cards, and PWA manifest inspection.
