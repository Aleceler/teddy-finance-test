import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../lib/query-keys';
import { clientsApi } from '../api/clients.api';

export function useClient(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.client(id),
    queryFn: () => clientsApi.getById(id),
    enabled: Boolean(id),
  });
}
