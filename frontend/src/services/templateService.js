const KEY = 'demo_templates'
const seed = [
  { id: 1, name: 'Welcome', category: 'Marketing', language: 'en', header: 'Hello', body: 'Hi {{first_name}}, welcome!', footer: 'Team', buttons: [], status: 'Approved', updatedAt: '2026-01-01' },
  { id: 2, name: 'Order Update', category: 'Utility', language: 'en', header: '', body: 'Your order {{order_id}} shipped.', footer: '', buttons: [], status: 'Draft', updatedAt: '2026-01-02' },
]
export function getTemplates() {
  const raw = localStorage.getItem(KEY)
  if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed }
  return JSON.parse(raw)
}
export function saveTemplates(list) { localStorage.setItem(KEY, JSON.stringify(list)) }
