import { createFileRoute, redirect, Link, Outlet, useRouter } from '@tanstack/react-router'
import { Moon, Sun, LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale/id'
import { getAuthFn, logoutFn } from '../functions/auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { authenticated } = await getAuthFn()
    if (!authenticated) throw redirect({ to: '/login' })
  },
  component: DashboardLayout,
})

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function DashboardLayout() {
  const router = useRouter()
  const [dark, setDark] = useState(false)
  const now = useClock()

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggleTheme() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  async function handleLogout() {
    await logoutFn()
    await router.invalidate()
    router.navigate({ to: '/login' })
  }

  const dateStr = format(now, 'EEEE, d MMMM yyyy', { locale: id })
  const timeStr = format(now, 'HH:mm:ss')

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <header className="sticky top-0 z-10 bg-canvas border-b border-hairline">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">

          {/* Left — logo + nav */}
          <div className="flex items-center gap-8">
            <img
              src="/BKAD_LOGO.png"
              alt="BKAD"
              className="h-8 w-auto object-contain dark:brightness-[1.15]"
            />
            <nav className="flex items-center gap-1">
              <Link
                to="/dashboard"
                activeOptions={{ exact: true }}
                className="px-3 py-1.5 text-[15px] font-medium text-muted-text hover:text-ink transition-colors [&.active]:text-ink"
              >
                Tabel
              </Link>
              <Link
                to="/dashboard/calendar"
                className="px-3 py-1.5 text-[15px] font-medium text-muted-text hover:text-ink transition-colors [&.active]:text-ink"
              >
                Kalender
              </Link>
            </nav>
          </div>

          {/* Right — clock + actions */}
          <div className="flex items-center gap-4">
            {/* Live clock */}
            <div className="hidden sm:flex flex-col items-end leading-tight">
              <span className="text-[12px] font-medium text-muted-text capitalize">{dateStr}</span>
              <span className="text-[15px] font-semibold text-ink tabular-nums tracking-tight">{timeStr}</span>
            </div>

            <div className="w-px h-5 bg-hairline hidden sm:block" />

            <button
              onClick={toggleTheme}
              aria-label="Ganti tema"
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted-text hover:text-ink hover:bg-surface-strong transition-colors"
            >
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={handleLogout}
              aria-label="Keluar"
              className="w-9 h-9 flex items-center justify-center rounded-full text-muted-text hover:text-ink hover:bg-surface-strong transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
