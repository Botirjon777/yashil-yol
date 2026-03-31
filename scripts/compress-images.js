const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = path.join(__dirname, '../public/assets/home');
const outputDir = inputDir;

const files = [
  { name: 'hero-bg.png', output: 'hero-bg.webp' },
  { name: 'cto-bg.png', output: 'cto-bg.webp' }
];

async function compressImages() {
  console.log('Starting image compression...');

  for (const file of files) {
    const inputPath = path.join(inputDir, file.name);
    const outputPath = path.join(outputDir, file.output);

    if (fs.existsSync(inputPath)) {
      console.log(`Compressing ${file.name}...`);
      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        
        const oldSize = fs.statSync(inputPath).size / (1024 * 1024);
        const newSize = fs.statSync(outputPath).size / (1024 * 1024);
        
        console.log(`Successfully compressed ${file.name}:`);
        console.log(`  Original: ${oldSize.toFixed(2)} MB`);
        console.log(`  Compressed (WebP): ${newSize.toFixed(2)} MB`);
        console.log(`  Reduction: ${((1 - newSize / oldSize) * 100).toFixed(1)}%`);
      } catch (error) {
        console.error(`Error compressing ${file.name}:`, error);
      }
    } else {
      console.warn(`File not found: ${inputPath}`);
    }
  }
}

compressImages();
