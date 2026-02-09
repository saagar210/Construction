import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { useSettingsStore } from '../../stores/settingsStore';
import type { CsvPreview, ColumnMapping, ImportResult } from '../../lib/types';

const MAPPABLE_FIELDS = [
  { key: 'employee_name', label: 'Employee Name *' },
  { key: 'employee_job_title', label: 'Job Title' },
  { key: 'incident_date', label: 'Incident Date *' },
  { key: 'description', label: 'Description' },
  { key: 'where_occurred', label: 'Where Occurred' },
  { key: 'outcome_severity', label: 'Severity' },
  { key: 'days_away_count', label: 'Days Away' },
  { key: 'days_restricted_count', label: 'Days Restricted' },
  { key: 'injury_illness_type', label: 'Injury/Illness Type' },
  { key: 'employee_gender', label: 'Gender' },
] as const;

export function ImportPage() {
  const { activeEstablishment, locations } = useSettingsStore();
  const [filePath, setFilePath] = useState('');
  const [preview, setPreview] = useState<CsvPreview | null>(null);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [locationId, setLocationId] = useState<number | undefined>();
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);

  const handleSelectFile = async () => {
    const selected = await open({
      filters: [{ name: 'CSV', extensions: ['csv'] }],
      multiple: false,
    });
    if (selected) {
      const path = typeof selected === 'string' ? selected : (selected as { path: string }).path;
      setFilePath(path);
      const prev = await invoke<CsvPreview>('preview_csv', { filePath: path });
      setPreview(prev);
      setResult(null);

      // Auto-map headers that match field names
      const autoMap: ColumnMapping = {};
      for (const field of MAPPABLE_FIELDS) {
        const match = prev.headers.find(h =>
          h.toLowerCase().replace(/[_\s]/g, '') === field.key.replace(/_/g, '')
        );
        if (match) {
          (autoMap as Record<string, string>)[field.key] = match;
        }
      }
      setMapping(autoMap);
    }
  };

  const handleImport = async () => {
    if (!activeEstablishment || !filePath) return;
    setImporting(true);
    try {
      const res = await invoke<ImportResult>('import_csv', {
        filePath,
        establishmentId: activeEstablishment.id,
        locationId: locationId ?? null,
        mapping,
      });
      setResult(res);
    } catch (e) {
      setResult({ imported: 0, errors: [String(e)] });
    }
    setImporting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Import Incidents</h1>

      {/* File Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-4">Select CSV File</h2>
        <button onClick={handleSelectFile}
          className="bg-safety-orange text-white px-4 py-2 rounded text-sm">
          Choose File
        </button>
        {filePath && (
          <p className="text-sm text-gray-500 mt-2">
            Selected: {filePath} ({preview?.total_rows ?? 0} rows)
          </p>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-4">Preview (first 5 rows)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    {preview.headers.map(h => (
                      <th key={h} className="px-2 py-2 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {preview.sample_rows.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} className="px-2 py-2 max-w-[150px] truncate">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column Mapping */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-semibold mb-4">Map Columns</h2>
            <div className="grid grid-cols-2 gap-4">
              {MAPPABLE_FIELDS.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <select
                    value={(mapping as Record<string, string>)[field.key] ?? ''}
                    onChange={e => setMapping(prev => ({
                      ...prev,
                      [field.key]: e.target.value || undefined,
                    }))}
                    className="w-full border rounded px-3 py-1.5 text-sm"
                  >
                    <option value="">-- Not mapped --</option>
                    {preview.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Location</label>
              <select value={locationId ?? ''}
                onChange={e => setLocationId(e.target.value ? Number(e.target.value) : undefined)}
                className="border rounded px-3 py-1.5 text-sm">
                <option value="">None</option>
                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>

            <button onClick={handleImport} disabled={importing || !mapping.employee_name || !mapping.incident_date}
              className="mt-4 bg-safety-green text-white px-4 py-2 rounded text-sm disabled:opacity-50">
              {importing ? 'Importing...' : `Import ${preview.total_rows} Rows`}
            </button>
          </div>
        </>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-lg p-6 ${result.errors.length > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
          <h2 className="font-semibold mb-2">Import Complete</h2>
          <p className="text-sm">Successfully imported {result.imported} incidents</p>
          {result.errors.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-yellow-800">{result.errors.length} errors:</p>
              <ul className="text-xs text-yellow-700 mt-1 max-h-40 overflow-y-auto space-y-0.5">
                {result.errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
