import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from './Layout';
import { useSettingsStore } from '../../stores/settingsStore';
import type { Establishment } from '../../lib/types';

vi.mock('../../stores/settingsStore', () => ({
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

describe('Layout', () => {
  beforeEach(() => {
    vi.mocked(useSettingsStore).mockReturnValue({
      activeEstablishment: mockEstablishment,
      establishments: [mockEstablishment],
      setActiveEstablishment: vi.fn(),
    } as unknown as ReturnType<typeof useSettingsStore>);
  });

  it('shows toolbox and JSA in primary navigation', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Toolbox Talks' })).toHaveAttribute('href', '/toolbox');
    expect(screen.getByRole('link', { name: 'JSA' })).toHaveAttribute('href', '/jsa');
  });
});
