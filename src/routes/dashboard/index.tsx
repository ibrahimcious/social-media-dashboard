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
import { Button } from '../../components/ui/button'
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
  if (isBefore(pub, now)) return 'bg-red-50 dark:bg-red-950/30'
  if (isBefore(pub, addDays(now, 3))) return 'bg-yellow-50 dark:bg-yellow-950/30'
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
      header: ({ column }) => (
        <SortBtn label="Tanggal" onClick={() => column.toggleSorting()} />
      ),
      cell: ({ getValue }) => (
        <span className="text-sm whitespace-nowrap">
          {format(new Date(getValue() as string), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      accessorKey: 'platforms',
      header: 'Platform',
      cell: ({ getValue }) => (
        <div className="flex flex-wrap gap-1">
          {(getValue() as string[]).map((p) => (
            <span key={p} className="px-1.5 py-0.5 bg-muted text-muted-foreground rounded text-xs">
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
        <span className="text-sm font-medium line-clamp-2">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: 'format',
      header: 'Format', // same in ID
      cell: ({ getValue }) => <span className="text-sm">{getValue() as string}</span>,
    },
    {
      accessorKey: 'contentPillar',
      header: 'Pilar',
      cell: ({ getValue }) => <span className="text-sm">{getValue() as string}</span>,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <SortBtn label="Status" onClick={() => column.toggleSorting()} />, // same in ID
      cell: ({ getValue }) => {
        const v = getValue() as string
        return (
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[v] ?? ''}`}>
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
          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${PRIORITY_COLORS[v] ?? ''}`}>
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
          <a href={v} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 text-xs">
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <FilterBar filters={filters} onChange={handleFilterChange} />
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => { setSelected(null); setDrawerOpen(true) }}
        >
          <Plus className="w-4 h-4" /> Item Baru
        </Button>
      </div>

      <div className="rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b bg-muted/50">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap"
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
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted-foreground text-sm">
                  Belum ada konten. Klik "Item Baru" untuk menambahkan.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b last:border-0 cursor-pointer hover:bg-muted/40 transition-colors ${rowBg(row.original)}`}
                  onClick={() => { setSelected(row.original); setDrawerOpen(true) }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {items.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {items.length} item
          {' · '}
          <span className="text-red-500 dark:text-red-400">Merah</span> = terlambat
          {' · '}
          <span className="text-yellow-600 dark:text-yellow-400">Kuning</span> = jatuh tempo dalam 3 hari
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
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  )
}
