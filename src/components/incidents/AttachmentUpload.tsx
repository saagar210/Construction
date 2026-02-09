import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { Upload, Camera, Mic, FileText } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import type { Attachment } from '../../lib/types';

interface AttachmentUploadProps {
  incidentId: number;
  onUploadComplete: (attachment: Attachment) => void;
}

export function AttachmentUpload({ incidentId, onUploadComplete }: AttachmentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const toast = useToast();

  const handleFileSelect = async (file: string, type: string) => {
    setUploading(true);
    try {
      const attachment = await invoke<Attachment>('upload_attachment', {
        incidentId,
        sourcePath: file,
        fileType: type,
      });
      onUploadComplete(attachment);
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error(`Upload failed: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  const openFileDialog = async (type: string) => {
    try {
      const filters = type === 'photo'
        ? [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'heic'] }]
        : type === 'audio'
        ? [{ name: 'Audio', extensions: ['m4a', 'mp3', 'wav'] }]
        : [{ name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt'] }];

      const selected = await open({
        multiple: false,
        filters,
      });

      if (selected && typeof selected === 'string') {
        await handleFileSelect(selected, type);
      }
    } catch (error) {
      console.error('File selection error:', error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Note: Web file paths don't work directly in Tauri
      // This is simplified - production would need file copy handling
      console.warn('Drag & drop from browser not fully supported - use file picker');
    }
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          dragActive ? 'border-safety-orange bg-orange-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 mb-2">Drag and drop files here or use buttons below</p>
        <p className="text-sm text-gray-500">Max file size: 50MB</p>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => openFileDialog('photo')}
          disabled={uploading}
          className="flex flex-col items-center gap-2 p-4 border-2 rounded-lg hover:border-safety-orange hover:bg-orange-50 transition disabled:opacity-50"
        >
          <Camera size={32} className="text-safety-orange" />
          <span className="text-sm font-medium">Photo</span>
        </button>

        <button
          onClick={() => openFileDialog('audio')}
          disabled={uploading}
          className="flex flex-col items-center gap-2 p-4 border-2 rounded-lg hover:border-safety-orange hover:bg-orange-50 transition disabled:opacity-50"
        >
          <Mic size={32} className="text-safety-orange" />
          <span className="text-sm font-medium">Audio Note</span>
        </button>

        <button
          onClick={() => openFileDialog('document')}
          disabled={uploading}
          className="flex flex-col items-center gap-2 p-4 border-2 rounded-lg hover:border-safety-orange hover:bg-orange-50 transition disabled:opacity-50"
        >
          <FileText size={32} className="text-safety-orange" />
          <span className="text-sm font-medium">Document</span>
        </button>
      </div>

      {uploading && (
        <div className="text-center text-sm text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-safety-orange mx-auto mb-2" />
          Uploading...
        </div>
      )}
    </div>
  );
}
