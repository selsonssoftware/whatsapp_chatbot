/**
 * Dashboard style summary cards. `tone` picks the accent colour of the value.
 */
const TONES = {
  default: 'text-gray-900 dark:text-gray-100',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-red-600 dark:text-red-400',
  brand: 'text-brand-600 dark:text-brand-400',
}

export default function SummaryCards({ cards = [], columns = 'lg:grid-cols-4' }) {
  return (
    <div className={`grid grid-cols-2 ${columns} gap-4 mb-6`}>
      {cards.map((card) => (
        <div key={card.label} className="card">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${TONES[card.tone] || TONES.default}`}>{card.value}</p>
              {card.hint && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{card.hint}</p>}
            </div>
            {card.icon && (
              <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg shrink-0">
                <card.icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
