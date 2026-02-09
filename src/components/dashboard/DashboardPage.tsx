import { useEffect } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { useDashboardStore } from '../../stores/dashboardStore';
import { OUTCOME_SEVERITY_LABELS, INJURY_TYPE_LABELS } from '../../lib/constants';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['#dc3545', '#ff6b00', '#ffc107', '#28a745', '#0d6efd', '#6f42c1'];

export function DashboardPage() {
  const { activeEstablishment } = useSettingsStore();
  const {
    summary, byMonth, bySeverity, byLocation, byType,
    correctiveActionSummary, selectedYear, setYear, loadDashboard, loading,
  } = useDashboardStore();

  useEffect(() => {
    if (activeEstablishment) {
      loadDashboard(activeEstablishment.id, selectedYear);
    }
  }, [activeEstablishment, selectedYear, loadDashboard]);

  if (!activeEstablishment) return null;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Safety Dashboard</h1>
        <select value={selectedYear} onChange={e => setYear(Number(e.target.value))}
          className="border rounded px-3 py-1.5 text-sm">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading dashboard...</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <SummaryCard label="Total Incidents" value={summary?.total_incidents ?? 0} />
            <SummaryCard label="Open" value={summary?.open_incidents ?? 0} color="text-safety-orange" />
            <SummaryCard label="Recordable" value={summary?.total_recordable ?? 0} color="text-safety-red" />
            <SummaryCard label="Days Since Last" value={summary?.days_since_last_incident ?? 'N/A'} color="text-safety-green" />
            <SummaryCard label="TRIR" value={summary?.trir != null ? summary.trir.toFixed(2) : 'N/A'} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Incidents by Month */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Incidents by Month</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={byMonth}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#ff6b00" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Incidents by Severity */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Incidents by Severity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={bySeverity.map(s => ({
                  ...s, label: OUTCOME_SEVERITY_LABELS[s.severity] ?? s.severity,
                }))}>
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ff6b00" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Incidents by Location */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Incidents by Location</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={byLocation} layout="vertical">
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="location_name" type="category" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0d6efd" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Injury Types */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Injury / Illness Types</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={byType.map(t => ({
                      name: INJURY_TYPE_LABELS[t.injury_type] ?? t.injury_type,
                      value: t.count,
                    }))}
                    cx="50%" cy="50%" outerRadius={80}
                    dataKey="value" label
                  >
                    {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Corrective Action Summary */}
          {correctiveActionSummary && (
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-3">Corrective Actions</h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-safety-orange">{correctiveActionSummary.open}</p>
                  <p className="text-sm text-gray-500">Open</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-safety-blue">{correctiveActionSummary.in_progress}</p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-safety-green">{correctiveActionSummary.completed}</p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-safety-red">{correctiveActionSummary.overdue}</p>
                  <p className="text-sm text-gray-500">Overdue</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color ?? 'text-gray-900'}`}>{value}</p>
    </div>
  );
}
