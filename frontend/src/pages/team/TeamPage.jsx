import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Users, CheckCircle2, Shield, UserPlus, Search, Plus, Edit2, Trash2, X,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Send, SearchX, Download,
  Power, Copy, Clock, Mail, Ban, History, Activity, Lock, RotateCcw, Sparkles,
  AlertTriangle, UserCheck, Info,
} from 'lucide-react'
import { BLAST_KPIS, TEAM_MEMBERS_DATA, ROLE_PERMISSIONS } from '../../data/mockBlastData.js'

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */
const ROLES = ['Admin', 'Manager', 'Agent', 'Analyst', 'Viewer']
const TEAMS = ['Support', 'Sales', 'Marketing', 'Management']
const STATUSES = ['Online', 'Away', 'Offline']
const TABS = [
  { id: 'members', label: 'Team Members', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'logs', label: 'Activity Logs', icon: Activity },
  { id: 'invites', label: 'Invite History', icon: Mail },
]
const ROLE_STYLE = {
  Admin: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
  Manager: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  Agent: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  Analyst: 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300',
  Viewer: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
}
const STATUS_STYLE = {
  Online: ['text-emerald-600 dark:text-emerald-400', 'bg-emerald-500'],
  Away: ['text-amber-500', 'bg-amber-500'],
  Offline: ['text-slate-400', 'bg-slate-400'],
}
const INVITE_STYLE = {
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  Accepted: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  Expired: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  Revoked: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
}
const LOG_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'member', label: 'Members' },
  { id: 'role', label: 'Roles' },
  { id: 'invite', label: 'Invites' },
  { id: 'system', label: 'System' },
]
const LOG_ICON = { member: Users, role: Shield, invite: Mail, system: Info }
const ROLE_TEMPLATES = [
  { name: 'Support agent', role: 'Agent', team: 'Support', desc: 'Handle chats and tickets, reply to customers.' },
  { name: 'Sales executive', role: 'Agent', team: 'Sales', desc: 'Manage leads, broadcasts and follow-ups.' },
  { name: 'Team lead', role: 'Manager', team: 'Support', desc: 'Assign work, review team performance.' },
  { name: 'Marketing analyst', role: 'Analyst', team: 'Marketing', desc: 'Campaign reports and audience insights.' },
  { name: 'Read-only auditor', role: 'Viewer', team: 'Management', desc: 'View everything, change nothing.' },
  { name: 'Operations admin', role: 'Admin', team: 'Management', desc: 'Full access including billing and roles.' },
]
const INVITE_TTL = 7 * 24 * 60 * 60 * 1000
const EMPTY_FORM = { name: '', email: '', role: 'Agent', team: 'Support', phone: '', active: true }
const AVATAR_COLORS = [
  'bg-rose-100 text-rose-700', 'bg-blue-100 text-blue-700', 'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700', 'bg-violet-100 text-violet-700', 'bg-teal-100 text-teal-700',
]

const input =
  'w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-[#00A884]/50 dark:border-slate-700 dark:bg-slate-800 dark:text-white'
const card = 'rounded-2xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900'
const iconBtn =
  'rounded-lg p-2 text-slate-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A884] disabled:cursor-not-allowed disabled:opacity-40'
const filterSelect =
  'rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#00A884]/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
const btnPrimary =
  'inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#00A884] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#008f6f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A884] focus-visible:ring-offset-2 disabled:opacity-50'
const btnGhost =
  'inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A884] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:opacity-50'

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
const uid = () => Date.now() + Math.floor(Math.random() * 100000)
const nowIso = () => new Date().toISOString()
const permKey = (role) => role.toLowerCase()

function usePersistent(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) return JSON.parse(raw)
    } catch { /* ignore */ }
    return typeof initial === 'function' ? initial() : initial
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ }
  }, [key, value])
  return [value, setValue]
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hr ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} day${d > 1 ? 's' : ''} ago`
  return new Date(iso).toLocaleDateString('en-IN', { dateStyle: 'medium' })
}
const fullDate = (iso) =>
  new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })

const inviteStatus = (i) =>
  i.status === 'Pending' && Date.now() - new Date(i.sentAt).getTime() > INVITE_TTL ? 'Expired' : i.status

const avatarColor = (name = '') =>
  AVATAR_COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length]

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      const ok = document.execCommand('copy')
      el.remove()
      return ok
    } catch { return false }
  }
}

function downloadCsv(filename, rows) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = rows.map((r) => r.map(esc).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const seedLogs = () => {
  const t = Date.now()
  return [
    { id: 1, type: 'system', text: 'Team workspace created', ts: new Date(t - 3 * 86400000).toISOString() },
    { id: 2, type: 'role', text: 'Default role permissions applied', ts: new Date(t - 2 * 86400000).toISOString() },
    { id: 3, type: 'invite', text: 'Invitation sent to karthik@company.com', ts: new Date(t - 2 * 86400000).toISOString() },
  ]
}
const seedInvites = () => {
  const t = Date.now()
  const d = 86400000
  return [
    { id: 1, name: 'Karthik Raja', email: 'karthik@company.com', role: 'Agent', team: 'Support', phone: '', active: true, sentAt: new Date(t - 2 * d).toISOString(), status: 'Pending', resent: 0 },
    { id: 2, name: 'Divya S', email: 'divya@company.com', role: 'Analyst', team: 'Marketing', phone: '', active: true, sentAt: new Date(t - 10 * d).toISOString(), status: 'Pending', resent: 1 },
  ]
}

/* ------------------------------------------------------------------ */
/* Small components                                                    */
/* ------------------------------------------------------------------ */
function KpiCard({ label, icon: Icon, tone, data = {}, onClick, hint }) {
  return (
    <button
      type="button" onClick={onClick} title={hint}
      className={`${card} p-4 text-left transition hover:border-[#00A884]/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A884]`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{data.value}</h3>
        {data.change && <span className="text-xs font-semibold text-emerald-600">{data.change}</span>}
      </div>
      <p className="mt-1 text-[11px] text-slate-400">{data.period || hint}</p>
    </button>
  )
}

const RoleBadge = ({ role }) => (
  <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${ROLE_STYLE[role] || ROLE_STYLE.Viewer}`}>{role}</span>
)

const StatusDot = ({ status }) => {
  const [text, dot] = STATUS_STYLE[status] || STATUS_STYLE.Offline
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  )
}

const Avatar = ({ name, size = 'h-9 w-9 text-xs' }) => (
  <div className={`flex shrink-0 items-center justify-center rounded-full font-bold ${size} ${avatarColor(name)}`}>
    {(name || '?').charAt(0).toUpperCase()}
  </div>
)

function Field({ label, error, children }) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}
    </label>
  )
}

function Modal({ title, onClose, children, wide }) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeRef.current()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [])
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog" aria-modal="true" aria-label={title}
        className={`${card} relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-b-none p-5 shadow-2xl sm:rounded-2xl ${wide ? 'sm:max-w-2xl' : 'sm:max-w-md'}`}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{title}</h2>
          <button onClick={onClose} className={iconBtn} aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function SortTh({ label, k, sort, setSort, className = '' }) {
  const active = sort.key === k
  return (
    <th className={`px-3 py-2.5 font-semibold ${className}`} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button
        type="button"
        onClick={() => setSort((s) => (s.key === k ? { key: k, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: k, dir: 'asc' }))}
        className="inline-flex items-center gap-1 hover:text-slate-900 dark:hover:text-white"
      >
        {label}
        {active ? (sort.dir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />) : <ChevronDown className="h-3 w-3 opacity-30" />}
      </button>
    </th>
  )
}

function EmptyState({ icon: Icon = SearchX, title, action }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <Icon className="h-8 w-8 text-slate-300" />
      <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
      {action}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function TeamPage() {
  const [members, setMembers] = usePersistent('blast.team.members', TEAM_MEMBERS_DATA)
  const [permissions, setPermissions] = usePersistent('blast.team.permissions', ROLE_PERMISSIONS)
  const [logs, setLogs] = usePersistent('blast.team.logs', seedLogs)
  const [invites, setInvites] = usePersistent('blast.team.invites', seedInvites)

  const [activeTab, setActiveTab] = useState('members')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [teamFilter, setTeamFilter] = useState('All Teams')
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [selected, setSelected] = useState(new Set())

  const [drawer, setDrawer] = useState(() => ({
    open: typeof window !== 'undefined' && window.innerWidth >= 1024, mode: 'add', id: null,
  }))
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [templatesOpen, setTemplatesOpen] = useState(false)

  const [featureSearch, setFeatureSearch] = useState('')
  const [logSearch, setLogSearch] = useState('')
  const [logType, setLogType] = useState('all')
  const [logLimit, setLogLimit] = useState(15)
  const [inviteFilter, setInviteFilter] = useState('All')

  const searchRef = useRef(null)

  /* ---------- toast + log helpers ---------- */
  const notify = useCallback((msg, type = 'success', action = null) => setFeedback({ msg, type, action }), [])
  const addLog = useCallback(
    (type, text) => setLogs((p) => [{ id: uid(), type, text, ts: nowIso() }, ...p].slice(0, 200)),
    [setLogs]
  )

  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => setFeedback(null), feedback.action ? 6000 : 3000)
    return () => clearTimeout(t)
  }, [feedback])

  const closeDrawer = useCallback(() => {
    setDrawer({ open: false, mode: 'add', id: null })
    setForm(EMPTY_FORM)
    setErrors({})
  }, [])

  // Esc closes drawer (unless a modal is open), "/" focuses search
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !confirm && !templatesOpen) closeDrawer()
      const tag = e.target?.tagName
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirm, templatesOpen, closeDrawer])

  /* ---------- derived data ---------- */
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return members.filter((m) => {
      if (roleFilter !== 'All Roles' && m.role !== roleFilter) return false
      if (statusFilter !== 'All Status' && m.status !== statusFilter) return false
      if (teamFilter !== 'All Teams' && m.team !== teamFilter) return false
      return !q || [m.name, m.email, m.role, m.team].some((v) => String(v ?? '').toLowerCase().includes(q))
    })
  }, [members, search, roleFilter, statusFilter, teamFilter])

  const sorted = useMemo(() => {
    if (!sort.key) return filtered
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => String(a[sort.key] ?? '').localeCompare(String(b[sort.key] ?? '')) * dir)
  }, [filtered, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const rows = sorted.slice((safePage - 1) * pageSize, safePage * pageSize)
  const allOnPageSelected = rows.length > 0 && rows.every((m) => selected.has(m.id))
  const filtersActive = search || roleFilter !== 'All Roles' || statusFilter !== 'All Status' || teamFilter !== 'All Teams'

  const pendingInvites = invites.filter((i) => inviteStatus(i) === 'Pending').length
  const kpiBase = BLAST_KPIS?.team ?? {}
  const roleCount = (role) => members.filter((m) => m.role === role).length
  const permCount = (role) => permissions.filter((p) => p[permKey(role)]).length

  const resetFilters = () => {
    setSearch(''); setRoleFilter('All Roles'); setStatusFilter('All Status'); setTeamFilter('All Teams'); setPage(1)
  }
  const resetPage = (fn) => (e) => { fn(e.target.value); setPage(1) }

  /* ---------- member actions ---------- */
  const hasAdminAfter = (next) => next.some((m) => m.role === 'Admin')
  const blockLastAdmin = () => notify('At least one Admin is required.', 'error')

  const toggleSelect = (id) =>
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  const toggleAll = () =>
    setSelected((s) => {
      const n = new Set(s)
      rows.forEach((m) => (allOnPageSelected ? n.delete(m.id) : n.add(m.id)))
      return n
    })

  const doRemove = (ids) => {
    const removed = members.filter((m) => ids.includes(m.id))
    const next = members.filter((m) => !ids.includes(m.id))
    if (!hasAdminAfter(next)) return blockLastAdmin()
    setMembers(next)
    setSelected((s) => { const n = new Set(s); ids.forEach((i) => n.delete(i)); return n })
    addLog('member', `Removed ${removed.map((m) => m.name).join(', ')}`)
    notify(`${removed.length} member${removed.length > 1 ? 's' : ''} removed`, 'success', {
      label: 'Undo',
      fn: () => {
        setMembers((p) => [...removed, ...p])
        addLog('member', `Restored ${removed.map((m) => m.name).join(', ')}`)
        setFeedback(null)
      },
    })
  }
  const askRemove = (ids) => {
    const names = members.filter((m) => ids.includes(m.id)).map((m) => m.name)
    setConfirm({
      title: ids.length > 1 ? `Remove ${ids.length} members?` : `Remove ${names[0]}?`,
      message: 'They will lose access immediately. You can undo right after removing.',
      confirmLabel: 'Remove',
      danger: true,
      onConfirm: () => doRemove(ids),
    })
  }

  const setStatusFor = (ids, status) => {
    setMembers((p) => p.map((m) => (ids.includes(m.id) ? { ...m, status, lastActive: 'Just now' } : m)))
    const names = members.filter((m) => ids.includes(m.id)).map((m) => m.name).join(', ')
    addLog('member', `${status === 'Offline' ? 'Deactivated' : 'Activated'} ${names}`)
    notify(`${ids.length} member${ids.length > 1 ? 's' : ''} ${status === 'Offline' ? 'deactivated' : 'activated'}`)
  }
  const toggleActive = (m) => setStatusFor([m.id], m.status === 'Offline' ? 'Online' : 'Offline')

  const bulkChangeRole = (role) => {
    if (!role) return
    const ids = [...selected]
    const next = members.map((m) => (ids.includes(m.id) ? { ...m, role } : m))
    if (!hasAdminAfter(next)) return blockLastAdmin()
    setMembers(next)
    addLog('member', `Changed role to ${role} for ${ids.length} member${ids.length > 1 ? 's' : ''}`)
    notify(`Role changed to ${role} for ${ids.length} member${ids.length > 1 ? 's' : ''}`)
  }

  const exportMembers = () => {
    const list = selected.size ? members.filter((m) => selected.has(m.id)) : sorted
    downloadCsv('team-members.csv', [
      ['Name', 'Email', 'Phone', 'Role', 'Team', 'Status', 'Last active'],
      ...list.map((m) => [m.name, m.email, m.phone, m.role, m.team, m.status, m.lastActive]),
    ])
    addLog('system', `Exported ${list.length} member${list.length !== 1 ? 's' : ''} to CSV`)
    notify(`Exported ${list.length} member${list.length !== 1 ? 's' : ''}`)
  }

  /* ---------- drawer / form ---------- */
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }))

  const openAdd = (preset = {}) => {
    setForm({ ...EMPTY_FORM, ...preset })
    setErrors({})
    setDrawer({ open: true, mode: 'add', id: null })
    setActiveTab('members')
  }
  const openEdit = (m) => {
    setForm({
      name: m.name || '', email: m.email || '', role: m.role || 'Agent', team: m.team || 'Support',
      phone: m.phone || '', active: m.status !== 'Offline',
    })
    setErrors({})
    setDrawer({ open: true, mode: 'edit', id: m.id })
    setActiveTab('members')
  }

  const validate = () => {
    const e = {}
    const email = form.email.trim().toLowerCase()
    if (!form.name.trim()) e.name = 'Enter the full name.'
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'Enter a valid email address.'
    else if (members.some((m) => m.id !== drawer.id && (m.email || '').toLowerCase() === email))
      e.email = 'This email is already on your team.'
    else if (drawer.mode === 'add' && invites.some((i) => inviteStatus(i) === 'Pending' && i.email.toLowerCase() === email))
      e.email = 'An invitation is already pending for this email.'
    const digits = form.phone.replace(/\D/g, '')
    if (form.phone && digits.length !== 10) e.phone = 'Enter a 10-digit mobile number.'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) return

    if (drawer.mode === 'edit') {
      const next = members.map((m) =>
        m.id === drawer.id
          ? { ...m, name: form.name.trim(), email: form.email.trim(), role: form.role, team: form.team, phone: form.phone,
              status: form.active ? (m.status === 'Offline' ? 'Online' : m.status) : 'Offline' }
          : m
      )
      if (!hasAdminAfter(next)) return blockLastAdmin()
      setMembers(next)
      addLog('member', `Updated ${form.name.trim()}`)
      notify(`${form.name.trim()} updated`)
      closeDrawer()
      return
    }

    const invite = {
      id: uid(), name: form.name.trim(), email: form.email.trim(), role: form.role, team: form.team,
      phone: form.phone, active: form.active, sentAt: nowIso(), status: 'Pending', resent: 0,
    }
    setInvites((p) => [invite, ...p])
    addLog('invite', `Invitation sent to ${invite.email} as ${invite.role}`)
    notify(`Invitation sent to ${invite.email}`, 'success', {
      label: 'View',
      fn: () => { setActiveTab('invites'); setFeedback(null) },
    })
    setForm(EMPTY_FORM)
    setErrors({})
    if (window.innerWidth < 1024) closeDrawer()
  }

  /* ---------- permissions ---------- */
  const togglePermission = (feature, role) => {
    if (role === 'Admin') return
    const key = permKey(role)
    const target = permissions.find((p) => p.feature === feature)
    const enabled = !target?.[key]
    setPermissions((prev) => prev.map((p) => (p.feature === feature ? { ...p, [key]: enabled } : p)))
    addLog('role', `${enabled ? 'Granted' : 'Revoked'} "${feature}" for ${role}`)
  }
  const setAllForRole = (role, value) => {
    if (role === 'Admin') return
    const key = permKey(role)
    setPermissions((prev) => prev.map((p) => ({ ...p, [key]: value })))
    addLog('role', `${value ? 'Granted' : 'Revoked'} all features for ${role}`)
    notify(`${role}: all features ${value ? 'enabled' : 'disabled'}`)
  }
  const resetPermissions = () =>
    setConfirm({
      title: 'Reset permissions?',
      message: 'All role permissions will go back to their defaults.',
      confirmLabel: 'Reset',
      onConfirm: () => {
        setPermissions(ROLE_PERMISSIONS)
        addLog('role', 'Role permissions reset to defaults')
        notify('Permissions reset to defaults')
      },
    })

  const visibleFeatures = permissions.filter((p) => p.feature.toLowerCase().includes(featureSearch.trim().toLowerCase()))

  /* ---------- invites ---------- */
  const resendInvite = (i) => {
    setInvites((p) => p.map((x) => (x.id === i.id ? { ...x, sentAt: nowIso(), status: 'Pending', resent: (x.resent || 0) + 1 } : x)))
    addLog('invite', `Invitation resent to ${i.email}`)
    notify(`Invitation resent to ${i.email}`)
  }
  const revokeInvite = (i) =>
    setConfirm({
      title: 'Revoke invitation?',
      message: `${i.email} will no longer be able to join with this invitation.`,
      confirmLabel: 'Revoke',
      danger: true,
      onConfirm: () => {
        setInvites((p) => p.map((x) => (x.id === i.id ? { ...x, status: 'Revoked' } : x)))
        addLog('invite', `Invitation to ${i.email} revoked`)
        notify('Invitation revoked')
      },
    })
  const acceptInvite = (i) => {
    if (members.some((m) => (m.email || '').toLowerCase() === i.email.toLowerCase()))
      return notify('This person is already a member.', 'error')
    setMembers((p) => [
      { id: uid(), name: i.name, email: i.email, role: i.role, team: i.team, phone: i.phone,
        status: i.active ? 'Online' : 'Offline', lastActive: 'Just now' },
      ...p,
    ])
    setInvites((p) => p.map((x) => (x.id === i.id ? { ...x, status: 'Accepted' } : x)))
    addLog('invite', `${i.name} accepted the invitation`)
    addLog('member', `${i.name} joined as ${i.role}`)
    notify(`${i.name} joined the team`)
  }
  const copyInviteLink = async (i) => {
    const ok = await copyText(`${window.location.origin}/invite/${i.id}`)
    notify(ok ? 'Invite link copied' : 'Could not copy the link', ok ? 'success' : 'error')
  }
  const clearInviteHistory = () =>
    setConfirm({
      title: 'Clear invite history?',
      message: 'Accepted, expired and revoked invitations will be deleted. Pending ones stay.',
      confirmLabel: 'Clear',
      danger: true,
      onConfirm: () => {
        setInvites((p) => p.filter((i) => inviteStatus(i) === 'Pending'))
        notify('Invite history cleared')
      },
    })

  const visibleInvites = invites.filter((i) => inviteFilter === 'All' || inviteStatus(i) === inviteFilter)

  /* ---------- logs ---------- */
  const visibleLogs = logs.filter(
    (l) => (logType === 'all' || l.type === logType) && l.text.toLowerCase().includes(logSearch.trim().toLowerCase())
  )
  const exportLogs = () => {
    downloadCsv('activity-logs.csv', [['Time', 'Type', 'Activity'], ...visibleLogs.map((l) => [fullDate(l.ts), l.type, l.text])])
    notify(`Exported ${visibleLogs.length} log entries`)
  }
  const clearLogs = () =>
    setConfirm({
      title: 'Clear activity logs?',
      message: 'This permanently deletes all log entries.',
      confirmLabel: 'Clear logs',
      danger: true,
      onConfirm: () => { setLogs([]); notify('Activity logs cleared') },
    })

  /* ---------- KPIs ---------- */
  const kpis = [
    {
      label: 'Total members', icon: Users, tone: 'bg-emerald-50 text-[#00A884] dark:bg-emerald-950/50',
      data: { ...kpiBase.totalMembers, value: members.length }, hint: 'View all members',
      onClick: () => { resetFilters(); setActiveTab('members') },
    },
    {
      label: 'Active members', icon: CheckCircle2, tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50',
      data: { ...kpiBase.activeMembers, value: members.filter((m) => m.status !== 'Offline').length }, hint: 'Show online members',
      onClick: () => { resetFilters(); setStatusFilter('Online'); setActiveTab('members') },
    },
    {
      label: 'Roles', icon: Shield, tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50',
      data: { ...kpiBase.roles, value: ROLES.length }, hint: 'Manage roles',
      onClick: () => setActiveTab('roles'),
    },
    {
      label: 'Pending invitations', icon: UserPlus, tone: 'bg-amber-50 text-amber-500 dark:bg-amber-950/50',
      data: { ...kpiBase.pendingInvitations, value: pendingInvites }, hint: 'View invitations',
      onClick: () => { setInviteFilter('Pending'); setActiveTab('invites') },
    },
  ]

  /* ---------- row actions (shared mobile + desktop) ---------- */
  const RowActions = ({ m, small }) => {
    const cls = small ? 'h-3.5 w-3.5' : 'h-4 w-4'
    return (
      <>
        <button onClick={() => openEdit(m)} className={`${iconBtn} hover:text-slate-600`} aria-label={`Edit ${m.name}`} title="Edit"><Edit2 className={cls} /></button>
        <button onClick={() => toggleActive(m)} className={`${iconBtn} ${m.status === 'Offline' ? 'hover:text-emerald-600' : 'hover:text-amber-600'}`}
          aria-label={`${m.status === 'Offline' ? 'Activate' : 'Deactivate'} ${m.name}`} title={m.status === 'Offline' ? 'Activate' : 'Deactivate'}><Power className={cls} /></button>
        <button onClick={() => askRemove([m.id])} className={`${iconBtn} hover:text-rose-600`} aria-label={`Remove ${m.name}`} title="Remove"><Trash2 className={cls} /></button>
      </>
    )
  }

  /* ---------- drawer content ---------- */
  const isEdit = drawer.mode === 'edit'
  const roleOptions = isEdit ? ROLES : ROLES.filter((r) => r !== 'Admin')
  const allowedFeatures = permissions.filter((p) => p[permKey(form.role)])

  const drawerContent = (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit team member' : 'Add team member'}</h2>
        <button onClick={closeDrawer} className={iconBtn} aria-label="Close panel"><X className="h-4 w-4" /></button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        <Field label="Full name *" error={errors.name}>
          <input className={input} value={form.name} onChange={set('name')} placeholder="John Doe" autoComplete="off" />
        </Field>
        <Field label="Email address *" error={errors.email}>
          <input type="email" className={input} value={form.email} onChange={set('email')} placeholder="john@company.com" autoComplete="off" />
        </Field>
        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
          <Field label="Role *">
            <select className={input} value={form.role} onChange={set('role')}>
              {roleOptions.map((r) => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Team">
            <select className={input} value={form.team} onChange={set('team')}>
              {TEAMS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Phone (optional)" error={errors.phone}>
          <div className="flex">
            <span className="flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-100 px-3 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800">+91</span>
            <input inputMode="tel" className={`${input} rounded-l-none`} value={form.phone} onChange={set('phone')} placeholder="98765 43210" />
          </div>
        </Field>

        <div className="flex items-center justify-between pt-1">
          <span id="active-label" className="text-xs font-semibold text-slate-700 dark:text-slate-300">Active (can access system)</span>
          <button
            type="button" role="switch" aria-checked={form.active} aria-labelledby="active-label"
            onClick={() => setForm((p) => ({ ...p, active: !p.active }))}
            className={`relative h-5 w-9 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A884] ${form.active ? 'bg-[#00A884]' : 'bg-slate-300 dark:bg-slate-700'}`}
          >
            <span className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.active ? 'translate-x-4' : ''}`} />
          </button>
        </div>

        <div className="flex gap-2">
          <button type="submit" className={`${btnPrimary} flex-1`}>
            <Send className="h-3.5 w-3.5" /> {isEdit ? 'Save changes' : 'Send invitation'}
          </button>
          {isEdit && <button type="button" onClick={closeDrawer} className={btnGhost}>Cancel</button>}
        </div>
      </form>

      <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 dark:text-white">{form.role} can access</span>
          <button type="button" onClick={() => { setActiveTab('roles'); if (window.innerWidth < 1024) closeDrawer() }}
            className="text-[11px] font-semibold text-[#00A884] hover:underline">Manage roles</button>
        </div>
        {allowedFeatures.length === 0 ? (
          <p className="text-[11px] text-slate-400">No features enabled for this role.</p>
        ) : (
          <div className="flex max-h-32 flex-wrap gap-1.5 overflow-auto">
            {allowedFeatures.map((p) => (
              <span key={p.feature} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">{p.feature}</span>
            ))}
          </div>
        )}
        <p className="text-[11px] text-slate-400">{allowedFeatures.length} of {permissions.length} features enabled</p>
      </div>
    </div>
  )

  /* ---------- pagination ---------- */
  const pagination = (
    <div className="mt-3 flex flex-col items-center gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 sm:flex-row sm:justify-between">
      <label className="flex items-center gap-2">
        Show
        <select value={pageSize} onChange={(e) => { setPageSize(+e.target.value); setPage(1) }} className={filterSelect}>
          {[5, 10, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
        per page • {sorted.length} total
      </label>
      <div className="flex items-center gap-1">
        <button disabled={safePage === 1} onClick={() => setPage(1)} aria-label="First page" className="rounded px-2 py-1.5 font-medium hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800">First</button>
        <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)} aria-label="Previous page" className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"><ChevronLeft className="h-4 w-4" /></button>
        <span className="px-2 font-medium">Page {safePage} of {totalPages}</span>
        <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)} aria-label="Next page" className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"><ChevronRight className="h-4 w-4" /></button>
        <button disabled={safePage === totalPages} onClick={() => setPage(totalPages)} aria-label="Last page" className="rounded px-2 py-1.5 font-medium hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800">Last</button>
      </div>
    </div>
  )

  /* ------------------------------------------------------------------ */
  return (
    <div className="flex flex-col space-y-4 text-slate-800 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">Team & Roles</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your team members, roles and permissions. Control access to features and keep your business secure.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button onClick={() => setTemplatesOpen(true)} className={`${btnGhost} flex-1 sm:flex-none`}>
            <Sparkles className="h-4 w-4" /> Role templates
          </button>
          <button onClick={() => openAdd()} className={`${btnPrimary} flex-1 sm:flex-none`}>
            <Plus className="h-4 w-4" /> Add member
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Tabs */}
      <div role="tablist" className="-mx-1 flex gap-1 overflow-x-auto border-b border-slate-200 px-1 pb-2 dark:border-slate-800 [scrollbar-width:none]">
        {TABS.map((t) => {
          const count = t.id === 'members' ? members.length : t.id === 'invites' ? pendingInvites : t.id === 'logs' ? logs.length : null
          return (
            <button key={t.id} role="tab" aria-selected={activeTab === t.id} onClick={() => setActiveTab(t.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                activeTab === t.id ? 'bg-[#00A884]/10 text-[#00A884]' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}>
              <t.icon className="h-3.5 w-3.5" />
              {t.label}
              {count > 0 && <span className="rounded-full bg-slate-100 px-1.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800">{count}</span>}
            </button>
          )
        })}
      </div>

      {/* ============================ MEMBERS ============================ */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
          <section className={`${drawer.open ? 'lg:col-span-8' : 'lg:col-span-12'} ${card} min-w-0 p-3 sm:p-4`}>
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input ref={searchRef} type="search" value={search} onChange={resetPage(setSearch)}
                  placeholder="Search by name, email, role or team…  ( / )"
                  className={`${input} pl-9`} aria-label="Search team members" />
              </div>
              <div className="grid grid-cols-3 gap-2 md:flex">
                <select aria-label="Role" value={roleFilter} onChange={resetPage(setRoleFilter)} className={filterSelect}>
                  {['All Roles', ...ROLES].map((o) => <option key={o}>{o}</option>)}
                </select>
                <select aria-label="Status" value={statusFilter} onChange={resetPage(setStatusFilter)} className={filterSelect}>
                  {['All Status', ...STATUSES].map((o) => <option key={o}>{o}</option>)}
                </select>
                <select aria-label="Team" value={teamFilter} onChange={resetPage(setTeamFilter)} className={filterSelect}>
                  {['All Teams', 'Management', 'Sales', 'Support', 'Marketing'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                {filtersActive && (
                  <button onClick={resetFilters} className={`${btnGhost} px-3 py-2 text-xs`}><X className="h-3.5 w-3.5" /> Clear</button>
                )}
                <button onClick={exportMembers} className={`${btnGhost} px-3 py-2 text-xs`} title="Export CSV">
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
              </div>
            </div>

            {selected.size > 0 && (
              <div className="mb-3 flex flex-col gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <span className="font-semibold">{selected.size} selected</span>
                <div className="flex flex-wrap items-center gap-2">
                  <select aria-label="Change role for selected" value="" onChange={(e) => bulkChangeRole(e.target.value)} className={filterSelect}>
                    <option value="">Change role…</option>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <button onClick={() => setStatusFor([...selected], 'Online')} className="font-semibold text-emerald-600 hover:underline">Activate</button>
                  <button onClick={() => setStatusFor([...selected], 'Offline')} className="font-semibold text-amber-600 hover:underline">Deactivate</button>
                  <button onClick={() => askRemove([...selected])} className="font-semibold text-rose-600 hover:underline">Remove</button>
                  <button onClick={() => setSelected(new Set())} className="font-semibold text-slate-500 hover:underline">Clear selection</button>
                </div>
              </div>
            )}

            {rows.length === 0 ? (
              <EmptyState title="No members match these filters"
                action={<button onClick={resetFilters} className="text-sm font-semibold text-[#00A884] hover:underline">Clear filters</button>} />
            ) : (
              <>
                {/* Mobile cards */}
                <ul className="space-y-2 md:hidden">
                  {rows.map((m) => (
                    <li key={m.id} className="flex items-start gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800">
                      <input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)} aria-label={`Select ${m.name}`} className="mt-1 h-4 w-4 rounded accent-[#00A884]" />
                      <Avatar name={m.name} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{m.name}</p>
                        <p className="truncate text-xs text-slate-500">{m.email}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <RoleBadge role={m.role} />
                          <StatusDot status={m.status} />
                          <span className="text-[11px] text-slate-400">{m.team} • {m.lastActive}</span>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-col"><RowActions m={m} /></div>
                    </li>
                  ))}
                </ul>

                {/* Desktop table */}
                <div className="hidden overflow-x-auto md:block">
                  <table className="w-full text-left text-xs">
                    <thead className="border-y border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/50">
                      <tr>
                        <th className="w-8 px-3 py-2.5"><input type="checkbox" checked={allOnPageSelected} onChange={toggleAll} aria-label="Select all" className="h-4 w-4 rounded accent-[#00A884]" /></th>
                        <SortTh label="Name" k="name" sort={sort} setSort={setSort} />
                        <SortTh label="Email" k="email" sort={sort} setSort={setSort} className="hidden xl:table-cell" />
                        <SortTh label="Role" k="role" sort={sort} setSort={setSort} />
                        <SortTh label="Team" k="team" sort={sort} setSort={setSort} className="hidden xl:table-cell" />
                        <SortTh label="Status" k="status" sort={sort} setSort={setSort} />
                        <th className="hidden px-3 py-2.5 font-semibold lg:table-cell">Last active</th>
                        <th className="px-3 py-2.5 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {rows.map((m) => (
                        <tr key={m.id} className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="px-3 py-3"><input type="checkbox" checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)} aria-label={`Select ${m.name}`} className="h-4 w-4 rounded accent-[#00A884]" /></td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <Avatar name={m.name} size="h-7 w-7 text-[11px]" />
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-900 dark:text-white">{m.name}</p>
                                <p className="truncate text-[11px] text-slate-500 xl:hidden">{m.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="hidden px-3 py-3 text-slate-500 xl:table-cell">{m.email}</td>
                          <td className="px-3 py-3"><RoleBadge role={m.role} /></td>
                          <td className="hidden px-3 py-3 text-slate-600 dark:text-slate-300 xl:table-cell">{m.team}</td>
                          <td className="px-3 py-3"><StatusDot status={m.status} /></td>
                          <td className="hidden px-3 py-3 text-[11px] text-slate-400 lg:table-cell">{m.lastActive}</td>
                          <td className="px-3 py-3"><div className="flex justify-end gap-0.5"><RowActions m={m} small /></div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {pagination}
          </section>

          {/* Drawer: side panel on desktop, bottom sheet on mobile */}
          {drawer.open && (
            <>
              <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={closeDrawer} aria-hidden="true" />
              <aside role="dialog" aria-label={isEdit ? 'Edit team member' : 'Add team member'}
                className={`${card} fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-b-none p-4 shadow-2xl lg:static lg:z-auto lg:col-span-4 lg:max-h-none lg:overflow-visible lg:rounded-2xl lg:shadow-lg`}>
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 dark:bg-slate-700 lg:hidden" />
                {drawerContent}
              </aside>
            </>
          )}
        </div>
      )}

      {/* ============================ ROLES ============================ */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
            {ROLES.map((r) => (
              <div key={r} className={`${card} p-4`}>
                <div className="mb-2 flex items-center justify-between">
                  <RoleBadge role={r} />
                  {r === 'Admin' && <Lock className="h-3.5 w-3.5 text-slate-400" aria-label="Locked" />}
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{roleCount(r)}</p>
                <p className="text-[11px] text-slate-400">member{roleCount(r) !== 1 ? 's' : ''} • {permCount(r)}/{permissions.length} features</p>
                <button onClick={() => { resetFilters(); setRoleFilter(r); setActiveTab('members') }}
                  className="mt-2 text-[11px] font-semibold text-[#00A884] hover:underline">View members</button>
              </div>
            ))}
          </div>

          <section className={`${card} p-3 sm:p-4`}>
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={featureSearch} onChange={(e) => setFeatureSearch(e.target.value)} placeholder="Search features…" className={`${input} pl-9`} aria-label="Search features" />
              </div>
              <button onClick={resetPermissions} className={btnGhost}><RotateCcw className="h-4 w-4" /> Reset to defaults</button>
            </div>
            <p className="mb-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Lock className="h-3 w-3" /> Admin always has full access and can't be changed. Changes save automatically.
            </p>

            <div className="overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full min-w-[560px] text-left text-xs">
                <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800">
                  <tr>
                    <th className="p-3 font-semibold">Feature</th>
                    {ROLES.map((r) => (
                      <th key={r} className="p-3 text-center font-semibold">
                        <div>{r}</div>
                        {r !== 'Admin' && (
                          <div className="mt-1 flex justify-center gap-1 text-[10px] font-medium">
                            <button onClick={() => setAllForRole(r, true)} className="text-[#00A884] hover:underline">All</button>
                            <span>/</span>
                            <button onClick={() => setAllForRole(r, false)} className="text-rose-600 hover:underline">None</button>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {visibleFeatures.length === 0 && (
                    <tr><td colSpan={ROLES.length + 1} className="p-6 text-center text-slate-400">No features match “{featureSearch}”.</td></tr>
                  )}
                  {visibleFeatures.map((p) => (
                    <tr key={p.feature} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-medium text-slate-800 dark:text-slate-200">{p.feature}</td>
                      {ROLES.map((r) => (
                        <td key={r} className="p-3 text-center">
                          <input type="checkbox" checked={r === 'Admin' ? true : !!p[permKey(r)]} disabled={r === 'Admin'}
                            onChange={() => togglePermission(p.feature, r)} aria-label={`${p.feature} – ${r}`}
                            className="h-4 w-4 rounded accent-[#00A884] disabled:opacity-60" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* ============================ LOGS ============================ */}
      {activeTab === 'logs' && (
        <section className={`${card} p-3 sm:p-4`}>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={logSearch} onChange={(e) => { setLogSearch(e.target.value); setLogLimit(15) }} placeholder="Search activity…" className={`${input} pl-9`} aria-label="Search activity logs" />
            </div>
            <div className="flex gap-2">
              <button onClick={exportLogs} disabled={!visibleLogs.length} className={`${btnGhost} px-3 py-2 text-xs`}><Download className="h-3.5 w-3.5" /> Export</button>
              <button onClick={clearLogs} disabled={!logs.length} className={`${btnGhost} px-3 py-2 text-xs text-rose-600`}><Trash2 className="h-3.5 w-3.5" /> Clear</button>
            </div>
          </div>

          <div className="mb-4 flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
            {LOG_TYPES.map((t) => (
              <button key={t.id} onClick={() => { setLogType(t.id); setLogLimit(15) }}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                  logType === t.id ? 'bg-[#00A884] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}>
                {t.label}
              </button>
            ))}
          </div>

          {visibleLogs.length === 0 ? (
            <EmptyState icon={History} title="No activity to show" />
          ) : (
            <>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {visibleLogs.slice(0, logLimit).map((l) => {
                  const Icon = LOG_ICON[l.type] || Info
                  return (
                    <li key={l.id} className="flex items-start gap-3 py-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800"><Icon className="h-4 w-4" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-800 dark:text-slate-200">{l.text}</p>
                        <p className="text-[11px] text-slate-400" title={fullDate(l.ts)}>You • {timeAgo(l.ts)}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
              {visibleLogs.length > logLimit && (
                <div className="pt-3 text-center">
                  <button onClick={() => setLogLimit((n) => n + 15)} className={btnGhost}>Load more ({visibleLogs.length - logLimit} left)</button>
                </div>
              )}
            </>
          )}
        </section>
      )}

      {/* ============================ INVITES ============================ */}
      {activeTab === 'invites' && (
        <section className={`${card} p-3 sm:p-4`}>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none]">
              {['All', 'Pending', 'Accepted', 'Expired', 'Revoked'].map((f) => (
                <button key={f} onClick={() => setInviteFilter(f)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition ${
                    inviteFilter === f ? 'bg-[#00A884] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}>
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => openAdd()} className={`${btnPrimary} px-3 py-2 text-xs`}><Plus className="h-3.5 w-3.5" /> New invite</button>
              <button onClick={clearInviteHistory} className={`${btnGhost} px-3 py-2 text-xs`}><Trash2 className="h-3.5 w-3.5" /> Clear history</button>
            </div>
          </div>

          {visibleInvites.length === 0 ? (
            <EmptyState icon={Mail} title="No invitations here"
              action={<button onClick={() => openAdd()} className="text-sm font-semibold text-[#00A884] hover:underline">Invite someone</button>} />
          ) : (
            <ul className="space-y-2">
              {visibleInvites.map((i) => {
                const st = inviteStatus(i)
                const canAct = st === 'Pending' || st === 'Expired'
                return (
                  <li key={i.id} className="flex flex-col gap-3 rounded-xl border border-slate-100 p-3 dark:border-slate-800 md:flex-row md:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <Avatar name={i.name} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{i.name}</p>
                        <p className="truncate text-xs text-slate-500">{i.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <RoleBadge role={i.role} />
                      <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${INVITE_STYLE[st]}`}>{st}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400" title={fullDate(i.sentAt)}>
                        <Clock className="h-3 w-3" /> {timeAgo(i.sentAt)}{i.resent > 0 && ` • resent ${i.resent}×`}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1">
                      {canAct && (
                        <>
                          <button onClick={() => acceptInvite(i)} className={`${btnGhost} px-2.5 py-1.5 text-xs`} title="Simulate the user accepting"><UserCheck className="h-3.5 w-3.5" /> Accept</button>
                          <button onClick={() => resendInvite(i)} className={`${btnGhost} px-2.5 py-1.5 text-xs`}><Send className="h-3.5 w-3.5" /> Resend</button>
                          <button onClick={() => copyInviteLink(i)} className={`${iconBtn} hover:text-slate-600`} aria-label="Copy invite link" title="Copy link"><Copy className="h-4 w-4" /></button>
                          {st === 'Pending' && (
                            <button onClick={() => revokeInvite(i)} className={`${iconBtn} hover:text-rose-600`} aria-label="Revoke invitation" title="Revoke"><Ban className="h-4 w-4" /></button>
                          )}
                        </>
                      )}
                      {!canAct && (
                        <button onClick={() => setInvites((p) => p.filter((x) => x.id !== i.id))} className={`${iconBtn} hover:text-rose-600`} aria-label="Delete record" title="Delete record"><Trash2 className="h-4 w-4" /></button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )}

      {/* ============================ MODALS ============================ */}
      {templatesOpen && (
        <Modal title="Role templates" onClose={() => setTemplatesOpen(false)} wide>
          <p className="mb-3 text-sm text-slate-500">Pick a template to start a new invitation with the role and team pre-filled.</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {ROLE_TEMPLATES.map((t) => (
              <button key={t.name}
                onClick={() => { setTemplatesOpen(false); openAdd({ role: t.role, team: t.team }) }}
                className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-[#00A884] hover:bg-[#00A884]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A884] dark:border-slate-700">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</span>
                  <RoleBadge role={t.role} />
                </div>
                <p className="text-xs text-slate-500">{t.desc}</p>
                <p className="mt-1 text-[11px] text-slate-400">Team: {t.team} • {permCount(t.role)} features</p>
              </button>
            ))}
          </div>
        </Modal>
      )}

      {confirm && (
        <Modal title={confirm.title} onClose={() => setConfirm(null)}>
          <div className="flex items-start gap-3">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${confirm.danger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">{confirm.message}</p>
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <button onClick={() => setConfirm(null)} className={btnGhost}>Cancel</button>
            <button onClick={() => { confirm.onConfirm(); setConfirm(null) }}
              className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition focus:outline-none focus-visible:ring-2 ${
                confirm.danger ? 'bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500' : 'bg-[#00A884] hover:bg-[#008f6f] focus-visible:ring-[#00A884]'}`}>
              {confirm.confirmLabel || 'Confirm'}
            </button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {feedback && (
        <div role="status" aria-live="polite"
          className={`fixed bottom-4 left-1/2 z-[80] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-2 rounded-xl border p-3 text-sm shadow-lg ${
            feedback.type === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'}`}>
          {feedback.type === 'error' ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />}
          <span className="min-w-0 flex-1">{feedback.msg}</span>
          {feedback.action && (
            <button onClick={feedback.action.fn} className="shrink-0 font-bold underline">{feedback.action.label}</button>
          )}
          <button onClick={() => setFeedback(null)} aria-label="Dismiss" className="shrink-0 opacity-60 hover:opacity-100"><X className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  )
}