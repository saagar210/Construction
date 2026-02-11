import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { useToast } from '../hooks/useToast';

interface ToolboxTalk {
  id: number;
  title: string;
  date: string;
  conducted_by: string;
  notes?: string;
  status: string;
}

interface ToolboxTalkAttendee {
  id: number;
  talk_id: number;
  employee_name: string;
  signature_data?: string;
}

export function ToolboxTalkDetailPage() {
  const { id } = useParams();
  const toast = useToast();
  const talkId = Number(id);

  const [talk, setTalk] = useState<ToolboxTalk | null>(null);
  const [attendees, setAttendees] = useState<ToolboxTalkAttendee[]>([]);
  const [employeeName, setEmployeeName] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!talkId) return;

    try {
      const [talkData, attendeeData] = await Promise.all([
        invoke<ToolboxTalk>('get_toolbox_talk', { id: talkId }),
        invoke<ToolboxTalkAttendee[]>('list_toolbox_attendees', { talkId }),
      ]);
      setTalk(talkData);
      setAttendees(attendeeData);
    } catch (error) {
      toast.error(`Failed to load talk details: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [talkId]);

  const handleAddAttendee = async () => {
    if (!employeeName.trim()) return;

    try {
      await invoke('add_toolbox_attendee', {
        data: {
          talk_id: talkId,
          employee_name: employeeName,
          employee_id: null,
        },
      });
      setEmployeeName('');
      await loadData();
      toast.success('Attendee added');
    } catch (error) {
      toast.error(`Failed to add attendee: ${error}`);
    }
  };

  const handleComplete = async () => {
    try {
      const updated = await invoke<ToolboxTalk>('complete_toolbox_talk', { talkId });
      setTalk(updated);
      toast.success('Talk marked complete');
    } catch (error) {
      toast.error(`Failed to complete talk: ${error}`);
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading toolbox talk...</p>;
  }

  if (!talk) {
    return (
      <div>
        <p className="text-gray-500">Toolbox talk not found.</p>
        <Link to="/toolbox" className="text-safety-orange hover:underline">Back to talks</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{talk.title}</h1>
          <p className="text-sm text-gray-600">{talk.date} • Conducted by {talk.conducted_by}</p>
        </div>
        {talk.status !== 'completed' && (
          <button onClick={handleComplete} className="bg-green-600 text-white px-4 py-2 rounded">
            Mark Complete
          </button>
        )}
      </div>

      {talk.notes && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-2">Notes</h2>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{talk.notes}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 space-y-3">
        <h2 className="font-semibold">Attendees ({attendees.length})</h2>
        <div className="flex gap-2">
          <input
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="Employee name"
            className="border rounded px-3 py-2 flex-1"
          />
          <button onClick={handleAddAttendee} className="bg-safety-orange text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        {attendees.length === 0 ? (
          <p className="text-sm text-gray-500">No attendees yet.</p>
        ) : (
          <ul className="divide-y">
            {attendees.map((attendee) => (
              <li key={attendee.id} className="py-2 text-sm flex items-center justify-between">
                <span>{attendee.employee_name}</span>
                <span className={`text-xs ${attendee.signature_data ? 'text-green-600' : 'text-gray-500'}`}>
                  {attendee.signature_data ? 'Signed' : 'Unsigned'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
