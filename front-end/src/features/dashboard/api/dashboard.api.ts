import { api } from '../../../lib/api';
import type { Dashboard } from '../../../types/dashboard.types';

export const dashboardApi = {
  get: async (): Promise<Dashboard> => {
    const { data } = await api.get<Dashboard>('/dashboard');
    return data;
  },
};
