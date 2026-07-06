import { type ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-base font-medium text-slate-900">{title}</h3>
      {description ? (
        <p className="max-w-md text-sm text-slate-600">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
