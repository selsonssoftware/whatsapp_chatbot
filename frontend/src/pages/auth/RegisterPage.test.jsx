// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from './RegisterPage.jsx'

function renderPage() {
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})

describe('RegisterPage', () => {
  it('registers an admin through the API with the expected fields', async () => {
    vi.stubEnv('VITE_SIMULATION_MODE', 'true')
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Admin registered successfully!' }),
    })
    renderPage()

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'New Admin' } })
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'new.admin@example.com' } })
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '+919876543210' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'supersecret' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'supersecret' } })
    fireEvent.click(screen.getByRole('button', { name: /Create admin account/ }))

    expect(await screen.findByText('Admin registered successfully!')).toBeTruthy()
    expect(fetch).toHaveBeenCalledWith(
      'https://whatsapp.selsons.com/api/store_admins',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Admin',
          email: 'new.admin@example.com',
          phone: '+919876543210',
          password: 'supersecret',
          status: 1,
        }),
      })
    )
    expect(fetch.mock.calls[0][1]).not.toHaveProperty('allowInSimulation')
  })

  it('reports validation errors and does not call the API', () => {
    renderPage()

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'New Admin' } })
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'not-an-email' } })
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: 'not a phone' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'other' } })
    fireEvent.click(screen.getByRole('button', { name: /Create admin account/ }))

    expect(screen.getByText('Enter a valid email address')).toBeTruthy()
    expect(screen.getByText('Enter a valid phone number')).toBeTruthy()
    expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy()
    expect(screen.getByText('Passwords do not match')).toBeTruthy()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('displays API errors to the user', async () => {
    fetch.mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ message: 'The email has already been taken.' }),
    })
    renderPage()

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'New Admin' } })
    fireEvent.change(screen.getByLabelText('Work email'), { target: { value: 'new.admin@example.com' } })
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '+919876543210' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'supersecret' } })
    fireEvent.change(screen.getByLabelText('Confirm password'), { target: { value: 'supersecret' } })
    fireEvent.click(screen.getByRole('button', { name: /Create admin account/ }))

    expect(await screen.findByText('The email has already been taken.')).toBeTruthy()
  })

  it('links back to the sign in page', () => {
    renderPage()
    expect(screen.getByRole('link', { name: 'Sign in' }).getAttribute('href')).toBe('/login')
  })
})
