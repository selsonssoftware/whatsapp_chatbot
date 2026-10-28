// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import { ROLES } from '../../constants/roles.js'

const { loginAdminWithApi, workspaceLogin } = vi.hoisted(() => ({
  loginAdminWithApi: vi.fn(),
  workspaceLogin: vi.fn(),
}))

vi.mock('../../services/adminService.js', () => ({ loginAdminWithApi }))

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
        <Route path="/dashboard" element={<div>Admin Workspace Dashboard</div>} />
        <Route path="/supporter/inbox" element={<div>Supporter Inbox</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  loginAdminWithApi.mockReset()
  workspaceLogin.mockReset()
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('LoginPage', () => {
  it('renders the production sign-in form', () => {
    renderLoginPage()

    expect(screen.getByRole('heading', { level: 1, name: /Sign in/i })).toBeTruthy()
    expect(screen.getByLabelText(/Email \/ Login ID/i)).toBeTruthy()
    expect(screen.getByLabelText(/^Password/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /^Sign in$/i })).toBeTruthy()

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

  it('maps the live admin response to the Admin workspace and redirects to /dashboard', async () => {
    loginAdminWithApi.mockResolvedValue({
      status: true,
      message: 'Login successful',
      admin: {
        admin_id: 'ADM1810',
        name: 'Workspace Administrator',
        email: 'admin@example.com',
      },
    })

    renderLoginPage()

    fireEvent.change(screen.getByLabelText(/Email \/ Login ID/i), {
      target: { value: 'admin@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'admin@123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Sign in$/i }))

    await waitFor(() => {
      expect(loginAdminWithApi).toHaveBeenCalledWith({
        login: 'admin@example.com',
        password: 'admin@123',
      })
      expect(workspaceLogin).toHaveBeenCalledWith(
        {
          id: 'ADM1810',
          name: 'Workspace Administrator',
          email: 'admin@example.com',
          role: ROLES.ADMIN,
        }
      )
    })

    expect(await screen.findByText('Admin Workspace Dashboard')).toBeTruthy()
  })

  it('shows error message for invalid credentials', async () => {
    loginAdminWithApi.mockRejectedValue(new Error('Invalid login ID or password.'))
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

})
