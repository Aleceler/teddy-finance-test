export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CLIENTS: '/',
  SELECTED_CLIENTS: '/clientes-selecionados',
  CLIENT_NEW: '/clients/new',
  CLIENT_DETAILS_PATH: '/clients/:id',
  CLIENT_EDIT_PATH: '/clients/:id/edit',
  CLIENT_DETAILS: (id: string) => `/clients/${id}`,
  CLIENT_EDIT: (id: string) => `/clients/${id}/edit`,
} as const;
