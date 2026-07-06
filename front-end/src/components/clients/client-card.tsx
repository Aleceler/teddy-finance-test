import { Minus, Pencil, Plus, Trash2 } from 'lucide-react';
import type { Client } from '../../types/client.types';

interface ClientCardProps {
  client: Client;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onRemove?: () => void;
  variant?: 'list' | 'selected';
}

export function ClientCard({
  client,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
  onRemove,
  variant = 'list',
}: ClientCardProps) {
  return (
    <div className="flex flex-col rounded border border-teddy-border bg-white shadow-sm">
      <div className="flex flex-1 flex-col items-center px-4 py-6 text-center">
        <h3 className="text-lg font-bold text-neutral-900">{client.name}</h3>
        <p className="mt-2 text-sm text-neutral-700">
          E-mail: {client.email}
        </p>
        <p className="mt-1 text-sm text-neutral-700">
          Telefone: {client.phone ?? '-'}
        </p>
        <p className="mt-1 text-sm text-neutral-700">
          Documento: {client.document ?? '-'}
        </p>
      </div>

      {variant === 'list' ? (
        <div className="flex items-center justify-between border-t border-teddy-border px-4 py-3">
          <button
            type="button"
            onClick={onSelect}
            className={`flex h-8 w-8 items-center justify-center text-xl font-bold ${isSelected ? 'text-teddy-orange' : 'text-neutral-900'}`}
            aria-label="Selecionar cliente"
          >
            <Plus size={18} />
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="text-neutral-900"
            aria-label="Editar cliente"
          >
            <Pencil size={18} />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-red-600"
            aria-label="Excluir cliente"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ) : (
        <div className="flex justify-end border-t border-teddy-border px-4 py-3">
          <button
            type="button"
            onClick={onRemove}
            className="flex h-8 w-8 items-center justify-center text-xl font-bold text-red-600"
            aria-label="Remover cliente selecionado"
          >
            <Minus size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
