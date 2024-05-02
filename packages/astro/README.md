# Astro Fontsubs

Astro integration of [`subfont`](https://github.com/Munter/subfont) library. Generate optimized font subset for your Astro site.

## Prerequisites

1. Astro 4.x

## Installation

You can install this package through `astro add`

```bash
# Using pnpm
pnpm astro add @namchee/astro-subfont

# Using npm
npx astro add @namchee/astro-subfont

# Using yarn
yarn astro add @namchee/astro-subfont

# Using bun
bunx astro add @namchee/astro-subfont
```

Additionaly, you can also install this package manually

```bash
# Using pnpm
pnpm install -D @namchee/astro-subfont

# Using npm
npm install -D @namchee/astro-subfont

# Using yarn
yarn add -D @namchee/astro-subfont

# Using bun
bun add -D @namchee/astro-subfont
```

After installation, you can integrate this integration in your Astro config

```js
import { defineConfig } from 'astro/config';

import { subset } from '@namchee/astro-subfont';

export default defineConfig({
  integrations: [
    subset(),
  ]
})
```

## Configuration

This integration can be configured by passing a configuration object with the following properties:

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `whitelist` | `string` | `''` | Additional characters to be included in font subsets. Use this option if you find some characters are missing after subset. |
| `optimizeVariableFonts` | `boolean` | `true` | Allow optimization of [variable font](https://fonts.google.com/knowledge/introducing_type/introducing_variable_fonts) features, such as weights and axes. Experimental. |
| `inline` | `boolean` | `false` | Inline the optimized fonts directly in the `@font-face` declaration. |
| `dynamic` | `boolean` | `false` | Analyze webfonts usage dynamically by running headless browsers. |
| `debug` | `boolean` | `false` | Enable verbose output to `stdout`. |

## Acknowledgements

All credits goes to [Munter](https://github.com/Munter) for the awesome [subfont](https://github.com/Munter/subfont) library.
