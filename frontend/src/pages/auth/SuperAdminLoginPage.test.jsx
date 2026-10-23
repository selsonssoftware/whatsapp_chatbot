// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SuperAdminLoginPage from './SuperAdminLoginPage.jsx'

const { login } = vi.hoisted(() => ({ login: vi.fn() }))

vi.mock('../../hooks/useSuperAdminAuth.js', () => ({
  useSuperAdminAuth: () => ({ login }),
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/super-admin/login']}>
      <Routes>
        <Route path="/super-admin/login" element={<SuperAdminLoginPage />} />
        <Route path="/super-admin/dashboard" element={<p>Super admin dashboard</p>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  login.mockReset()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('SuperAdminLoginPage', () => {
  it('shows the WhatsApp CRM branding and the credential fields', () => {
    renderPage()

    expect(screen.getByText('WhatsApp CRM')).toBeTruthy()
    expect(screen.getByText('Super Admin Console')).toBeTruthy()
    expect(screen.getByLabelText('Email / Login ID')).toBeTruthy()
    expect(screen.getByLabelText('Password')).toBeTruthy()
    expect(screen.getByRole('button', { name: /Sign in as Super Admin/ })).toBeTruthy()
  })

  it('hides the password by default and reveals it on request', () => {
    renderPage()

    const password = screen.getByLabelText('Password')
    expect(password.getAttribute('type')).toBe('password')

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(screen.getByLabelText('Password').getAttribute('type')).toBe('text')

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(screen.getByLabelText('Password').getAttribute('type')).toBe('password')
  })

  it('does not offer a password recovery link while recovery is not supported', () => {
    renderPage()

    expect(screen.queryByText(/forgot password/i)).toBeNull()
    expect(screen.queryByText(/reset your password/i)).toBeNull()
  })

  it('validates the form before calling the API', () => {
    renderPage()

    fireEvent.click(screen.getByRole('button', { name: /Sign in as Super Admin/ }))

    expect(screen.getByText('Enter your Super Admin login ID or e-mail address.')).toBeTruthy()
    expect(screen.getByText('Enter your password.')).toBeTruthy()
    expect(login).not.toHaveBeenCalled()
  })

  it('signs in through the API and opens the super admin dashboard', async () => {
    login.mockResolvedValue({ id: 1, role: 'super_admin' })
    renderPage()

    fireEvent.change(screen.getByLabelText('Email / Login ID'), {
      target: { value: 'super.admin@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct-horse-battery-staple' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Sign in as Super Admin/ }))

    await waitFor(() => expect(login).toHaveBeenCalledWith({
      login: 'super.admin@example.com',
      password: 'correct-horse-battery-staple',
    }))

    expect(await screen.findByText('Super admin dashboard')).toBeTruthy()
  })

  it('shows the generic error of a rejected sign in attempt', async () => {
    login.mockRejectedValue(
      Object.assign(new Error('The provided credentials are not valid for a Super Admin account.'), {
        status: 401,
      })
    )
    renderPage()

    fireEvent.change(screen.getByLabelText('Email / Login ID'), {
      target: { value: 'super.admin@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong-password' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Sign in as Super Admin/ }))

    expect(
      await screen.findByText('The provided credentials are not valid for a Super Admin account.')
    ).toBeTruthy()
    expect(screen.queryByText('Super admin dashboard')).toBeNull()
  })

  it('reports an unreachable authentication server', async () => {
    login.mockRejectedValue(new Error('Failed to fetch'))
    renderPage()

    fireEvent.change(screen.getByLabelText('Email / Login ID'), {
      target: { value: 'super.admin@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'correct-horse-battery-staple' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Sign in as Super Admin/ }))

    expect(await screen.findByRole('alert')).toBeTruthy()
  })
})
