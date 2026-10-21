export default function KPICard({ title, value, trend, icon: Icon, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value} from last period
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg">
            <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
          </div>
        )}
      </div>
    </div>
  )
}
