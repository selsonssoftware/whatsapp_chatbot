// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { useState } from 'react'
import ErrorBoundary from './ErrorBoundary.jsx'
import Modal from './Modal.jsx'
import Tabs from './Tabs.jsx'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

function Boom({ shouldThrow }) {
  if (shouldThrow) throw new Error('render failure')
  return <p>content</p>
}

describe('ErrorBoundary', () => {
  it('renders children when nothing fails', () => {
    render(
      <ErrorBoundary>
        <Boom shouldThrow={false} />
      </ErrorBoundary>
    )
    expect(screen.getByText('content')).toBeTruthy()
  })

  it('renders a recovery screen instead of crashing when a child throws', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Boom shouldThrow />
      </ErrorBoundary>
    )
    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText('Something went wrong')).toBeTruthy()
    expect(screen.getByText(/render failure/)).toBeTruthy()
    expect(spy).toHaveBeenCalled()
  })
})

describe('Modal', () => {
  function Harness() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          open
        </button>
        <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Contact" footer={<button type="button">Save</button>}>
          <input aria-label="Name" />
        </Modal>
      </>
    )
  }

  it('is a labelled modal dialog once opened', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('open'))
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(screen.getByText('Add Contact')).toBeTruthy()
  })

  it('moves focus into the dialog on open', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('open'))
    const dialog = screen.getByRole('dialog')
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('closes on Escape', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('open'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('locks and restores the page scroll', () => {
    render(<Harness />)
    fireEvent.click(screen.getByText('open'))
    expect(document.body.style.overflow).toBe('hidden')
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.body.style.overflow).not.toBe('hidden')
  })
})

describe('Tabs', () => {
  const tabs = [
    { id: 'a', label: 'Alpha' },
    { id: 'b', label: 'Beta' },
    { id: 'c', label: 'Gamma' },
  ]

  it('marks the active tab as selected', () => {
    render(<Tabs tabs={tabs} activeTab="b" onChange={() => {}} />)
    const selected = screen.getByRole('tab', { selected: true })
    expect(selected.textContent).toBe('Beta')
  })

  it('moves selection with the arrow keys', () => {
    const onChange = vi.fn()
    render(<Tabs tabs={tabs} activeTab="a" onChange={onChange} />)
    const list = screen.getByRole('tablist')
    fireEvent.keyDown(list, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledWith('b')
    fireEvent.keyDown(list, { key: 'End' })
    expect(onChange).toHaveBeenCalledWith('c')
  })
})
