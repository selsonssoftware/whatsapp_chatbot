import { useState } from 'react'
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  buildOrderTotals,
  canTransition,
  ORDER_STATUSES,
} from '../../services/commerceService.js'
import { getProducts } from '../../services/catalogService.js'
import { Button, Card, Badge, SearchBar, Icon, Input, Drawer } from '../../components/index.js'

const STATUS_VARIANTS = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'error',
}

const NEXT_STATUS = {
  pending: 'confirmed',
  confirmed: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState(() => getOrders())
  const [products] = useState(() => getProducts())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({ customer: '', customerPhone: '', items: [] })
  const [createError, setCreateError] = useState('')
  const [notice, setNotice] = useState(null)

  const filtered = orders.filter(
    (o) =>
      (o.customer + ' ' + o.customerPhone + ' ' + o.id).toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === 'all' || o.status === statusFilter)
  )

  const refresh = () => setOrders(getOrders())

  const changeStatus = (order, nextStatus) => {
    const result = updateOrderStatus(order.id, nextStatus)
    if (!result.ok) {
      setNotice({ type: 'error', message: result.error })
      return
    }
    setNotice({ type: 'success', message: `Order #${order.id} moved to ${nextStatus}` })
    refresh()
    setSelectedOrder(result.order)
  }

  const cancelOrder = (order) => {
    if (!confirm(`Cancel order #${order.id}? Stock is restored only if it was deducted.`)) return
    changeStatus(order, 'cancelled')
  }

  const viewOrder = (order) => {
    setSelectedOrder(order)
    setShowDrawer(true)
  }

  const setItemQty = (productId, qty) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.some((i) => i.productId === productId)
        ? prev.items.map((i) => (i.productId === productId ? { ...i, qty } : i))
        : [...prev.items, { productId, qty }],
    }))
  }

  const createOrderRecord = () => {
    if (!createForm.customer.trim() || !createForm.customerPhone.trim()) {
      setCreateError('Customer name and phone are required')
      return
    }
    const result = createOrder(createForm)
    if (!result.ok) {
      setCreateError(result.error)
      return
    }
    setCreateError('')
    setCreateForm({ customer: '', customerPhone: '', items: [] })
    setShowCreateForm(false)
    setNotice({ type: 'success', message: `Order #${result.order.id} created` })
    refresh()
  }

  const totals = createForm.items.length ? buildOrderTotals(createForm.items, products) : null

  const totalOrders = orders.length
  const totalRevenue = orders.filter((o) => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer orders and fulfillment</p>
        </div>
        <Button variant="primary" onClick={() => { setCreateForm({ customer: '', customerPhone: '', items: [] }); setCreateError(''); setShowCreateForm(true) }}>
          <Icon name="Plus" size={16} />
          Create Order
        </Button>
      </div>

      {notice && (
        <div
          className={`mb-4 px-4 py-3 rounded-md border text-sm ${
            notice.type === 'error'
              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
          }`}
          role="status"
        >
          {notice.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalOrders}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalRevenue.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingOrders}</p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by order status"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <Card>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="font-medium">#{o.id}</td>
                  <td>
                    <div>
                      <p className="font-medium">{o.customer}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{o.customerPhone}</p>
                    </div>
                  </td>
                  <td>{o.items.length} item(s)</td>
                  <td>${o.total.toFixed(2)}</td>
                  <td>
                    <Badge variant={STATUS_VARIANTS[o.status] || 'info'}>{o.status}</Badge>
                  </td>
                  <td>
                    <Badge variant={o.paymentStatus === 'paid' ? 'success' : o.paymentStatus === 'refunded' ? 'info' : 'warning'}>
                      {o.paymentStatus}
                    </Badge>
                  </td>
                  <td>{o.createdAt}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="icon-btn" onClick={() => viewOrder(o)} aria-label="View">
                        <Icon name="Eye" size={16} />
                      </button>
                      {NEXT_STATUS[o.status] && canTransition(o.status, NEXT_STATUS[o.status]) && (
                        <button
                          className="icon-btn text-green-600"
                          onClick={() => changeStatus(o, NEXT_STATUS[o.status])}
                          aria-label={`Move to ${NEXT_STATUS[o.status]}`}
                        >
                          <Icon name="Play" size={16} />
                        </button>
                      )}
                      {o.status !== 'cancelled' && o.status !== 'delivered' && (
                        <button className="icon-btn text-red-600" onClick={() => cancelOrder(o)} aria-label="Cancel order">
                          <Icon name="XCircle" size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="p-6 text-center text-sm text-gray-500">No orders match the current filters.</p>
          )}
        </div>
      </Card>

      <Drawer
        isOpen={showDrawer}
        onClose={() => { setShowDrawer(false); setSelectedOrder(null) }}
        title={`Order #${selectedOrder?.id}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowDrawer(false); setSelectedOrder(null) }}>
              Close
            </Button>
            {selectedOrder?.status !== 'cancelled' && selectedOrder?.status !== 'delivered' && (
              <Button variant="danger" onClick={() => selectedOrder && cancelOrder(selectedOrder)}>
                Cancel Order
              </Button>
            )}
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                <p className="font-medium">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                <p className="font-medium">{selectedOrder.customerPhone}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Items</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)} x {item.qty}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span>${selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="text-green-600">-${selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span>${selectedOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span>${selectedOrder.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Order Status</p>
                <Badge variant={STATUS_VARIANTS[selectedOrder.status] || 'info'}>{selectedOrder.status}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status</p>
                <Badge variant={selectedOrder.paymentStatus === 'paid' ? 'success' : 'warning'}>{selectedOrder.paymentStatus}</Badge>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Status History</p>
              <div className="space-y-2">
                {selectedOrder.statusHistory.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Icon name="Clock" size={14} className="text-gray-400" />
                    <span className="font-medium capitalize">{entry.status}</span>
                    <span className="text-gray-600 dark:text-gray-400">- {new Date(entry.date).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Stock rule: catalog stock is deducted once when an order reaches "processing" and restored once when an order is
              cancelled before delivery.
            </p>
          </div>
        )}
      </Drawer>

      <Drawer
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        title="Create Order"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={createOrderRecord}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Icon name="Info" size={16} className="inline mr-1" />
            New order - select products from the catalog. Stock is validated against catalog records.
          </p>
          <Input
            label="Customer Name"
            value={createForm.customer}
            onChange={(e) => setCreateForm({ ...createForm, customer: e.target.value })}
          />
          <Input
            label="Customer Phone"
            value={createForm.customerPhone}
            onChange={(e) => setCreateForm({ ...createForm, customerPhone: e.target.value })}
          />
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Products</p>
            <div className="space-y-2">
              {products.map((p) => {
                const line = createForm.items.find((i) => i.productId === p.id)
                return (
                  <div key={p.id} className="flex items-center gap-2 p-2 border border-gray-200 dark:border-gray-700 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">${p.price.toFixed(2)} - {p.stock} in stock</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={p.stock}
                      value={line?.qty ?? 0}
                      onChange={(e) => setItemQty(p.id, Number(e.target.value))}
                      aria-label={`Quantity for ${p.name}`}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                    />
                  </div>
                )
              })}
            </div>
          </div>
          {totals && (
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded text-sm space-y-1">
              <p className="flex justify-between"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Tax (8%)</span><span>${totals.tax.toFixed(2)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>${totals.shipping.toFixed(2)}</span></p>
              <p className="flex justify-between font-semibold"><span>Total</span><span>${totals.total.toFixed(2)}</span></p>
            </div>
          )}
          {createError && <p className="error">{createError}</p>}
        </div>
      </Drawer>
    </div>
  )
}
