const KEY = 'demo_flows'
const seed = [{ id: 1, name: 'Demo Flow', description: 'Demo', status: 'Draft', screens: [{ id: 's1', name: 'Screen 1', fields: [] }], updatedAt: '2026-01-01' }]
export function getFlows() { const raw = localStorage.getItem(KEY); if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed } return JSON.parse(raw) }
export function saveFlows(list) { localStorage.setItem(KEY, JSON.stringify(list)) }
