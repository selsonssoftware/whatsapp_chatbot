import { useState } from 'react'
import { getTransactions, saveTransactions } from '../../services/ordersService.js'
import { Button, Card, Badge, SearchBar, Icon, Input, Tabs, Modal } from '../../components/index.js'

const DEMO_TRANSACTIONS = [
  { id: 1, orderId: 1, customer: 'John Doe', amount: 19.99, currency: 'USD', method: 'Card', status: 'success', createdAt: '2026-01-10 10:30', updatedAt: '2026-01-10 10:30' },
  { id: 2, orderId: 2, customer: 'Jane Smith', amount: 49.99, currency: 'USD', method: 'PayPal', status: 'success', createdAt: '2026-01-11 14:15', updatedAt: '2026-01-11 14:15' },
  { id: 3, orderId: 3, customer: 'Mike Brown', amount: 79.99, currency: 'USD', method: 'Card', status: 'pending', createdAt: '2026-01-12 09:20', updatedAt: '2026-01-12 09:20' },
  { id: 4, orderId: 4, customer: 'Emily Davis', amount: 29.99, currency: 'USD', method: 'Card', status: 'failed', createdAt: '2026-01-13 16:45', updatedAt: '2026-01-13 16:45' },
]

const DEMO_PAYMENT_LINKS = [
  { id: 1, title: 'Product Payment', amount: 29.99, currency: 'USD', status: 'active', createdAt: '2026-01-10', expiresAt: '2026-02-10' },
  { id: 2, title: 'Service Fee', amount: 99.99, currency: 'USD', status: 'expired', createdAt: '2026-01-05', expiresAt: '2026-01-12' },
]

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState(DEMO_TRANSACTIONS)
  const [paymentLinks, setPaymentLinks] = useState(DEMO_PAYMENT_LINKS)
  const [activeTab, setActiveTab] = useState('transactions')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [linkForm, setLinkForm] = useState({ title: '', amount: '', expiresAt: '' })
  const [selectedTx, setSelectedTx] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const filteredTx = transactions.filter(
    (t) =>
      (t.customer + t.orderId).toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === 'all' || t.status === statusFilter)
  )

  const retryPayment = (id) => {
    if (!confirm('Retry this payment? Demo mode - no actual retry will occur.')) return
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'pending' } : t)))
  }

  const refundPayment = (id) => {
    if (!confirm('Refund this payment? Demo mode - no actual refund will occur.')) return
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'refunded' } : t)))
  }

  const createPaymentLink = () => {
    if (!linkForm.title || !linkForm.amount) {
      alert('Title and amount are required')
      return
    }
    const newLink = {
      id: Date.now(),
      title: linkForm.title,
      amount: Number(linkForm.amount),
      currency: 'USD',
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
      expiresAt: linkForm.expiresAt,
    }
    setPaymentLinks((prev) => [...prev, newLink])
    setShowLinkForm(false)
    setLinkForm({ title: '', amount: '', expiresAt: '' })
  }

  const deleteLink = (id) => {
    if (!confirm('Delete this payment link?')) return
    setPaymentLinks((prev) => prev.filter((l) => l.id !== id))
  }

  const totalAmount = transactions.filter((t) => t.status === 'success').reduce((sum, t) => sum + t.amount, 0)
  const pendingAmount = transactions.filter((t) => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage transactions and payment links</p>
        </div>
        <Button variant="primary" onClick={() => setShowLinkForm(true)}>
          <Icon name="Plus" size={16} />
          Create Payment Link
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">${totalAmount.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">${pendingAmount.toFixed(2)}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Links</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{paymentLinks.filter((l) => l.status === 'active').length}</p>
        </Card>
      </div>

      <Tabs
        tabs={[
          { id: 'transactions', label: 'Transactions' },
          { id: 'links', label: 'Payment Links' },
          { id: 'settings', label: 'Settings' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'transactions' && (
        <Card className="mt-6">
          <div className="flex items-center gap-4 mb-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search transactions..." />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTx.map((t) => (
                  <tr key={t.id}>
                    <td>#{t.id}</td>
                    <td>#{t.orderId}</td>
                    <td>{t.customer}</td>
                    <td>${t.amount.toFixed(2)}</td>
                    <td>{t.method}</td>
                    <td>
                      <Badge
                        variant={
                          t.status === 'success'
                            ? 'success'
                            : t.status === 'pending'
                            ? 'warning'
                            : t.status === 'failed'
                            ? 'error'
                            : 'info'
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td>{t.createdAt}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="icon-btn" onClick={() => { setSelectedTx(t); setShowDetails(true) }} aria-label="View">
                          <Icon name="Eye" size={16} />
                        </button>
                        {t.status === 'failed' && (
                          <button className="icon-btn text-yellow-600" onClick={() => retryPayment(t.id)} aria-label="Retry">
                            <Icon name="RefreshCw" size={16} />
                          </button>
                        )}
                        {t.status === 'success' && (
                          <button className="icon-btn text-orange-600" onClick={() => refundPayment(t.id)} aria-label="Refund">
                            <Icon name="RefreshCw" size={16} />
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
      )}

      {activeTab === 'links' && (
        <Card className="mt-6">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Expires</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentLinks.map((link) => (
                  <tr key={link.id}>
                    <td className="font-medium">{link.title}</td>
                    <td>${link.amount.toFixed(2)}</td>
                    <td>
                      <Badge variant={link.status === 'active' ? 'success' : 'warning'}>{link.status}</Badge>
                    </td>
                    <td>{link.createdAt}</td>
                    <td>{link.expiresAt}</td>
                    <td>
                      <div className="flex gap-2">
                        <button className="icon-btn" aria-label="Copy Link">
                          <Icon name="Copy" size={16} />
                        </button>
                        <button className="icon-btn text-red-600" onClick={() => deleteLink(link.id)} aria-label="Delete">
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

      {activeTab === 'settings' && (
        <Card className="mt-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Default Currency</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Provider</label>
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <option>Stripe</option>
                <option>PayPal</option>
                <option>Razorpay</option>
              </select>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
              <p className="text-sm text-amber-800 dark:text-amber-400">
                <Icon name="Info" size={16} className="inline mr-1" />
                Configure payment provider in Integrations section.
              </p>
            </div>
          </div>
        </Card>
      )}

      <Modal
        isOpen={showLinkForm}
        onClose={() => setShowLinkForm(false)}
        title="Create Payment Link"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowLinkForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={createPaymentLink}>
              Create
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" value={linkForm.title} onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })} />
          <Input label="Amount" type="number" step="0.01" value={linkForm.amount} onChange={(e) => setLinkForm({ ...linkForm, amount: e.target.value })} />
          <Input label="Expiration Date" type="date" value={linkForm.expiresAt} onChange={(e) => setLinkForm({ ...linkForm, expiresAt: e.target.value })} />
        </div>
      </Modal>

      <Modal
        isOpen={showDetails}
        onClose={() => { setShowDetails(false); setSelectedTx(null) }}
        title="Transaction Details"
        footer={
          <Button variant="secondary" onClick={() => { setShowDetails(false); setSelectedTx(null) }}>
            Close
          </Button>
        }
      >
        {selectedTx && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Transaction ID</p>
                <p className="font-medium">#{selectedTx.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Order ID</p>
                <p className="font-medium">#{selectedTx.orderId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                <p className="font-medium">{selectedTx.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                <p className="font-medium">${selectedTx.amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Method</p>
                <p className="font-medium">{selectedTx.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                <Badge
                  variant={
                    selectedTx.status === 'success'
                      ? 'success'
                      : selectedTx.status === 'pending'
                      ? 'warning'
                      : 'error'
                  }
                >
                  {selectedTx.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Created At</p>
              <p className="font-medium">{selectedTx.createdAt}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
