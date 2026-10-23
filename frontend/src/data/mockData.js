export const companiesMock = [
  { id: 1, name: 'Acme Corp', email: 'acme@example.com', phone: '9999999999', plan: 'Prime', status: 'Active', created: '2026-10-20' },
  { id: 2, name: 'Globex', email: 'globex@example.com', phone: '8888888888', plan: 'Advance', status: 'Active', created: '2026-10-18' },
  { id: 3, name: 'Initech', email: 'initech@example.com', phone: '7777777777', plan: 'Basic', status: 'Trial', created: '2026-10-17' },
]

export const plansMock = [
  { id: 1, name: 'Basic', monthly: 99, yearly: 990, staff: 5, messages: 1000, status: 'Active' },
  { id: 2, name: 'Advance', monthly: 299, yearly: 2990, staff: 25, messages: 10000, status: 'Active' },
  { id: 3, name: 'Prime', monthly: 499, yearly: 4990, staff: 100, messages: 100000, status: 'Active' },
]

export const subscriptionsMock = [
  { id: 1, company: 'Acme Corp', plan: 'Prime', start: '2026-10-01', expiry: '2026-11-01', status: 'Active' },
  { id: 2, company: 'Globex', plan: 'Advance', start: '2026-09-15', expiry: '2026-10-15', status: 'Expired' },
  { id: 3, company: 'Initech', plan: 'Basic', start: '2026-10-10', expiry: '2026-11-10', status: 'Trial' },
]

export const paymentsMock = [
  { id: 'PAY-1001', company: 'Acme Corp', plan: 'Prime', amount: 499, method: 'Card', date: '2026-10-21', status: 'Paid' },
  { id: 'PAY-1002', company: 'Globex', plan: 'Advance', amount: 299, method: 'UPI', date: '2026-10-19', status: 'Paid' },
  { id: 'PAY-1003', company: 'Initech', plan: 'Basic', amount: 99, method: 'Card', date: '2026-10-18', status: 'Pending' },
]