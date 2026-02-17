# Script to populate database with sample data
from datetime import datetime, timedelta
from app.db.client import session_maker, engine
from app.db import Base
from app.db.models.incident import Incident, SeverityEnum, StatusEnum
import json
# Create tables
Base.metadata.create_all(bind=engine)

# Sample incidents
sample_incidents = json.load(open("scripts/sample_incidents.json"))


def seed_database():
    db = session_maker()

    try:
        # Check if data already exists
        existing_count = db.query(Incident).count()

        if existing_count > 0:
            print(f"Database already has {existing_count} incidents. Skipping seed.")
            return

        # Create incidents
        for idx, incident_data in enumerate(sample_incidents):
            # Set different creation dates for variety
            created_date = datetime.utcnow() - timedelta(days=len(sample_incidents) - idx)

            incident = Incident(**incident_data, createdAt=created_date, updatedAt=created_date)
            db.add(incident)

        db.commit()
        print(f"Successfully seeded {len(sample_incidents)} incidents!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
