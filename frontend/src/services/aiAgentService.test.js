import { describe, it, expect } from 'vitest'
import { matchKnowledge, simulateAgentReply } from './aiAgentService.js'

const agent = {
  name: 'Support Assistant',
  tone: 'Professional',
  available: true,
  handoffThreshold: 0.7,
  fallback: 'I could not find an answer in the knowledge base.',
  knowledge: [
    { id: 'k1', title: 'Product information', category: 'Product', text: 'Premium T-Shirt is a 100% cotton t-shirt priced at $29.99.' },
    { id: 'k2', title: 'Return policy', category: 'Policy', text: 'Returns are accepted within 30 days with a receipt.' },
  ],
}

describe('matchKnowledge', () => {
  it('matches an entry that shares a keyword', () => {
    const result = matchKnowledge(agent, 'What is the return policy?')
    expect(result.matches.map((m) => m.id)).toEqual(['k2'])
    expect(result.score).toBeCloseTo(0.5)
  })

  it('returns no match for an unrelated message', () => {
    const result = matchKnowledge(agent, 'hello there')
    expect(result.matches).toEqual([])
    expect(result.score).toBe(0)
  })

  it('handles an agent without knowledge entries', () => {
    expect(matchKnowledge({ knowledge: [] }, 'anything')).toEqual({ matches: [], score: 0 })
  })
})

describe('simulateAgentReply', () => {
  it('answers from the knowledge base when confidence is high enough', () => {
    const singleEntryAgent = { ...agent, knowledge: [agent.knowledge[1]] }
    const reply = simulateAgentReply(singleEntryAgent, 'Tell me about the return policy')
    expect(reply.handoff).toBe(false)
    expect(reply.reason).toBe('answered')
    expect(reply.text).toContain('Returns are accepted within 30 days')
  })

  it('hands off when only part of the knowledge base matches', () => {
    const reply = simulateAgentReply(agent, 'Tell me about the return policy')
    expect(reply.handoff).toBe(true)
    expect(reply.reason).toBe('low-confidence')
  })

  it('hands off when the agent is outside its business hours', () => {
    const reply = simulateAgentReply({ ...agent, available: false }, 'anything')
    expect(reply.handoff).toBe(true)
    expect(reply.reason).toBe('outside-business-hours')
  })

  it('uses the configured fallback when nothing matches', () => {
    const reply = simulateAgentReply(agent, 'zzzz qqqq')
    expect(reply.text).toBe(agent.fallback)
    expect(reply.reason).toBe('no-knowledge-match')
  })

  it('hands off a weak match below the confidence threshold', () => {
    const reply = simulateAgentReply({ ...agent, handoffThreshold: 0.9 }, 'Tell me about the return policy')
    expect(reply.handoff).toBe(true)
    expect(reply.reason).toBe('low-confidence')
  })
})
