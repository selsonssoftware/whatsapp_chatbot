import Button from './Button.jsx'
import Icon from './Icon.jsx'

/**
 * Client side pagination controls.
 */
export default function Pagination({ currentPage, totalPages, onChange, itemLabel = 'rows' }) {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label={`Previous page of ${itemLabel}`}
        >
          <Icon name="ChevronDown" size={14} className="rotate-90" />
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label={`Next page of ${itemLabel}`}
        >
          Next
          <Icon name="ChevronDown" size={14} className="-rotate-90" />
        </Button>
      </div>
    </div>
  )
}
