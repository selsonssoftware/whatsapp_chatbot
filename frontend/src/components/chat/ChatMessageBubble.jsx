import { Check, CheckCheck } from 'lucide-react'
import { clockTime } from '../../utils/text.js'

function Ticks({ status }) {
  if (status === 'read') {
    return <CheckCheck size={14} className="text-sky-500" aria-label="Read" />
  }
  if (status === 'delivered') {
    return <CheckCheck size={14} className="text-current opacity-70" aria-label="Delivered" />
  }
  return <Check size={14} className="text-current opacity-70" aria-label="Sent" />
}

/**
 * A single WhatsApp-style message bubble.
 */
export default function ChatMessageBubble({ message }) {
  const outgoing = message.direction === 'outgoing'

  return (
    <div className={`chat-row ${outgoing ? 'outgoing' : 'incoming'}`}>
      <div className="chat-bubble">
        <p className="chat-bubble-text">{message.text}</p>
        <div className="chat-bubble-meta">
          <span>{clockTime(message.at)}</span>
          {outgoing && <Ticks status={message.status} />}
        </div>
      </div>
    </div>
  )
}
