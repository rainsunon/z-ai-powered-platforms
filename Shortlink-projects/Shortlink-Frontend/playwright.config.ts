import { defineConfig, devices } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const STORYBOOK_DIR = path.resolve(__dirname, 'storybook-static')

/**
 * Playwright config for Storybook visual regression tests
 * CI contract:
 *   - storybook-static MUST exist before Playwright runs
 *   - Playwright only serves & tests, never builds
 */

if (!fs.existsSync(STORYBOOK_DIR)) {
  throw new Error(
    'storybook-static does not exist. ' +
    'You must run `npm run build-storybook` before `npm run test:visual`.'
  )
}

export default defineConfig({
  testDir: './__tests__/visual',

  fullyParallel: false,
  workers: 1,

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/visual-results.json' }],
    ['list'],
  ],

  use: {
    baseURL: 'http://localhost:6006',
    viewport: { width: 1280, height: 720 },
    // Enable video and screenshots for all tests to verify component rendering
    trace: 'on-first-retry',
    screenshot: 'on', // Capture screenshots for all tests
    video: 'on', // Record video for all tests to see component rendering
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],

  webServer: {
    // Use locally installed serve from node_modules/.bin/serve
    // This avoids npx permission issues and uses the package from devDependencies
    // Works in both CI and local environments
    // Note: serve v14 doesn't support --no-open or --no-clipboard flags
    command: 'node_modules/.bin/serve storybook-static -p 6006',
    url: 'http://localhost:6006',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI, // Reuse server locally, always start fresh in CI
    stdout: 'pipe',
    stderr: 'pipe',
    // Wait for server to be ready by checking if index.html is accessible
    // This ensures Storybook is fully loaded before tests start
    ignoreHTTPSErrors: true,
  },

  expect: {
    toHaveScreenshot: {
      threshold: 0.2,
      maxDiffPixels: 100,
    },
    toMatchSnapshot: {
      threshold: 0.2,
    },
  },
})
