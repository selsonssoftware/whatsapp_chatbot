/**
 * Minimal in-memory localStorage so service modules that persist state can be
 * exercised in the node test environment.
 */
class MemoryStorage {
  constructor() {
    this.store = new Map()
  }

  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null
  }

  setItem(key, value) {
    this.store.set(key, String(value))
  }

  removeItem(key) {
    this.store.delete(key)
  }

  clear() {
    this.store.clear()
  }
}

export function installLocalStorage() {
  const storage = new MemoryStorage()
  // jsdom exposes localStorage as a getter-only property, so it has to be
  // redefined instead of assigned.
  Object.defineProperty(globalThis, 'localStorage', {
    value: storage,
    configurable: true,
    writable: true,
  })
  return storage
}
