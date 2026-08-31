import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// 1. Vector Generator for Master Asymmetric Cloud Logo
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
      d="M 552 778 L 305 778 C 185 778 130 686 130 568 C 130 435 220 388 335 388 C 415 388 478 430 520 495 L 552 538 Z"
      fill="#f1f0ec"
      opacity="0.4"
    />
    <path
      d="M 552 778 L 735 778 C 830 778 872 705 872 612 C 872 522 815 492 730 492 C 660 492 602 532 570 580 L 552 612 Z"
      fill="#f1f0ec"
      opacity="0.4"
    />
    <path
      d="M 552 778 C 490 706 332 525 332 388 C 332 270 430 198 552 198 C 674 198 772 270 772 388 C 772 525 614 706 552 778 Z"
      fill="#f1f0ec"
      opacity="0.95"
    />
  </g>
</svg>`.trim();
  }

  // Full Color Master Asymmetric Cloud SVG
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="${width}" height="${height}">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="sqBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#19191d" />
      <stop offset="100%" stop-color="#0e0e11" />
    </linearGradient>

    <!-- Squircle Border Rim -->
    <linearGradient id="sqBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.02" />
    </linearGradient>

    <!-- LEFT LOBE: Large, High Purple-Magenta Cloud Puff -->
    <linearGradient id="leftLobeGrad" x1="15%" y1="10%" x2="85%" y2="90%">
      <stop offset="0%" stop-color="#7033ea" />
      <stop offset="30%" stop-color="#9333ea" />
      <stop offset="60%" stop-color="#c026d3" />
      <stop offset="85%" stop-color="#e11d48" />
      <stop offset="100%" stop-color="#f43f5e" />
    </linearGradient>

    <radialGradient id="leftLobeRadial" cx="35%" cy="52%" r="55%">
      <stop offset="0%" stop-color="#f472b6" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#d946ef" stop-opacity="0.8" />
      <stop offset="75%" stop-color="#a21caf" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#581c87" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="leftRimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f472b6" stop-opacity="0.95" />
      <stop offset="40%" stop-color="#ec4899" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#fda4af" stop-opacity="0.95" />
    </linearGradient>

    <!-- RIGHT LOBE: Smaller, Lower Cyan-Mint Capsule -->
    <linearGradient id="rightLobeGrad" x1="15%" y1="15%" x2="90%" y2="90%">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="25%" stop-color="#06b6d4" />
      <stop offset="55%" stop-color="#14b8a6" />
      <stop offset="85%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#34d399" />
    </linearGradient>

    <radialGradient id="rightLobeRadial" cx="72%" cy="60%" r="50%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#2dd4bf" stop-opacity="0.8" />
      <stop offset="75%" stop-color="#0d9488" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
    </radialGradient>

    <linearGradient id="rightRimStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#2dd4bf" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0.95" />
    </linearGradient>

    <!-- FROSTED GLASS PIN -->
    <linearGradient id="pinFrostedGlass" x1="50%" y1="0%" x2="50%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.99" />
      <stop offset="22%" stop-color="#eaedf2" stop-opacity="0.96" />
      <stop offset="50%" stop-color="#cbd5e1" stop-opacity="0.88" />
      <stop offset="72%" stop-color="#94a3b8" stop-opacity="0.65" />
      <stop offset="90%" stop-color="#cbd5e1" stop-opacity="0.78" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.92" />
    </linearGradient>

    <!-- Specular Dome -->
    <radialGradient id="pinSpecularDome" cx="50%" cy="24%" r="48%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="45%" stop-color="#ffffff" stop-opacity="0.35" />
      <stop offset="85%" stop-color="#ffffff" stop-opacity="0" />
    </radialGradient>

    <!-- Pin Edge Rim -->
    <linearGradient id="pinEdgeStroke" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.9" />
    </linearGradient>

    <!-- Drop Shadow -->
    <filter id="masterDropShadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="20" stdDeviation="26" flood-color="#000000" flood-opacity="0.65" />
    </filter>

    <clipPath id="pinClip">
      <path
        d="M 552 778
           C 490 706 332 525 332 388
           C 332 270 430 198 552 198
           C 674 198 772 270 772 388
           C 772 525 614 706 552 778
           Z"
      />
    </clipPath>
  </defs>

  ${includeBackground ? (
    bgType === 'circle'
      ? '<circle cx="512" cy="512" r="512" fill="url(#sqBgGrad)" stroke="url(#sqBorderGrad)" stroke-width="2" />'
      : '<rect width="1024" height="1024" rx="224" fill="url(#sqBgGrad)" stroke="url(#sqBorderGrad)" stroke-width="2" />'
  ) : ''}

  <!-- Master Asymmetrical Cloud-Pin Mark -->
  <g id="silo-brand-mark" filter="url(#masterDropShadow)">
    <!-- LEFT LOBE: BIGGER & TALLER PUFF -->
    <g id="left-lobe">
      <path
        d="M 552 778
           L 305 778
           C 185 778 130 686 130 568
           C 130 435 220 388 335 388
           C 415 388 478 430 520 495
           L 552 538
           Z"
        fill="url(#leftLobeGrad)"
      />
      <path
        d="M 552 778
           L 305 778
           C 185 778 130 686 130 568
           C 130 435 220 388 335 388
           C 415 388 478 430 520 495
           L 552 538
           Z"
        fill="url(#leftLobeRadial)"
      />
      <path
        d="M 552 778
           L 305 778
           C 185 778 130 686 130 568
           C 130 435 220 388 335 388
           C 415 388 478 430 520 495"
        fill="none"
        stroke="url(#leftRimStroke)"
        stroke-width="4.5"
        stroke-linecap="round"
      />
    </g>

    <!-- RIGHT LOBE: SMALLER & LOWER CAPSULE -->
    <g id="right-lobe">
      <path
        d="M 552 778
           L 735 778
           C 830 778 872 705 872 612
           C 872 522 815 492 730 492
           C 660 492 602 532 570 580
           L 552 612
           Z"
        fill="url(#rightLobeGrad)"
      />
      <path
        d="M 552 778
           L 735 778
           C 830 778 872 705 872 612
           C 872 522 815 492 730 492
           C 660 492 602 532 570 580
           L 552 612
           Z"
        fill="url(#rightLobeRadial)"
      />
      <path
        d="M 552 778
           L 735 778
           C 830 778 872 705 872 612
           C 872 522 815 492 730 492
           C 660 492 602 532 570 580"
        fill="none"
        stroke="url(#rightRimStroke)"
        stroke-width="4.5"
        stroke-linecap="round"
      />
    </g>

    <!-- FROSTED GLASS PIN TEARDROP -->
    <g id="frosted-glass-pin">
      <path
        d="M 552 778
           C 490 706 332 525 332 388
           C 332 270 430 198 552 198
           C 674 198 772 270 772 388
           C 772 525 614 706 552 778
           Z"
        fill="url(#pinFrostedGlass)"
        stroke="url(#pinEdgeStroke)"
        stroke-width="4"
      />

      <path
        d="M 552 778
           C 490 706 332 525 332 388
           C 332 270 430 198 552 198
           C 674 198 772 270 772 388
           C 772 525 614 706 552 778
           Z"
        fill="url(#pinSpecularDome)"
      />

      <g clip-path="url(#pinClip)">
        <circle cx="430" cy="620" r="180" fill="url(#leftLobeRadial)" opacity="0.45" />
        <circle cx="680" cy="640" r="160" fill="url(#rightLobeRadial)" opacity="0.45" />
      </g>
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
  console.log('--- Generating Reference-Matched Asymmetric Silo Brand Assets ---');

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
  console.log('All branding assets updated successfully!');
}

buildAllAssets().catch(console.error);
