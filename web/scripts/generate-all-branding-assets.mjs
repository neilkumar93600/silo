import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Doppler Brand Palette Tokens (from web/DESIGN.md and globals.css)
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

// 1. Vector Generator for Theme Color & Monochrome Variants
export function generateLogoSvg({
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
      <stop offset="0%" stop-color="#b997ff" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#55505b" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#00f575" stop-opacity="0.3" />
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

      <path
        d="M 512 775
           C 460 705 325 530 325 390
           C 325 280 408 190 512 190
           C 616 190 699 280 699 390
           C 699 530 564 705 512 775
           Z"
        fill="url(#dopplerDomeHighlight)"
      />

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

// 2. OpenGraph / Twitter Social Share Card Generator (1200x630) aligned with Doppler theme
export function generateSocialCardSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <!-- Midnight Plum Security Canvas Background -->
    <radialGradient id="ogBg" cx="50%" cy="35%" r="85%">
      <stop offset="0%" stop-color="#2a2038" />
      <stop offset="50%" stop-color="#1c1624" />
      <stop offset="100%" stop-color="#100c16" />
    </radialGradient>

    <!-- Aurora Glows (Neon Violet + Signal Green) -->
    <radialGradient id="ogVioletAurora" cx="30%" cy="40%" r="45%">
      <stop offset="0%" stop-color="#6b13f5" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#b997ff" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#1c1624" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="ogGreenAurora" cx="70%" cy="40%" r="45%">
      <stop offset="0%" stop-color="#00f575" stop-opacity="0.28" />
      <stop offset="60%" stop-color="#059669" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#1c1624" stop-opacity="0" />
    </radialGradient>

    <!-- Text Gradient (Bone White) -->
    <linearGradient id="textBoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#f1f0ec" />
      <stop offset="100%" stop-color="#d0c9c4" />
    </linearGradient>

    <!-- Badge Outline & Fill -->
    <linearGradient id="badgeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#b997ff" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#00f575" stop-opacity="0.7" />
    </linearGradient>
  </defs>

  <!-- Canvas -->
  <rect width="1200" height="630" fill="url(#ogBg)" />

  <!-- Security Aurora Glow Spheres -->
  <circle cx="340" cy="240" r="420" fill="url(#ogVioletAurora)" />
  <circle cx="860" cy="240" r="420" fill="url(#ogGreenAurora)" />

  <!-- Cyber Grid Pattern (Hairline Fog Line) -->
  <g opacity="0.04" stroke="#ffffff" stroke-width="1">
    <line x1="0" y1="105" x2="1200" y2="105" />
    <line x1="0" y1="210" x2="1200" y2="210" />
    <line x1="0" y1="315" x2="1200" y2="315" />
    <line x1="0" y1="420" x2="1200" y2="420" />
    <line x1="0" y1="525" x2="1200" y2="525" />
    <line x1="200" y1="0" x2="200" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="600" y1="0" x2="600" y2="630" />
    <line x1="800" y1="0" x2="800" y2="630" />
    <line x1="1000" y1="0" x2="1000" y2="630" />
  </g>

  <!-- Center Floating App Icon -->
  <g transform="translate(460, 75)">
    <svg width="280" height="280" viewBox="0 0 1024 1024">
      ${generateLogoSvg({ includeBackground: true, bgType: 'squircle' })}
    </svg>
  </g>

  <!-- Security Console Badge -->
  <g transform="translate(600, 395)">
    <rect x="-155" y="-18" width="310" height="36" rx="18" fill="#2d2734" stroke="url(#badgeBorder)" stroke-width="1.5" />
    <!-- Live Signal Green indicator dot -->
    <circle cx="-130" cy="0" r="4" fill="#00f575" />
    <text text-anchor="middle" x="10" y="5" fill="#b997ff" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" letter-spacing="2">ZERO-KNOWLEDGE STORAGE</text>
  </g>

  <!-- Main Headline -->
  <text x="600" y="475" text-anchor="middle" fill="url(#textBoneGrad)" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" letter-spacing="-0.5">
    Silo — Keep What's Yours, Share What You Choose
  </text>

  <!-- Tagline -->
  <text x="600" y="520" text-anchor="middle" fill="#d0c9c4" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="400">
    Files stay private by default. Share by revocable link or direct grant.
  </text>

  <!-- Domain Identifier -->
  <text x="600" y="575" text-anchor="middle" fill="#00f575" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="3">
    SILO.APP
  </text>
</svg>
`.trim();
}

async function buildAllAssets() {
  console.log('--- Generating Doppler Theme-Aligned Silo Brand & SEO Logo Variations ---');

  const publicDir = path.resolve('public');
  const appDir = path.resolve('app');

  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });

  const svgColorSquircle = generateLogoSvg({ includeBackground: true, bgType: 'squircle' });
  const svgColorTransparent = generateLogoSvg({ includeBackground: false });
  const svgWhite = generateLogoSvg({ includeBackground: false, variant: 'white' });
  const svgSocial = generateSocialCardSvg();

  // Write Master Vector SVG files
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgColorTransparent);
  fs.writeFileSync(path.join(publicDir, 'logo-app.svg'), svgColorSquircle);
  fs.writeFileSync(path.join(publicDir, 'logo-white.svg'), svgWhite);
  fs.writeFileSync(path.join(publicDir, 'logo-mark.svg'), svgColorTransparent);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgColorSquircle);

  console.log('✓ Wrote Master SVGs to /public');

  // Generate High-Res Master PNGs
  const masterAppBuffer = await sharp(Buffer.from(svgColorSquircle)).resize(1024, 1024).png().toBuffer();
  const masterMarkBuffer = await sharp(Buffer.from(svgColorTransparent)).resize(1024, 1024).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'logo-app.png'), masterAppBuffer);
  fs.writeFileSync(path.join(publicDir, 'logo-mark.png'), masterMarkBuffer);

  // Favicons & Standard PNG Sizes
  const sizes = [
    { size: 16, name: 'favicon-16x16.png', buf: masterAppBuffer, dirs: [publicDir] },
    { size: 32, name: 'favicon-32x32.png', buf: masterAppBuffer, dirs: [publicDir] },
    { size: 48, name: 'favicon-48x48.png', buf: masterAppBuffer, dirs: [publicDir] },
    { size: 180, name: 'apple-touch-icon.png', buf: masterAppBuffer, dirs: [publicDir, appDir] },
    { size: 180, name: 'apple-touch-icon-precomposed.png', buf: masterAppBuffer, dirs: [publicDir] },
    { size: 180, name: 'apple-icon.png', buf: masterAppBuffer, dirs: [appDir] },
    { size: 192, name: 'icon-192.png', buf: masterAppBuffer, dirs: [publicDir] },
    { size: 192, name: 'android-chrome-192x192.png', buf: masterAppBuffer, dirs: [publicDir] },
    { size: 512, name: 'icon-512.png', buf: masterAppBuffer, dirs: [publicDir] },
    { size: 512, name: 'android-chrome-512x512.png', buf: masterAppBuffer, dirs: [publicDir] },
    { size: 512, name: 'icon.png', buf: masterAppBuffer, dirs: [appDir, publicDir] },
  ];

  for (const item of sizes) {
    const resized = await sharp(item.buf).resize(item.size, item.size).png().toBuffer();
    for (const d of item.dirs) {
      fs.writeFileSync(path.join(d, item.name), resized);
    }
  }

  // Favicon.ico
  const ico32Buffer = await sharp(masterAppBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico32Buffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), ico32Buffer);

  console.log('✓ Generated Favicon and PWA icons');

  // OpenGraph and Twitter Share Cards (1200x630)
  const ogBuffer = await sharp(Buffer.from(svgSocial)).resize(1200, 630).png().toBuffer();

  fs.writeFileSync(path.join(publicDir, 'og-image.png'), ogBuffer);
  fs.writeFileSync(path.join(publicDir, 'opengraph-image.png'), ogBuffer);
  fs.writeFileSync(path.join(appDir, 'opengraph-image.png'), ogBuffer);

  fs.writeFileSync(path.join(publicDir, 'twitter-image.png'), ogBuffer);
  fs.writeFileSync(path.join(appDir, 'twitter-image.png'), ogBuffer);

  console.log('✓ Generated OpenGraph and Twitter social share images (1200x630)');

  // Web App Manifest
  const manifest = {
    name: "Silo — Private File Sharing",
    short_name: "Silo",
    description: "Private file sharing app that stays private by default.",
    start_url: "/",
    display: "standalone",
    background_color: THEME.midnightPlum,
    theme_color: THEME.lavenderSpark,
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log('✓ Generated site.webmanifest and manifest.json');
  console.log('All theme-aligned branding assets generated successfully!');
}

buildAllAssets().catch(console.error);
