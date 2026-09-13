# BOLDFRAME ERP

**The Operating System for Creative Services** — single-company managed creative services platform.

Built from the Context + L1 DFDs:
1.0 Users & Roles · 2.0 Project Intake · 3.0 Talent Matching · 4.0 Collaboration · 5.0 Project Management · 6.0 Quality & Delivery · 7.0 Billing & Payments

## Stack

- Next.js 16 frontend (repo root) → http://localhost:3000
- FastAPI backend (`backend/`) → http://127.0.0.1:8000
- **Database:** free cloud **PostgreSQL** via Neon (or Supabase). Set `DATABASE_URL` in `backend/.env`. Falls back to local SQLite if unset.

See `backend/CLOUD_DB.md` for Neon setup steps.

## Run

```bash
# API
cd backend
.\.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Web
npm run dev
```

## Demo logins

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Project Manager | pm | pm12345 |
| Business / Client | client | client123 |
| Creative | creative | creative123 |

## Data stores

D1 Users · D2 Creators · D3 Businesses · D4 Projects · D5 Files · D6 Payments · D7 Reviews
