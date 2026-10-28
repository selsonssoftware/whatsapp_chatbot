import { describe, it, expect, beforeEach } from 'vitest'
import { installLocalStorage } from '../test/localStorageMock.js'
import { ROLES } from '../constants/roles.js'
import {
  authenticateAdmin,
  findAdminAccount,
  getAdminAccounts,
  hashPassword,
  registerAdmin,
  removeAdminAccount,
  saveAdminAccounts,
  updateAdminAccount,
  validateRegistration,
} from './authService.js'

const validForm = {
  name: 'Ava Admin',
  email: 'ava@example.com',
  phone: '+919876543210',
  workspace: 'Acme',
  password: 'supersecret',
  confirmPassword: 'supersecret',
}

let storage

beforeEach(() => {
  storage = installLocalStorage()
})

describe('validateRegistration', () => {
  it('accepts a complete form', () => {
    expect(validateRegistration(validForm, [])).toEqual({})
  })

  it('requires a name and an email', () => {
    const errors = validateRegistration({ ...validForm, name: ' ', email: '' }, [])
    expect(errors.name).toBe('Full name is required')
    expect(errors.email).toBe('Email is required')
  })

  it('rejects a malformed email', () => {
    expect(validateRegistration({ ...validForm, email: 'not-an-email' }, []).email).toBe(
      'Enter a valid email address'
    )
  })

  it('requires a valid phone number', () => {
    expect(validateRegistration({ ...validForm, phone: '' }, []).phone).toBe('Phone number is required')
    expect(validateRegistration({ ...validForm, phone: 'not a phone' }, []).phone).toBe(
      'Enter a valid phone number'
    )
  })

  it('rejects an email that is already registered', () => {
    const errors = validateRegistration(validForm, [{ id: 'adm-1', email: 'ava@example.com' }])
    expect(errors.email).toBe('An admin account already exists for this email')
  })

  it('requires a password of at least eight characters', () => {
    expect(validateRegistration({ ...validForm, password: 'short', confirmPassword: 'short' }, []).password).toBe(
      'Password must be at least 8 characters'
    )
  })

  it('requires the confirmation to match', () => {
    expect(validateRegistration({ ...validForm, confirmPassword: 'different' }, []).confirmPassword).toBe(
      'Passwords do not match'
    )
  })
})

describe('registerAdmin', () => {
  it('creates an admin account with a hashed password', () => {
    const { account, accounts, session } = registerAdmin([], validForm)
    expect(accounts).toHaveLength(1)
    expect(account).toMatchObject({ id: 'adm-1', name: 'Ava Admin', email: 'ava@example.com', role: ROLES.ADMIN })
    expect(account.passwordDigest).toBe(hashPassword('supersecret'))
    expect(account.passwordDigest).not.toContain('supersecret')
    expect(session).toEqual({
      id: 'adm-1',
      name: 'Ava Admin',
      email: 'ava@example.com',
      role: ROLES.ADMIN,
      workspace: 'Acme',
    })
  })

  it('keeps the plain password out of the session payload', () => {
    const { session } = registerAdmin([], validForm)
    expect(Object.keys(session)).not.toContain('password')
    expect(Object.keys(session)).not.toContain('passwordDigest')
  })

  it('gives every account its own id', () => {
    const first = registerAdmin([], validForm)
    const second = registerAdmin(first.accounts, { ...validForm, email: 'second@example.com' })
    expect(second.account.id).toBe('adm-2')
  })

  it('falls back to the default workspace name', () => {
    const { account } = registerAdmin([], { ...validForm, workspace: '' })
    expect(account.workspace).toBe('Blast WhatsApp')
  })
})

describe('authenticateAdmin', () => {
  it('returns the session for the right credentials', () => {
    const { accounts } = registerAdmin([], validForm)
    const session = authenticateAdmin(accounts, { email: 'AVA@example.com', password: 'supersecret' })
    expect(session.email).toBe('ava@example.com')
    expect(session.role).toBe(ROLES.ADMIN)
  })

  it('rejects a wrong password', () => {
    const { accounts } = registerAdmin([], validForm)
    expect(authenticateAdmin(accounts, { email: 'ava@example.com', password: 'nope' })).toBeNull()
  })

  it('rejects an unknown email', () => {
    const { accounts } = registerAdmin([], validForm)
    expect(authenticateAdmin(accounts, { email: 'nobody@example.com', password: 'supersecret' })).toBeNull()
  })

  it('rejects empty credentials', () => {
    expect(authenticateAdmin([], {})).toBeNull()
  })
})

describe('admin account storage', () => {
  it('persists registered accounts', () => {
    const { accounts } = registerAdmin([], validForm)
    saveAdminAccounts(accounts)
    expect(getAdminAccounts()).toHaveLength(1)
    expect(getAdminAccounts()[0].email).toBe('ava@example.com')
  })

  it('returns an empty list when nothing is registered', () => {
    expect(getAdminAccounts()).toEqual([])
  })

  it('survives corrupted json', () => {
    storage.setItem('wa_admin_accounts', '{not json')
    expect(getAdminAccounts()).toEqual([])
  })

  it('updates and removes an account', () => {
    const { accounts } = registerAdmin([], validForm)
    const updated = updateAdminAccount(accounts, 'adm-1', { name: 'Ava A', email: 'ava.a@example.com' })
    expect(findAdminAccount(updated, 'adm-1').name).toBe('Ava A')
    expect(removeAdminAccount(updated, 'adm-1')).toEqual([])
  })
})
