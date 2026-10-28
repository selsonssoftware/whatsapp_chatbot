import { useState } from 'react'
import { Paperclip, Send } from 'lucide-react'
import Button from '../Button.jsx'

/**
 * Message composer. Enter sends the message, Shift+Enter inserts a newline.
 */
export default function MessageComposer({ value, onChange, onSend, onAttach, disabled = false, placeholder = 'Type a message...' }) {
  const [attachmentNote, setAttachmentNote] = useState('')

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  const handleAttach = () => {
    setAttachmentNote('Attachments are disabled in this demo — no file leaves the browser.')
    onAttach?.()
  }

  return (
    <div className="composer">
      <div className="flex-1">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={2}
          disabled={disabled}
          aria-label="Message"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {attachmentNote && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">{attachmentNote}</p>
        )}
      </div>
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="icon-btn"
          onClick={handleAttach}
          aria-label="Attach a file"
          disabled={disabled}
        >
          <Paperclip size={18} />
        </button>
        <Button variant="primary" onClick={onSend} disabled={disabled || !value.trim()}>
          <Send size={16} />
          Send
        </Button>
      </div>
    </div>
  )
}
