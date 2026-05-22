export const PLATFORMS = ['Instagram', 'TikTok', 'Twitter/X', 'LinkedIn', 'YouTube', 'Facebook']

export const FORMATS = ['Reel', 'Carousel', 'Static Post', 'Story', 'Thread', 'Short', 'Video']

export const CONTENT_PILLARS = [
  'Educational',
  'Inspirational',
  'Promotional',
  'Behind the Scenes',
  'Entertainment',
]

export const CTAS = ['Follow', 'Link in Bio', 'Comment', 'Share', 'DM', 'Visit Website']

export const STATUSES = ['Idea', 'In Progress', 'Review', 'Scheduled', 'Published']

export const PRIORITIES = ['Low', 'Medium', 'High']

export const STATUS_COLORS: Record<string, string> = {
  Idea: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'In Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Review: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
  Scheduled: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Published: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
}

export const PRIORITY_COLORS: Record<string, string> = {
  Low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  High: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
}
