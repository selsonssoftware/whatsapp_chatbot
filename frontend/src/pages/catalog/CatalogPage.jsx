import { useState } from 'react'
import { getProducts, saveProducts, getCategories, saveCategories } from '../../services/catalogService.js'
import { Button, Card, Badge, SearchBar, Icon, Input, Modal, Tabs } from '../../components/index.js'

const DEMO_PRODUCTS = [
  { id: 1, name: 'Premium T-Shirt', sku: 'TS001', description: 'High-quality cotton t-shirt', category: 'Apparel', price: 29.99, currency: 'USD', stock: 50, image: '', status: 'active', updatedAt: '2026-01-10' },
  { id: 2, name: 'Wireless Headphones', sku: 'WH001', description: 'Bluetooth wireless headphones', category: 'Electronics', price: 99.99, currency: 'USD', stock: 30, image: '', status: 'active', updatedAt: '2026-01-11' },
  { id: 3, name: 'Running Shoes', sku: 'RS001', description: 'Comfortable running shoes', category: 'Apparel', price: 79.99, currency: 'USD', stock: 25, image: '', status: 'active', updatedAt: '2026-01-12' },
  { id: 4, name: 'Smart Watch', sku: 'SW001', description: 'Feature-rich smartwatch', category: 'Electronics', price: 149.99, currency: 'USD', stock: 15, image: '', status: 'active', updatedAt: '2026-01-13' },
]

export default function CatalogPage() {
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [categories] = useState(['Apparel', 'Electronics', 'Accessories'])
  const [search, setSearch] = useState('')
  const [view, setView] = useState('table')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ name: '', sku: '', description: '', category: '', price: '', stock: '', status: 'active' })
  const [showPreview, setShowPreview] = useState(false)
  const [previewProduct, setPreviewProduct] = useState(null)

  const filtered = products.filter(
    (p) =>
      (p.name + p.sku + p.description).toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === 'all' || p.category === categoryFilter)
  )

  const createProduct = () => {
    if (!form.name || !form.sku || !form.price) {
      alert('Name, SKU, and price are required')
      return
    }
    const newProduct = {
      ...form,
      id: Date.now(),
      price: Number(form.price),
      stock: Number(form.stock),
      currency: 'USD',
      image: '',
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    setProducts((prev) => [...prev, newProduct])
    saveProducts([...products, newProduct])
    setShowForm(false)
    setForm({ name: '', sku: '', description: '', category: '', price: '', stock: '', status: 'active' })
  }

  const editProduct = (product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
    })
    setShowForm(true)
  }

  const saveProduct = () => {
    if (!form.name || !form.sku || !form.price) {
      alert('Name, SKU, and price are required')
      return
    }
    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p)))
      saveProducts(products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p)))
    } else {
      const newProduct = { ...productData, id: Date.now(), currency: 'USD', image: '' }
      setProducts((prev) => [...prev, newProduct])
      saveProducts([...products, newProduct])
    }

    setShowForm(false)
    setEditingProduct(null)
    setForm({ name: '', sku: '', description: '', category: '', price: '', stock: '', status: 'active' })
  }

  const deleteProduct = (id) => {
    if (!confirm('Delete this product?')) return
    const next = products.filter((p) => p.id !== id)
    setProducts(next)
    saveProducts(next)
  }

  const duplicateProduct = (product) => {
    const copy = {
      ...product,
      id: Date.now(),
      name: product.name + ' (Copy)',
      sku: product.sku + '-COPY',
      stock: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    setProducts((prev) => [...prev, copy])
    saveProducts([...products, copy])
  }

  const preview = (product) => {
    setPreviewProduct(product)
    setShowPreview(true)
  }

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Catalog</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product catalog for WhatsApp commerce</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingProduct(null); setForm({ name: '', sku: '', description: '', category: '', price: '', stock: '', status: 'active' }); setShowForm(true) }}>
          <Icon name="Plus" size={16} />
          Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalProducts}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Stock</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalStock}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Inventory Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">${totalValue.toLocaleString()}</p>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <Tabs
          tabs={[
            { id: 'table', label: 'Table' },
            { id: 'grid', label: 'Grid' },
          ]}
          activeTab={view}
          onChange={setView}
        />
      </div>

      {view === 'table' && (
        <Card>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                        <Icon name="Package" size={20} className="text-gray-400" />
                      </div>
                    </td>
                    <td className="font-medium">{p.name}</td>
                    <td>{p.sku}</td>
                    <td>{p.category}</td>
                    <td>${p.price.toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <Badge variant={p.status === 'active' ? 'success' : 'warning'}>{p.status}</Badge>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="icon-btn" onClick={() => preview(p)} aria-label="Preview">
                          <Icon name="Eye" size={16} />
                        </button>
                        <button className="icon-btn" onClick={() => editProduct(p)} aria-label="Edit">
                          <Icon name="Edit" size={16} />
                        </button>
                        <button className="icon-btn" onClick={() => duplicateProduct(p)} aria-label="Duplicate">
                          <Icon name="Copy" size={16} />
                        </button>
                        <button className="icon-btn text-red-600" onClick={() => deleteProduct(p.id)} aria-label="Delete">
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <Card key={p.id} className="hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg mb-3 flex items-center justify-center">
                <Icon name="Package" size={48} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{p.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{p.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-brand-600 dark:text-brand-400">${p.price.toFixed(2)}</span>
                <Badge variant={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'error'}>{p.stock} in stock</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => editProduct(p)}>
                  Edit
                </Button>
                <Button variant="secondary" size="sm" onClick={() => preview(p)}>
                  <Icon name="Eye" size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingProduct(null) }}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingProduct(null) }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveProduct}>
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showPreview}
        onClose={() => { setShowPreview(false); setPreviewProduct(null) }}
        title="WhatsApp Product Preview"
        footer={
          <Button variant="secondary" onClick={() => { setShowPreview(false); setPreviewProduct(null) }}>
            Close
          </Button>
        }
      >
        {previewProduct && (
          <div className="space-y-4">
            <div className="max-w-sm mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-4 border-gray-300 dark:border-gray-600">
              <div className="aspect-square bg-white dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                <Icon name="Package" size={64} className="text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{previewProduct.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{previewProduct.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-brand-600 dark:text-brand-400">${previewProduct.price.toFixed(2)}</span>
                <Badge variant={previewProduct.stock > 10 ? 'success' : 'warning'}>{previewProduct.stock} available</Badge>
              </div>
              <Button variant="primary" className="w-full mt-3">
                Add to Cart
              </Button>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                <Icon name="Info" size={16} className="inline mr-1" />
                This is how the product will appear in WhatsApp messages.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
