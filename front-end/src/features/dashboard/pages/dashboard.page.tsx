import { Card } from '../../../components/ui/card';
import { EmptyState } from '../../../components/ui/empty-state';
import { LoadingState } from '../../../components/ui/loading-state';
import { PageHeader } from '../../../components/ui/page-header';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <LoadingState message="Loading dashboard..." />;
  }

  if (isError || !data) {
    return (
      <EmptyState
        title="Unable to load dashboard"
        description="Please try again later."
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your client portfolio"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total clients" value={data.totalClients} />
        <MetricCard label="Active clients" value={data.activeClients} />
        <MetricCard label="Deleted clients" value={data.deletedClients} />
        <MetricCard label="Total accesses" value={data.totalAccesses} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Latest clients
          </h2>
          {data.latestClients.length === 0 ? (
            <p className="text-sm text-slate-600">No clients yet.</p>
          ) : (
            <ul className="divide-y divide-slate-200">
              {data.latestClients.map((client) => (
                <li
                  key={client.id}
                  className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0"
                >
                  <span className="font-medium text-slate-900">
                    {client.name}
                  </span>
                  <span className="text-sm text-slate-600">{client.email}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Clients by month
          </h2>
          <ul className="space-y-3">
            {data.clientsByMonth.map((item) => (
              <li
                key={item.month}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-600">{item.month}</span>
                <span className="font-medium text-slate-900">{item.total}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <p className="text-sm text-slate-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </Card>
  );
}
