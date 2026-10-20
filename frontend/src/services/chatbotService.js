const KEY = 'wa_chatbots'

const seedBots = [
  {
    id: 1,
    name: 'Customer Support Bot',
    status: 'Active',
    description: 'Handles common customer queries',
    nodes: [],
    edges: [],
    createdAt: '2026-01-10',
  },
  {
    id: 2,
    name: 'Sales Assistant',
    status: 'Draft',
    description: 'Helps customers with product information',
    nodes: [],
    edges: [],
    createdAt: '2026-01-12',
  },
]

export function getChatbots() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seedBots))
      return seedBots
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seedBots
  } catch {
    localStorage.setItem(KEY, JSON.stringify(seedBots))
    return seedBots
  }
}

export function saveChatbots(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function validateChatbotFlow(nodes, edges) {
  const errors = []
  if (!nodes || nodes.length === 0) {
    errors.push('Add at least one node before activating')
    return errors
  }
  if (!nodes.some((n) => n.type === 'Start')) errors.push('Missing Start node')
  if (!nodes.some((n) => n.type === 'End')) errors.push('Missing End node')
  nodes.forEach((n) => {
    if (n.type === 'Send Message' && !n.config?.message) errors.push(`"${n.type}" node ${n.id} needs a message`)
    if (n.type === 'Ask Question' && !n.config?.question) errors.push(`"${n.type}" node ${n.id} needs a question`)
    if (n.type === 'Condition' && !n.config?.condition) errors.push(`"${n.type}" node ${n.id} needs a condition`)
    if (n.type === 'Condition' && !edges.some((e) => e.from === n.id)) errors.push(`Condition node ${n.id} needs at least one branch`)
  })
  return errors
}
