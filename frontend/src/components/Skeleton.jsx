import { memo } from 'react'

const Skeleton = memo(function Skeleton({ className = '', variant = 'default', width, height }) {
  const variantClasses = {
    default: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded-sm h-4',
    avatar: 'rounded-full w-10 h-10',
  }

  const style = {
    width: width || undefined,
    height: height || undefined,
  }

  return (
    <div
      className={`skeleton ${variantClasses[variant]} ${className}`}
      style={style}
      role="presentation"
      aria-hidden="true"
    />
  )
})

export default Skeleton
