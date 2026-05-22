import { useState, useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from './ui/sheet'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
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
  status: 'Idea',
  priority: 'Medium',
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
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>{item ? 'Edit content item' : 'New content item'}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {/* Publish Date */}
          <Field label="Publish Date *">
            <Input
              type="date"
              value={form.publishDate}
              onChange={(e) => set('publishDate', e.target.value)}
            />
          </Field>

          {/* Platform multi-select */}
          <Field label="Platform *">
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    form.platforms.includes(p)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-foreground'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Field>

          {/* Title */}
          <Field label="Title / Idea *">
            <Input
              placeholder="Working title or one-liner concept"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </Field>

          {/* Format */}
          <Field label="Format *">
            <SimpleSelect
              value={form.format}
              onChange={(v) => set('format', v)}
              options={FORMATS}
              placeholder="Select format"
            />
          </Field>

          {/* Content Pillar */}
          <Field label="Content Pillar *">
            <SimpleSelect
              value={form.contentPillar}
              onChange={(v) => set('contentPillar', v)}
              options={CONTENT_PILLARS}
              placeholder="Select pillar"
            />
          </Field>

          {/* Caption Draft */}
          <Field label="Caption Draft">
            <Textarea
              placeholder="Draft caption..."
              value={form.captionDraft}
              onChange={(e) => set('captionDraft', e.target.value)}
              rows={3}
            />
          </Field>

          {/* CTA */}
          <Field label="CTA">
            <SimpleSelect
              value={form.cta}
              onChange={(v) => set('cta', v)}
              options={CTAS}
              placeholder="Select CTA"
            />
          </Field>

          {/* Asset Link */}
          <Field label="Asset Link">
            <Input
              type="url"
              placeholder="https://drive.google.com/..."
              value={form.assetLink}
              onChange={(e) => set('assetLink', e.target.value)}
            />
          </Field>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <SimpleSelect
                value={form.status}
                onChange={(v) => set('status', v)}
                options={STATUSES}
                placeholder="Status"
              />
            </Field>
            <Field label="Priority">
              <SimpleSelect
                value={form.priority}
                onChange={(v) => set('priority', v)}
                options={PRIORITIES}
                placeholder="Priority"
              />
            </Field>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t flex items-center justify-between gap-2">
          <div>
            {item && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {confirmDelete ? (deleting ? 'Deleting…' : 'Confirm delete') : 'Delete'}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : item ? 'Save changes' : 'Create'}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  )
}

function SimpleSelect({
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
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
