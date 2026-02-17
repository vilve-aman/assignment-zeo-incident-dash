const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface IncidentCreatePayload {
  title: string;
  service: string;
  severity: string;
  status: string;
  owner?: string;
  summary?: string;
}

export interface IncidentUpdatePayload {
  title?: string;
  service?: string;
  severity?: string;
  status?: string;
  owner?: string;
  summary?: string;
}

export interface IncidentListRequest {
  filters?: {
    _and?: Record<string, string[]>;
    _or?: Record<string, string[]>;
    _fuzzy?: Record<string, string>;
  };
  pagination?: {
    page: number;
    page_size: number;
  };
  sorting?: Record<string, 'asc' | 'desc'>;
}

export const api = {
  async listIncidents(request: IncidentListRequest) {
    const response = await fetch(`${API_BASE_URL}/incidents/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch incidents');
    }
    
    return response.json();
  },

  async getIncident(id: string) {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch incident');
    }
    
    return response.json();
  },

  async createIncident(data: IncidentCreatePayload) {
    const response = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create incident');
    }
    
    return response.json();
  },

  async updateIncident(id: string, data: IncidentUpdatePayload) {
    const response = await fetch(`${API_BASE_URL}/incidents/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update incident');
    }
    
    return response.json();
  },
};
