import { createFileRoute } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Plus, ArrowUpDown, ExternalLink } from 'lucide-react'
import { FilterBar, type Filters } from '../../components/FilterBar'
import { ContentDrawer, type ContentItemFormData } from '../../components/ContentDrawer'
import { STATUS_COLORS, PRIORITY_COLORS } from '../../lib/constants'
import { getItemsFn, createItemFn, updateItemFn, deleteItemFn } from '../../functions/content'
import type { ContentItem } from '../../types'
import { format, isBefore, addDays, startOfDay } from 'date-fns'

export const Route = createFileRoute('/dashboard/')({
  loader: () => getItemsFn({ data: {} }),
  component: TableView,
})

const ALL = '__all__'

function rowBg(item: ContentItem): string {
  if (item.status === 'Dipublikasikan') return ''
  const now = startOfDay(new Date())
  const pub = startOfDay(new Date(item.publishDate))
  if (isBefore(pub, now)) return 'bg-[#fde8e8] dark:bg-[#2a0e0e]'
  if (isBefore(pub, addDays(now, 3))) return 'bg-[#fef9ec] dark:bg-[#231a07]'
  return ''
}

function TableView() {
  const initial = Route.useLoaderData()
  const [items, setItems] = useState<ContentItem[]>(initial)
  const [filters, setFilters] = useState<Filters>({ platform: ALL, status: ALL, dateFrom: '', dateTo: '' })
  const [sorting, setSorting] = useState<SortingState>([{ id: 'publishDate', desc: false }])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selected, setSelected] = useState<ContentItem | null>(null)

  async function refresh(f: Filters = filters) {
    const data = await getItemsFn({
      data: {
        platform: f.platform !== ALL ? f.platform : undefined,
        status: f.status !== ALL ? f.status : undefined,
        dateFrom: f.dateFrom || undefined,
        dateTo: f.dateTo || undefined,
      },
    })
    setItems(data)
  }

  async function handleFilterChange(f: Filters) {
    setFilters(f)
    await refresh(f)
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

  const columns: ColumnDef<ContentItem>[] = [
    {
      accessorKey: 'publishDate',
      header: ({ column }) => <SortBtn label="Tanggal" onClick={() => column.toggleSorting()} />,
      cell: ({ getValue }) => (
        <span className="text-[14px] text-body-text whitespace-nowrap tabular-nums">
          {format(new Date(getValue() as string), 'dd MMM yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'platforms',
      header: 'Platform',
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {(getValue() as string[]).map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 bg-surface-strong text-ink text-[11px] font-semibold uppercase tracking-[0.6px] rounded-full"
            >
              {p}
            </span>
          ))}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <SortBtn label="Judul / Ide" onClick={() => column.toggleSorting()} />,
      cell: ({ getValue }) => (
        <span className="text-[14px] font-medium text-ink line-clamp-2 leading-snug">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'format',
      header: 'Format',
      cell: ({ getValue }) => (
        <span className="text-[14px] text-body-text">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'contentPillar',
      header: 'Pilar',
      cell: ({ getValue }) => (
        <span className="text-[14px] text-body-text">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortBtn label="Status" onClick={() => column.toggleSorting()} />,
      cell: ({ getValue }) => {
        const v = getValue() as string
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.6px] ${STATUS_COLORS[v] ?? ''}`}>
            {v}
          </span>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: 'Prioritas',
      cell: ({ getValue }) => {
        const v = getValue() as string
        return (
          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.6px] ${PRIORITY_COLORS[v] ?? ''}`}>
            {v}
          </span>
        )
      },
    },
    {
      accessorKey: 'assetLink',
      header: 'Aset',
      cell: ({ getValue }) => {
        const v = getValue() as string
        return v ? (
          <a
            href={v}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-soft hover:text-ink underline underline-offset-2 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Tautan <ExternalLink className="w-3 h-3" />
          </a>
        ) : null
      },
      enableSorting: false,
    },
  ]

  const table = useReactTable({
    data: items,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <FilterBar filters={filters} onChange={handleFilterChange} />
        <button
          onClick={() => { setSelected(null); setDrawerOpen(true) }}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-ink-soft hover:bg-ink text-white text-[15px] font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Item Baru
        </button>
      </div>

      {/* Table card */}
      <div className="bg-surface-card border border-hairline rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.04)] overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-hairline">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.96px] text-muted-text whitespace-nowrap"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-5 py-16 text-center text-[14px] text-muted-text"
                >
                  Belum ada konten.{' '}
                  <button
                    className="underline underline-offset-2 hover:text-ink transition-colors"
                    onClick={() => { setSelected(null); setDrawerOpen(true) }}
                  >
                    Tambah item baru
                  </button>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-hairline last:border-0 cursor-pointer hover:bg-canvas transition-colors ${rowBg(row.original)}`}
                  onClick={() => { setSelected(row.original); setDrawerOpen(true) }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-5 py-3.5 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      {items.length > 0 && (
        <p className="text-[12px] text-muted-text">
          {items.length} item
          {' · '}
          <span className="text-[#dc2626]">Merah</span> = terlambat
          {' · '}
          <span className="text-[#9a5420]">Kuning</span> = jatuh tempo dalam 3 hari
        </p>
      )}

      <ContentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={selected}
        onSave={handleSave}
        onDelete={selected ? handleDelete : undefined}
      />
    </div>
  )
}

function SortBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 hover:text-ink transition-colors"
    >
      {label}
      <ArrowUpDown className="w-3 h-3 opacity-50" />
    </button>
  )
}
