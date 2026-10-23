import { useCallback, useRef, useState } from 'react'
import { ConfirmContext } from './ConfirmContext.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

/**
 * Provides an accessible replacement for the blocking native `confirm()`.
 * `confirm()` resolves to true when the user accepts and false when they cancel.
 */
export function ConfirmProvider({ children }) {
  const [request, setRequest] = useState(null)
  const resolverRef = useRef(null)

  const confirm = useCallback((options) => {
    const settings = typeof options === 'string' ? { message: options } : options || {}
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setRequest({
        title: settings.title || 'Please confirm',
        message: settings.message || '',
        confirmLabel: settings.confirmLabel || 'Confirm',
        cancelLabel: settings.cancelLabel || 'Cancel',
        tone: settings.tone || 'danger',
      })
    })
  }, [])

  const settle = useCallback((result) => {
    setRequest(null)
    resolverRef.current?.(result)
    resolverRef.current = null
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog request={request} onCancel={() => settle(false)} onConfirm={() => settle(true)} />
    </ConfirmContext.Provider>
  )
}
