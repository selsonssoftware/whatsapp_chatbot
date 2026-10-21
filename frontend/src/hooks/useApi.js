import { useCallback } from 'react'
import apiClient from '../utils/apiClient.js'
import { useMutation, useFetch } from './index.js'

export function useApiGet(endpoint, options = {}) {
  return useFetch(`${apiClient.baseURL}${endpoint}`, {
    headers: apiClient.getAuthHeader(),
    ...options,
  })
}

export function useApiPost(endpoint, options = {}) {
  const mutate = useCallback(
    async (data) => {
      return await apiClient.post(endpoint, data, options)
    },
    [endpoint, options]
  )

  return useMutation(mutate, options)
}

export function useApiPut(endpoint, options = {}) {
  const mutate = useCallback(
    async (data) => {
      return await apiClient.put(endpoint, data, options)
    },
    [endpoint, options]
  )

  return useMutation(mutate, options)
}

export function useApiDelete(endpoint, options = {}) {
  const mutate = useCallback(
    async () => {
      return await apiClient.delete(endpoint, options)
    },
    [endpoint, options]
  )

  return useMutation(mutate, options)
}
