import { useState, useEffect, useCallback } from 'react'

export function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState(immediate ? 'pending' : 'idle')
  const [value, setValue] = useState(null)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    setStatus('pending')
    setValue(null)
    setError(null)

    try {
      const response = await asyncFunction(...args)
      setValue(response)
      setStatus('success')
      return response
    } catch (err) {
      setError(err)
      setStatus('error')
      throw err
    }
  }, [asyncFunction])

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

  return { execute, status, value, error, isIdle: status === 'idle', isLoading: status === 'pending', isError: status === 'error', isSuccess: status === 'success' }
}
