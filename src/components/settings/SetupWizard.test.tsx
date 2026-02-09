import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SetupWizard } from './SetupWizard';
import { useSettingsStore } from '../../stores/settingsStore';

// Mock the store
vi.mock('../../stores/settingsStore', () => ({
  useSettingsStore: vi.fn(),
}));

describe('SetupWizard', () => {
  const mockCreateEstablishment = vi.fn();
  const mockCreateLocation = vi.fn();

  beforeEach(() => {
    vi.mocked(useSettingsStore).mockReturnValue({
      createEstablishment: mockCreateEstablishment,
      createLocation: mockCreateLocation,
    } as ReturnType<typeof useSettingsStore>);

    mockCreateEstablishment.mockResolvedValue({ id: 1, name: 'Test Co' });
    mockCreateLocation.mockResolvedValue({ id: 1, name: 'Main Office' });
  });

  it('renders the welcome screen', () => {
    render(<SetupWizard />);
    expect(screen.getByText('Welcome to Safety Tracker')).toBeInTheDocument();
    expect(screen.getByText('Company Information')).toBeInTheDocument();
  });

  it('stays on step 1 if company name is empty', async () => {
    const user = userEvent.setup();
    render(<SetupWizard />);

    await user.click(screen.getByText('Next: Add First Location'));
    // Should still show step 1 since name is required
    expect(screen.getByText('Company Information')).toBeInTheDocument();
  });

  it('advances to step 2 when name is provided', async () => {
    const user = userEvent.setup();
    render(<SetupWizard />);

    await user.type(screen.getByPlaceholderText('ABC Construction LLC'), 'Test Co');
    await user.click(screen.getByText('Next: Add First Location'));

    expect(screen.getByText('First Jobsite / Location')).toBeInTheDocument();
  });

  it('submits setup with establishment and location', async () => {
    const user = userEvent.setup();
    render(<SetupWizard />);

    await user.type(screen.getByPlaceholderText('ABC Construction LLC'), 'Test Co');
    await user.click(screen.getByText('Next: Add First Location'));

    await user.type(screen.getByPlaceholderText('Main Office'), 'Main Site');
    await user.click(screen.getByText('Complete Setup'));

    expect(mockCreateEstablishment).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test Co' })
    );
    expect(mockCreateLocation).toHaveBeenCalledWith(
      expect.objectContaining({ establishment_id: 1, name: 'Main Site' })
    );
  });
});
