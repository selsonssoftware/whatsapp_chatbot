const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/+$/, '')

export const SUPER_ADMIN_BASE = `${API_BASE_URL}/super-admin`

/**
 * The Super Admin API is session based: the Laravel session cookie proves the
 * authentication, the CSRF token proves the request was intended. No token,
 * role flag or user id is ever accepted from the browser as proof of access.
 */
let csrfToken = null

function readCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[2]) : null
}

async function parse(response) {
  return response.json().catch(() => ({}))
}

export async function fetchCsrfToken() {
  let response
  try {
    response = await fetch(`${SUPER_ADMIN_BASE}/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    })
  } catch (netErr) {
    const error = new Error('The authentication server could not be reached. Please verify the backend service is running.')
    error.status = 0
    error.cause = netErr
    throw error
  }

  if (!response.ok) {
    const error = new Error(
      response.status === 404
        ? 'Authentication endpoint not found (404). Please verify API base URL.'
        : 'Unable to start a secure session with the authentication server.'
    )
    error.status = response.status
    throw error
  }

  const data = await parse(response)
  csrfToken = data.csrf_token || readCookie('XSRF-TOKEN')
  return csrfToken
}

async function request(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  if (method !== 'GET' && method !== 'HEAD') {
    const token = csrfToken || (await fetchCsrfToken())
    if (token) headers['X-CSRF-TOKEN'] = token
  }

  let response
  try {
    response = await fetch(`${SUPER_ADMIN_BASE}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (netErr) {
    const error = new Error('The authentication server could not be reached. Please check your connection.')
    error.status = 0
    error.cause = netErr
    throw error
  }

  const data = await parse(response)

  if (!response.ok) {
    const error = new Error(data.message || `The request failed with status ${response.status}.`)
    error.status = response.status
    throw error
  }

  return data
}

/**
 * Runs a request and transparently refreshes the CSRF token once when the
 * session token expired between two requests.
 */
async function requestWithCsrfRetry(path, options) {
  try {
    return await request(path, options)
  } catch (error) {
    if (error.status === 419) {
      csrfToken = null
      await fetchCsrfToken()
      return request(path, options)
    }
    throw error
  }
}

export function loginSuperAdmin({ login, password }) {
  return requestWithCsrfRetry('/login', {
    method: 'POST',
    body: { login: String(login || '').trim(), password },
  })
}

export function logoutSuperAdmin() {
  return requestWithCsrfRetry('/logout', { method: 'POST' })
}

export function fetchSuperAdminSession() {
  return request('/me')
}

export function fetchSuperAdminDashboard() {
  return request('/dashboard')
}

export function fetchCompanies() {
  return request('/companies')
}

export function createCompany(payload) {
  return requestWithCsrfRetry('/companies', { method: 'POST', body: payload })
}

export function updateCompany(id, payload) {
  return requestWithCsrfRetry(`/companies/${id}`, { method: 'PATCH', body: payload })
}

export function fetchPlans() {
  return request('/plans')
}

export function fetchSubscriptions() {
  return request('/subscriptions')
}

export function saveSubscription(payload) {
  return requestWithCsrfRetry('/subscriptions', { method: 'POST', body: payload })
}

export function fetchFeatureControls() {
  return request('/feature-controls')
}

export function setFeatureControl(payload) {
  return requestWithCsrfRetry('/feature-controls', { method: 'PUT', body: payload })
}

export function fetchPayments() {
  return request('/payments')
}

export function createPayment(payload) {
  return requestWithCsrfRetry('/payments', { method: 'POST', body: payload })
}

export function fetchReports() {
  return request('/reports')
}
