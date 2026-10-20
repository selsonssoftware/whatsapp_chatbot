const KEY = 'wa_flows'
const SUBMISSIONS_KEY = 'wa_flow_submissions'

const seedFlows = [
  {
    id: 1,
    name: 'Product Feedback',
    description: 'Collect customer feedback on products',
    status: 'Published',
    screens: [
      {
        id: 's1',
        name: 'Welcome',
        fields: [{ id: 'f1', type: 'text', label: 'Your Name', key: 'name', required: true, placeholder: 'Enter your name' }],
      },
      {
        id: 's2',
        name: 'Rating',
        fields: [
          { id: 'f2', type: 'radio', label: 'Rating', key: 'rating', required: true, options: ['1', '2', '3', '4', '5'] },
          { id: 'f3', type: 'textarea', label: 'Comments', key: 'comments', required: false },
        ],
      },
    ],
    updatedAt: '2026-01-10',
  },
  {
    id: 2,
    name: 'Order Status',
    description: 'Check order status',
    status: 'Draft',
    screens: [{ id: 's1', name: 'Order ID', fields: [{ id: 'f1', type: 'text', label: 'Order ID', key: 'orderId', required: true }] }],
    updatedAt: '2026-01-12',
  },
]

function readList(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
}

export function getFlows() {
  return readList(KEY, seedFlows)
}

export function saveFlows(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function getFlowSubmissions() {
  return readList(SUBMISSIONS_KEY, [])
}

export function saveFlowSubmissions(list) {
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(list))
}

export function validateFlowDefinition(flow) {
  const errors = []
  if (!flow) return ['No flow selected']
  if (!flow.name || !flow.name.trim()) errors.push('Flow name is required')
  if (!flow.screens || flow.screens.length === 0) errors.push('Add at least one screen')
  const keys = []
  ;(flow.screens || []).forEach((screen) => {
    if (!screen.name || !screen.name.trim()) errors.push('Every screen needs a name')
    ;(screen.fields || []).forEach((field) => {
      if (!field.label || !field.label.trim()) errors.push(`Field ${field.id} needs a label`)
      if (!field.key || !field.key.trim()) errors.push(`Field ${field.id} needs a field name`)
      if (keys.includes(field.key)) errors.push(`Duplicate field name "${field.key}"`)
      keys.push(field.key)
      if (['radio', 'checkbox', 'dropdown'].includes(field.type) && (!field.options || field.options.length === 0)) {
        errors.push(`Field "${field.label}" needs at least one option`)
      }
    })
  })
  return errors
}

export function validateSubmission(flow, data) {
  const errors = {}
  ;(flow?.screens || []).forEach((screen) => {
    ;(screen.fields || []).forEach((field) => {
      const value = data?.[field.key]
      const empty = value === undefined || value === '' || value === null || (Array.isArray(value) && value.length === 0)
      if (field.required && empty) {
        errors[field.key] = `${field.label} is required`
        return
      }
      if (!empty && field.type === 'text' && String(field.key || '').toLowerCase().includes('email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
        errors[field.key] = 'Enter a valid email address'
      }
    })
  })
  return errors
}

export function submitFlow(flow, data) {
  const submissions = getFlowSubmissions()
  const record = {
    id: submissions.reduce((max, s) => Math.max(max, s.id), 0) + 1,
    flowId: flow.id,
    flowName: flow.name,
    data,
    submittedAt: new Date().toISOString(),
  }
  saveFlowSubmissions([...submissions, record])
  return record
}
