import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pencil, Trash2, UserPlus } from 'lucide-react'
import { Button, Card, ConfirmDialog, EmptyState, Modal, SectionState, SelectInput, StatusBadge, TextInput, formatDate } from '../ui.jsx'
import { useSettings } from '../SettingsContext.jsx'
import { settingsApi, ApiError } from '../../../services/settingsApi.js'

export default function TeamTab({ onDirtyChange }) {
  const { can, notify } = useSettings()
  const canManage = !!can.manageTeam
  const [state, setState] = useState({ status: 'loading', data: null, error: null })
  const [matrix, setMatrix] = useState({}) // roleKey -> string[] feature keys
  const [savingMatrix, setSavingMatrix] = useState(false)
  const [invite, setInvite] = useState(null) // {name,email,role} | null
  const [edit, setEdit] = useState(null) // member | null
  const [remove, setRemove] = useState(null)
  const [busy, setBusy] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const mounted = useRef(true)
  const dirtyCb = useRef(onDirtyChange)

  useEffect(() => {
    dirtyCb.current = onDirtyChange
  }, [onDirtyChange])

  const load = useCallback(async () => {
    setState((s) => ({ ...s, status: 'loading', error: null }))
    try {
      const data = await settingsApi.team.list()
      if (!mounted.current) return
      setState({ status: 'ready', data, error: null })
      setMatrix(data?.permissions?.roles || {})
    } catch (e) {
      if (mounted.current) setState({ status: 'error', data: null, error: e.message })
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    load()
    return () => {
      mounted.current = false
      dirtyCb.current?.(false)
    }
  }, [load])

  const serverMatrix = state.data?.permissions?.roles
  const changedRoles = useMemo(
    () =>
      Object.keys(matrix).filter(
        (r) => JSON.stringify([...(matrix[r] || [])].sort()) !== JSON.stringify([...(serverMatrix?.[r] || [])].sort())
      ),
    [matrix, serverMatrix]
  )
  useEffect(() => {
    dirtyCb.current?.(changedRoles.length > 0)
  }, [changedRoles])

  const data = state.data || {}
  const roles = data.roles || []
  const features = data.permissions?.features || []
  const roleOptions = roles.filter((r) => !r.locked).map((r) => ({ value: r.key, label: r.label }))
  const roleLabel = (k) => roles.find((r) => r.key === k)?.label || k

  const togglePerm = (role, feature) =>
    setMatrix((m) => {
      const cur = new Set(m[role] || [])
      if (cur.has(feature)) cur.delete(feature)
      else cur.add(feature)
      return { ...m, [role]: [...cur] }
    })

  const saveMatrix = async () => {
    if (savingMatrix) return
    setSavingMatrix(true)
    try {
      for (const r of changedRoles) {
        // eslint-disable-next-line no-await-in-loop
        await settingsApi.team.updateRole(r, matrix[r] || [])
      }
      await load()
      notify('success', 'Permissions saved.')
    } catch (e) {
      notify('error', e.message || 'Could not save permissions.')
    } finally {
      if (mounted.current) setSavingMatrix(false)
    }
  }

  const run = async (fn, okMsg, onOk) => {
    if (busy) return
    setBusy(true)
    setFormErrors({})
    try {
      await fn()
      await load()
      notify('success', okMsg)
      onOk?.()
    } catch (e) {
      if (e instanceof ApiError && e.errors) {
        const flat = {}
        Object.entries(e.errors).forEach(([k, v]) => {
          flat[k] = Array.isArray(v) ? v[0] : String(v)
        })
        setFormErrors(flat)
      }
      notify('error', e.message || 'Action failed.')
    } finally {
      if (mounted.current) setBusy(false)
    }
  }

  const submitInvite = () => {
    const e = {}
    if (!invite.email || !/^\S+@\S+\.\S+$/.test(invite.email)) e.email = 'Enter a valid email address.'
    if (!invite.role) e.role = 'Select a role.'
    if (Object.keys(e).length) return setFormErrors(e)
    return run(() => settingsApi.team.invite(invite), 'Invitation sent.', () => setInvite(null))
  }

  return (
    <SectionState status={state.status} error={state.error} onRetry={load}>
      <div className="space-y-4">
        <Card
          title="Team Members"
          actions={
            canManage && (
              <Button onClick={() => { setFormErrors({}); setInvite({ name: '', email: '', role: roleOptions[0]?.value || '' }) }}>
                <UserPlus className="w-3.5 h-3.5" /> Invite member
              </Button>
            )
          }
        >
          {!data.members?.length ? (
            <EmptyState title="No team members yet" description={canManage ? 'Invite your first teammate.' : undefined} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="py-2 pr-3">Member</th>
                    <th className="py-2 pr-3">Role</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3 hidden md:table-cell">Last active</th>
                    {canManage && <th className="py-2 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.members.map((m) => {
                    const locked = m.id === data.currentUserId || roles.find((r) => r.key === m.role)?.locked
                    return (
                      <tr key={m.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="py-2 pr-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-100">{m.name || '—'}</div>
                          <div className="text-[11px] text-slate-400">{m.email}</div>
                        </td>
                        <td className="py-2 pr-3">{roleLabel(m.role)}</td>
                        <td className="py-2 pr-3"><StatusBadge status={m.status} /></td>
                        <td className="py-2 pr-3 hidden md:table-cell text-slate-400">{formatDate(m.lastActive)}</td>
                        {canManage && (
                          <td className="py-2">
                            <div className="flex justify-end gap-1.5">
                              <button type="button" disabled={locked} aria-label={`Edit ${m.email}`} onClick={() => { setFormErrors({}); setEdit({ ...m }) }} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40">
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <Button
                                variant="secondary"
                                className="!px-2 !py-1"
                                disabled={locked || busy}
                                onClick={() =>
                                  run(
                                    () => settingsApi.team.update(m.id, { status: m.status === 'active' ? 'inactive' : 'active' }),
                                    m.status === 'active' ? 'Member deactivated.' : 'Member activated.'
                                  )
                                }
                              >
                                {m.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>
                              <button type="button" disabled={locked} aria-label={`Remove ${m.email}`} onClick={() => setRemove(m)} className="p-1.5 rounded-lg border border-red-200 text-red-600 disabled:opacity-40">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card
          title="Role Permissions"
          description="Permissions are enforced by the server; this table only edits them."
          actions={
            canManage && (
              <Button onClick={saveMatrix} busy={savingMatrix} disabled={!changedRoles.length}>
                Save permissions
              </Button>
            )
          }
        >
          {!features.length || !roles.length ? (
            <EmptyState title="No configurable permissions" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] uppercase text-slate-400">
                  <tr>
                    <th className="py-2 pr-3">Feature</th>
                    {roles.map((r) => (
                      <th key={r.key} className="py-2 px-2 text-center">{r.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((f) => (
                    <tr key={f.key} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="py-2 pr-3">{f.label}</td>
                      {roles.map((r) => (
                        <td key={r.key} className="py-2 px-2 text-center">
                          <input
                            type="checkbox"
                            aria-label={`${r.label}: ${f.label}`}
                            className="accent-[#00A884]"
                            checked={r.locked ? true : (matrix[r.key] || []).includes(f.key)}
                            disabled={r.locked || !canManage || savingMatrix}
                            onChange={() => togglePerm(r.key, f.key)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Modal
          open={!!invite}
          title="Invite team member"
          busy={busy}
          onClose={() => setInvite(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setInvite(null)} disabled={busy}>Cancel</Button>
              <Button onClick={submitInvite} busy={busy}>Send invite</Button>
            </>
          }
        >
          {invite && (
            <>
              <TextInput label="Name" value={invite.name} onChange={(v) => setInvite({ ...invite, name: v })} error={formErrors.name} />
              <TextInput label="Email" required type="email" value={invite.email} onChange={(v) => setInvite({ ...invite, email: v })} error={formErrors.email} />
              <SelectInput label="Role" required value={invite.role} onChange={(v) => setInvite({ ...invite, role: v })} options={roleOptions} error={formErrors.role} />
            </>
          )}
        </Modal>

        <Modal
          open={!!edit}
          title="Edit member"
          busy={busy}
          onClose={() => setEdit(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setEdit(null)} disabled={busy}>Cancel</Button>
              <Button busy={busy} onClick={() => run(() => settingsApi.team.update(edit.id, { name: edit.name, role: edit.role }), 'Member updated.', () => setEdit(null))}>
                Save
              </Button>
            </>
          }
        >
          {edit && (
            <>
              <TextInput label="Name" value={edit.name} onChange={(v) => setEdit({ ...edit, name: v })} error={formErrors.name} />
              <TextInput label="Email" value={edit.email} onChange={() => {}} disabled />
              <SelectInput label="Role" value={edit.role} onChange={(v) => setEdit({ ...edit, role: v })} options={roleOptions} error={formErrors.role} />
            </>
          )}
        </Modal>

        <ConfirmDialog
          open={!!remove}
          danger
          busy={busy}
          title="Remove team member?"
          message={`${remove?.email || 'This member'} will lose access immediately.`}
          confirmLabel="Remove"
          onCancel={() => setRemove(null)}
          onConfirm={() => run(() => settingsApi.team.remove(remove.id), 'Member removed.', () => setRemove(null))}
        />
      </div>
    </SectionState>
  )
}
