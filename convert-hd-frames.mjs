import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const INPUT_DIR  = './website/public/frames-hd'
const OUTPUT_DIR = './website/public/frames'
const QUALITY    = 92
const CONCURRENCY = 8

const files = fs.readdirSync(INPUT_DIR).filter(f => f.endsWith('.png')).sort()
let done = 0

async function convert(file) {
  const input  = path.join(INPUT_DIR, file)
  const output = path.join(OUTPUT_DIR, file.replace('.png', '.webp'))
  await sharp(input).webp({ quality: QUALITY }).toFile(output)
  done++
  process.stdout.write(`\r${done}/${files.length} converted...`)
}

for (let i = 0; i < files.length; i += CONCURRENCY) {
  await Promise.all(files.slice(i, i + CONCURRENCY).map(convert))
}

const sample     = fs.statSync(path.join(INPUT_DIR, files[0])).size
const sampleOut  = fs.statSync(path.join(OUTPUT_DIR, files[0].replace('.png', '.webp'))).size
console.log(`\nDone!`)
console.log(`Sample: ${(sample/1024).toFixed(0)}KB PNG → ${(sampleOut/1024).toFixed(0)}KB WebP`)
console.log(`Frames are now 1920×1080 — no upscaling needed.`)
