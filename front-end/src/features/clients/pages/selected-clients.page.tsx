import { useMemo } from 'react';
import { ClientCard } from '../../../components/clients/client-card';
import { Button } from '../../../components/ui/button';
import { EmptyState } from '../../../components/ui/empty-state';
import { LoadingState } from '../../../components/ui/loading-state';
import { useSelectedClientsStore } from '../../../stores/selected-clients.store';
import { useClients } from '../hooks/useClients';

export function SelectedClientsPage() {
  const { data, isLoading, isError } = useClients();
  const { selectedIds, remove, clear } = useSelectedClientsStore();

  const selectedClients = useMemo(() => {
    if (!data) {
      return [];
    }

    return data.filter((client) => selectedIds.includes(client.id));
  }, [data, selectedIds]);

  if (isLoading) {
    return <LoadingState message="Carregando clientes selecionados..." />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Não foi possível carregar os clientes"
        description="Tente novamente mais tarde."
      />
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900">
        Clientes selecionados:
      </h1>

      {selectedClients.length === 0 ? (
        <EmptyState
          title="Nenhum cliente selecionado"
          description="Selecione clientes na listagem principal."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {selectedClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              variant="selected"
              onRemove={() => remove(client.id)}
            />
          ))}
        </div>
      )}

      {selectedClients.length > 0 ? (
        <div className="mt-6">
          <Button variant="outline" className="w-full" onClick={clear}>
            Limpar clientes selecionados
          </Button>
        </div>
      ) : null}
    </div>
  );
}
