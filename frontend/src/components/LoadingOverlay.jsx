import { memo } from 'react'
import LoadingSpinner from './LoadingSpinner.jsx'

const LoadingOverlay = memo(function LoadingOverlay({ message = 'Loading...', size = 'lg', className = '' }) {
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm ${className}`} role="status" aria-busy="true" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={size} />
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  )
})

export default LoadingOverlay
