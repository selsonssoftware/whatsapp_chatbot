import { initials } from '../../utils/text.js'

const TONES = [
  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
]

const SIZES = {
  xs: 'w-7 h-7 text-[11px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
}

function toneFor(name = '') {
  const total = String(name)
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return TONES[total % TONES.length]
}

/**
 * Initials avatar with an optional presence dot.
 */
export default function Avatar({ name = '', size = 'md', presence = '', className = '' }) {
  return (
    <span className={`relative inline-flex shrink-0 ${className}`}>
      <span
        className={`inline-flex items-center justify-center rounded-full font-semibold ${SIZES[size]} ${toneFor(name)}`}
        aria-hidden="true"
      >
        {initials(name) || '?'}
      </span>
      {presence && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
            presence === 'online' ? 'bg-green-500' : 'bg-gray-400'
          }`}
          title={presence === 'online' ? 'Online' : 'Offline'}
        />
      )}
    </span>
  )
}
