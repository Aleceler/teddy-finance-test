import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const workspaceRoot = resolve(process.cwd(), '..');

function loadEnvFile(filePath: string) {
  try {
    const content = readFileSync(filePath, 'utf8');

    for (const line of content.split('\n')) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const separatorIndex = trimmed.indexOf('=');

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex);
      const value = trimmed.slice(separatorIndex + 1);

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    return;
  }
}

loadEnvFile(resolve(workspaceRoot, '.env'));

export const adminCredentials = {
  email: process.env.E2E_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL ?? 'admin@example.com',
  password:
    process.env.E2E_ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD ?? 'admin123',
};
