'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Button from '@/components/Button';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Pagination from '@/components/Pagination';
import { api } from '../lib/api';
import { useDebounce } from '../lib/hooks';
import { Status } from '../lib/types';

const ITEMS_PER_PAGE = 10;

export default function IncidentsPage() {
  const router = useRouter();
  
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const [selectedStatus, setSelectedStatus] = useState<Status | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const filters: any = {
        _and: {},
        _or: {},
        _fuzzy: {}
      };

      if (selectedStatus) {
        filters._and.status = [selectedStatus];
      }

      if (debouncedSearch) {
        filters._fuzzy.title = debouncedSearch;
      }

      const response = await api.listIncidents({
        filters,
        pagination: {
          page: currentPage,
          page_size: ITEMS_PER_PAGE
        },
        sorting: {
          createdAt: 'desc'
        }
      });

      setIncidents(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Failed to fetch incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [currentPage, selectedStatus, debouncedSearch]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Header 
        title="Incident Tracker" 
        action={
          <Button onClick={() => router.push('/incidents/new')}>
            New Incident
          </Button>
        }
      />
      
      <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-zinc-200">
            <div className="flex gap-4 items-end">
              <div className="w-48">
                <Select
                  label="Status"
                  value={selectedStatus}
                  onChange={(val) => { setSelectedStatus(val as Status | ''); handleFilterChange(); }}
                  options={[
                    { value: '', label: 'All' },
                    { value: 'Open', label: 'Open' },
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Resolved', label: 'Resolved' },
                    { value: 'Closed', label: 'Closed' },
                  ]}
                />
              </div>
              
              <div className="flex-1">
                <Input
                  value={searchQuery}
                  onChange={(val) => { setSearchQuery(val); handleFilterChange(); }}
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">Service</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">Severity</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">Created At</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-zinc-700">Owner</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                      Loading incidents...
                    </td>
                  </tr>
                ) : incidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-zinc-500">
                      No incidents found
                    </td>
                  </tr>
                ) : (
                  incidents.map((incident) => (
                    <tr 
                      key={incident.id}
                      onClick={() => router.push(`/incidents/${incident.id}`)}
                      className="border-b border-zinc-200 hover:bg-zinc-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm text-zinc-900">{incident.title}</td>
                      <td className="px-6 py-4 text-sm text-zinc-700">{incident.service}</td>
                      <td className="px-6 py-4 text-sm text-zinc-700">{incident.severity}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          incident.status === 'Open' ? 'bg-red-100 text-red-800' :
                          incident.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                          incident.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                          'bg-zinc-100 text-zinc-800'
                        }`}>
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-700">{formatDate(incident.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-zinc-700">{incident.owner || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && incidents.length > 0 && (
            <div className="p-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
