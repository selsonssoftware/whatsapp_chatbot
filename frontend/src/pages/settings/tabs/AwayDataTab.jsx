import { useState } from 'react'
import { Banner, Button, Card, ConfirmDialog, Field, SaveBar, SectionState, TextArea, Toggle, inputClass } from '../ui.jsx'
import { useSettingsSection } from '../useSettingsSection.js'
import { useSettings } from '../SettingsContext.jsx'
import { RETENTION_MONTHS } from '../options.js'

const toSel = (m) => (m === null || m === undefined ? 'forever' : String(m))
const fromSel = (v) => (v === 'forever' ? null : Number(v))

// true when the new value would shorten what is kept (=> data can be deleted)
const shortens = (oldM, newM) => newM !== null && (oldM === null || oldM === undefined || newM < oldM)

function MonthsSelect({ label, value, onChange, error, hint }) {
  return (
    <Field label={label} error={error} hint={hint}>
      <select value={toSel(value)} onChange={(e) => onChange(fromSel(e.target.value))} className={inputClass(error)}>
        {RETENTION_MONTHS.map((m) => (
          <option key={m} value={m}>
            {m} months
          </option>
        ))}
        <option value="forever">Keep indefinitely</option>
      </select>
    </Field>
  )
}

export default function AwayDataTab({ onDirtyChange }) {
  const { can, goTo } = useSettings()
  const s = useSettingsSection('defaults', onDirtyChange)
  const readOnly = !can.editSettings
  const [confirm, setConfirm] = useState(false)
  const d = s.draft
  const fe = s.fieldErrors

  const validate = (x) => {
    const e = {}
    if (x.awayMessage?.enabled) {
      const t = (x.awayMessage.text || '').trim()
      if (!t) e['awayMessage.text'] = 'Enter the away message text.'
      else if (t.length > 1024) e['awayMessage.text'] = 'Away message must be 1024 characters or fewer.'
    }
    return e
  }

  const isDestructive = () => {
    const a = s.saved?.retention || {}
    const b = d.retention || {}
    if (shortens(a.messageHistoryMonths, b.messageHistoryMonths)) return true
    if (shortens(a.contactDataMonths, b.contactDataMonths)) return true
    const ad = a.autoDeleteLogs || {}
    const bd = b.autoDeleteLogs || {}
    if (bd.enabled && (!ad.enabled || (bd.months ?? 0) < (ad.months ?? Infinity))) return true
    return false
  }

  const onSave = async () => {
    const errs = validate(d)
    if (Object.keys(errs).length) return s.save(validate) // shows errors
    if (isDestructive()) return setConfirm(true)
    return s.save(validate, 'Settings saved.')
  }

  const text = d?.awayMessage?.text || ''

  return (
    <SectionState status={s.status} error={s.loadError} onRetry={s.reload}>
      {d && (
        <div className="space-y-4">
          <fieldset disabled={readOnly || s.saving} className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <Card title="Away Message" description="Sent automatically outside your business hours.">
              <Toggle label="Enable away message" checked={d.awayMessage?.enabled} onChange={(v) => s.set('awayMessage.enabled', v)} />
              <TextArea
                label="Message template"
                rows={4}
                value={text}
                disabled={!d.awayMessage?.enabled}
                onChange={(v) => s.set('awayMessage.text', v)}
                error={fe['awayMessage.text']}
                hint={`Use {{customer_name}} to insert the contact's name. ${text.length}/1024`}
              />
              <p className="text-[11px] text-slate-400">
                Business hours are managed in{' '}
                <button type="button" onClick={() => goTo('general')} className="text-[#00A884] font-semibold hover:underline">
                  General
                </button>
                . Default sender, team and assignment rule are managed in{' '}
                <button type="button" onClick={() => goTo('messaging')} className="text-[#00A884] font-semibold hover:underline">
                  Messaging
                </button>
                .
              </p>
            </Card>

            <Card title="Data Retention" description="Controls how long your data is stored.">
              <MonthsSelect
                label="Keep message history for"
                value={d.retention?.messageHistoryMonths}
                onChange={(v) => s.set('retention.messageHistoryMonths', v)}
                error={fe['retention.messageHistoryMonths']}
              />
              <MonthsSelect
                label="Keep contact data for"
                value={d.retention?.contactDataMonths}
                onChange={(v) => s.set('retention.contactDataMonths', v)}
                error={fe['retention.contactDataMonths']}
              />
              {d.capabilities?.autoDelete ? (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <Toggle
                    label="Auto-delete old logs"
                    description="Logs older than the chosen period are permanently deleted and cannot be recovered."
                    checked={d.retention?.autoDeleteLogs?.enabled}
                    onChange={(v) => s.set('retention.autoDeleteLogs.enabled', v)}
                  />
                  {d.retention?.autoDeleteLogs?.enabled && (
                    <MonthsSelect
                      label="Delete logs older than"
                      value={d.retention?.autoDeleteLogs?.months ?? 6}
                      onChange={(v) => s.set('retention.autoDeleteLogs.months', v ?? 6)}
                      error={fe['retention.autoDeleteLogs.months']}
                    />
                  )}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400">Automatic deletion is not available for your account.</p>
              )}
              {!readOnly && (
                <Banner kind="warning">Shortening a retention period can permanently delete existing data. You will be asked to confirm.</Banner>
              )}
            </Card>
          </fieldset>

          <SaveBar dirty={s.dirty} saving={s.saving} readOnly={readOnly} onCancel={s.cancel} onSave={onSave} />

          <ConfirmDialog
            open={confirm}
            danger
            busy={s.saving}
            title="Confirm data deletion policy"
            message="These retention settings may permanently delete messages, contacts or logs that are older than the selected period. This cannot be undone."
            confirmLabel="Save and apply"
            onCancel={() => setConfirm(false)}
            onConfirm={async () => {
              const ok = await s.save(validate, 'Settings saved.')
              if (ok) setConfirm(false)
            }}
          />
        </div>
      )}
    </SectionState>
  )
}
