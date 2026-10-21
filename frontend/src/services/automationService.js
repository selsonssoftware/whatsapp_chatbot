const KEY = 'wa_automations'

const seed = [
  {
    id: 1,
    name: 'Welcome Flow',
    description: 'Greets new contacts and tags them as new lead',
    status: 'Active',
    enabled: true,
    trigger: 'new_contact',
    triggerType: 'Event',
    triggerKeyword: '',
    triggerTime: '',
    nodes: [
      { id: 'n1', type: 'Trigger', config: { triggerType: 'Event', event: 'new_contact' }, runs: 0, x: 40, y: 40 },
      { id: 'n2', type: 'Send Message', config: { message: 'Hi {{name}}, welcome to our shop!' }, runs: 0, x: 220, y: 40 },
      { id: 'n3', type: 'Add Tag', config: { tag: 'new-lead' }, runs: 0, x: 400, y: 40 },
      { id: 'n4', type: 'End', config: {}, runs: 0, x: 580, y: 40 },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
      { from: 'n3', to: 'n4' },
    ],
    executions: 128,
    lastRunAt: '2026-01-14',
    updatedAt: '2026-01-14',
  },
  {
    id: 2,
    name: 'Order Status Reply',
    description: 'Answers keyword "order" with a status template',
    status: 'Draft',
    enabled: false,
    trigger: 'keyword',
    triggerType: 'Keyword',
    triggerKeyword: 'order',
    triggerTime: '',
    nodes: [
      { id: 'n1', type: 'Trigger', config: { triggerType: 'Keyword', keyword: 'order' }, runs: 0, x: 40, y: 40 },
      { id: 'n2', type: 'Send Template', config: { templateId: 'order_status_update' }, runs: 0, x: 220, y: 40 },
      { id: 'n3', type: 'End', config: {}, runs: 0, x: 400, y: 40 },
    ],
    edges: [
      { from: 'n1', to: 'n2' },
      { from: 'n2', to: 'n3' },
    ],
    executions: 0,
    lastRunAt: '',
    updatedAt: '2026-01-12',
  },
]

function readList() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seed))
      return seed
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seed
  } catch {
    localStorage.setItem(KEY, JSON.stringify(seed))
    return seed
  }
}

export function getAutomations() {
  return readList()
}

export function saveAutomations(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export const NODE_TYPES = [
  'Trigger',
  'Send Message',
  'Send Template',
  'Condition',
  'Delay',
  'Add Tag',
  'Assign Agent',
  'Add to Group',
  'AI Agent',
  'Webhook',
  'End',
]

export function validateWorkflow(nodes, edges) {
  const errors = []
  const triggers = nodes.filter((n) => n.type === 'Trigger')
  if (triggers.length === 0) errors.push('Missing trigger node')
  if (triggers.length > 1) errors.push('Only one trigger node is allowed')
  if (!nodes.some((n) => n.type === 'End')) errors.push('Missing end node')

  triggers.forEach((t) => {
    if (t.config?.triggerType === 'Keyword' && !String(t.config?.keyword || '').trim()) {
      errors.push('Trigger node needs a keyword')
    }
    if (t.config?.triggerType === 'Schedule' && !String(t.config?.time || '').trim()) {
      errors.push('Trigger node needs a schedule time')
    }
  })

  nodes.forEach((n) => {
    if (n.type === 'Condition' && !edges.some((e) => e.from === n.id)) {
      errors.push(`Condition node ${n.id} is missing its branches`)
    }
    if (n.type === 'Send Message' && !String(n.config?.message || '').trim()) {
      errors.push(`Send Message node ${n.id} needs message text`)
    }
    if (n.type === 'Send Template' && !String(n.config?.templateId || '').trim()) {
      errors.push(`Send Template node ${n.id} needs a template id`)
    }
    if (n.type === 'Add Tag' && !String(n.config?.tag || '').trim()) {
      errors.push(`Add Tag node ${n.id} needs a tag`)
    }
    if (n.type === 'Assign Agent' && !String(n.config?.agent || '').trim()) {
      errors.push(`Assign Agent node ${n.id} needs an agent name`)
    }
    if (n.type !== 'End' && n.type !== 'Trigger' && !edges.some((e) => e.from === n.id)) {
      errors.push(`Node ${n.id} (${n.type}) is not connected to the next step`)
    }
  })

  return errors
}

/**
 * Simulates a workflow run by walking the node graph from the trigger.
 * Nothing is sent anywhere; the result is only used for the run report.
 */
export function simulateWorkflowRun(nodes, edges) {
  const trigger = nodes.find((n) => n.type === 'Trigger')
  if (!trigger) return { path: [], unvisited: nodes.map((n) => n.id) }

  const path = []
  const visited = new Set()
  let current = trigger

  while (current) {
    path.push(current.id)
    visited.add(current.id)
    if (current.type === 'End') break
    const next = edges.find((e) => e.from === current.id)
    current = next ? nodes.find((n) => n.id === next.to) : null
    if (current && visited.has(current.id)) break
  }

  return {
    path,
    unvisited: nodes.filter((n) => !visited.has(n.id)).map((n) => n.id),
  }
}
