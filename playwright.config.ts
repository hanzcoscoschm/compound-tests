import { defineConfig, devices } from '@playwright/test';

// This is our test settings file! 🎮
export default defineConfig({
  // Where to find our tests
  testDir: './tests',
  
  // How long to wait before giving up (30 seconds)
  timeout: 30000,
  
  // Run tests at the same time to finish faster
  fullyParallel: true,
  
  // These settings help when running tests in a CI environment
  forbidOnly: process.env.CI ? true : false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Create a nice report we can look at later
  reporter: 'html',
  
  // Settings for all our tests
  use: {
    // The website we're testing
    baseURL: 'https://compound.direct',
    
    // Take pictures if something goes wrong
    screenshot: 'only-on-failure',
    
    // Record what happened when tests fail
    trace: 'on-first-retry',
  },
  
  // Which browsers to test in
  projects: [
    {
      name: 'Chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Safari',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
