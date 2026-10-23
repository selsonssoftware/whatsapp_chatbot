// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import { ROLES } from '../../constants/roles.js'

const { superAdminLogin, workspaceLogin } = vi.hoisted(() => ({
  superAdminLogin: vi.fn(),
  workspaceLogin: vi.fn(),
}))

vi.mock('../../hooks/useSuperAdminAuth.js', () => ({
  useSuperAdminAuth: () => ({
    login: superAdminLogin,
    status: 'unauthenticated',
    user: null,
  }),
}))

vi.mock('../../hooks/useAuth.js', () => ({
  useAuth: () => ({
    login: workspaceLogin,
    isAuthenticated: false,
    user: null,
  }),
}))

function renderLoginPage(initialEntries = ['/login']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/super-admin/dashboard" element={<div>Super Admin Dashboard</div>} />
        <Route path="/dashboard" element={<div>Admin Workspace Dashboard</div>} />
        <Route path="/supporter/inbox" element={<div>Supporter Inbox</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
  superAdminLogin.mockReset()
  workspaceLogin.mockReset()
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('LoginPage - Common Login Flow', () => {
  it('renders the single unified login page with brand, quick logins, and credentials form', () => {
    renderLoginPage()

    expect(screen.getByRole('heading', { level: 1, name: /Sign in/i })).toBeTruthy()
    expect(screen.getByLabelText(/Email \/ Login ID/i)).toBeTruthy()
    expect(screen.getByLabelText(/^Password/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /^Sign in$/i })).toBeTruthy()

    // Does NOT render separate super admin link
    expect(screen.queryByText(/Super Admin sign in/i)).toBeNull()

    // Shows quick demo buttons for Admin and Supporter
    expect(screen.getByText('Ava Admin')).toBeTruthy()
    expect(screen.getByText('Ravi Kumar')).toBeTruthy()
  })

  it('toggles password visibility', () => {
    renderLoginPage()

    const passwordInput = screen.getByLabelText(/^Password/i)
    expect(passwordInput.getAttribute('type')).toBe('password')

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(passwordInput.getAttribute('type')).toBe('text')

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(passwordInput.getAttribute('type')).toBe('password')
  })

  it('authenticates Super Admin and redirects directly to /super-admin/dashboard', async () => {
    superAdminLogin.mockResolvedValue({
      id: 1,
      name: 'Platform Super Admin',
      email: 'super.admin@whatsappcrm.test',
      role: ROLES.SUPER_ADMIN,
    })

    renderLoginPage()

    fireEvent.change(screen.getByLabelText(/Email \/ Login ID/i), {
      target: { value: 'super.admin@whatsappcrm.test' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'SuperAdmin#2026' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/i }))

    await waitFor(() => {
      expect(superAdminLogin).toHaveBeenCalledWith({
        login: 'super.admin@whatsappcrm.test',
        password: 'SuperAdmin#2026',
      })
    })

    expect(await screen.findByText('Super Admin Dashboard')).toBeTruthy()
  })

  it('authenticates Admin via credentials and redirects to /dashboard', async () => {
    superAdminLogin.mockRejectedValue(
      Object.assign(new Error('The provided credentials are not valid for a Super Admin account.'), {
        status: 401,
      })
    )

    renderLoginPage()

    fireEvent.change(screen.getByLabelText(/Email \/ Login ID/i), {
      target: { value: 'admin@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'admin@123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/i }))

    await waitFor(() => {
      expect(workspaceLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          role: ROLES.ADMIN,
        })
      )
    })

    expect(await screen.findByText('Admin Workspace Dashboard')).toBeTruthy()
  })

  it('authenticates Supporter via credentials and redirects to /supporter/inbox', async () => {
    superAdminLogin.mockRejectedValue(
      Object.assign(new Error('The provided credentials are not valid for a Super Admin account.'), {
        status: 401,
      })
    )

    renderLoginPage()

    fireEvent.change(screen.getByLabelText(/Email \/ Login ID/i), {
      target: { value: 'supporter@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'admin@123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/i }))

    await waitFor(() => {
      expect(workspaceLogin).toHaveBeenCalledWith(
        expect.objectContaining({
          role: ROLES.SUPPORTER,
        })
      )
    })

    expect(await screen.findByText('Supporter Inbox')).toBeTruthy()
  })

  it('quick login for Admin redirects to /dashboard', async () => {
    renderLoginPage()

    fireEvent.click(screen.getByText('Ava Admin'))

    expect(workspaceLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        role: ROLES.ADMIN,
      })
    )

    expect(await screen.findByText('Admin Workspace Dashboard')).toBeTruthy()
  })

  it('quick login for Supporter redirects to /supporter/inbox', async () => {
    renderLoginPage()

    fireEvent.click(screen.getByText('Ravi Kumar'))

    expect(workspaceLogin).toHaveBeenCalledWith(
      expect.objectContaining({
        role: ROLES.SUPPORTER,
      })
    )

    expect(await screen.findByText('Supporter Inbox')).toBeTruthy()
  })

  it('shows error message for invalid credentials', async () => {
    superAdminLogin.mockRejectedValue(
      Object.assign(new Error('The provided credentials are not valid for a Super Admin account.'), {
        status: 401,
      })
    )

    renderLoginPage()

    fireEvent.change(screen.getByLabelText(/Email \/ Login ID/i), {
      target: { value: 'unknown@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'wrongpassword' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/i }))

    expect(
      await screen.findByText(/Invalid login ID or password/i)
    ).toBeTruthy()
    expect(workspaceLogin).not.toHaveBeenCalled()
  })

  it('surfaces rate limit 429 errors from the authentication server', async () => {
    superAdminLogin.mockRejectedValue(
      Object.assign(new Error('Too many failed sign-in attempts. Please try again in 45 seconds.'), {
        status: 429,
      })
    )

    renderLoginPage()

    fireEvent.change(screen.getByLabelText(/Email \/ Login ID/i), {
      target: { value: 'super.admin@whatsappcrm.test' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'wrong' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/i }))

    expect(
      await screen.findByText(/Too many failed sign-in attempts/i)
    ).toBeTruthy()
  })
})
