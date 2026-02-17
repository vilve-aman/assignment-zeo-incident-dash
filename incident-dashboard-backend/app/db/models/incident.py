# Incident database model
from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime, Enum
from datetime import datetime
import enum
from app.db.client import Base


# Enum for severity levels
class SeverityEnum(str, enum.Enum):
    SEV1 = "SEV1"
    SEV2 = "SEV2"
    SEV3 = "SEV3"
    SEV4 = "SEV4"


# Enum for status
class StatusEnum(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    MITIGATED = "Mitigated"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


# Incident model
class Incident(Base):
    __tablename__ = "incidents"

    # Primary key
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # Required fields
    title = Column(String, nullable=False, index=True)
    service = Column(String, nullable=False, index=True)
    severity = Column(Enum(SeverityEnum), nullable=False, index=True)
    status = Column(Enum(StatusEnum), nullable=False, index=True)

    # Optional fields
    owner = Column(String, nullable=True)
    summary = Column(String, nullable=True)

    # Timestamps
    createdAt = Column(DateTime, default=datetime.utcnow, nullable=False)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
