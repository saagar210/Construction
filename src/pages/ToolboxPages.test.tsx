import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { ToolboxTalksPage } from './ToolboxTalksPage';
import { ToolboxCreatePage } from './ToolboxCreatePage';
import { ToolboxTalkDetailPage } from './ToolboxTalkDetailPage';
import { useSettingsStore } from '../stores/settingsStore';
import type { Establishment, Location } from '../lib/types';

vi.mock('../stores/settingsStore', () => ({
  useSettingsStore: vi.fn(),
}));

const mockEstablishment: Establishment = {
  id: 1,
  name: 'Test Co',
  street_address: null,
  city: null,
  state: null,
  zip_code: null,
  industry_description: null,
  naics_code: null,
  created_at: '',
  updated_at: '',
};

const mockLocation: Location = {
  id: 1,
  establishment_id: 1,
  name: 'Yard',
  address: null,
  city: null,
  state: null,
  is_active: true,
  created_at: '',
  updated_at: '',
};

describe('Toolbox route-level pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSettingsStore).mockReturnValue({
      activeEstablishment: mockEstablishment,
      locations: [mockLocation],
    } as unknown as ReturnType<typeof useSettingsStore>);
  });

  it('renders toolbox list page', async () => {
    vi.mocked(invoke).mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <ToolboxTalksPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Toolbox Talks')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Upcoming Talks/i })).toBeInTheDocument();
  });

  it('creates a toolbox talk from new page flow', async () => {
    vi.mocked(invoke)
      .mockResolvedValueOnce([{ id: 10, title: 'Ladder Safety' }])
      .mockResolvedValueOnce({ id: 101 });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/toolbox/new']}>
        <Routes>
          <Route path="/toolbox/new" element={<ToolboxCreatePage />} />
          <Route path="/toolbox/:id" element={<div>Detail Route</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/Ladder Safety Briefing/i), 'Ladder Safety - Crew A');
    await user.type(screen.getByPlaceholderText(/Supervisor name/i), 'Jane Supervisor');
    await user.click(screen.getByRole('button', { name: 'Create Talk' }));

    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('create_toolbox_talk', expect.any(Object));
    });
  });

  it('renders toolbox detail flow and attendee list', async () => {
    vi.mocked(invoke)
      .mockResolvedValueOnce({
        id: 5,
        title: 'Daily PPE',
        date: '2026-02-10',
        conducted_by: 'Foreman Joe',
        notes: 'Wear eye protection',
        status: 'scheduled',
      })
      .mockResolvedValueOnce([
        { id: 1, talk_id: 5, employee_name: 'Alex', signature_data: null },
      ]);

    render(
      <MemoryRouter initialEntries={['/toolbox/5']}>
        <Routes>
          <Route path="/toolbox/:id" element={<ToolboxTalkDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Daily PPE')).toBeInTheDocument();
    expect(screen.getByText('Alex')).toBeInTheDocument();
  });
});
