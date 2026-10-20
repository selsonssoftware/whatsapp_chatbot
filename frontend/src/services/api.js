export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
export async function apiRequest(path, options = {}) {
  if (import.meta.env.VITE_SIMULATION_MODE === 'true') {
    throw new Error('Simulation mode: live API disabled')
  }
  const res = await fetch(`${API_BASE_URL}${path}`, options)
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}
