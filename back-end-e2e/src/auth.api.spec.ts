import { expect, test } from '@playwright/test';
import { adminCredentials } from './support/env';

test.describe('Auth API', () => {
  test('rejects invalid credentials', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: {
        email: adminCredentials.email,
        password: 'wrong-password',
      },
    });

    expect(response.status()).toBe(401);
  });

  test('returns access token for valid admin credentials', async ({ request }) => {
    const response = await request.post('/auth/login', {
      data: adminCredentials,
    });

    expect(response.ok()).toBeTruthy();

    const body = await response.json();

    expect(body.accessToken).toBeTruthy();
    expect(body.user).toMatchObject({
      email: adminCredentials.email,
      role: 'admin',
    });
  });
});
