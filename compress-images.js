const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, 'public');
const files = ['logo-bg.png', 'hero-bg.png', 'feature-playwright.png', 'feature-control.png'];

async function compress() {
  for (const file of files) {
    const input = path.join(publicDir, file);
    const output = path.join(publicDir, file.replace('.png', '.webp'));
    if (!fs.existsSync(input)) { console.log(`Skip: ${file}`); continue; }
    
    await sharp(input)
      .resize(1200, null, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toFile(output);
    
    const oldSize = fs.statSync(input).size;
    const newSize = fs.statSync(output).size;
    console.log(`${file}: ${(oldSize/1024).toFixed(0)}KB -> ${(newSize/1024).toFixed(0)}KB (${((1 - newSize/oldSize)*100).toFixed(0)}% smaller)`);
  }
  console.log('Done!');
}

compress().catch(console.error);
