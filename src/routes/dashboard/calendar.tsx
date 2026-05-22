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

// Status colors drawn from orb palette
const STATUS_BG: Record<string, string> = {
  Ide:                '#c8c4bc',
  'Sedang Dikerjakan':'#6aadcc',
  Tinjauan:           '#e8b87c',
  Terjadwal:          '#b8a0d0',
  Dipublikasikan:     '#5fbe8a',
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
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-[14px] text-muted-text">
          Klik tanggal untuk menambah konten, klik acara untuk mengedit.
        </p>
        {/* Status legend */}
        <div className="flex flex-wrap items-center gap-4">
          {Object.entries(STATUS_BG).map(([status, color]) => (
            <span key={status} className="flex items-center gap-1.5 text-[12px] text-muted-text font-medium">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              {status}
            </span>
          ))}
        </div>
      </div>

      {/* Calendar card */}
      <div className="rbc-wrapper bg-surface-card border border-hairline rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 640 }}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: STATUS_BG[event.resource.status] ?? '#c8c4bc',
              border: 'none',
              borderRadius: '4px',
              fontSize: '0.75rem',
              padding: '2px 7px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              color: '#0c0a09',
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
