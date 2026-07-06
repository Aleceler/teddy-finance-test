export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  );
}
