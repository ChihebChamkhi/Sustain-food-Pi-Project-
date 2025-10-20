import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@fullcalendar/core',
      '@fullcalendar/react'
    ],
    exclude: [
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction'
    ]
  },
  server: {
    proxy: {
      '/api/reviews': {
        target: 'http://localhost:5000', // Your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/reviews/, '/reviews')
      }
    }
  }
});