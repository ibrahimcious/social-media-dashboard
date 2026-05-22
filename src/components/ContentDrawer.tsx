import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import {
  PLATFORMS,
  FORMATS,
  CONTENT_PILLARS,
  CTAS,
  STATUSES,
  PRIORITIES,
} from '../lib/constants'
import type { ContentItem } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  item?: ContentItem | null
  onSave: (data: ContentItemFormData) => Promise<void>
  onDelete?: () => Promise<void>
}

export interface ContentItemFormData {
  publishDate: string
  platforms: string[]
  title: string
  format: string
  contentPillar: string
  captionDraft: string
  cta: string
  assetLink: string
  status: string
  priority: string
}

const EMPTY: ContentItemFormData = {
  publishDate: new Date().toISOString().slice(0, 10),
  platforms: [],
  title: '',
  format: '',
  contentPillar: '',
  captionDraft: '',
  cta: '',
  assetLink: '',
  status: 'Ide',
  priority: 'Sedang',
}

export function ContentDrawer({ open, onClose, item, onSave, onDelete }: Props) {
  const [form, setForm] = useState<ContentItemFormData>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (item) {
      setForm({
        publishDate: item.publishDate.slice(0, 10),
        platforms: item.platforms,
        title: item.title,
        format: item.format,
        contentPillar: item.contentPillar,
        captionDraft: item.captionDraft,
        cta: item.cta,
        assetLink: item.assetLink,
        status: item.status,
        priority: item.priority,
      })
    } else {
      setForm(EMPTY)
    }
    setConfirmDelete(false)
  }, [item, open])

  function set<K extends keyof ContentItemFormData>(key: K, value: ContentItemFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function togglePlatform(p: string) {
    set(
      'platforms',
      form.platforms.includes(p) ? form.platforms.filter((x) => x !== p) : [...form.platforms, p],
    )
  }

  async function handleSave() {
    if (!form.title || !form.format || !form.contentPillar || form.platforms.length === 0) return
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try {
      await onDelete?.()
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0 bg-surface-card border-l border-hairline">
        {/* Header */}
        <SheetHeader className="px-6 py-5 border-b border-hairline">
          <SheetTitle className="font-display text-[22px] font-light tracking-[-0.22px]">
            {item ? 'Edit item konten' : 'Item konten baru'}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <Field label="Tanggal Publikasi *">
            <Input
              type="date"
              value={form.publishDate}
              onChange={(e) => set('publishDate', e.target.value)}
              className="h-11 rounded-md border-hairline-strong bg-canvas text-[15px] px-4"
            />
          </Field>

          <Field label="Platform *">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-[0.6px] border transition-colors ${
                    form.platforms.includes(p)
                      ? 'bg-ink-soft text-white border-ink-soft'
                      : 'border-hairline-strong text-muted-text hover:border-ink-soft hover:text-ink bg-transparent'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Judul / Ide *">
            <Input
              placeholder="Judul atau konsep singkat"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              className="h-11 rounded-md border-hairline-strong bg-canvas text-[15px] px-4"
            />
          </Field>

          <Field label="Format *">
            <StyledSelect
              value={form.format}
              onChange={(v) => set('format', v)}
              options={FORMATS}
              placeholder="Pilih format"
            />
          </Field>

          <Field label="Pilar Konten *">
            <StyledSelect
              value={form.contentPillar}
              onChange={(v) => set('contentPillar', v)}
              options={CONTENT_PILLARS}
              placeholder="Pilih pilar"
            />
          </Field>

          <Field label="Draf Caption">
            <Textarea
              placeholder="Tulis draf caption..."
              value={form.captionDraft}
              onChange={(e) => set('captionDraft', e.target.value)}
              rows={3}
              className="rounded-md border-hairline-strong bg-canvas text-[15px] px-4 py-3 resize-none"
            />
          </Field>

          <Field label="CTA">
            <StyledSelect
              value={form.cta}
              onChange={(v) => set('cta', v)}
              options={CTAS}
              placeholder="Pilih CTA"
            />
          </Field>

          <Field label="Tautan Aset">
            <Input
              type="url"
              placeholder="https://drive.google.com/..."
              value={form.assetLink}
              onChange={(e) => set('assetLink', e.target.value)}
              className="h-11 rounded-md border-hairline-strong bg-canvas text-[15px] px-4"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <StyledSelect
                value={form.status}
                onChange={(v) => set('status', v)}
                options={STATUSES}
                placeholder="Status"
              />
            </Field>
            <Field label="Prioritas">
              <StyledSelect
                value={form.priority}
                onChange={(v) => set('priority', v)}
                options={PRIORITIES}
                placeholder="Prioritas"
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="px-6 py-4 border-t border-hairline flex items-center justify-between gap-3">
          <div>
            {item && onDelete && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="h-9 px-4 rounded-full border border-[#dc2626] text-[#dc2626] hover:bg-[#dc2626] hover:text-white text-[14px] font-medium transition-colors disabled:opacity-50"
              >
                {confirmDelete ? (deleting ? 'Menghapus...' : 'Konfirmasi hapus') : 'Hapus'}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="h-9 px-4 rounded-full border border-hairline-strong text-ink text-[14px] font-medium hover:bg-canvas transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="h-9 px-5 rounded-full bg-ink-soft hover:bg-ink text-white text-[14px] font-medium transition-colors disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : item ? 'Simpan' : 'Buat'}
            </button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-caption-upper text-muted-text block">{label}</label>
      {children}
    </div>
  )
}

function StyledSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-11 rounded-md border-hairline-strong bg-canvas text-[15px] px-4">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-hairline shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        {options.map((o) => (
          <SelectItem key={o} value={o} className="text-[14px]">
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
