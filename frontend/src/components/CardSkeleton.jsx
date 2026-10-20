import { memo } from 'react'
import Skeleton from './Skeleton.jsx'

const CardSkeleton = memo(function CardSkeleton({ title = true, lines = 3 }) {
  return (
    <div className="card">
      {title && (
        <div className="card-header">
          <Skeleton variant="text" className="w-1/3 h-6" />
          <Skeleton variant="text" className="w-16 h-6" />
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} variant="text" className="w-full h-4" style={{ width: `${Math.random() * 40 + 60}%` }} />
        ))}
      </div>
    </div>
  )
})

export default CardSkeleton
