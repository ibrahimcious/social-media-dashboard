import { X } from 'lucide-react'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { PLATFORMS, STATUSES } from '../lib/constants'

export interface Filters {
  platform: string
  status: string
  dateFrom: string
  dateTo: string
}

interface Props {
  filters: Filters
  onChange: (f: Filters) => void
}

const ALL = '__all__'

export function FilterBar({ filters, onChange }: Props) {
  function set<K extends keyof Filters>(key: K, value: string) {
    onChange({ ...filters, [key]: value })
  }

  const hasActive =
    filters.platform !== ALL ||
    filters.status !== ALL ||
    filters.dateFrom ||
    filters.dateTo

  function reset() {
    onChange({ platform: ALL, status: ALL, dateFrom: '', dateTo: '' })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Platform */}
      <Select value={filters.platform} onValueChange={(v) => set('platform', v)}>
        <SelectTrigger className="h-9 w-40 rounded-full border-hairline-strong bg-surface-card text-[13px] font-medium px-4">
          <SelectValue placeholder="Semua platform" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-hairline shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <SelectItem value={ALL} className="text-[13px]">Semua platform</SelectItem>
          {PLATFORMS.map((p) => (
            <SelectItem key={p} value={p} className="text-[13px]">{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select value={filters.status} onValueChange={(v) => set('status', v)}>
        <SelectTrigger className="h-9 w-40 rounded-full border-hairline-strong bg-surface-card text-[13px] font-medium px-4">
          <SelectValue placeholder="Semua status" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border-hairline shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
          <SelectItem value={ALL} className="text-[13px]">Semua status</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s} className="text-[13px]">{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date range */}
      <div className="flex items-center gap-2">
        <span className="text-[12px] font-medium text-muted-text uppercase tracking-[0.6px]">Dari</span>
        <Input
          type="date"
          className="h-9 w-36 rounded-full border-hairline-strong bg-surface-card text-[13px] px-3"
          value={filters.dateFrom}
          onChange={(e) => set('dateFrom', e.target.value)}
        />
        <span className="text-[12px] font-medium text-muted-text uppercase tracking-[0.6px]">Sampai</span>
        <Input
          type="date"
          className="h-9 w-36 rounded-full border-hairline-strong bg-surface-card text-[13px] px-3"
          value={filters.dateTo}
          onChange={(e) => set('dateTo', e.target.value)}
        />
      </div>

      {/* Clear */}
      {hasActive && (
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 h-9 px-3 rounded-full border border-hairline-strong text-[13px] font-medium text-muted-text hover:text-ink hover:border-ink-soft transition-colors"
        >
          <X className="w-3 h-3" />
          Reset
        </button>
      )}
    </div>
  )
}
