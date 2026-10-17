import { useState } from 'react'
import { getTemplates, saveTemplates } from '../../services/templateService.js'
import { Button, Card, Badge, SearchBar, Modal, Icon, Input, Tabs } from '../../components/index.js'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState(() => getTemplates())
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')
  const [form, setForm] = useState({ name: '', category: 'Marketing', language: 'en', header: '', body: '', footer: '', buttons: '' })

  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === 'all' || t.status.toLowerCase() === statusFilter)
  )

  const remove = (id) => {
    if (!confirm('Delete this template?')) return
    const next = templates.filter((t) => t.id !== id)
    setTemplates(next)
    saveTemplates(next)
  }

  const duplicate = (t) => {
    const copy = { ...t, id: Date.now(), name: t.name + ' (Copy)', status: 'Draft', updatedAt: new Date().toISOString().slice(0, 10) }
    const next = [...templates, copy]
    setTemplates(next)
    saveTemplates(next)
  }

  const edit = (template) => {
    setEditingTemplate(template)
    setForm({
      name: template.name,
      category: template.category,
      language: template.language,
      header: template.header || '',
      body: template.body,
      footer: template.footer || '',
      buttons: (template.buttons || []).join(', '),
    })
    setShowForm(true)
  }

  const preview = (template) => {
    setPreviewTemplate(template)
    setShowPreview(true)
  }

  const save = () => {
    if (!form.name || !form.body) {
      alert('Name and body are required')
      return
    }

    const templateData = {
      ...form,
      buttons: form.buttons.split(',').map((b) => b.trim()).filter(Boolean),
      status: 'Draft',
      updatedAt: new Date().toISOString().slice(0, 10),
    }

    if (editingTemplate) {
      setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? { ...t, ...templateData } : t)))
    } else {
      setTemplates((prev) => [...prev, { ...templateData, id: Date.now() }])
    }

    saveTemplates(templates)
    setShowForm(false)
    setEditingTemplate(null)
    setForm({ name: '', category: 'Marketing', language: 'en', header: '', body: '', footer: '', buttons: '' })
  }

  const submitForApproval = (id) => {
    if (!confirm('Submit this template for Meta approval? Note: This is a demo - no actual submission will occur.')) return
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'Pending' } : t)))
    saveTemplates(templates)
    alert('Template submitted for approval (demo)')
  }

  const categories = ['Marketing', 'Utility', 'Authentication']
  const languages = ['en', 'es', 'fr', 'de', 'pt', 'ar', 'hi', 'zh']

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Templates</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage WhatsApp message templates for Meta approval</p>
        </div>
        <Button variant="primary" onClick={() => { setEditingTemplate(null); setForm({ name: '', category: 'Marketing', language: 'en', header: '', body: '', footer: '', buttons: '' }); setShowForm(true) }}>
          <Icon name="Plus" size={16} />
          Create Template
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search templates..." />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <Card>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Language</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td className="font-medium">{t.name}</td>
                  <td>{t.category}</td>
                  <td>{t.language.toUpperCase()}</td>
                  <td>
                    <Badge
                      variant={
                        t.status === 'Approved'
                          ? 'success'
                          : t.status === 'Pending'
                          ? 'warning'
                          : t.status === 'Rejected'
                          ? 'error'
                          : 'info'
                      }
                    >
                      {t.status}
                    </Badge>
                  </td>
                  <td>{t.updatedAt}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="icon-btn" onClick={() => preview(t)} aria-label="Preview">
                        <Icon name="Eye" size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => edit(t)} aria-label="Edit">
                        <Icon name="Edit" size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => duplicate(t)} aria-label="Duplicate">
                        <Icon name="Copy" size={16} />
                      </button>
                      {t.status === 'Draft' && (
                        <button className="icon-btn text-green-600" onClick={() => submitForApproval(t.id)} aria-label="Submit">
                          <Icon name="Send" size={16} />
                        </button>
                      )}
                      <button className="icon-btn text-red-600" onClick={() => remove(t.id)} aria-label="Delete">
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

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingTemplate(null) }}
        title={editingTemplate ? 'Edit Template' : 'Create Template'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingTemplate(null) }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={save}>
              {editingTemplate ? 'Update' : 'Save Draft'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Template Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Input label="Header (Optional)" value={form.header} onChange={(e) => setForm({ ...form, header: e.target.value })} placeholder="Optional header text" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body</label>
            <textarea
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Message body with variables like {{first_name}}"
            />
            <p className="text-xs text-gray-500 mt-1">Variables: name, first_name, etc.</p>
          </div>
          <Input label="Footer (Optional)" value={form.footer} onChange={(e) => setForm({ ...form, footer: e.target.value })} placeholder="Optional footer text" />
          <Input label="Buttons (comma-separated)" value={form.buttons} onChange={(e) => setForm({ ...form, buttons: e.target.value })} placeholder="Learn More, Visit Website" />
        </div>
      </Modal>

      <Modal
        isOpen={showPreview}
        onClose={() => { setShowPreview(false); setPreviewTemplate(null) }}
        title="Template Preview"
        footer={
          <Button variant="secondary" onClick={() => { setShowPreview(false); setPreviewTemplate(null) }}>
            Close
          </Button>
        }
      >
        {previewTemplate && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              {previewTemplate.header && <p className="font-semibold mb-2">{previewTemplate.header}</p>}
              <p className="whitespace-pre-wrap">{previewTemplate.body}</p>
              {previewTemplate.footer && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{previewTemplate.footer}</p>}
              {previewTemplate.buttons && previewTemplate.buttons.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {previewTemplate.buttons.map((btn, index) => (
                    <button key={index} className="px-3 py-1 bg-brand-500 text-white rounded text-sm">
                      {btn}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Category:</strong> {previewTemplate.category}</p>
              <p><strong>Language:</strong> {previewTemplate.language.toUpperCase()}</p>
              <p><strong>Status:</strong> {previewTemplate.status}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
