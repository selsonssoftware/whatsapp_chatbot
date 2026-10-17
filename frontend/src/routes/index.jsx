import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthProvider.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import LoginPage from '../pages/auth/LoginPage.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import HomePage from '../pages/HomePage.jsx'
import PlaceholderPage from '../pages/PlaceholderPage.jsx'
import InboxPage from '../pages/inbox/InboxPage.jsx'
import ContactsPage from '../pages/contacts/ContactsPage.jsx'
import ComposePage from '../pages/compose/ComposePage.jsx'
import LeadsPage from '../pages/leads/LeadsPage.jsx'
import TemplatesPage from '../pages/templates/TemplatesPage.jsx'
import CampaignsPage from '../pages/campaigns/CampaignsPage.jsx'
import AutomationPage from '../pages/automation/AutomationPage.jsx'
import ChatbotPage from '../pages/chatbot/ChatbotPage.jsx'
import AIAgentPage from '../pages/ai-agent/AIAgentPage.jsx'
import FlowsPage from '../pages/flows/FlowsPage.jsx'
import CatalogPage from '../pages/catalog/CatalogPage.jsx'
import PaymentsPage from '../pages/payments/PaymentsPage.jsx'
import OrdersPage from '../pages/orders/OrdersPage.jsx'
import ReportsPage from '../pages/reports/ReportsPage.jsx'
import ApiLogsPage from '../pages/logs/ApiLogsPage.jsx'
import ScheduleLogsPage from '../pages/logs/ScheduleLogsPage.jsx'
import IntegrationsPage from '../pages/integrations/IntegrationsPage.jsx'
import TeamPage from '../pages/team/TeamPage.jsx'
import SettingsPage from '../pages/settings/SettingsPage.jsx'
import { NAV_ITEMS } from '../constants/roles.js'

const implemented = ['/dashboard','/inbox','/contacts','/compose','/leads','/templates','/campaigns','/automation','/chatbot','/ai-agent','/flows','/catalog','/payments','/orders','/reports','/api-logs','/schedule-logs','/integrations','/team','/settings']

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
      <Route path="/inbox" element={<ProtectedRoute><AppLayout><InboxPage /></AppLayout></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><AppLayout><ContactsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/compose" element={<ProtectedRoute><AppLayout><ComposePage /></AppLayout></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><AppLayout><LeadsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><AppLayout><TemplatesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/campaigns" element={<ProtectedRoute><AppLayout><CampaignsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/automation" element={<ProtectedRoute><AppLayout><AutomationPage /></AppLayout></ProtectedRoute>} />
      <Route path="/chatbot" element={<ProtectedRoute><AppLayout><ChatbotPage /></AppLayout></ProtectedRoute>} />
      <Route path="/ai-agent" element={<ProtectedRoute><AppLayout><AIAgentPage /></AppLayout></ProtectedRoute>} />
      <Route path="/flows" element={<ProtectedRoute><AppLayout><FlowsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/catalog" element={<ProtectedRoute><AppLayout><CatalogPage /></AppLayout></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><AppLayout><PaymentsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><AppLayout><OrdersPage /></AppLayout></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><AppLayout><ReportsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/api-logs" element={<ProtectedRoute><AppLayout><ApiLogsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/schedule-logs" element={<ProtectedRoute><AppLayout><ScheduleLogsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/integrations" element={<ProtectedRoute><AppLayout><IntegrationsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><AppLayout><TeamPage /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
      {NAV_ITEMS.filter((n) => !implemented.includes(n.path)).map((n) => (
        <Route key={n.path} path={n.path} element={<ProtectedRoute><AppLayout><PlaceholderPage title={n.label} /></AppLayout></ProtectedRoute>} />
      ))}
    </Routes>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
