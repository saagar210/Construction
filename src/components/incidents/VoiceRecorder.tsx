import { useState, useRef } from 'react';
import { Mic, Square, Trash2, Save } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

interface VoiceRecorderProps {
  onSave: (audioBlob: Blob) => void;
}

export function VoiceRecorder({ onSave }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const toast = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = window.setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error('Failed to access microphone. Please grant permission.');
      console.error('Microphone access error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const discardRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const handleSave = () => {
    if (audioBlob) {
      onSave(audioBlob);
      discardRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <div className="text-center">
        {isRecording ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <span className="text-2xl font-mono font-bold text-red-500">
                {formatTime(recordingTime)}
              </span>
            </div>
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:bg-red-600 transition"
            >
              <Square size={20} />
              Stop Recording
            </button>
          </div>
        ) : audioURL ? (
          <div className="space-y-4">
            <audio src={audioURL} controls className="w-full" />
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleSave}
                className="bg-safety-orange text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition"
              >
                <Save size={20} />
                Save Recording
              </button>
              <button
                onClick={discardRecording}
                className="border-2 border-gray-300 px-6 py-3 rounded-lg flex items-center gap-2 hover:border-red-500 hover:text-red-500 transition"
              >
                <Trash2 size={20} />
                Discard
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={startRecording}
            className="bg-safety-orange text-white px-8 py-4 rounded-lg flex items-center gap-3 mx-auto hover:bg-orange-600 transition text-lg font-semibold"
          >
            <Mic size={24} />
            Start Recording
          </button>
        )}
      </div>

      {!isRecording && !audioURL && (
        <p className="text-sm text-gray-500 text-center">
          Tap the button to record a voice note about this incident
        </p>
      )}
    </div>
  );
}
