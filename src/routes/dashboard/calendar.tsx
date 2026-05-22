import { createFileRoute } from '@tanstack/react-router'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { useState } from 'react'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ContentDrawer, type ContentItemFormData } from '../../components/ContentDrawer'
import { getItemsFn, createItemFn, updateItemFn, deleteItemFn } from '../../functions/content'
import type { ContentItem } from '../../types'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales: { 'en-US': enUS },
})

const STATUS_BG: Record<string, string> = {
  Ide: '#94a3b8',
  'Sedang Dikerjakan': '#3b82f6',
  Tinjauan: '#eab308',
  Terjadwal: '#a855f7',
  Dipublikasikan: '#22c55e',
}

export const Route = createFileRoute('/dashboard/calendar')({
  loader: () => getItemsFn({ data: {} }),
  component: CalendarView,
})

interface CalEvent {
  id: number
  title: string
  start: Date
  end: Date
  resource: ContentItem
}

function toEvents(items: ContentItem[]): CalEvent[] {
  return items.map((item) => ({
    id: item.id,
    title: `${item.platforms.join(', ')} · ${item.title}`,
    start: new Date(item.publishDate),
    end: new Date(item.publishDate),
    resource: item,
  }))
}

function CalendarView() {
  const initial = Route.useLoaderData()
  const [items, setItems] = useState<ContentItem[]>(initial)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selected, setSelected] = useState<ContentItem | null>(null)
  const [newDate, setNewDate] = useState<string | null>(null)

  async function refresh() {
    const data = await getItemsFn({ data: {} })
    setItems(data)
  }

  async function handleSave(data: ContentItemFormData) {
    if (selected) {
      await updateItemFn({ data: { id: selected.id, data } })
    } else {
      await createItemFn({ data })
    }
    await refresh()
  }

  async function handleDelete() {
    if (!selected) return
    await deleteItemFn({ data: { id: selected.id } })
    await refresh()
  }

  function handleSelectEvent(event: CalEvent) {
    setSelected(event.resource)
    setNewDate(null)
    setDrawerOpen(true)
  }

  function handleSelectSlot({ start }: { start: Date }) {
    setSelected(null)
    setNewDate(format(start, 'yyyy-MM-dd'))
    setDrawerOpen(true)
  }

  const events = toEvents(items)

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <p className="text-sm text-muted-foreground">Klik tanggal untuk menambah konten, klik acara untuk mengedit.</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(STATUS_BG).map(([status, color]) => (
            <span key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: color }} />
              {status}
            </span>
          ))}
        </div>
      </div>

      <div className="rbc-wrapper rounded-lg border overflow-hidden bg-background">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 620 }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: STATUS_BG[event.resource.status] ?? '#94a3b8',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.75rem',
              padding: '1px 6px',
            },
          })}
        />
      </div>

      <ContentDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setNewDate(null) }}
        item={selected}
        onSave={async (data) => {
          if (newDate) await handleSave({ ...data, publishDate: newDate })
          else await handleSave(data)
        }}
        onDelete={selected ? handleDelete : undefined}
      />
    </div>
  )
}
