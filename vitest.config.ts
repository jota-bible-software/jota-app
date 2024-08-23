import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'


// https://vitejs.dev/config/
export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: 'test/vitest/setup-file.ts',
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      'src/**/*.vitest.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'src': fileURLToPath(new URL('./src', import.meta.url)),
    }
  },
})
