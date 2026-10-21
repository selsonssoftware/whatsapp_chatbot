import { describe, it, expect } from 'vitest'
import { simulateWorkflowRun, validateWorkflow } from './automationService.js'

const node = (id, type, config = {}) => ({ id, type, config })
const edge = (from, to) => ({ from, to })

const validNodes = [
  node('n1', 'Trigger', { triggerType: 'Event' }),
  node('n2', 'Send Message', { message: 'Hi {{name}}' }),
  node('n3', 'End'),
]
const validEdges = [edge('n1', 'n2'), edge('n2', 'n3')]

describe('validateWorkflow', () => {
  it('accepts a complete workflow', () => {
    expect(validateWorkflow(validNodes, validEdges)).toEqual([])
  })

  it('requires a trigger and an end node', () => {
    const errors = validateWorkflow([node('n1', 'Send Message', { message: 'x' })], [])
    expect(errors).toContain('Missing trigger node')
    expect(errors).toContain('Missing end node')
  })

  it('allows only one trigger', () => {
    const errors = validateWorkflow(
      [...validNodes, node('n4', 'Trigger', { triggerType: 'Event' })],
      validEdges
    )
    expect(errors).toContain('Only one trigger node is allowed')
  })

  it('flags a keyword trigger without a keyword', () => {
    const errors = validateWorkflow(
      [node('n1', 'Trigger', { triggerType: 'Keyword' }), node('n2', 'End')],
      [edge('n1', 'n2')]
    )
    expect(errors).toContain('Trigger node needs a keyword')
  })

  it('flags a message node without text', () => {
    const errors = validateWorkflow([node('n1', 'Send Message', {}), node('n2', 'End')], [edge('n1', 'n2')])
    expect(errors).toContain('Send Message node n1 needs message text')
  })

  it('flags a condition node without branches', () => {
    const errors = validateWorkflow(
      [node('n1', 'Trigger', { triggerType: 'Event' }), node('n2', 'Condition', {}), node('n3', 'End')],
      [edge('n1', 'n2')]
    )
    expect(errors).toContain('Condition node n2 is missing its branches')
  })

  it('flags a node that is not connected to the next step', () => {
    const errors = validateWorkflow(
      [...validNodes, node('n4', 'Add Tag', { tag: 'vip' })],
      validEdges
    )
    expect(errors).toContain('Node n4 (Add Tag) is not connected to the next step')
  })
})

describe('simulateWorkflowRun', () => {
  it('walks the graph from the trigger to the end', () => {
    const result = simulateWorkflowRun(validNodes, validEdges)
    expect(result.path).toEqual(['n1', 'n2', 'n3'])
    expect(result.unvisited).toEqual([])
  })

  it('reports every node as unvisited when there is no trigger', () => {
    const result = simulateWorkflowRun([node('n1', 'End')], [])
    expect(result.path).toEqual([])
    expect(result.unvisited).toEqual(['n1'])
  })

  it('stops on a cycle instead of looping forever', () => {
    const nodes = [node('n1', 'Trigger', { triggerType: 'Event' }), node('n2', 'Send Message', { message: 'x' })]
    const result = simulateWorkflowRun(nodes, [edge('n1', 'n2'), edge('n2', 'n1')])
    expect(result.path).toEqual(['n1', 'n2'])
  })
})
