import { QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { createTestQueryClient } from '../../../test/test-utils';
import { useAuthStore } from '../../../stores/auth.store';
import { authApi } from '../api/auth.api';
import { LoginPage } from './login.page';

const mockNavigate = vi.fn();

vi.mock('../api/auth.api', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLoginPage() {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    useAuthStore.setState({ token: null, user: null });
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Informe um e-mail válido')).toBeInTheDocument();
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    expect(authApi.login).not.toHaveBeenCalled();
  });

  it('submits valid credentials successfully', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: '1',
      name: 'Admin',
      email: 'admin@test.com',
      role: 'admin',
    };

    vi.mocked(authApi.login).mockResolvedValue({
      accessToken: 'test-token',
      user: mockUser,
    });

    renderLoginPage();

    await user.type(
      screen.getByPlaceholderText('Digite o seu e-mail:'),
      'admin@test.com',
    );
    await user.type(
      screen.getByPlaceholderText('Digite a sua senha:'),
      'password123',
    );
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password123',
      });
    });

    await waitFor(() => {
      expect(useAuthStore.getState().token).toBe('test-token');
      expect(useAuthStore.getState().user).toEqual(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
