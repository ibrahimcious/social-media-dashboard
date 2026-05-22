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
        contentPillar: 'Behind the Scenes',
        captionDraft: 'Ever wondered what our mornings look like? 👀',
        cta: 'Follow',
        assetLink: '',
        status: 'In Progress',
        priority: 'High',
      },
      {
        publishDate: day(3),
        platforms: JSON.stringify(['LinkedIn']),
        title: '5 social media tips that actually work in 2025',
        format: 'Carousel',
        contentPillar: 'Educational',
        captionDraft: 'Swipe to see the tips our team swears by →',
        cta: 'Comment',
        assetLink: '',
        status: 'Idea',
        priority: 'Medium',
      },
      {
        publishDate: day(-1),
        platforms: JSON.stringify(['Instagram']),
        title: 'Product launch announcement',
        format: 'Static Post',
        contentPillar: 'Promotional',
        captionDraft: "It's here! 🎉 Tap the link in bio to learn more.",
        cta: 'Link in Bio',
        assetLink: '',
        status: 'Scheduled',
        priority: 'High',
      },
    ],
  })
  console.log('✅ Seeded 3 content items')
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
