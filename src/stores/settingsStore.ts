import { create } from 'zustand';
import { invoke } from '@tauri-apps/api/core';
import type { Establishment, Location, CreateEstablishment, CreateLocation, UpdateEstablishment, UpdateLocation } from '../lib/types';

interface SettingsState {
  establishments: Establishment[];
  locations: Location[];
  activeEstablishment: Establishment | null;
  loading: boolean;
  error: string | null;

  loadEstablishments: () => Promise<void>;
  loadLocations: (establishmentId: number) => Promise<void>;
  setActiveEstablishment: (est: Establishment) => void;
  createEstablishment: (data: CreateEstablishment) => Promise<Establishment>;
  updateEstablishment: (id: number, data: UpdateEstablishment) => Promise<Establishment>;
  deleteEstablishment: (id: number) => Promise<void>;
  createLocation: (data: CreateLocation) => Promise<Location>;
  updateLocation: (id: number, data: UpdateLocation) => Promise<Location>;
  deleteLocation: (id: number) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  establishments: [],
  locations: [],
  activeEstablishment: null,
  loading: false,
  error: null,

  loadEstablishments: async () => {
    set({ loading: true, error: null });
    try {
      const establishments = await invoke<Establishment[]>('list_establishments');
      const active = get().activeEstablishment;
      set({
        establishments,
        activeEstablishment: active ?? establishments[0] ?? null,
        loading: false,
      });
      const est = active ?? establishments[0];
      if (est) {
        get().loadLocations(est.id);
      }
    } catch (e) {
      set({ error: String(e), loading: false });
    }
  },

  loadLocations: async (establishmentId: number) => {
    try {
      const locations = await invoke<Location[]>('list_locations', { establishmentId });
      set({ locations });
    } catch (e) {
      set({ error: String(e) });
    }
  },

  setActiveEstablishment: (est: Establishment) => {
    set({ activeEstablishment: est });
    get().loadLocations(est.id);
  },

  createEstablishment: async (data: CreateEstablishment) => {
    const est = await invoke<Establishment>('create_establishment', { data });
    await get().loadEstablishments();
    return est;
  },

  updateEstablishment: async (id: number, data: UpdateEstablishment) => {
    const est = await invoke<Establishment>('update_establishment', { id, data });
    await get().loadEstablishments();
    return est;
  },

  deleteEstablishment: async (id: number) => {
    await invoke('delete_establishment', { id });
    await get().loadEstablishments();
  },

  createLocation: async (data: CreateLocation) => {
    const loc = await invoke<Location>('create_location', { data });
    await get().loadLocations(data.establishment_id);
    return loc;
  },

  updateLocation: async (id: number, data: UpdateLocation) => {
    const loc = await invoke<Location>('update_location', { id, data });
    const est = get().activeEstablishment;
    if (est) await get().loadLocations(est.id);
    return loc;
  },

  deleteLocation: async (id: number) => {
    await invoke('delete_location', { id });
    const est = get().activeEstablishment;
    if (est) await get().loadLocations(est.id);
  },
}));
