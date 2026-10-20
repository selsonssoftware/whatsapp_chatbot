import Icon from './Icon.jsx'
import useDialogBehaviour from '../hooks/useDialogBehaviour.js'

export default function Modal({ isOpen, onClose, title, children, footer }) {
  const { panelRef, titleId } = useDialogBehaviour(isOpen, onClose)

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panelRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}
