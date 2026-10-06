import { defineConfig } from 'astro/config';

// Con dominio personalizzato (consigliato, es. menu.tuodominio.it):
//   site: 'https://menu.tuodominio.it', base: '/'
// Con project site su GitHub Pages:
//   site: 'https://mcmatthew.github.io', base: '/nome-repo'
export default defineConfig({
  site: 'https://menu.example.com',
  base: '/',
  trailingSlash: 'always',
});
