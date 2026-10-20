import { memo } from 'react'

const FormTextarea = memo(function FormTextarea({ label, error, touched, className = '', helperText, ...props }) {
  const hasError = error && touched

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 ${
          hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 dark:border-gray-600'
        }`}
        {...props}
      />
      {hasError && <p className="error mt-1 animate-in fade-in slide-in-from-top-1 duration-200">{error}</p>}
      {helperText && !hasError && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helperText}</p>}
    </div>
  )
})

export default FormTextarea
