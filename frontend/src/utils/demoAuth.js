const DEMO_KEY = 'wc_demo_auth'

export function demoLogin(loginId, password) {
  if (loginId === 'admin' && password === 'admin@123') {
    localStorage.setItem(DEMO_KEY, JSON.stringify({ loginId, role: 'super_admin' }))
    return true
  }
  return false
}

export function isDemoAuthed() {
  try {
    const v = JSON.parse(localStorage.getItem(DEMO_KEY) || 'null')
    return v?.role === 'super_admin'
  } catch {
    return false
  }
}

export function demoLogout() {
  localStorage.removeItem(DEMO_KEY)
}