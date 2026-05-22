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

export const STATUS_COLORS: Record<string, string> = {
  Ide: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'Sedang Dikerjakan': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Tinjauan: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Terjadwal: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Dipublikasikan: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

export const PRIORITY_COLORS: Record<string, string> = {
  Rendah: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Sedang: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  Tinggi: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}
