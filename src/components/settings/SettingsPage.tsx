import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { US_STATES } from '../../lib/constants';
import type { CreateLocation } from '../../lib/types';

export function SettingsPage() {
  const {
    activeEstablishment, locations,
    updateEstablishment, createLocation, updateLocation, deleteLocation,
  } = useSettingsStore();

  const [editingEst, setEditingEst] = useState(false);
  const [estForm, setEstForm] = useState({ ...activeEstablishment });
  const [showAddLoc, setShowAddLoc] = useState(false);
  const [newLoc, setNewLoc] = useState<Partial<CreateLocation>>({});

  if (!activeEstablishment) return <p>No establishment selected</p>;

  const handleSaveEst = async () => {
    await updateEstablishment(activeEstablishment.id, {
      name: estForm?.name ?? undefined,
      street_address: estForm?.street_address ?? undefined,
      city: estForm?.city ?? undefined,
      state: estForm?.state ?? undefined,
      zip_code: estForm?.zip_code ?? undefined,
      industry_description: estForm?.industry_description ?? undefined,
      naics_code: estForm?.naics_code ?? undefined,
    });
    setEditingEst(false);
  };

  const handleAddLocation = async () => {
    if (!newLoc.name?.trim()) return;
    await createLocation({
      establishment_id: activeEstablishment.id,
      name: newLoc.name.trim(),
      address: newLoc.address,
      city: newLoc.city,
      state: newLoc.state,
    });
    setNewLoc({});
    setShowAddLoc(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Establishment Info */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Establishment Information</h2>
          {!editingEst && (
            <button onClick={() => { setEstForm({ ...activeEstablishment }); setEditingEst(true); }}
              className="text-sm text-safety-orange hover:underline">Edit</button>
          )}
        </div>

        {editingEst ? (
          <div className="space-y-3">
            <input type="text" value={estForm?.name ?? ''} onChange={e => setEstForm(prev => ({ ...prev!, name: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" placeholder="Company Name" />
            <input type="text" value={estForm?.street_address ?? ''} onChange={e => setEstForm(prev => ({ ...prev!, street_address: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" placeholder="Street Address" />
            <div className="grid grid-cols-3 gap-3">
              <input type="text" value={estForm?.city ?? ''} onChange={e => setEstForm(prev => ({ ...prev!, city: e.target.value }))}
                className="border rounded px-3 py-2 text-sm" placeholder="City" />
              <select value={estForm?.state ?? ''} onChange={e => setEstForm(prev => ({ ...prev!, state: e.target.value }))}
                className="border rounded px-3 py-2 text-sm">
                <option value="">State</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <input type="text" value={estForm?.zip_code ?? ''} onChange={e => setEstForm(prev => ({ ...prev!, zip_code: e.target.value }))}
                className="border rounded px-3 py-2 text-sm" placeholder="ZIP" />
            </div>
            <input type="text" value={estForm?.industry_description ?? ''} onChange={e => setEstForm(prev => ({ ...prev!, industry_description: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" placeholder="Industry Description" />
            <input type="text" value={estForm?.naics_code ?? ''} onChange={e => setEstForm(prev => ({ ...prev!, naics_code: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" placeholder="NAICS Code" />
            <div className="flex gap-2">
              <button onClick={handleSaveEst} className="bg-safety-orange text-white px-4 py-2 rounded text-sm">Save</button>
              <button onClick={() => setEditingEst(false)} className="border px-4 py-2 rounded text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <div className="text-sm space-y-1 text-gray-700">
            <p><span className="font-medium">Name:</span> {activeEstablishment.name}</p>
            <p><span className="font-medium">Address:</span> {[activeEstablishment.street_address, activeEstablishment.city, activeEstablishment.state, activeEstablishment.zip_code].filter(Boolean).join(', ') || 'Not set'}</p>
            <p><span className="font-medium">Industry:</span> {activeEstablishment.industry_description ?? 'Not set'}</p>
            <p><span className="font-medium">NAICS:</span> {activeEstablishment.naics_code ?? 'Not set'}</p>
          </div>
        )}
      </section>

      {/* Locations */}
      <section className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Locations</h2>
          <button onClick={() => setShowAddLoc(true)}
            className="bg-safety-orange text-white px-3 py-1.5 rounded text-sm">
            Add Location
          </button>
        </div>

        {showAddLoc && (
          <div className="border rounded-lg p-4 mb-4 bg-gray-50 space-y-3">
            <input type="text" value={newLoc.name ?? ''} onChange={e => setNewLoc(prev => ({ ...prev, name: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" placeholder="Location Name" />
            <input type="text" value={newLoc.address ?? ''} onChange={e => setNewLoc(prev => ({ ...prev, address: e.target.value }))}
              className="w-full border rounded px-3 py-2 text-sm" placeholder="Address" />
            <div className="grid grid-cols-2 gap-3">
              <input type="text" value={newLoc.city ?? ''} onChange={e => setNewLoc(prev => ({ ...prev, city: e.target.value }))}
                className="border rounded px-3 py-2 text-sm" placeholder="City" />
              <select value={newLoc.state ?? ''} onChange={e => setNewLoc(prev => ({ ...prev, state: e.target.value }))}
                className="border rounded px-3 py-2 text-sm">
                <option value="">State</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddLocation} className="bg-safety-orange text-white px-4 py-2 rounded text-sm">Add</button>
              <button onClick={() => setShowAddLoc(false)} className="border px-4 py-2 rounded text-sm">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {locations.map(loc => (
            <div key={loc.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <p className="font-medium text-sm">{loc.name}</p>
                <p className="text-xs text-gray-500">
                  {[loc.address, loc.city, loc.state].filter(Boolean).join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${loc.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  {loc.is_active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => updateLocation(loc.id, { is_active: !loc.is_active })}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  {loc.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => deleteLocation(loc.id)}
                  className="text-xs text-red-500 hover:text-red-700">Delete</button>
              </div>
            </div>
          ))}
          {locations.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No locations yet</p>
          )}
        </div>
      </section>
    </div>
  );
}
