import { useState } from 'react'
import { Button } from '../../components/index.js'

const features = [
  { id: 1, name: 'WhatsApp Inbox', desc: 'Centralized inbox', category: 'Messaging' },
  { id: 2, name: 'Bulk Messaging', desc: 'Bulk campaigns', category: 'Messaging' },
  { id: 3, name: 'Scheduled Messages', desc: 'Schedule sends', category: 'Automation' },
  { id: 4, name: 'Chatbot', desc: 'Automated bot', category: 'Automation' },
  { id: 5, name: 'Chat Flows', desc: 'Flow builder', category: 'Automation' },
  { id: 6, name: 'Reports', desc: 'Analytics', category: 'Analytics' },
  { id: 7, name: 'Company Settings', desc: 'Settings', category: 'Platform' },
]

export default function FeatureControlPage() {
  const [state, setState] = useState(() =>
    features.reduce((acc, f) => ({ ...acc, [f.id]: { global: true, basic: true, advance: true, prime: true } }), {})
  )
  const toggle = (id, key) => setState((s) => ({ ...s, [id]: { ...s[id], [key]: !s[id][key] } }))

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Feature Control</h2>
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-slate-500 text-xs"><tr><th className="p-3 text-left">Feature</th><th className="p-3 text-left">Category</th><th className="p-3 text-left">Global</th><th className="p-3 text-left">Basic</th><th className="p-3 text-left">Advance</th><th className="p-3 text-left">Prime</th></tr></thead>
          <tbody>
            {features.map((f) => (
              <tr key={f.id} className="border-t">
                <td className="p-3"><div className="font-semibold">{f.name}</div><div className="text-xs text-slate-500">{f.desc}</div></td>
                <td className="p-3">{f.category}</td>
                {['global', 'basic', 'advance', 'prime'].map((k) => (
                  <td key={k} className="p-3">
                    <button onClick={() => toggle(f.id, k)} className={`w-10 h-5 rounded-full transition ${state[f.id][k] ? 'bg-[#128C7E]' : 'bg-slate-300'}`}>
                      <span className={`block w-4 h-4 bg-white rounded-full transition ${state[f.id][k] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500">Demo-only configuration.</p>
    </div>
  )
}