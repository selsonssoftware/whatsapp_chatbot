export const DEMO_CONTACTS = [
  { id: 1, firstName: 'John', lastName: 'Doe', phone: '+1234567890', email: 'john@example.com', company: 'Acme', tags: ['vip'], groups: ['Customers'], status: 'active', createdAt: '2026-01-01', notes: 'Demo contact' },
  { id: 2, firstName: 'Jane', lastName: 'Smith', phone: '+1987654321', email: 'jane@example.com', company: 'Beta', tags: ['lead'], groups: ['Leads'], status: 'active', createdAt: '2026-01-02', notes: '' },
]

export const DEMO_CONVERSATIONS = [
  { id: 1, contactId: 1, status: 'open', priority: 'high', assignedTo: 'Alex Agent', unread: 2, lastMessage: 'Hello, I need help', lastTime: '10:30', messages: [{ id: 1, type: 'incoming', text: 'Hello, I need help', time: '10:30' }], notes: [] },
  { id: 2, contactId: 2, status: 'resolved', priority: 'low', assignedTo: null, unread: 0, lastMessage: 'Thanks!', lastTime: '09:15', messages: [{ id: 1, type: 'incoming', text: 'Thanks!', time: '09:15' }], notes: [] },
]
