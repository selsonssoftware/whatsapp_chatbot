import { describe, it, expect } from 'vitest'
import { validateChatbotFlow } from './chatbotService.js'
import { validateFlowDefinition, validateSubmission } from './flowsService.js'

const node = (id, type, config = {}) => ({ id, type, config })

describe('validateChatbotFlow', () => {
  it('requires at least one node', () => {
    expect(validateChatbotFlow([], [])).toEqual(['Add at least one node before activating'])
  })

  it('requires a start and an end node', () => {
    const errors = validateChatbotFlow([node('n1', 'Send Message', { message: 'hi' })], [])
    expect(errors).toContain('Missing Start node')
    expect(errors).toContain('Missing End node')
  })

  it('requires content on message, question and condition nodes', () => {
    const errors = validateChatbotFlow(
      [node('s', 'Start'), node('m', 'Send Message'), node('q', 'Ask Question'), node('c', 'Condition'), node('e', 'End')],
      []
    )
    expect(errors).toContain('"Send Message" node m needs a message')
    expect(errors).toContain('"Ask Question" node q needs a question')
    expect(errors).toContain('"Condition" node c needs a condition')
    expect(errors).toContain('Condition node c needs at least one branch')
  })

  it('accepts a complete flow', () => {
    const errors = validateChatbotFlow(
      [node('s', 'Start'), node('m', 'Send Message', { message: 'hi' }), node('e', 'End')],
      [{ from: 's', to: 'm' }, { from: 'm', to: 'e' }]
    )
    expect(errors).toEqual([])
  })
})

describe('validateFlowDefinition', () => {
  const flow = {
    name: 'Order form',
    screens: [
      {
        name: 'Details',
        fields: [
          { id: 'f1', key: 'email', label: 'Email', type: 'text', required: true },
          { id: 'f2', key: 'size', label: 'Size', type: 'dropdown', options: ['S', 'M'] },
        ],
      },
    ],
  }

  it('accepts a valid definition', () => {
    expect(validateFlowDefinition(flow)).toEqual([])
  })

  it('requires a name and at least one screen', () => {
    const errors = validateFlowDefinition({ name: ' ', screens: [] })
    expect(errors).toContain('Flow name is required')
    expect(errors).toContain('Add at least one screen')
  })

  it('rejects duplicate field names', () => {
    const errors = validateFlowDefinition({
      name: 'Order form',
      screens: [
        {
          name: 'Details',
          fields: [
            { id: 'f1', key: 'email', label: 'Email', type: 'text' },
            { id: 'f2', key: 'email', label: 'Email again', type: 'text' },
          ],
        },
      ],
    })
    expect(errors).toContain('Duplicate field name "email"')
  })

  it('requires options for choice fields', () => {
    const errors = validateFlowDefinition({
      name: 'Order form',
      screens: [{ name: 'Details', fields: [{ id: 'f1', key: 'size', label: 'Size', type: 'radio' }] }],
    })
    expect(errors).toContain('Field "Size" needs at least one option')
  })
})

describe('validateSubmission', () => {
  const flow = {
    screens: [
      {
        name: 'Details',
        fields: [
          { id: 'f1', key: 'email', label: 'Email', type: 'text', required: true },
          { id: 'f2', key: 'size', label: 'Size', type: 'dropdown', options: ['S'], required: false },
        ],
      },
    ],
  }

  it('flags a missing required value', () => {
    expect(validateSubmission(flow, {})).toEqual({ email: 'Email is required' })
  })

  it('flags an invalid email address', () => {
    expect(validateSubmission(flow, { email: 'not-an-email' })).toEqual({ email: 'Enter a valid email address' })
  })

  it('accepts a valid submission', () => {
    expect(validateSubmission(flow, { email: 'a@b.com' })).toEqual({})
  })
})
