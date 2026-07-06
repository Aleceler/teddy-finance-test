import { api } from '../../../lib/api';
import type { LoginPayload, LoginResponse } from '../../../types/auth.types';

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', payload);
    return data;
  },
};
