const KEY = 'wa_ai_agents'
const TESTS_KEY = 'wa_ai_agent_tests'

const seedAgents = [
  {
    id: 1,
    name: 'Support Assistant',
    description: 'Handles customer support queries',
    status: 'Active',
    instructions: 'You are a helpful customer support assistant. Be polite, clear, and concise.',
    welcomeMessage: 'Hi! I am the support assistant. How can I help?',
    tone: 'Professional',
    fallback: 'I could not find an answer in the knowledge base. A human agent will follow up.',
    businessHours: 'Mon-Fri 09:00-18:00',
    available: true,
    responseDelay: 800,
    knowledge: [
      { id: 'k1', title: 'Product information', category: 'Product', text: 'Premium T-Shirt is a 100% cotton t-shirt priced at $29.99.' },
      { id: 'k2', title: 'Pricing details', category: 'Pricing', text: 'Wireless Headphones cost $99.99 and include a 1 year warranty.' },
      { id: 'k3', title: 'Return policy', category: 'Policy', text: 'Returns are accepted within 30 days with a receipt.' },
    ],
    tools: ['Search knowledge base', 'Handoff to human'],
    handoffThreshold: 0.7,
    updatedAt: '2026-01-10',
  },
  {
    id: 2,
    name: 'Sales Bot',
    description: 'Assists with product recommendations',
    status: 'Draft',
    instructions: 'You are a sales assistant. Help customers find the right products.',
    welcomeMessage: 'Welcome! Looking for a product recommendation?',
    tone: 'Friendly',
    fallback: 'Let me pass this to a sales teammate.',
    businessHours: 'Mon-Sat 10:00-20:00',
    available: true,
    responseDelay: 600,
    knowledge: [
      { id: 'k1', title: 'Product catalog', category: 'Product', text: 'Running Shoes RS001 are $79.99 and available in 3 sizes.' },
      { id: 'k2', title: 'Discount offers', category: 'Pricing', text: 'Flash sale gives 10% off orders over $100.' },
    ],
    tools: ['Product search', 'Send recommendations'],
    handoffThreshold: 0.5,
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

function normalizeAgent(agent) {
  const knowledge = (agent.knowledge || []).map((entry, index) =>
    typeof entry === 'string'
      ? { id: `${agent.id}-k${index + 1}`, title: entry, category: 'FAQ', text: entry }
      : { id: entry.id || `${agent.id}-k${index + 1}`, title: entry.title || '', category: entry.category || 'FAQ', text: entry.text || '' }
  )
  return {
    ...agent,
    tone: agent.tone || 'Professional',
    tools: agent.tools || [],
    welcomeMessage: agent.welcomeMessage || '',
    fallback: agent.fallback || 'I could not find an answer in the knowledge base.',
    businessHours: agent.businessHours || 'Mon-Fri 09:00-18:00',
    available: agent.available !== false,
    responseDelay: agent.responseDelay ?? 700,
    handoffThreshold: agent.handoffThreshold ?? 0.7,
    knowledge,
  }
}

export function getAgents() {
  return readList(KEY, seedAgents).map(normalizeAgent)
}

export function saveAgents(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function getAgentTests() {
  return readList(TESTS_KEY, [])
}

export function saveAgentTests(list) {
  localStorage.setItem(TESTS_KEY, JSON.stringify(list))
}

export function recordAgentTest(record) {
  const tests = getAgentTests()
  const next = [
    ...tests,
    {
      id: tests.reduce((max, t) => Math.max(max, t.id), 0) + 1,
      ...record,
      createdAt: new Date().toISOString(),
    },
  ]
  saveAgentTests(next)
  return next
}

export function clearAgentTests(agentId) {
  const next = getAgentTests().filter((t) => t.agentId !== agentId)
  saveAgentTests(next)
  return next
}

/**
 * Local keyword matching used by the agent playground. No AI model is contacted.
 */
export function matchKnowledge(agent, message) {
  const text = String(message || '').toLowerCase()
  const entries = agent?.knowledge || []
  const matches = entries.filter((entry) => {
    const words = `${entry.title || ''} ${entry.text || ''} ${entry.category || ''}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 3)
    return words.some((word) => text.includes(word))
  })
  const score = entries.length ? matches.length / entries.length : 0
  return { matches, score }
}

export function simulateAgentReply(agent, message) {
  const { matches, score } = matchKnowledge(agent, message)
  const threshold = Number(agent?.handoffThreshold ?? 0.7)

  if (!agent?.available) {
    return {
      text: 'This agent is currently outside its business hours. A human agent will follow up.',
      matched: [],
      handoff: true,
      reason: 'outside-business-hours',
    }
  }

  if (matches.length === 0) {
    return {
      text: agent?.fallback || 'I could not find an answer in the knowledge base.',
      matched: [],
      handoff: score >= threshold,
      reason: 'no-knowledge-match',
    }
  }

  const answer = matches.map((m) => m.text).join(' ')
  return {
    text: `${agent?.tone === 'Friendly' ? 'Sure! ' : ''}${answer}`,
    matched: matches,
    handoff: score < threshold,
    reason: score < threshold ? 'low-confidence' : 'answered',
  }
}
