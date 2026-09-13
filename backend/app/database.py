from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.config import settings


def _normalize_database_url(url: str) -> str:
    # Neon / Heroku sometimes give postgres:// — SQLAlchemy wants postgresql://
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg://", 1)
    if url.startswith("postgresql://") and "+psycopg" not in url:
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


DATABASE_URL = _normalize_database_url(settings.database_url)

connect_args: dict = {}
engine_kwargs: dict = {"pool_pre_ping": True}

if settings.is_sqlite:
    connect_args = {"check_same_thread": False}
else:
    # Cloud Postgres (Neon/Supabase): small pool is enough for free tiers
    engine_kwargs.update(
        {
            "pool_size": 5,
            "max_overflow": 5,
            "pool_recycle": 300,
        }
    )

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def database_info() -> dict:
    dialect = engine.dialect.name
    safe_url = DATABASE_URL
    if "@" in safe_url:
        # hide credentials in health/debug output
        prefix, rest = safe_url.split("://", 1)
        safe_url = f"{prefix}://***@{rest.split('@', 1)[-1]}"
    return {"dialect": dialect, "url": safe_url}
