import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { TeddyLogo } from '../brand/teddy-logo';
import { ROUTES } from '../../config/routes';
import { queryClient } from '../../lib/query-client';
import { useAuthStore } from '../../stores/auth.store';

const navigation = [
  { to: ROUTES.CLIENTS, label: 'Clientes' },
  { to: ROUTES.SELECTED_CLIENTS, label: 'Clientes selecionados' },
];

export function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-teddy-gray">
      <header className="border-b border-teddy-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-neutral-900 lg:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </button>
            <Link to={ROUTES.CLIENTS}>
              <TeddyLogo />
            </Link>
          </div>

          <nav className="hidden items-center gap-10 lg:flex">
            {navigation.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `pb-1 text-base font-medium transition-colors ${
                    isActive
                      ? 'border-b-2 border-teddy-orange text-neutral-900'
                      : 'text-neutral-800 hover:text-teddy-orange'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="text-base font-medium text-neutral-800 hover:text-teddy-orange"
            >
              Sair
            </button>
          </nav>

          <p className="text-base text-neutral-900">
            Olá, <span className="font-bold">{user?.name ?? 'Usuário'}!</span>
          </p>
        </div>

        {isMenuOpen ? (
          <nav className="flex flex-col gap-3 border-t border-teddy-border px-4 py-4 lg:hidden">
            {navigation.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `text-base font-medium ${isActive ? 'text-teddy-orange' : 'text-neutral-800'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="text-left text-base font-medium text-neutral-800"
            >
              Sair
            </button>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
