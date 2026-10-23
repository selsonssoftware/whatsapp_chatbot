import { memo, useId } from 'react'

const Input = memo(function Input({ label, error, className = '', id, ...props }) {
  const generatedId = useId()
  const inputId = id || `input-${generatedId}`

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="error mt-1">{error}</p>}
    </div>
  )
})

export default Input
