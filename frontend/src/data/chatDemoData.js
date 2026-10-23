/**
 * Sample data for the supporter chat monitoring prototype.
 *
 * Everything in this file is fictional demo content. No real customer, phone
 * number or WhatsApp message is represented here, and nothing in the app ever
 * leaves the browser.
 */

const now = Date.now()
const minutesAgo = (minutes) => new Date(now - minutes * 60 * 1000).toISOString()

export const DEMO_CUSTOMERS = [
  {
    id: 'cust-1',
    name: 'Ramesh Iyer',
    phone: '+91 98765 43210',
    email: 'ramesh.iyer@example.com',
    company: 'Iyer Textiles',
    location: 'Coimbatore, TN',
    notes: 'Bought two units in the last campaign. Prefers WhatsApp updates over calls.',
    tags: ['VIP', 'Repeat buyer'],
  },
  {
    id: 'cust-2',
    name: 'Fatima Sheikh',
    phone: '+91 91234 56781',
    email: 'fatima.sheikh@example.com',
    company: 'Sheikh Traders',
    location: 'Chennai, TN',
    notes: 'Asked about bulk pricing and a 30 day payment term.',
    tags: ['B2B'],
  },
  {
    id: 'cust-3',
    name: 'Suresh Menon',
    phone: '+91 99887 66554',
    email: '',
    company: '',
    location: 'Kochi, KL',
    notes: 'No email on file. Follow up on the pending order.',
    tags: [],
  },
  {
    id: 'cust-4',
    name: 'Aisha Begum',
    phone: '+971 50 123 4567',
    email: 'aisha.begum@example.com',
    company: 'Gulf Retail LLC',
    location: 'Dubai, UAE',
    notes: 'Reseller handling the Middle East region. Timezone GMT+4.',
    tags: ['Reseller'],
  },
  {
    id: 'cust-5',
    name: 'Vinod Pillai',
    phone: '+91 94477 82233',
    email: 'vinod.pillai@example.com',
    company: 'Pillai Motors',
    location: 'Madurai, TN',
    notes: 'Wants the invoice split across two GST numbers.',
    tags: ['B2B'],
  },
  {
    id: 'cust-6',
    name: 'Grace Fernandes',
    phone: '+91 90030 11223',
    email: 'grace.fernandes@example.com',
    company: 'Fernandes Exports',
    location: 'Goa, GA',
    notes: 'Requested a catalogue in Portuguese for the next shipment.',
    tags: ['New lead'],
  },
]

export const DEMO_CONVERSATIONS = [
  {
    id: 'conv-1',
    customerId: 'cust-1',
    supporterId: 'sup-1',
    status: 'open',
    unread: 2,
    channel: 'whatsapp',
    createdAt: minutesAgo(220),
    lastMessageAt: minutesAgo(4),
  },
  {
    id: 'conv-2',
    customerId: 'cust-2',
    supporterId: 'sup-2',
    status: 'open',
    unread: 1,
    channel: 'whatsapp',
    createdAt: minutesAgo(180),
    lastMessageAt: minutesAgo(11),
  },
  {
    id: 'conv-3',
    customerId: 'cust-3',
    supporterId: 'sup-1',
    status: 'pending',
    unread: 0,
    channel: 'whatsapp',
    createdAt: minutesAgo(1500),
    lastMessageAt: minutesAgo(95),
  },
  {
    id: 'conv-4',
    customerId: 'cust-4',
    supporterId: 'sup-4',
    status: 'open',
    unread: 3,
    channel: 'whatsapp',
    createdAt: minutesAgo(640),
    lastMessageAt: minutesAgo(26),
  },
  {
    id: 'conv-5',
    customerId: 'cust-5',
    supporterId: 'sup-5',
    status: 'pending',
    unread: 0,
    channel: 'whatsapp',
    createdAt: minutesAgo(2900),
    lastMessageAt: minutesAgo(180),
  },
  {
    id: 'conv-6',
    customerId: 'cust-6',
    supporterId: 'sup-2',
    status: 'closed',
    unread: 0,
    channel: 'whatsapp',
    createdAt: minutesAgo(5200),
    lastMessageAt: minutesAgo(320),
  },
  {
    id: 'conv-7',
    customerId: 'cust-1',
    supporterId: 'sup-6',
    status: 'open',
    unread: 0,
    channel: 'whatsapp',
    createdAt: minutesAgo(420),
    lastMessageAt: minutesAgo(58),
  },
  {
    id: 'conv-8',
    customerId: 'cust-4',
    supporterId: 'sup-6',
    status: 'open',
    unread: 1,
    channel: 'whatsapp',
    createdAt: minutesAgo(300),
    lastMessageAt: minutesAgo(12),
  },
  {
    id: 'conv-9',
    customerId: 'cust-3',
    supporterId: 'sup-4',
    status: 'closed',
    unread: 0,
    channel: 'whatsapp',
    createdAt: minutesAgo(8000),
    lastMessageAt: minutesAgo(1440),
  },
  {
    id: 'conv-10',
    customerId: 'cust-2',
    supporterId: 'sup-3',
    status: 'open',
    unread: 0,
    channel: 'whatsapp',
    createdAt: minutesAgo(240),
    lastMessageAt: minutesAgo(72),
  },
]

/**
 * Builds a thread from `[direction, text, minutesAgo, status]` tuples.
 */
const thread = (conversationId, entries) =>
  entries.map(([direction, text, minutes, status], index) => ({
    id: `${conversationId}-m${index + 1}`,
    conversationId,
    direction,
    text,
    at: minutesAgo(minutes),
    status: status || (direction === 'outgoing' ? 'delivered' : 'received'),
  }))

export const DEMO_MESSAGES = {
  'conv-1': thread('conv-1', [
    ['incoming', 'Hi, my order from last week still shows as pending on the portal.', 220, 'read'],
    ['outgoing', 'Hi Ramesh, let me check that for you. Which order number was it?', 214, 'read'],
    ['incoming', 'It is #ORD-4821. I was told it would be dispatched on Monday.', 205, 'read'],
    ['outgoing', 'I can see the order. The courier pickup was rescheduled, I will confirm the new date today.', 190, 'read'],
    ['incoming', 'Please update me as soon as you can, I need it before Friday.', 30, 'read'],
    ['incoming', 'Also can you share the invoice on WhatsApp?', 4, 'received'],
  ]),
  'conv-2': thread('conv-2', [
    ['incoming', 'Hello, we want to place a bulk order of 250 units. What is the best price?', 180, 'read'],
    ['outgoing', 'Hello Fatima, happy to help. For 250 units the slab pricing starts at 18% below list price.', 165, 'read'],
    ['incoming', 'That works. Can we also get 30 day payment terms?', 40, 'read'],
    ['outgoing', '30 day terms are available on orders above 200 units. I will route this to the accounts team.', 11, 'delivered'],
  ]),
  'conv-3': thread('conv-3', [
    ['incoming', 'My payment link expired before I could pay.', 1500, 'read'],
    ['outgoing', 'Sorry about that, here is a fresh link. It stays valid for 24 hours.', 1480, 'read'],
    ['outgoing', 'Let us know once it goes through.', 95, 'read'],
  ]),
  'conv-4': thread('conv-4', [
    ['incoming', 'Salam, I need the reseller price list for the UAE.', 640, 'read'],
    ['outgoing', 'Wa Alaikum Assalam Aisha. I have shared the reseller sheet on your email.', 600, 'read'],
    ['incoming', 'Received it. Two more questions about the minimum order value.', 45, 'read'],
    ['incoming', 'And can you ship to a reseller address in Dubai?', 30, 'read'],
    ['incoming', 'Please reply today, the shipment closes tomorrow.', 26, 'received'],
  ]),
  'conv-5': thread('conv-5', [
    ['incoming', 'We need the invoice split across two GST numbers.', 2900, 'read'],
    ['outgoing', 'That is possible. Please share both GST numbers and I will update the invoice.', 2800, 'read'],
    ['outgoing', 'Once received I will send the revised copy.', 180, 'read'],
  ]),
  'conv-6': thread('conv-6', [
    ['incoming', 'Can you send the catalogue in Portuguese?', 5200, 'read'],
    ['outgoing', 'Sure, I have prepared the Portuguese catalogue and emailed it as well.', 5100, 'read'],
    ['incoming', 'Perfect, thank you for the quick help.', 320, 'read'],
  ]),
  'conv-7': thread('conv-7', [
    ['incoming', 'Do you have the invoice for my March purchase?', 420, 'read'],
    ['outgoing', 'Sure, sharing it here now.', 90, 'read'],
    ['incoming', 'Got it, thanks.', 58, 'read'],
  ]),
  'conv-8': thread('conv-8', [
    ['incoming', 'Is stock available for the 450 unit order?', 300, 'read'],
    ['outgoing', 'Checking with the warehouse now.', 250, 'read'],
    ['incoming', 'Any update? The client is waiting.', 12, 'received'],
  ]),
  'conv-9': thread('conv-9', [
    ['incoming', 'Just confirming the refund went through.', 8000, 'read'],
    ['outgoing', 'Yes, the refund was processed and it reflects in 3 to 5 working days.', 7900, 'read'],
    ['incoming', 'Thanks, closing this one.', 1440, 'read'],
  ]),
  'conv-10': thread('conv-10', [
    ['incoming', 'Is the 30 day payment term available for a first order?', 240, 'read'],
    ['outgoing', 'For a first order we can offer 15 days. After two orders the 30 day term applies.', 120, 'read'],
    ['incoming', 'Understood, we will place the order then.', 72, 'read'],
  ]),
}

export const CONVERSATION_STATUSES = ['open', 'pending', 'closed']
