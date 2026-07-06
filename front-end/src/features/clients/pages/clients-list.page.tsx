import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ClientCard } from '../../../components/clients/client-card';
import { Button } from '../../../components/ui/button';
import { EmptyState } from '../../../components/ui/empty-state';
import { Input } from '../../../components/ui/input';
import { LoadingState } from '../../../components/ui/loading-state';
import { Modal } from '../../../components/ui/modal';
import { Pagination } from '../../../components/ui/pagination';
import { useSelectedClientsStore } from '../../../stores/selected-clients.store';
import type { Client } from '../../../types/client.types';
import { useClients } from '../hooks/useClients';
import { useCreateClient } from '../hooks/useCreateClient';
import { useDeleteClient } from '../hooks/useDeleteClient';
import { useUpdateClient } from '../hooks/useUpdateClient';

const PAGE_SIZE_OPTIONS = [8, 12, 16] as const;

const clientFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().optional(),
  document: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

type ModalType = 'create' | 'edit' | 'delete' | null;

export function ClientsListPage() {
  const { data, isLoading, isError } = useClients();
  const { mutate: createClient, isPending: isCreating } = useCreateClient();
  const { mutate: updateClient, isPending: isUpdating } = useUpdateClient();
  const { mutate: deleteClient, isPending: isDeleting } = useDeleteClient();
  const { toggle, isSelected } = useSelectedClientsStore();

  const [modal, setModal] = useState<ModalType>(null);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] =
    useState<(typeof PAGE_SIZE_OPTIONS)[number]>(16);

  const createForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: emptyFormValues(),
  });

  const editForm = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
  });

  const clients = data ?? [];
  const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return clients.slice(start, start + pageSize);
  }, [clients, currentPage, pageSize]);

  const closeModal = () => {
    setModal(null);
    setActiveClient(null);
    createForm.reset(emptyFormValues());
    editForm.reset(emptyFormValues());
  };

  const openCreateModal = () => {
    createForm.reset(emptyFormValues());
    setModal('create');
  };

  const openEditModal = (client: Client) => {
    setActiveClient(client);
    editForm.reset({
      name: client.name,
      email: client.email,
      phone: client.phone ?? '',
      document: client.document ?? '',
    });
    setModal('edit');
  };

  const openDeleteModal = (client: Client) => {
    setActiveClient(client);
    setModal('delete');
  };

  const handleCreate = (values: ClientFormValues) => {
    createClient(
      {
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        document: values.document || undefined,
      },
      { onSuccess: closeModal },
    );
  };

  const handleUpdate = (values: ClientFormValues) => {
    if (!activeClient) {
      return;
    }

    updateClient(
      {
        id: activeClient.id,
        payload: {
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          document: values.document || undefined,
        },
      },
      { onSuccess: closeModal },
    );
  };

  const handleDelete = () => {
    if (!activeClient) {
      return;
    }

    deleteClient(activeClient.id, { onSuccess: closeModal });
  };

  if (isLoading) {
    return <LoadingState message="Carregando clientes..." />;
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-base font-medium text-neutral-900">
          {clients.length} clientes encontrados:
        </p>

        <label className="flex items-center gap-2 text-sm text-neutral-800">
          Clientes por página:
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value) as (typeof PAGE_SIZE_OPTIONS)[number]);
              setCurrentPage(1);
            }}
            className="rounded border border-teddy-border bg-white px-3 py-2 outline-none focus:border-teddy-orange"
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          title="Nenhum cliente encontrado"
          description="Crie seu primeiro cliente para começar."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              isSelected={isSelected(client.id)}
              onSelect={() => toggle(client.id)}
              onEdit={() => openEditModal(client)}
              onDelete={() => openDeleteModal(client)}
            />
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button variant="outline" className="w-full" onClick={openCreateModal}>
          Criar cliente
        </Button>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Modal
        isOpen={modal === 'create'}
        onClose={closeModal}
        title="Criar cliente:"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={createForm.handleSubmit(handleCreate)}
        >
          <Input
            placeholder="Digite o nome:"
            error={createForm.formState.errors.name?.message}
            {...createForm.register('name')}
          />
          <Input
            placeholder="Digite o e-mail:"
            type="email"
            error={createForm.formState.errors.email?.message}
            {...createForm.register('email')}
          />
          <Input
            placeholder="Digite o telefone:"
            error={createForm.formState.errors.phone?.message}
            {...createForm.register('phone')}
          />
          <Input
            placeholder="Digite o documento:"
            error={createForm.formState.errors.document?.message}
            {...createForm.register('document')}
          />
          <Button type="submit" isLoading={isCreating} className="w-full">
            Criar cliente
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={modal === 'edit'}
        onClose={closeModal}
        title="Editar cliente:"
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={editForm.handleSubmit(handleUpdate)}
        >
          <Input
            placeholder="Digite o nome:"
            error={editForm.formState.errors.name?.message}
            {...editForm.register('name')}
          />
          <Input
            placeholder="Digite o e-mail:"
            type="email"
            error={editForm.formState.errors.email?.message}
            {...editForm.register('email')}
          />
          <Input
            placeholder="Digite o telefone:"
            error={editForm.formState.errors.phone?.message}
            {...editForm.register('phone')}
          />
          <Input
            placeholder="Digite o documento:"
            error={editForm.formState.errors.document?.message}
            {...editForm.register('document')}
          />
          <Button type="submit" isLoading={isUpdating} className="w-full">
            Editar cliente
          </Button>
        </form>
      </Modal>

      <Modal
        isOpen={modal === 'delete'}
        onClose={closeModal}
        title="Excluir cliente:"
      >
        <div className="flex flex-col gap-6">
          <p className="text-base text-neutral-800">
            Você está prestes a excluir o cliente:{' '}
            <span className="font-bold">{activeClient?.name}</span>
          </p>
          <Button
            isLoading={isDeleting}
            className="w-full"
            onClick={handleDelete}
          >
            Excluir cliente
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function emptyFormValues(): ClientFormValues {
  return {
    name: '',
    email: '',
    phone: '',
    document: '',
  };
}
