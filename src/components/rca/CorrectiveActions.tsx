import { useEffect, useState } from 'react';
import { useRcaStore } from '../../stores/rcaStore';

interface Props {
  incidentId: number;
}

export function CorrectiveActions({ incidentId }: Props) {
  const {
    correctiveActions, loadCorrectiveActions,
    createCorrectiveAction, updateCorrectiveAction, deleteCorrectiveAction,
  } = useRcaStore();

  const [showAdd, setShowAdd] = useState(false);
  const [desc, setDesc] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    loadCorrectiveActions(incidentId);
  }, [incidentId, loadCorrectiveActions]);

  const handleAdd = async () => {
    if (!desc.trim()) return;
    await createCorrectiveAction(incidentId, desc.trim(), assignedTo || undefined, dueDate || undefined);
    setDesc('');
    setAssignedTo('');
    setDueDate('');
    setShowAdd(false);
  };

  const handleStatusChange = async (id: number, status: string) => {
    await updateCorrectiveAction(id, {
      status,
      completed_date: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined,
    });
    loadCorrectiveActions(incidentId);
  };

  const handleDeleteAction = async (id: number) => {
    await deleteCorrectiveAction(id);
    loadCorrectiveActions(incidentId);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Corrective Actions</h3>
        <button onClick={() => setShowAdd(true)}
          className="bg-safety-orange text-white px-3 py-1.5 rounded text-sm">
          Add Action
        </button>
      </div>

      {showAdd && (
        <div className="border rounded-lg p-4 mb-4 bg-gray-50 space-y-3">
          <textarea value={desc} onChange={e => setDesc(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm" rows={2}
            placeholder="Describe the corrective action..." />
          <div className="grid grid-cols-2 gap-3">
            <input type="text" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
              className="border rounded px-3 py-2 text-sm" placeholder="Assigned to" />
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
              className="border rounded px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="bg-safety-orange text-white px-4 py-1.5 rounded text-sm"
              disabled={!desc.trim()}>Add</button>
            <button onClick={() => setShowAdd(false)} className="border px-4 py-1.5 rounded text-sm">Cancel</button>
          </div>
        </div>
      )}

      {correctiveActions.length === 0 ? (
        <p className="text-sm text-gray-500">No corrective actions yet</p>
      ) : (
        <div className="space-y-3">
          {correctiveActions.map(action => (
            <div key={action.id} className="border rounded-lg p-3 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm">{action.description}</p>
                <div className="flex gap-3 mt-1 text-xs text-gray-500">
                  {action.assigned_to && <span>Assigned: {action.assigned_to}</span>}
                  {action.due_date && <span>Due: {action.due_date}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <select value={action.status} onChange={e => handleStatusChange(action.id, e.target.value)}
                  className={`text-xs border rounded px-2 py-1 ${
                    action.status === 'completed' ? 'bg-green-50' :
                    action.status === 'overdue' ? 'bg-red-50' : ''
                  }`}>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <button onClick={() => handleDeleteAction(action.id)}
                  className="text-red-400 hover:text-red-600 text-xs">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
