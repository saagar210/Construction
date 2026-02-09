import { useState } from 'react';
import { useRcaStore } from '../../stores/rcaStore';
import { FISHBONE_CATEGORIES, FISHBONE_CATEGORY_LABELS } from '../../lib/constants';

export function FishboneDiagram() {
  const {
    currentSession, fishboneCategories,
    addFishboneCategory, addFishboneCause, updateFishboneCause, deleteFishboneCause,
  } = useRcaStore();

  const [newCauseText, setNewCauseText] = useState<Record<number, string>>({});

  if (!currentSession) return null;

  const existingCategoryNames = new Set(fishboneCategories.map(c => c.category));
  const isEditable = currentSession.status === 'in_progress';

  const handleAddCategory = async (category: string) => {
    await addFishboneCategory(currentSession.id, category, fishboneCategories.length);
  };

  const handleAddCause = async (categoryId: number) => {
    const text = newCauseText[categoryId]?.trim();
    if (!text) return;
    await addFishboneCause(categoryId, text);
    setNewCauseText(prev => ({ ...prev, [categoryId]: '' }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-lg mb-4">Fishbone Diagram (Ishikawa)</h3>

      {/* SVG Diagram */}
      <div className="mb-6 overflow-x-auto">
        <svg viewBox="0 0 800 400" className="w-full max-w-3xl mx-auto" style={{ minWidth: 600 }}>
          {/* Main spine */}
          <line x1="50" y1="200" x2="750" y2="200" stroke="#333" strokeWidth="3" />
          <polygon points="750,190 780,200 750,210" fill="#333" />
          <text x="640" y="230" className="text-xs" fill="#666">Root Cause</text>

          {/* Categories */}
          {fishboneCategories.map((cat, i) => {
            const isTop = i % 2 === 0;
            const x = 120 + (i * 110);
            const y1 = isTop ? 50 : 350;
            const y2 = 200;

            return (
              <g key={cat.id}>
                <line x1={x} y1={y1} x2={x} y2={y2} stroke="#ff6b00" strokeWidth="2" />
                <text x={x} y={isTop ? 40 : 370} textAnchor="middle" className="text-xs font-bold" fill="#ff6b00">
                  {FISHBONE_CATEGORY_LABELS[cat.category] ?? cat.category}
                </text>
                {cat.causes.map((cause, j) => {
                  const cy = isTop ? 70 + j * 25 : 330 - j * 25;
                  return (
                    <g key={cause.id}>
                      <line x1={x - 50} y1={cy} x2={x} y2={cy + (isTop ? 15 : -15)} stroke="#999" strokeWidth="1" />
                      <text x={x - 55} y={cy + 4} textAnchor="end" fontSize="10"
                        fill={cause.is_root_cause ? '#dc3545' : '#333'}
                        fontWeight={cause.is_root_cause ? 'bold' : 'normal'}>
                        {cause.cause_text.length > 20 ? cause.cause_text.slice(0, 20) + '...' : cause.cause_text}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Category Management */}
      {isEditable && (
        <div className="mb-4 flex flex-wrap gap-2">
          {FISHBONE_CATEGORIES.filter(c => !existingCategoryNames.has(c)).map(cat => (
            <button key={cat} onClick={() => handleAddCategory(cat)}
              className="border border-dashed border-gray-300 px-3 py-1 rounded text-sm text-gray-500 hover:border-safety-orange hover:text-safety-orange">
              + {FISHBONE_CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* Categories Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fishboneCategories.map(cat => (
          <div key={cat.id} className="border rounded-lg p-3">
            <h4 className="font-semibold text-sm text-safety-orange mb-2">
              {FISHBONE_CATEGORY_LABELS[cat.category] ?? cat.category}
            </h4>
            <ul className="space-y-1.5">
              {cat.causes.map(cause => (
                <li key={cause.id} className="flex items-start gap-2 text-sm">
                  {isEditable && (
                    <button
                      onClick={() => updateFishboneCause(cause.id, undefined, !cause.is_root_cause)}
                      className={`mt-0.5 w-4 h-4 rounded border flex-shrink-0 ${
                        cause.is_root_cause ? 'bg-red-500 border-red-500' : 'border-gray-300'
                      }`}
                      title="Mark as root cause"
                    />
                  )}
                  <span className={cause.is_root_cause ? 'font-bold text-red-700' : ''}>{cause.cause_text}</span>
                  {isEditable && (
                    <button onClick={() => deleteFishboneCause(cause.id)}
                      className="text-red-400 hover:text-red-600 ml-auto text-xs">x</button>
                  )}
                </li>
              ))}
            </ul>
            {isEditable && (
              <div className="mt-2 flex gap-1">
                <input
                  type="text"
                  value={newCauseText[cat.id] ?? ''}
                  onChange={e => setNewCauseText(prev => ({ ...prev, [cat.id]: e.target.value }))}
                  className="border rounded px-2 py-1 text-xs flex-1"
                  placeholder="Add cause..."
                  onKeyDown={e => { if (e.key === 'Enter') handleAddCause(cat.id); }}
                />
                <button onClick={() => handleAddCause(cat.id)}
                  className="text-safety-orange text-xs font-medium px-2">Add</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
