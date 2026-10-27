# Settings module – frontend

Files (all new, nothing existing deleted):

```
src/services/settingsApi.js              API layer (ONLY file with endpoint paths)
src/pages/settings/SettingsPage.jsx      shell: tabs, permissions, toast, unsaved-changes guard
src/pages/settings/SettingsContext.jsx   can / notify / goTo
src/pages/settings/useSettingsSection.js load -> edit -> validate -> save -> reload-from-server
src/pages/settings/ui.jsx                Card, fields, Toggle, SaveBar, Modal, ConfirmDialog, states
src/pages/settings/options.js            static dropdown lists (timezones, languages…)
src/pages/settings/tabs/*.jsx            General, WhatsApp, Messaging, Team, Integrations,
                                         Notifications, Security, Billing, AwayData
```

## Hook it up
1. Point your router's Settings route at `src/pages/settings/SettingsPage.jsx`
   (or overwrite your old SettingsPage.jsx and fix the `./tabs`, `./ui` imports).
2. `.env`:
   - `VITE_API_BASE_URL=/api`   base URL of the backend
   - `VITE_AUTH_TOKEN_KEY=token` localStorage key where your login stores the bearer token
     (if you use cookie/session auth, leave it – requests send `credentials: 'include'`).
3. The Settings page no longer imports `mockBlastData.js`. No mock data is used.

## API contract ASSUMED (verify against your backend, then edit settingsApi.js only)
All under `${VITE_API_BASE_URL}`; responses may be `{ data: ... }` or plain JSON.
Validation errors: HTTP 422 `{ message, errors: { field: ['msg'] } }`.

| Call | Expected response |
|---|---|
| GET `/settings/access` | `{ role, can: { editSettings, manageWhatsApp, manageTeam, manageIntegrations, manageBilling } }` |
| GET/PUT `/settings/general` | `{ businessName, description, website, email, phone, industry, address, taxId, timezone, dateFormat, language, businessHours:[{day,active,start,end}] }` |
| GET/PUT `/settings/messaging` | `{ defaultLanguage, defaultSenderId, defaultTeamId, defaultTemplateId, assignmentStrategy, autoAssign, showMessagePreview, compactView, linkShortening, trackAnalytics, saveSentHistory }` |
| GET `/settings/messaging/options` | `{ senders:[{id,label}], teams:[{id,name}], templates:[{id,name,language,status}] }` |
| GET/PUT `/settings/notifications` | `{ emailConfigured, sound, inApp:{assignment,campaign,automation,system}, email:{enabled,assignment,campaign,automation,system} }` |
| GET/PUT `/settings/defaults` | `{ awayMessage:{enabled,text}, capabilities:{autoDelete}, retention:{messageHistoryMonths, contactDataMonths, autoDeleteLogs:{enabled,months}} }` (months number or `null` = forever) |
| GET `/settings/whatsapp/status` | `{ status: connected|pending|disconnected|error, wabaId, phoneNumber, phoneNumberId, displayName, businessVerification, phoneStatus, messagingTier, qualityRating, connectedAt, errorMessage, webhook:{status,lastEventAt} }` |
| GET `/settings/whatsapp/embedded-signup-config` | `{ appId, configId, graphVersion }` (public IDs only) |
| POST `/settings/whatsapp/connect` | body `{ code, wabaId, phoneNumberId }` – server exchanges the code for tokens |
| POST `/settings/whatsapp/disconnect` | – |
| GET `/settings/team` | `{ currentUserId, members:[{id,name,email,role,status,lastActive}], roles:[{key,label,locked}], permissions:{ features:[{key,label}], roles:{ roleKey:[featureKey] } } }` |
| POST `/settings/team/members`, PATCH/DELETE `/settings/team/members/:id`, PUT `/settings/team/roles/:role` | `{ permissions: [featureKey] }` for the role call |
| GET `/settings/integrations` | `[{ key,name,description,status,error,lastCheckedAt,diagnostics,configFields:[{name,label,type:text|secret|select,required,options}] }]` |
| POST `/settings/integrations/:key/(connect|reconnect|test|disconnect)` | test returns `{ ok, message }` |
| GET `/settings/security/overview` | `{ passwordChangedAt, twoFactor:{supported,enabled}, sessions:[{id,device,ip,location,lastActive,current}], activity:[{id,event,ip,at}] }` |
| POST `/settings/security/password` | `{ current_password, password, password_confirmation }` |
| DELETE `/settings/security/sessions/:id`, POST `/settings/security/sessions/revoke-others` | – |
| POST `/settings/security/two-factor/(setup|confirm|disable)` | setup returns `{ qrImageUrl, manualKey }` |
| GET `/settings/billing/subscription` | `{ plan: Basic|Advance|Prime, status, startDate, expiryDate, renewal:{autoRenew,nextRenewalDate}, usage:[{key,label,used,limit|null}], features:[{label,included}], upgradeEnabled, availablePlans:[{key,name}] }` |
| GET `/settings/billing/payments` | `[{ id, date, description, amount, currency, status }]` (empty array = "No payment records") |
| POST `/settings/billing/upgrade` | `{ plan }` -> optional `{ checkoutUrl, message }` |

Backend MUST: scope everything to the authenticated tenant, authorize every write
(hiding buttons is not security), encrypt Meta tokens/integration secrets, never return them, rate-limit
password/2FA endpoints.

## Behaviour notes
- Every tab loads from the API; after Save it re-GETs, so the UI only shows what the server stored.
- Failed calls show the server message; no success toast without a 2xx.
- Save/Disconnect/Invite buttons are locked while a request is running (no double submit).
- Unsaved edits: Cancel button, confirm dialog when switching tab, browser warning on reload/close.
- Permission flags come from `/settings/access`; if that call fails the page falls back to read-only.
- The old `Advanced` tab was removed (not in the requirements); old `Data & Privacy` became `Away & Data`.
- `auth:expired` event is fired on any 401 – handle redirect-to-login in your app shell.

## Test checklist (run per tab)
1. Open tab -> values come from backend (check Network tab).
2. Edit -> Save -> refresh page -> values persist.
3. Submit invalid data -> inline errors, no success toast.
4. Log in as a limited role -> controls disabled; try the PUT with curl -> backend must return 403.
5. Log in as two different customers -> no cross-tenant data.
6. Resize to mobile (tabs become a dropdown) and tablet.
7. Stop the backend -> every action shows an error, never a success.
8. WhatsApp: use a Meta test app first; confirm status only changes after the backend confirms; send/receive a test message before calling it production-ready.

## Known limitations
- Endpoint paths/shapes above are assumptions until compared with the real backend.
- Not run or screenshot-tested here: I had no access to your running app or API.
- No "reset to defaults" button (needs server-defined defaults).
- WhatsApp Embedded Signup needs a Meta app, Config ID and a server-side code exchange + webhook setup.
