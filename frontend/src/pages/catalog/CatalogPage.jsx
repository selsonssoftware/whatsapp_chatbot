import { useState } from 'react'
import { getProducts, saveProducts, getCategories, saveCategories } from '../../services/catalogService.js'
import { Button, Card, Badge, SearchBar, Icon, Input, Modal, Tabs } from '../../components/index.js'

const EMPTY_FORM = { name: '', sku: '', description: '', category: '', price: '', stock: '', status: 'active' }

export default function CatalogPage() {
  const [products, setProducts] = useState(() => getProducts())
  const [categories, setCategories] = useState(() => getCategories())
  const [search, setSearch] = useState('')
  const [view, setView] = useState('table')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState({ name: '', sku: '', description: '', category: '', price: '', stock: '', status: 'active' })
  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [previewProduct, setPreviewProduct] = useState(null)
  const [showCategories, setShowCategories] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [categoryError, setCategoryError] = useState('')

  const filtered = products.filter(
    (p) =>
      (p.name + p.sku + p.description).toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === 'all' || p.category === categoryFilter) &&
      (statusFilter === 'all' || p.status === statusFilter) &&
      (stockFilter === 'all' ||
        (stockFilter === 'out' ? p.stock <= 0 : stockFilter === 'low' ? p.stock > 0 && p.stock <= 10 : p.stock > 10))
  )

  const validateForm = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Product name is required'
    if (!form.sku.trim()) e.sku = 'SKU is required'
    else if (products.some((p) => p.sku.toLowerCase() === form.sku.trim().toLowerCase() && p.id !== editingProduct?.id))
      e.sku = 'SKU already exists'
    if (form.price === '' || Number.isNaN(Number(form.price))) e.price = 'Enter a valid price'
    else if (Number(form.price) < 0) e.price = 'Price cannot be negative'
    if (form.stock === '' || Number.isNaN(Number(form.stock))) e.stock = 'Enter a valid quantity'
    else if (Number(form.stock) < 0) e.stock = 'Stock cannot be negative'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const persistProducts = (next) => {
    setProducts(next)
    saveProducts(next)
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
    if (!validateForm()) return
    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    if (editingProduct) {
      const next = products.map((p) => (p.id === editingProduct.id ? { ...p, ...productData } : p))
      persistProducts(next)
    } else {
      const newProduct = { ...productData, id: Date.now(), currency: 'USD', image: '' }
      persistProducts([...products, newProduct])
    }

    setShowForm(false)
    setEditingProduct(null)
    setForm({ name: '', sku: '', description: '', category: '', price: '', stock: '', status: 'active' })
    setErrors({})
  }

  const deleteProduct = (id) => {
    if (!confirm('Delete this product?')) return
    persistProducts(products.filter((p) => p.id !== id))
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
    persistProducts([...products, copy])
  }

  const addCategory = () => {
    const name = newCategory.trim()
    if (!name) {
      setCategoryError('Category name is required')
      return
    }
    if (categories.some((c) => c.toLowerCase() === name.toLowerCase())) {
      setCategoryError('Category already exists')
      return
    }
    const next = [...categories, name]
    setCategories(next)
    saveCategories(next)
    setNewCategory('')
    setCategoryError('')
  }

  const renameCategory = (oldName, newName) => {
    const name = newName.trim()
    if (!name) return
    if (categories.some((c) => c !== oldName && c.toLowerCase() === name.toLowerCase())) {
      setCategoryError('Category already exists')
      return
    }
    const nextCategories = categories.map((c) => (c === oldName ? name : c))
    setCategories(nextCategories)
    saveCategories(nextCategories)
    persistProducts(products.map((p) => (p.category === oldName ? { ...p, category: name } : p)))
    setCategoryError('')
  }

  const deleteCategory = (name) => {
    const inUse = products.filter((p) => p.category === name).length
    if (inUse > 0) {
      setCategoryError(`"${name}" is still used by ${inUse} product(s). Reassign them before deleting.`)
      return
    }
    if (!confirm(`Delete category "${name}"?`)) return
    const next = categories.filter((c) => c !== name)
    setCategories(next)
    saveCategories(next)
    setCategoryError('')
  }

  const preview = (product) => {
    setPreviewProduct(product)
    setShowPreview(true)
  }

  const totalProducts = products.length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0)
  const activeProducts = products.filter((p) => p.status === 'active').length
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 10).length
  const outOfStockProducts = products.filter((p) => p.stock <= 0).length

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Catalog</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your product catalog for WhatsApp commerce</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => { setShowCategories(true); setCategoryError('') }}>
            <Icon name="Folder" size={16} />
            Categories
          </Button>
          <Button variant="primary" onClick={() => { setEditingProduct(null); setForm(EMPTY_FORM); setErrors({}); setShowForm(true) }}>
            <Icon name="Plus" size={16} />
            Add Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalProducts}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Products</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeProducts}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{lowStockProducts}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{outOfStockProducts}</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2 text-sm text-gray-600 dark:text-gray-400">
        <p>Units in stock: <span className="font-semibold text-gray-900 dark:text-gray-100">{totalStock}</span></p>
        <p className="md:text-right">Inventory value: <span className="font-semibold text-gray-900 dark:text-gray-100">${totalValue.toLocaleString()}</span></p>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search products..." />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          aria-label="Filter by stock"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Stock</option>
          <option value="in">In stock</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
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
          <Input label="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
          <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} error={errors.sku} />
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
            <Input label="Price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} error={errors.price} />
            <Input label="Stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} error={errors.stock} />
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
              <Button variant="primary" className="w-full mt-3" disabled title="Cart actions are handled by the backend in production">
                Add to Cart (preview only)
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
      <Modal
        isOpen={showCategories}
        onClose={() => { setShowCategories(false); setCategoryError('') }}
        title="Manage Categories"
        footer={
          <Button variant="secondary" onClick={() => { setShowCategories(false); setCategoryError('') }}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={newCategory}
              onChange={(e) => { setNewCategory(e.target.value); setCategoryError('') }}
              placeholder="New category name"
              aria-label="New category name"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
            <Button variant="primary" onClick={addCategory}>
              Add
            </Button>
          </div>
          {categoryError && <p className="error">{categoryError}</p>}
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((cat) => (
              <li key={cat} className="flex items-center gap-2 py-2">
                <input
                  defaultValue={cat}
                  aria-label={`Rename ${cat}`}
                  onBlur={(e) => renameCategory(cat, e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                />
                <span className="text-xs text-gray-500">{products.filter((p) => p.category === cat).length} product(s)</span>
                <button className="icon-btn text-red-600" onClick={() => deleteCategory(cat)} aria-label={`Delete ${cat}`}>
                  <Icon name="Trash2" size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  )
}
