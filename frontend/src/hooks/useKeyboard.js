import { useEffect, useCallback } from 'react'

export function useKeyboard(key, callback, options = {}) {
  const { target = window, enableOnInputFields = false, enabled = true } = options

  const handleKeyDown = useCallback(
    (e) => {
      if (!enableOnInputFields && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable)) {
        return
      }

      if (typeof key === 'string') {
        if (e.key === key) {
          callback(e)
        }
      } else if (Array.isArray(key)) {
        if (key.includes(e.key)) {
          callback(e)
        }
      } else if (typeof key === 'function') {
        if (key(e)) {
          callback(e)
        }
      }
    },
    [key, callback, enableOnInputFields]
  )

  useEffect(() => {
    if (!enabled) return undefined

    target.addEventListener('keydown', handleKeyDown)
    return () => target.removeEventListener('keydown', handleKeyDown)
  }, [target, handleKeyDown, enabled])
}

export function useEscape(callback, isActive = true) {
  useKeyboard('Escape', callback, { enableOnInputFields: true, enabled: isActive })
}

export function useEnter(callback, isActive = true) {
  useKeyboard('Enter', callback, { enableOnInputFields: true, enabled: isActive })
}
