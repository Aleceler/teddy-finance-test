import { expect, type Page } from '@playwright/test';
import { adminCredentials } from './env';

export async function login(page: Page) {
  await page.goto('/login');

  await page.getByPlaceholder('Digite o seu e-mail:').fill(adminCredentials.email);
  await page
    .getByPlaceholder('Digite a sua senha:')
    .fill(adminCredentials.password);
  await page.getByRole('button', { name: 'Entrar' }).click();

  await expect(page.getByText(/clientes encontrados/i)).toBeVisible();
}
