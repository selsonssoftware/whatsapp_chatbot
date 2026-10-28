import { useContext } from 'react'
import { ConfirmContext } from '../contexts/ConfirmContext.jsx'

/**
 * Returns a `confirm(options)` function that resolves to a boolean.
 * Falls back to the native dialog when no provider is mounted.
 */
export function useConfirm() {
  const context = useContext(ConfirmContext)
  return context || fallbackConfirm
}

function fallbackConfirm(options) {
  const message = typeof options === 'string' ? options : options?.message || ''
  return Promise.resolve(window.confirm(message))
}
