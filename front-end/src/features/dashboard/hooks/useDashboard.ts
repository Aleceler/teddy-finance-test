import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../lib/query-keys';
import { dashboardApi } from '../api/dashboard.api';

export function useDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: dashboardApi.get,
  });
}
