import { useState } from 'react'
import { Button, Input } from '../../components/index.js'
import { subscriptionsMock } from '../../data/mockData.js'

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState(subscriptionsMock)
  const [search, setSearch] = useState('')

  const filtered = subs.filter((s) => s.company.toLowerCase().includes(search.toLowerCase()))
  const renew = (id) => setSubs(subs.map((s) => (s.id === id ? { ...s, status: 'Active' } : s)))
  const cancel = (id) => setSubs(subs.map((s) => (s.id === id ? { ...s, status: 'Cancelled' } : s)))

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Subscriptions</h2>
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border">Total: {subs.length}</div>
        <div className="bg-white p-4 rounded-xl border">Active: {subs.filter((s) => s.status === 'Active').length}</div>
        <div className="bg-white p-4 rounded-xl border">Expired: {subs.filter((s) => s.status === 'Expired').length}</div>
        <div className="bg-white p-4 rounded-xl border">Pending: {subs.filter((s) => s.status === 'Trial').length}</div>
      </div>
      <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-xs"><tr><th className="p-3 text-left">Company</th><th className="p-3 text-left">Plan</th><th className="p-3 text-left">Start</th><th className="p-3 text-left">Expiry</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Action</th></tr></thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.company}</td>
                <td className="p-3">{s.plan}</td>
                <td className="p-3">{s.start}</td>
                <td className="p-3">{s.expiry}</td>
                <td className="p-3">{s.status}</td>
                <td className="p-3 flex gap-2">
                  <Button size="sm" onClick={() => renew(s.id)}>Renew</Button>
                  <Button size="sm" onClick={() => cancel(s.id)}>Cancel</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}