import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'types/index': 'src/types/index.ts',
    'bible/index': 'src/bible/index.ts',
    'search/index': 'src/search/index.ts',
    'format/index': 'src/format/index.ts',
    'highlight/index': 'src/highlight/index.ts',
    'audio/index': 'src/audio/index.ts',
    'plans/index': 'src/plans/index.ts',
    'utils/index': 'src/utils/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
})
