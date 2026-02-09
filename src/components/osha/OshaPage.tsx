import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useSettingsStore } from '../../stores/settingsStore';
import { useToast } from '../../hooks/useToast';
// Constants used for label display in the component
import type { Osha300Row, Osha300ASummary, AnnualStats, UpsertAnnualStats } from '../../lib/types';

type Tab = '300' | '300a' | '301';

export function OshaPage() {
  const { activeEstablishment } = useSettingsStore();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [tab, setTab] = useState<Tab>('300');
  const toast = useToast();

  const [log300, setLog300] = useState<Osha300Row[]>([]);
  const [summary300a, setSummary300a] = useState<Osha300ASummary | null>(null);
  const [annualStats, setAnnualStats] = useState<AnnualStats | null>(null);
  const [statsForm, setStatsForm] = useState<Partial<UpsertAnnualStats>>({});
  const [editingStats, setEditingStats] = useState(false);

  useEffect(() => {
    if (!activeEstablishment) return;
    loadData();
  }, [activeEstablishment, year]);

  const loadData = async () => {
    if (!activeEstablishment) return;
    const [log, summary, stats] = await Promise.all([
      invoke<Osha300Row[]>('get_osha_300_log', { establishmentId: activeEstablishment.id, year }),
      invoke<Osha300ASummary>('get_osha_300a_summary', { establishmentId: activeEstablishment.id, year }),
      invoke<AnnualStats | null>('get_annual_stats', { establishmentId: activeEstablishment.id, year }),
    ]);
    setLog300(log);
    setSummary300a(summary);
    setAnnualStats(stats);
  };

  const handleExport300 = async () => {
    if (!activeEstablishment) return;
    try {
      const path = await invoke<string>('export_osha_300_csv', {
        establishmentId: activeEstablishment.id,
        year,
        establishmentName: activeEstablishment.name,
      });
      toast.success(`Exported to ${path}`);
    } catch (error) {
      toast.error(`Export failed: ${error}`);
    }
  };

  const handleSaveStats = async () => {
    if (!activeEstablishment) return;
    await invoke('upsert_annual_stats', {
      data: {
        establishment_id: activeEstablishment.id,
        year,
        avg_employees: statsForm.avg_employees ?? 0,
        total_hours_worked: statsForm.total_hours_worked ?? 0,
        certifier_name: statsForm.certifier_name,
        certifier_title: statsForm.certifier_title,
        certifier_phone: statsForm.certifier_phone,
        certification_date: statsForm.certification_date,
      },
    });
    setEditingStats(false);
    loadData();
  };

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const boolCell = (v: boolean) => v ? <span className="text-red-600 font-bold">X</span> : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">OSHA Forms</h1>
        <select value={year} onChange={e => setYear(Number(e.target.value))}
          className="border rounded px-3 py-1.5 text-sm">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: '300' as Tab, label: 'OSHA 300 Log' },
          { key: '300a' as Tab, label: 'OSHA 300A Summary' },
          { key: '301' as Tab, label: 'Annual Stats' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              tab === t.key ? 'bg-white shadow text-safety-orange' : 'text-gray-600 hover:text-gray-900'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 300 Log */}
      {tab === '300' && (
        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Log of Work-Related Injuries and Illnesses ({year})</h2>
            <button onClick={handleExport300}
              className="bg-safety-orange text-white px-3 py-1.5 rounded text-sm">
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left">Case #</th>
                  <th className="px-2 py-2 text-left">Employee</th>
                  <th className="px-2 py-2 text-left">Title</th>
                  <th className="px-2 py-2 text-left">Date</th>
                  <th className="px-2 py-2 text-left">Where</th>
                  <th className="px-2 py-2 text-left">Description</th>
                  <th className="px-2 py-2 text-center">Death</th>
                  <th className="px-2 py-2 text-center">Days Away</th>
                  <th className="px-2 py-2 text-center">Transfer</th>
                  <th className="px-2 py-2 text-center">Other</th>
                  <th className="px-2 py-2 text-right"># Away</th>
                  <th className="px-2 py-2 text-right"># Restr</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {log300.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-2 py-2 font-mono">{row.case_number}</td>
                    <td className="px-2 py-2">{row.employee_name}</td>
                    <td className="px-2 py-2">{row.job_title}</td>
                    <td className="px-2 py-2">{row.incident_date}</td>
                    <td className="px-2 py-2 max-w-[100px] truncate">{row.where_occurred}</td>
                    <td className="px-2 py-2 max-w-[150px] truncate">{row.description}</td>
                    <td className="px-2 py-2 text-center">{boolCell(row.outcome_death)}</td>
                    <td className="px-2 py-2 text-center">{boolCell(row.outcome_days_away)}</td>
                    <td className="px-2 py-2 text-center">{boolCell(row.outcome_job_transfer)}</td>
                    <td className="px-2 py-2 text-center">{boolCell(row.outcome_other_recordable)}</td>
                    <td className="px-2 py-2 text-right">{row.days_away_count}</td>
                    <td className="px-2 py-2 text-right">{row.days_restricted_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {log300.length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">No recordable incidents for {year}</p>
            )}
          </div>
        </div>
      )}

      {/* 300A Summary */}
      {tab === '300a' && summary300a && (
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="font-semibold text-lg">Summary of Work-Related Injuries and Illnesses ({year})</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div><span className="text-gray-500">Establishment:</span> {summary300a.establishment_name}</div>
            <div><span className="text-gray-500">Industry:</span> {summary300a.industry_description}</div>
            <div><span className="text-gray-500">NAICS:</span> {summary300a.naics_code}</div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Number of Cases</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatBox label="Deaths" value={summary300a.total_deaths} />
              <StatBox label="Days Away" value={summary300a.total_days_away_cases} />
              <StatBox label="Transfer/Restriction" value={summary300a.total_transfer_restriction_cases} />
              <StatBox label="Other Recordable" value={summary300a.total_other_recordable_cases} />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Number of Days</h3>
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="Total Days Away" value={summary300a.total_days_away} />
              <StatBox label="Total Days Restricted" value={summary300a.total_days_restricted} />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Injury and Illness Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatBox label="Injuries" value={summary300a.total_injuries} />
              <StatBox label="Skin Disorders" value={summary300a.total_skin_disorders} />
              <StatBox label="Respiratory" value={summary300a.total_respiratory} />
              <StatBox label="Poisonings" value={summary300a.total_poisonings} />
              <StatBox label="Hearing Loss" value={summary300a.total_hearing_loss} />
              <StatBox label="Other Illnesses" value={summary300a.total_other_illnesses} />
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Establishment Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Avg Employees:</span> {summary300a.avg_employees ?? 'Not set'}</div>
              <div><span className="text-gray-500">Total Hours Worked:</span> {summary300a.total_hours_worked?.toLocaleString() ?? 'Not set'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Annual Stats */}
      {tab === '301' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Annual Workforce Data ({year})</h2>
            {!editingStats && (
              <button onClick={() => {
                setStatsForm({
                  avg_employees: annualStats?.avg_employees ?? 0,
                  total_hours_worked: annualStats?.total_hours_worked ?? 0,
                  certifier_name: annualStats?.certifier_name ?? '',
                  certifier_title: annualStats?.certifier_title ?? '',
                  certifier_phone: annualStats?.certifier_phone ?? '',
                  certification_date: annualStats?.certification_date ?? '',
                });
                setEditingStats(true);
              }} className="text-sm text-safety-orange hover:underline">
                {annualStats ? 'Edit' : 'Add Data'}
              </button>
            )}
          </div>

          {editingStats ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Average # of Employees</label>
                  <input type="number" value={statsForm.avg_employees ?? 0}
                    onChange={e => setStatsForm(prev => ({ ...prev, avg_employees: Number(e.target.value) }))}
                    className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Hours Worked</label>
                  <input type="number" value={statsForm.total_hours_worked ?? 0}
                    onChange={e => setStatsForm(prev => ({ ...prev, total_hours_worked: Number(e.target.value) }))}
                    className="w-full border rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certifier Name</label>
                  <input type="text" value={statsForm.certifier_name ?? ''}
                    onChange={e => setStatsForm(prev => ({ ...prev, certifier_name: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certifier Title</label>
                  <input type="text" value={statsForm.certifier_title ?? ''}
                    onChange={e => setStatsForm(prev => ({ ...prev, certifier_title: e.target.value }))}
                    className="w-full border rounded px-3 py-2 text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSaveStats} className="bg-safety-orange text-white px-4 py-2 rounded text-sm">Save</button>
                <button onClick={() => setEditingStats(false)} className="border px-4 py-2 rounded text-sm">Cancel</button>
              </div>
            </div>
          ) : annualStats ? (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Avg Employees:</span> {annualStats.avg_employees}</div>
              <div><span className="text-gray-500">Total Hours:</span> {annualStats.total_hours_worked.toLocaleString()}</div>
              <div><span className="text-gray-500">Certifier:</span> {annualStats.certifier_name ?? 'Not set'}</div>
              <div><span className="text-gray-500">Title:</span> {annualStats.certifier_title ?? 'Not set'}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No annual stats entered for {year}. Click &quot;Add Data&quot; to enter workforce data for OSHA 300A calculations.</p>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="border rounded p-3 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}
