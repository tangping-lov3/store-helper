import { defineConfig } from 'tsup'
import { swcPlugin } from 'esbuild-plugin-swc'

export default defineConfig([
  {
    entry: ['./src/vuex.ts'],
    external: ['vuex', 'vue'],
    format: [
      'cjs',
      'esm'
    ],
    plugins: [],
    esbuildPlugins: [
      swcPlugin({
        jsc: {
          target: 'es5'
        }
      })
    ],
    dts: true
  },
  {
    entry: ['./src/pinia.ts'],
    external: [
      'pinia'
    ],
    format: [
      'cjs',
      'esm'
    ],
    plugins: [],
    esbuildPlugins: [
      swcPlugin({
        jsc: {
          target: 'es5'
        }
      })
    ],
    outDir: 'dist',
    dts: true
  }
])
