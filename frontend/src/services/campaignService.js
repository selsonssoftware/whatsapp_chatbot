const KEY = 'wa_campaigns'

const seedCampaigns = [
  {
    id: 1,
    name: 'Welcome Campaign',
    status: 'completed',
    recipients: 1250,
    sent: 1250,
    delivered: 1180,
    read: 950,
    failed: 70,
    templateId: 1,
    scheduledAt: '2026-01-10 10:00',
    sentAt: '2026-01-10 10:05',
    createdAt: '2026-01-08',
  },
  {
    id: 2,
    name: 'Product Launch',
    status: 'completed',
    recipients: 850,
    sent: 850,
    delivered: 820,
    read: 680,
    failed: 30,
    templateId: 1,
    scheduledAt: '2026-01-12 14:00',
    sentAt: '2026-01-12 14:02',
    createdAt: '2026-01-11',
  },
  {
    id: 3,
    name: 'Flash Sale',
    status: 'in_progress',
    recipients: 2000,
    sent: 1800,
    delivered: 1720,
    read: 1200,
    failed: 80,
    templateId: 1,
    scheduledAt: '2026-01-15 09:00',
    sentAt: '2026-01-15 09:01',
    createdAt: '2026-01-13',
  },
  {
    id: 4,
    name: 'Follow-up',
    status: 'scheduled',
    recipients: 500,
    sent: 0,
    delivered: 0,
    read: 0,
    failed: 0,
    templateId: 2,
    scheduledAt: '2026-01-20 10:00',
    sentAt: null,
    createdAt: '2026-01-16',
  },
]

export function getCampaigns() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(seedCampaigns))
      return seedCampaigns
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seedCampaigns
  } catch {
    localStorage.setItem(KEY, JSON.stringify(seedCampaigns))
    return seedCampaigns
  }
}

export function saveCampaigns(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function nextCampaignId(campaigns) {
  return campaigns.reduce((max, c) => Math.max(max, c.id), 0) + 1
}

/**
 * Creates a simulated campaign record. Nothing is sent to WhatsApp:
 * delivery metrics are derived locally.
 */
export function createCampaignRecord({ name, templateId, recipients, scheduledAt, message, status = 'scheduled' }) {
  const campaigns = getCampaigns()
  const now = new Date().toISOString()
  const simulatedSent = status === 'sent' ? recipients : 0
  const simulatedDelivered = Math.round(simulatedSent * 0.94)
  const simulatedRead = Math.round(simulatedDelivered * 0.8)

  const record = {
    id: nextCampaignId(campaigns),
    name: name.trim(),
    status,
    recipients,
    sent: simulatedSent,
    delivered: simulatedDelivered,
    read: simulatedRead,
    failed: simulatedSent - simulatedDelivered,
    templateId: templateId ? Number(templateId) : null,
    message: message || '',
    scheduledAt: scheduledAt || null,
    sentAt: status === 'sent' ? now : null,
    createdAt: now.slice(0, 10),
  }

  saveCampaigns([...campaigns, record])
  return record
}
