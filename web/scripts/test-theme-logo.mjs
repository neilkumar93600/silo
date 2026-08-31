import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Doppler Brand Palette Tokens
const THEME = {
  midnightPlum: '#1c1624',
  deepCanvas: '#120e18',
  shadowPlum: '#2d2734',
  elevatedPanel: '#3a3340',
  boneWhite: '#f1f0ec',
  fogLine: '#e5e7eb',
  ashVeil: '#d0c9c4',
  midAsh: '#a5a2a5',
  ironEdge: '#55505b',
  lavenderSpark: '#b997ff',
  signalGreen: '#00f575',
  neonViolet: '#6b13f5',
  emberOrange: '#ff5632',
  plasmaPink: '#ff9efa',
};

export function getDopplerThemeLogoSvg({
  width = 1024,
  height = 1024,
  includeBackground = true,
  bgType = 'squircle', // 'squircle' | 'circle' | 'none'
  variant = 'color',   // 'color' | 'white' | 'dark'
} = {}) {
  if (variant === 'white') {
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${width}" height="${height}">
  ${includeBackground ? (
    bgType === 'circle'
      ? `<circle cx="512" cy="512" r="512" fill="${THEME.midnightPlum}" />`
      : `<rect width="1024" height="1024" rx="224" fill="${THEME.midnightPlum}" />`
  ) : ''}
  <g id="silo-logo-white">
    <path
      d="M 512 775 L 310 775 C 195 775 125 680 125 560 C 125 440 215 375 330 375 C 400 375 460 410 496 470 L 512 505 Z"
      fill="${THEME.boneWhite}"
      opacity="0.4"
    />
    <path
      d="M 512 775 L 714 775 C 829 775 899 680 899 560 C 899 440 809 375 694 375 C 624 375 564 410 528 470 L 512 505 Z"
      fill="${THEME.boneWhite}"
      opacity="0.4"
    />
    <path
      d="M 512 775 C 460 705 325 530 325 390 C 325 280 408 190 512 190 C 616 190 699 280 699 390 C 699 530 564 705 512 775 Z"
      fill="${THEME.boneWhite}"
      opacity="0.95"
    />
  </g>
</svg>`.trim();
  }

  // Full Color Doppler Theme SVG
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${width}" height="${height}">
  <defs>
    <!-- Midnight Plum Security Canvas Background -->
    <linearGradient id="dopplerBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#231b2e" />
      <stop offset="60%" stop-color="#1c1624" />
      <stop offset="100%" stop-color="#120e18" />
    </linearGradient>

    <!-- Subtle Outer Border Glow for App Squircle -->
    <linearGradient id="dopplerSquircleBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b997ff" stop-opacity="0.3" />
      <stop offset="50%" stop-color="#55505b" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#00f575" stop-opacity="0.25" />
    </linearGradient>

    <!-- Left Bulb: Neon Violet -> Lavender Spark -> Plasma Pink Aurora Gradient -->
    <linearGradient id="dopplerVioletGrad" x1="5%" y1="15%" x2="95%" y2="90%">
      <stop offset="0%" stop-color="#4c0ca8" />
      <stop offset="30%" stop-color="#6b13f5" />
      <stop offset="65%" stop-color="#9333ea" />
      <stop offset="85%" stop-color="#b997ff" />
      <stop offset="100%" stop-color="#ff9efa" />
    </linearGradient>

    <!-- Left Bulb Volumetric Glow (Lavender Spark) -->
    <radialGradient id="dopplerVioletGlow" cx="36%" cy="48%" r="60%">
      <stop offset="0%" stop-color="#ff9efa" stop-opacity="0.9" />
      <stop offset="40%" stop-color="#b997ff" stop-opacity="0.8" />
      <stop offset="75%" stop-color="#6b13f5" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#4c0ca8" stop-opacity="0" />
    </radialGradient>

    <!-- Left Bulb Rim Highlight (Lavender Mist) -->
    <linearGradient id="dopplerVioletStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff9efa" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#b997ff" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#e9d5ff" stop-opacity="0.95" />
    </linearGradient>

    <!-- Right Bulb: Signal Green Gradient -->
    <linearGradient id="dopplerGreenGrad" x1="10%" y1="15%" x2="95%" y2="90%">
      <stop offset="0%" stop-color="#0369a1" />
      <stop offset="25%" stop-color="#0284c7" />
      <stop offset="50%" stop-color="#059669" />
      <stop offset="80%" stop-color="#00f575" />
      <stop offset="100%" stop-color="#6ee7b7" />
    </linearGradient>

    <!-- Right Bulb Volumetric Glow (Signal Green) -->
    <radialGradient id="dopplerGreenGlow" cx="64%" cy="48%" r="60%">
      <stop offset="0%" stop-color="#a7f3d0" stop-opacity="0.95" />
      <stop offset="40%" stop-color="#00f575" stop-opacity="0.85" />
      <stop offset="75%" stop-color="#059669" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
    </radialGradient>

    <!-- Right Bulb Rim Highlight (Signal Green Rim) -->
    <linearGradient id="dopplerGreenStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a7f3d0" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#00f575" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#d1fae5" stop-opacity="0.95" />
    </linearGradient>

    <!-- Frosted Glass Pin: Bone White -> Ash Veil Gradient -->
    <linearGradient id="dopplerGlassGrad" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#f1f0ec" stop-opacity="0.98" />
      <stop offset="25%" stop-color="#e5e7eb" stop-opacity="0.92" />
      <stop offset="55%" stop-color="#d0c9c4" stop-opacity="0.80" />
      <stop offset="80%" stop-color="#a5a2a5" stop-opacity="0.52" />
      <stop offset="95%" stop-color="#d0c9c4" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#f1f0ec" stop-opacity="0.88" />
    </linearGradient>

    <!-- Specular Dome Highlight -->
    <radialGradient id="dopplerDomeHighlight" cx="50%" cy="28%" r="48%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#f1f0ec" stop-opacity="0.35" />
      <stop offset="85%" stop-color="#f1f0ec" stop-opacity="0" />
    </radialGradient>

    <!-- Frosted Pin Rim Light (Fog Line hairline) -->
    <linearGradient id="dopplerPinRim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#f1f0ec" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.85" />
    </linearGradient>

    <!-- Ambient Shadow Filter -->
    <filter id="dopplerShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  ${includeBackground ? (
    bgType === 'circle'
      ? `<circle cx="512" cy="512" r="512" fill="url(#dopplerBgGrad)" stroke="url(#dopplerSquircleBorder)" stroke-width="2" />`
      : `<rect width="1024" height="1024" rx="224" fill="url(#dopplerBgGrad)" stroke="url(#dopplerSquircleBorder)" stroke-width="2" />`
  ) : ''}

  <!-- Master Logo Mark -->
  <g id="silo-brand-mark" filter="url(#dopplerShadow)">
    <!-- LEFT BULB (Neon Violet / Lavender Spark / Plasma Pink) -->
    <g id="violet-lobe">
      <path
        d="M 512 775 
           L 310 775 
           C 195 775 125 680 125 560 
           C 125 440 215 375 330 375 
           C 400 375 460 410 496 470 
           L 512 505 
           Z"
        fill="url(#dopplerVioletGrad)"
      />
      <path
        d="M 512 775 
           L 310 775 
           C 195 775 125 680 125 560 
           C 125 440 215 375 330 375 
           C 400 375 460 410 496 470 
           L 512 505 
           Z"
        fill="url(#dopplerVioletGlow)"
      />
      <!-- Rim Highlight -->
      <path
        d="M 512 775 
           L 310 775 
           C 195 775 125 680 125 560 
           C 125 440 215 375 330 375 
           C 400 375 460 410 496 470"
        fill="none"
        stroke="url(#dopplerVioletStroke)"
        stroke-width="4"
        stroke-linecap="round"
      />
    </g>

    <!-- RIGHT BULB (Signal Green) -->
    <g id="green-lobe">
      <path
        d="M 512 775 
           L 714 775 
           C 829 775 899 680 899 560 
           C 899 440 809 375 694 375 
           C 624 375 564 410 528 470 
           L 512 505 
           Z"
        fill="url(#dopplerGreenGrad)"
      />
      <path
        d="M 512 775 
           L 714 775 
           C 829 775 899 680 899 560 
           C 899 440 809 375 694 375 
           C 624 375 564 410 528 470 
           L 512 505 
           Z"
        fill="url(#dopplerGreenGlow)"
      />
      <!-- Rim Highlight -->
      <path
        d="M 512 775 
           L 714 775 
           C 829 775 899 680 899 560 
           C 899 440 809 375 694 375 
           C 624 375 564 410 528 470"
        fill="none"
        stroke="url(#dopplerGreenStroke)"
        stroke-width="4"
        stroke-linecap="round"
      />
    </g>

    <!-- FROSTED GLASS PIN (Bone White / Fog Line) -->
    <g id="frosted-glass-center">
      <path
        d="M 512 775
           C 460 705 325 530 325 390
           C 325 280 408 190 512 190
           C 616 190 699 280 699 390
           C 699 530 564 705 512 775
           Z"
        fill="url(#dopplerGlassGrad)"
        stroke="url(#dopplerPinRim)"
        stroke-width="4"
      />

      <!-- Specular Highlight Dome -->
      <path
        d="M 512 775
           C 460 705 325 530 325 390
           C 325 280 408 190 512 190
           C 616 190 699 280 699 390
           C 699 530 564 705 512 775
           Z"
        fill="url(#dopplerDomeHighlight)"
      />

      <!-- Color Radiance Bleed Through Frosted Pin -->
      <path
        d="M 512 775
           C 485 735 410 635 390 560
           C 425 615 470 690 512 775
           Z"
        fill="url(#dopplerVioletGrad)"
        opacity="0.38"
      />
      <path
        d="M 512 775
           C 539 735 614 635 634 560
           C 599 615 554 690 512 775
           Z"
        fill="url(#dopplerGreenGrad)"
        opacity="0.38"
      />
    </g>
  </g>
</svg>
`.trim();
}

async function run() {
  const svg = getDopplerThemeLogoSvg({ includeBackground: true });
  fs.writeFileSync('scratch/test-theme-icon.svg', svg);
  await sharp(Buffer.from(svg))
    .resize(1024, 1024)
    .png()
    .toFile('scratch/test-theme-icon.png');
  console.log('Rendered test-theme-icon.png with website theme palette');
}

run().catch(console.error);
