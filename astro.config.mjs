import { defineConfig } from 'astro/config';

import purgecss from "astro-purgecss";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  integrations: [purgecss({
    fontFace: true,
    keyframes: true,
    variables: true,
  }), svelte()],
  build: {
    inlineStylesheets: 'always'
  }
});