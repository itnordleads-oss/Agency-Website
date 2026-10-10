import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logosDir = join(__dirname, "../public/company-logos");

/** Trim transparent margins from PNG/WebP logos with excessive canvas padding. */
async function trimLogo(filename) {
  const input = join(logosDir, filename);
  const temp = join(logosDir, `_trim-${filename}`);
  const meta = await sharp(input).metadata();
  await sharp(input)
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(temp);
  const outMeta = await sharp(temp).metadata();
  const fs = await import("fs");
  fs.renameSync(temp, input);
  console.log(`${filename}: ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height}`);
}

await trimLogo("holzpol.png");
await trimLogo("parkkozijnen.png");
await trimLogo("bockelmann-holz.png");
await trimLogo("baltexport-millenium.png");
