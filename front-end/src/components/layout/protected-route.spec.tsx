import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { useAuthStore } from '../../stores/auth.store';
import { ProtectedRoute } from './protected-route';

vi.mock('../../stores/auth.store', () => ({
  useAuthStore: vi.fn(),
}));

const mockUseAuthStore = vi.mocked(useAuthStore);

function renderProtectedRoute(initialPath = '/clients') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/clients" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders child route when authenticated', () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        token: 'valid-token',
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
      }),
    );

    renderProtectedRoute();

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to login when unauthenticated', () => {
    mockUseAuthStore.mockImplementation((selector) =>
      selector({
        token: null,
        user: null,
        login: vi.fn(),
        logout: vi.fn(),
        setUser: vi.fn(),
      }),
    );

    renderProtectedRoute();

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
