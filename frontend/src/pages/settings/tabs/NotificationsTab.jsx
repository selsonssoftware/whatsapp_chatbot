import { Banner, Card, SaveBar, SectionState, Toggle } from '../ui.jsx'
import { useSettingsSection } from '../useSettingsSection.js'
import { useSettings } from '../SettingsContext.jsx'

const CATEGORIES = [
  { key: 'assignment', label: 'Conversation assignments', description: 'When a chat is assigned to you or your team.' },
  { key: 'campaign', label: 'Campaign updates', description: 'Campaign completed, failed or paused.' },
  { key: 'automation', label: 'Automation alerts', description: 'Automation errors and triggers needing attention.' },
  { key: 'system', label: 'System alerts', description: 'WhatsApp connection, billing and security notices.' },
]

export default function NotificationsTab({ onDirtyChange }) {
  const { can } = useSettings()
  const s = useSettingsSection('notifications', onDirtyChange)
  const readOnly = !can.editSettings
  const d = s.draft

  return (
    <SectionState status={s.status} error={s.loadError} onRetry={s.reload}>
      {d && (
        <div className="space-y-4">
          <fieldset disabled={readOnly || s.saving} className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <Card title="In-app notifications">
              {CATEGORIES.map((c) => (
                <Toggle
                  key={c.key}
                  label={c.label}
                  description={c.description}
                  checked={d.inApp?.[c.key]}
                  onChange={(v) => s.set(`inApp.${c.key}`, v)}
                />
              ))}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Toggle label="Play notification sound" checked={d.sound} onChange={(v) => s.set('sound', v)} />
              </div>
            </Card>

            <Card title="Email notifications">
              {!d.emailConfigured && (
                <Banner kind="warning">Email delivery is not configured for your account, so email notifications are unavailable.</Banner>
              )}
              <fieldset disabled={!d.emailConfigured} className="space-y-3">
                <Toggle label="Enable email notifications" checked={d.email?.enabled} onChange={(v) => s.set('email.enabled', v)} />
                {CATEGORIES.map((c) => (
                  <Toggle
                    key={c.key}
                    label={c.label}
                    checked={d.email?.[c.key]}
                    disabled={!d.email?.enabled}
                    onChange={(v) => s.set(`email.${c.key}`, v)}
                  />
                ))}
              </fieldset>
            </Card>
          </fieldset>

          <SaveBar dirty={s.dirty} saving={s.saving} readOnly={readOnly} onCancel={s.cancel} onSave={() => s.save(null, 'Notification preferences saved.')} />
        </div>
      )}
    </SectionState>
  )
}
