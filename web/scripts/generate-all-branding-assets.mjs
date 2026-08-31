import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Vector Generator for Master Match & Monochrome Variants
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
      ? '<circle cx="512" cy="512" r="512" fill="#18181b" />'
      : '<rect width="1024" height="1024" rx="224" fill="#18181b" />'
  ) : ''}
  <g id="silo-logo-white">
    <path
      d="M 512 778 L 305 778 C 190 778 120 682 120 560 C 120 438 212 372 328 372 C 400 372 462 408 498 468 L 512 505 Z"
      fill="#f1f0ec"
      opacity="0.4"
    />
    <path
      d="M 512 778 L 719 778 C 834 778 904 682 904 560 C 904 438 812 372 696 372 C 624 372 562 408 526 468 L 512 505 Z"
      fill="#f1f0ec"
      opacity="0.4"
    />
    <path
      d="M 512 778 C 460 706 322 530 322 388 C 322 278 406 188 512 188 C 618 188 702 278 702 388 C 702 530 564 706 512 778 Z"
      fill="#f1f0ec"
      opacity="0.95"
    />
  </g>
</svg>`.trim();
  }

  // Full Color Master SVG
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${width}" height="${height}">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="sqBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#0f0f11" />
    </linearGradient>

    <!-- Squircle Subtle Rim Light -->
    <linearGradient id="sqBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
    </linearGradient>

    <!-- LEFT LOBE: Rich Purple to Hot Magenta Gradient -->
    <linearGradient id="leftLobeGrad" x1="20%" y1="10%" x2="80%" y2="90%">
      <stop offset="0%" stop-color="#7c3aed" />
      <stop offset="25%" stop-color="#9333ea" />
      <stop offset="50%" stop-color="#c026d3" />
      <stop offset="80%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#f43f5e" />
    </linearGradient>

    <!-- Left Lobe Volumetric Radial Glow -->
    <radialGradient id="leftLobeRadial" cx="38%" cy="50%" r="58%">
      <stop offset="0%" stop-color="#f472b6" stop-opacity="0.9" />
      <stop offset="45%" stop-color="#d946ef" stop-opacity="0.8" />
      <stop offset="80%" stop-color="#a21caf" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#581c87" stop-opacity="0" />
    </radialGradient>

    <!-- Left Lobe Glowing Rim Highlight -->
    <linearGradient id="leftRimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f472b6" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#ec4899" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#fda4af" stop-opacity="0.95" />
    </linearGradient>

    <!-- RIGHT LOBE: Vibrant Cyan to Mint/Emerald Gradient -->
    <linearGradient id="rightLobeGrad" x1="15%" y1="15%" x2="90%" y2="90%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="25%" stop-color="#06b6d4" />
      <stop offset="55%" stop-color="#14b8a6" />
      <stop offset="85%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <!-- Right Lobe Volumetric Radial Glow -->
    <radialGradient id="rightLobeRadial" cx="62%" cy="50%" r="58%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.9" />
      <stop offset="45%" stop-color="#2dd4bf" stop-opacity="0.8" />
      <stop offset="80%" stop-color="#0d9488" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
    </radialGradient>

    <!-- Right Lobe Glowing Rim Highlight -->
    <linearGradient id="rightRimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#2dd4bf" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0.95" />
    </linearGradient>

    <!-- FROSTED GLASS PIN: Volumetric Silvery Glass Gradient -->
    <linearGradient id="pinFrostedGlass" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.98" />
      <stop offset="20%" stop-color="#e8ecf1" stop-opacity="0.94" />
      <stop offset="45%" stop-color="#cbd5e1" stop-opacity="0.85" />
      <stop offset="70%" stop-color="#94a3b8" stop-opacity="0.55" />
      <stop offset="92%" stop-color="#cbd5e1" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.9" />
    </linearGradient>

    <!-- Pin Top Specular Dome Highlight -->
    <radialGradient id="pinSpecularDome" cx="50%" cy="26%" r="48%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0.3" />
      <stop offset="85%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>

    <!-- Pin Fine Specular Edge Border -->
    <linearGradient id="pinEdgeStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.9" />
    </linearGradient>

    <!-- Soft Ambient Drop Shadow -->
    <filter id="masterDropShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#000000" flood-opacity="0.65" />
    </filter>
  </defs>

  ${includeBackground ? (
    bgType === 'circle'
      ? '<circle cx="512" cy="512" r="512" fill="url(#sqBgGrad)" stroke="url(#sqBorderGrad)" stroke-width="2" />'
      : '<rect width="1024" height="1024" rx="224" fill="url(#sqBgGrad)" stroke="url(#sqBorderGrad)" stroke-width="2" />'
  ) : ''}

  <!-- Master Cloud-Pin Mark -->
  <g id="silo-brand-mark" filter="url(#masterDropShadow)">
    <!-- LEFT LOBE (Purple / Magenta / Fuchsia Capsule) -->
    <g id="left-lobe">
      <path
        d="M 512 778 
           L 305 778 
           C 190 778 120 682 120 560 
           C 120 438 212 372 328 372 
           C 400 372 462 408 498 468 
           L 512 505 
           Z"
        fill="url(#leftLobeGrad)"
      />
      <path
        d="M 512 778 
           L 305 778 
           C 190 778 120 682 120 560 
           C 120 438 212 372 328 372 
           C 400 372 462 408 498 468 
           L 512 505 
           Z"
        fill="url(#leftLobeRadial)"
      />
      <path
        d="M 512 778 
           L 305 778 
           C 190 778 120 682 120 560 
           C 120 438 212 372 328 372 
           C 400 372 462 408 498 468"
        fill="none"
        stroke="url(#leftRimStroke)"
        stroke-width="4.5"
        stroke-linecap="round"
      />
    </g>

    <!-- RIGHT LOBE (Cyan / Teal / Emerald Capsule) -->
    <g id="right-lobe">
      <path
        d="M 512 778 
           L 719 778 
           C 834 778 904 682 904 560 
           C 904 438 812 372 696 372 
           C 624 372 562 408 526 468 
           L 512 505 
           Z"
        fill="url(#rightLobeGrad)"
      />
      <path
        d="M 512 778 
           L 719 778 
           C 834 778 904 682 904 560 
           C 904 438 812 372 696 372 
           C 624 372 562 408 526 468 
           L 512 505 
           Z"
        fill="url(#rightLobeRadial)"
      />
      <path
        d="M 512 778 
           L 719 778 
           C 834 778 904 682 904 560 
           C 904 438 812 372 696 372 
           C 624 372 562 408 526 468"
        fill="none"
        stroke="url(#rightRimStroke)"
        stroke-width="4.5"
        stroke-linecap="round"
      />
    </g>

    <!-- FROSTED GLASS PIN TEARDROP (Center Overlay) -->
    <g id="frosted-glass-pin">
      <path
        d="M 512 778
           C 460 706 322 530 322 388
           C 322 278 406 188 512 188
           C 618 188 702 278 702 388
           C 702 530 564 706 512 778
           Z"
        fill="url(#pinFrostedGlass)"
        stroke="url(#pinEdgeStroke)"
        stroke-width="4"
      />

      <path
        d="M 512 778
           C 460 706 322 530 322 388
           C 322 278 406 188 512 188
           C 618 188 702 278 702 388
           C 702 530 564 706 512 778
           Z"
        fill="url(#pinSpecularDome)"
      />

      <path
        d="M 512 778
           C 485 738 410 636 390 560
           C 425 615 470 690 512 778
           Z"
        fill="url(#leftLobeGrad)"
        opacity="0.38"
      />
      <path
        d="M 512 778
           C 539 738 614 636 634 560
           C 599 615 554 690 512 778
           Z"
        fill="url(#rightLobeGrad)"
        opacity="0.38"
      />
    </g>
  </g>
</svg>
`.trim();
}

// 2. OpenGraph / Twitter Social Share Card Generator (1200x630)
export function generateSocialCardSvg() {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="ogBg" cx="50%" cy="35%" r="85%">
      <stop offset="0%" stop-color="#241b32" />
      <stop offset="50%" stop-color="#16131f" />
      <stop offset="100%" stop-color="#0c0a12" />
    </radialGradient>

    <radialGradient id="ogVioletAurora" cx="30%" cy="40%" r="45%">
      <stop offset="0%" stop-color="#9333ea" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#c026d3" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#16131f" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="ogGreenAurora" cx="70%" cy="40%" r="45%">
      <stop offset="0%" stop-color="#00f575" stop-opacity="0.28" />
      <stop offset="60%" stop-color="#06b6d4" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#16131f" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="textBoneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="60%" stop-color="#f1f0ec" />
      <stop offset="100%" stop-color="#d0c9c4" />
    </linearGradient>

    <linearGradient id="badgeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c026d3" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#00f575" stop-opacity="0.7" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)" />

  <circle cx="340" cy="240" r="420" fill="url(#ogVioletAurora)" />
  <circle cx="860" cy="240" r="420" fill="url(#ogGreenAurora)" />

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

  <!-- Security Badge -->
  <g transform="translate(600, 395)">
    <rect x="-155" y="-18" width="310" height="36" rx="18" fill="#241b32" stroke="url(#badgeBorder)" stroke-width="1.5" />
    <circle cx="-130" cy="0" r="4" fill="#00f575" />
    <text text-anchor="middle" x="10" y="5" fill="#c026d3" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" letter-spacing="2">ZERO-KNOWLEDGE STORAGE</text>
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
  console.log('--- Generating Reference-Matched Silo Brand & SEO Logo Variations ---');

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
    background_color: "#18181b",
    theme_color: "#c026d3",
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
  console.log('All branding assets updated successfully!');
}

buildAllAssets().catch(console.error);
