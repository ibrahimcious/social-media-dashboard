import { X } from 'lucide-react'
import { Button } from './ui/button'
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
      <Select value={filters.platform} onValueChange={(v) => set('platform', v)}>
        <SelectTrigger className="w-40 h-8 text-sm">
          <SelectValue placeholder="All platforms" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All platforms</SelectItem>
          {PLATFORMS.map((p) => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.status} onValueChange={(v) => set('status', v)}>
        <SelectTrigger className="w-36 h-8 text-sm">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All statuses</SelectItem>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>{s}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1.5">
        <span className="text-xs text-muted-foreground">From</span>
        <Input
          type="date"
          className="h-8 text-sm w-36"
          value={filters.dateFrom}
          onChange={(e) => set('dateFrom', e.target.value)}
        />
        <span className="text-xs text-muted-foreground">To</span>
        <Input
          type="date"
          className="h-8 text-sm w-36"
          value={filters.dateTo}
          onChange={(e) => set('dateTo', e.target.value)}
        />
      </div>

      {hasActive && (
        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1" onClick={reset}>
          <X className="w-3 h-3" /> Clear
        </Button>
      )}
    </div>
  )
}
