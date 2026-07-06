export function TeddyLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="grid grid-cols-2 gap-0.5">
        <span className="h-2 w-2 bg-teddy-orange" />
        <span className="h-2 w-2 bg-teddy-orange" />
        <span className="h-2 w-2 bg-teddy-orange" />
        <span className="h-2 w-2 bg-neutral-900" />
      </div>
      <div className="leading-tight">
        <span className="text-xl font-bold tracking-tight text-neutral-900">
          teddy
        </span>
        <span className="block text-[10px] font-semibold tracking-widest text-neutral-900">
          OPEN FINANCE
        </span>
      </div>
    </div>
  );
}
