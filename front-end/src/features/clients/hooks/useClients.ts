import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../lib/query-keys';
import { clientsApi } from '../api/clients.api';

export function useClients() {
  return useQuery({
    queryKey: QUERY_KEYS.clients,
    queryFn: clientsApi.getAll,
  });
}
