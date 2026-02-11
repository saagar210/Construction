import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { useSettingsStore } from '../stores/settingsStore';
import { useToast } from '../hooks/useToast';

interface ToolboxTopic {
  id: number;
  title: string;
  category?: string;
}

export function ToolboxCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { activeEstablishment, locations } = useSettingsStore();

  const [topics, setTopics] = useState<ToolboxTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [conductedBy, setConductedBy] = useState('');
  const [topicId, setTopicId] = useState<number | ''>('');
  const [locationId, setLocationId] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    invoke<ToolboxTopic[]>('list_toolbox_topics', { includeInactive: false })
      .then(setTopics)
      .catch((error) => console.error('Failed to load toolbox topics:', error));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEstablishment) {
      toast.error('No active establishment selected');
      return;
    }

    setLoading(true);
    try {
      const talk = await invoke<{ id: number }>('create_toolbox_talk', {
        data: {
          topic_id: topicId || null,
          establishment_id: activeEstablishment.id,
          location_id: locationId || null,
          title,
          date,
          conducted_by: conductedBy,
          notes: notes || null,
        },
      });

      toast.success('Toolbox talk scheduled');
      navigate(`/toolbox/${talk.id}`);
    } catch (error) {
      toast.error(`Failed to schedule talk: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Schedule Toolbox Talk</h1>
        <p className="text-sm text-gray-600 mt-1">Create a new toolbox talk session for your team.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Topic (optional)</label>
          <select
            value={topicId}
            onChange={(e) => {
              const id = e.target.value ? Number(e.target.value) : '';
              setTopicId(id);
              const selected = topics.find(t => t.id === id);
              if (selected && !title) setTitle(selected.title);
            }}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Custom Topic</option>
            {topics.map(topic => (
              <option key={topic.id} value={topic.id}>{topic.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
            placeholder="e.g., Ladder Safety Briefing"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Conducted By</label>
            <input
              value={conductedBy}
              onChange={(e) => setConductedBy(e.target.value)}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Supervisor name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location (optional)</label>
          <select value={locationId} onChange={(e) => setLocationId(e.target.value ? Number(e.target.value) : '')} className="w-full border rounded px-3 py-2">
            <option value="">No location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border rounded px-3 py-2" rows={4} />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="bg-safety-orange text-white px-4 py-2 rounded disabled:opacity-60">
            {loading ? 'Saving…' : 'Create Talk'}
          </button>
          <button type="button" onClick={() => navigate('/toolbox')} className="border px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
