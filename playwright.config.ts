import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './test/playwright/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30000,

  use: {
    baseURL: 'http://localhost:9003',
    trace: 'on-first-retry',
    actionTimeout: 10000,
    viewport: { width: 1080, height: 768 },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm quasar dev --port 9003',
    url: 'http://localhost:9003',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})
