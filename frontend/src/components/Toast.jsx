import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  const toastContent = (
    <div className={`toast ${type}`}>
      <span>{message}</span>
    </div>
  )

  return createPortal(toastContent, document.body)
}
