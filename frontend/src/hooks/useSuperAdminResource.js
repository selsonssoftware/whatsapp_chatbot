import { useCallback, useEffect, useState } from 'react'

/**
 * Loads a Super Admin API resource and keeps the loading and error state.
 *
 * The loader has to be a stable reference (a module level function), the
 * resource is reloaded whenever it changes.
 *
 * @param {() => Promise<any>} loader
 */
export function useSuperAdminResource(loader) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const result = await loader()

        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [loader])

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await loader()
      setData(result)
      return result
    } catch (err) {
      setError(err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [loader])

  return { data, error, isLoading, reload, setData }
}
