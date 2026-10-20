import { useState } from 'react'
import { Card, Button, Badge, SearchBar, Icon, Input, Drawer, Tabs } from '../../components/index.js'
import { ROLES, USERS } from '../../constants/roles.js'

export default function TeamPage() {
  const [members, setMembers] = useState(USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showDrawer, setShowDrawer] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: ROLES.AGENT })

  const filtered = members.filter(
    (m) =>
      (m.name + m.email).toLowerCase().includes(search.toLowerCase()) &&
      (roleFilter === 'all' || m.role === roleFilter)
  )

  const addMember = () => {
    if (!form.name || !form.email) {
      alert('Name and email are required')
      return
    }
    const newMember = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      role: form.role,
      status: 'active',
      joinedAt: new Date().toISOString().slice(0, 10),
    }
    setMembers((prev) => [...prev, newMember])
    setShowDrawer(false)
    setForm({ name: '', email: '', role: ROLES.AGENT })
  }

  const editMember = (member) => {
    setSelectedMember(member)
    setForm({ name: member.name, email: member.email, role: member.role })
    setShowDrawer(true)
  }

  const updateMember = () => {
    if (!form.name || !form.email) {
      alert('Name and email are required')
      return
    }
    setMembers((prev) => prev.map((m) => (m.id === selectedMember.id ? { ...m, ...form } : m)))
    setShowDrawer(false)
    setSelectedMember(null)
    setForm({ name: '', email: '', role: ROLES.AGENT })
  }

  const removeMember = (id) => {
    if (id === 1) {
      alert('Cannot remove the primary admin')
      return
    }
    if (!confirm('Remove this team member?')) return
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  const inviteMember = () => {
    const email = prompt('Enter email address to invite:')
    if (email) {
      alert(`Invitation sent to ${email}`)
    }
  }

  const totalMembers = members.length
  const activeMembers = members.filter((m) => m.status === 'active').length

  return (
    <div className="page">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Team & Roles</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage team members and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={inviteMember}>
            <Icon name="Mail" size={16} />
            Invite Member
          </Button>
          <Button variant="primary" onClick={() => { setSelectedMember(null); setForm({ name: '', email: '', role: ROLES.AGENT }); setShowDrawer(true) }}>
            <Icon name="Plus" size={16} />
            Add Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalMembers}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Members</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeMembers}</p>
        </Card>
      </div>

      <Tabs
        tabs={[
          { id: 'members', label: 'Members' },
          { id: 'roles', label: 'Roles & Permissions' },
        ]}
        activeTab="members"
        onChange={() => {}}
      />

      <div className="mt-6 flex items-center gap-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search members..." />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Roles</option>
          <option value={ROLES.ADMIN}>Admin</option>
          <option value={ROLES.MANAGER}>Manager</option>
          <option value={ROLES.AGENT}>Agent</option>
          <option value={ROLES.SUPPORT}>Support</option>
        </select>
      </div>

      <Card className="mt-6">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member) => (
                <tr key={member.id}>
                  <td className="font-medium">{member.name}</td>
                  <td>{member.email}</td>
                  <td>
                    <Badge variant={member.role === ROLES.ADMIN ? 'error' : member.role === ROLES.MANAGER ? 'warning' : 'info'}>{member.role}</Badge>
                  </td>
                  <td>
                    <Badge variant="success">Active</Badge>
                  </td>
                  <td>{member.joinedAt}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="icon-btn" onClick={() => editMember(member)} aria-label="Edit">
                        <Icon name="Edit" size={16} />
                      </button>
                      {member.id !== 1 && (
                        <button className="icon-btn text-red-600" onClick={() => removeMember(member.id)} aria-label="Remove">
                          <Icon name="Trash2" size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Drawer
        isOpen={showDrawer}
        onClose={() => { setShowDrawer(false); setSelectedMember(null) }}
        title={selectedMember ? 'Edit Member' : 'Add Member'}
        footer={
          <>
            <Button variant="secondary" onClick={() => { setShowDrawer(false); setSelectedMember(null) }}>
              Cancel
            </Button>
            <Button variant="primary" onClick={selectedMember ? updateMember : addMember}>
              {selectedMember ? 'Update' : 'Add'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value={ROLES.ADMIN}>Admin</option>
              <option value={ROLES.MANAGER}>Manager</option>
              <option value={ROLES.AGENT}>Agent</option>
              <option value={ROLES.SUPPORT}>Support</option>
            </select>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
