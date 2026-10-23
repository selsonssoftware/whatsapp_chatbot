import { useState } from 'react'
import { Button, Input } from '../../components/index.js'
import { plansMock } from '../../data/mockData.js'

export default function PlansPage() {
  const [plans, setPlans] = useState(plansMock)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ name: 'Basic', monthly: '', yearly: '', staff: '', messages: '', status: 'Active' })

  const toggle = (id) => setPlans(plans.map((p) => (p.id === id ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p)))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Plans</h2>
        <Button onClick={() => setModalOpen(true)}>Create Plan</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-2xl font-bold text-[#128C7E]">${p.monthly}/mo</p>
            <p className="text-xs text-slate-500">${p.yearly}/yr</p>
            <p className="text-sm mt-2">Staff: {p.staff} · Messages: {p.messages}</p>
            <p className="text-sm">Status: {p.status}</p>
            <Button className="mt-3" onClick={() => toggle(p.id)}>Toggle Status</Button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-xs"><tr><th className="p-3 text-left">Plan</th><th className="p-3 text-left">Monthly</th><th className="p-3 text-left">Yearly</th><th className="p-3 text-left">Staff</th><th className="p-3 text-left">Messages</th><th className="p-3 text-left">Status</th></tr></thead>
          <tbody>{plans.map((p) => (<tr key={p.id} className="border-t"><td className="p-3">{p.name}</td><td className="p-3">${p.monthly}</td><td className="p-3">${p.yearly}</td><td className="p-3">{p.staff}</td><td className="p-3">{p.messages}</td><td className="p-3">{p.status}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  )
}