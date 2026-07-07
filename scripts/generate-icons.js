/**
 * Genera íconos básicos para PWA.
 * Requiere Node.js 18+ (canvas nativo no necesario — crea SVG simples).
 *
 * Uso: node scripts/generate-icons.js
 */
const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.join(__dirname, "..", "public", "icons");

function generateSVGIcon(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#d4a853"/>
      <stop offset="100%" style="stop-color:#b38a3a"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#bg)"/>
  <text x="${size / 2}" y="${size * 0.65}" text-anchor="middle"
        font-family="Georgia, serif" font-size="${size * 0.5}"
        font-weight="bold" fill="#121216">C</text>
</svg>`;
}

function svgToPngDataUri(svg) {
  return "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64");
}

async function main() {
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  const sizes = [192, 512];

  for (const size of sizes) {
    const svg = generateSVGIcon(size);
    const filePath = path.join(ICONS_DIR, `icon-${size}.png`);

    // Since we can't easily convert SVG to PNG without sharp/canvas,
    // we write an SVG that browsers can use as a PNG fallback.
    // For a real deployment, replace with sharp.
    fs.writeFileSync(
      filePath.replace(".png", ".svg"),
      svg,
      "utf-8"
    );
    // Write a minimal valid PNG header as placeholder.
    // In production, use a real icon generator with sharp.
    const pngData = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    fs.writeFileSync(filePath, pngData);
    console.log(`✔ ${path.basename(filePath)} (${size}x${size})`);
  }

  console.log("Iconos generados en public/icons/");
  console.log("Reemplácelos con íconos reales antes de producción.");
}

main().catch(console.error);
