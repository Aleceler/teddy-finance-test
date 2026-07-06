import { api } from '../../../lib/api';
import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from '../../../types/client.types';

export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const { data } = await api.get<Client[]>('/clients');
    return data;
  },

  getById: async (id: string): Promise<Client> => {
    const { data } = await api.get<Client>(`/clients/${id}`);
    return data;
  },

  create: async (payload: CreateClientPayload): Promise<Client> => {
    const { data } = await api.post<Client>('/clients', payload);
    return data;
  },

  update: async (id: string, payload: UpdateClientPayload): Promise<Client> => {
    const { data } = await api.put<Client>(`/clients/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/clients/${id}`);
  },
};
