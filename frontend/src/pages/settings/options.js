export const TIMEZONES = [
  { value: 'Asia/Kolkata', label: '(GMT+05:30) India Standard Time (IST)' },
  { value: 'UTC', label: '(GMT+00:00) UTC' },
  { value: 'Europe/London', label: '(GMT+00:00) London' },
  { value: 'Asia/Dubai', label: '(GMT+04:00) Dubai' },
  { value: 'Asia/Singapore', label: '(GMT+08:00) Singapore' },
  { value: 'America/New_York', label: '(GMT-05:00) Eastern Time (US & Canada)' },
  { value: 'America/Los_Angeles', label: '(GMT-08:00) Pacific Time (US & Canada)' },
]

export const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'].map((v) => ({ value: v, label: v }))

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'Tamil' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
]

export const INDUSTRIES = ['E-commerce', 'Retail', 'Healthcare', 'Education', 'Finance', 'Real Estate', 'Services', 'Other'].map(
  (v) => ({ value: v, label: v })
)

// WhatsApp template language codes
export const MESSAGE_LANGUAGES = [
  { value: 'en_US', label: 'English (en_US)' },
  { value: 'en_GB', label: 'English UK (en_GB)' },
  { value: 'ta', label: 'Tamil (ta)' },
  { value: 'hi', label: 'Hindi (hi)' },
  { value: 'es_ES', label: 'Spanish (es_ES)' },
  { value: 'fr_FR', label: 'French (fr_FR)' },
]

export const ASSIGNMENT_STRATEGIES = [
  { value: 'round_robin', label: 'Round robin' },
  { value: 'load_balanced', label: 'Load balanced' },
  { value: 'manual', label: 'Manual only' },
]

// Retention: value = months, null = keep forever
export const RETENTION_MONTHS = [3, 6, 12, 24]
