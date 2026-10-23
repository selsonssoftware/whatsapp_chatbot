import { DEMO_CONVERSATIONS, DEMO_MESSAGES } from '../data/chatDemoData.js'

const CONVERSATIONS_KEY = 'wa_demo_conversations'
const MESSAGES_KEY = 'wa_demo_messages'
const SELECTED_SUPPORTER_KEY = 'wa_demo_supporter'

function readValue(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeValue(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * Demo conversations. The store is seeded on first use so a fresh browser shows
 * the prototype immediately.
 */
export function getDemoConversations() {
  const stored = readValue(CONVERSATIONS_KEY, null)
  if (!Array.isArray(stored)) {
    writeValue(CONVERSATIONS_KEY, DEMO_CONVERSATIONS)
    return DEMO_CONVERSATIONS
  }
  return stored
}

export function saveDemoConversations(list) {
  writeValue(CONVERSATIONS_KEY, list)
}

/**
 * Demo messages, keyed by conversation id.
 */
export function getDemoMessages() {
  const stored = readValue(MESSAGES_KEY, null)
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) {
    writeValue(MESSAGES_KEY, DEMO_MESSAGES)
    return DEMO_MESSAGES
  }
  return stored
}

export function saveDemoMessages(messages) {
  writeValue(MESSAGES_KEY, messages)
}

/**
 * The demo supporter picked in the supporter inbox. Kept in localStorage so the
 * selection survives a refresh.
 */
export function getSelectedSupporterId() {
  return readValue(SELECTED_SUPPORTER_KEY, null)
}

export function setSelectedSupporterId(id) {
  writeValue(SELECTED_SUPPORTER_KEY, id)
}

/**
 * Filters the conversation list by free text, status and assigned supporter.
 */
export function filterConversations(conversations, { search = '', status = 'all', supporterId = 'all' } = {}) {
  const term = String(search || '').trim().toLowerCase()

  return (conversations || []).filter((conversation) => {
    const matchesSearch = !term || conversation.searchText?.toLowerCase().includes(term)
    const matchesStatus =
      status === 'all' ||
      (status === 'unread' ? (conversation.unread || 0) > 0 : conversation.status === status)
    const matchesSupporter = supporterId === 'all' || conversation.supporterId === supporterId
    return matchesSearch && matchesStatus && matchesSupporter
  })
}

export function countAssigned(conversations, supporterId) {
  return (conversations || []).filter((conversation) => conversation.supporterId === supporterId).length
}

export function countUnread(conversations, supporterId) {
  const scoped = !supporterId || supporterId === 'all'
  return (conversations || [])
    .filter((conversation) => (scoped ? true : conversation.supporterId === supporterId))
    .reduce((total, conversation) => total + (conversation.unread || 0), 0)
}

export function getLastMessage(messages, conversationId) {
  const thread = messages?.[conversationId] || []
  return thread[thread.length - 1] || null
}

export function getThread(messages, conversationId) {
  return messages?.[conversationId] || []
}

/**
 * Appends an outgoing message to a thread.
 */
export function appendMessage(messages, conversationId, text) {
  const body = String(text || '').trim()
  if (!body) return messages

  const message = {
    id: `local-${Date.now()}`,
    conversationId,
    direction: 'outgoing',
    text: body,
    at: new Date().toISOString(),
    status: 'sent',
  }

  return { ...messages, [conversationId]: [...getThread(messages, conversationId), message] }
}

/**
 * Assigns or reassigns a conversation to a supporter.
 */
export function assignConversation(conversations, conversationId, supporterId) {
  return (conversations || []).map((conversation) =>
    conversation.id === conversationId ? { ...conversation, supporterId: supporterId || null } : conversation
  )
}

export function updateConversationStatus(conversations, conversationId, status) {
  return (conversations || []).map((conversation) =>
    conversation.id === conversationId ? { ...conversation, status } : conversation
  )
}

/**
 * Clears the unread counter when a conversation is opened.
 */
export function markConversationRead(conversations, conversationId) {
  return (conversations || []).map((conversation) =>
    conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation
  )
}

/**
 * The most recent thread entries, newest first, used by the details panel.
 */
export function getRecentActivity(messages, conversationId, limit = 6) {
  return [...getThread(messages, conversationId)].slice(-limit).reverse()
}

/**
 * Headline numbers for the monitoring views.
 */
export function getConversationStats(conversations) {
  const list = conversations || []
  return {
    total: list.length,
    open: list.filter((conversation) => conversation.status === 'open').length,
    pending: list.filter((conversation) => conversation.status === 'pending').length,
    closed: list.filter((conversation) => conversation.status === 'closed').length,
    unread: list.reduce((total, conversation) => total + (conversation.unread || 0), 0),
    unassigned: list.filter((conversation) => !conversation.supporterId).length,
  }
}

/**
 * Joins a conversation with its customer and supporter and prepares the text
 * used by the list search.
 */
export function decorateConversations(conversations, customers = [], supporters = []) {
  return (conversations || []).map((conversation) => {
    const customer = customers.find((item) => item.id === conversation.customerId) || null
    const supporter = supporters.find((item) => item.id === conversation.supporterId) || null
    return {
      ...conversation,
      customer,
      supporter,
      searchText: [customer?.name, customer?.phone, customer?.email, conversation.id]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
    }
  })
}
