import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { X, Image, Volume2, FileText, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';
import type { Attachment } from '../../lib/types';

interface AttachmentGalleryProps {
  attachments: Attachment[];
  onDelete?: (id: number) => void;
}

export function AttachmentGallery({ attachments, onDelete }: AttachmentGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const toast = useToast();

  const photos = attachments.filter(a => a.file_type === 'photo');
  const audios = attachments.filter(a => a.file_type === 'audio');
  const documents = attachments.filter(a => a.file_type === 'document');

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this attachment?')) return;
    try {
      await invoke('delete_attachment', { id });
      onDelete?.(id);
      toast.success('Attachment deleted successfully');
    } catch (error) {
      toast.error(`Delete failed: ${error}`);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No attachments yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Photos */}
      {photos.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Photos ({photos.length})</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer"
                onClick={() => openLightbox(idx)}
              >
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="text-gray-400" size={48} />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-lg" />
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio Files */}
      {audios.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Audio Notes ({audios.length})</h3>
          <div className="space-y-2">
            {audios.map((audio) => (
              <div
                key={audio.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <Volume2 className="text-safety-orange" size={24} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{audio.file_name}</p>
                  {audio.file_size && (
                    <p className="text-xs text-gray-500">{formatFileSize(audio.file_size)}</p>
                  )}
                </div>
                {onDelete && (
                  <button
                    onClick={() => handleDelete(audio.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-700 mb-3">Documents ({documents.length})</h3>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <FileText className="text-safety-orange" size={24} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{doc.file_name}</p>
                  {doc.file_size && (
                    <p className="text-xs text-gray-500">{formatFileSize(doc.file_size)}</p>
                  )}
                </div>
                {onDelete && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox for Photos */}
      {lightboxOpen && photos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={32} />
          </button>
          <div className="max-w-4xl max-h-full p-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="aspect-video bg-gray-700 rounded flex items-center justify-center mb-4">
                <Image className="text-gray-500" size={96} />
              </div>
              <p className="text-white text-center">{photos[currentIndex].file_name}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
