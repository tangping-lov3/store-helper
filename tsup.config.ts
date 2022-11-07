import { defineConfig } from 'tsup'
import { swcPlugin } from 'esbuild-plugin-swc'

export default defineConfig({
  entry: ['./src/index.ts'],
  external: [
    'vuex',
    'vue',
    'pinia'
  ],
  format: [
    'cjs',
    "esm"
  ],
  plugins: [],
  esbuildPlugins: [swcPlugin({
    jsc: {
      target: 'es5'
    }
  })]
})