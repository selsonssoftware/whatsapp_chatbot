import { useRef } from 'react'

export default function Tabs({ tabs, activeTab, onChange, ariaLabel = 'Sections' }) {
  const listRef = useRef(null)

  const focusTab = (index) => {
    const bounded = (index + tabs.length) % tabs.length
    onChange(tabs[bounded].id)
    const buttons = listRef.current?.querySelectorAll('[role="tab"]')
    buttons?.[bounded]?.focus()
  }

  const onKeyDown = (event) => {
    const index = tabs.findIndex((tab) => tab.id === activeTab)
    if (index < 0) return
    if (event.key === 'ArrowRight') { event.preventDefault(); focusTab(index + 1) }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); focusTab(index - 1) }
    else if (event.key === 'Home') { event.preventDefault(); focusTab(0) }
    else if (event.key === 'End') { event.preventDefault(); focusTab(tabs.length - 1) }
  }

  return (
    <div className="tabs" role="tablist" aria-label={ariaLabel} ref={listRef} onKeyDown={onKeyDown}>
      {tabs.map((tab) => {
        const selected = activeTab === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            className={`tab-btn ${selected ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
