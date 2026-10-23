export const ROLES = {
  ADMIN: 'Admin',
  SUPPORTER: 'Supporter',
  SUPER_ADMIN: 'super_admin',
}

export const SUPPORTER_MANAGER_ROLES = [ROLES.ADMIN]

export const USERS = [
  {
    id: 1,
    name: 'Ava Admin',
    email: 'admin@example.com',
    role: ROLES.ADMIN,
  },
  {
    id: 2,
    name: 'Ravi Kumar',
    email: 'supporter@example.com',
    role: ROLES.SUPPORTER,
  },
]

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard', roles: [ROLES.ADMIN] },
  { label: 'Team Inbox', path: '/inbox', icon: 'MessageSquare', roles: [ROLES.ADMIN, ROLES.SUPPORTER] },
  { label: 'Compose Message', path: '/compose', icon: 'Send', roles: [ROLES.ADMIN], hasChildren: true },
  { label: 'Contacts', path: '/contacts', icon: 'Users', roles: [ROLES.ADMIN], hasChildren: true },
  { label: 'Leads & Pipeline', path: '/leads', icon: 'Target', roles: [ROLES.ADMIN] },
  { label: 'Templates', path: '/templates', icon: 'FileText', roles: [ROLES.ADMIN], hasChildren: true },
  { label: 'Campaigns / Broadcast', path: '/campaigns', icon: 'Mail', roles: [ROLES.ADMIN], hasChildren: true },
  { label: 'Automation', path: '/automation', icon: 'Workflow', roles: [ROLES.ADMIN], hasChildren: true },
  { label: 'Chatbot Builder', path: '/chatbot', icon: 'Bot', roles: [ROLES.ADMIN] },
  { label: 'AI Agent', path: '/ai-agent', icon: 'Sparkles', roles: [ROLES.ADMIN], badge: 'Beta' },
  { label: 'WhatsApp Flows', path: '/flows', icon: 'GitBranch', roles: [ROLES.ADMIN] },
  { label: 'Catalog', path: '/catalog', icon: 'Package', roles: [ROLES.ADMIN] },
  { label: 'Payments', path: '/payments', icon: 'CreditCard', roles: [ROLES.ADMIN], hasChildren: true },
  { label: 'Reports & Analytics', path: '/reports', icon: 'BarChart3', roles: [ROLES.ADMIN] },
  { label: 'API Logs', path: '/api-logs', icon: 'Code', roles: [ROLES.ADMIN] },
  { label: 'Schedule Logs', path: '/schedule-logs', icon: 'Clock', roles: [ROLES.ADMIN] },
  { label: 'Integrations', path: '/integrations', icon: 'Plug', roles: [ROLES.ADMIN] },
  { label: 'Team & Roles', path: '/team', icon: 'Shield', roles: [ROLES.ADMIN], hasChildren: true },
  { label: 'Settings', path: '/settings', icon: 'Settings', roles: [ROLES.ADMIN] },
]
