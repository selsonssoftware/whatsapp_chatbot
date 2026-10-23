import { describe, it, expect, beforeEach } from 'vitest'
import { installLocalStorage } from '../test/localStorageMock.js'
import { ROLES } from '../constants/roles.js'
import {
  canManageSupporters,
  createSupporter,
  filterSupporters,
  findSupporter,
  getSupporterStats,
  getSupporters,
  removeSupporter,
  saveSupporters,
  updateSupporter,
  validateSupporter,
} from './supporterService.js'

const validSupporter = {
  name: 'Deepa Rao',
  email: 'deepa.rao@example.com',
  phone: '+91 90000 11111',
  role: ROLES.SUPPORTER,
  status: 'active',
  languages: ['Tamil', 'English'],
}

let storage

beforeEach(() => {
  storage = installLocalStorage()
})

describe('canManageSupporters', () => {
  it('allows admins', () => {
    expect(canManageSupporters(ROLES.ADMIN)).toBe(true)
  })

  it('rejects every other role', () => {
    expect(canManageSupporters(ROLES.SUPPORTER)).toBe(false)
    expect(canManageSupporters(undefined)).toBe(false)
  })
})

describe('validateSupporter', () => {
  it('accepts a complete supporter', () => {
    expect(validateSupporter(validSupporter, [])).toEqual({})
  })

  it('requires a name and an email', () => {
    const errors = validateSupporter({ ...validSupporter, name: ' ', email: '' }, [])
    expect(errors.name).toBe('Supporter name is required')
    expect(errors.email).toBe('Email is required')
  })

  it('rejects a malformed email', () => {
    expect(validateSupporter({ ...validSupporter, email: 'not-an-email' }, []).email).toBe(
      'Enter a valid email address'
    )
  })

  it('rejects a duplicate email', () => {
    const errors = validateSupporter(validSupporter, [{ id: 'sup-1', email: 'deepa.rao@example.com' }])
    expect(errors.email).toBe('This email already belongs to another supporter')
  })

  it('ignores the duplicate email of the record being edited', () => {
    const existing = { id: 'sup-1', email: 'deepa.rao@example.com' }
    expect(validateSupporter(validSupporter, [existing], 'sup-1')).toEqual({})
  })

  it('rejects a malformed phone number', () => {
    expect(validateSupporter({ ...validSupporter, phone: '123' }, []).phone).toBe('Enter a valid phone number')
  })

  it('requires a role, a status and at least one language', () => {
    const errors = validateSupporter({ ...validSupporter, role: '', status: '', languages: [] }, [])
    expect(errors.role).toBe('Select a role')
    expect(errors.status).toBe('Select a status')
    expect(errors.languages).toBe('Select at least one language')
  })

  it('only accepts the supporter role', () => {
    expect(validateSupporter({ ...validSupporter, role: ROLES.SUPPORTER }, []).role).toBeUndefined()
    expect(validateSupporter({ ...validSupporter, role: ROLES.ADMIN }, []).role).toBe('Select a role')
  })
})

describe('createSupporter', () => {
  it('appends a supporter with the chosen role', () => {
    const list = createSupporter([], validSupporter)
    expect(list).toHaveLength(1)
    expect(list[0]).toMatchObject({ name: 'Deepa Rao', email: 'deepa.rao@example.com', role: ROLES.SUPPORTER })
    expect(list[0].id).toBe('sup-1')
  })

  it('generates unique ids for consecutive supporters', () => {
    const first = createSupporter([], validSupporter)
    const second = createSupporter(first, { ...validSupporter, email: 'second@example.com' })
    expect(second.map((supporter) => supporter.id)).toEqual(['sup-1', 'sup-2'])
  })
})

describe('updateSupporter', () => {
  it('replaces the edited fields and keeps the id', () => {
    const list = createSupporter([], validSupporter)
    const updated = updateSupporter(list, 'sup-1', { ...validSupporter, name: 'Deepa R', status: 'inactive' })
    expect(updated[0]).toMatchObject({ id: 'sup-1', name: 'Deepa R', status: 'inactive', role: ROLES.SUPPORTER })
  })

  it('leaves other supporters untouched', () => {
    const list = createSupporter([], validSupporter)
    const withSecond = createSupporter(list, { ...validSupporter, email: 'second@example.com' })
    const updated = updateSupporter(withSecond, 'sup-1', { ...validSupporter, name: 'Deepa R' })
    expect(updated[1].name).toBe('Deepa Rao')
  })
})

describe('removeSupporter', () => {
  it('drops only the requested supporter', () => {
    const list = createSupporter([], validSupporter)
    const withSecond = createSupporter(list, { ...validSupporter, email: 'second@example.com' })
    expect(removeSupporter(withSecond, 'sup-1').map((supporter) => supporter.id)).toEqual(['sup-2'])
  })
})

describe('filterSupporters', () => {
  const list = [
    { id: 'sup-1', name: 'Ravi Kumar', email: 'ravi@example.com', phone: '', role: ROLES.SUPPORTER, status: 'active', languages: ['Tamil'] },
    { id: 'sup-2', name: 'Priya Nair', email: 'priya@example.com', phone: '', role: ROLES.SUPPORTER, status: 'inactive', languages: ['English'] },
  ]

  it('matches the name, email, phone and languages', () => {
    expect(filterSupporters(list, { search: 'ravi' })).toHaveLength(1)
    expect(filterSupporters(list, { search: 'tamil' })).toHaveLength(1)
    expect(filterSupporters(list, { search: 'nobody' })).toHaveLength(0)
  })

  it('filters by status and role', () => {
    expect(filterSupporters(list, { status: 'active' })).toHaveLength(1)
    expect(filterSupporters(list, { role: ROLES.SUPPORTER })).toHaveLength(2)
    expect(filterSupporters(list, { status: 'all', role: 'all' })).toHaveLength(2)
  })
})

describe('findSupporter', () => {
  it('finds a directory record and reports null for anything else', () => {
    const list = createSupporter([], validSupporter)
    expect(findSupporter(list, 'sup-1').name).toBe('Deepa Rao')
    expect(findSupporter(list, 'core-1')).toBeNull()
  })
})

describe('getSupporterStats', () => {
  it('counts totals, active supporters, and languages', () => {
    const list = createSupporter([], validSupporter)
    const withSecond = createSupporter(list, { ...validSupporter, email: 'second@example.com' })
    const stats = getSupporterStats(withSecond)
    expect(stats).toEqual({ total: 2, active: 2, inactive: 0, supporters: 2, languages: 2 })
  })
})

describe('supporter storage', () => {
  it('seeds the directory on first use and persists changes', () => {
    const seeded = getSupporters()
    expect(seeded.length).toBeGreaterThan(0)

    const next = createSupporter(seeded, validSupporter)
    saveSupporters(next)
    expect(getSupporters()).toHaveLength(next.length)
  })

  it('falls back to the seed list when the stored json is corrupted', () => {
    storage.setItem('wa_supporters', '{not json')
    expect(getSupporters().length).toBeGreaterThan(0)
  })
})
