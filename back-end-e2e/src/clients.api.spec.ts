import { expect, test } from '@playwright/test';
import { adminCredentials } from './support/env';

test.describe('Clients API', () => {
  let authToken = '';

  test.beforeAll(async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: adminCredentials,
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    authToken = body.accessToken;
  });

  test('runs full client lifecycle', async ({ request }) => {
    const suffix = Date.now();
    const authHeaders = {
      Authorization: `Bearer ${authToken}`,
    };
    const createPayload = {
      name: `Cliente E2E ${suffix}`,
      email: `cliente-e2e-${suffix}@test.com`,
      phone: '3500.00',
      document: '120000.00',
    };

    const createResponse = await request.post('/clients', {
      headers: authHeaders,
      data: createPayload,
    });

    expect(createResponse.status()).toBe(201);

    const created = await createResponse.json();

    expect(created).toMatchObject({
      name: createPayload.name,
      email: createPayload.email,
      phone: createPayload.phone,
      document: createPayload.document,
      accessCount: 0,
    });

    const listResponse = await request.get('/clients', {
      headers: authHeaders,
    });

    expect(listResponse.ok()).toBeTruthy();

    const clients = await listResponse.json();
    expect(clients.some((client: { id: string }) => client.id === created.id)).toBe(
      true,
    );

    const getResponse = await request.get(`/clients/${created.id}`, {
      headers: authHeaders,
    });

    expect(getResponse.ok()).toBeTruthy();

    const fetched = await getResponse.json();
    expect(fetched.accessCount).toBe(1);

    const updateResponse = await request.put(`/clients/${created.id}`, {
      headers: authHeaders,
      data: {
        name: `Cliente E2E Atualizado ${suffix}`,
        phone: '4200.00',
      },
    });

    expect(updateResponse.ok()).toBeTruthy();

    const updated = await updateResponse.json();
    expect(updated.name).toBe(`Cliente E2E Atualizado ${suffix}`);
    expect(updated.phone).toBe('4200.00');

    const deleteResponse = await request.delete(`/clients/${created.id}`, {
      headers: authHeaders,
    });

    expect(deleteResponse.status()).toBe(204);

    const missingResponse = await request.get(`/clients/${created.id}`, {
      headers: authHeaders,
    });

    expect(missingResponse.status()).toBe(404);
  });

  test('rejects unauthenticated requests', async ({ request }) => {
    const response = await request.get('/clients');
    expect(response.status()).toBe(401);
  });
});
