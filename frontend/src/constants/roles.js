export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  AGENT: 'Agent',
  SUPPORT: 'Support',
}

export const DEMO_USERS = [
  { id: 1, name: 'Ava Admin', email: 'admin@demo.com', role: ROLES.ADMIN },
  { id: 2, name: 'Morgan Manager', email: 'manager@demo.com', role: ROLES.MANAGER },
  { id: 3, name: 'Alex Agent', email: 'agent@demo.com', role: ROLES.AGENT },
  { id: 4, name: 'Sam Support', email: 'support@demo.com', role: ROLES.SUPPORT },
]

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', roles: Object.values(ROLES) },
  { label: 'Team Inbox', path: '/inbox', icon: 'MessageSquare', roles: Object.values(ROLES) },
  { label: 'Compose Message', path: '/compose', icon: 'Send', roles: Object.values(ROLES) },
  { label: 'Contacts', path: '/contacts', icon: 'Users', roles: Object.values(ROLES) },
  { label: 'Leads & Pipeline', path: '/leads', icon: 'TrendingUp', roles: Object.values(ROLES) },
  { label: 'Templates', path: '/templates', icon: 'FileText', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: 'Campaigns', path: '/campaigns', icon: 'Megaphone', roles: Object.values(ROLES) },
  { label: 'Automation', path: '/automation', icon: 'Workflow', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: 'Chatbot Builder', path: '/chatbot', icon: 'Bot', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: 'AI Agent', path: '/ai-agent', icon: 'Sparkles', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: 'WhatsApp Flows', path: '/flows', icon: 'GitBranch', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: 'Catalog', path: '/catalog', icon: 'Package', roles: Object.values(ROLES) },
  { label: 'Payments', path: '/payments', icon: 'CreditCard', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: 'Orders', path: '/orders', icon: 'ShoppingCart', roles: Object.values(ROLES) },
  { label: 'Reports & Analytics', path: '/reports', icon: 'BarChart3', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: 'API Logs', path: '/api-logs', icon: 'Code', roles: [ROLES.ADMIN] },
  { label: 'Schedule Logs', path: '/schedule-logs', icon: 'Clock', roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { label: 'Integrations', path: '/integrations', icon: 'Plug', roles: [ROLES.ADMIN] },
  { label: 'Team & Roles', path: '/team', icon: 'Shield', roles: [ROLES.ADMIN] },
  { label: 'Settings', path: '/settings', icon: 'Settings', roles: [ROLES.ADMIN, ROLES.MANAGER] },
]
