// Rich mock data matching BlastWhatsApp reference screenshots (Pages 1 to 17)

export const BLAST_KPIS = {
  dashboard: {
    totalContacts: { value: '24,850', change: '+12.8%', positive: true, period: 'vs. previous 7 days' },
    activeConversations: { value: '1,284', change: '+8.4%', positive: true, period: 'vs. previous 7 days' },
    messagesSent: { value: '86,420', change: '+18.2%', positive: true, period: 'vs. previous 7 days' },
    campaignDelivery: { value: '96.8%', change: '+2.1%', positive: true, period: 'vs. previous 7 days' },
  },
  inbox: {
    all: 248,
    unread: 12,
    assignedToMe: 8,
    resolved: 216,
  },
  contacts: {
    totalContacts: { value: '12,840', change: '+12.5%', positive: true, period: 'vs. previous 30 days' },
    groups: { value: '18', change: '+2', positive: true, period: 'Total contact groups' },
    activeContacts: { value: '10,560', change: '+8.4%', positive: true, period: 'Messaging enabled' },
    blockedContacts: { value: '320', change: '+1.2%', positive: false, period: 'Cannot receive messages' },
  },
  templates: {
    total: { value: '48', change: '+12.5%', period: 'vs. previous 30 days' },
    approved: { value: '36', change: '+8.4%', period: 'Ready to use' },
    pending: { value: '6', period: 'Under review' },
    rejected: { value: '3', period: 'Needs changes' },
    categories: { value: '12', period: 'Active categories' },
  },
  campaigns: {
    total: { value: '128', change: '+12.5%', period: 'vs. previous 30 days' },
    sent: { value: '245,620', change: '+18.4%', period: 'vs. previous 30 days' },
    deliveryRate: { value: '96.8%', change: '+2.1%', period: 'vs. previous 30 days' },
  },
  automation: {
    total: { value: '18', change: '+12.5%', period: 'vs previous 30 days' },
    active: { value: '12', change: '+33.3%', period: 'currently running' },
    executions: { value: '24,560', change: '+18.4%', period: 'in last 30 days' },
    successRate: { value: '96.8%', change: '+2.1%', period: 'messages delivered' },
  },
  chatbot: {
    total: { value: '12', change: '+20%', period: 'vs. previous 30 days' },
    active: { value: '8', change: '+14%', period: 'Currently running' },
    conversations: { value: '4,850', change: '+32%', period: 'in last 30 days' },
    resolutionRate: { value: '78.6%', change: '+5.2%', period: 'Handled by bot' },
    fallbackRate: { value: '21.4%', change: '+3.1%', period: 'Transferred to agents' },
  },
  aiAgent: {
    totalConversations: { value: '12,450', change: '+28%', period: 'vs. previous 30 days' },
    resolutionRate: { value: '78.6%', change: '+12%', period: 'Handled by AI' },
    humanHandover: { value: '21.4%', change: '-5%', period: 'Transferred to agents' },
    satisfaction: { value: '4.6/5', change: '+8%', period: 'Based on feedback' },
  },
  flows: {
    totalFlows: { value: '24', change: '+33%', period: 'vs. previous 30 days' },
    activeFlows: { value: '18', change: '+28%', period: 'currently published' },
    totalViews: { value: '12,450', change: '+24%', period: 'in last 30 days' },
    completionRate: { value: '78.6%', change: '+12%', period: 'users completed' },
  },
  catalog: {
    totalProducts: { value: '156', change: '+12%', period: 'vs. previous 30 days' },
    activeProducts: { value: '142', change: '+8%', period: 'currently active' },
    categories: { value: '12', change: '+20%', period: 'product categories' },
    totalViews: { value: '24,560', change: '+28%', period: 'in last 30 days' },
  },
  payments: {
    totalPayments: { value: '$12,450', change: '+28%', period: 'in last 30 days' },
    successfulPayments: { value: '320', change: '+18%', period: 'completed transactions' },
    pendingPayments: { value: '18', change: '-10%', period: 'awaiting customer action' },
    refundedAmount: { value: '$320', change: '-5%', period: 'in last 30 days' },
  },
  apiLogs: {
    totalRequests: { value: '12,560', change: '+28%', period: 'in last 30 days' },
    successful: { value: '11,840', change: '+94.3%', period: '2xx response' },
    failed: { value: '720', change: '+5.7%', period: '4xx / 5xx response' },
    avgResponseTime: { value: '320 ms', change: '+18%', period: 'last 30 days' },
  },
  scheduleLogs: {
    totalScheduled: { value: '1,240', change: '+28%', period: 'in next 30 days' },
    sent: { value: '980', change: '+18%', period: 'successfully delivered' },
    pending: { value: '180', change: '-12%', period: 'waiting to be sent' },
    failed: { value: '42', change: '+5%', period: 'delivery failed' },
  },
  integrations: {
    total: { value: '12', change: '+20%', period: 'connected services' },
    active: { value: '8', change: '+14%', period: 'currently active' },
    inactive: { value: '3', period: 'no recent activity' },
    failed: { value: '1', period: 'requires attention' },
  },
  team: {
    totalMembers: { value: '12', change: '+20%', period: 'team members' },
    activeMembers: { value: '10', change: '+25%', period: 'currently active' },
    roles: { value: '5', period: 'predefined roles' },
    pendingInvitations: { value: '2', period: 'awaiting acceptance' },
  },
}

// INBOX CONVERSATIONS (Page 2)
export const INBOX_CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Sarah Johnson',
    phone: '+1 234 567 890',
    email: 'sarah.johnson@example.com',
    location: 'New York, USA',
    customerSince: 'Apr 12, 2024',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    unreadCount: 3,
    lastTime: '10:24 AM',
    lastMessage: 'Thank you! Can you also share th...',
    priority: 'High',
    assignedTo: 'Alex Carter',
    sla: 'SLA 2h 14m',
    totalOrders: 5,
    totalSpent: '$349.00',
    lastOrderDate: 'Apr 28, 2024',
    tags: ['VIP', 'Customer', 'Interested', 'English'],
    notes: 'Prefers WhatsApp, interested in new product launches.',
    conversationNotes: [
      {
        author: 'Alex Carter',
        date: 'May 07, 2024 10:24 AM',
        text: 'Customer is interested in premium plan. Follow up next week with special offer.',
      },
    ],
    recentActivity: [
      { text: 'Order #12345 delivered', time: 'Apr 28, 2024 02:14 PM', icon: 'package' },
      { text: 'Campaign message sent', time: 'Apr 20, 2024 11:30 AM', icon: 'send' },
      { text: 'Replied to conversation', time: 'Apr 18, 2024 09:12 AM', icon: 'message' },
      { text: 'Contact created', time: 'Apr 12, 2024 04:22 PM', icon: 'user' },
    ],
    messages: [
      {
        id: 'm1',
        sender: 'customer',
        text: 'Hi! I wanted to check the status of my order #12345.',
        time: '10:12 AM',
      },
      {
        id: 'm2',
        sender: 'agent',
        text: 'Hello Sarah! 👋\nLet me check your order status. Please give me a moment.',
        time: '10:13 AM',
      },
      {
        id: 'm3',
        sender: 'customer',
        text: 'Thank you! 😊',
        time: '10:14 AM',
      },
      {
        id: 'm4',
        sender: 'agent',
        text: 'Your order #12345 is currently in transit and is expected to be delivered on May 10, 2024. You can also track it using this link: https://track.example.com/12345',
        time: '10:16 AM',
      },
      {
        id: 'm5',
        sender: 'customer',
        text: "That's great! Can you also share the estimated delivery time?",
        time: '10:20 AM',
      },
      {
        id: 'm6',
        sender: 'agent',
        text: 'Yes, it will be delivered between 10 AM - 2 PM on May 10. Is there anything else I can help you with?',
        time: '10:24 AM',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Michael Chen',
    phone: '+1 987 654 321',
    email: 'michael.chen@example.com',
    location: 'San Francisco, USA',
    customerSince: 'Mar 10, 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    unreadCount: 1,
    lastTime: '09:58 AM',
    lastMessage: 'Is this item still available?',
    priority: 'Medium',
    assignedTo: 'Maria Garcia',
    sla: 'SLA 4h 30m',
    totalOrders: 3,
    totalSpent: '$198.50',
    lastOrderDate: 'May 02, 2024',
    tags: ['Lead', 'Interested'],
    notes: 'Inquired about Smart Watch stock and discounts.',
    messages: [
      { id: 'm21', sender: 'customer', text: 'Hi, is the Smart Watch still available in black?', time: '09:58 AM' },
    ],
  },
  {
    id: 'c3',
    name: 'Emma Wilson',
    phone: '+44 7700 900123',
    email: 'emma.wilson@example.com',
    location: 'London, UK',
    customerSince: 'Jan 15, 2024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    unreadCount: 2,
    lastTime: '08:42 AM',
    lastMessage: 'Great, I will check and confirm.',
    priority: 'Low',
    assignedTo: 'Rahul Mehta',
    sla: 'SLA 6h 15m',
    totalOrders: 8,
    totalSpent: '$560.00',
    lastOrderDate: 'Apr 15, 2024',
    tags: ['Customer', 'Online'],
    notes: 'Regular buyer of summer collections.',
    messages: [
      { id: 'm31', sender: 'customer', text: 'Great, I will check and confirm the sizes.', time: '08:42 AM' },
    ],
  },
  {
    id: 'c4',
    name: 'Daniel Kim',
    phone: '+1 415 555 2678',
    email: 'daniel.kim@example.com',
    location: 'Chicago, USA',
    customerSince: 'Feb 20, 2024',
    avatar: '',
    status: 'away',
    unreadCount: 1,
    lastTime: 'Yesterday',
    lastMessage: 'Can I change the delivery address?',
    priority: 'High',
    assignedTo: 'Alex Carter',
    sla: 'SLA 1h 05m',
    totalOrders: 1,
    totalSpent: '$49.99',
    lastOrderDate: 'May 05, 2024',
    tags: ['Lead', 'New'],
    notes: 'Needs urgent address change before dispatch.',
    messages: [
      { id: 'm41', sender: 'customer', text: 'Can I change the delivery address for order #12340?', time: 'Yesterday 04:30 PM' },
    ],
  },
  {
    id: 'c5',
    name: 'Priya Sharma',
    phone: '+91 98765 43210',
    email: 'priya.sharma@example.com',
    location: 'Mumbai, India',
    customerSince: 'Dec 05, 2023',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    status: 'offline',
    unreadCount: 0,
    lastTime: 'Yesterday',
    lastMessage: 'Thank you for the support!',
    priority: 'Low',
    assignedTo: 'Sarah Lee',
    sla: 'Resolved',
    totalOrders: 12,
    totalSpent: '$890.00',
    lastOrderDate: 'May 06, 2024',
    tags: ['Customer', 'Repeat', 'VIP'],
    notes: 'VIP customer. Prompt issue resolution provided.',
    messages: [
      { id: 'm51', sender: 'customer', text: 'Thank you for the support! Everything worked.', time: 'Yesterday 02:15 PM' },
    ],
  },
  {
    id: 'c6',
    name: 'Carlos Mendez',
    phone: '+52 555 123 4567',
    email: 'carlos.m@example.com',
    location: 'Mexico City, Mexico',
    customerSince: 'Apr 01, 2024',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    status: 'offline',
    unreadCount: 0,
    lastTime: 'May 06',
    lastMessage: 'Do you have this in different sizes?',
    priority: 'Medium',
    assignedTo: 'Daniel Kim',
    sla: 'SLA 5h 00m',
    totalOrders: 2,
    totalSpent: '$85.00',
    lastOrderDate: 'Apr 25, 2024',
    tags: ['Lead', 'Interested'],
    notes: 'Interested in bulk purchase.',
    messages: [
      { id: 'm61', sender: 'customer', text: 'Do you have this in different sizes? Like XL or XXL?', time: 'May 06 11:20 AM' },
    ],
  },
  {
    id: 'c7',
    name: 'Aisha Khan',
    phone: '+971 50 123 4567',
    email: 'aisha.khan@example.com',
    location: 'Dubai, UAE',
    customerSince: 'Nov 18, 2023',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    status: 'online',
    unreadCount: 0,
    lastTime: 'May 06',
    lastMessage: 'Perfect! When will it be shipped?',
    priority: 'Medium',
    assignedTo: 'Alex Carter',
    sla: 'SLA 3h 10m',
    totalOrders: 6,
    totalSpent: '$420.00',
    lastOrderDate: 'May 06, 2024',
    tags: ['Customer', 'VIP'],
    notes: 'Ordered gift package.',
    messages: [
      { id: 'm71', sender: 'customer', text: 'Perfect! When will it be shipped?', time: 'May 06 09:15 AM' },
    ],
  },
  {
    id: 'c8',
    name: 'Lucas Oliveira',
    phone: '+55 11 98765 4321',
    email: 'lucas.o@example.com',
    location: 'Sao Paulo, Brazil',
    customerSince: 'Feb 14, 2024',
    avatar: '',
    status: 'offline',
    unreadCount: 0,
    lastTime: 'May 05',
    lastMessage: 'Hi, I need an invoice for my order.',
    priority: 'Low',
    assignedTo: 'Maria Garcia',
    sla: 'Resolved',
    totalOrders: 1,
    totalSpent: '$29.99',
    lastOrderDate: 'May 04, 2024',
    tags: ['Lead', 'New'],
    notes: 'Requested tax invoice PDF.',
    messages: [
      { id: 'm81', sender: 'customer', text: 'Hi, I need an invoice for my order #12336.', time: 'May 05 03:40 PM' },
    ],
  },
]

// CONTACTS DATA (Page 4)
export const CONTACTS_DATA = [
  { id: 1, name: 'Arun Kumar', phone: '+91 98765 43210', tags: ['Customer', 'VIP'], group: 'Retail', status: 'Active' },
  { id: 2, name: 'Priya Sharma', phone: '+91 87654 32109', tags: ['Lead'], group: 'Retail', status: 'Active' },
  { id: 3, name: 'Rahul Mehta', phone: '+91 76543 21098', tags: ['Customer'], group: 'Retail', status: 'Active' },
  { id: 4, name: 'Sneha Reddy', phone: '+91 65432 10987', tags: ['VIP'], group: 'Wholesale', status: 'Active' },
  { id: 5, name: 'Vikram Patel', phone: '+91 54321 09876', tags: ['Lead'], group: 'Wholesale', status: 'Active' },
  { id: 6, name: 'Kavya Nair', phone: '+91 43210 98765', tags: ['Customer'], group: 'Wholesale', status: 'Active' },
  { id: 7, name: 'Suresh Babu', phone: '+91 32109 87654', tags: [], group: 'Retail', status: 'Inactive' },
  { id: 8, name: 'Anita Desai', phone: '+91 21098 76543', tags: ['VIP'], group: 'Corporate', status: 'Active' },
  { id: 9, name: 'Manoj Singh', phone: '+91 10987 65432', tags: ['Customer'], group: 'Corporate', status: 'Active' },
  { id: 10, name: 'Deepa Iyer', phone: '+91 98760 12345', tags: ['Lead'], group: 'Corporate', status: 'Active' },
]

// TEMPLATES DATA (Page 5)
export const TEMPLATES_DATA = [
  { id: 1, name: 'welcome_message', sample: 'Hi {{1}}, welcome to our s...', category: 'Marketing', language: 'English', status: 'Approved', sent: '12,540', updatedAt: 'May 07, 2024 10:30 AM' },
  { id: 2, name: 'order_confirmation', sample: 'Your order #{{1}} has be...', category: 'Transactional', language: 'English', status: 'Approved', sent: '8,420', updatedAt: 'May 05, 2024 02:15 PM' },
  { id: 3, name: 'payment_reminder', sample: 'Hi {{1}}, your payment o...', category: 'Transactional', language: 'English', status: 'Approved', sent: '5,210', updatedAt: 'May 03, 2024 11:20 AM' },
  { id: 4, name: 'new_product', sample: 'Check out our latest pro...', category: 'Marketing', language: 'English', status: 'Pending', sent: '0', updatedAt: 'May 02, 2024 09:45 AM' },
  { id: 5, name: 'support_reply', sample: 'Thanks for contacting u...', category: 'Utility', language: 'English', status: 'Approved', sent: '7,980', updatedAt: 'Apr 28, 2024 04:10 PM' },
  { id: 6, name: 'account_verification', sample: 'Your verification code is...', category: 'Authentication', language: 'English', status: 'Approved', sent: '15,430', updatedAt: 'Apr 26, 2024 01:35 PM' },
  { id: 7, name: 'event_reminder', sample: 'Hi {{1}}, don\'t forget ou...', category: 'Utility', language: 'English', status: 'Rejected', sent: '0', updatedAt: 'Apr 24, 2024 10:12 AM' },
  { id: 8, name: 'feedback_request', sample: 'Hi {{1}}, how was your e...', category: 'Marketing', language: 'English', status: 'Approved', sent: '4,620', updatedAt: 'Apr 20, 2024 03:50 PM' },
  { id: 9, name: 'catalog_offer', sample: 'Special offer just for you...', category: 'Marketing', language: 'English', status: 'Approved', sent: '9,310', updatedAt: 'Apr 18, 2024 12:25 PM' },
  { id: 10, name: 'lead_followup', sample: 'Hi {{1}}, are you still int...', category: 'Marketing', language: 'English', status: 'Pending', sent: '0', updatedAt: 'Apr 16, 2024 11:05 AM' },
]

// CAMPAIGNS DATA (Page 6)
export const CAMPAIGNS_DATA = [
  { id: 1, name: 'Summer Collection 2024', desc: 'New arrival notification', type: 'Marketing', audience: 'Customers (12,540)', sent: '12,540', delivered: '12,180 (97.1%)', read: '9,842 (78.5%)', status: 'Completed', scheduledAt: 'May 07, 2024 10:30 AM' },
  { id: 2, name: 'Product Update', desc: 'Feature announcement', type: 'Utility', audience: 'Leads (8,420)', sent: '8,420', delivered: '8,118 (96.4%)', read: '6,202 (73.7%)', status: 'Completed', scheduledAt: 'May 05, 2024 02:15 PM' },
  { id: 3, name: 'Payment Reminder', desc: 'Pending payment alert', type: 'Utility', audience: 'Customers (6,218)', sent: '6,218', delivered: '5,982 (96.2%)', read: '4,821 (77.5%)', status: 'Completed', scheduledAt: 'May 03, 2024 11:20 AM' },
  { id: 4, name: 'Abandoned Cart', desc: 'Cart recovery message', type: 'Marketing', audience: 'Leads (4,950)', sent: '4,950', delivered: '4,631 (93.6%)', read: '3,412 (68.9%)', status: 'Completed', scheduledAt: 'May 02, 2024 09:45 AM' },
  { id: 5, name: 'Re-engagement', desc: 'We miss you!', type: 'Marketing', audience: 'Inactive (11,320)', sent: '11,320', delivered: '10,842 (95.8%)', read: '8,421 (74.4%)', status: 'Sending', scheduledAt: 'May 01, 2024 01:10 PM' },
  { id: 6, name: 'Feedback Request', desc: 'Share your feedback', type: 'Utility', audience: 'All Customers (7,560)', sent: '7,560', delivered: '7,198 (95.2%)', read: '5,982 (79.1%)', status: 'Scheduled', scheduledAt: 'May 10, 2024 10:00 AM' },
  { id: 7, name: 'Festive Offer', desc: 'Special discount', type: 'Marketing', audience: 'VIP Customers (9,840)', sent: '9,840', delivered: '0 (0%)', read: '0 (0%)', status: 'Scheduled', scheduledAt: 'May 12, 2024 09:00 AM' },
  { id: 8, name: 'Account Verification', desc: 'Verify your account', type: 'Authentication', audience: 'New Users (5,420)', sent: '5,420', delivered: '5,201 (95.9%)', read: '4,010 (73.9%)', status: 'Completed', scheduledAt: 'Apr 28, 2024 04:35 PM' },
]

// AUTOMATION WORKFLOWS (Page 7)
export const AUTOMATIONS_DATA = [
  { id: 1, name: 'Welcome & Onboarding Flow', trigger: 'New Message', status: 'Active', executions: '8,240', successRate: '97.2%', lastUpdated: 'May 07, 2024 10:30 AM' },
  { id: 2, name: 'Abandoned Cart Recovery', trigger: 'Cart Abandon', status: 'Active', executions: '5,420', successRate: '95.8%', lastUpdated: 'May 06, 2024 02:15 PM' },
  { id: 3, name: 'Payment Reminder', trigger: 'Payment Failed', status: 'Paused', executions: '2,860', successRate: '93.1%', lastUpdated: 'May 05, 2024 11:20 AM' },
]

// CHATBOTS DATA (Page 8)
export const CHATBOTS_DATA = [
  { id: 1, name: 'Customer Support Bot', trigger: 'Keyword Match', status: 'Active', conversations: '2,540', resolutionRate: '82.6%', fallbackRate: '17.4%', lastUpdated: 'May 07, 2024 10:30 AM' },
  { id: 2, name: 'Sales Assistant Bot', trigger: 'New Contact', status: 'Active', conversations: '1,820', resolutionRate: '74.3%', fallbackRate: '25.7%', lastUpdated: 'May 05, 2024 02:15 PM' },
  { id: 3, name: 'Order Status Bot', trigger: 'Button Click', status: 'Active', conversations: '490', resolutionRate: '68.1%', fallbackRate: '31.9%', lastUpdated: 'Apr 28, 2024 04:10 PM' },
]

// AI AGENTS (Page 9)
export const AI_AGENTS_DATA = [
  { id: 1, name: 'Customer Support AI', desc: 'Handles FAQs, orders, support', status: 'Active', model: 'GPT-4o (Recommended)', personality: 'Friendly & Professional', tone: 'Friendly', lang: 'English' },
  { id: 2, name: 'Sales Assistant', desc: 'Product recommendations', status: 'Active', model: 'GPT-4o (Recommended)', personality: 'Persuasive & Helpful', tone: 'Professional', lang: 'English' },
  { id: 3, name: 'Order Management', desc: 'Track orders, returns', status: 'Active', model: 'Claude 3.5 Sonnet', personality: 'Accurate & Concise', tone: 'Concise', lang: 'English' },
  { id: 4, name: 'Lead Qualification', desc: 'Qualify and capture leads', status: 'Paused', model: 'GPT-4o', personality: 'Engaging & Inquisitive', tone: 'Casual', lang: 'English' },
  { id: 5, name: 'Appointment Booking', desc: 'Schedule and manage bookings', status: 'Active', model: 'GPT-4o', personality: 'Polite & Structured', tone: 'Professional', lang: 'English' },
  { id: 6, name: 'Custom AI Agent', desc: 'Create your own assistant', status: 'Draft', model: 'GPT-4o', personality: 'Customizable', tone: 'Friendly', lang: 'English' },
]

// WHATSAPP FLOWS (Page 10)
export const FLOWS_DATA = [
  { id: 1, name: 'Product Inquiry Flow', type: 'Catalog', status: 'Published', views: '4,520', completions: '3,640', rate: '80.5%', lastUpdated: 'May 07, 2024 10:30 AM' },
  { id: 2, name: 'Order Tracking Flow', type: 'Utility', status: 'Published', views: '3,820', completions: '2,910', rate: '76.2%', lastUpdated: 'May 05, 2024 02:15 PM' },
  { id: 3, name: 'Support Flow', type: 'Support', status: 'Draft', views: '1,450', completions: '980', rate: '67.6%', lastUpdated: 'May 03, 2024 11:20 AM' },
  { id: 4, name: 'Payment Flow', type: 'Payment', status: 'Published', views: '2,660', completions: '2,180', rate: '82.0%', lastUpdated: 'Apr 28, 2024 04:10 PM' },
]

// CATALOG PRODUCTS (Page 11)
export const CATALOG_PRODUCTS = [
  { id: 1, name: 'Sports Shoe', category: 'Footwear', price: '$49.99', stock: 'In Stock (120)', active: true, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80', sku: 'SHOE-001', desc: 'Comfortable and stylish sports shoe for everyday use. Available in multiple sizes and colors.' },
  { id: 2, name: 'Smart Watch', category: 'Electronics', price: '$89.99', stock: 'In Stock (45)', active: true, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=80', sku: 'WATCH-101', desc: 'Next-gen smartwatch with heart rate monitoring, fitness tracking, and WhatsApp notifications.' },
  { id: 3, name: 'Cotton T-Shirt', category: 'Fashion', price: '$19.99', stock: 'In Stock (200)', active: true, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80', sku: 'TSHIRT-02', desc: '100% premium organic cotton t-shirt with breathable fabric and modern tailored fit.' },
  { id: 4, name: 'Travel Backpack', category: 'Bags', price: '$39.99', stock: 'In Stock (85)', active: true, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&auto=format&fit=crop&q=80', sku: 'BAG-303', desc: 'Water-resistant lightweight backpack with laptop compartment and USB charging port.' },
  { id: 5, name: 'Wireless Earbuds', category: 'Electronics', price: '$29.99', stock: 'In Stock (60)', active: true, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&auto=format&fit=crop&q=80', sku: 'AUDIO-04', desc: 'Active noise cancelling wireless earbuds with 32h battery life and fast charging.' },
  { id: 6, name: 'Summer Dress', category: 'Fashion', price: '$34.99', stock: 'In Stock (75)', active: true, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&auto=format&fit=crop&q=80', sku: 'DRESS-50', desc: 'Floral printed casual summer dress made of soft lightweight rayon.' },
  { id: 7, name: 'UV Sunglasses', category: 'Accessories', price: '$24.99', stock: 'In Stock (90)', active: true, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&auto=format&fit=crop&q=80', sku: 'GLASS-77', desc: 'Polarized sunglasses with 100% UV400 protection and scratch-resistant lenses.' },
  { id: 8, name: 'Premium Perfume', category: 'Beauty', price: '$59.99', stock: 'In Stock (40)', active: true, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&auto=format&fit=crop&q=80', sku: 'PERF-90', desc: 'Long-lasting luxury fragrance crafted with French floral and woody notes.' },
]

// PAYMENTS TRANSACTIONS (Page 12)
export const PAYMENTS_DATA = [
  { id: 1, orderId: 'ORD12345', customer: 'Arun Kumar', product: '2 x Sports Shoe', amount: '$99.98', method: 'UPI', status: 'Success', date: 'May 07, 2024 10:30 AM' },
  { id: 2, orderId: 'ORD12344', customer: 'Priya Sharma', product: 'Summer Dress', amount: '$34.99', method: 'Card', status: 'Success', date: 'May 07, 2024 09:15 AM' },
  { id: 3, orderId: 'ORD12343', customer: 'Rahul Mehta', product: 'Smart Watch', amount: '$89.99', method: 'Wallet', status: 'Pending', date: 'May 06, 2024 04:22 PM' },
  { id: 4, orderId: 'ORD12342', customer: 'Sneha Reddy', product: 'Travel Backpack', amount: '$39.99', method: 'UPI', status: 'Success', date: 'May 06, 2024 01:10 PM' },
  { id: 5, orderId: 'ORD12341', customer: 'Karthik S', product: 'Premium Perfume', amount: '$59.99', method: 'Net Banking', status: 'Failed', date: 'May 06, 2024 11:45 AM' },
  { id: 6, orderId: 'ORD12340', customer: 'Divya N', product: 'Wireless Earbuds', amount: '$29.99', method: 'Card', status: 'Success', date: 'May 05, 2024 06:20 PM' },
  { id: 7, orderId: 'ORD12339', customer: 'Lokesh V', product: 'Cotton T-Shirt', amount: '$19.99', method: 'UPI', status: 'Success', date: 'May 05, 2024 03:18 PM' },
  { id: 8, orderId: 'ORD12338', customer: 'Meena R', product: 'Product Bundle', amount: '$149.99', method: 'Wallet', status: 'Refunded', date: 'May 04, 2024 12:05 PM' },
  { id: 9, orderId: 'ORD12337', customer: 'Suresh B', product: 'Sports Shoe', amount: '$49.99', method: 'Net Banking', status: 'Success', date: 'May 04, 2024 09:30 AM' },
  { id: 10, orderId: 'ORD12336', customer: 'Anitha P', product: 'Sunglasses', amount: '$24.99', method: 'Card', status: 'Success', date: 'May 03, 2024 05:15 PM' },
]

// API LOGS (Page 13)
export const API_LOGS_DATA = [
  { id: 1, time: 'May 07, 10:30:24', method: 'POST', endpoint: '/messages', status: 200, timeMs: '842 ms', type: 'Message', messageId: 'wamid.HBgMOTE...001', payload: { messaging_product: 'whatsapp', to: '+91 98765 43210', type: 'text', text: { body: 'Hello Sarah! How can I help you today?' } }, response: { messaging_product: 'whatsapp', contacts: [{ input: '919876543210', wa_id: '919876543210' }], messages: [{ id: 'wamid.HBgMOTE...001' }] } },
  { id: 2, time: 'May 07, 10:29:11', method: 'POST', endpoint: '/messages', status: 200, timeMs: '760 ms', type: 'Template', messageId: 'wamid.HBgMOTE...002', payload: { messaging_product: 'whatsapp', to: '+91 98765 43210', type: 'template', template: { name: 'order_confirmation', language: { code: 'en' } } } },
  { id: 3, time: 'May 07, 10:28:45', method: 'POST', endpoint: '/media', status: 200, timeMs: '1.2 s', type: 'Media Upload', messageId: '104823747392' },
  { id: 4, time: 'May 07, 10:27:18', method: 'GET', endpoint: '/message_status', status: 200, timeMs: '320 ms', type: 'Status Check', messageId: 'wamid.HBgMOTE...001' },
  { id: 5, time: 'May 07, 10:26:03', method: 'POST', endpoint: '/contacts', status: 201, timeMs: '610 ms', type: 'Contact', messageId: 'CONTACT_12345' },
  { id: 6, time: 'May 07, 10:25:47', method: 'POST', endpoint: '/messages', status: 400, timeMs: '430 ms', type: 'Message', messageId: 'N/A', error: 'Invalid phone number format' },
  { id: 7, time: 'May 07, 10:24:19', method: 'POST', endpoint: '/webhooks', status: 200, timeMs: '210 ms', type: 'Webhook', messageId: 'webhook_67890' },
  { id: 8, time: 'May 07, 10:23:56', method: 'GET', endpoint: '/media', status: 404, timeMs: '380 ms', type: 'Media', messageId: 'MEDIA_98765', error: 'Media file expired or not found' },
  { id: 9, time: 'May 07, 10:22:11', method: 'POST', endpoint: '/messages', status: 200, timeMs: '690 ms', type: 'Message', messageId: 'wamid.HBgMOTE...003' },
  { id: 10, time: 'May 07, 10:21:34', method: 'POST', endpoint: '/template_messages', status: 200, timeMs: '520 ms', type: 'Template', messageId: 'wamid.HBgMOTE...004' },
]

// SCHEDULE LOGS (Page 14)
export const SCHEDULE_LOGS_DATA = [
  { id: 1, scheduleId: 'SCH001245', type: 'Campaign', scheduledTime: 'May 07, 2024 10:00 AM', message: 'Product Launch Offer', recipients: '1,250', status: 'Sent', sentTime: 'May 07, 2024 10:00 AM', template: 'product_offer_v1', delivered: '1,180 (94.4%)', read: '840 (67.2%)', failed: '42 (3.4%)' },
  { id: 2, scheduleId: 'SCH001244', type: 'Automation', scheduledTime: 'May 07, 2024 09:30 AM', message: 'Welcome Message', recipients: '320', status: 'Sent', sentTime: 'May 07, 2024 09:30 AM', template: 'welcome_v2', delivered: '312 (97.5%)', read: '280 (87.5%)', failed: '8 (2.5%)' },
  { id: 3, scheduleId: 'SCH001243', type: 'Broadcast', scheduledTime: 'May 07, 2024 02:00 PM', message: 'Festival Discount', recipients: '2,450', status: 'Pending', sentTime: '-', template: 'festive_v1' },
  { id: 4, scheduleId: 'SCH001242', type: 'Follow-up', scheduledTime: 'May 07, 2024 04:00 PM', message: 'Cart Reminder', recipients: '180', status: 'Pending', sentTime: '-', template: 'cart_reminder' },
  { id: 5, scheduleId: 'SCH001241', type: 'Automation', scheduledTime: 'May 06, 2024 06:00 PM', message: 'Payment Reminder', recipients: '95', status: 'Sent', sentTime: 'May 06, 2024 06:00 PM', template: 'pay_reminder', delivered: '92 (96.8%)', read: '78 (82.1%)', failed: '3 (3.2%)' },
  { id: 6, scheduleId: 'SCH001240', type: 'Broadcast', scheduledTime: 'May 06, 2024 03:30 PM', message: 'New Arrivals', recipients: '1,820', status: 'Failed', sentTime: 'May 06, 2024 03:35 PM', template: 'new_arrivals', delivered: '0 (0%)', read: '0 (0%)', failed: '1,820 (100%)', failureReason: 'WhatsApp Business API rate limit exceeded. Retry scheduled.' },
  { id: 7, scheduleId: 'SCH001239', type: 'Campaign', scheduledTime: 'May 06, 2024 11:00 AM', message: 'Re-Engagement', recipients: '980', status: 'Sent', sentTime: 'May 06, 2024 11:00 AM', template: 're_engage_v1', delivered: '945 (96.4%)', read: '690 (70.4%)', failed: '35 (3.6%)' },
  { id: 8, scheduleId: 'SCH001238', type: 'Follow-up', scheduledTime: 'May 05, 2024 10:00 AM', message: 'Support Follow-up', recipients: '120', status: 'Sent', sentTime: 'May 05, 2024 10:00 AM', template: 'support_follow', delivered: '118 (98.3%)', read: '105 (87.5%)', failed: '2 (1.7%)' },
  { id: 9, scheduleId: 'SCH001237', type: 'Automation', scheduledTime: 'May 05, 2024 09:00 AM', message: 'Rating Request', recipients: '350', status: 'Sent', sentTime: 'May 05, 2024 09:00 AM', template: 'feedback_v1', delivered: '338 (96.6%)', read: '280 (80.0%)', failed: '12 (3.4%)' },
  { id: 10, scheduleId: 'SCH001236', type: 'Campaign', scheduledTime: 'May 05, 2024 12:00 PM', message: 'End of Season Sale', recipients: '2,100', status: 'Failed', sentTime: 'May 05, 2024 12:05 PM', template: 'sale_eoss', delivered: '1,200 (57.1%)', read: '800 (38.1%)', failed: '900 (42.9%)', failureReason: 'Message template parameters mismatch for 900 contacts.' },
]

// INTEGRATIONS (Page 15)
export const INTEGRATIONS_DATA = [
  { id: 'shopify', name: 'Shopify', desc: 'Sync products, orders and customer data.', category: 'E-commerce', status: 'Connected', iconColor: 'text-emerald-500 bg-emerald-50', storeUrl: 'https://your-store.myshopify.com' },
  { id: 'woocommerce', name: 'WooCommerce', desc: 'Sync products, orders and customer data.', category: 'E-commerce', status: 'Connected', iconColor: 'text-purple-500 bg-purple-50' },
  { id: 'razorpay', name: 'Razorpay', desc: 'Accept payments and verify transactions.', category: 'Payment', status: 'Connected', iconColor: 'text-blue-500 bg-blue-50' },
  { id: 'stripe', name: 'Stripe', desc: 'Accept payments and manage subscriptions.', category: 'Payment', status: 'Inactive', iconColor: 'text-indigo-500 bg-indigo-50' },
  { id: 'googlesheets', name: 'Google Sheets', desc: 'Sync contacts and data with Google Sheets.', category: 'Productivity', status: 'Connected', iconColor: 'text-green-600 bg-green-50' },
  { id: 'hubspot', name: 'HubSpot', desc: 'Sync leads, contacts and deal information.', category: 'CRM', status: 'Inactive', iconColor: 'text-orange-500 bg-orange-50' },
  { id: 'zohocrm', name: 'Zoho CRM', desc: 'Sync contacts, leads and deal information.', category: 'CRM', status: 'Connected', iconColor: 'text-amber-500 bg-amber-50' },
  { id: 'salesforce', name: 'Salesforce', desc: 'Sync leads, contacts and opportunities.', category: 'CRM', status: 'Inactive', iconColor: 'text-sky-500 bg-sky-50' },
  { id: 'mailchimp', name: 'Mailchimp', desc: 'Sync contacts and automate email marketing.', category: 'Marketing', status: 'Connected', iconColor: 'text-yellow-500 bg-yellow-50' },
  { id: 'googlecalendar', name: 'Google Calendar', desc: 'Sync appointments and send reminders.', category: 'Productivity', status: 'Connected', iconColor: 'text-blue-600 bg-blue-50' },
  { id: 'webhook', name: 'Webhook', desc: 'Receive real-time events from other apps.', category: 'Developer', status: 'Connected', iconColor: 'text-rose-500 bg-rose-50' },
  { id: 'customapi', name: 'Custom API', desc: 'Integrate with your own system using APIs.', category: 'Developer', status: 'Connected', iconColor: 'text-teal-600 bg-teal-50' },
]

// TEAM & ROLES (Page 16)
export const TEAM_MEMBERS_DATA = [
  { id: 1, name: 'Arun Kumar', email: 'arun@company.com', role: 'Admin', team: 'Management', status: 'Online', lastActive: 'Now' },
  { id: 2, name: 'Priya Sharma', email: 'priya@company.com', role: 'Manager', team: 'Sales', status: 'Online', lastActive: '5 mins ago' },
  { id: 3, name: 'Rahul Mehta', email: 'rahul@company.com', role: 'Agent', team: 'Support', status: 'Online', lastActive: '12 mins ago' },
  { id: 4, name: 'Sneha Reddy', email: 'sneha@company.com', role: 'Agent', team: 'Sales', status: 'Away', lastActive: '1 hour ago' },
  { id: 5, name: 'Karthik S', email: 'karthik@company.com', role: 'Agent', team: 'Support', status: 'Offline', lastActive: '3 hours ago' },
  { id: 6, name: 'Divya N', email: 'divya@company.com', role: 'Agent', team: 'Support', status: 'Online', lastActive: '20 mins ago' },
  { id: 7, name: 'Lokesh V', email: 'lokesh@company.com', role: 'Analyst', team: 'Marketing', status: 'Online', lastActive: '40 mins ago' },
  { id: 8, name: 'Meena R', email: 'meena@company.com', role: 'Agent', team: 'Sales', status: 'Offline', lastActive: '2 hours ago' },
  { id: 9, name: 'Suresh B', email: 'suresh@company.com', role: 'Viewer', team: 'Management', status: 'Offline', lastActive: '5 hours ago' },
  { id: 10, name: 'Anitha P', email: 'anitha@company.com', role: 'Agent', team: 'Support', status: 'Online', lastActive: '15 mins ago' },
]

export const ROLE_PERMISSIONS = [
  { feature: 'Dashboard', admin: true, manager: true, agent: true, viewer: true },
  { feature: 'Team Inbox', admin: true, manager: true, agent: true, viewer: false },
  { feature: 'Compose Message', admin: true, manager: true, agent: true, viewer: false },
  { feature: 'Contacts', admin: true, manager: true, agent: true, viewer: true },
  { feature: 'Campaigns', admin: true, manager: true, agent: false, viewer: false },
  { feature: 'Automation', admin: true, manager: true, agent: false, viewer: false },
  { feature: 'Chatbot Builder', admin: true, manager: true, agent: false, viewer: false },
  { feature: 'AI Agent', admin: true, manager: true, agent: false, viewer: false },
  { feature: 'WhatsApp Flows', admin: true, manager: true, agent: false, viewer: false },
  { feature: 'Catalog', admin: true, manager: true, agent: true, viewer: true },
  { feature: 'Payments', admin: true, manager: true, agent: false, viewer: true },
  { feature: 'Reports & Analytics', admin: true, manager: true, agent: false, viewer: true },
  { feature: 'Integrations', admin: true, manager: false, agent: false, viewer: false },
  { feature: 'Team Management', admin: true, manager: false, agent: false, viewer: false },
  { feature: 'Settings', admin: true, manager: false, agent: false, viewer: false },
]

// SETTINGS DATA (Page 17)
export const SETTINGS_CONFIG = {
  profile: {
    name: 'Your Company Pvt Ltd',
    description: 'We help businesses grow with WhatsApp.',
    website: 'https://yourcompany.com',
    email: 'support@yourcompany.com',
    phone: '+91 98765 43210',
  },
  company: {
    name: 'Your Company Pvt Ltd',
    industry: 'E-commerce',
    address: '123 Market Street, Chennai, Tamil Nadu, 600001',
    gstTaxId: '27ABCDE1234F1Z5',
    supportEmail: 'support@yourcompany.com',
    supportPhone: '+91 98765 43210',
  },
  waba: {
    status: 'Active',
    wabaNumber: '+1 555 123 4567',
    businessVerification: 'Verified',
    phoneNumberStatus: 'Connected',
    messagingTier: 'MSG_LIMIT',
    qualityRating: 'High',
  },
  preferences: {
    autoAssign: true,
    notificationSound: true,
    showMessagePreview: true,
    compactView: false,
    linkShortening: true,
    trackAnalytics: true,
    saveSentHistory: true,
  },
  defaults: {
    templateLanguage: 'English (en_US)',
    senderNumber: '+1 555 123 4567',
    team: 'Support',
    assignmentRule: 'Round Robin',
  },
  businessHours: [
    { day: 'Monday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Tuesday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Wednesday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Thursday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Friday', active: true, start: '09:00 AM', end: '06:00 PM' },
    { day: 'Saturday', active: false, start: 'Closed', end: 'Closed' },
    { day: 'Sunday', active: false, start: 'Closed', end: 'Closed' },
  ],
  awayMessage: {
    enabled: true,
    text: 'Thank you for your message! Our team is currently unavailable. We will get back to you during our business hours (Mon - Fri, 9 AM - 6 PM).\n\n{{customer_name}}',
  },
  dataRetention: {
    messageHistory: '12 Months',
    autoDeleteLogs: '6 Months',
    contactData: '24 Months',
  },
}
