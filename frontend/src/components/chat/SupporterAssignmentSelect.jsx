/**
 * Dropdown that assigns a conversation to a supporter.
 */
export default function SupporterAssignmentSelect({
  value = '',
  supporters = [],
  onChange,
  label = 'Assigned supporter',
  id = 'supporter-assignment',
  allowUnassigned = true,
  className = '',
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value || ''}
        onChange={(event) => onChange(event.target.value || null)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
      >
        {allowUnassigned && <option value="">Unassigned</option>}
        {supporters.map((supporter) => (
          <option key={supporter.id} value={supporter.id}>
            {supporter.name} · {supporter.role}
          </option>
        ))}
      </select>
    </div>
  )
}
