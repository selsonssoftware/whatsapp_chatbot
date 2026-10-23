import { ROLES, SUPPORTER_MANAGER_ROLES } from '../constants/roles.js'

const KEY = 'wa_supporters'

export const SUPPORTER_ROLES = [ROLES.SUPPORTER]
export const SUPPORTER_STATUSES = ['active', 'inactive']
export const SUPPORTER_PRESENCE = ['online', 'offline']
export const SUPPORTER_LANGUAGES = ['Tamil', 'English', 'Hindi', 'Telugu', 'Malayalam', 'Arabic', 'Spanish']

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s-()]{7,15}$/

const minutesAgo = (minutes) => new Date(Date.now() - minutes * 60 * 1000).toISOString()

const seedSupporters = [
  {
    id: 'sup-1',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    phone: '+91 98765 43210',
    role: ROLES.SUPPORTER,
    status: 'active',
    presence: 'online',
    lastActive: minutesAgo(2),
    languages: ['Tamil', 'English'],
    joinedAt: '2026-01-05',
  },
  {
    id: 'sup-2',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '+91 98123 45678',
    role: ROLES.SUPPORTER,
    status: 'active',
    presence: 'online',
    lastActive: minutesAgo(1),
    languages: ['English', 'Hindi'],
    joinedAt: '2026-01-09',
  },
  {
    id: 'sup-3',
    name: 'Arun Prakash',
    email: 'arun.prakash@example.com',
    phone: '+91 99876 12340',
    role: ROLES.SUPPORTER,
    status: 'inactive',
    presence: 'offline',
    lastActive: minutesAgo(190),
    languages: ['Tamil'],
    joinedAt: '2025-12-21',
  },
  {
    id: 'sup-4',
    name: 'Meena Subramanian',
    email: 'meena.s@example.com',
    phone: '+91 90010 22334',
    role: ROLES.SUPPORTER,
    status: 'active',
    presence: 'online',
    lastActive: minutesAgo(6),
    languages: ['Tamil', 'Malayalam'],
    joinedAt: '2026-02-14',
  },
  {
    id: 'sup-5',
    name: 'Karthik Raman',
    email: 'karthik.raman@example.com',
    phone: '+91 94440 55667',
    role: ROLES.SUPPORTER,
    status: 'inactive',
    presence: 'offline',
    lastActive: minutesAgo(320),
    languages: ['English', 'Telugu'],
    joinedAt: '2026-01-27',
  },
  {
    id: 'sup-6',
    name: 'Divya Shree',
    email: 'divya.shree@example.com',
    phone: '+91 98877 66554',
    role: ROLES.SUPPORTER,
    status: 'active',
    presence: 'online',
    lastActive: minutesAgo(3),
    languages: ['English', 'Arabic'],
    joinedAt: '2026-03-02',
  },
]

function readList(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
}

export function getSupporters() {
  return readList(KEY, seedSupporters)
}

export function saveSupporters(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

/**
 * Only admins may add, edit or remove supporters.
 */
export function canManageSupporters(role) {
  return SUPPORTER_MANAGER_ROLES.includes(role)
}

function nextId(supporters) {
  const highest = (supporters || []).reduce((max, supporter) => {
    const match = /^sup-(\d+)$/.exec(String(supporter?.id || ''))
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)
  return `sup-${highest + 1}`
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

export function validateSupporter(data, supporters = [], editingId = null) {
  const errors = {}
  const name = (data?.name || '').trim()
  const email = (data?.email || '').trim().toLowerCase()
  const phone = (data?.phone || '').trim()

  if (!name) {
    errors.name = 'Supporter name is required'
  }

  if (!email) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address'
  } else if (
    (supporters || []).some(
      (supporter) => String(supporter?.email || '').toLowerCase() === email && supporter.id !== editingId
    )
  ) {
    errors.email = 'This email already belongs to another supporter'
  }

  if (phone && !PHONE_PATTERN.test(phone)) {
    errors.phone = 'Enter a valid phone number'
  }

  if (!SUPPORTER_ROLES.includes(data?.role)) {
    errors.role = 'Select a role'
  }

  if (!SUPPORTER_STATUSES.includes(data?.status)) {
    errors.status = 'Select a status'
  }

  if (!Array.isArray(data?.languages) || data.languages.length === 0) {
    errors.languages = 'Select at least one language'
  }

  return errors
}

function toRecord(data) {
  return {
    name: (data.name || '').trim(),
    email: (data.email || '').trim().toLowerCase(),
    phone: (data.phone || '').trim(),
    role: SUPPORTER_ROLES.includes(data?.role) ? data.role : ROLES.SUPPORTER,
    status: data.status,
    presence: SUPPORTER_PRESENCE.includes(data?.presence) ? data.presence : 'online',
    languages: [...(data.languages || [])],
  }
}

export function createSupporter(supporters, data) {
  const record = {
    id: nextId(supporters),
    ...toRecord(data),
    lastActive: new Date().toISOString(),
    joinedAt: today(),
  }
  return [...(supporters || []), record]
}

export function normalizeSupporter(supporter) {
  if (!supporter) return supporter
  return {
    ...supporter,
    presence: SUPPORTER_PRESENCE.includes(supporter.presence) ? supporter.presence : 'online',
    lastActive: supporter.lastActive || supporter.joinedAt || null,
    phone: supporter.phone || '',
  }
}

export function updateSupporter(supporters, id, data) {
  return (supporters || []).map((supporter) =>
    supporter.id === id ? { ...supporter, ...toRecord(data), updatedAt: today() } : supporter
  )
}

export function removeSupporter(supporters, id) {
  return (supporters || []).filter((supporter) => supporter.id !== id)
}

export function findSupporter(supporters, id) {
  return (supporters || []).find((supporter) => supporter.id === id) || null
}

export function filterSupporters(supporters, { search = '', status = 'all', role = 'all' } = {}) {
  const term = String(search || '').trim().toLowerCase()

  return (supporters || []).filter((supporter) => {
    const haystack = [supporter?.name, supporter?.email, supporter?.phone, ...(supporter?.languages || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    const matchesSearch = !term || haystack.includes(term)
    const matchesStatus = status === 'all' || supporter?.status === status
    const matchesRole = role === 'all' || supporter?.role === role
    return matchesSearch && matchesStatus && matchesRole
  })
}

export function getSupporterStats(supporters) {
  const list = supporters || []
  const active = list.filter((supporter) => supporter.status === 'active')
  const languages = new Set(list.flatMap((supporter) => supporter.languages || []))

  return {
    total: list.length,
    active: active.length,
    inactive: list.length - active.length,
    supporters: list.length,
    languages: languages.size,
  }
}
