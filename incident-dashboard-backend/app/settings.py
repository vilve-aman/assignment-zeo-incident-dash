# Application configuration settings
from pydantic_settings import BaseSettings


class Settings(BaseSettings):

    PROJECT_NAME: str = "Incident Dashboard API"

    # Database
    DATABASE_URL: str = "sqlite:///./incidents.db"

    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]


# Create settings instance
settings = Settings()
