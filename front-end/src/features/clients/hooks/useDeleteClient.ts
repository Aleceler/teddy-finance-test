import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { QUERY_KEYS } from '../../../lib/query-keys';
import { clientsApi } from '../api/clients.api';

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success('Cliente excluído com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
