import { useState } from 'react'
import { Input } from '../../components/index.js'
import { paymentsMock } from '../../data/mockData.js'

export default function PaymentsPage() {
  const [payments] = useState(paymentsMock)
  const [search, setSearch] = useState('')
  const filtered = payments.filter((p) => p.company.toLowerCase().includes(search.toLowerCase()))
  const total = payments.reduce((a, p) => a + p.amount, 0)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Payments</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border">Total Collected: ${total}</div>
        <div className="bg-white p-4 rounded-xl border">Pending: {payments.filter((p) => p.status === 'Pending').length}</div>
        <div className="bg-white p-4 rounded-xl border">Failed: {payments.filter((p) => p.status === 'Failed').length}</div>
      </div>
      <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-xs"><tr><th className="p-3 text-left">ID</th><th className="p-3 text-left">Company</th><th className="p-3 text-left">Plan</th><th className="p-3 text-left">Amount</th><th className="p-3 text-left">Method</th><th className="p-3 text-left">Date</th><th className="p-3 text-left">Status</th></tr></thead>
          <tbody>{filtered.map((p) => (<tr key={p.id} className="border-t"><td className="p-3">{p.id}</td><td className="p-3">{p.company}</td><td className="p-3">{p.plan}</td><td className="p-3">${p.amount}</td><td className="p-3">{p.method}</td><td className="p-3">{p.date}</td><td className="p-3">{p.status}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  )
}