import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const url = process.env.TURSO_DATABASE_URL ?? 'file:./dev.db'
const authToken = process.env.TURSO_AUTH_TOKEN
const adapter = new PrismaLibSql({ url, authToken })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')
  await prisma.contentItem.deleteMany()

  const today = new Date()
  const day = (n: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() + n)

  await prisma.contentItem.createMany({
    data: [
      {
        publishDate: day(1),
        platforms: JSON.stringify(['Instagram', 'TikTok']),
        title: 'Behind the scenes: our morning routine',
        format: 'Reel',
        contentPillar: 'Di Balik Layar',
        captionDraft: 'Penasaran gimana pagi hari kami? 👀',
        cta: 'Ikuti',
        assetLink: '',
        status: 'Sedang Dikerjakan',
        priority: 'Tinggi',
      },
      {
        publishDate: day(3),
        platforms: JSON.stringify(['LinkedIn']),
        title: '5 tips media sosial yang benar-benar efektif di 2025',
        format: 'Carousel',
        contentPillar: 'Edukatif',
        captionDraft: 'Geser untuk lihat tips andalan tim kami →',
        cta: 'Komentar',
        assetLink: '',
        status: 'Ide',
        priority: 'Sedang',
      },
      {
        publishDate: day(-1),
        platforms: JSON.stringify(['Instagram']),
        title: 'Pengumuman peluncuran produk',
        format: 'Postingan Statis',
        contentPillar: 'Promosi',
        captionDraft: 'Sudah hadir! 🎉 Klik link di bio untuk info selengkapnya.',
        cta: 'Link di Bio',
        assetLink: '',
        status: 'Terjadwal',
        priority: 'Tinggi',
      },
    ],
  })
  console.log('✅ Seeded 3 content items')
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
