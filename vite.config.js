import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/mydevToolsOL/' : '/',
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    viteSingleFile(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // 使用 esbuild 进行代码压缩
    minify: 'esbuild',
    // 将资源内联到HTML中的大小限制设置得很大
    assetsInlineLimit: 100000000,
    // 提高警告限制
    chunkSizeWarningLimit: 100000000,
    // 不拆分CSS文件
    cssCodeSplit: false,
    // 禁用gzip大小报告
    reportCompressedSize: false,
    // 自定义构建选项
    rollupOptions: {
      output: {
        // 重要：确保没有代码分割
        inlineDynamicImports: true,
      },
    },
  },
})
