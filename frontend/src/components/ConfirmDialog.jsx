import Button from './Button.jsx'
import Modal from './Modal.jsx'

/**
 * Accessible confirmation dialog used for destructive or irreversible actions.
 * The provider resolves the pending promise when the user confirms or cancels.
 */
export default function ConfirmDialog({ request, onConfirm, onCancel }) {
  const isOpen = Boolean(request)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={request?.title || 'Please confirm'}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            {request?.cancelLabel || 'Cancel'}
          </Button>
          <Button variant={request?.tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm}>
            {request?.confirmLabel || 'Confirm'}
          </Button>
        </>
      }
    >
      <p className="text-sm text-gray-700 dark:text-gray-300">{request?.message}</p>
    </Modal>
  )
}
