import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type {
  DashboardSummary, IncidentsByMonth, IncidentsBySeverity,
  IncidentsByLocation, IncidentsByType, CorrectiveActionSummary,
} from '../lib/types';

interface DashboardState {
  summary: DashboardSummary | null;
  byMonth: IncidentsByMonth[];
  bySeverity: IncidentsBySeverity[];
  byLocation: IncidentsByLocation[];
  byType: IncidentsByType[];
  correctiveActionSummary: CorrectiveActionSummary | null;
  selectedYear: number;
  loading: boolean;

  setYear: (year: number) => void;
  loadDashboard: (establishmentId: number, year: number) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  byMonth: [],
  bySeverity: [],
  byLocation: [],
  byType: [],
  correctiveActionSummary: null,
  selectedYear: new Date().getFullYear(),
  loading: false,

  setYear: (year) => set({ selectedYear: year }),

  loadDashboard: async (establishmentId, year) => {
    set({ loading: true });
    try {
      const [summary, byMonth, bySeverity, byLocation, byType, caSummary] = await Promise.all([
        invoke<DashboardSummary>('get_dashboard_summary', { establishmentId, year }),
        invoke<IncidentsByMonth[]>('get_incidents_by_month', { establishmentId, year }),
        invoke<IncidentsBySeverity[]>('get_incidents_by_severity', { establishmentId, year }),
        invoke<IncidentsByLocation[]>('get_incidents_by_location', { establishmentId, year }),
        invoke<IncidentsByType[]>('get_incidents_by_type', { establishmentId, year }),
        invoke<CorrectiveActionSummary>('get_corrective_action_summary', { establishmentId }),
      ]);
      set({
        summary,
        byMonth,
        bySeverity,
        byLocation,
        byType,
        correctiveActionSummary: caSummary,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },
}));
