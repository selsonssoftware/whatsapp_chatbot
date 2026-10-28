import { useState } from 'react'
import {
  Package,
  CheckCircle2,
  Folder,
  Eye,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Edit2,
  MoreVertical,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Share2,
} from 'lucide-react'
import { BLAST_KPIS, CATALOG_PRODUCTS } from '../../data/mockBlastData.js'

export default function CatalogPage() {
  const [products, setProducts] = useState(CATALOG_PRODUCTS)
  const [selectedProductId, setSelectedProductId] = useState(1)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [showDrawer, setShowDrawer] = useState(true)
  const [drawerTab, setDrawerTab] = useState('details')
  const [feedback, setFeedback] = useState(null)

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0]

  const toggleProductActive = (id, e) => {
    e.stopPropagation()
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    )
  }

  const handleSaveProduct = () => {
    setFeedback('Product details saved successfully!')
    setTimeout(() => setFeedback(null), 3000)
  }

  const filteredProducts = products.filter((p) => {
    if (categoryFilter !== 'All Categories' && p.category !== categoryFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Catalog
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your product catalog and showcase it on WhatsApp. Organize products, categories and share with customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            Import
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 shadow-2xs">
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Export
          </button>
          <button
            onClick={() => {
              setShowDrawer(true)
              setDrawerTab('details')
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#00A884] hover:bg-[#008f6f] text-white rounded-xl shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Products</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.catalog.totalProducts.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.catalog.totalProducts.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.catalog.totalProducts.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Active Products</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.catalog.activeProducts.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.catalog.activeProducts.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.catalog.activeProducts.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Categories</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-[#00A884]">
              <Folder className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.catalog.categories.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.catalog.categories.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.catalog.categories.period}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Views</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {BLAST_KPIS.catalog.totalViews.value}
            </h3>
            <span className="text-xs font-semibold text-emerald-600">
              {BLAST_KPIS.catalog.totalViews.change}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{BLAST_KPIS.catalog.totalViews.period}</p>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {['All Products', 'Categories', 'Collections', 'Pricing', 'Stock Alerts'].map((tab) => {
          const key = tab.toLowerCase().split(' ')[0]
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                activeTab === key
                  ? 'bg-[#00A884]/10 text-[#00A884]'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* Main Grid & Slide-over Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Product Cards Grid Area */}
        <div className={`${showDrawer ? 'lg:col-span-8' : 'lg:col-span-12'} bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-4`}>
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products by name, SKU or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00A884]"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300"
              >
                <option>All Categories</option>
                <option>Footwear</option>
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Bags</option>
                <option>Accessories</option>
                <option>Beauty</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300"
              >
                <option>All Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
              </select>

              <select className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-600 dark:text-slate-300">
                <option>Sort by: Newest</option>
                <option>Sort by: Price Low to High</option>
                <option>Sort by: Price High to Low</option>
              </select>

              <button className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Filter
              </button>
            </div>
          </div>

          {/* Cards Grid (4 across) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {filteredProducts.map((p) => {
              const isSelected = p.id === selectedProduct.id
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProductId(p.id)
                    setShowDrawer(true)
                  }}
                  className={`group rounded-2xl border transition overflow-hidden bg-white dark:bg-slate-900 cursor-pointer flex flex-col justify-between shadow-2xs hover:shadow-md ${
                    isSelected
                      ? 'border-[#00A884] ring-2 ring-[#00A884]/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Image area */}
                  <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <input
                      type="checkbox"
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-2 left-2 rounded accent-[#00A884]"
                    />
                  </div>

                  {/* Details area */}
                  <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{p.category}</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        {p.price}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>

                      <div className="flex items-center gap-1 text-slate-400">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedProductId(p.id)
                            setShowDrawer(true)
                          }}
                          className="p-1 hover:text-slate-600 rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 hover:text-slate-600 rounded"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
            <span>Show 12 per page ▾</span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-6 h-6 rounded bg-[#00A884] text-white font-bold text-xs flex items-center justify-center">
                1
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                2
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                3
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                4
              </button>
              <button className="w-6 h-6 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs flex items-center justify-center">
                5
              </button>
              <span>...</span>
              <button className="px-1 text-xs">13</button>
              <button className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Drawer: Product Details & WhatsApp Preview */}
        {showDrawer && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-lg space-y-4 animate-fadeIn">
            {/* Drawer Tabs */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex gap-2">
                {['Product Details', 'Categories', 'Share'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setDrawerTab(t.toLowerCase().split(' ')[0])}
                    className={`text-xs font-semibold pb-1 transition ${
                      drawerTab === t.toLowerCase().split(' ')[0]
                        ? 'text-[#00A884] border-b-2 border-[#00A884]'
                        : 'text-slate-400'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {selectedProduct.name}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  defaultValue={selectedProduct.desc}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 leading-relaxed text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedProduct.price}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedProduct.sku}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    defaultValue={120}
                    className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Status
                  </label>
                  <select className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <option>In Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </div>

              {/* Media gallery */}
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Media
                </label>
                <div className="flex gap-2">
                  <img
                    src={selectedProduct.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="w-12 h-12 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span className="text-[8px]">Add</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveProduct}
                className="w-full py-2 bg-[#00A884] hover:bg-[#008f6f] text-white font-semibold rounded-xl text-xs shadow-xs transition"
              >
                Save Product
              </button>
            </div>

            {/* WhatsApp Phone Preview */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">
                WhatsApp Preview
              </span>

              <div className="rounded-2xl border-4 border-slate-800 bg-[#EFEAE2] dark:bg-slate-950 overflow-hidden shadow-inner">
                {/* Header */}
                <div className="bg-[#008069] text-white p-2.5 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    B
                  </div>
                  <div>
                    <h5 className="text-xs font-bold leading-none">Your Business</h5>
                    <span className="text-[9px] text-emerald-200">Business Account</span>
                  </div>
                </div>

                {/* Catalog Card bubble */}
                <div className="p-3">
                  <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-xs border border-slate-200/60 dark:border-slate-800 max-w-[90%] text-xs">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-2.5">
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        {selectedProduct.name}
                      </h4>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                        {selectedProduct.price}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                        {selectedProduct.desc}
                      </p>

                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                        <button className="w-full py-1 text-center font-bold text-[#00A884] text-[11px] flex items-center justify-center gap-1 hover:bg-emerald-50 rounded">
                          <ShoppingBag className="w-3 h-3" /> Buy Now
                        </button>
                        <button className="w-full py-1 text-center font-semibold text-slate-600 dark:text-slate-300 text-[10px] flex items-center justify-center gap-1">
                          <ExternalLink className="w-3 h-3" /> View Details
                        </button>
                        <button className="w-full py-1 text-center font-semibold text-slate-600 dark:text-slate-300 text-[10px] flex items-center justify-center gap-1">
                          <Share2 className="w-3 h-3" /> Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
