# Database configuration and session management
from app.db.client import Base
from app.db.models.incident import Incident

__all__ = ["Base", "Incident"]
