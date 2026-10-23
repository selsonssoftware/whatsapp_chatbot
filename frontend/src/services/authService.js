import { ROLES } from '../constants/roles.js'

const ACCOUNTS_KEY = 'wa_admin_accounts'
const SESSION_KEY = 'wa_session'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?[\d\s-()]{7,15}$/
const MIN_PASSWORD_LENGTH = 8
const PASSWORD_SALT = 'blast-whatsapp'

function readList(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

/**
 * Browser-stored admin accounts used by demo sign-in and team management.
 * Seeded demo accounts live in `constants/roles.js`.
 */
export function getAdminAccounts() {
  return readList(ACCOUNTS_KEY, [])
}

export function saveAdminAccounts(list) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list))
}

/**
 * Digest used to avoid keeping the plain password in localStorage. This is a
 * browser-only simulation — a real deployment must hash with bcrypt/argon2 on
 * the server.
 */
export function hashPassword(password) {
  const input = `${PASSWORD_SALT}:${password ?? ''}`
  let hash = 0x811c9dc5
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193) >>> 0
  }
  return hash.toString(16).padStart(8, '0')
}

function nextId(accounts) {
  const highest = (accounts || []).reduce((max, account) => {
    const match = /^adm-(\d+)$/.exec(String(account?.id || ''))
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)
  return `adm-${highest + 1}`
}

/**
 * Validates the registration form. `accounts` are the already registered
 * admins, used to reject a duplicate email address.
 */
export function validateRegistration(form, accounts = []) {
  const errors = {}
  const name = (form?.name || '').trim()
  const email = (form?.email || '').trim().toLowerCase()
  const password = form?.password || ''
  const confirmPassword = form?.confirmPassword || ''

  if (!name) {
    errors.name = 'Full name is required'
  } else if (name.length < 2) {
    errors.name = 'Enter your full name'
  }

  if (!email) {
    errors.email = 'Email is required'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Enter a valid email address'
  } else if ((accounts || []).some((account) => String(account?.email || '').toLowerCase() === email)) {
    errors.email = 'An admin account already exists for this email'
  }

  const phone = (form?.phone || '').trim()
  if (!phone) {
    errors.phone = 'Phone number is required'
  } else if (!PHONE_PATTERN.test(phone)) {
    errors.phone = 'Enter a valid phone number'
  }

  if (!password) {
    errors.password = 'Password is required'
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm your password'
  } else if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match'
  }

  return errors
}

function toSession(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    workspace: account.workspace,
  }
}

/**
 * Creates an admin account and returns the new record together with the
 * updated account list.
 */
export function registerAdmin(accounts, form) {
  const account = {
    id: nextId(accounts),
    name: (form.name || '').trim(),
    email: (form.email || '').trim().toLowerCase(),
    role: ROLES.ADMIN,
    workspace: (form.workspace || '').trim() || 'Blast WhatsApp',
    passwordDigest: hashPassword(form.password),
    createdAt: new Date().toISOString(),
  }

  return { account, accounts: [...(accounts || []), account], session: toSession(account) }
}

/**
 * Verifies an email and password pair. Returns the session payload or null.
 */
export function authenticateAdmin(accounts, { email, password } = {}) {
  const target = String(email || '').trim().toLowerCase()
  if (!target) return null

  const account = (accounts || []).find((item) => String(item?.email || '').toLowerCase() === target)
  if (!account) return null
  if (account.passwordDigest !== hashPassword(password)) return null

  return toSession(account)
}

/**
 * Finds a registered admin account.
 */
export function findAdminAccount(accounts, id) {
  return (accounts || []).find((account) => account.id === id) || null
}

/**
 * Updates the editable fields of a registered admin account.
 */
export function updateAdminAccount(accounts, id, changes) {
  return (accounts || []).map((account) =>
    account.id === id
      ? {
          ...account,
          name: (changes.name || account.name).trim(),
          email: (changes.email || account.email).trim().toLowerCase(),
        }
      : account
  )
}

/**
 * Removes a registered admin account.
 */
export function removeAdminAccount(accounts, id) {
  return (accounts || []).filter((account) => account.id !== id)
}

/**
 * Clears the stored session without touching the registered accounts.
 */
export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}
