import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Used for local migrations; production uses Turso adapter in PrismaClient
    url: process.env.TURSO_DATABASE_URL ?? 'file:./dev.db',
  },
})
