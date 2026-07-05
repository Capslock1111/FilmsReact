import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.tsx'],
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  }
}))