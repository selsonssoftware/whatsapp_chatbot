const KEY = 'demo_automations'
const seed = [{ id: 1, name: 'Welcome Flow', description: 'Demo', status: 'Draft', trigger: 'new_contact', nodes: [{ id: 'n1', type: 'Trigger', config: { event: 'new_contact' } }], edges: [], executions: 0, updatedAt: '2026-01-01' }]
export function getAutomations() { const raw = localStorage.getItem(KEY); if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed } return JSON.parse(raw) }
export function saveAutomations(list) { localStorage.setItem(KEY, JSON.stringify(list)) }
