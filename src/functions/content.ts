import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { prisma } from '../db'
import { getAuthSession } from '../lib/session'

async function requireAuth() {
  const session = await getAuthSession()
  if (!session.data.authenticated) throw new Error('Unauthorized')
}

export const ContentItemSchema = z.object({
  publishDate: z.string(),
  platforms: z.array(z.string()).min(1),
  title: z.string().min(1),
  format: z.string().min(1),
  contentPillar: z.string().min(1),
  captionDraft: z.string().default(''),
  cta: z.string().default(''),
  assetLink: z.string().default(''),
  status: z.string().default('Idea'),
  priority: z.string().default('Medium'),
})

export type ContentItemInput = z.infer<typeof ContentItemSchema>

const FiltersSchema = z.object({
  platform: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

function serialize(item: {
  id: number
  publishDate: Date
  platforms: string
  title: string
  format: string
  contentPillar: string
  captionDraft: string
  cta: string
  assetLink: string
  status: string
  priority: string
  createdAt: Date
  updatedAt: Date
}) {
  return {
    ...item,
    platforms: JSON.parse(item.platforms) as string[],
    publishDate: item.publishDate.toISOString(),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

export const getItemsFn = createServerFn({ method: 'GET' })
  .inputValidator(FiltersSchema)
  .handler(async ({ data }) => {
    await requireAuth()
    const where: Record<string, unknown> = {}
    if (data.status) where.status = data.status
    if (data.dateFrom || data.dateTo) {
      where.publishDate = {
        ...(data.dateFrom ? { gte: new Date(data.dateFrom) } : {}),
        ...(data.dateTo ? { lte: new Date(data.dateTo) } : {}),
      }
    }
    const items = await prisma.contentItem.findMany({
      where,
      orderBy: { publishDate: 'asc' },
    })
    const filtered = data.platform
      ? items.filter((item) => {
          const platforms: string[] = JSON.parse(item.platforms)
          return platforms.includes(data.platform!)
        })
      : items
    return filtered.map(serialize)
  })

export const createItemFn = createServerFn({ method: 'POST' })
  .inputValidator(ContentItemSchema)
  .handler(async ({ data }) => {
    await requireAuth()
    const item = await prisma.contentItem.create({
      data: {
        ...data,
        platforms: JSON.stringify(data.platforms),
        publishDate: new Date(data.publishDate),
      },
    })
    return serialize(item)
  })

export const updateItemFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number(), data: ContentItemSchema }))
  .handler(async ({ data: { id, data } }) => {
    await requireAuth()
    const item = await prisma.contentItem.update({
      where: { id },
      data: {
        ...data,
        platforms: JSON.stringify(data.platforms),
        publishDate: new Date(data.publishDate),
      },
    })
    return serialize(item)
  })

export const deleteItemFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await requireAuth()
    await prisma.contentItem.delete({ where: { id: data.id } })
    return { success: true }
  })
