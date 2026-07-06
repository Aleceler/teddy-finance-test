import { CircleArrowRight, Home, Menu, User, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config/routes';
import { queryClient } from '../../lib/query-client';
import { useAuthStore } from '../../stores/auth.store';
import { TeddyLogo } from '../brand/teddy-logo';

const desktopNavigation = [
  { to: ROUTES.CLIENTS, label: 'Clientes' },
  { to: ROUTES.SELECTED_CLIENTS, label: 'Clientes selecionados' },
];

const mobileNavigation = [
  { to: ROUTES.DASHBOARD, label: 'Home', icon: Home },
  { to: ROUTES.CLIENTS, label: 'Clientes', icon: User },
  {
    to: ROUTES.SELECTED_CLIENTS,
    label: 'Clientes selecionados',
    icon: UserCheck,
  },
] as const;

export function AppLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const isMobileItemActive = (label: string, path: string) => {
    if (label === 'Clientes') {
      return location.pathname === ROUTES.CLIENTS;
    }

    if (label === 'Home') {
      return location.pathname === ROUTES.DASHBOARD;
    }

    return location.pathname === path;
  };

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
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
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={22} />
            </button>
            <Link to={ROUTES.CLIENTS}>
              <TeddyLogo />
            </Link>
          </div>

          <nav className="hidden items-center gap-10 lg:flex">
            {desktopNavigation.map(({ to, label }) => (
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
      </header>

      {isMenuOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeMenu}
            aria-label="Fechar menu"
          />

          <aside className="relative flex h-full w-[min(88vw,340px)] flex-col overflow-hidden rounded-r-[28px] bg-white shadow-2xl">
            <div className="relative bg-neutral-900 px-6 pb-12 pt-8">
              <div className="flex justify-center">
                <div className="rounded-md bg-white px-4 py-3">
                  <TeddyLogo />
                </div>
              </div>

              <button
                type="button"
                onClick={closeMenu}
                className="absolute -right-4 bottom-0 flex h-9 w-9 translate-y-1/2 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg"
                aria-label="Fechar menu"
              >
                <CircleArrowRight size={18} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 px-4 py-6">
              {mobileNavigation.map(({ to, label, icon: Icon }) => {
                const isActive = isMobileItemActive(label, to);

                return (
                  <Link
                    key={label}
                    to={to}
                    onClick={closeMenu}
                    className={`relative flex items-center gap-4 rounded-lg px-4 py-4 text-lg font-medium transition-colors ${
                      isActive
                        ? 'text-teddy-orange'
                        : 'text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon
                      size={22}
                      className={isActive ? 'text-teddy-orange' : 'text-neutral-900'}
                    />
                    <span>{label}</span>
                    {isActive ? (
                      <span className="absolute right-0 top-3 h-[calc(100%-1.5rem)] w-1 rounded-full bg-teddy-orange" />
                    ) : null}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 px-4 py-4 text-left text-lg font-medium text-neutral-900 hover:bg-neutral-50"
              >
                Sair
              </button>
            </nav>
          </aside>
        </div>
      ) : null}

      <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
