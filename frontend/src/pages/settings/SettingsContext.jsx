import { createContext, useContext } from 'react'

// Shared by every Settings tab.
//   can    -> permission flags returned by the backend (GET /settings/access)
//   notify -> notify('success' | 'error' | 'info', message)
//   goTo   -> goTo('whatsapp') switches Settings tab
export const SettingsContext = createContext({
  can: {},
  notify: () => {},
  goTo: () => {},
})

export const useSettings = () => useContext(SettingsContext)
