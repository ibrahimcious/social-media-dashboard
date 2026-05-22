export const PLATFORMS = ['Instagram', 'TikTok', 'Twitter/X', 'LinkedIn', 'YouTube', 'Facebook']

export const FORMATS = ['Reel', 'Carousel', 'Postingan Statis', 'Story', 'Thread', 'Short', 'Video']

export const CONTENT_PILLARS = [
  'Edukatif',
  'Inspiratif',
  'Promosi',
  'Di Balik Layar',
  'Hiburan',
]

export const CTAS = ['Ikuti', 'Link di Bio', 'Komentar', 'Bagikan', 'DM', 'Kunjungi Website']

export const STATUSES = ['Ide', 'Sedang Dikerjakan', 'Tinjauan', 'Terjadwal', 'Dipublikasikan']

export const PRIORITIES = ['Rendah', 'Sedang', 'Tinggi']

// Soft pastel tones drawn from the gradient-orb palette
export const STATUS_COLORS: Record<string, string> = {
  Ide:                '[background-color:#f0efed] [color:#777169] dark:[background-color:#292524] dark:[color:#a8a29e]',
  'Sedang Dikerjakan':'[background-color:#dceef8] [color:#1a6896] dark:[background-color:#0d2535] dark:[color:#7ec8e8]',
  Tinjauan:           '[background-color:#fceee4] [color:#9a5420] dark:[background-color:#2a1a0e] dark:[color:#f4c5a8]',
  Terjadwal:          '[background-color:#ede8f5] [color:#6244a0] dark:[background-color:#1e1630] dark:[color:#c8b8e0]',
  Dipublikasikan:     '[background-color:#e4f5ec] [color:#16a34a] dark:[background-color:#0d2318] dark:[color:#4ade80]',
}

export const PRIORITY_COLORS: Record<string, string> = {
  Rendah: '[background-color:#f0efed] [color:#777169] dark:[background-color:#292524] dark:[color:#a8a29e]',
  Sedang: '[background-color:#fceee4] [color:#9a5420] dark:[background-color:#2a1a0e] dark:[color:#f4c5a8]',
  Tinggi: '[background-color:#fde8e8] [color:#dc2626] dark:[background-color:#2a0e0e] dark:[color:#f87171]',
}
