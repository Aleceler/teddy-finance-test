export const QUERY_KEYS = {
  dashboard: ['dashboard'] as const,
  clients: ['clients'] as const,
  client: (id: string) => ['clients', id] as const,
} as const;
