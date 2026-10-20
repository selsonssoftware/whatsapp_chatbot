import { getProducts, saveProducts } from './catalogService.js'

const OKEY = 'wa_orders'
const TKEY = 'wa_transactions'

const seedOrders = [
  {
    id: 1,
    customer: 'John Doe',
    customerPhone: '+1234567890',
    items: [{ productId: 1, name: 'Premium T-Shirt', sku: 'TS001', qty: 2, price: 29.99 }],
    subtotal: 59.98,
    discount: 0,
    tax: 4.8,
    shipping: 5,
    total: 69.78,
    currency: 'USD',
    paymentStatus: 'paid',
    status: 'processing',
    stockDeducted: true,
    stockRestored: false,
    createdAt: '2026-01-10 10:30',
    updatedAt: '2026-01-10 10:35',
    statusHistory: [
      { status: 'pending', date: '2026-01-10 10:30' },
      { status: 'processing', date: '2026-01-10 10:35' },
    ],
  },
  {
    id: 2,
    customer: 'Jane Smith',
    customerPhone: '+1987654321',
    items: [{ productId: 2, name: 'Wireless Headphones', sku: 'WH001', qty: 1, price: 99.99 }],
    subtotal: 99.99,
    discount: 10,
    tax: 7.2,
    shipping: 0,
    total: 97.19,
    currency: 'USD',
    paymentStatus: 'pending',
    status: 'pending',
    stockDeducted: false,
    stockRestored: false,
    createdAt: '2026-01-11 14:15',
    updatedAt: '2026-01-11 14:15',
    statusHistory: [{ status: 'pending', date: '2026-01-11 14:15' }],
  },
  {
    id: 3,
    customer: 'Mike Brown',
    customerPhone: '+1555555555',
    items: [{ productId: 3, name: 'Running Shoes', sku: 'RS001', qty: 1, price: 79.99 }],
    subtotal: 79.99,
    discount: 0,
    tax: 6.4,
    shipping: 5,
    total: 91.39,
    currency: 'USD',
    paymentStatus: 'paid',
    status: 'shipped',
    stockDeducted: true,
    stockRestored: false,
    createdAt: '2026-01-12 09:20',
    updatedAt: '2026-01-13 10:00',
    statusHistory: [
      { status: 'pending', date: '2026-01-12 09:20' },
      { status: 'processing', date: '2026-01-12 09:25' },
      { status: 'shipped', date: '2026-01-13 10:00' },
    ],
  },
]

const seedTransactions = [
  { id: 1, orderId: 1, customer: 'John Doe', amount: 69.78, currency: 'USD', method: 'Card', status: 'success', createdAt: '2026-01-10 10:30', updatedAt: '2026-01-10 10:30' },
  { id: 2, orderId: 2, customer: 'Jane Smith', amount: 97.19, currency: 'USD', method: 'PayPal', status: 'pending', createdAt: '2026-01-11 14:15', updatedAt: '2026-01-11 14:15' },
  { id: 3, orderId: 3, customer: 'Mike Brown', amount: 91.39, currency: 'USD', method: 'Card', status: 'success', createdAt: '2026-01-12 09:20', updatedAt: '2026-01-13 10:00' },
  { id: 4, orderId: 4, customer: 'Emily Davis', amount: 29.99, currency: 'USD', method: 'Card', status: 'failed', createdAt: '2026-01-13 16:45', updatedAt: '2026-01-13 16:45' },
]

export const ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'processing', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
}

function readList(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback))
      return fallback
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    localStorage.setItem(key, JSON.stringify(fallback))
    return fallback
  }
}

export function getOrders() {
  return readList(OKEY, seedOrders)
}

export function saveOrders(list) {
  localStorage.setItem(OKEY, JSON.stringify(list))
}

export function getTransactions() {
  return readList(TKEY, seedTransactions)
}

export function saveTransactions(list) {
  localStorage.setItem(TKEY, JSON.stringify(list))
}

export function nextOrderId(orders) {
  return orders.reduce((max, o) => Math.max(max, o.id), 0) + 1
}

export function nextTransactionId(transactions) {
  return transactions.reduce((max, t) => Math.max(max, t.id), 0) + 1
}

export function canTransition(from, to) {
  return (ALLOWED_TRANSITIONS[from] || []).includes(to)
}

export function validateOrderItems(items, products) {
  if (!items || items.length === 0) return 'Add at least one product'
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)
    if (!product) return 'Unknown product selected'
    const qty = Number(item.qty)
    if (!qty || qty <= 0) return `Enter a valid quantity for ${product.name}`
    if (qty > product.stock) return `Only ${product.stock} unit(s) of ${product.name} available in stock`
  }
  return null
}

export function buildOrderTotals(items, products) {
  const lines = items.map((item) => {
    const product = products.find((p) => p.id === item.productId)
    return {
      productId: product.id,
      name: product.name,
      sku: product.sku,
      qty: Number(item.qty),
      price: product.price,
    }
  })
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0)
  const tax = Number((subtotal * 0.08).toFixed(2))
  const shipping = subtotal > 0 ? 5 : 0
  const total = Number((subtotal + tax + shipping).toFixed(2))
  return { lines, subtotal: Number(subtotal.toFixed(2)), tax, shipping, total }
}

export function createOrder({ customer, customerPhone, items }) {
  const products = getProducts()
  const error = validateOrderItems(items, products)
  if (error) return { ok: false, error }

  const orders = getOrders()
  const transactions = getTransactions()
  const { lines, subtotal, tax, shipping, total } = buildOrderTotals(items, products)
  const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
  const orderId = nextOrderId(orders)

  const order = {
    id: orderId,
    customer: customer.trim(),
    customerPhone: customerPhone.trim(),
    items: lines,
    subtotal,
    discount: 0,
    tax,
    shipping,
    total,
    currency: 'USD',
    paymentStatus: 'pending',
    status: 'pending',
    stockDeducted: false,
    stockRestored: false,
    createdAt: now,
    updatedAt: now,
    statusHistory: [{ status: 'pending', date: now }],
  }

  saveOrders([...orders, order])
  saveTransactions([
    ...transactions,
    {
      id: nextTransactionId(transactions),
      orderId: order.id,
      customer: order.customer,
      amount: order.total,
      currency: order.currency,
      method: 'Card',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    },
  ])

  return { ok: true, order }
}

function adjustStock(products, order, direction) {
  const next = products.map((p) => {
    const line = order.items.find((i) => i.productId === p.id)
    if (!line) return p
    const delta = direction === 'deduct' ? -line.qty : line.qty
    return { ...p, stock: Math.max(0, p.stock + delta) }
  })
  saveProducts(next)
  return next
}

export function updateOrderStatus(orderId, nextStatus) {
  const orders = getOrders()
  const order = orders.find((o) => o.id === orderId)
  if (!order) return { ok: false, error: 'Order not found' }
  if (order.status === nextStatus) return { ok: false, error: `Order is already ${nextStatus}` }
  if (!canTransition(order.status, nextStatus)) {
    return { ok: false, error: `Cannot move an order from ${order.status} to ${nextStatus}` }
  }

  let stockDeducted = order.stockDeducted
  let stockRestored = order.stockRestored
  if (nextStatus === 'processing' && !stockDeducted) {
    adjustStock(getProducts(), order, 'deduct')
    stockDeducted = true
  }

  if (nextStatus === 'cancelled' && stockDeducted && !stockRestored) {
    adjustStock(getProducts(), order, 'restore')
    stockRestored = true
  }

  const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
  const updated = {
    ...order,
    status: nextStatus,
    stockDeducted,
    stockRestored,
    updatedAt: now,
    statusHistory: [...order.statusHistory, { status: nextStatus, date: now }],
  }
  saveOrders(orders.map((o) => (o.id === orderId ? updated : o)))

  if (nextStatus === 'cancelled') {
    const transactions = getTransactions()
    saveTransactions(
      transactions.map((t) =>
        t.orderId === orderId && t.status === 'pending' ? { ...t, status: 'cancelled', updatedAt: now } : t
      )
    )
  }

  return { ok: true, order: updated }
}

export function retryPayment(transactionId) {
  const transactions = getTransactions()
  const tx = transactions.find((t) => t.id === transactionId)
  if (!tx) return { ok: false, error: 'Transaction not found' }
  if (tx.status !== 'failed') return { ok: false, error: 'Only failed transactions can be retried' }

  const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
  const updated = { ...tx, status: 'pending', updatedAt: now }
  saveTransactions(transactions.map((t) => (t.id === transactionId ? updated : t)))

  const orders = getOrders()
  saveOrders(orders.map((o) => (o.id === tx.orderId ? { ...o, paymentStatus: 'pending', updatedAt: now } : o)))

  return { ok: true, transaction: updated }
}

export function refundPayment(transactionId) {
  const transactions = getTransactions()
  const tx = transactions.find((t) => t.id === transactionId)
  if (!tx) return { ok: false, error: 'Transaction not found' }
  if (tx.status !== 'success') return { ok: false, error: 'Only successful transactions can be refunded' }

  const now = new Date().toISOString().slice(0, 16).replace('T', ' ')
  const updated = { ...tx, status: 'refunded', updatedAt: now }
  saveTransactions(transactions.map((t) => (t.id === transactionId ? updated : t)))

  const orders = getOrders()
  saveOrders(orders.map((o) => (o.id === tx.orderId ? { ...o, paymentStatus: 'refunded', updatedAt: now } : o)))

  return { ok: true, transaction: updated }
}
