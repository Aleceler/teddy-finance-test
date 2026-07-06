import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/app-layout';
import { ProtectedRoute } from '../components/layout/protected-route';
import { ROUTES } from '../config/routes';
import { LoginPage } from '../features/auth/pages/login.page';
import { ClientsListPage } from '../features/clients/pages/clients-list.page';
import { SelectedClientsPage } from '../features/clients/pages/selected-clients.page';
import { DashboardPage } from '../features/dashboard/pages/dashboard.page';
import { useAuthStore } from '../stores/auth.store';

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);

  if (token) {
    return <Navigate to={ROUTES.CLIENTS} replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={ROUTES.CLIENTS} element={<ClientsListPage />} />
          <Route
            path={ROUTES.SELECTED_CLIENTS}
            element={<SelectedClientsPage />}
          />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.CLIENTS} replace />} />
    </Routes>
  );
}
