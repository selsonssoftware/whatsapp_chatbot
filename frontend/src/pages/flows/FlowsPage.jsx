import { useState } from 'react'
import { Button, Card, Badge, Icon, Input, Drawer, Tabs } from '../../components/index.js'

const DEMO_FLOWS = [
  {
    id: 1,
    name: 'Product Feedback',
    description: 'Collect customer feedback on products',
    status: 'Published',
    screens: [
      { id: 's1', name: 'Welcome', fields: [{ type: 'text', label: 'Your Name', key: 'name' }] },
      { id: 's2', name: 'Rating', fields: [{ type: 'radio', label: 'Rating', key: 'rating', options: ['1', '2', '3', '4', '5'] }] },
    ],
    updatedAt: '2026-01-10',
  },
  {
    id: 2,
    name: 'Order Status',
    description: 'Check order status',
    status: 'Draft',
    screens: [{ id: 's1', name: 'Order ID', fields: [{ type: 'text', label: 'Order ID', key: 'orderId' }] }],
    updatedAt: '2026-01-12',
  },
]

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input' },
  { type: 'textarea', label: 'Text Area' },
  { type: 'radio', label: 'Radio Button' },
  { type: 'checkbox', label: 'Checkbox' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'date', label: 'Date Picker' },
]

export default function FlowsPage() {
  const [flows, setFlows] = useState(DEMO_FLOWS)
  const [selectedFlow, setSelectedFlow] = useState(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedScreen, setSelectedScreen] = useState(null)
  const [previewData, setPreviewData] = useState({})
  const [form, setForm] = useState({ name: '', description: '' })
  const [editingFlow, setEditingFlow] = useState(null)
  const [fieldCounter, setFieldCounter] = useState(0)

  const createFlow = () => {
    if (!form.name.trim()) {
      alert('Flow name is required')
      return
    }
    const newFlow = {
      id: Date.now(),
      name: form.name,
      description: form.description,
      status: 'Draft',
      screens: [{ id: 's1', name: 'Screen 1', fields: [] }],
      updatedAt: new Date().toISOString().slice(0, 10),
    }
    setFlows((prev) => [...prev, newFlow])
    setForm({ name: '', description: '' })
  }

  const editFlow = (flow) => {
    setSelectedFlow(flow)
    setSelectedScreen(flow.screens[0])
    setShowEditor(true)
  }

  const addScreen = () => {
    if (!selectedFlow) return
    const newScreen = { id: 's' + Date.now(), name: `Screen ${selectedFlow.screens.length + 1}`, fields: [] }
    const updatedFlow = { ...selectedFlow, screens: [...selectedFlow.screens, newScreen] }
    setSelectedFlow(updatedFlow)
    setFlows((prev) => prev.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)))
    setSelectedScreen(newScreen)
  }

  const addField = (type) => {
    if (!selectedScreen) return
    const newField = { id: 'f' + (fieldCounter + 1), type, label: 'New Field', key: 'field_' + (fieldCounter + 1), required: false }
    const updatedScreen = { ...selectedScreen, fields: [...selectedScreen.fields, newField] }
    setSelectedScreen(updatedScreen)
    const updatedFlow = { ...selectedFlow, screens: selectedFlow.screens.map((s) => (s.id === selectedScreen.id ? updatedScreen : s)) }
    setSelectedFlow(updatedFlow)
    setFlows((prev) => prev.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)))
    setFieldCounter((prev) => prev + 1)
  }

  const updateField = (fieldId, key, value) => {
    if (!selectedScreen) return
    const updatedFields = selectedScreen.fields.map((f) => (f.id === fieldId ? { ...f, [key]: value } : f))
    const updatedScreen = { ...selectedScreen, fields: updatedFields }
    setSelectedScreen(updatedScreen)
    const updatedFlow = { ...selectedFlow, screens: selectedFlow.screens.map((s) => (s.id === selectedScreen.id ? updatedScreen : s)) }
    setSelectedFlow(updatedFlow)
    setFlows((prev) => prev.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)))
  }

  const removeField = (fieldId) => {
    if (!selectedScreen) return
    const updatedFields = selectedScreen.fields.filter((f) => f.id !== fieldId)
    const updatedScreen = { ...selectedScreen, fields: updatedFields }
    setSelectedScreen(updatedScreen)
    const updatedFlow = { ...selectedFlow, screens: selectedFlow.screens.map((s) => (s.id === selectedScreen.id ? updatedScreen : s)) }
    setSelectedFlow(updatedFlow)
    setFlows((prev) => prev.map((f) => (f.id === selectedFlow.id ? updatedFlow : f)))
  }

  const saveFlow = () => {
    if (!selectedFlow) return
    setFlows((prev) => prev.map((f) => (f.id === selectedFlow.id ? { ...selectedFlow, updatedAt: new Date().toISOString().slice(0, 10) } : f)))
    setShowEditor(false)
    setSelectedFlow(null)
  }

  const publishFlow = (id) => {
    if (!confirm('Publish this flow? Note: This is a demo - no actual publication will occur.')) return
    setFlows((prev) => prev.map((f) => (f.id === id ? { ...f, status: 'Published' } : f)))
  }

  const deleteFlow = (id) => {
    if (!confirm('Delete this flow?')) return
    setFlows((prev) => prev.filter((f) => f.id !== id))
  }

  const handlePreviewSubmit = () => {
    alert('Form submitted (demo)\nData: ' + JSON.stringify(previewData, null, 2))
  }

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">WhatsApp Flows</h1>
          <p className="text-gray-600 dark:text-gray-400">Create interactive flows for WhatsApp messaging</p>
        </div>
        <Button variant="primary" onClick={() => { setForm({ name: '', description: '' }); setEditingFlow(null); setShowEditor(true) }}>
          <Icon name="Plus" size={16} />
          Create Flow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flows.map((flow) => (
          <Card key={flow.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{flow.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{flow.description}</p>
              </div>
              <Badge variant={flow.status === 'Published' ? 'success' : 'info'}>{flow.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <Icon name="Layout" size={14} />
              <span>{flow.screens.length} screens</span>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => editFlow(flow)}>
                <Icon name="Edit" size={14} />
                Edit
              </Button>
              <Button variant="secondary" size="sm" onClick={() => { setSelectedFlow(flow); setShowPreview(true) }}>
                <Icon name="Eye" size={14} />
                Preview
              </Button>
              {flow.status === 'Draft' && (
                <Button variant="secondary" size="sm" onClick={() => publishFlow(flow.id)}>
                  <Icon name="Upload" size={14} />
                </Button>
              )}
              <Button variant="danger" size="sm" onClick={() => deleteFlow(flow.id)}>
                <Icon name="Trash2" size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Drawer
        isOpen={showEditor}
        onClose={() => { setShowEditor(false); setSelectedFlow(null); setSelectedScreen(null) }}
        title={selectedFlow?.name || 'Create Flow'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowEditor(false); setSelectedFlow(null); setSelectedScreen(null) }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={selectedFlow ? saveFlow : createFlow}>
              {selectedFlow ? 'Save' : 'Create'}
            </Button>
          </>
        }
      >
        {selectedFlow ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input label="Flow Name" value={selectedFlow.name} onChange={(e) => setSelectedFlow({ ...selectedFlow, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={selectedFlow.description}
                onChange={(e) => setSelectedFlow({ ...selectedFlow, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Screens</h4>
                <Button variant="secondary" size="sm" onClick={addScreen}>
                  <Icon name="Plus" size={14} />
                  Add Screen
                </Button>
              </div>

              <Tabs
                tabs={selectedFlow.screens.map((s) => ({ id: s.id, label: s.name }))}
                activeTab={selectedScreen?.id}
                onChange={(id) => setSelectedScreen(selectedFlow.screens.find((s) => s.id === id))}
              />

              {selectedScreen && (
                <div className="mt-4 space-y-4">
                  <Input
                    label="Screen Name"
                    value={selectedScreen.name}
                    onChange={(e) => {
                      const updatedScreen = { ...selectedScreen, name: e.target.value }
                      setSelectedScreen(updatedScreen)
                      setSelectedFlow({ ...selectedFlow, screens: selectedFlow.screens.map((s) => (s.id === selectedScreen.id ? updatedScreen : s)) })
                    }}
                  />

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fields</label>
                      <div className="flex gap-1">
                        {FIELD_TYPES.map((ft) => (
                          <button
                            key={ft.type}
                            onClick={() => addField(ft.type)}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            + {ft.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {selectedScreen.fields.map((field) => (
                        <div key={field.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <select
                              value={field.type}
                              onChange={(e) => updateField(field.id, 'type', e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                            >
                              {FIELD_TYPES.map((ft) => (
                                <option key={ft.type} value={ft.type}>
                                  {ft.label}
                                </option>
                              ))}
                            </select>
                            <button className="icon-btn text-red-600" onClick={() => removeField(field.id)}>
                              <Icon name="Trash2" size={14} />
                            </button>
                          </div>
                          <Input
                            label="Label"
                            value={field.label}
                            onChange={(e) => updateField(field.id, 'label', e.target.value)}
                            className="text-sm"
                          />
                          <Input
                            label="Key"
                            value={field.key}
                            onChange={(e) => updateField(field.id, 'key', e.target.value)}
                            className="text-sm"
                          />
                          {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'dropdown') && (
                            <Input
                              label="Options (comma-separated)"
                              value={field.options?.join(', ') || ''}
                              onChange={(e) => updateField(field.id, 'options', e.target.value.split(',').map((o) => o.trim()))}
                              className="text-sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input label="Flow Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        )}
      </Drawer>

      <Drawer
        isOpen={showPreview}
        onClose={() => { setShowPreview(false); setSelectedFlow(null); setPreviewData({}) }}
        title={`Preview: ${selectedFlow?.name}`}
        footer={
          <Button variant="secondary" onClick={() => { setShowPreview(false); setSelectedFlow(null); setPreviewData({}) }}>
            Close
          </Button>
        }
      >
        {selectedFlow && (
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
              <p className="text-sm text-blue-800 dark:text-blue-400">
                <Icon name="Info" size={16} className="inline mr-1" />
                Demo Mode: This is a preview of how the flow will appear on WhatsApp.
              </p>
            </div>

            <div className="max-w-sm mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-4 border-gray-300 dark:border-gray-600">
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedFlow.name}</p>
              </div>

              {selectedFlow.screens.map((screen) => (
                <div key={screen.id} className="space-y-3 mb-4 p-3 bg-white dark:bg-gray-700 rounded">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{screen.name}</p>
                  {screen.fields.map((field) => (
                    <div key={field.id}>
                      <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">{field.label}</label>
                      {field.type === 'text' && (
                        <input
                          type="text"
                          value={previewData[field.key] || ''}
                          onChange={(e) => setPreviewData({ ...previewData, [field.key]: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                        />
                      )}
                      {field.type === 'textarea' && (
                        <textarea
                          value={previewData[field.key] || ''}
                          onChange={(e) => setPreviewData({ ...previewData, [field.key]: e.target.value })}
                          rows={2}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                        />
                      )}
                      {field.type === 'radio' && (
                        <div className="space-y-1">
                          {(field.options || ['Option 1', 'Option 2']).map((opt, i) => (
                            <label key={i} className="flex items-center gap-2 text-sm">
                              <input
                                type="radio"
                                name={field.key}
                                checked={previewData[field.key] === opt}
                                onChange={() => setPreviewData({ ...previewData, [field.key]: opt })}
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                      {field.type === 'dropdown' && (
                        <select
                          value={previewData[field.key] || ''}
                          onChange={(e) => setPreviewData({ ...previewData, [field.key]: e.target.value })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                        >
                          <option value="">Select...</option>
                          {(field.options || ['Option 1', 'Option 2']).map((opt, i) => (
                            <option key={i} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              <Button variant="primary" size="sm" className="w-full" onClick={handlePreviewSubmit}>
                Submit
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
