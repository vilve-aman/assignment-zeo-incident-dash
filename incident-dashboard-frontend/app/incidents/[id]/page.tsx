'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Textarea from '@/components/Textarea';
import { api } from '../../lib/api';
import { Severity, Status } from '../../lib/types';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function IncidentDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  
  const [incident, setIncident] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [severity, setSeverity] = useState<Severity>('SEV1');
  const [status, setStatus] = useState<Status>('Open');
  const [owner, setOwner] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const data = await api.getIncident(id);
        setIncident(data);
        setSeverity(data.severity);
        setStatus(data.status);
        setOwner(data.owner || '');
        setSummary(data.summary || '');
      } catch (error) {
        console.error('Failed to fetch incident:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncident();
  }, [id]);

  const handleSave = async () => {
    setSubmitting(true);
    
    try {
      await api.updateIncident(id, {
        severity,
        status,
        owner: owner || undefined,
        summary: summary || undefined,
      });
      
      alert('Changes saved successfully!');
      router.push('/incidents');
    } catch (error) {
      console.error('Failed to update incident:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/incidents');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Header title="Incident Tracker" />
        <div className="p-6 text-center">
          <p className="text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Header title="Incident Tracker" />
        <div className="p-6 text-center">
          <p className="text-zinc-600">Incident not found</p>
          <Button onClick={() => router.push('/incidents')} variant="secondary">
            Back to List
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header title="Incident Tracker" />
      
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-6">{incident.title}</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-2">
                Service
              </label>
              <div className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                {incident.service}
              </div>
            </div>

            <Select
              label="Severity"
              value={severity}
              onChange={(val) => setSeverity(val as Severity)}
              options={[
                { value: 'SEV1', label: 'SEV1' },
                { value: 'SEV2', label: 'SEV2' },
                { value: 'SEV3', label: 'SEV3' },
                { value: 'SEV4', label: 'SEV4' },
              ]}
            />

            <Select
              label="Status"
              value={status}
              onChange={(val) => setStatus(val as Status)}
              options={[
                { value: 'Open', label: 'Open' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Resolved', label: 'Resolved' },
                { value: 'Closed', label: 'Closed' },
              ]}
            />

            <Input
              label="Owner"
              value={owner}
              onChange={setOwner}
              placeholder="email@team"
            />

            <div>
              <label className="text-sm font-medium text-zinc-700 block mb-2">
                Created At
              </label>
              <div className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                {formatDate(incident.createdAt)}
              </div>
            </div>

            <Textarea
              label="Summary"
              value={summary}
              onChange={setSummary}
              rows={5}
            />

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button onClick={handleCancel} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
