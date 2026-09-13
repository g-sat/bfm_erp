# BOLDFRAME ERP — Master Reference

> **Use this file when presenting, onboarding, or when you forget how something works.**  
> Last aligned to the Context Level Diagram + Level-1 DFD for BOLDFRAME (BFM).

---

## 1. What is BOLDFRAME?

**BOLDFRAME (BFM)** is a **Managed Creative Services Platform** — described as:

> *The Operating System for Creative Services*

It connects:

| Actor | Who they are | What they do on the platform |
|-------|--------------|------------------------------|
| **Businesses / Clients** | Startups, SMEs, Agencies, Enterprises | Submit briefs, budgets, files; receive deliverables, invoices, reports |
| **Project Managers** | Delivery owners | Plan work, track milestones, QA, coordinate teams |
| **Creative Professionals** | Designers, editors, motion artists, photographers, developers, writers | Share profiles/skills/availability; accept work; deliver assets; get paid |
| **Admin** | Platform operator | Configure system, verify users, oversee projects, finance, disputes |
| **Payment Gateway** | Stripe / Razorpay (simulated in this build) | Process client payments, creator payouts, refunds |

**Important:** This product is **one company / single tenant** (BOLDFRAME itself). It is **not** a multi-company accounting ERP (AR/AP/GL ledger). An older finance-style blueprint existed at `Desktop/ERP`; we deliberately pivoted to match the BFM L1 diagrams.

---

## 2. Source of truth: the diagrams

### 2.1 Context Level Diagram

Central system = **BOLDFRAME**. External entities exchange:

- Clients ↔ project requirements, briefs, files, budget/timeline, payments ↔ updates, deliverables, invoices, analytics  
- PMs ↔ plans, milestones, status, quality reviews ↔ project data, client updates, reports, notifications  
- Creatives ↔ profiles, skills, availability, pricing ↔ assignments, briefs, payments, feedback  
- Admin ↔ config, policies, verification, dispute resolution ↔ analytics, reports, alerts  
- Payment gateway ↔ payment/payout/refund requests ↔ confirmations & transaction status  

### 2.2 Level-1 DFD — seven processes

| # | Process | Purpose (remember this) |
|---|---------|-------------------------|
| **1.0** | User & Role Management | Register/login, roles (Business / Creative / PM / Admin), profiles, verification, onboarding |
| **2.0** | Project Intake & Requirements | Create project, briefs/files/refs, budget & timeline, quotes |
| **3.0** | Talent Matching & Assignment | Match talent, shortlist, human verify, assign creator + PM; accept/decline |
| **4.0** | Communication & Collaboration | In-app messaging, comments, file sharing, notifications (email/SMS/push/in-app) |
| **5.0** | Project Management | Plans, milestones, tasks/deadlines, budget/time, escalations |
| **6.0** | Quality Review & Delivery | QA, revision requests, client approval, final delivery, archive |
| **7.0** | Billing & Payments | Invoices, payments, escrow, creator payouts, refunds |

### 2.3 Data stores (D1–D7)

| Store | Name | What it holds |
|-------|------|----------------|
| **D1** | Users | Credentials, roles, verification, links to business/creator |
| **D2** | Creators | Skills, portfolio, experience, pricing, availability, ratings |
| **D3** | Businesses | Company info, contact, subscription, team size |
| **D4** | Projects | Details, briefs, status, budget, PM, creator, progress |
| **D5** | Files | Project files, references, deliverables (metadata + URL) |
| **D6** | Payments | Invoices, inbound payments, payouts, escrow, gateway refs |
| **D7** | Reviews & Ratings | Feedback on creatives / businesses / PMs |

---

## 3. Tech stack

| Layer | Choice | Notes |
|-------|--------|--------|
| Frontend | **Next.js 16** (App Router) + TypeScript + Tailwind v4 | Lives at **repo root** (`app/`, `package.json`) — not a `frontend/` folder |
| Backend | **FastAPI** + SQLAlchemy + Pydantic | Lives in `backend/` |
| Database | **PostgreSQL on Neon (free cloud)** — or Supabase | Set `DATABASE_URL` in `backend/.env`. Local SQLite only as fallback |
| Auth | JWT (Bearer token) | Stored in browser `localStorage` as `bfm_erp_token` |
| Icons | `lucide-react` | |
| API proxy | Next `rewrites` in `next.config.ts` | Browser calls `/api/*` → `http://127.0.0.1:8000/api/*` |

### Ports (memorize)

- **Web UI:** http://localhost:3000  
- **API:** http://127.0.0.1:8000  
- **Swagger docs:** http://127.0.0.1:8000/docs  

---

## 4. How to run (presentation checklist)

### Backend

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend

```bash
# from repo root: c:\Users\sathw\Desktop\bfm_erp
npm install
npm run dev
```

### Fresh seed (if data looks wrong)

1. Stop the API.  
2. Delete `backend/bfm_erp.db`.  
3. Start API again — tables recreate and `seed_database()` runs once (only if no users exist).

### Health check

- API: `GET /api/health` → `{ "status": "ok", "platform": "BOLDFRAME", ... }`  
- Via Next proxy: `GET http://localhost:3000/api/health`

---

## 5. Demo logins (use in presentations)

| Role | Username | Password | What to show |
|------|----------|----------|--------------|
| **Admin** | `admin` | `admin123` | Full sidebar, users list, payouts release |
| **Project Manager** | `pm` | `pm12345` | Matching, delivery, QA, collaboration |
| **Business / Client** | `client` | `client123` | Their projects, invoices, pay with Stripe/Razorpay sim |
| **Creative** | `creative` | `creative123` | Assignments, project messages, own work |

Login page has quick-fill chips for these four accounts.

---

## 6. Repo map (where things live)

```
bfm_erp/
├── app/                          # Next.js App Router
│   ├── login/page.tsx            # Auth UI
│   ├── page.tsx                  # Redirects → /login
│   ├── layout.tsx                # Root layout + fonts
│   ├── globals.css               # Theme tokens (navy ERP look)
│   └── (erp)/                    # Authenticated shell
│       ├── layout.tsx            # AppShell (sidebar)
│       ├── dashboard/
│       ├── users/
│       ├── businesses/
│       ├── creatives/
│       ├── projects/             # list, new, [id]
│       ├── matching/
│       ├── assignments/
│       ├── collaboration/
│       ├── notifications/
│       ├── delivery/
│       ├── quality/
│       ├── billing/invoices/
│       ├── billing/payments/
│       ├── reviews/
│       └── settings/company/
├── components/
│   ├── app-shell.tsx             # Sidebar + header + logout
│   ├── ui.tsx                    # Button, Card, Table, Kpi, etc.
│   └── master-crud.tsx           # (legacy helper; prefer dedicated pages)
├── lib/
│   ├── api.ts                    # fetch wrapper + JWT helpers
│   ├── types.ts                  # Shared TS types
│   └── nav.ts                    # Sidebar = L1 process menu
├── next.config.ts                # /api rewrite → FastAPI
├── .env.local                    # NEXT_PUBLIC_API_URL
├── backend/
│   ├── requirements.txt
│   ├── bfm_erp.db                # SQLite (gitignored ideally)
│   └── app/
│       ├── main.py               # FastAPI app + lifespan seed
│       ├── config.py
│       ├── database.py
│       ├── auth.py               # password hash + JWT
│       ├── models.py             # SQLAlchemy = D1–D7 + helpers
│       ├── schemas.py            # Pydantic I/O
│       ├── seed.py               # Demo data
│       ├── routers.py            # All HTTP endpoints
│       └── services/docs.py      # Document number sequences
├── README.md                     # Short runbook
└── BOLDFRAME.md                  # THIS FILE — full reference
```

---

## 7. UI ↔ L1 process mapping

Use this table while clicking through a demo:

| Sidebar label | Process | Screens |
|---------------|---------|---------|
| Dashboard | Overview | KPIs: active projects, QA queue, available creatives, revenue, open invoices, escrow payouts |
| Users & Roles | 1.0 | Users (admin), Businesses (D3), Creatives (D2) |
| Project Intake | 2.0 | All Projects, New Intake |
| Talent Matching | 3.0 | Matching Board (shortlist/offer/accept), Assignments |
| Collaboration | 4.0 | Messages by project, Notifications |
| Project Mgmt | 5.0 | Active Work board, Project detail (milestones/tasks/progress) |
| Quality & Delivery | 6.0 | QA Reviews (approve / request revision / client stage) |
| Billing & Payments | 7.0 | Invoices (+ simulated Stripe/Razorpay pay), Payments & Payouts (release escrow) |
| Reviews | D7 | Ratings after delivery |
| Platform → Company | Context | BOLDFRAME profile / tagline |

Project detail (`/projects/[id]`) is the **hub**: brief, milestones, tasks, files (D5), status updates, and chat (4.0).

---

## 8. Project lifecycle (status flow)

Statuses used in code (remember for demos):

```
intake → quoting → matching → assigned → in_progress → qa → client_review → delivered → archived
                                                                    ↘ (revision) → in_progress
```

Also: `cancelled` exists as a terminal path conceptually.

**What moves status:**

- Creating a project → `intake`  
- Shortlisting talent → often moves to `matching`  
- Creative **accepts** assignment → project gets `creator_id`, status `assigned`  
- QA approve (stage `qa`) → `client_review`  
- Client approve (stage `client`) → `delivered`, progress 100%  
- Revision requested → back to `in_progress`  
- Manual status dropdown on project detail (PM/Admin)

---

## 9. Assignment flow (3.0) — demo script

1. Open **Matching Board**.  
2. Pick a project in intake/matching (e.g. GreenCart film).  
3. Pick an available creative → **Shortlist**.  
4. On the assignment row → **Send Offer**.  
5. As creative (or from same admin session) → **Accept** / **Decline**.  
6. On Accept: project is assigned; quoted amount can take offer amount.

Assignment statuses: `shortlisted` → `offered` → `accepted` | `declined`.

---

## 10. Billing flow (7.0) — demo script

1. **Invoices** list shows seeded `INV-*` documents.  
2. Click **Stripe** or **Razorpay** on an unpaid invoice → simulated gateway pay:  
   - Invoice → `paid`  
   - Creates inbound `Payment` with `gateway_ref`  
3. **Payments & Payouts**:  
   - `inbound` = client money in  
   - `payout` + `escrow` = creator money held until QA  
   - **Release Payout** → `completed`  

No real Stripe/Razorpay keys are required in this build — it is intentionally simulated for demos.

---

## 11. API cheat sheet

Base: `http://127.0.0.1:8000`  
Auth header: `Authorization: Bearer <token>`  
Envelope: `{ "result": 1, "message": "OK", "data": ... }`

### Auth
| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/login` | JSON `{ username, password }` → token + user |
| GET | `/api/auth/me` | Current user |

### Core reads
| Method | Path |
|--------|------|
| GET | `/api/health` |
| GET | `/api/company` |
| GET | `/api/dashboard` |
| GET | `/api/users` | Admin only |
| GET/POST | `/api/businesses` |
| GET/POST/PUT | `/api/creators` |
| GET/POST | `/api/projects` |
| GET | `/api/projects/{id}` |
| PATCH | `/api/projects/{id}/status?status=...` |
| POST | `/api/projects/{id}/milestones` |
| POST | `/api/projects/{id}/tasks` |
| GET/POST | `/api/assignments` |
| POST | `/api/assignments/{id}/offer` |
| POST | `/api/assignments/{id}/respond?accept=true\|false` |
| GET | `/api/projects/{id}/messages` |
| POST | `/api/messages` |
| GET | `/api/notifications` |
| POST | `/api/notifications/{id}/read` |
| GET/POST | `/api/files` / project files |
| GET/POST | `/api/quality-reviews` |
| GET/POST | `/api/invoices` |
| POST | `/api/invoices/{id}/pay?gateway=stripe\|razorpay` |
| GET/POST | `/api/payments` |
| POST | `/api/payments/{id}/release` |
| GET/POST | `/api/reviews` |

---

## 12. Seed data snapshot (what you should see)

After a clean seed:

- **Company:** BOLDFRAME — “The Operating System for Creative Services”  
- **Businesses:** NovaStart Labs, PixelHouse Agency, GreenCart Retail  
- **Creatives:** Aisha Khan (design), Dev Patel (video/motion), Maya Fernandes (writing), Arjun Iyer (dev)  
- **Projects (examples):**  
  - `PRJ-1001` NovaStart Brand Refresh — in progress (Aisha)  
  - `PRJ-1002` GreenCart Product Launch Film — matching  
  - `PRJ-1003` PixelHouse Microsite — QA  
  - `PRJ-1004` NovaStart Content Sprint — client review  
- **Finance:** sample invoices (some paid), inbound payments, escrow payout  
- **Comms:** sample messages + notifications  

Document sequences: `PRJ-`, `INV-`, `PAY-`, `BIZ-`, `CR-`.

---

## 13. Roles & data scoping (don’t get confused)

| Role | Sees mostly |
|------|-------------|
| `admin` | Everything; can list `/api/users` |
| `pm` | Projects where they are PM (or unassigned PM) |
| `business` | Projects + invoices for their `business_id` |
| `creative` | Projects + assignments for their `creator_id` |

User record can link:

- `business_id` → client user  
- `creator_id` → creative user  

---

## 14. Design / UX notes (for presenting the UI)

- Brand in sidebar: **BOLDFRAME** / Creative Services OS  
- Theme toggle in header + login (light / dark), preference saved in `localStorage` (`bfm_erp_theme`)
- Brand palette: black / white / red — light surfaces vs dark charcoal surfaces, red accent in both modes
  
- Cards/tables for operational lists (OK here — this is a work app, not a marketing landing page)  
- Login: dark radial background + brand mark `BF`

---

## 15. What is intentionally simplified

Say this honestly if asked in a review:

1. **Payment gateway** = simulated confirmations (no live Stripe/Razorpay keys).  
2. **File storage** = metadata + URL paths, not real S3 upload.  
3. **Notifications** = in-app (and channel labels); no real SMS/email provider wired.  
4. **Single company** — no multi-tenant company switcher.  
5. **Matching score** = demo field / manual shortlist, not ML.  
6. Earlier finance ERP modules (AR/AP/GL/COA) were **removed** after the L1 diagrams clarified the real product.

---

## 16. Common gotchas

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Login works but API 401 on pages | Token missing / expired | Re-login; check `localStorage.bfm_erp_token` |
| `/api/*` 502 from Next | FastAPI not running | Start uvicorn on 8000 |
| Old customers/invoices from finance ERP | Stale SQLite schema | Delete `backend/bfm_erp.db`, restart API |
| Users page error | Not logged in as admin | Use `admin` / `admin123` |
| Port already in use | Previous uvicorn still alive | Kill old process, restart |
| Confused “where is frontend?” | Next is at **repo root**, API in `backend/` | Don’t look for `frontend/` |

---

## 17. Suggested 5-minute presentation flow

1. **Context** — Show Context diagram; say “OS for creative services.”  
2. **Login as Admin** — Dashboard KPIs (live seeded numbers).  
3. **1.0** — Businesses + Creatives masters.  
4. **2.0** — Open a project / create New Intake.  
5. **3.0** — Matching board: shortlist → offer → accept.  
6. **5.0 / 4.0** — Project detail: milestones, tasks, chat.  
7. **6.0** — Submit a QA decision.  
8. **7.0** — Pay an invoice (Stripe button) → release an escrow payout.  
9. **Close** — Point at D1–D7 and the seven processes on the L1 DFD.

---

## 18. Quick vocabulary

| Term | Meaning here |
|------|----------------|
| Intake | New client project request before full staffing |
| Shortlist | Creative candidate attached to a project |
| Offer | Formal assignment proposal to a creative |
| Escrow | Payout held until QA/delivery approval |
| Deliverable | File type for finished creative assets |
| PM | Project Manager role (`pm`) |

---

## 19. Contact / ownership of this codebase

- Workspace: `c:\Users\sathw\Desktop\bfm_erp`  
- Blueprint that inspired early structure: `c:\Users\sathw\Desktop\ERP` (finance ERP — **not** the current domain)  
- Product diagrams: Context + L1 DFD for BOLDFRAME  

---

*End of master reference. When in doubt: open this file, then `/docs` on the API, then click the sidebar in process order 1.0 → 7.0.*
