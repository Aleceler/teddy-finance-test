import { act, renderHook, waitFor } from '@testing-library/react';
import { createQueryWrapper, createTestQueryClient } from '../../../test/test-utils';
import { QUERY_KEYS } from '../../../lib/query-keys';
import type { Client, CreateClientPayload } from '../../../types/client.types';
import { clientsApi } from '../api/clients.api';
import { useClient } from './useClient';
import { useClients } from './useClients';
import { useCreateClient } from './useCreateClient';
import { useDeleteClient } from './useDeleteClient';
import { useUpdateClient } from './useUpdateClient';

vi.mock('../api/clients.api', () => ({
  clientsApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockClient: Client = {
  id: 'client-1',
  name: 'John Doe',
  email: 'john@test.com',
  phone: '11999999999',
  document: '12345678900',
  accessCount: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const createPayload: CreateClientPayload = {
  name: 'Jane Doe',
  email: 'jane@test.com',
  phone: '11888888888',
  document: '98765432100',
};

describe('clients hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useClients', () => {
    it('fetches all clients', async () => {
      vi.mocked(clientsApi.getAll).mockResolvedValue([mockClient]);
      const wrapper = createQueryWrapper();

      const { result } = renderHook(() => useClients(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(clientsApi.getAll).toHaveBeenCalledTimes(1);
      expect(result.current.data).toEqual([mockClient]);
    });
  });

  describe('useClient', () => {
    it('fetches a client by id', async () => {
      vi.mocked(clientsApi.getById).mockResolvedValue(mockClient);
      const wrapper = createQueryWrapper();

      const { result } = renderHook(() => useClient('client-1'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(clientsApi.getById).toHaveBeenCalledWith('client-1');
      expect(result.current.data).toEqual(mockClient);
    });

    it('does not fetch when id is empty', () => {
      const wrapper = createQueryWrapper();

      renderHook(() => useClient(''), { wrapper });

      expect(clientsApi.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateClient', () => {
    it('creates a client and invalidates related queries', async () => {
      vi.mocked(clientsApi.create).mockResolvedValue(mockClient);
      const queryClient = createTestQueryClient();
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
      const wrapper = createQueryWrapper(queryClient);

      const { result } = renderHook(() => useCreateClient(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync(createPayload);
      });

      expect(clientsApi.create).toHaveBeenCalledWith(createPayload);
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.clients });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.dashboard });
    });
  });

  describe('useUpdateClient', () => {
    it('updates a client and invalidates related queries', async () => {
      const updatedClient = { ...mockClient, name: 'Updated Name' };
      vi.mocked(clientsApi.update).mockResolvedValue(updatedClient);
      const queryClient = createTestQueryClient();
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
      const wrapper = createQueryWrapper(queryClient);

      const { result } = renderHook(() => useUpdateClient(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          id: 'client-1',
          payload: { name: 'Updated Name' },
        });
      });

      expect(clientsApi.update).toHaveBeenCalledWith('client-1', {
        name: 'Updated Name',
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.clients });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: QUERY_KEYS.client('client-1'),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.dashboard });
    });
  });

  describe('useDeleteClient', () => {
    it('deletes a client and invalidates related queries', async () => {
      vi.mocked(clientsApi.delete).mockResolvedValue(undefined);
      const queryClient = createTestQueryClient();
      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
      const wrapper = createQueryWrapper(queryClient);

      const { result } = renderHook(() => useDeleteClient(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync('client-1');
      });

      expect(clientsApi.delete).toHaveBeenCalledWith('client-1');
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.clients });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QUERY_KEYS.dashboard });
    });
  });
});
