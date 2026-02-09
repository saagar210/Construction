import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { US_STATES } from '../../lib/constants';

export function SetupWizard() {
  const { createEstablishment, createLocation } = useSettingsStore();
  const [step, setStep] = useState(1);
  const [estName, setEstName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [industry, setIndustry] = useState('');
  const [naics, setNaics] = useState('');
  const [locName, setLocName] = useState('');
  const [locAddress, setLocAddress] = useState('');
  const [locCity, setLocCity] = useState('');
  const [locState, setLocState] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!estName.trim()) {
      setError('Company name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const est = await createEstablishment({
        name: estName.trim(),
        street_address: street || undefined,
        city: city || undefined,
        state: state || undefined,
        zip_code: zip || undefined,
        industry_description: industry || undefined,
        naics_code: naics || undefined,
      });
      if (locName.trim()) {
        await createLocation({
          establishment_id: est.id,
          name: locName.trim(),
          address: locAddress || undefined,
          city: locCity || undefined,
          state: locState || undefined,
        });
      }
    } catch (e) {
      setError(String(e));
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Safety Tracker</h1>
          <p className="text-gray-500 mt-2">Let&apos;s set up your company to get started</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Company Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                type="text"
                value={estName}
                onChange={(e) => setEstName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="ABC Construction LLC"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input type="text" value={street} onChange={(e) => setStreet(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select value={state} onChange={(e) => setState(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm">
                  <option value="">--</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
                <input type="text" value={zip} onChange={(e) => setZip(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Industry Description</label>
              <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Commercial Building Construction" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NAICS Code</label>
              <input type="text" value={naics} onChange={(e) => setNaics(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm" placeholder="236220" />
            </div>
            <button
              onClick={() => estName.trim() ? setStep(2) : setError('Company name is required')}
              className="w-full bg-safety-orange text-white py-2.5 rounded-md font-medium hover:bg-orange-600"
            >
              Next: Add First Location
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">First Jobsite / Location</h2>
            <p className="text-sm text-gray-500">Optional - you can add locations later</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
              <input type="text" value={locName} onChange={(e) => setLocName(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm" placeholder="Main Office" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={locAddress} onChange={(e) => setLocAddress(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={locCity} onChange={(e) => setLocCity(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <select value={locState} onChange={(e) => setLocState(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm">
                  <option value="">--</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 border border-gray-300 py-2.5 rounded-md text-sm hover:bg-gray-50">
                Back
              </button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 bg-safety-orange text-white py-2.5 rounded-md font-medium hover:bg-orange-600 disabled:opacity-50">
                {saving ? 'Saving...' : 'Complete Setup'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
