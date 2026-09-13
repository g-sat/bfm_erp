from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_DEFAULT_CORS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4000",
    "http://127.0.0.1:4000",
]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "BOLDFRAME ERP API"
    secret_key: str = "bfm-erp-dev-secret-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 12
    # Prefer cloud Postgres via DATABASE_URL (Neon / Supabase).
    # Falls back to local SQLite only if unset/blank.
    database_url: str = "sqlite:///./bfm_erp.db"
    company_code: str = "BFM"
    company_name: str = "BOLDFRAME"
    # Comma-separated env: CORS_ORIGINS=https://app.vercel.app,http://localhost:3000
    cors_origins: list[str] = list(_DEFAULT_CORS)

    @field_validator("database_url", mode="before")
    @classmethod
    def empty_url_falls_back_to_sqlite(cls, value: object) -> object:
        if value is None or (isinstance(value, str) and not value.strip()):
            return "sqlite:///./bfm_erp.db"
        return value

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> object:
        if value is None:
            return list(_DEFAULT_CORS)
        if isinstance(value, str):
            origins = [o.strip() for o in value.split(",") if o.strip()]
            return origins or list(_DEFAULT_CORS)
        return value

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")

    @property
    def is_postgres(self) -> bool:
        return self.database_url.startswith("postgres")


settings = Settings()
