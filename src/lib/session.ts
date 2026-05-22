import { useSession } from '@tanstack/react-start/server'

export interface SessionData {
  authenticated?: boolean
}

function sessionConfig() {
  const password = process.env.SESSION_SECRET
  if (!password || password.length < 32) {
    throw new Error('SESSION_SECRET env var must be at least 32 characters')
  }
  return {
    password,
    name: 'sm_session',
    maxAge: 60 * 60 * 24 * 30,
  }
}

export async function getAuthSession() {
  const session = await useSession<SessionData>(sessionConfig())
  return session
}
