import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { QUERY_KEYS } from '../../../lib/query-keys';
import { clientsApi } from '../api/clients.api';
import type { CreateClientPayload } from '../../../types/client.types';

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClientPayload) => clientsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success('Cliente criado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
