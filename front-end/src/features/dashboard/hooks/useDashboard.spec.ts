import { renderHook, waitFor } from '@testing-library/react';
import { createQueryWrapper } from '../../../test/test-utils';
import { QUERY_KEYS } from '../../../lib/query-keys';
import type { Dashboard } from '../../../types/dashboard.types';
import { dashboardApi } from '../api/dashboard.api';
import { useDashboard } from './useDashboard';

vi.mock('../api/dashboard.api', () => ({
  dashboardApi: {
    get: vi.fn(),
  },
}));

const mockDashboard: Dashboard = {
  totalClients: 10,
  deletedClients: 2,
  activeClients: 8,
  totalAccesses: 25,
  latestClients: [
    {
      id: '1',
      name: 'Client A',
      email: 'a@test.com',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ],
  clientsByMonth: [{ month: '2026-01', total: 5 }],
};

describe('useDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches dashboard data with the correct query key', async () => {
    vi.mocked(dashboardApi.get).mockResolvedValue(mockDashboard);
    const wrapper = createQueryWrapper();

    const { result } = renderHook(() => useDashboard(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(dashboardApi.get).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockDashboard);
    expect(result.current.fetchStatus).toBe('idle');
  });

  it('exposes error state when the request fails', async () => {
    vi.mocked(dashboardApi.get).mockRejectedValue(new Error('Network error'));
    const wrapper = createQueryWrapper();

    const { result } = renderHook(() => useDashboard(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.data).toBeUndefined();
  });

  it('uses the dashboard query key', async () => {
    vi.mocked(dashboardApi.get).mockResolvedValue(mockDashboard);
    const wrapper = createQueryWrapper();

    const { result } = renderHook(() => useDashboard(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.dataUpdatedAt).toBeGreaterThan(0);
    expect(QUERY_KEYS.dashboard).toEqual(['dashboard']);
  });
});
