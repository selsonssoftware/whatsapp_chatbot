import { describe, it, expect } from 'vitest'
import {
  buildOrderTotals,
  canTransition,
  nextOrderId,
  validateOrderItems,
  ORDER_STATUSES,
} from './commerceService.js'

const products = [
  { id: 1, name: 'Premium T-Shirt', sku: 'TS001', price: 29.99, stock: 50 },
  { id: 2, name: 'Wireless Headphones', sku: 'WH001', price: 99.99, stock: 30 },
]

describe('validateOrderItems', () => {
  it('rejects an empty cart', () => {
    expect(validateOrderItems([], products)).toBe('Add at least one product')
  })

  it('rejects an unknown product', () => {
    expect(validateOrderItems([{ productId: 99, qty: 1 }], products)).toBe('Unknown product selected')
  })

  it('rejects a non positive quantity', () => {
    expect(validateOrderItems([{ productId: 1, qty: 0 }], products)).toBe('Enter a valid quantity for Premium T-Shirt')
    expect(validateOrderItems([{ productId: 1, qty: -3 }], products)).toMatch(/valid quantity/)
  })

  it('rejects a quantity above the available stock', () => {
    expect(validateOrderItems([{ productId: 1, qty: 51 }], products)).toBe(
      'Only 50 unit(s) of Premium T-Shirt available in stock'
    )
  })

  it('accepts a valid cart', () => {
    expect(validateOrderItems([{ productId: 1, qty: 2 }], products)).toBeNull()
  })
})

describe('buildOrderTotals', () => {
  it('calculates subtotal, tax, shipping and total', () => {
    const totals = buildOrderTotals([{ productId: 1, qty: 2 }], products)
    expect(totals.subtotal).toBe(59.98)
    expect(totals.tax).toBe(4.8)
    expect(totals.shipping).toBe(5)
    expect(totals.total).toBe(69.78)
  })

  it('keeps one line per item with the product snapshot', () => {
    const totals = buildOrderTotals([{ productId: 2, qty: 1 }], products)
    expect(totals.lines).toHaveLength(1)
    expect(totals.lines[0]).toMatchObject({ name: 'Wireless Headphones', sku: 'WH001', qty: 1, price: 99.99 })
  })

  it('sums multiple lines', () => {
    const totals = buildOrderTotals(
      [{ productId: 1, qty: 1 }, { productId: 2, qty: 1 }],
      products
    )
    expect(totals.subtotal).toBe(129.98)
    expect(totals.tax).toBe(10.4)
    expect(totals.shipping).toBe(5)
    expect(totals.total).toBe(145.38)
  })
})

describe('canTransition', () => {
  it('allows the documented order flow', () => {
    expect(canTransition('pending', 'confirmed')).toBe(true)
    expect(canTransition('processing', 'shipped')).toBe(true)
  })

  it('blocks jumps that are not allowed', () => {
    expect(canTransition('pending', 'delivered')).toBe(false)
    expect(canTransition('cancelled', 'confirmed')).toBe(false)
  })

  it('exposes a fixed status list', () => {
    expect(ORDER_STATUSES).toContain('pending')
    expect(ORDER_STATUSES).toContain('cancelled')
  })
})

describe('nextOrderId', () => {
  it('continues from the highest id', () => {
    expect(nextOrderId([{ id: 3 }, { id: 9 }, { id: 5 }])).toBe(10)
  })

  it('starts at one for an empty list', () => {
    expect(nextOrderId([])).toBe(1)
  })
})
