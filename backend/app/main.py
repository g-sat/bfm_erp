from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, SessionLocal, database_info, engine
from app.routers import api, auth_router
from app.seed import seed_database
import app.models  # noqa: F401


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield


app = FastAPI(
    title="BOLDFRAME ERP API",
    description="Managed Creative Services Platform — L1 processes 1.0–7.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(api)


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "platform": "BOLDFRAME",
        "tagline": "The Operating System for Creative Services",
        "database": database_info(),
    }
