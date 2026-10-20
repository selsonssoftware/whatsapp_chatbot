import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthProvider.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import ErrorBoundary from '../components/ErrorBoundary.jsx'
import RouteFallback from '../components/RouteFallback.jsx'
import { NAV_ITEMS } from '../constants/roles.js'

const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'))
const HomePage = lazy(() => import('../pages/HomePage.jsx'))
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.jsx'))
const PlaceholderPage = lazy(() => import('../pages/PlaceholderPage.jsx'))
const InboxPage = lazy(() => import('../pages/inbox/InboxPage.jsx'))
const ContactsPage = lazy(() => import('../pages/contacts/ContactsPage.jsx'))
const ComposePage = lazy(() => import('../pages/compose/ComposePage.jsx'))
const LeadsPage = lazy(() => import('../pages/leads/LeadsPage.jsx'))
const TemplatesPage = lazy(() => import('../pages/templates/TemplatesPage.jsx'))
const CampaignsPage = lazy(() => import('../pages/campaigns/CampaignsPage.jsx'))
const AutomationPage = lazy(() => import('../pages/automation/AutomationPage.jsx'))
const ChatbotPage = lazy(() => import('../pages/chatbot/ChatbotPage.jsx'))
const AIAgentPage = lazy(() => import('../pages/ai-agent/AIAgentPage.jsx'))
const FlowsPage = lazy(() => import('../pages/flows/FlowsPage.jsx'))
const CatalogPage = lazy(() => import('../pages/catalog/CatalogPage.jsx'))
const PaymentsPage = lazy(() => import('../pages/payments/PaymentsPage.jsx'))
const OrdersPage = lazy(() => import('../pages/orders/OrdersPage.jsx'))
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage.jsx'))
const ApiLogsPage = lazy(() => import('../pages/logs/ApiLogsPage.jsx'))
const ScheduleLogsPage = lazy(() => import('../pages/logs/ScheduleLogsPage.jsx'))
const IntegrationsPage = lazy(() => import('../pages/integrations/IntegrationsPage.jsx'))
const TeamPage = lazy(() => import('../pages/team/TeamPage.jsx'))
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage.jsx'))

const APP_NAME = 'WhatsApp SaaS'

const PAGE_ROUTES = [
  { path: '/dashboard', component: HomePage },
  { path: '/inbox', component: InboxPage },
  { path: '/contacts', component: ContactsPage },
  { path: '/compose', component: ComposePage },
  { path: '/leads', component: LeadsPage },
  { path: '/templates', component: TemplatesPage },
  { path: '/campaigns', component: CampaignsPage },
  { path: '/automation', component: AutomationPage },
  { path: '/chatbot', component: ChatbotPage },
  { path: '/ai-agent', component: AIAgentPage },
  { path: '/flows', component: FlowsPage },
  { path: '/catalog', component: CatalogPage },
  { path: '/payments', component: PaymentsPage },
  { path: '/orders', component: OrdersPage },
  { path: '/reports', component: ReportsPage },
  { path: '/api-logs', component: ApiLogsPage },
  { path: '/schedule-logs', component: ScheduleLogsPage },
  { path: '/integrations', component: IntegrationsPage },
  { path: '/team', component: TeamPage },
  { path: '/settings', component: SettingsPage },
]

const implementedPaths = new Set(PAGE_ROUTES.map((route) => route.path))

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  )
}

/**
 * Restores the scroll position on navigation and keeps the document title in
 * sync with the active module.
 */
function RouteEffects() {
  const { pathname } = useLocation()

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    const label = NAV_ITEMS.find((item) => item.path === pathname)?.label
    document.title = label ? `${label} · ${APP_NAME}` : APP_NAME
  }, [pathname])

  return null
}

function AppRoutes() {
  return (
    <>
      <RouteEffects />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {PAGE_ROUTES.map(({ path, component: Page }) => (
            <Route key={path} path={path} element={<ProtectedPage><Page /></ProtectedPage>} />
          ))}
          {NAV_ITEMS.filter((item) => !implementedPaths.has(item.path)).map((item) => (
            <Route
              key={item.path}
              path={item.path}
              element={<ProtectedPage><PlaceholderPage title={item.label} /></ProtectedPage>}
            />
          ))}
          <Route path="/404" element={<ProtectedPage><NotFoundPage /></ProtectedPage>} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}
