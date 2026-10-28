export default function Badge({ children, variant = 'info', className = '' }) {
  const variantStyles = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
  }

  return (
    <span className={`badge ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
