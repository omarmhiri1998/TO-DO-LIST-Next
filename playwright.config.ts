import {
  defineConfig,
  devices
} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  fullyParallel: false,

  timeout: 30000,

  expect: {
    timeout: 5000
  },

  retries:
    process.env.CI ? 2 : 0,

  workers:
    process.env.CI ? 1 : undefined,

  reporter: [
    ["list"],
    ["html", {
      open: "never"
    }]
  ],

  use: {
    baseURL:
      "http://localhost:3000",

    headless:
      process.env.CI
        ? true
        : false,

    actionTimeout: 5000,

    trace:
      "on-first-retry"
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices[
          "Desktop Chrome"
        ]
      }
    },

    {
      name: "firefox",
      use: {
        ...devices[
          "Desktop Firefox"
        ]
      }
    },

    {
      name: "webkit",
      use: {
        ...devices[
          "Desktop Safari"
        ]
      }
    }
  ],

  webServer: {
    command:
      "npm run dev",

    url:
      "http://localhost:3000",

    reuseExistingServer:
      !process.env.CI,

    timeout:
      120000,

    env: {
      MONGODB_DB:
        "todo_e2e_db"
    }
  }
});