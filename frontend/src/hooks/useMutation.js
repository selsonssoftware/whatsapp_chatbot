import { useState, useCallback } from 'react'
import { logError } from '../utils/errorHandler.js'

export function useMutation(mutationFn, options = {}) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(
    async (variables) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await mutationFn(variables)
        setData(result)
        if (options.onSuccess) {
          options.onSuccess(result, variables)
        }
        return result
      } catch (err) {
        setError(err)
        logError(err, { variables })
        if (options.onError) {
          options.onError(err, variables)
        }
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [mutationFn, options]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { mutate, data, error, isLoading, reset }
}
