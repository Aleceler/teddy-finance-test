export interface LatestClient {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface ClientsByMonth {
  month: string;
  total: number;
}

export interface Dashboard {
  totalClients: number;
  deletedClients: number;
  activeClients: number;
  totalAccesses: number;
  latestClients: LatestClient[];
  clientsByMonth: ClientsByMonth[];
}
