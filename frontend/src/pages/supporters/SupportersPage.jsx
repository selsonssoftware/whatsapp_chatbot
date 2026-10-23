import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, UserCheck, UserX, Users } from 'lucide-react'
import {
  Button,
  Card,
  Drawer,
  EmptyState,
  Icon,
  Input,
  Modal,
  Notice,
  SearchBar,
} from '../../components/index.js'
import Pagination from '../../components/Pagination.jsx'
import SummaryCards from '../../components/chat/SummaryCards.jsx'
import Avatar from '../../components/chat/Avatar.jsx'
import ConversationStatusBadge from '../../components/chat/ConversationStatusBadge.jsx'
import SupporterTable from '../../components/supporters/SupporterTable.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useConfirm } from '../../hooks/useConfirm.js'
import { usePagination } from '../../hooks/usePagination.js'
import { ROLES } from '../../constants/roles.js'
import { DEMO_CUSTOMERS } from '../../data/chatDemoData.js'
import { getDemoConversations } from '../../services/chatDemoService.js'
import {
  SUPPORTER_LANGUAGES,
  SUPPORTER_ROLES,
  SUPPORTER_STATUSES,
  canManageSupporters,
  createSupporter,
  getSupporters,
  normalizeSupporter,
  removeSupporter,
  saveSupporters,
  updateSupporter,
  validateSupporter,
} from '../../services/supporterService.js'
import { createSupporterWithApi } from '../../services/adminService.js'

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: ROLES.SUPPORTER,
  status: 'active',
  languages: ['English'],
}

const CHAT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'with', label: 'With chats' },
  { id: 'without', label: 'Without chats' },
]

export default function SupportersPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const confirmAction = useConfirm()

  const [supporters, setSupporters] = useState(() => getSupporters().map(normalizeSupporter))
  const [conversations] = useState(() => getDemoConversations())
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [chatFilter, setChatFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState(null)
  const [details, setDetails] = useState(null)
  const [isCreating, setIsCreating] = useState(false)

  const allowed = canManageSupporters(user?.role)

  const statsBySupporter = useMemo(() => {
    const map = {}
    supporters.forEach((supporter) => {
      const assigned = conversations.filter((conversation) => conversation.supporterId === supporter.id)
      map[supporter.id] = {
        assigned: assigned.length,
        unread: assigned.reduce((total, conversation) => total + (conversation.unread || 0), 0),
      }
    })
    return map
  }, [conversations, supporters])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return supporters.filter((supporter) => {
      const haystack = `${supporter.name} ${supporter.email} ${supporter.phone}`.toLowerCase()
      const matchesSearch = !term || haystack.includes(term)
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? supporter.status === 'active' : supporter.presence === statusFilter)
      const assigned = statsBySupporter[supporter.id]?.assigned || 0
      const matchesChats =
        chatFilter === 'all' || (chatFilter === 'with' ? assigned > 0 : assigned === 0)
      return matchesSearch && matchesStatus && matchesChats
    })
  }, [chatFilter, search, statsBySupporter, statusFilter, supporters])

  const { currentPage, totalPages, paginatedItems, goToPage, resetPage } = usePagination(filtered, 8)

  const summary = useMemo(() => {
    const assigned = conversations.filter((conversation) => conversation.supporterId).length
    const unread = conversations.reduce((total, conversation) => total + (conversation.unread || 0), 0)
    return [
      { label: 'Total Supporters', value: supporters.length, icon: Users },
      {
        label: 'Active Supporters',
        value: supporters.filter((supporter) => supporter.status === 'active').length,
        icon: UserCheck,
        tone: 'success',
      },
      {
        label: 'Offline Supporters',
        value: supporters.filter((supporter) => supporter.presence !== 'online').length,
        icon: UserX,
        tone: 'warning',
      },
      { label: 'Assigned Chats', value: assigned, icon: MessageSquare, hint: `${unread} unread` },
    ]
  }, [conversations, supporters])

  const persist = (next, message) => {
    setSupporters(next)
    saveSupporters(next)
    setNotice({ type: 'success', message })
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setShowForm(true)
  }

  const openEdit = (supporter) => {
    setEditing(supporter)
    setForm({
      name: supporter.name || '',
      email: supporter.email || '',
      phone: supporter.phone || '',
      password: '',
      role: supporter.role || ROLES.SUPPORTER,
      status: supporter.status || 'active',
      languages: supporter.languages?.length ? [...supporter.languages] : ['English'],
    })
    setErrors({})
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setErrors({})
  }

  const saveSupporter = async () => {
    const validation = validateSupporter(form, supporters, editing?.id)
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    if (editing) {
      const next = updateSupporter(supporters, editing.id, form)
      persist(next, `${form.name.trim()} updated.`)
      closeForm()
      return
    }

    setIsCreating(true)
    try {
      const response = await createSupporterWithApi({
        adminId: user?.id || user?.admin_id || '',
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        languages: form.languages,
        status: 1,
      })

      if (!response?.status) {
        throw new Error(response?.message || 'Failed to create supporter')
      }

      const supporter = response.supporter || {}
      const next = createSupporter(supporters, {
        id: String(supporter.supporter_id || supporter.id || Date.now()),
        name: supporter.name || form.name,
        email: supporter.email || form.email,
        phone: supporter.phone || form.phone,
        role: ROLES.SUPPORTER,
        status: supporter.status ? 'active' : 'inactive',
        presence: 'online',
        lastActive: new Date().toISOString(),
        joinedAt: supporter.created_at || new Date().toISOString().slice(0, 10),
        languages: supporter.languages || form.languages,
      })
      saveSupporters(next)
      setSupporters(next)
      setNotice({ type: 'success', message: response.message || 'Supporter created successfully.' })
      closeForm()
    } catch (err) {
      setNotice({ type: 'error', message: err.message || 'Unable to create supporter. Please try again.' })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRemove = async (supporter) => {
    const confirmed = await confirmAction({
      title: 'Remove supporter',
      message: `Remove ${supporter.name} from the support bench? Their conversations stay in the demo list.`,
      confirmLabel: 'Remove',
    })
    if (!confirmed) return
    persist(removeSupporter(supporters, supporter.id), `${supporter.name} removed.`)
  }

  const handleViewChats = (supporter) => {
    navigate(`/supporter/inbox?supporter=${supporter.id}`)
  }

  const toggleLanguage = (language) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((item) => item !== language)
        : [...prev.languages, language],
    }))
    setErrors((prev) => ({ ...prev, languages: undefined }))
  }

  const detailsConversations = useMemo(
    () => (details ? conversations.filter((conversation) => conversation.supporterId === details.id) : []),
    [conversations, details]
  )

  if (!allowed) {
    return (
      <div className="page">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Supporters Management</h1>
        <Card>
          <EmptyState
            icon="Shield"
            title="Access restricted"
            description={`Only admins can manage the supporter directory. You are signed in as ${
              user?.role || 'a guest'
            }.`}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Supporters Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Support bench roster with live chat workload · demo data only
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" onClick={openCreate} disabled={isCreating}>
            <Icon name="Plus" size={16} />
            {isCreating ? 'Creating…' : 'Add Supporter'}
          </Button>
        </div>
      </div>

      {notice && (
        <Notice type={notice.type} onDismiss={() => setNotice(null)}>
          {notice.message}
        </Notice>
      )}

      <SummaryCards cards={summary} />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value)
            resetPage()
          }}
          placeholder="Search by name, email or phone..."
          className="flex-1 min-w-[240px]"
        />
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value)
            resetPage()
          }}
          aria-label="Filter by status"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        <select
          value={chatFilter}
          onChange={(event) => {
            setChatFilter(event.target.value)
            resetPage()
          }}
          aria-label="Filter by assigned conversations"
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {CHAT_FILTERS.map((filter) => (
            <option key={filter.id} value={filter.id}>
              {filter.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon="UserPlus"
            title="No supporters found"
            description={
              supporters.length === 0
                ? 'Add your first supporter to build the support bench.'
                : 'No supporter matches the current search and filters.'
            }
            action={
              <Button variant="primary" onClick={openCreate} disabled={isCreating}>
                <Icon name="Plus" size={16} />
                Add Supporter
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <SupporterTable
            supporters={paginatedItems}
            statsBySupporter={statsBySupporter}
            onViewDetails={setDetails}
            onViewChats={handleViewChats}
            onEdit={openEdit}
            onRemove={handleRemove}
          />
          <Pagination currentPage={currentPage} totalPages={totalPages} onChange={goToPage} itemLabel="supporters" />
        </>
      )}

      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editing ? 'Edit Supporter' : 'Add Supporter'}
        footer={
          <>
            <Button variant="secondary" onClick={closeForm} disabled={isCreating}>
              Cancel
            </Button>
            <Button variant="primary" onClick={saveSupporter} disabled={isCreating}>
              {isCreating ? 'Creating…' : editing ? 'Update' : 'Add Supporter'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            error={errors.name}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            error={errors.email}
          />
          <Input
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            error={errors.phone}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(event) => setForm({ ...form, password: event.target.value })}
            error={errors.password}
          />
          <div>
            <label htmlFor="supporter-form-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              id="supporter-form-role"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {SUPPORTER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && <p className="error mt-1">{errors.role}</p>}
          </div>
          <div>
            <label
              htmlFor="supporter-form-status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Status
            </label>
            <select
              id="supporter-form-status"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {SUPPORTER_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === 'active' ? 'Active' : 'Inactive'}
                </option>
              ))}
            </select>
            {errors.status && <p className="error mt-1">{errors.status}</p>}
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Languages</span>
            <div className="flex flex-wrap gap-2">
              {SUPPORTER_LANGUAGES.map((language) => {
                const selected = form.languages.includes(language)
                return (
                  <button
                    key={language}
                    type="button"
                    onClick={() => toggleLanguage(language)}
                    aria-pressed={selected}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      selected
                        ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                        : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {language}
                  </button>
                )
              })}
            </div>
            {errors.languages && <p className="error mt-1">{errors.languages}</p>}
          </div>
        </div>
      </Modal>

      <Drawer
        isOpen={Boolean(details)}
        onClose={() => setDetails(null)}
        title={details ? details.name : 'Supporter details'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDetails(null)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => details && handleViewChats(details)}>
              <Icon name="MessageSquare" size={16} />
              View Chats
            </Button>
          </>
        }
      >
        {details && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={details.name} size="lg" presence={details.presence} />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{details.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{details.role}</p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-gray-500">Email</dt>
                <dd className="text-gray-900 dark:text-gray-100 break-words">{details.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Phone</dt>
                <dd className="text-gray-900 dark:text-gray-100">{details.phone || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Status</dt>
                <dd className="text-gray-900 dark:text-gray-100 capitalize">{details.status}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Presence</dt>
                <dd className="text-gray-900 dark:text-gray-100 capitalize">{details.presence}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Joined</dt>
                <dd className="text-gray-900 dark:text-gray-100">{details.joinedAt}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Last active</dt>
                <dd className="text-gray-900 dark:text-gray-100">{details.lastActive || '—'}</dd>
              </div>
            </dl>

            {details.languages?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {details.languages.map((language) => (
                  <span
                    key={language}
                    className="badge badge-info"
                  >
                    {language}
                  </span>
                ))}
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assigned conversations ({detailsConversations.length})
              </p>
              {detailsConversations.length === 0 ? (
                <p className="text-sm text-gray-500">No conversations assigned to this supporter.</p>
              ) : (
                <ul className="space-y-2">
                  {detailsConversations.map((conversation) => {
                    const customer = DEMO_CUSTOMERS.find((item) => item.id === conversation.customerId)
                    return (
                      <li
                        key={conversation.id}
                        className="flex items-center justify-between gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <span className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {customer?.name || conversation.id}
                        </span>
                        <span className="flex items-center gap-2 shrink-0">
                          {conversation.unread > 0 && (
                            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-brand-600 text-white text-[11px] font-semibold flex items-center justify-center">
                              {conversation.unread}
                            </span>
                          )}
                          <ConversationStatusBadge status={conversation.status} />
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
