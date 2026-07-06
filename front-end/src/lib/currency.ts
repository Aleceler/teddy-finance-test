export function formatCurrency(value: string | null | undefined): string {
  if (!value) {
    return '-';
  }

  const amount = Number(value.replace(',', '.'));

  if (Number.isNaN(amount)) {
    return value;
  }

  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function parseCurrencyInput(value: string): string {
  const normalized = value.trim().replace(/\./g, '').replace(',', '.');

  if (!normalized) {
    return '';
  }

  const amount = Number(normalized);

  if (Number.isNaN(amount)) {
    return '';
  }

  return amount.toFixed(2);
}

export function isValidCurrencyInput(value: string): boolean {
  const parsed = parseCurrencyInput(value);
  return parsed !== '' && Number(parsed) > 0;
}
