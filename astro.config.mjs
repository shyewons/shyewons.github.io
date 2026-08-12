import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://shyewons.github.io/dev-portfolio',
  base: '/dev-portfolio',
  integrations: [mdx(), sitemap()],
  markdown: { shikiConfig: { theme: 'github-dark' } },
  output: 'static',
});
