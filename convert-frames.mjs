import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const INPUT_DIR = './frames 1/ali'
const OUTPUT_DIR = './frames-webp'
const QUALITY = 90
const CONCURRENCY = 8

fs.mkdirSync(OUTPUT_DIR, { recursive: true })

const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.png'))
let done = 0

async function convert(file) {
  const input = path.join(INPUT_DIR, file)
  const output = path.join(OUTPUT_DIR, file.replace('.png', '.webp'))
  await sharp(input).webp({ quality: QUALITY }).toFile(output)
  done++
  process.stdout.write(`\r${done}/${files.length} converted...`)
}

// Process in batches
for (let i = 0; i < files.length; i += CONCURRENCY) {
  const batch = files.slice(i, i + CONCURRENCY)
  await Promise.all(batch.map(convert))
}

console.log(`\nDone! WebP frames saved to ${OUTPUT_DIR}`)

// Show size comparison
const samplePng = fs.statSync(path.join(INPUT_DIR, files[0])).size
const sampleWebp = fs.statSync(path.join(OUTPUT_DIR, files[0].replace('.png', '.webp'))).size
console.log(`Sample: ${(samplePng/1024/1024).toFixed(1)}MB PNG → ${(sampleWebp/1024).toFixed(0)}KB WebP`)
