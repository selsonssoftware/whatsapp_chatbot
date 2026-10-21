import { describe, it, expect, beforeEach } from 'vitest'
import { installLocalStorage } from '../test/localStorageMock.js'
import {
  PRESERVED_STORAGE_KEYS,
  SEED_STORAGE_KEYS,
  getStoredSeedData,
  listSeedDataKeys,
} from './seedDataService.js'

let storage

beforeEach(() => {
  storage = installLocalStorage()
})

describe('seed data storage keys', () => {
  it('never lists the preserved session and theme keys', () => {
    const keys = listSeedDataKeys()
    expect(keys).not.toContain('wa_session')
    expect(keys).not.toContain('theme')
    expect(PRESERVED_STORAGE_KEYS).toEqual(['wa_session', 'theme'])
  })

  it('lists every module store exactly once', () => {
    const keys = listSeedDataKeys()
    expect(new Set(keys).size).toBe(keys.length)
    expect(keys).toContain(SEED_STORAGE_KEYS.products)
    expect(keys).toContain(SEED_STORAGE_KEYS.settings)
  })
})

describe('getStoredSeedData', () => {
  it('reports zero records for empty stores', () => {
    const entries = getStoredSeedData()
    expect(entries.every((entry) => entry.records === 0)).toBe(true)
  })

  it('counts array records', () => {
    storage.setItem('wa_products', JSON.stringify([{ id: 1 }, { id: 2 }]))
    const entry = getStoredSeedData().find((item) => item.key === 'wa_products')
    expect(entry.records).toBe(2)
  })

  it('counts a non array value as a single record', () => {
    storage.setItem('wa_settings', JSON.stringify({ plan: 'Free' }))
    const entry = getStoredSeedData().find((item) => item.key === 'wa_settings')
    expect(entry.records).toBe(1)
  })

  it('survives corrupted json', () => {
    storage.setItem('wa_products', '{not json')
    const entry = getStoredSeedData().find((item) => item.key === 'wa_products')
    expect(entry.records).toBe(0)
  })
})
