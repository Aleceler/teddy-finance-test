export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  document: string | null;
  accessCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientPayload {
  name: string;
  email: string;
  phone?: string;
  document?: string;
}

export type UpdateClientPayload = Partial<CreateClientPayload>;
