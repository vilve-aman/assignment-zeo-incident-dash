# Incident Dashboard

Full stack incident tracking system with FastAPI backend and Next.js frontend.

**Repository**: https://github.com/vilve-aman/assignment-zeo-incident-dash

---

## Setup & Run

### Backend (FastAPI)

```bash
cd incident-dashboard-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m scripts.seed_data
uvicorn app.main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**

### Frontend (Next.js)

```bash
cd incident-dashboard-frontend
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## API Overview

**Base URL**: `http://localhost:8000/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/incidents/list` | List incidents with filters, pagination, sorting |
| GET | `/incidents/{id}` | Get incident by ID |
| POST | `/incidents` | Create new incident |
| PATCH | `/incidents/{id}` | Update incident |

**API Docs**: http://localhost:8000/docs

### Example Request

```json
POST /api/v1/incidents/list
{
  "filters": {
    "_and": {"status": ["Open"]},
    "_fuzzy": {"title": "search term"}
  },
  "pagination": {"page": 1, "page_size": 10},
  "sorting": {"createdAt": "desc"}
}
```

---

## Tech Stack

**Backend**: FastAPI, SQLAlchemy, Pydantic, SQLite  
**Frontend**: Next.js, React, TypeScript, Tailwind CSS

---

## Features

- ✅ Create, read, update incidents
- ✅ Filter by status
- ✅ Search with debouncing
- ✅ Pagination
- ✅ Sorting
- ✅ Clean architecture with repository pattern
