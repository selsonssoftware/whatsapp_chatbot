import { memo } from 'react'
import Skeleton from './Skeleton.jsx'

const KPICardSkeleton = memo(function KPICardSkeleton() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <Skeleton variant="circular" className="w-10 h-10" />
        <Skeleton variant="text" className="w-16 h-4" />
      </div>
      <Skeleton variant="text" className="w-24 h-8 mb-2" />
      <Skeleton variant="text" className="w-20 h-4" />
    </div>
  )
})

export default KPICardSkeleton
