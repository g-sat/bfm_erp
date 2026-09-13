# Cloud database setup (free Postgres)
#
# 1) Create a free Neon project: https://console.neon.tech
#    - Sign up (GitHub works)
#    - Create project (region closest to you)
#    - Copy the connection string (URI) — includes ?sslmode=require
#
# 2) Put it in backend/.env:
#    DATABASE_URL=postgresql://...@ep-....neon.tech/neondb?sslmode=require
#
# 3) Install deps + start API (tables + seed create automatically):
#    cd backend
#    .\.venv\Scripts\activate
#    pip install -r requirements.txt
#    uvicorn app.main:app --reload --port 8000
#
# Alternative free Postgres: Supabase → Project Settings → Database → URI
# (use the "Transaction" or "Session" pooler URI with sslmode=require)
#
# Health check: GET http://127.0.0.1:8000/api/health
# should show "database": { "dialect": "postgresql", ... }
