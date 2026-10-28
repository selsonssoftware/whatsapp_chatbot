import { memo } from 'react'
import { Icon } from './index.js'

const EmptyState = memo(function EmptyState({ icon, title, description, action, size = 'md' }) {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  const iconSizes = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  }

  return (
    <div className={`empty-state ${sizeClasses[size]}`}>
      {icon && typeof icon === 'string' ? (
        <div className={`empty-state-icon ${iconSizes[size]}`}>
          <Icon name={icon} size={size === 'lg' ? 48 : size === 'md' ? 36 : 24} />
        </div>
      ) : (
        icon && <div className={`empty-state-icon ${iconSizes[size]}`}>{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      {action && action}
    </div>
  )
})

export default EmptyState

