import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { getAuthSession } from '../lib/session'

export const loginFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ password: z.string() }))
  .handler(async ({ data }) => {
    const correct = process.env.DASHBOARD_PASSWORD
    if (!correct) throw new Error('DASHBOARD_PASSWORD env var not set')
    if (data.password !== correct) {
      return { success: false as const, error: 'Incorrect password' }
    }
    const session = await getAuthSession()
    await session.update({ authenticated: true })
    return { success: true as const }
  })

export const logoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const session = await getAuthSession()
  await session.clear()
  return { success: true }
})

export const getAuthFn = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await getAuthSession()
  return { authenticated: session.data.authenticated ?? false }
})
