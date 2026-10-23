import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

const API_BASE_URL = 'http://localhost:8000/api'

async function loadService() {
  vi.resetModules()
  vi.stubEnv('VITE_API_BASE_URL', API_BASE_URL)
  return import('./superAdminService.js')
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('superAdminService', () => {
  it('requests the CSRF token before the first write', async () => {
    const service = await loadService()

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ csrf_token: 'csrf-token-value' }),
    })
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 1, role: 'super_admin' } }),
    })

    await service.loginSuperAdmin({ login: 'super.admin@example.com', password: 'secret' })

    expect(fetch.mock.calls[0][0]).toBe(`${API_BASE_URL}/super-admin/csrf-cookie`)
    expect(fetch.mock.calls[0][1]).toMatchObject({ credentials: 'include' })

    const [, options] = fetch.mock.calls[1]
    expect(fetch.mock.calls[1][0]).toBe(`${API_BASE_URL}/super-admin/login`)
    expect(options.method).toBe('POST')
    expect(options.credentials).toBe('include')
    expect(options.headers['X-CSRF-TOKEN']).toBe('csrf-token-value')
    expect(JSON.parse(options.body)).toEqual({
      login: 'super.admin@example.com',
      password: 'secret',
    })
  })

  it('never sends a role or a user id from the browser', async () => {
    const service = await loadService()

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ csrf_token: 'csrf-token-value' }),
    })
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 1, role: 'super_admin' } }),
    })

    await service.loginSuperAdmin({ login: 'super.admin@example.com', password: 'secret' })

    const body = JSON.parse(fetch.mock.calls[1][1].body)
    expect(Object.keys(body).sort()).toEqual(['login', 'password'])
  })

  it('surfaces the server message of a rejected sign in', async () => {
    const service = await loadService()

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ csrf_token: 'csrf-token-value' }),
    })
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'The provided credentials are not valid for a Super Admin account.' }),
    })

    await expect(
      service.loginSuperAdmin({ login: 'super.admin@example.com', password: 'wrong' })
    ).rejects.toMatchObject({
      status: 401,
      message: 'The provided credentials are not valid for a Super Admin account.',
    })
  })

  it('refreshes the CSRF token once when the session token expired', async () => {
    const service = await loadService()

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ csrf_token: 'first-token' }),
    })
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 419,
      json: async () => ({ message: 'CSRF token mismatch.' }),
    })
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ csrf_token: 'second-token' }),
    })
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Signed out.' }),
    })

    const result = await service.logoutSuperAdmin()

    expect(result).toEqual({ message: 'Signed out.' })
    expect(fetch).toHaveBeenCalledTimes(4)
    expect(fetch.mock.calls[3][1].headers['X-CSRF-TOKEN']).toBe('second-token')
  })

  it('reads the session of the signed in super admin', async () => {
    const service = await loadService()

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: { id: 1, role: 'super_admin' } }),
    })

    const data = await service.fetchSuperAdminSession()

    expect(fetch.mock.calls[0][0]).toBe(`${API_BASE_URL}/super-admin/me`)
    expect(fetch.mock.calls[0][1].credentials).toBe('include')
    expect(data.user.role).toBe('super_admin')
  })
})
