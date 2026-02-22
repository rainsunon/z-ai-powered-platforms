// playwright.config.ts
import { defineConfig } from '@playwright/test';

const baseURL = process.env.SHORTLINK_BASE_URL ?? 'http://localhost:8081';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: 0,

  use: {
    baseURL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  },

  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ]
});