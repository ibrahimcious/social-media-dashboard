import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale/id'
import { loginFn, getAuthFn } from '../functions/auth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const { authenticated } = await getAuthFn()
    if (authenticated) throw redirect({ to: '/dashboard' })
  },
  component: LoginPage,
})

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  return now
}

function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const now = useClock()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await loginFn({ data: { password } })
    if (result.success) {
      await router.invalidate()
      router.navigate({ to: '/dashboard' })
    } else {
      setError(result.error ?? 'Kata sandi salah')
      setLoading(false)
    }
  }

  const dateStr = format(now, 'EEEE, d MMMM yyyy', { locale: id })
  const timeStr = format(now, 'HH:mm:ss')

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-canvas overflow-hidden">
      {/* Atmospheric orbs */}
      <div className="orb orb-mint opacity-50 w-[480px] h-[480px] -top-32 -right-24" />
      <div className="orb orb-peach opacity-40 w-[360px] h-[360px] -bottom-20 -left-20" />
      <div className="orb orb-lavender opacity-30 w-[280px] h-[280px] top-1/2 left-1/4" />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Card */}
        <div className="bg-surface-card border border-hairline rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/BKAD_LOGO.png"
              alt="BKAD"
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Live clock */}
          <div className="text-center mb-8 space-y-0.5">
            <p className="text-[28px] font-semibold text-ink tabular-nums tracking-tight leading-none">
              {timeStr}
            </p>
            <p className="text-[13px] text-muted-text capitalize">{dateStr}</p>
          </div>

          <div className="border-t border-hairline mb-6" />

          <div className="space-y-2 text-center mb-6">
            <h1 className="text-display-sm">Perencana Konten</h1>
            <p className="text-[14px] text-muted-text leading-relaxed">
              Masukkan kata sandi tim untuk melanjutkan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-caption-upper text-muted-text">
                Kata Sandi
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoFocus
                className="h-11 rounded-md border border-hairline-strong bg-surface-card px-4 text-[15px] focus-visible:ring-1 focus-visible:ring-ink-soft focus-visible:border-ink-soft"
              />
            </div>

            {error && (
              <p className="text-[13px] text-[#dc2626]">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-full bg-ink-soft hover:bg-ink text-white text-[15px] font-medium tracking-[0] transition-colors"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
