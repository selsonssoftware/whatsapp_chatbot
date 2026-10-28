# WhatsApp Chatbot SaaS — Console

A production-style operations console for a WhatsApp Business platform: team
inbox, message composition, campaigns, chat flows, automation builder, AI
agent, commerce (catalog, orders, payments) and analytics — all running on
seeded data in the browser.

![React](https://img.shields.io/badge/React-19-61dafb)
![Vite](https://img.shields.io/badge/Vite-8-646cff)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Tests](https://img.shields.io/badge/tests-86%20passing-25c366)

---

## Quick start

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `frontend/dist` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole frontend |
| `npm test` | Vitest unit suite (86 tests) |
| `npm run test:watch` | Vitest in watch mode |
| `npm run test:coverage` | Vitest with V8 coverage |

Open `/login` and pick one of the seeded accounts (Admin, Manager, Agent,
Support) — each role sees a different navigation scope.

---

## Features

| Module | Route | What it does |
| --- | --- | --- |
| Dashboard | `/dashboard` | KPI cards, message volume, delivery/read rates, quick export |
| Team Inbox | `/inbox` | Conversation list, thread view, assignment, notes, reply simulation |
| Compose | `/compose` | Template picker, recipient groups, scheduling, campaign creation |
| Contacts | `/contacts` | Search, filter, create/edit, tags and groups |
| Leads & Pipeline | `/leads` | Kanban pipeline with stages, value tracking, activity log |
| Templates | `/templates` | WhatsApp template CRUD with approval workflow and preview |
| Campaigns | `/campaigns` | Campaign list, status filters, delivery metrics, detail drawer |
| Automation | `/automation` | Visual node-graph builder with validation and a test run |
| Chatbot Builder | `/chatbot` | Conversation flow graph, node configuration, activation checks |
| AI Agent | `/ai-agent` | Agent configuration, knowledge base, local match playground |
| WhatsApp Flows | `/flows` | Multi-screen form builder, preview, submissions |
| Catalog | `/catalog` | Products and categories with stock |
| Orders | `/orders` | Order lifecycle, status transitions, stock rules, order creation |
| Payments | `/payments` | Transactions, retry/refund flows, shareable payment links |
| Reports | `/reports` | Messaging, campaign, commerce and contact analytics with CSV export |
| API Logs | `/api-logs` | Request log table with request/response inspection |
| Schedule Logs | `/schedule-logs` | Scheduled job history |
| Integrations | `/integrations` | Provider configuration with masked secrets |
| Team & Roles | `/team` | Member list, role filter, invitation flow |
| Supporters | `/supporters` | Supporter directory (admin/manager only) with shift, language and status tracking |
| Settings | `/settings` | Workspace, messaging, team, security, billing, privacy and local data |

---

## Architecture

```
frontend/src
├── components/     Reusable UI (Button, Card, Modal, Drawer, Tabs, Icon, …)
│   ├── ErrorBoundary.jsx   Catches render errors and offers recovery
│   └── RouteFallback.jsx   Skeleton shown while a route chunk loads
├── constants/      Roles and navigation manifest (single source of truth)
├── contexts/       Authentication context (localStorage session)
├── data/           Seeded contact and conversation fixtures
├── hooks/          Shared hooks (useAuth, useDialogBehaviour)
├── layouts/        App shell: sidebar, topbar, search, notifications
├── pages/          One module per route
├── routes/         Lazy route table, protected routes, 404 handling
├── services/       Data layer (localStorage-backed stores + pure logic)
└── test/           Shared test helpers
```

### Design system

All styling lives in `frontend/src/index.css` (design tokens, app shell and
component styles); Tailwind covers layout utilities inside JSX. The palette is
taken from the BlastWhatsApp reference export instead of the WhatsApp brand
defaults:

| Token | Value | Role |
| --- | --- | --- |
| `--surface-canvas` | `#ffffff` | content canvas |
| `--surface-panel` | `#f7fbfe` | navigation rail and tinted panels |
| `--surface-border` | `#e6eef5` | hairline borders |
| `--surface-tint` | `#e8fcf1` | active, success and bubble tints |
| `--wa-green` | `#00c667` | brand green: fills, indicators, gradients |
| `--wa-green-dark` | `#007c72` | brand teal: primary actions, links, labels |

The Tailwind `brand` scale in `tailwind.config.js` mirrors the same values.
Contrast was checked against WCAG 2.1 AA: white on `#007c72` is 5.1:1,
`#007c72` on `#def8eb` is 4.5:1, `#111827` body text on white is 15.9:1, and
focus rings use `#007c72` so they clear the 3:1 non-text threshold.

### Routing and resilience

* Every page is a `React.lazy` chunk, so the initial bundle stays small and
  heavy dependencies (charting) load only where they are used.
* `ErrorBoundary` wraps the router: a failing module renders a recovery screen
  instead of a blank page.
* Unknown URLs redirect to `/404`.
* Navigation resets the scroll position and updates `document.title`.

### Data layer

`src/services/*` owns every read/write. Records live in `localStorage` under
`wa_*` keys and are seeded on first use, so a fresh browser is immediately
usable. Pure business rules (workflow validation, order totals, knowledge
matching, form validation) are exported separately from the persistence
helpers, which keeps them unit-testable.

### Accessibility

* Skip-to-content link and a labelled `main` landmark.
* Modals and drawers are real dialogs: `role="dialog"`, `aria-modal`, focus
  moved in on open, Tab cycling trapped inside, Escape closes, focus restored
  on close, and the page behind is scroll-locked.
* Tabs implement the ARIA tablist pattern with arrow-key navigation.
* Visible focus rings, reduced-motion support, labelled icon buttons.

### Performance

| | Before | After |
| --- | --- | --- |
| Initial JS | 937 kB (249 kB gzip) | 299 kB (95 kB gzip) |
| Chart library | in the entry chunk | separate chunk, loaded on demand |

---

## Testing

```bash
cd frontend
npm test
```

The suite covers the service layer where the rules live: order validation and
totals, order status transitions, workflow validation and run simulation, AI
knowledge matching and handoff thresholds, flow/chatbot validation, the
supporter directory rules and the seed-data store. Component tests cover the
error boundary, the modal dialog behaviour (focus handling, Escape, scroll
lock), the tablist keyboard pattern and the supporter page permissions.

---

## Notes

* The app runs in **simulation mode**: nothing is delivered to WhatsApp and no
  request leaves the browser. The UI labels this explicitly wherever it
  matters.
* `VITE_SIMULATION_MODE=true` (see `frontend/.env.example`) keeps the live API
  client disabled. Point `VITE_API_BASE_URL` at a backend and flip the flag
  when one exists.
