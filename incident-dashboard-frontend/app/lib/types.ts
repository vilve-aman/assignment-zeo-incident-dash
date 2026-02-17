// Core types for the incident tracking system

export type Severity = 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';

export type Status = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export type Service = 'Auth' | 'Payments' | 'Backend' | 'Frontend' | 'Database';

export interface Incident {
  id: string;
  title: string;
  service: Service;
  severity: Severity;
  status: Status;
  createdAt: string;
  owner: string;
  assignedTo?: string;
  occurredAt: string;
  summary: string;
}

export interface IncidentFilters {
  services: Service[];
  status: Status | '';
  search: string;
}
