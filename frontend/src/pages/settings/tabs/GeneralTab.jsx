import { Card, SaveBar, SectionState, SelectInput, TextArea, TextInput, Field, inputClass, ensureOption } from '../ui.jsx'
import { useSettingsSection } from '../useSettingsSection.js'
import { useSettings } from '../SettingsContext.jsx'
import { DATE_FORMATS, INDUSTRIES, LANGUAGES, TIMEZONES } from '../options.js'

function validate(d) {
  const e = {}
  if (!d.businessName?.trim()) e.businessName = 'Business name is required.'
  if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) e.email = 'Enter a valid email address.'
  if (d.website && !/^https?:\/\/\S+\.\S+/i.test(d.website))
    e.website = 'Enter a valid URL starting with http:// or https://'
  if (d.phone && !/^\+?[0-9 ()-]{7,20}$/.test(d.phone)) e.phone = 'Enter a valid phone number.'
  if (!d.timezone) e.timezone = 'Select a time zone.'
  ;(d.businessHours || []).forEach((h, i) => {
    if (!h.active) return
    if (!h.start || !h.end) e[`businessHours.${i}.start`] = 'Set opening and closing time.'
    else if (h.start >= h.end) e[`businessHours.${i}.end`] = 'Closing time must be after opening time.'
  })
  return e
}

export default function GeneralTab({ onDirtyChange }) {
  const { can } = useSettings()
  const s = useSettingsSection('general', onDirtyChange)
  const readOnly = !can.editSettings
  const { draft: d, set, fieldErrors: fe } = s

  return (
    <SectionState status={s.status} error={s.loadError} onRetry={s.reload}>
      {d && (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (!readOnly) s.save(validate, 'General settings saved.')
          }}
        >
          <fieldset disabled={readOnly || s.saving} className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <div className="space-y-4">
              <Card title="Business Profile">
                <TextInput label="Business name" required value={d.businessName} onChange={(v) => set('businessName', v)} error={fe.businessName} />
                <TextArea label="Description" rows={2} value={d.description} onChange={(v) => set('description', v)} error={fe.description} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <TextInput label="Website" placeholder="https://" value={d.website} onChange={(v) => set('website', v)} error={fe.website} />
                  <TextInput label="Email" type="email" value={d.email} onChange={(v) => set('email', v)} error={fe.email} />
                </div>
                <TextInput label="Phone" value={d.phone} onChange={(v) => set('phone', v)} error={fe.phone} />
              </Card>

              <Card title="Company Details">
                <SelectInput
                  label="Industry"
                  value={d.industry}
                  onChange={(v) => set('industry', v)}
                  options={ensureOption(INDUSTRIES, d.industry)}
                  placeholder="Select industry"
                  error={fe.industry}
                />
                <TextArea label="Address" rows={2} value={d.address} onChange={(v) => set('address', v)} error={fe.address} />
                <TextInput
                  label="GST / Tax / Registration ID (optional)"
                  value={d.taxId}
                  onChange={(v) => set('taxId', v)}
                  error={fe.taxId}
                />
              </Card>
            </div>

            <div className="space-y-4">
              <Card title="Time Zone & Language">
                <SelectInput
                  label="Time zone"
                  required
                  value={d.timezone}
                  onChange={(v) => set('timezone', v)}
                  options={ensureOption(TIMEZONES, d.timezone)}
                  placeholder="Select time zone"
                  error={fe.timezone}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SelectInput label="Date format" value={d.dateFormat} onChange={(v) => set('dateFormat', v)} options={ensureOption(DATE_FORMATS, d.dateFormat)} error={fe.dateFormat} />
                  <SelectInput label="Language" value={d.language} onChange={(v) => set('language', v)} options={ensureOption(LANGUAGES, d.language)} error={fe.language} />
                </div>
              </Card>

              <Card title="Business Hours" description="Used for the away message and support availability.">
                <div className="space-y-2">
                  {(d.businessHours || []).map((h, i) => (
                    <div key={h.day} className="space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="flex items-center gap-2 w-32 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!h.active}
                            onChange={(e) => set(`businessHours.${i}.active`, e.target.checked)}
                            className="rounded accent-[#00A884]"
                          />
                          <span className="font-medium text-slate-700 dark:text-slate-300">{h.day}</span>
                        </label>
                        {h.active ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="time"
                              aria-label={`${h.day} opening time`}
                              value={h.start || ''}
                              onChange={(e) => set(`businessHours.${i}.start`, e.target.value)}
                              className={`${inputClass(fe[`businessHours.${i}.start`])} !w-28`}
                            />
                            <span className="text-slate-400">–</span>
                            <input
                              type="time"
                              aria-label={`${h.day} closing time`}
                              value={h.end || ''}
                              onChange={(e) => set(`businessHours.${i}.end`, e.target.value)}
                              className={`${inputClass(fe[`businessHours.${i}.end`])} !w-28`}
                            />
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Closed</span>
                        )}
                      </div>
                      {(fe[`businessHours.${i}.start`] || fe[`businessHours.${i}.end`]) && (
                        <p className="text-[10px] text-red-600" role="alert">
                          {fe[`businessHours.${i}.start`] || fe[`businessHours.${i}.end`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </fieldset>

          <SaveBar dirty={s.dirty} saving={s.saving} readOnly={readOnly} onCancel={s.cancel} onSave={() => s.save(validate, 'General settings saved.')} />
        </form>
      )}
    </SectionState>
  )
}
