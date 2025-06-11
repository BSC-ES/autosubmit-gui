import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import inject from '@rollup/plugin-inject';


export default defineConfig(() => {
  return {
    envPrefix: 'REACT_APP_',
    build: {
      outDir: 'build',
    },
    resolve: {
      alias: {
        // Trick for fancytree: https://github.com/mar10/fancytree/wiki/TutorialIntegration
        'jquery': import.meta.resolve('jquery')
      }
    },
    server: {
      port: 3000,
      open: true,
    },
    plugins: [
      react(),
      tailwindcss(),
      svgr(),
      // Include jquery in Vite: https://dev.to/chmich/setup-jquery-on-vite-598k
      inject({
        $: 'jquery',
        jQuery: 'jquery',
      }),
    ],
  };
});