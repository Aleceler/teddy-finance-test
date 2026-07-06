import { expect, test } from '@playwright/test';
import { adminCredentials } from './support/env';

test.describe('Auth flow', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByText('Olá, seja bem-vindo!')).toBeVisible();
  });

  test('shows validation errors on empty login submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page.getByText('Informe um e-mail válido')).toBeVisible();
    await expect(page.getByText('Senha é obrigatória')).toBeVisible();
  });

  test('logs in with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Digite o seu e-mail:').fill(adminCredentials.email);
    await page
      .getByPlaceholder('Digite a sua senha:')
      .fill(adminCredentials.password);
    await page.getByRole('button', { name: 'Entrar' }).click();

    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByText(/clientes encontrados/i)).toBeVisible();
    await expect(page.getByText(/Olá,/)).toContainText('Admin');
  });
});
