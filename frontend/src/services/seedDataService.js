import { getProducts, getCategories } from './catalogService.js'
import { getOrders, getTransactions } from './commerceService.js'
import { getTemplates } from './templateService.js'
import { getCampaigns } from './campaignService.js'
import { getAutomations } from './automationService.js'
import { getChatbots } from './chatbotService.js'
import { getAgents, getAgentTests } from './aiAgentService.js'
import { getFlows, getFlowSubmissions } from './flowsService.js'
import { getSupporters } from './supporterService.js'

export const SEED_STORAGE_KEYS = {
  products: 'wa_products',
  categories: 'wa_categories',
  orders: 'wa_orders',
  transactions: 'wa_transactions',
  templates: 'wa_templates',
  campaigns: 'wa_campaigns',
  automations: 'wa_automations',
  chatbots: 'wa_chatbots',
  aiAgents: 'wa_ai_agents',
  aiAgentTests: 'wa_ai_agent_tests',
  flows: 'wa_flows',
  flowSubmissions: 'wa_flow_submissions',
  supporters: 'wa_supporters',
  demoConversations: 'wa_demo_conversations',
  demoMessages: 'wa_demo_messages',
  integrations: 'wa_integration_settings',
  settings: 'wa_settings',
}

/**
 * Keys that are intentionally preserved when the stored data is reset:
 * - wa_session keeps the signed-in user
 * - theme keeps the light/dark preference
 * - wa_admin_accounts keeps the registered admin accounts so a reset never
 *   locks the workspace owner out
 */
export const PRESERVED_STORAGE_KEYS = ['wa_session', 'theme', 'wa_admin_accounts']

export function listSeedDataKeys() {
  return Object.values(SEED_STORAGE_KEYS).filter((key) => !PRESERVED_STORAGE_KEYS.includes(key))
}

export function resetSeedData() {
  listSeedDataKeys().forEach((key) => localStorage.removeItem(key))
  reseedSeedData()
}

/**
 * Re-creates the seeded records so every module is back to its
 * initial state without requiring a full page reload.
 */
export function reseedSeedData() {
  getProducts()
  getCategories()
  getOrders()
  getTransactions()
  getTemplates()
  getCampaigns()
  getAutomations()
  getChatbots()
  getAgents()
  getAgentTests()
  getFlows()
  getFlowSubmissions()
  getSupporters()
}

export function getStoredSeedData() {
  return listSeedDataKeys().map((key) => ({
    key,
    records: (() => {
      try {
        const raw = localStorage.getItem(key)
        if (!raw) return 0
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed.length : 1
      } catch {
        return 0
      }
    })(),
  }))
}
