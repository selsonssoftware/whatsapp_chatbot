import { useState } from 'react'
import { getTemplates } from '../../services/templateService.js'
import { DEMO_CONTACTS } from '../../data/demoData.js'
import { Button, Card, Input, Badge, Tabs, Icon, SearchBar } from '../../components/index.js'

export default function ComposePage() {
  const [templates] = useState(() => getTemplates())
  const [step, setStep] = useState(1)
  const [messageType, setMessageType] = useState('custom')
  const [templateId, setTemplateId] = useState('')
  const [body, setBody] = useState('')
  const [subject, setSubject] = useState('')
  const [selectedContacts, setSelectedContacts] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [isScheduled, setIsScheduled] = useState(false)
  const [search, setSearch] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const onTemplateChange = (e) => {
    setTemplateId(e.target.value)
    const t = templates.find((x) => x.id === Number(e.target.value))
    if (t) {
      setBody(t.body)
      setSubject(t.header || '')
    }
  }

  const toggleContact = (id) => {
    setSelectedContacts((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const toggleGroup = (group) => {
    setSelectedGroups((prev) => (prev.includes(group) ? prev.filter((x) => x !== group) : [...prev, group]))
  }

  const selectAllContacts = () => {
    setSelectedContacts(DEMO_CONTACTS.map((c) => c.id))
  }

  const clearSelection = () => {
    setSelectedContacts([])
    setSelectedGroups([])
  }

  const filteredContacts = DEMO_CONTACTS.filter((c) =>
    (c.firstName + ' ' + c.lastName + ' ' + c.phone).toLowerCase().includes(search.toLowerCase())
  )

  const estimatedCredits = selectedContacts.length * 1

  const handleSend = () => {
    if (!body.trim() || selectedContacts.length === 0) {
      alert('Please select recipients and enter a message')
      return
    }
    if (isScheduled && (!scheduleDate || !scheduleTime)) {
      alert('Please select schedule date and time')
      return
    }
    const action = isScheduled ? 'schedule' : 'send'
    if (!confirm(`Are you sure you want to ${action} this message to ${selectedContacts.length} recipients?`)) return
    alert(`Demo message ${action === 'schedule' ? 'scheduled' : 'sent'} successfully`)
    setBody('')
    setSubject('')
    setSelectedContacts([])
    setSelectedGroups([])
    setStep(1)
  }

  const allGroups = [...new Set(DEMO_CONTACTS.flatMap((c) => c.groups || []))]

  return (
    <div className="page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Compose Message</h1>
        <p className="text-gray-600 dark:text-gray-400">Send messages to your contacts or create a campaign</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Message Type">
            <Tabs
              tabs={[
                { id: 'custom', label: 'Custom Message' },
                { id: 'template', label: 'Template' },
              ]}
              activeTab={messageType}
              onChange={setMessageType}
            />
          </Card>

          {messageType === 'template' && (
            <Card title="Select Template">
              <select
                value={templateId}
                onChange={onTemplateChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select a template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} - {t.category}
                  </option>
                ))}
              </select>
            </Card>
          )}

          <Card title="Message Content">
            <div className="space-y-4">
              {messageType === 'custom' && (
                <Input label="Subject (Optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Type your message here... Use {{first_name}} for variables"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Variables: {'{'}{'{'}first_name{'}'}{'}'}, {'{'}{'{'}last_name{'}'}{'}'}, {'{'}{'{'}company{'}'}{'}'}</p>
              </div>
            </div>
          </Card>

          <Card title="Recipients">
            <Tabs
              tabs={[
                { id: 'contacts', label: 'Contacts' },
                { id: 'groups', label: 'Groups' },
              ]}
              activeTab={step}
              onChange={setStep}
            />

            <div className="mt-4">
              <SearchBar value={search} onChange={setSearch} placeholder="Search contacts..." />
              <div className="flex gap-2 mt-3">
                <Button variant="secondary" size="sm" onClick={selectAllContacts}>
                  Select All
                </Button>
                <Button variant="secondary" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>

            {step === 'contacts' && (
              <div className="mt-4 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                {filteredContacts.map((c) => (
                  <label key={c.id} className="flex items-center gap-3 p-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(c.id)}
                      onChange={() => toggleContact(c.id)}
                      className="rounded border-gray-300"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {c.firstName} {c.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{c.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {step === 'groups' && (
              <div className="mt-4 space-y-2">
                {allGroups.map((group) => (
                  <label key={group} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group)}
                      onChange={() => toggleGroup(group)}
                      className="rounded border-gray-300"
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100">{group}</span>
                    <Badge variant="info" className="ml-auto">
                      {DEMO_CONTACTS.filter((c) => c.groups?.includes(group)).length} contacts
                    </Badge>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selected: <span className="font-semibold">{selectedContacts.length} contacts</span>
              </p>
            </div>
          </Card>

          <Card title="Schedule">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="schedule"
                checked={isScheduled}
                onChange={(e) => setIsScheduled(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="schedule" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Schedule for later
              </label>
            </div>

            {isScheduled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time</label>
                  <input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Summary">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Recipients</span>
                <span className="font-semibold">{selectedContacts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Message Type</span>
                <span className="font-semibold capitalize">{messageType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Estimated Credits</span>
                <span className="font-semibold">{estimatedCredits}</span>
              </div>
              {isScheduled && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Schedule</span>
                    <span className="font-semibold">
                      {scheduleDate} {scheduleTime}
                    </span>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card title="Preview">
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
              {subject && <p className="font-semibold mb-2">{subject}</p>}
              <p className="text-sm whitespace-pre-wrap">{body || 'No message content'}</p>
            </div>
            <Button variant="secondary" className="w-full mt-3" onClick={() => setShowPreview(!showPreview)}>
              <Icon name={showPreview ? 'EyeOff' : 'Eye'} size={16} />
              {showPreview ? 'Hide' : 'Show'} Full Preview
            </Button>
          </Card>

          <div className="space-y-3">
            <Button variant="primary" className="w-full" onClick={handleSend} disabled={selectedContacts.length === 0 || !body.trim()}>
              <Icon name="Send" size={16} />
              {isScheduled ? 'Schedule Message' : 'Send Now'}
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <p className="text-sm text-amber-800 dark:text-amber-400">
              <Icon name="Info" size={16} className="inline mr-1" />
              Demo Mode: Messages are simulated and not actually sent.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
