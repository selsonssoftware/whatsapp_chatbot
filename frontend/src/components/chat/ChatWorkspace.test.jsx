// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { installLocalStorage } from '../../test/localStorageMock.js'
import ChatWorkspace from './ChatWorkspace.jsx'

function renderWorkspace(props = {}) {
  return render(
    <MemoryRouter initialEntries={['/manager/inbox']}>
      <ChatWorkspace scope="manager" {...props} />
    </MemoryRouter>
  )
}

beforeEach(() => {
  installLocalStorage()
  window.confirm = vi.fn(() => true)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('ChatWorkspace', () => {
  it('lists the demo conversations', () => {
    renderWorkspace()
    expect(screen.getAllByText('Ramesh Iyer').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Fatima Sheikh').length).toBeGreaterThan(0)
  })

  it('opens a conversation and shows the thread', () => {
    renderWorkspace()
    fireEvent.click(screen.getAllByText('Ramesh Iyer')[0])

    const bubbles = document.querySelectorAll('.chat-bubble')
    expect(bubbles.length).toBeGreaterThan(0)
    const texts = [...document.querySelectorAll('.chat-bubble-text')].map((node) => node.textContent)
    expect(texts.some((text) => /order from last week still shows as pending/i.test(text))).toBe(true)
  })

  it('filters the list by customer name', () => {
    renderWorkspace()
    fireEvent.change(screen.getByPlaceholderText('Search by name or phone number...'), {
      target: { value: 'Fatima' },
    })
    expect(screen.getAllByText('Fatima Sheikh').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Ramesh Iyer')).toHaveLength(0)
  })

  it('filters the list by status', () => {
    renderWorkspace()
    fireEvent.click(screen.getByRole('tab', { name: 'Closed' }))
    expect(screen.getAllByText('Grace Fernandes').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Ramesh Iyer')).toHaveLength(0)
  })

  it('sends a message into the local demo thread', () => {
    renderWorkspace()
    fireEvent.click(screen.getAllByText('Ramesh Iyer')[0])

    const before = document.querySelectorAll('.chat-bubble').length
    const composer = screen.getByLabelText('Message')
    fireEvent.change(composer, { target: { value: 'Reply from the demo' } })
    fireEvent.keyDown(composer, { key: 'Enter', shiftKey: false })

    const bubbles = document.querySelectorAll('.chat-bubble')
    expect(bubbles.length).toBe(before + 1)
    expect(bubbles[bubbles.length - 1].textContent).toContain('Reply from the demo')
    expect(composer.value).toBe('')
  })

  it('keeps a newline when shift and enter are pressed', () => {
    renderWorkspace()
    fireEvent.click(screen.getAllByText('Ramesh Iyer')[0])

    const before = document.querySelectorAll('.chat-bubble').length
    const composer = screen.getByLabelText('Message')
    fireEvent.change(composer, { target: { value: 'Line one' } })
    fireEvent.keyDown(composer, { key: 'Enter', shiftKey: true })

    expect(document.querySelectorAll('.chat-bubble').length).toBe(before)
    expect(composer.value).toBe('Line one')
  })

  it('reassigns the conversation to another supporter', () => {
    renderWorkspace()
    fireEvent.click(screen.getAllByText('Ramesh Iyer')[0])

    const assign = screen.getByLabelText('Assign supporter')
    fireEvent.change(assign, { target: { value: 'sup-5' } })

    expect(assign.value).toBe('sup-5')
  })

  it('changes the conversation status', () => {
    renderWorkspace()
    fireEvent.click(screen.getAllByText('Ramesh Iyer')[0])

    const status = screen.getByLabelText('Conversation status')
    fireEvent.change(status, { target: { value: 'pending' } })

    expect(status.value).toBe('pending')
  })

  it('only lists the conversations of the selected supporter in supporter scope', () => {
    renderWorkspace({ scope: 'supporter', supporterId: 'sup-1' })
    expect(screen.getAllByText('Ramesh Iyer').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Fatima Sheikh')).toHaveLength(0)
  })
})
