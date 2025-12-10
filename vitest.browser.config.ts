import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      provider: playwright({
        launchOptions: {
          headless: true,
        },
      }),
      // https://vitest.dev/config/browser/playwright
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
})
