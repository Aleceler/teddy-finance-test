import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { QUERY_KEYS } from '../../../lib/query-keys';
import { clientsApi } from '../api/clients.api';
import type { UpdateClientPayload } from '../../../types/client.types';

interface UpdateClientVariables {
  id: string;
  payload: UpdateClientPayload;
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateClientVariables) =>
      clientsApi.update(id, payload),
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.client(client.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard });
      toast.success('Cliente atualizado com sucesso');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
