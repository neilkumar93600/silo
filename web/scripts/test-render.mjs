import fs from 'fs';
import sharp from 'sharp';

export function getMasterSvg({
  width = 1024,
  height = 1024,
  includeBackground = true,
  bgType = 'squircle' // 'squircle', 'transparent', 'circle'
} = {}) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${width}" height="${height}">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="siloBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#151518" />
      <stop offset="100%" stop-color="#0a0a0c" />
    </linearGradient>

    <!-- Left Bulb Master Gradient -->
    <linearGradient id="magentaBaseGrad" x1="5%" y1="15%" x2="95%" y2="90%">
      <stop offset="0%" stop-color="#9333ea" />
      <stop offset="22%" stop-color="#c026d3" />
      <stop offset="55%" stop-color="#db2777" />
      <stop offset="85%" stop-color="#f43f5e" />
      <stop offset="100%" stop-color="#fb7185" />
    </linearGradient>

    <!-- Left Bulb Volumetric Radial Glow -->
    <radialGradient id="magentaRadialGlow" cx="36%" cy="48%" r="60%">
      <stop offset="0%" stop-color="#f472b6" stop-opacity="0.95" />
      <stop offset="40%" stop-color="#d946ef" stop-opacity="0.8" />
      <stop offset="75%" stop-color="#a21caf" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#581c87" stop-opacity="0" />
    </radialGradient>

    <!-- Left Bulb Rim Stroke -->
    <linearGradient id="magentaStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f472b6" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#ec4899" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#fda4af" stop-opacity="0.95" />
    </linearGradient>

    <!-- Right Bulb Master Gradient -->
    <linearGradient id="tealBaseGrad" x1="10%" y1="15%" x2="95%" y2="90%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="25%" stop-color="#06b6d4" />
      <stop offset="55%" stop-color="#14b8a6" />
      <stop offset="80%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <!-- Right Bulb Volumetric Radial Glow -->
    <radialGradient id="tealRadialGlow" cx="64%" cy="48%" r="60%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.95" />
      <stop offset="40%" stop-color="#2dd4bf" stop-opacity="0.8" />
      <stop offset="75%" stop-color="#0d9488" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
    </radialGradient>

    <!-- Right Bulb Rim Stroke -->
    <linearGradient id="tealStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#2dd4bf" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0.95" />
    </linearGradient>

    <!-- Frosted Glass Pin Master Gradient -->
    <linearGradient id="glassBodyGrad" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" stop-opacity="0.98" />
      <stop offset="22%" stop-color="#e2e8f0" stop-opacity="0.92" />
      <stop offset="50%" stop-color="#cbd5e1" stop-opacity="0.80" />
      <stop offset="78%" stop-color="#94a3b8" stop-opacity="0.52" />
      <stop offset="95%" stop-color="#e2e8f0" stop-opacity="0.68" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.85" />
    </linearGradient>

    <!-- Pin Top Specular Glow -->
    <radialGradient id="pinDomeGlow" cx="50%" cy="28%" r="48%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.92" />
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0.3" />
      <stop offset="85%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>

    <!-- Pin Translucent Specular Border -->
    <linearGradient id="pinRimGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.85" />
    </linearGradient>

    <!-- Ambient Shadow Filter -->
    <filter id="markShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  ${includeBackground ? (
    bgType === 'circle'
      ? '<circle cx="512" cy="512" r="512" fill="url(#siloBgGrad)" />'
      : '<rect width="1024" height="1024" rx="224" fill="url(#siloBgGrad)" />'
  ) : ''}

  <!-- Main Silo Logo Mark -->
  <g id="silo-brand-mark" filter="url(#markShadow)">
    <!-- LEFT BULB (Neon Magenta / Fuchsia) -->
    <g id="magenta-lobe">
      <path
        d="M 512 775 
           L 310 775 
           C 195 775 125 680 125 560 
           C 125 440 215 375 330 375 
           C 400 375 460 410 496 470 
           L 512 505 
           Z"
        fill="url(#magentaBaseGrad)"
      />
      <path
        d="M 512 775 
           L 310 775 
           C 195 775 125 680 125 560 
           C 125 440 215 375 330 375 
           C 400 375 460 410 496 470 
           L 512 505 
           Z"
        fill="url(#magentaRadialGlow)"
      />
      <!-- Rim Highlight -->
      <path
        d="M 512 775 
           L 310 775 
           C 195 775 125 680 125 560 
           C 125 440 215 375 330 375 
           C 400 375 460 410 496 470"
        fill="none"
        stroke="url(#magentaStrokeGrad)"
        stroke-width="4"
        stroke-linecap="round"
      />
    </g>

    <!-- RIGHT BULB (Neon Teal / Cyan / Emerald) -->
    <g id="teal-lobe">
      <path
        d="M 512 775 
           L 714 775 
           C 829 775 899 680 899 560 
           C 899 440 809 375 694 375 
           C 624 375 564 410 528 470 
           L 512 505 
           Z"
        fill="url(#tealBaseGrad)"
      />
      <path
        d="M 512 775 
           L 714 775 
           C 829 775 899 680 899 560 
           C 899 440 809 375 694 375 
           C 624 375 564 410 528 470 
           L 512 505 
           Z"
        fill="url(#tealRadialGlow)"
      />
      <!-- Rim Highlight -->
      <path
        d="M 512 775 
           L 714 775 
           C 829 775 899 680 899 560 
           C 899 440 809 375 694 375 
           C 624 375 564 410 528 470"
        fill="none"
        stroke="url(#tealStrokeGrad)"
        stroke-width="4"
        stroke-linecap="round"
      />
    </g>

    <!-- FROSTED GLASS PIN TEARDROP -->
    <g id="frosted-glass-center">
      <!-- Outer Pin Body -->
      <path
        d="M 512 775
           C 460 705 325 530 325 390
           C 325 280 408 190 512 190
           C 616 190 699 280 699 390
           C 699 530 564 705 512 775
           Z"
        fill="url(#glassBodyGrad)"
        stroke="url(#pinRimGrad)"
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
        fill="url(#pinDomeGlow)"
      />

      <!-- Subtle Color Bleed Through Frosted Glass -->
      <path
        d="M 512 775
           C 485 735 410 635 390 560
           C 425 615 470 690 512 775
           Z"
        fill="url(#magentaBaseGrad)"
        opacity="0.36"
      />
      <path
        d="M 512 775
           C 539 735 614 635 634 560
           C 599 615 554 690 512 775
           Z"
        fill="url(#tealBaseGrad)"
        opacity="0.36"
      />
    </g>
  </g>
</svg>
`;
}

async function run() {
  const svgContent = getMasterSvg({ includeBackground: true });
  fs.writeFileSync('scratch/test-app-icon.svg', svgContent.trim());
  await sharp(Buffer.from(svgContent))
    .resize(1024, 1024)
    .png()
    .toFile('scratch/test-app-icon.png');
  console.log('Rendered updated test-app-icon.png');
}

run().catch(console.error);
