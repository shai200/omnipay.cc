const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const iconsDir = path.join(__dirname, 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create a simple SVG with gradient background and text
const svgIcon = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad)"/>
  <circle cx="256" cy="256" r="180" fill="#ffffff" opacity="0.1"/>
  <text x="256" y="300" font-size="120" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">OP</text>
</svg>
`;

const svgMaskable = `
<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad)"/>
  <circle cx="256" cy="256" r="150" fill="white"/>
  <text x="256" y="300" font-size="90" font-weight="bold" fill="#3b82f6" text-anchor="middle" font-family="Arial">OP</text>
</svg>
`;

const screenshotWide = `
<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1280" height="720" fill="url(#grad)"/>
  <text x="640" y="250" font-size="80" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">Omnipay.cc</text>
  <text x="640" y="350" font-size="40" fill="white" text-anchor="middle" font-family="Arial">Fiat to Crypto Gateway</text>
</svg>
`;

const screenshotNarrow = `
<svg width="540" height="720" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="540" height="720" fill="url(#grad)"/>
  <text x="270" y="280" font-size="60" font-weight="bold" fill="white" text-anchor="middle" font-family="Arial">Omnipay.cc</text>
  <text x="270" y="360" font-size="24" fill="white" text-anchor="middle" font-family="Arial">Fiat to Crypto</text>
</svg>
`;

async function generateIcons() {
  try {
    console.log('Generating PWA icons...');

    // 192x192 icon
    await sharp(Buffer.from(svgIcon))
      .resize(192, 192)
      .png()
      .toFile(path.join(iconsDir, 'icon-192x192.png'));
    console.log('✓ Created icon-192x192.png');

    // 512x512 icon
    await sharp(Buffer.from(svgIcon))
      .resize(512, 512)
      .png()
      .toFile(path.join(iconsDir, 'icon-512x512.png'));
    console.log('✓ Created icon-512x512.png');

    // 192x192 maskable icon
    await sharp(Buffer.from(svgMaskable))
      .resize(192, 192)
      .png()
      .toFile(path.join(iconsDir, 'icon-maskable-192x192.png'));
    console.log('✓ Created icon-maskable-192x192.png');

    // 512x512 maskable icon
    await sharp(Buffer.from(svgMaskable))
      .resize(512, 512)
      .png()
      .toFile(path.join(iconsDir, 'icon-maskable-512x512.png'));
    console.log('✓ Created icon-maskable-512x512.png');

    // 540x720 narrow screenshot
    await sharp(Buffer.from(screenshotNarrow))
      .resize(540, 720)
      .png()
      .toFile(path.join(iconsDir, 'screenshot-1.png'));
    console.log('✓ Created screenshot-1.png');

    // 1280x720 wide screenshot
    await sharp(Buffer.from(screenshotWide))
      .resize(1280, 720)
      .png()
      .toFile(path.join(iconsDir, 'screenshot-2.png'));
    console.log('✓ Created screenshot-2.png');

    console.log('\n✅ All PWA icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
