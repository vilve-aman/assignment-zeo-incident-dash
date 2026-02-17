from typing import Any, Optional
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session


class BaseAlchemyRepository:

    def __init__(self, db_session: Session):
        self.db_session = db_session

    def create(self, obj: Any):
        self.db_session.add(obj)
        self.db_session.commit()
        self.db_session.refresh(obj)
        return obj

    def get_by_id(self, model, record_id: int):
        return self.db_session.query(model).filter(model.id == record_id).first()

    def get_query(self, model, query_conf: dict, sort_conf: dict, page_conf: dict):
        attrs_in_model = [attr for attr in model.__dict__.keys() if not attr.startswith("__")]

        query = self.db_session.query(model)

        and_q = {field_: value_ for field_, value_ in query_conf.get("_and", {}).items() if field_ in attrs_in_model}
        or_q = {field_: value_ for field_, value_ in query_conf.get("_or", {}).items() if field_ in attrs_in_model}
        fuzzy_q = {field_: value_ for field_, value_ in query_conf.get("_fuzzy", {}).items() if field_ in attrs_in_model}

        if and_q:
            query = query.filter(and_(*[getattr(model, field_).in_(value_) for field_, value_ in and_q.items()]))
        
        if or_q:
            query = query.filter(or_(*[getattr(model, field_).in_(value_) for field_, value_ in or_q.items()]))
        
        if fuzzy_q:
            query = query.filter(or_(*[getattr(model, field_).ilike(f"%{value_}%") for field_, value_ in fuzzy_q.items()]))

        if sort_conf:
            sort_col = list(sort_conf.keys())[0] if sort_conf else "id"
            sort_order = sort_conf.get(sort_col, "asc")
            if hasattr(model, sort_col):
                if sort_order == "desc":
                    query = query.order_by(getattr(model, sort_col).desc())
                else:
                    query = query.order_by(getattr(model, sort_col).asc())

        if page_conf:
            page_number = page_conf.get("page", 1)
            page_size = page_conf.get("page_size", 10)
            skip = (page_number - 1) * page_size
            query = query.offset(skip).limit(page_size)

        return query

    def get_all(self, query):
        return query.all()

    def count(self, query):
        return query.count()

    def update(self, model, record_id: int, update_data: dict):
        db_record = self.db_session.query(model).filter(model.id == record_id).first()
        
        if not db_record:
            return None
        
        for field, value in update_data.items():
            setattr(db_record, field, value)
        
        self.db_session.commit()
        self.db_session.refresh(db_record)
        return db_record
