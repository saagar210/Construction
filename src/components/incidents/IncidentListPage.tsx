import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore';
import { useIncidentStore } from '../../stores/incidentStore';
import { OUTCOME_SEVERITY_LABELS, INCIDENT_STATUS_LABELS } from '../../lib/constants';
import type { IncidentStatus, OutcomeSeverity } from '../../lib/types';

export function IncidentListPage() {
  const navigate = useNavigate();
  const { activeEstablishment, locations } = useSettingsStore();
  const { incidents, loading, loadIncidents } = useIncidentStore();

  const [statusFilter, setStatusFilter] = useState<IncidentStatus | ''>('');
  const [severityFilter, setSeverityFilter] = useState<OutcomeSeverity | ''>('');
  const [locationFilter, setLocationFilter] = useState<number | ''>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!activeEstablishment) return;
    loadIncidents({
      establishment_id: activeEstablishment.id,
      status: statusFilter || undefined,
      outcome_severity: severityFilter || undefined,
      location_id: locationFilter || undefined,
      search: search || undefined,
    });
  }, [activeEstablishment, statusFilter, severityFilter, locationFilter, search, loadIncidents]);

  const severityBadge = (severity: string) => {
    const colors: Record<string, string> = {
      death: 'bg-red-100 text-red-800',
      days_away: 'bg-orange-100 text-orange-800',
      job_transfer_restriction: 'bg-yellow-100 text-yellow-800',
      other_recordable: 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[severity] ?? 'bg-gray-100'}`}>
        {OUTCOME_SEVERITY_LABELS[severity] ?? severity}
      </span>
    );
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-orange-100 text-orange-800',
      in_review: 'bg-blue-100 text-blue-800',
      closed: 'bg-green-100 text-green-800',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colors[status] ?? 'bg-gray-100'}`}>
        {INCIDENT_STATUS_LABELS[status] ?? status}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Incidents</h1>
        <Link to="/incidents/new"
          className="bg-safety-orange text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600">
          Report Incident
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white rounded-lg shadow p-4">
        <input
          type="text"
          placeholder="Search by name or description..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm flex-1 min-w-[200px]"
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as IncidentStatus | '')}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_review">In Review</option>
          <option value="closed">Closed</option>
        </select>
        <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value as OutcomeSeverity | '')}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">All Severities</option>
          {Object.entries(OUTCOME_SEVERITY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select value={locationFilter} onChange={e => setLocationFilter(e.target.value ? Number(e.target.value) : '')}
          className="border rounded px-3 py-1.5 text-sm">
          <option value="">All Locations</option>
          {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : incidents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No incidents found</p>
          <Link to="/incidents/new" className="text-safety-orange hover:underline text-sm mt-2 inline-block">
            Report your first incident
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Case #</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Employee</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Severity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {incidents.map(inc => (
                <tr key={inc.id}
                  onClick={() => navigate(`/incidents/${inc.id}`)}
                  className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3 font-mono">{inc.case_number ?? '-'}</td>
                  <td className="px-4 py-3">{inc.incident_date}</td>
                  <td className="px-4 py-3">
                    {inc.is_privacy_case ? <span className="italic text-gray-400">Privacy Case</span> : inc.employee_name}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">{inc.description}</td>
                  <td className="px-4 py-3">{severityBadge(inc.outcome_severity)}</td>
                  <td className="px-4 py-3">{statusBadge(inc.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
