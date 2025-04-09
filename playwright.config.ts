import { PlaywrightTestConfig, devices } from '@playwright/test';

// This is our test settings file! 
const config: PlaywrightTestConfig = {
  // Where to find our tests
  testDir: './tests',
  
  // How long to wait before giving up (1 minute)
  timeout: 60000,
  
  expect: {
    // How long to wait for expect assertions
    timeout: 10000,
  },
  
  // Run tests sequentially for stability
  fullyParallel: false,
  
  // These settings help when running tests in a CI environment
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0, // Add retries for flaky tests in CI
  workers: 1, // Run tests sequentially
  
  // Create a nice report we can look at later
  reporter: [
    ['list'],
    ['html', { open: 'never' }]
  ],
  
  // Settings for all our tests
  use: {
    // The website we're testing
    baseURL: 'https://compound.direct',
    
    // How long to wait for actions to complete
    actionTimeout: 10000,
    
    // How long to wait for pages to load
    navigationTimeout: 15000,
    
    // Record what happened when tests fail
    trace: 'retain-on-failure', // Only record traces on failure
    
    // Take pictures if something goes wrong
    screenshot: 'only-on-failure', // Only take screenshots on failure
    
    // Record video of tests
    video: 'retain-on-failure', // Only record video on failure
    
    // Viewport size for tests
    viewport: { width: 1280, height: 720 },
    
    // Launch options for browser
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',
        '--disable-web-security', // Allow cross-origin iframes
        '--disable-features=IsolateOrigins,site-per-process' // Disable site isolation
      ]
    }
  },
  
  // Which browsers to test in
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        contextOptions: {
          ignoreHTTPSErrors: true
        }
      },
    }
  ],
};

export default config;
