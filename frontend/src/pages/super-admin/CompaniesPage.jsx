import { useState } from 'react'
import { Modal, Button, Input, Notice } from '../../components/index.js'
import { companiesMock } from '../../data/mockData.js'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(companiesMock)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', plan: 'Basic', status: 'Active' })

  const filtered = companies.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  const addCompany = () => {
    if (!form.name || !form.email) return
    setCompanies([...companies, { ...form, id: Date.now(), created: new Date().toISOString().slice(0, 10) }])
    setModalOpen(false)
    setForm({ name: '', email: '', phone: '', plan: 'Basic', status: 'Active' })
  }

  const toggleStatus = (id) => {
    setCompanies(companies.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Inactive' : 'Active' } : c)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Companies</h2>
        <Button onClick={() => setModalOpen(true)}>Add Company</Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border">Total: {companies.length}</div>
        <div className="bg-white p-4 rounded-xl border">Active: {companies.filter((c) => c.status === 'Active').length}</div>
        <div className="bg-white p-4 rounded-xl border">Expired: {companies.filter((c) => c.status !== 'Active').length}</div>
      </div>
      <Input placeholder="Search companies" value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-xs"><tr><th className="p-3 text-left">Company</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Phone</th><th className="p-3 text-left">Plan</th><th className="p-3 text-left">Status</th><th className="p-3 text-left">Created</th><th className="p-3 text-left">Action</th></tr></thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3">{c.phone}</td>
                <td className="p-3">{c.plan}</td>
                <td className="p-3">{c.status}</td>
                <td className="p-3">{c.created}</td>
                <td className="p-3"><Button size="sm" onClick={() => toggleStatus(c.id)}>Toggle</Button></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-4 text-center text-slate-500">No results</td></tr>}
          </tbody>
        </table>
      </div>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Company">
        <div className="space-y-3">
          <Input placeholder="Company name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <select className="w-full border rounded-xl p-2" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
            <option>Basic</option><option>Advance</option><option>Prime</option>
          </select>
          <Button onClick={addCompany}>Save</Button>
        </div>
      </Modal>
    </div>
  )
}