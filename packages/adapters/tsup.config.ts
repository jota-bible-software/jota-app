import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'interfaces/index': 'src/interfaces/index.ts',
    'storage/index': 'src/storage/index.ts',
    'web/index': 'src/web/index.ts',
    'memory/index': 'src/memory/index.ts',
    'factory/index': 'src/factory/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  external: ['@jota/core'],
})
