import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.(ts|js)'],
  format: 'esm',
  target: 'es2022',
  bundle: true,
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  minify: true,
  external: ['astro', 'astro-integration-kit', 'vite'],
})
