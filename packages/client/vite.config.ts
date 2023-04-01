import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const root = fileURLToPath(import.meta.url)
const r = (p: string) => resolve(root, '..', p)

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  define: {
    __DEV__: command === 'serve'
  },
  plugins: [
    vue(),
    AutoImport({
      imports: [
        'vue',
        'vuex',
        {
          '@/utils/request': [
            'AxiosGet',
            'AxiosPost',
            'AxiosPut',
            'AxiosDelete'
          ],
          uuid: ['v4']
        }
      ],
      dts: 'src/types/auto-import.d.ts'
    }),
    Components({
      dts: 'src/types/components.d.ts'
    }),
    createSvgIconsPlugin({
      iconDirs: [r('src/icons')]
    })
  ],
  resolve: {
    alias: { '@': r('src') }
  }
}))
