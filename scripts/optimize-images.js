import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "../public");

async function optimizeImages() {
  console.log("🖼️  Optimizing images...\n");

  const images = {
    "favicon.png": { width: 64, height: 64, quality: 90 },
    "owly.png": { width: 400, height: 400, quality: 80 },
  };

  for (const [filename, options] of Object.entries(images)) {
    const inputPath = path.join(publicDir, filename);
    const webpPath = path.join(publicDir, filename.replace(".png", ".webp"));
    const optimizedPath = path.join(
      publicDir,
      filename.replace(".png", "-opt.png"),
    );

    if (!fs.existsSync(inputPath)) {
      console.warn(`⚠️  ${filename} not found, skipping...`);
      continue;
    }

    try {
      // Genera versione WebP
      await sharp(inputPath)
        .resize(options.width, options.height, { fit: "cover", position: "center" })
        .webp({ quality: options.quality })
        .toFile(webpPath);

      const webpSize = fs.statSync(webpPath).size;

      // Genera versione PNG ottimizzata
      await sharp(inputPath)
        .resize(options.width, options.height, { fit: "cover", position: "center" })
        .png({ quality: options.quality, compressionLevel: 9 })
        .toFile(optimizedPath);

      const pngSize = fs.statSync(optimizedPath).size;
      const originalSize = fs.statSync(inputPath).size;

      console.log(`✅ ${filename}`);
      console.log(
        `   Original: ${(originalSize / 1024).toFixed(2)}KB → WebP: ${(webpSize / 1024).toFixed(2)}KB (${((1 - webpSize / originalSize) * 100).toFixed(1)}% smaller)`,
      );
      console.log(
        `   Optimized PNG: ${(pngSize / 1024).toFixed(2)}KB (${((1 - pngSize / originalSize) * 100).toFixed(1)}% smaller)\n`,
      );

      // Sostituisci il file originale con la versione ottimizzata
      fs.copyFileSync(optimizedPath, inputPath);
      fs.unlinkSync(optimizedPath);
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
    }
  }

  console.log("✨ Image optimization complete!");
}

optimizeImages().catch(console.error);
