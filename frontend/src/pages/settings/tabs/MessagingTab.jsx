import { useCallback, useEffect, useState } from 'react'
import { Banner, Card, SaveBar, SectionState, SelectInput, Toggle, ensureOption } from '../ui.jsx'
import { useSettingsSection } from '../useSettingsSection.js'
import { useSettings } from '../SettingsContext.jsx'
import { settingsApi } from '../../../services/settingsApi.js'
import { ASSIGNMENT_STRATEGIES, MESSAGE_LANGUAGES } from '../options.js'

export default function MessagingTab({ onDirtyChange }) {
  const { can, goTo } = useSettings()
  const s = useSettingsSection('messaging', onDirtyChange)
  const readOnly = !can.editSettings
  const [opts, setOpts] = useState({ status: 'loading', senders: [], teams: [], templates: [], error: null })

  const loadOptions = useCallback(async () => {
    setOpts((o) => ({ ...o, status: 'loading', error: null }))
    try {
      const data = await settingsApi.messagingOptions()
      setOpts({ status: 'ready', senders: data?.senders || [], teams: data?.teams || [], templates: data?.templates || [], error: null })
    } catch (e) {
      setOpts((o) => ({ ...o, status: 'error', error: e.message }))
    }
  }, [])

  useEffect(() => {
    loadOptions()
  }, [loadOptions])

  const d = s.draft
  const fe = s.fieldErrors

  // Only APPROVED templates may be chosen as default
  const approved = opts.templates.filter((t) => String(t.status).toUpperCase() === 'APPROVED')

  const validate = (x) => {
    const e = {}
    if (!x.defaultLanguage) e.defaultLanguage = 'Select a default message language.'
    if (opts.senders.length && !x.defaultSenderId) e.defaultSenderId = 'Select a default sender number.'
    if (x.defaultSenderId && opts.senders.length && !opts.senders.some((o) => String(o.id) === String(x.defaultSenderId)))
      e.defaultSenderId = 'Selected sender is no longer available.'
    if (!ASSIGNMENT_STRATEGIES.some((o) => o.value === x.assignmentStrategy)) e.assignmentStrategy = 'Select an assignment strategy.'
    if (x.autoAssign) {
      if (!x.defaultTeamId) e.defaultTeamId = 'A default team is required when auto-assign is on.'
      if (x.assignmentStrategy === 'manual') e.assignmentStrategy = 'Choose round robin or load balanced for auto-assignment.'
    }
    if (x.defaultTemplateId && !approved.some((t) => String(t.id) === String(x.defaultTemplateId)))
      e.defaultTemplateId = 'Only approved templates can be selected.'
    return e
  }

  return (
    <SectionState status={s.status} error={s.loadError} onRetry={s.reload}>
      {d && (
        <div className="space-y-4">
          {opts.status === 'error' && (
            <Banner kind="error" onRetry={loadOptions}>
              Could not load senders, teams or templates: {opts.error}
            </Banner>
          )}

          <fieldset disabled={readOnly || s.saving} className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <Card title="Defaults" description="Applied to new campaigns and conversations.">
              <SelectInput
                label="Default message language"
                required
                value={d.defaultLanguage}
                onChange={(v) => s.set('defaultLanguage', v)}
                options={ensureOption(MESSAGE_LANGUAGES, d.defaultLanguage)}
                placeholder="Select language"
                error={fe.defaultLanguage}
              />
              <SelectInput
                label="Default sender number"
                value={d.defaultSenderId}
                onChange={(v) => s.set('defaultSenderId', v)}
                options={opts.senders.map((x) => ({ value: x.id, label: x.label }))}
                placeholder={opts.senders.length ? 'Select sender' : 'No sender numbers available'}
                hint={!opts.senders.length && opts.status === 'ready' ? 'Connect WhatsApp Business first.' : undefined}
                error={fe.defaultSenderId}
              />
              {!opts.senders.length && opts.status === 'ready' && (
                <button type="button" onClick={() => goTo('whatsapp')} className="text-[11px] text-[#00A884] font-semibold hover:underline">
                  Go to WhatsApp Business →
                </button>
              )}
              <SelectInput
                label="Default approved template"
                value={d.defaultTemplateId}
                onChange={(v) => s.set('defaultTemplateId', v)}
                options={approved.map((t) => ({ value: t.id, label: `${t.name}${t.language ? ` (${t.language})` : ''}` }))}
                placeholder={approved.length ? 'None' : 'No approved templates'}
                error={fe.defaultTemplateId}
              />
            </Card>

            <Card title="Assignment">
              <Toggle label="Auto-assign new conversations" checked={d.autoAssign} onChange={(v) => s.set('autoAssign', v)} />
              <SelectInput
                label="Default team"
                value={d.defaultTeamId}
                onChange={(v) => s.set('defaultTeamId', v)}
                options={opts.teams.map((t) => ({ value: t.id, label: t.name }))}
                placeholder={opts.teams.length ? 'Select team' : 'No teams available'}
                error={fe.defaultTeamId}
              />
              <SelectInput
                label="Assignment strategy"
                value={d.assignmentStrategy}
                onChange={(v) => s.set('assignmentStrategy', v)}
                options={ASSIGNMENT_STRATEGIES}
                error={fe.assignmentStrategy}
              />
            </Card>

            <Card title="Preferences" className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                <Toggle label="Show message preview" checked={d.showMessagePreview} onChange={(v) => s.set('showMessagePreview', v)} />
                <Toggle label="Compact view" checked={d.compactView} onChange={(v) => s.set('compactView', v)} />
                <Toggle label="Enable link shortening" checked={d.linkShortening} onChange={(v) => s.set('linkShortening', v)} />
                <Toggle label="Track message analytics" checked={d.trackAnalytics} onChange={(v) => s.set('trackAnalytics', v)} />
                <Toggle label="Save sent message history" checked={d.saveSentHistory} onChange={(v) => s.set('saveSentHistory', v)} />
              </div>
            </Card>
          </fieldset>

          <SaveBar dirty={s.dirty} saving={s.saving} readOnly={readOnly} onCancel={s.cancel} onSave={() => s.save(validate, 'Messaging settings saved.')} />
        </div>
      )}
    </SectionState>
  )
}
