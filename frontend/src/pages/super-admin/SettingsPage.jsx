import { useState } from 'react'
import { Button, Input } from '../../components/index.js'

export default function SettingsPage() {
  const [form, setForm] = useState({ crmName: 'WhatsApp CRM', theme: 'light', notifications: true })
  const [saved, setSaved] = useState(false)
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Settings</h2>
      <div className="bg-white rounded-xl border p-5 space-y-3 max-w-xl">
        <Input label="CRM Name" value={form.crmName} onChange={(e) => setForm({ ...form, crmName: e.target.value })} />
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Theme</label>
          <select className="w-full border rounded-xl p-2" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value })}>
            <option value="light">Light</option><option value="dark">Dark</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.notifications} onChange={(e) => setForm({ ...form, notifications: e.target.checked })} />
          Enable notifications
        </label>
        <div className="flex gap-2">
          <Button onClick={() => setSaved(true)}>Save</Button>
          <Button variant="secondary" onClick={() => setSaved(false)}>Cancel</Button>
        </div>
        {saved && <p className="text-sm text-green-600">Saved (demo state only)</p>}
      </div>
    </div>
  )
}