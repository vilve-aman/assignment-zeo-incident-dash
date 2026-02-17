import math
from typing import Optional, Dict

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, model_validator
from sqlalchemy.orm import Session

from app.db.client import get_db_session
from app.schemas import IncidentCreate, IncidentUpdate, IncidentResponse, IncidentListResponse
from app.db.repositories import BaseAlchemyRepository
from app.db.models.incident import Incident

router = APIRouter()


@router.post("", response_model=IncidentResponse, status_code=201)
def create_incident(incident_in: IncidentCreate, db: Session = Depends(get_db_session)):
    repository = BaseAlchemyRepository(db)
    incident = Incident(**incident_in.model_dump())
    return repository.create(incident)


class IncidentListRequest(BaseModel):
    filters: Optional[Dict] = {}
    pagination: Optional[Dict] = {"page": 1, "page_size": 10}
    sorting: Optional[Dict] = {"createdAt": "desc"}

    # @classmethod
    @model_validator(mode="before")
    def set_defaults(cls, data):
        if "pagination" not in data:
            data["pagination"] = {"page": 1, "page_size": 10}
        if "sorting" not in data:
            data["sorting"] = {"createdAt": "desc"}
        if "filters" not in data:
            data["filters"] = {}
        return data


@router.post("/list", response_model=IncidentListResponse)
def list_incidents(
    request: IncidentListRequest,
    db: Session = Depends(get_db_session),
):
    """
    query: {
        "filters": {
            "_and": {},
            "_or": {},
            "_fuzzy": {}
        },
        "pagination": {
            "page": 1,
            "page_size": 10
        },
        "sorting": {
            "createdAt": "desc"
        }
    }
    """
    repository = BaseAlchemyRepository(db)
    
    query = repository.get_query(
        model=Incident,
        query_conf=request.filters,
        sort_conf=request.sorting,
        page_conf=request.pagination
    )
    
    query_without_pagination = repository.get_query(
        model=Incident,
        query_conf=request.filters,
        sort_conf={},
        page_conf={}
    )
    
    total = repository.count(query_without_pagination)
    incidents = repository.get_all(query)
    
    page = request.pagination.get("page", 1)
    page_size = request.pagination.get("page_size", 10)
    total_pages = math.ceil(total / page_size) if total > 0 else 1
    
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "items": incidents
    }


@router.get("/{incident_id}", response_model=IncidentResponse)
def get_incident(incident_id: int, db: Session = Depends(get_db_session)):
    repository = BaseAlchemyRepository(db)
    db_incident = repository.get_by_id(Incident, incident_id)
    
    if db_incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    return db_incident


@router.patch("/{incident_id}", response_model=IncidentResponse)
def update_incident(incident_id: int, incident_update: IncidentUpdate, db: Session = Depends(get_db_session)):
    repository = BaseAlchemyRepository(db)
    update_data = incident_update.model_dump(exclude_unset=True)
    db_incident = repository.update(Incident, incident_id, update_data)
    
    if db_incident is None:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    return db_incident
