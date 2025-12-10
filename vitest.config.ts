import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // 並列実行設定
    maxWorkers: '50%',

    // カバレッジ設定
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/app/layout.tsx',
        'src/app/page.tsx',
      ],
    },

    projects: [
      {
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
        test: {
          name: 'jsdom',
          globals: true,
          environment: 'jsdom',
          include: ['**/*.test.{ts,tsx}'],
          exclude: [
            '**/*.browser.test.{ts,tsx}',
            '**/node_modules/**',
            '**/vitest-example/**',
          ],
          setupFiles: ['./tests/setup.ts'],
        },
      },
      {
        plugins: [react()],
        resolve: {
          alias: {
            '@': path.resolve(__dirname, './src'),
          },
        },
        test: {
          name: 'browser',
          globals: true,
          browser: {
            enabled: true,
            provider: playwright({
              launchOptions: {
                headless: true,
              },
            }),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
          include: ['**/*.browser.test.{ts,tsx}'],
          setupFiles: ['./tests/setup.ts'],
        },
      },
    ],
  },
});
