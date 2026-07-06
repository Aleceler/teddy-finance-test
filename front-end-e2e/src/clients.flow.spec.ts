import { expect, test } from '@playwright/test';
import { login } from './support/auth';

test.describe('Clients flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('creates a client through the modal', async ({ page }) => {
    const clientName = `Cliente UI ${Date.now()}`;

    await page.getByRole('button', { name: 'Criar cliente' }).first().click();
    await expect(page.getByRole('heading', { name: 'Criar cliente:' })).toBeVisible();

    await page.getByPlaceholder('Digite o nome:').fill(clientName);
    await page.getByPlaceholder('Digite o salário:').fill('3500');
    await page.getByPlaceholder('Digite o valor da empresa:').fill('120000');

    await page
      .locator('form')
      .filter({ has: page.getByPlaceholder('Digite o nome:') })
      .getByRole('button', { name: 'Criar cliente' })
      .click();

    await expect(page.getByRole('heading', { name: clientName })).toBeVisible();

    const clientCard = page.locator('div.rounded.border.bg-white').filter({
      has: page.getByRole('heading', { name: clientName, exact: true }),
    });

    await expect(clientCard.getByText(/Salário: R\$\s*3\.500,00/)).toBeVisible();
    await expect(clientCard.getByText(/Empresa: R\$\s*120\.000,00/)).toBeVisible();
  });

  test('selects and deselects a client', async ({ page }) => {
    const clientName = `Cliente Select ${Date.now()}`;

    await page.getByRole('button', { name: 'Criar cliente' }).first().click();
    await page.getByPlaceholder('Digite o nome:').fill(clientName);
    await page.getByPlaceholder('Digite o salário:').fill('2500');
    await page.getByPlaceholder('Digite o valor da empresa:').fill('80000');
    await page
      .locator('form')
      .filter({ has: page.getByPlaceholder('Digite o nome:') })
      .getByRole('button', { name: 'Criar cliente' })
      .click();

    await expect(page.getByRole('heading', { name: clientName })).toBeVisible();

    const clientCard = page.locator('div.rounded.border.bg-white').filter({
      has: page.getByRole('heading', { name: clientName, exact: true }),
    });

    await clientCard.getByRole('button', { name: 'Selecionar cliente' }).click();

    await page.getByRole('link', { name: 'Clientes selecionados' }).click();
    await expect(page.getByRole('heading', { name: clientName })).toBeVisible();

    await page
      .getByRole('button', { name: 'Remover cliente selecionado' })
      .click();

    await expect(
      page.getByRole('heading', { name: 'Nenhum cliente selecionado' }),
    ).toBeVisible();
  });

  test('logs out and returns to login', async ({ page }) => {
    await page.getByRole('button', { name: 'Sair' }).click();

    await expect(page.getByText('Olá, seja bem-vindo!')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });
});
