import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { Plus, Calendar, Users } from 'lucide-react';
import { useSettingsStore } from '../stores/settingsStore';

interface ToolboxTalk {
  id: number;
  topic_id?: number;
  establishment_id: number;
  location_id?: number;
  title: string;
  date: string;
  conducted_by: string;
  notes?: string;
  status: string;
}

export function ToolboxTalksPage() {
  const navigate = useNavigate();
  const { activeEstablishment } = useSettingsStore();
  const [talks, setTalks] = useState<ToolboxTalk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeEstablishment) {
      loadTalks();
    }
  }, [activeEstablishment]);

  const loadTalks = async () => {
    if (!activeEstablishment) return;
    setLoading(true);
    try {
      const data = await invoke<ToolboxTalk[]>('list_toolbox_talks', {
        establishmentId: activeEstablishment.id,
      });
      setTalks(data);
    } catch (error) {
      console.error('Failed to load toolbox talks:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcoming = talks.filter(t => t.status === 'scheduled' && new Date(t.date) >= new Date());
  const completed = talks.filter(t => t.status === 'completed');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safety-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Toolbox Talks</h1>
        <button
          onClick={() => navigate('/toolbox/new')}
          className="bg-safety-orange text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={20} />
          Schedule Talk
        </button>
      </div>

      {/* Upcoming Talks */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <Calendar size={20} className="text-safety-orange" />
            Upcoming Talks ({upcoming.length})
          </h2>
        </div>
        <div className="divide-y">
          {upcoming.map(talk => (
            <div
              key={talk.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/toolbox/${talk.id}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{talk.title}</h3>
                  <p className="text-sm text-gray-600">
                    {talk.date} • Conducted by {talk.conducted_by}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  <Users size={16} className="inline mr-1" />
                  View Details
                </div>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="p-8 text-center text-gray-500">No upcoming talks scheduled</p>
          )}
        </div>
      </div>

      {/* Completed Talks */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Completed Talks ({completed.length})</h2>
        </div>
        <div className="divide-y">
          {completed.slice(0, 10).map(talk => (
            <div
              key={talk.id}
              className="p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/toolbox/${talk.id}`)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{talk.title}</h3>
                  <p className="text-sm text-gray-600">{talk.date}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Completed
                </span>
              </div>
            </div>
          ))}
          {completed.length === 0 && (
            <p className="p-8 text-center text-gray-500">No completed talks yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
