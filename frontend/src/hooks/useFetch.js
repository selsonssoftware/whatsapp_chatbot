import { useState, useEffect, useCallback } from 'react'
import { logError } from '../utils/errorHandler.js'

export function useFetch(url, options = {}, immediate = true) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const optionsKey = JSON.stringify(options)

  const execute = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(url, JSON.parse(optionsKey))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const json = await response.json()
      setData(json)
      return json
    } catch (err) {
      setError(err)
      logError(err, { url, options: JSON.parse(optionsKey) })
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [url, optionsKey])

  useEffect(() => {
    if (!immediate) return undefined

    let cancelled = false
    const start = async () => {
      await Promise.resolve()
      if (cancelled) return
      try {
        await execute()
      } catch {
        // execute() already exposed the error through state
      }
    }
    start()

    return () => {
      cancelled = true
    }
  }, [execute, immediate])

  return { data, error, isLoading, execute, refetch: execute }
}

export function useLazyFetch(url, options = {}) {
  return useFetch(url, options, false)
}
