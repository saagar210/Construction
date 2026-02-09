import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { Incident, CreateIncident, UpdateIncident, IncidentFilter, Attachment } from '../lib/types';

interface IncidentState {
  incidents: Incident[];
  currentIncident: Incident | null;
  attachments: Attachment[];
  loading: boolean;
  error: string | null;

  loadIncidents: (filter: IncidentFilter) => Promise<void>;
  loadIncident: (id: number) => Promise<void>;
  createIncident: (data: CreateIncident) => Promise<Incident>;
  updateIncident: (id: number, data: UpdateIncident) => Promise<Incident>;
  deleteIncident: (id: number) => Promise<void>;
  loadAttachments: (incidentId: number) => Promise<void>;
  addAttachment: (incidentId: number, fileName: string, filePath: string, fileType: string, fileSize: number | null) => Promise<Attachment>;
  deleteAttachment: (id: number) => Promise<void>;
  clearCurrent: () => void;
}

export const useIncidentStore = create<IncidentState>((set, get) => ({
  incidents: [],
  currentIncident: null,
  attachments: [],
  loading: false,
  error: null,

  loadIncidents: async (filter: IncidentFilter) => {
    set({ loading: true, error: null });
    try {
      const incidents = await invoke<Incident[]>('list_incidents', { filter });
      set({ incidents, loading: false });
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  loadIncident: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const incident = await invoke<Incident>('get_incident', { id });
      set({ currentIncident: incident, loading: false });
      get().loadAttachments(id);
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  createIncident: async (data: CreateIncident) => {
    const incident = await invoke<Incident>('create_incident', { data });
    return incident;
  },

  updateIncident: async (id: number, data: UpdateIncident) => {
    const incident = await invoke<Incident>('update_incident', { id, data });
    set({ currentIncident: incident });
    return incident;
  },

  deleteIncident: async (id: number) => {
    await invoke('delete_incident', { id });
    set({ currentIncident: null });
  },

  loadAttachments: async (incidentId: number) => {
    try {
      const attachments = await invoke<Attachment[]>('list_attachments', { incidentId });
      set({ attachments });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  addAttachment: async (incidentId, fileName, filePath, fileType, fileSize) => {
    const attachment = await invoke<Attachment>('add_attachment', {
      incidentId, fileName, filePath, fileType, fileSize,
    });
    get().loadAttachments(incidentId);
    return attachment;
  },

  deleteAttachment: async (id: number) => {
    await invoke('delete_attachment', { id });
    const inc = get().currentIncident;
    if (inc) get().loadAttachments(inc.id);
  },

  clearCurrent: () => set({ currentIncident: null, attachments: [] }),
}));
