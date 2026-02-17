'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Select from '@/components/Select';
import RadioGroup from '@/components/RadioGroup';
import Textarea from '@/components/Textarea';
import { api } from '../../lib/api';
import { Severity, Status, Service } from '../../lib/types';

export default function CreateIncidentPage() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [service, setService] = useState<Service | ''>('');
  const [severity, setSeverity] = useState<Severity>('SEV1');
  const [status, setStatus] = useState<Status | ''>('');
  const [owner, setOwner] = useState('');
  const [summary, setSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !service || !status) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    try {
      await api.createIncident({
        title,
        service,
        severity,
        status,
        owner: owner || undefined,
        summary: summary || undefined,
      });
      
      alert('Incident created successfully!');
      router.push('/incidents');
    } catch (error) {
      console.error('Failed to create incident:', error);
      alert('Failed to create incident. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/incidents');
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header title="Incident Tracker" />
      
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold text-zinc-900 mb-6">Create New Incident</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Title"
              value={title}
              onChange={setTitle}
              placeholder="Issue Title..."
              required
            />

            <Select
              label="Service"
              value={service}
              onChange={(val) => setService(val as Service)}
              options={[
                { value: 'Auth', label: 'Auth' },
                { value: 'Payments', label: 'Payments' },
                { value: 'Backend', label: 'Backend' },
                { value: 'Frontend', label: 'Frontend' },
                { value: 'Database', label: 'Database' },
              ]}
              placeholder="Select Service"
              required
            />

            <RadioGroup
              label="Severity"
              value={severity}
              onChange={(val) => setSeverity(val as Severity)}
              options={[
                { value: 'SEV1', label: 'SEV1' },
                { value: 'SEV2', label: 'SEV2' },
                { value: 'SEV3', label: 'SEV3' },
                { value: 'SEV4', label: 'SEV4' },
              ]}
              required
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
              placeholder="Select Status"
              required
            />

            <Input
              label="Owner"
              value={owner}
              onChange={setOwner}
              placeholder="Optional"
            />

            <Textarea
              label="Summary"
              value={summary}
              onChange={setSummary}
              placeholder="Describe the incident..."
              rows={5}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Incident'}
              </Button>
              <Button type="button" onClick={handleCancel} variant="secondary">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
