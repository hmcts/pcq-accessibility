// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Set test timeout to 18 seconds */
  timeout: 10000,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 7,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html"], ["list"], ["allure-playwright"]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://pcq.aat.platform.hmcts.net/",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "pcq-chromium",
      testDir: "./tests",
      use: {
        browserName: "chromium",
        headless: true,
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
    {
      name: "pcq-safari",
      testDir: "./tests",
      use: {
        browserName: "webkit",
        headless: true,
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
    {
      name: "pcq-firefox",
      testDir: "./tests",
      use: {
        browserName: "firefox",
        headless: true,
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
    {
      name: "pcq-chrome",
      testDir: "./tests",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chromium",
        headless: true,
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
    {
      name: "pcq-edge",
      testDir: "./tests",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
        headless: true,
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
    {
      name: "pcq-iphone",
      testDir: "./tests",
      use: {
        ...devices["iphone 15 Pro Max"],
        browserName: "webkit",
        headless: true,
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
    {
      name: "pcq-ipad",
      testDir: "./tests",
      use: {
        ...devices["ipad Pro 11 landscape"],
        browserName: "webkit",
        headless: true,
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
      },
    },
    // {
    //   name: 'pcq-head-test',
    //   testDir: './tests',
    //   use: {
    //     browserName: 'chromium',
    //     headless: false,
    //     screenshot: 'only-on-failure',
    //     trace:  'retain-on-failure',
    //   }
    // }
  ],
});
