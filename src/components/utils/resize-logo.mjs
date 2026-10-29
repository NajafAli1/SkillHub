import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const INPUT_IMAGE = path.resolve(__dirname, '../../../public/assets/logo.png')
const OUTPUT_DIR = path.resolve(__dirname, '../../../public/assets/icons')

const SIZES = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'logo-navbar.png', size: 32 },
    { name: 'logo-navbar-lg.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-512x512.png', size: 512 },
]

async function generateLogoVariants() {
    try {
        if (!fs.existsSync(INPUT_IMAGE)) {
            console.log(`Error: file tidak ditemukan ${INPUT_IMAGE}`)
            process.exit(1)
        }
        
        if (!fs.existsSync(OUTPUT_DIR)) {
            fs.mkdirSync(OUTPUT_DIR, { recursive: true })
        }

        console.log('Memproses perubahan ukuran logo')

        for (const item of SIZES) {
            const outputPath = path.join(OUTPUT_DIR, item.name)

            await sharp(INPUT_IMAGE)
            .resize(item.size, item.size, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            })
            .png({ quality: 100 })
            .toFile(outputPath)
            
            console.log(`✅ Berhasil: ${item.name}`)
        }
        
        console.log('Selesai mengubah ukuran logo')
    } catch (error) {
        console.error('Terjadi kesalahan saat pemrosesan gambar:', error)
    }
}

generateLogoVariants()