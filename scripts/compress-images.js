const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../public/assets');

function getFiles(dir, files_) {
  files_ = files_ || [];
  const files = fs.readdirSync(dir);
  for (const i in files) {
    const name = path.join(dir, files[i]);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      const ext = path.extname(name).toLowerCase();
      if (['.png', '.jpg', '.jpeg'].includes(ext)) {
        files_.push(name);
      }
    }
  }
  return files_;
}

async function compressImages() {
  console.log('--- Starting automatic image compression ---');
  
  const allImages = getFiles(baseDir);
  console.log(`Found ${allImages.length} images to process.\n`);

  for (const inputPath of allImages) {
    const ext = path.extname(inputPath);
    const outputPath = inputPath.replace(ext, '.webp');

    console.log(`Processing: ${path.relative(baseDir, inputPath)}...`);
    
    try {
      const oldSize = fs.statSync(inputPath).size / (1024 * 1024);
      
      await sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      const newSize = fs.statSync(outputPath).size / (1024 * 1024);
      const reduction = ((1 - newSize / oldSize) * 100).toFixed(1);
      
      console.log(`  Size: ${oldSize.toFixed(2)} MB -> ${newSize.toFixed(2)} MB (${reduction}% reduction)`);
    } catch (error) {
      console.error(`  Error processing ${path.basename(inputPath)}:`, error.message);
    }
  }
  
  console.log('\n--- Compression complete ---');
}

compressImages();
