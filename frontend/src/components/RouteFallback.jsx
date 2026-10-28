/**
 * Placeholder shown while a lazily loaded route chunk is being fetched.
 * Mirrors the page rhythm (title block + card skeleton) so the layout does
 * not jump when the real page arrives.
 */
export default function RouteFallback() {
  return (
    <div className="page" role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading page…</span>
      <div className="mb-6">
        <div className="skeleton h-7 w-56 mb-2 rounded" />
        <div className="skeleton h-4 w-72 rounded" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="skeleton h-4 w-24 mb-3 rounded" />
            <div className="skeleton h-7 w-16 rounded" />
          </div>
        ))}
      </div>
      <div className="card">
        <div className="skeleton h-5 w-40 mb-4 rounded" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-4 w-full mb-2 rounded" />
        ))}
      </div>
    </div>
  )
}
