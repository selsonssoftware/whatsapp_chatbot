export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/+$/, '')

export async function apiRequest(path, options = {}) {
  const { allowInSimulation = false, ...requestOptions } = options
  if (import.meta.env.VITE_SIMULATION_MODE === 'true' && !allowInSimulation) {
    throw new Error('Simulation mode: live API disabled')
  }

  const url = /^https?:\/\//i.test(path) ? path : `${API_BASE_URL}${path}`
  const res = await fetch(url, requestOptions)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.message || `API error ${res.status}`)
  }

  return res.json()
}
