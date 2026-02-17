"""
Database session configuration
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.settings import settings

# Create database engine
engine = create_engine(settings.DATABASE_URL)

# session factory
session_maker = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


# dependency to get database session
def get_db_session():
    db_session = session_maker()
    try:
        yield db_session
    finally:
        db_session.close()
