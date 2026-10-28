// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthContext.jsx'
import { ROLES } from '../../constants/roles.js'
import { installLocalStorage } from '../../test/localStorageMock.js'
import SupportersPage from './SupportersPage.jsx'

const mockCreateSupporter = vi.fn()

vi.mock('../../services/adminService.js', () => ({
  createSupporterWithApi: (...args) => mockCreateSupporter(...args),
}))

function renderAs(role) {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: { id: 'ADM1810', name: 'Test User', email: 'test@example.com', role },
          isAuthenticated: true,
          login: () => {},
          logout: () => {},
        }}
      >
        <SupportersPage />
      </AuthContext.Provider>
    </MemoryRouter>
  )
}

beforeEach(() => {
  installLocalStorage()
  mockCreateSupporter.mockResolvedValue({
    status: true,
    message: 'Test Supporter added to the support bench.',
    supporter: {
      supporter_id: 'sup-100',
      name: 'Test Supporter',
      email: 'test.supporter@example.com',
      phone: '+919988776655',
      role: 'supporter',
      status: true,
      languages: ['English'],
      created_at: new Date().toISOString(),
    },
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  mockCreateSupporter.mockClear()
})

describe('SupportersPage', () => {
  it('shows the management header and summary cards to admins', () => {
    renderAs(ROLES.ADMIN)
    expect(screen.getByRole('heading', { name: 'Supporters Management' })).toBeTruthy()
    expect(screen.getByText('Total Supporters')).toBeTruthy()
    expect(screen.getByText('Active Supporters')).toBeTruthy()
    expect(screen.getByText('Offline Supporters')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /Add Supporter/ }).length).toBeGreaterThan(0)
  })

  it('blocks supporters from accessing the supporter directory', () => {
    renderAs(ROLES.SUPPORTER)
    expect(screen.getByText('Access restricted')).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Add Supporter/ })).toBeNull()
  })

  it('lists the seeded supporters with their chat workload', () => {
    renderAs(ROLES.ADMIN)
    const table = screen.getByRole('table')
    expect(within(table).getByText('Ravi Kumar')).toBeTruthy()
    expect(within(table).getByText('Assigned Chats')).toBeTruthy()
    expect(within(table).getByText('Unread Chats')).toBeTruthy()
    expect(within(table).getByText('Last Active')).toBeTruthy()
  })

  it('adds a supporter through the modal', async () => {
    renderAs(ROLES.ADMIN)
    fireEvent.click(screen.getAllByRole('button', { name: /Add Supporter/ })[0])

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Test Supporter' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test.supporter@example.com' } })

    const modal = screen.getByRole('dialog')
    fireEvent.click(within(modal).getByRole('button', { name: 'Add Supporter' }))

    await expect(mockCreateSupporter).toHaveBeenCalledTimes(1)
    await expect(screen.findByText('Test Supporter added to the support bench.')).resolves.toBeTruthy()
    await expect(
      screen.findByText('Test Supporter')
    ).resolves.toBeTruthy()
  })

  it('rejects a duplicate email address', () => {
    renderAs(ROLES.ADMIN)
    fireEvent.click(screen.getAllByRole('button', { name: /Add Supporter/ })[0])

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Duplicate' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ravi.kumar@example.com' } })

    const modal = screen.getByRole('dialog')
    fireEvent.click(within(modal).getByRole('button', { name: 'Add Supporter' }))

    expect(screen.getByText('This email already belongs to another supporter')).toBeTruthy()
  })

  it('shows API error when creation fails', async () => {
    mockCreateSupporter.mockRejectedValueOnce(new Error('Server error'))
    renderAs(ROLES.ADMIN)
    fireEvent.click(screen.getAllByRole('button', { name: /Add Supporter/ })[0])

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Fail User' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'fail@example.com' } })

    const modal = screen.getByRole('dialog')
    fireEvent.click(within(modal).getByRole('button', { name: 'Add Supporter' }))

    await expect(screen.findByText('Server error')).resolves.toBeTruthy()
    expect(screen.getByLabelText('Full Name').value).toBe('Fail User')
  })

  it('filters the table by supporter name', () => {
    renderAs(ROLES.ADMIN)
    const search = screen.getByPlaceholderText('Search by name, email or phone...')
    fireEvent.change(search, { target: { value: 'Priya' } })

    const table = screen.getByRole('table')
    expect(within(table).getByText('Priya Nair')).toBeTruthy()
    expect(within(table).queryByText('Ravi Kumar')).toBeNull()
  })

  it('opens the details drawer for a supporter', () => {
    renderAs(ROLES.ADMIN)
    fireEvent.click(screen.getAllByRole('button', { name: 'View Details' })[0])

    const drawer = screen.getByRole('dialog')
    expect(within(drawer).getByText(/Assigned conversations/)).toBeTruthy()
  })
})
