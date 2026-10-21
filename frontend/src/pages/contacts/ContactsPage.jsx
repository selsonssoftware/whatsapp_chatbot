import { useState, useMemo, useCallback } from 'react'
import { CONTACTS } from '../../data/seedData.js'
import { Button, Card, Input, Badge, Tabs, SearchBar, Modal, Icon } from '../../components/index.js'

export default function ContactsPage() {
  const [contacts, setContacts] = useState(CONTACTS)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', company: '', tags: '', groups: '', notes: '' })
  const [errors, setErrors] = useState({})
  const [activeTab, setActiveTab] = useState('contacts')
  const [selectedContacts, setSelectedContacts] = useState([])
  const [tagFilter, setTagFilter] = useState('all')
  const [groupFilter, setGroupFilter] = useState('all')

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const matchesSearch = (c.firstName + ' ' + c.lastName + ' ' + c.phone + ' ' + c.email).toLowerCase().includes(search.toLowerCase())
      const matchesTag = tagFilter === 'all' || (c.tags || []).includes(tagFilter)
      const matchesGroup = groupFilter === 'all' || (c.groups || []).includes(groupFilter)
      return matchesSearch && matchesTag && matchesGroup
    })
  }, [contacts, search, tagFilter, groupFilter])

  const allTags = useMemo(() => [...new Set(contacts.flatMap((c) => c.tags || []))], [contacts])
  const allGroups = useMemo(() => [...new Set(contacts.flatMap((c) => c.groups || []))], [contacts])

  const validate = useCallback(() => {
    const e = {}
    if (!form.firstName) e.firstName = 'Required'
    if (!form.phone) e.phone = 'Required'
    else if (!/^\+?\d{7,15}$/.test(form.phone)) e.phone = 'Invalid phone format'
    setErrors(e)
    return Object.keys(e).length === 0
  }, [form])

  const save = useCallback(() => {
    if (!validate()) return
    const contactData = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      groups: form.groups.split(',').map((g) => g.trim()).filter(Boolean),
      status: 'active',
      createdAt: new Date().toISOString().slice(0, 10),
    }

    if (editingContact) {
      setContacts((prev) => prev.map((c) => (c.id === editingContact.id ? { ...c, ...contactData } : c)))
    } else {
      setContacts((prev) => [...prev, { ...contactData, id: Date.now() }])
    }

    setShowForm(false)
    setEditingContact(null)
    setForm({ firstName: '', lastName: '', phone: '', email: '', company: '', tags: '', groups: '', notes: '' })
    setErrors({})
  }, [form, editingContact, validate])

  const edit = useCallback((contact) => {
    setEditingContact(contact)
    setForm({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
      email: contact.email,
      company: contact.company || '',
      tags: (contact.tags || []).join(', '),
      groups: (contact.groups || []).join(', '),
      notes: contact.notes || '',
    })
    setShowForm(true)
  }, [])

  const remove = useCallback((id) => {
    if (!confirm('Delete this contact?')) return
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const bulkDelete = useCallback(() => {
    if (!confirm(`Delete ${selectedContacts.length} selected contacts?`)) return
    setContacts((prev) => prev.filter((c) => !selectedContacts.includes(c.id)))
    setSelectedContacts([])
  }, [selectedContacts])

  const exportCSV = useCallback(() => {
    const headers = ['First Name', 'Last Name', 'Phone', 'Email', 'Company', 'Tags', 'Groups', 'Status']
    const rows = contacts.map((c) => [
      c.firstName,
      c.lastName,
      c.phone,
      c.email,
      c.company || '',
      (c.tags || []).join(';'),
      (c.groups || []).join(';'),
      c.status,
    ])
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contacts.csv'
    a.click()
  }, [contacts])

  const importCSV = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const lines = text.split('\n')
      const imported = lines.slice(1).map((line, index) => {
        const [firstName, lastName, phone, email, company, tags, groups] = line.split(',')
        return {
          id: Date.now() + index,
          firstName: firstName?.trim() || '',
          lastName: lastName?.trim() || '',
          phone: phone?.trim() || '',
          email: email?.trim() || '',
          company: company?.trim() || '',
          tags: tags?.split(';').map((t) => t.trim()).filter(Boolean) || [],
          groups: groups?.split(';').map((g) => g.trim()).filter(Boolean) || [],
          status: 'active',
          createdAt: new Date().toISOString().slice(0, 10),
          notes: '',
        }
      })
      setContacts((prev) => [...prev, ...imported.filter((c) => c.firstName && c.phone)])
    }
    reader.readAsText(file)
  }, [])

  const toggleSelect = useCallback((id) => {
    setSelectedContacts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selectedContacts.length === filtered.length) {
      setSelectedContacts([])
    } else {
      setSelectedContacts(filtered.map((c) => c.id))
    }
  }, [selectedContacts.length, filtered])

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Contacts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your contacts and organize them into groups</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportCSV}>
            <Icon name="Download" size={16} />
            Export CSV
          </Button>
          <Button variant="secondary" onClick={() => document.getElementById('csv-input').click()}>
            <Icon name="Upload" size={16} />
            Import CSV
          </Button>
          <input type="file" id="csv-input" accept=".csv" className="hidden" onChange={importCSV} />
          <Button variant="primary" onClick={() => { setEditingContact(null); setForm({ firstName: '', lastName: '', phone: '', email: '', company: '', tags: '', groups: '', notes: '' }); setShowForm(true) }}>
            <Icon name="Plus" size={16} />
            Add Contact
          </Button>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: 'contacts', label: `Contacts (${contacts.length})` },
          { id: 'groups', label: `Groups (${allGroups.length})` },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <Card className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search contacts..." />
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              aria-label="Filter by tag"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              aria-label="Filter by group"
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
            >
              <option value="all">All Groups</option>
              {allGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            {selectedContacts.length > 0 && (
              <Button variant="danger" size="sm" onClick={bulkDelete}>
                <Icon name="Trash2" size={16} />
                Delete ({selectedContacts.length})
              </Button>
            )}
          </div>
        </div>

        {activeTab === 'contacts' && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="w-10">
                    <input type="checkbox" checked={selectedContacts.length === filtered.length && filtered.length > 0} onChange={toggleSelectAll} className="rounded" />
                  </th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Tags</th>
                  <th>Groups</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <input type="checkbox" checked={selectedContacts.includes(c.id)} onChange={() => toggleSelect(c.id)} className="rounded" />
                    </td>
                    <td className="font-medium">
                      {c.firstName} {c.lastName}
                    </td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td>{c.company || '-'}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(c.tags || []).map((tag) => (
                          <Badge key={tag} variant="info" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {(c.groups || []).map((group) => (
                          <Badge key={group} variant="success" className="text-xs">
                            {group}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td>
                      <Badge variant={c.status === 'active' ? 'success' : 'warning'}>{c.status}</Badge>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="icon-btn" onClick={() => edit(c)} aria-label="Edit">
                          <Icon name="Edit" size={16} />
                        </button>
                        <button className="icon-btn text-red-600" onClick={() => remove(c.id)} aria-label="Delete">
                          <Icon name="Trash2" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allGroups.map((group) => (
              <Card key={group} className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{group}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contacts.filter((c) => c.groups?.includes(group)).length} contacts
                    </p>
                  </div>
                  <Badge variant="success">{contacts.filter((c) => c.groups?.includes(group)).length}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingContact(null); setErrors({}) }}
        title={editingContact ? 'Edit Contact' : 'Add Contact'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowForm(false); setEditingContact(null); setErrors({}) }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={save}>
              {editingContact ? 'Update' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} error={errors.firstName} />
            <Input label="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input label="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="vip, lead, customer" />
          <Input label="Groups (comma-separated)" value={form.groups} onChange={(e) => setForm({ ...form, groups: e.target.value })} placeholder="Customers, Leads" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
