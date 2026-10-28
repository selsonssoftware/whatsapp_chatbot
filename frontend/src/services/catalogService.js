const PKEY = 'wa_products'
const CKEY = 'wa_categories'

const seedProducts = [
  { id: 1, name: 'Premium T-Shirt', sku: 'TS001', description: 'High-quality cotton t-shirt', category: 'Apparel', price: 29.99, currency: 'USD', stock: 50, image: '', status: 'active', updatedAt: '2026-01-10' },
  { id: 2, name: 'Wireless Headphones', sku: 'WH001', description: 'Bluetooth wireless headphones', category: 'Electronics', price: 99.99, currency: 'USD', stock: 30, image: '', status: 'active', updatedAt: '2026-01-11' },
  { id: 3, name: 'Running Shoes', sku: 'RS001', description: 'Comfortable running shoes', category: 'Apparel', price: 79.99, currency: 'USD', stock: 25, image: '', status: 'active', updatedAt: '2026-01-12' },
  { id: 4, name: 'Smart Watch', sku: 'SW001', description: 'Feature-rich smartwatch', category: 'Electronics', price: 149.99, currency: 'USD', stock: 15, image: '', status: 'active', updatedAt: '2026-01-13' },
]

const seedCategories = ['Apparel', 'Electronics', 'Accessories']

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

export function getProducts() {
  return readList(PKEY, seedProducts)
}

export function saveProducts(list) {
  localStorage.setItem(PKEY, JSON.stringify(list))
}

export function getCategories() {
  return readList(CKEY, seedCategories)
}

export function saveCategories(list) {
  localStorage.setItem(CKEY, JSON.stringify(list))
}
