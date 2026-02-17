# Pydantic schemas for incident validation
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from app.db.models.incident import SeverityEnum, StatusEnum


# Base schema with common fields
class IncidentBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    service: str = Field(..., min_length=1, max_length=100)
    severity: SeverityEnum
    status: StatusEnum
    owner: Optional[str] = Field(None, max_length=100)
    summary: Optional[str] = None


# Schema for creating new incident
class IncidentCreate(IncidentBase):
    pass


# Schema for updating incident (all fields optional)
class IncidentUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    service: Optional[str] = Field(None, min_length=1, max_length=100)
    severity: Optional[SeverityEnum] = None
    status: Optional[StatusEnum] = None
    owner: Optional[str] = Field(None, max_length=100)
    summary: Optional[str] = None


# Schema for incident response
class IncidentResponse(IncidentBase):
    id: int
    createdAt: datetime
    updatedAt: datetime

    class Config:
        from_attributes = True  # Allows conversion from ORM model


# Schema for paginated list response
class IncidentListResponse(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    items: list[IncidentResponse]
