const fs = require('fs');
const sharp = require('sharp');

const downloads = [
  {src: 'https://www.oria.one/resources/oria-slides/slide-4.webp', out: 'oria-slide-4.png'},
  {src: 'https://www.oria.one/resources/oria-slides/slide-5.webp', out: 'oria-slide-5.png'},
];

async function downloadBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} failed with ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

(async () => {
  for (const item of downloads) {
    const buffer = await downloadBuffer(item.src);
    const meta = await sharp(buffer).metadata();
    if (meta.format === 'webp') {
      await sharp(buffer)
        .png({ quality: 100, compressionLevel: 0 })
        .toFile(item.out);
      console.log(`Saved ${item.out} (${meta.width}x${meta.height}, ${meta.format})`);
    } else {
      fs.writeFileSync(item.out, buffer);
      console.log(`Saved ${item.out} (${meta.width}x${meta.height}, ${meta.format})`);
    }
  }
})();
