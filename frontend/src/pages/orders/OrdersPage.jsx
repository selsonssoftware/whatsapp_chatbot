import { useState } from 'react'
import { getOrders, saveOrders } from '../../services/ordersService.js'
import { Button, Card, Badge, SearchBar, Icon, Input, Tabs, Drawer } from '../../components/index.js'

const DEMO_ORDERS = [
  {
    id: 1,
    customer: 'John Doe',
    customerPhone: '+1234567890',
    items: [{ productId: 1, name: 'Premium T-Shirt', sku: 'TS001', qty: 2, price: 29.99 }],
    subtotal: 59.98,
    discount: 0,
    tax: 4.80,
    shipping: 5.00,
    total: 69.78,
    currency: 'USD',
    paymentStatus: 'paid',
    status: 'processing',
    createdAt: '2026-01-10 10:30',
    updatedAt: '2026-01-10 10:30',
    statusHistory: [{ status: 'pending', date: '2026-01-10 10:30' }, { status: 'processing', date: '2026-01-10 10:35' }],
  },
  {
    id: 2,
    customer: 'Jane Smith',
    customerPhone: '+1987654321',
    items: [{ productId: 2, name: 'Wireless Headphones', sku: 'WH001', qty: 1, price: 99.99 }],
    subtotal: 99.99,
    discount: 10,
    tax: 7.20,
    shipping: 0,
    total: 97.19,
    currency: 'USD',
    paymentStatus: 'pending',
    status: 'pending',
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
    tax: 6.40,
    shipping: 5.00,
    total: 91.39,
    currency: 'USD',
    paymentStatus: 'paid',
    status: 'shipped',
    createdAt: '2026-01-12 09:20',
    updatedAt: '2026-01-13 10:00',
    statusHistory: [
      { status: 'pending', date: '2026-01-12 09:20' },
      { status: 'processing', date: '2026-01-12 09:25' },
      { status: 'shipped', date: '2026-01-13 10:00' },
    ],
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(DEMO_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState({ customer: '', customerPhone: '', items: [] })

  const filtered = orders.filter(
    (o) =>
      (o.customer + o.customerPhone).toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === 'all' || o.status === statusFilter)
  )

  const updateOrderStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: newStatus,
              updatedAt: new Date().toISOString().slice(0, 10) + ' ' + new Date().toLocaleTimeString(),
              statusHistory: [...o.statusHistory, { status: newStatus, date: new Date().toISOString() }],
            }
          : o
      )
    )
  }

  const cancelOrder = (id) => {
    if (!confirm('Cancel this order? This action cannot be undone.')) return
    const order = orders.find((o) => o.id === id)
    if (order.status === 'cancelled') {
      alert('Order is already cancelled')
      return
    }
    updateOrderStatus(id, 'cancelled')
  }

  const viewOrder = (order) => {
    setSelectedOrder(order)
    setShowDrawer(true)
  }

  const totalOrders = orders.length
  const totalRevenue = orders.filter((o) => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status === 'pending').length

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage customer orders and fulfillment</p>
        </div>
        <Button variant="primary" onClick={() => setShowCreateForm(true)}>
          <Icon name="Plus" size={16} />
          Create Order
        </Button>
      </div>

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

      <div className="flex items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search orders..." />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
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
                    <Badge
                      variant={
                        o.status === 'delivered'
                          ? 'success'
                          : o.status === 'shipped'
                          ? 'info'
                          : o.status === 'processing'
                          ? 'warning'
                          : o.status === 'cancelled'
                          ? 'error'
                          : 'info'
                      }
                    >
                      {o.status}
                    </Badge>
                  </td>
                  <td>
                    <Badge variant={o.paymentStatus === 'paid' ? 'success' : 'warning'}>{o.paymentStatus}</Badge>
                  </td>
                  <td>{o.createdAt}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="icon-btn" onClick={() => viewOrder(o)} aria-label="View">
                        <Icon name="Eye" size={16} />
                      </button>
                      {o.status === 'pending' && (
                        <button className="icon-btn text-green-600" onClick={() => updateOrderStatus(o.id, 'processing')} aria-label="Process">
                          <Icon name="Play" size={16} />
                        </button>
                      )}
                      {o.status === 'processing' && (
                        <button className="icon-btn text-blue-600" onClick={() => updateOrderStatus(o.id, 'shipped')} aria-label="Ship">
                          <Icon name="Send" size={16} />
                        </button>
                      )}
                      {o.status === 'shipped' && (
                        <button className="icon-btn text-green-600" onClick={() => updateOrderStatus(o.id, 'delivered')} aria-label="Deliver">
                          <Icon name="Check" size={16} />
                        </button>
                      )}
                      {o.status !== 'cancelled' && (
                        <button className="icon-btn text-red-600" onClick={() => cancelOrder(o.id)} aria-label="Cancel">
                          <Icon name="XCircle" size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            {selectedOrder?.status !== 'cancelled' && (
              <Button variant="danger" onClick={() => { selectedOrder && cancelOrder(selectedOrder.id); setShowDrawer(false) }}>
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
                <Badge
                  variant={
                    selectedOrder.status === 'delivered'
                      ? 'success'
                      : selectedOrder.status === 'shipped'
                      ? 'info'
                      : selectedOrder.status === 'processing'
                      ? 'warning'
                      : 'error'
                  }
                >
                  {selectedOrder.status}
                </Badge>
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
            <Button variant="primary" onClick={() => { alert('Demo: Order created'); setShowCreateForm(false) }}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Icon name="Info" size={16} className="inline mr-1" />
            Demo mode - select customer and add items from catalog
          </p>
          <Input label="Customer Name" value={createForm.customer} onChange={(e) => setCreateForm({ ...createForm, customer: e.target.value })} />
          <Input label="Customer Phone" value={createForm.customerPhone} onChange={(e) => setCreateForm({ ...createForm, customerPhone: e.target.value })} />
        </div>
      </Drawer>
    </div>
  )
}
