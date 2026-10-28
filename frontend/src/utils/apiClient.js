import { NetworkError, AuthenticationError, ValidationError } from './errorHandler.js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  getAuthHeader() {
    const token = localStorage.getItem('authToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeader(),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        this.handleErrorResponse(response, errorData)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof NetworkError || error instanceof AuthenticationError) {
        throw error
      }
      throw new NetworkError(error.message)
    }
  }

  handleErrorResponse(response, errorData) {
    switch (response.status) {
      case 401:
        throw new AuthenticationError(errorData.message || 'Authentication failed')
      case 400:
        throw new ValidationError(errorData.message || 'Invalid request', errorData.errors)
      case 404:
        throw new NetworkError('Resource not found')
      case 500:
        throw new NetworkError('Server error occurred')
      default:
        throw new NetworkError(errorData.message || 'Request failed')
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export const apiClient = new ApiClient()
export default apiClient
