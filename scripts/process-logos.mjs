import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logosDir = join(__dirname, "../public/company-logos");

/** Make near-white or near-solid background pixels transparent. */
async function removeSolidBackground(inputPath, outputPath, options = {}) {
  const { target = "white", threshold = 28, trim = true, maxWidth = 800 } = options;

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8Array(data);

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    let transparent = false;
    if (target === "white") {
      transparent = r >= 255 - threshold && g >= 255 - threshold && b >= 255 - threshold;
    } else if (target === "black") {
      transparent = r <= threshold && g <= threshold && b <= threshold;
    }

    if (transparent) {
      pixels[i + 3] = 0;
    }
  }

  let pipeline = sharp(pixels, {
    raw: { width, height, channels },
  }).png({ compressionLevel: 9, adaptiveFiltering: true });

  if (trim) {
    pipeline = pipeline.trim({ threshold: 10 });
  }

  if (maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.toFile(outputPath);
  const meta = await sharp(outputPath).metadata();
  console.log(`Wrote ${outputPath} (${meta.width}x${meta.height}, ${meta.format})`);
}

async function optimizePng(inputPath, outputPath, maxWidth) {
  let pipeline = sharp(inputPath).png({
    compressionLevel: 9,
    adaptiveFiltering: true,
  });

  if (maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.toFile(outputPath);
  const meta = await sharp(outputPath).metadata();
  console.log(`Wrote ${outputPath} (${meta.width}x${meta.height})`);
}

async function main() {
  // BCS — official Squarespace logo, white background
  await removeSolidBackground(
    join(logosDir, "_src/https_static1.squarespace.com_static_64c06917165e2d3ba65749b"),
    join(logosDir, "bcs-batiment.png"),
    { target: "white", threshold: 35, maxWidth: 600 }
  );

  // Edilizia — official homepage logo (edmod-redlinelight.jpeg)
  await removeSolidBackground(
    join(logosDir, "_src/edilizia-official.jpeg"),
    join(logosDir, "edilizia-moderna.png"),
    { target: "white", threshold: 35, maxWidth: 800 }
  );

  // Solartime — official SVG from archived solartime.pl (domain currently redirects)
  const solartimeSvg = join(logosDir, "_src/solartime_try_2");
  writeFileSync(join(logosDir, "solartime.svg"), readFileSync(solartimeSvg));
  console.log("Wrote solartime.svg (802x129 vector, transparent)");

  // Apex — official site logo (already transparent PNG, vertical mark)
  await optimizePng(
    join(logosDir, "_src/https_www.apexconstruction.co.uk_wp-content_uploads_2021_02_"),
    join(logosDir, "apex-construction.png"),
    256
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
