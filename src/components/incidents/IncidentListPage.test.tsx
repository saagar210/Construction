import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { IncidentListPage } from './IncidentListPage';
import { useSettingsStore } from '../../stores/settingsStore';
import { useIncidentStore } from '../../stores/incidentStore';
import type { Incident, Establishment, Location } from '../../lib/types';

vi.mock('../../stores/settingsStore', () => ({
  useSettingsStore: vi.fn(),
}));

vi.mock('../../stores/incidentStore', () => ({
  useIncidentStore: vi.fn(),
}));

const mockEstablishment: Establishment = {
  id: 1, name: 'Test Co', street_address: null, city: null, state: null,
  zip_code: null, industry_description: null, naics_code: null,
  created_at: '', updated_at: '',
};

const mockIncident: Incident = {
  id: 1, case_number: 1, establishment_id: 1, location_id: 1,
  employee_name: 'John Doe', employee_job_title: 'Carpenter',
  employee_address: null, employee_city: null, employee_state: null,
  employee_zip: null, employee_dob: null, employee_hire_date: null,
  employee_gender: 'male', is_privacy_case: false,
  incident_date: '2026-01-15', incident_time: '09:30',
  work_start_time: null, where_occurred: 'Building A',
  description: 'Fell from scaffold',
  activity_before_incident: null, how_injury_occurred: null,
  injury_description: null, object_substance: null,
  physician_name: null, treatment_facility: null,
  facility_address: null, facility_city_state_zip: null,
  treated_in_er: null, hospitalized_overnight: null,
  outcome_severity: 'days_away', days_away_count: 14,
  days_restricted_count: 0, date_of_death: null,
  injury_illness_type: 'injury', is_recordable: true,
  status: 'open', completed_by: null, completed_by_title: null,
  completed_by_phone: null, completed_date: null,
  created_at: '', updated_at: '',
};

describe('IncidentListPage', () => {
  const mockLoadIncidents = vi.fn();

  beforeEach(() => {
    vi.mocked(useSettingsStore).mockReturnValue({
      activeEstablishment: mockEstablishment,
      locations: [] as Location[],
    } as ReturnType<typeof useSettingsStore>);

    vi.mocked(useIncidentStore).mockReturnValue({
      incidents: [mockIncident],
      loading: false,
      loadIncidents: mockLoadIncidents,
    } as unknown as ReturnType<typeof useIncidentStore>);
  });

  it('renders incident list', () => {
    render(
      <MemoryRouter>
        <IncidentListPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Incidents')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Fell from scaffold')).toBeInTheDocument();
  });

  it('shows report incident button', () => {
    render(
      <MemoryRouter>
        <IncidentListPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Report Incident')).toBeInTheDocument();
  });

  it('shows empty state when no incidents', () => {
    vi.mocked(useIncidentStore).mockReturnValue({
      incidents: [],
      loading: false,
      loadIncidents: mockLoadIncidents,
    } as unknown as ReturnType<typeof useIncidentStore>);

    render(
      <MemoryRouter>
        <IncidentListPage />
      </MemoryRouter>
    );

    expect(screen.getByText('No incidents found')).toBeInTheDocument();
  });
});
