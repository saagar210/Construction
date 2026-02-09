import { useState } from 'react';
import { useRcaStore } from '../../stores/rcaStore';

export function FiveWhysWizard() {
  const { currentSession, fiveWhysSteps, addFiveWhysStep } = useRcaStore();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  if (!currentSession) return null;

  const nextStep = fiveWhysSteps.length + 1;
  const canAddMore = nextStep <= 5 && currentSession.status === 'in_progress';

  const handleAdd = async () => {
    if (!question.trim() || !answer.trim()) return;
    await addFiveWhysStep(currentSession.id, nextStep, question.trim(), answer.trim());
    setQuestion('');
    setAnswer('');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold text-lg mb-4">5 Whys Analysis</h3>

      <div className="space-y-4">
        {fiveWhysSteps.map((step) => (
          <div key={step.id} className="border-l-4 border-safety-orange pl-4">
            <p className="text-xs text-gray-500 font-medium">Why #{step.step_number}</p>
            <p className="text-sm font-medium mt-1">{step.question}</p>
            <p className="text-sm text-gray-700 mt-1 bg-gray-50 rounded p-2">{step.answer}</p>
          </div>
        ))}

        {canAddMore && (
          <div className="border-l-4 border-gray-200 pl-4 space-y-2">
            <p className="text-xs text-gray-500 font-medium">Why #{nextStep}</p>
            <input
              type="text"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder={`Why did ${fiveWhysSteps.length > 0 ? 'that happen' : 'the incident occur'}?`}
            />
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              rows={2}
              placeholder="Because..."
            />
            <button onClick={handleAdd}
              className="bg-safety-orange text-white px-4 py-1.5 rounded text-sm"
              disabled={!question.trim() || !answer.trim()}>
              Add Step
            </button>
          </div>
        )}

        {fiveWhysSteps.length >= 5 && (
          <p className="text-sm text-green-600 font-medium">
            All 5 Whys completed. Review the analysis and complete the session above.
          </p>
        )}
      </div>
    </div>
  );
}
