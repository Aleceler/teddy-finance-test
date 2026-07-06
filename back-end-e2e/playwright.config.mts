import { resolve } from 'node:path';
import { defineConfig } from '@playwright/test';

const workspaceRoot = resolve(process.cwd(), '..');

export default defineConfig({
  testDir: './src',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: process.env.API_URL || 'http://localhost:3000',
  },
  webServer: {
    command: 'npx nx run @org/back-end:serve',
    url: 'http://localhost:3000/healthz',
    reuseExistingServer: true,
    cwd: workspaceRoot,
    timeout: 180_000,
  },
  projects: [
    {
      name: 'api',
    },
  ],
});
