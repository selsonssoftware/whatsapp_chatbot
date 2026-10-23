import { useState } from 'react'
import { Button } from '../../components/index.js'
import { paymentsMock, companiesMock } from '../../data/mockData.js'

export default function ReportsPage() {
  const [range, setRange] = useState('monthly')

  const exportCSV = () => {
    const rows = [['Company', 'Plan', 'Amount', 'Status', 'Date'], ...paymentsMock.map((p) => [p.company, p.plan, p.amount, p.status, p.date])]
    const csv = rows.map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'report.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Reports</h2>
        <Button onClick={exportCSV}>Download CSV</Button>
      </div>
      <div className="flex gap-2">
        <select className="border rounded-xl p-2" value={range} onChange={(e) => setRange(e.target.value)}><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-xl border">Companies: {companiesMock.length}</div>
        <div className="bg-white p-4 rounded-xl border">Revenue: ${paymentsMock.reduce((a, p) => a + p.amount, 0)}</div>
        <div className="bg-white p-4 rounded-xl border">Payments: {paymentsMock.length}</div>
      </div>
    </div>
  )
}