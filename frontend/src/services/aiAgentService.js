const KEY = 'demo_ai_agents'
const seed = [{ id: 1, name: 'Support Agent', description: 'Demo', status: 'Draft', instructions: 'Be helpful', knowledge: [], updatedAt: '2026-01-01' }]
export function getAgents() { const raw = localStorage.getItem(KEY); if (!raw) { localStorage.setItem(KEY, JSON.stringify(seed)); return seed } return JSON.parse(raw) }
export function saveAgents(list) { localStorage.setItem(KEY, JSON.stringify(list)) }
