import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logosDir = join(__dirname, "../public/company-logos");
const srcDir = join(logosDir, "_src");

function colorDistance(r, g, b, tr, tg, tb) {
  return Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);
}

async function removeBackgroundByColor(inputPath, outputPath, targetRgb, tolerance, maxWidth) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8Array(data);
  const [tr, tg, tb] = targetRgb;

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (colorDistance(r, g, b, tr, tg, tb) <= tolerance) {
      pixels[i + 3] = 0;
    }
  }

  let pipeline = sharp(pixels, {
    raw: { width, height, channels },
  })
    .trim({ threshold: 10 })
    .png({ compressionLevel: 9, adaptiveFiltering: true });

  if (maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.toFile(outputPath);
  const meta = await sharp(outputPath).metadata();
  console.log(`Wrote ${outputPath} (${meta.width}x${meta.height})`);
}

async function removeApexLogo(inputPath, outputPath, maxWidth) {
  const source = sharp(inputPath).ensureAlpha();
  const meta = await source.metadata();

  // The official Apex mark is a vertical asset; isolate the bottom mark area first.
  const markTop = Math.floor(meta.height * 0.55);
  const croppedHeight = meta.height - markTop;

  const { data, info } = await source
    .extract({ left: 0, top: markTop, width: meta.width, height: croppedHeight })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = new Uint8Array(data);

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const isLogoMark = r >= 238 && g >= 238 && b >= 238;

    if (!isLogoMark) {
      pixels[i + 3] = 0;
    }
  }

  let pipeline = sharp(pixels, {
    raw: { width, height, channels },
  })
    .trim({ threshold: 20 })
    .png({ compressionLevel: 9, adaptiveFiltering: true });

  if (maxWidth) {
    pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
  }

  await pipeline.toFile(outputPath);
  const outMeta = await sharp(outputPath).metadata();
  console.log(`Wrote ${outputPath} (${outMeta.width}x${outMeta.height})`);
}

async function main() {
  // Official horizontal logo from kovotvar.info header (green #007845 background)
  await removeBackgroundByColor(
    join(srcDir, "kovotvar-logo.jpg"),
    join(logosDir, "kovotvar.png"),
    [0, 120, 69],
    45,
    560
  );

  // Official site logo from apexconstruction.co.uk (orange #f9a75e background)
  await removeApexLogo(
    join(srcDir, "apex-source.png"),
    join(logosDir, "apex-construction.png"),
    180
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
