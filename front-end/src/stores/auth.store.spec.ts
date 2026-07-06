import type { User } from '../types/auth.types';
import { useAuthStore } from './auth.store';

const mockUser: User = {
  id: '1',
  name: 'Admin',
  email: 'admin@test.com',
  role: 'admin',
};

describe('useAuthStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null });
  });

  it('stores token and user on login', () => {
    useAuthStore.getState().login('test-token', mockUser);

    const state = useAuthStore.getState();
    expect(state.token).toBe('test-token');
    expect(state.user).toEqual(mockUser);
  });

  it('clears token and user on logout', () => {
    useAuthStore.getState().login('test-token', mockUser);
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
  });

  it('updates user on setUser', () => {
    const updatedUser: User = { ...mockUser, name: 'Updated Admin' };

    useAuthStore.getState().login('test-token', mockUser);
    useAuthStore.getState().setUser(updatedUser);

    expect(useAuthStore.getState().user).toEqual(updatedUser);
    expect(useAuthStore.getState().token).toBe('test-token');
  });

  it('persists token and user to localStorage', () => {
    useAuthStore.getState().login('test-token', mockUser);

    const stored = localStorage.getItem('auth-storage');
    expect(stored).not.toBeNull();
    expect(stored).toContain('test-token');
    expect(stored).toContain('admin@test.com');
  });
});
