import { describe, it, expect, beforeEach } from 'vitest'
import { installLocalStorage } from '../test/localStorageMock.js'
import { DEMO_CONVERSATIONS, DEMO_CUSTOMERS, DEMO_MESSAGES } from '../data/chatDemoData.js'
import {
  appendMessage,
  assignConversation,
  countAssigned,
  countUnread,
  decorateConversations,
  filterConversations,
  getConversationStats,
  getDemoConversations,
  getDemoMessages,
  getLastMessage,
  getRecentActivity,
  getSelectedSupporterId,
  markConversationRead,
  saveDemoConversations,
  setSelectedSupporterId,
  updateConversationStatus,
} from './chatDemoService.js'

let storage

beforeEach(() => {
  storage = installLocalStorage()
})

describe('demo store', () => {
  it('seeds conversations and messages on first use', () => {
    expect(getDemoConversations().length).toBe(DEMO_CONVERSATIONS.length)
    expect(Object.keys(getDemoMessages()).length).toBe(Object.keys(DEMO_MESSAGES).length)
  })

  it('persists changes', () => {
    const next = updateConversationStatus(getDemoConversations(), 'conv-1', 'closed')
    saveDemoConversations(next)
    expect(getDemoConversations().find((c) => c.id === 'conv-1').status).toBe('closed')
  })

  it('falls back to the seed data when the stored json is corrupted', () => {
    storage.setItem('wa_demo_conversations', '{not json')
    expect(getDemoConversations().length).toBe(DEMO_CONVERSATIONS.length)
  })

  it('remembers the selected demo supporter', () => {
    setSelectedSupporterId('sup-2')
    expect(getSelectedSupporterId()).toBe('sup-2')
  })
})

describe('decorateConversations', () => {
  it('joins the customer and the supporter', () => {
    const [conversation] = decorateConversations(DEMO_CONVERSATIONS, DEMO_CUSTOMERS, [
      { id: 'sup-1', name: 'Ravi Kumar' },
    ])
    expect(conversation.customer.name).toBe('Ramesh Iyer')
    expect(conversation.supporter.name).toBe('Ravi Kumar')
    expect(conversation.searchText).toContain('ramesh')
  })
})

describe('filterConversations', () => {
  const conversations = decorateConversations(DEMO_CONVERSATIONS, DEMO_CUSTOMERS, [])

  it('matches the customer name and the phone number', () => {
    expect(filterConversations(conversations, { search: 'ramesh' }).length).toBeGreaterThan(0)
    expect(filterConversations(conversations, { search: '98765 43210' }).length).toBe(2)
    expect(filterConversations(conversations, { search: 'nobody' })).toEqual([])
  })

  it('filters by status', () => {
    expect(filterConversations(conversations, { status: 'open' }).every((c) => c.status === 'open')).toBe(true)
    expect(filterConversations(conversations, { status: 'closed' }).every((c) => c.status === 'closed')).toBe(true)
  })

  it('filters by unread counter', () => {
    const unread = filterConversations(conversations, { status: 'unread' })
    expect(unread.length).toBeGreaterThan(0)
    expect(unread.every((conversation) => conversation.unread > 0)).toBe(true)
  })

  it('filters by assigned supporter', () => {
    const filtered = filterConversations(conversations, { supporterId: 'sup-1' })
    expect(filtered.length).toBeGreaterThan(0)
    expect(filtered.every((conversation) => conversation.supporterId === 'sup-1')).toBe(true)
  })
})

describe('workload counters', () => {
  it('counts assigned conversations and unread chats per supporter', () => {
    expect(countAssigned(DEMO_CONVERSATIONS, 'sup-1')).toBe(2)
    expect(countAssigned(DEMO_CONVERSATIONS, 'sup-99')).toBe(0)
    expect(countUnread(DEMO_CONVERSATIONS, 'sup-1')).toBe(2)
    expect(countUnread(DEMO_CONVERSATIONS)).toBe(
      DEMO_CONVERSATIONS.reduce((total, conversation) => total + conversation.unread, 0)
    )
  })
})

describe('conversation updates', () => {
  it('assigns and reassigns a conversation', () => {
    const assigned = assignConversation(DEMO_CONVERSATIONS, 'conv-1', 'sup-5')
    expect(assigned.find((c) => c.id === 'conv-1').supporterId).toBe('sup-5')

    const cleared = assignConversation(assigned, 'conv-1', null)
    expect(cleared.find((c) => c.id === 'conv-1').supporterId).toBeNull()
  })

  it('changes the status', () => {
    const updated = updateConversationStatus(DEMO_CONVERSATIONS, 'conv-1', 'pending')
    expect(updated.find((c) => c.id === 'conv-1').status).toBe('pending')
  })

  it('clears the unread counter', () => {
    const read = markConversationRead(DEMO_CONVERSATIONS, 'conv-1')
    expect(read.find((c) => c.id === 'conv-1').unread).toBe(0)
  })
})

describe('messages', () => {
  it('appends an outgoing message to the thread', () => {
    const next = appendMessage(DEMO_MESSAGES, 'conv-1', 'Hello from the demo')
    const thread = next['conv-1']
    expect(thread[thread.length - 1]).toMatchObject({ direction: 'outgoing', text: 'Hello from the demo' })
    expect(thread.length).toBe(DEMO_MESSAGES['conv-1'].length + 1)
  })

  it('ignores empty messages', () => {
    expect(appendMessage(DEMO_MESSAGES, 'conv-1', '   ')).toBe(DEMO_MESSAGES)
  })

  it('reads the last message of a thread', () => {
    expect(getLastMessage(DEMO_MESSAGES, 'conv-1').text).toBe(DEMO_MESSAGES['conv-1'].at(-1).text)
    expect(getLastMessage(DEMO_MESSAGES, 'missing')).toBeNull()
  })

  it('returns the recent activity newest first', () => {
    const activity = getRecentActivity(DEMO_MESSAGES, 'conv-1', 3)
    expect(activity).toHaveLength(3)
    expect(activity[0].id).toBe(DEMO_MESSAGES['conv-1'].at(-1).id)
  })
})

describe('getConversationStats', () => {
  it('summarises the workload', () => {
    const stats = getConversationStats(DEMO_CONVERSATIONS)
    expect(stats.total).toBe(DEMO_CONVERSATIONS.length)
    expect(stats.unread).toBeGreaterThan(0)
    expect(stats.open + stats.pending + stats.closed).toBe(DEMO_CONVERSATIONS.length)
  })
})
