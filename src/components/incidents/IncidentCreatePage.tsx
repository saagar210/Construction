import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettingsStore } from '../../stores/settingsStore';
import { useIncidentStore } from '../../stores/incidentStore';
import { OUTCOME_SEVERITY_LABELS, INJURY_TYPE_LABELS, US_STATES } from '../../lib/constants';
import type { CreateIncident, OutcomeSeverity, InjuryIllnessType } from '../../lib/types';

export function IncidentCreatePage() {
  const navigate = useNavigate();
  const { activeEstablishment, locations } = useSettingsStore();
  const { createIncident } = useIncidentStore();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<Partial<CreateIncident>>({
    establishment_id: activeEstablishment?.id,
    outcome_severity: 'other_recordable',
    injury_illness_type: 'injury',
    is_recordable: true,
    days_away_count: 0,
    days_restricted_count: 0,
  });

  const set = (field: keyof CreateIncident, value: unknown) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!form.employee_name?.trim() || !form.incident_date || !form.description?.trim()) {
      setError('Employee name, incident date, and description are required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const incident = await createIncident(form as CreateIncident);
      navigate(`/incidents/${incident.id}`);
    } catch (e) {
      setError(String(e));
      setSaving(false);
    }
  };

  const inputClass = "w-full border rounded-md px-3 py-2 text-sm";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Report Incident</h1>

      {/* Step Indicator */}
      <div className="flex items-center mb-8">
        {['Basic Info', 'Details', 'Classification', 'Healthcare'].map((label, i) => (
          <div key={label} className="flex-1 flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step > i + 1 ? 'bg-safety-green text-white' :
              step === i + 1 ? 'bg-safety-orange text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1}
            </div>
            <span className="ml-2 text-sm text-gray-600 hidden sm:inline">{label}</span>
            {i < 3 && <div className="flex-1 h-px bg-gray-200 mx-3" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Incident Date *</label>
                <input type="date" value={form.incident_date ?? ''} onChange={e => set('incident_date', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Time of Event</label>
                <input type="time" value={form.incident_time ?? ''} onChange={e => set('incident_time', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <select value={form.location_id ?? ''} onChange={e => set('location_id', e.target.value ? Number(e.target.value) : undefined)} className={inputClass}>
                <option value="">Select location...</option>
                {locations.filter(l => l.is_active).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Employee Name *</label>
              <input type="text" value={form.employee_name ?? ''} onChange={e => set('employee_name', e.target.value)} className={inputClass} placeholder="Full Name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Job Title</label>
                <input type="text" value={form.employee_job_title ?? ''} onChange={e => set('employee_job_title', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Gender</label>
                <select value={form.employee_gender ?? ''} onChange={e => set('employee_gender', e.target.value)} className={inputClass}>
                  <option value="">--</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date of Birth</label>
                <input type="date" value={form.employee_dob ?? ''} onChange={e => set('employee_dob', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Hire Date</label>
                <input type="date" value={form.employee_hire_date ?? ''} onChange={e => set('employee_hire_date', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Employee Address</label>
              <input type="text" value={form.employee_address ?? ''} onChange={e => set('employee_address', e.target.value)} className={inputClass} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input type="text" value={form.employee_city ?? ''} onChange={e => set('employee_city', e.target.value)} className={inputClass} placeholder="City" />
              <select value={form.employee_state ?? ''} onChange={e => set('employee_state', e.target.value)} className={inputClass}>
                <option value="">State</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="text" value={form.employee_zip ?? ''} onChange={e => set('employee_zip', e.target.value)} className={inputClass} placeholder="ZIP" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_privacy_case ?? false} onChange={e => set('is_privacy_case', e.target.checked)} />
                Privacy case (hide employee name on OSHA logs)
              </label>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Incident Details</h2>
            <div>
              <label className={labelClass}>Where did the event occur? *</label>
              <input type="text" value={form.where_occurred ?? ''} onChange={e => set('where_occurred', e.target.value)} className={inputClass} placeholder="e.g., Building A, 2nd floor" />
            </div>
            <div>
              <label className={labelClass}>Description of what happened *</label>
              <textarea value={form.description ?? ''} onChange={e => set('description', e.target.value)} className={inputClass} rows={3} placeholder="Describe the incident..." />
            </div>
            <div>
              <label className={labelClass}>Work Start Time</label>
              <input type="time" value={form.work_start_time ?? ''} onChange={e => set('work_start_time', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>What was the employee doing before the incident?</label>
              <textarea value={form.activity_before_incident ?? ''} onChange={e => set('activity_before_incident', e.target.value)} className={inputClass} rows={2} />
            </div>
            <div>
              <label className={labelClass}>How did the injury/illness occur?</label>
              <textarea value={form.how_injury_occurred ?? ''} onChange={e => set('how_injury_occurred', e.target.value)} className={inputClass} rows={2} />
            </div>
            <div>
              <label className={labelClass}>Describe the injury/illness and the body part affected</label>
              <textarea value={form.injury_description ?? ''} onChange={e => set('injury_description', e.target.value)} className={inputClass} rows={2} />
            </div>
            <div>
              <label className={labelClass}>What object or substance harmed the employee?</label>
              <input type="text" value={form.object_substance ?? ''} onChange={e => set('object_substance', e.target.value)} className={inputClass} />
            </div>
          </div>
        )}

        {/* Step 3: Classification */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Outcome Classification</h2>
            <div>
              <label className={labelClass}>Outcome Severity</label>
              <div className="space-y-2">
                {Object.entries(OUTCOME_SEVERITY_LABELS).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="severity" value={key}
                      checked={form.outcome_severity === key}
                      onChange={() => set('outcome_severity', key as OutcomeSeverity)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            {(form.outcome_severity === 'days_away' || form.outcome_severity === 'job_transfer_restriction') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Days Away From Work</label>
                  <input type="number" min={0} max={180} value={form.days_away_count ?? 0}
                    onChange={e => set('days_away_count', Number(e.target.value))} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Days on Restricted Duty</label>
                  <input type="number" min={0} max={180} value={form.days_restricted_count ?? 0}
                    onChange={e => set('days_restricted_count', Number(e.target.value))} className={inputClass} />
                </div>
              </div>
            )}
            {form.outcome_severity === 'death' && (
              <div>
                <label className={labelClass}>Date of Death</label>
                <input type="date" value={form.date_of_death ?? ''} onChange={e => set('date_of_death', e.target.value)} className={inputClass} />
              </div>
            )}
            <div>
              <label className={labelClass}>Injury/Illness Type</label>
              <div className="space-y-2">
                {Object.entries(INJURY_TYPE_LABELS).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="type" value={key}
                      checked={form.injury_illness_type === key}
                      onChange={() => set('injury_illness_type', key as InjuryIllnessType)} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_recordable ?? true}
                  onChange={e => set('is_recordable', e.target.checked)} />
                OSHA Recordable
              </label>
            </div>
          </div>
        )}

        {/* Step 4: Healthcare */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Healthcare Information (Optional)</h2>
            <div>
              <label className={labelClass}>Physician Name</label>
              <input type="text" value={form.physician_name ?? ''} onChange={e => set('physician_name', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Treatment Facility</label>
              <input type="text" value={form.treatment_facility ?? ''} onChange={e => set('treatment_facility', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Facility Address</label>
              <input type="text" value={form.facility_address ?? ''} onChange={e => set('facility_address', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Facility City, State, ZIP</label>
              <input type="text" value={form.facility_city_state_zip ?? ''} onChange={e => set('facility_city_state_zip', e.target.value)} className={inputClass} />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.treated_in_er ?? false} onChange={e => set('treated_in_er', e.target.checked)} />
                Treated in emergency room
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.hospitalized_overnight ?? false} onChange={e => set('hospitalized_overnight', e.target.checked)} />
                Hospitalized overnight
              </label>
            </div>
          </div>
        )}

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <div>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="border px-4 py-2 rounded text-sm hover:bg-gray-50">
                Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/incidents')} className="border px-4 py-2 rounded text-sm hover:bg-gray-50">Cancel</button>
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)}
                className="bg-safety-orange text-white px-4 py-2 rounded text-sm hover:bg-orange-600">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving}
                className="bg-safety-green text-white px-4 py-2 rounded text-sm hover:bg-green-600 disabled:opacity-50">
                {saving ? 'Saving...' : 'Submit Incident'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
