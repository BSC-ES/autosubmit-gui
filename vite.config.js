import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import inject from '@rollup/plugin-inject';
import istanbul from "vite-plugin-istanbul";


export default defineConfig(({ mode }) => {
  const PREFIXES = ['REACT_APP_', 'PUBLIC_URL'];
  let _dotEnvContent = loadEnv(mode, process.cwd(), PREFIXES);
  console.log(`Loaded environment variables from dotenv:`, _dotEnvContent);
  process.env = { ...process.env, ..._dotEnvContent };

  return {
    envPrefix: PREFIXES,
    base: process.env.PUBLIC_URL || undefined,
    build: {
      outDir: 'build',
      // fancytree is mixed fix: https://stackoverflow.com/questions/77421447/how-to-solve-require-is-not-defined-in-vite
      commonjsOptions: { transformMixedEsModules: true }
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
      // Istanbul plugin for code coverage
      istanbul({
        cypress: true,
      }),
    ],
  };
});