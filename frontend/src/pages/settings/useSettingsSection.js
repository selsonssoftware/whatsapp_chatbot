import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { settingsApi, ApiError } from '../../services/settingsApi.js'
import { useSettings } from './SettingsContext.jsx'

export function getPath(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj)
}

export function setPath(obj, path, value) {
  const [head, ...rest] = path.split('.')
  const base = Array.isArray(obj) ? [...obj] : { ...(obj || {}) }
  base[head] = rest.length ? setPath(base[head], rest.join('.'), value) : value
  return base
}

// Laravel style { field: ['msg'] } -> { field: 'msg' }
function flattenErrors(errors) {
  const out = {}
  Object.entries(errors || {}).forEach(([k, v]) => {
    out[k] = Array.isArray(v) ? v[0] : String(v)
  })
  return out
}

/**
 * Loads one settings section from the backend, tracks edits (draft vs saved),
 * validates, saves through the API and then RE-LOADS from the server,
 * so the UI only ever shows what the backend really stored.
 */
export function useSettingsSection(section, onDirtyChange) {
  const { notify } = useSettings()
  const [status, setStatus] = useState('loading')
  const [loadError, setLoadError] = useState(null)
  const [saved, setSaved] = useState(null)
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const busy = useRef(false)
  const mounted = useRef(true)
  const dirtyCb = useRef(onDirtyChange)

  useEffect(() => {
    dirtyCb.current = onDirtyChange
  }, [onDirtyChange])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      dirtyCb.current?.(false)
    }
  }, [])

  const load = useCallback(async () => {
    setStatus('loading')
    setLoadError(null)
    try {
      const data = await settingsApi.get(section)
      if (!mounted.current) return
      setSaved(data)
      setDraft(data)
      setStatus('ready')
    } catch (e) {
      if (!mounted.current) return
      setLoadError(e.message)
      setStatus('error')
    }
  }, [section])

  useEffect(() => {
    load()
  }, [load])

  const dirty = useMemo(
    () => status === 'ready' && JSON.stringify(draft) !== JSON.stringify(saved),
    [status, draft, saved]
  )

  useEffect(() => {
    dirtyCb.current?.(dirty)
  }, [dirty])

  const set = useCallback((path, value) => {
    setDraft((d) => setPath(d, path, value))
    setFieldErrors((prev) => {
      if (!prev[path]) return prev
      const next = { ...prev }
      delete next[path]
      return next
    })
  }, [])

  const cancel = useCallback(() => {
    setDraft(saved)
    setFieldErrors({})
  }, [saved])

  const save = useCallback(
    async (validate, successMessage = 'Settings saved.') => {
      if (busy.current) return false // prevents double submit
      const errs = validate ? validate(draft) : {}
      if (Object.keys(errs).length) {
        setFieldErrors(errs)
        notify('error', 'Please fix the highlighted fields.')
        return false
      }
      busy.current = true
      setSaving(true)
      setFieldErrors({})
      try {
        await settingsApi.update(section, draft)
        let fresh
        try {
          fresh = await settingsApi.get(section)
        } catch {
          notify('error', 'Saved, but the latest values could not be reloaded. Refresh the page to confirm.')
          if (mounted.current) setSaved(draft)
          return true
        }
        if (mounted.current) {
          setSaved(fresh)
          setDraft(fresh)
        }
        notify('success', successMessage)
        return true
      } catch (e) {
        if (mounted.current && e instanceof ApiError) setFieldErrors(flattenErrors(e.errors))
        notify('error', e.message || 'Could not save settings.')
        return false
      } finally {
        busy.current = false
        if (mounted.current) setSaving(false)
      }
    },
    [draft, section, notify]
  )

  return { status, loadError, reload: load, saved, draft, set, dirty, saving, fieldErrors, cancel, save }
}
