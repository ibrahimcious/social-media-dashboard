import { createFileRoute, redirect, Link, Outlet, useRouter } from '@tanstack/react-router'
import { Moon, Sun, LogOut, LayoutList, CalendarDays } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { getAuthFn, logoutFn } from '../functions/auth'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { authenticated } = await getAuthFn()
    if (!authenticated) throw redirect({ to: '/login' })
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const router = useRouter()
  const [dark, setDark] = useState(false)

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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-base tracking-tight">Content Planner</span>
            <nav className="flex items-center gap-1">
              <Link
                to="/dashboard"
                activeOptions={{ exact: true }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors [&.active]:text-foreground [&.active]:bg-muted"
              >
                <LayoutList className="w-4 h-4" />
                Table
              </Link>
              <Link
                to="/dashboard/calendar"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors [&.active]:text-foreground [&.active]:bg-muted"
              >
                <CalendarDays className="w-4 h-4" />
                Calendar
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
