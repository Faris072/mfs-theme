# MFS Theme

Adaptive multi-theme Vue 3 UI component library with runtime theme switching, 20 built-in visual themes, 91+ components, and zero runtime dependencies.

## Features

- **20 Built-in Themes**: Switch between 20 distinct design systems at runtime (`clay`, `glass`, `neo`, `cyberpunk`, `liquid-glass`, and more).
- **91+ Vue 3 Components**: Comprehensive component suite covering forms, data display, overlays, navigation, menus, feedback, and charts—plus directives (`v-ripple`, `v-tooltip`, `v-focustrap`, `v-animateonscroll`, `v-styleclass`) and composables (`useTheme`, `useToast`, `useConfirm`).
- **206 `.mfs-*` Utility Classes**: Theme-aware CSS utility classes for layout, surfaces, elevation, typography, and spacing.
- **TypeScript Ready**: Full TypeScript declarations (`dist/index.d.ts`) bundled out of the box.
- **Zero Runtime Dependencies**: Lightweight package requiring only `vue` (`^3.4.0`) as a peer dependency.

## Installation

```bash
npm install @mfs-atomic/ui
```

Or with Bun:

```bash
bun add @mfs-atomic/ui
```

## Quick Start

### 1. Register the Plugin & Import Styles

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import ThemePlugin from '@mfs-atomic/ui'
import '@mfs-atomic/ui/style.css'

const app = createApp(App)
app.use(ThemePlugin, { defaultTheme: 'clay' })
app.mount('#app')
```

### 2. Use Components & Switch Themes with `useTheme()`

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@mfs-atomic/ui'

const { currentTheme, themeOptions, setTheme } = useTheme()
const name = ref('')
</script>

<template>
  <Card title="Welcome" :subtitle="`Active theme: ${currentTheme}`">
    <Input v-model="name" label="Name" placeholder="Enter your name..." />

    <div class="mfs-flex mfs-gap-2 mfs-mt-4">
      <Button
        v-for="theme in themeOptions.slice(0, 3)"
        :key="theme.id"
        :variant="currentTheme === theme.id ? 'primary' : 'secondary'"
        @click="setTheme(theme.id)"
      >
        {{ theme.name }}
      </Button>
    </div>
  </Card>
</template>
```

> Components can also be imported individually (e.g., `import { Button, Card, Input } from '@mfs-atomic/ui'`).

## Built-in Themes

All 20 theme IDs supported by `ThemePlugin` (`defaultTheme`) and `setTheme(id)`:

| Theme ID | Description |
| --- | --- |
| `clay` | Claymorphism — 3D inflated soft surfaces and tactile curves |
| `glass` | Glassmorphism — Frosted translucent glass and backdrop blurs |
| `neo` | Neumorphism — Minimalist soft UI with extruded elevations |
| `minimalism` | Minimalism — Ultra-clean monochrome surfaces and hairline borders |
| `brutalism` | Neubrutalism — High-contrast bold borders and hard offset shadows |
| `bento` | Bento Grid — Modular rounded tiles with crisp spacing |
| `cyberpunk` | Cyberpunk — Neon-lit dark HUD surfaces and electric glows |
| `retro` | Retro — Nostalgic warm palettes and classic UI proportions |
| `swiss` | Swiss — Grid-driven modernist typography and sharp geometry |
| `skeuomorphism` | Skeuomorphism — Realistic textures, bevels, and tactile depth |
| `liquid-glass` | Liquid Glass — Fluid specular highlights and refractive depth |
| `material-you` | Material You — Adaptive tonal surfaces and expressive pills |
| `terminal` | Terminal — Monospace CLI aesthetics with phosphor accents |
| `hand-drawn` | Hand-Drawn — Sketchy organic borders and paper-like surfaces |
| `y2k-chrome` | Y2K Chrome — Metallic gradients, glossy pills, and early-2000s flair |
| `bauhaus` | Bauhaus — Primary geometric forms and bold color blocks |
| `pixel-art` | Pixel Art — Crisp stepped borders and 8-bit arcade styling |
| `aurora-gradient` | Aurora Gradient — Luminous ambient meshes and soft glows |
| `vaporwave` | Vaporwave — Pastel synth gradients and retro-futuristic contrast |
| `manga` | Manga — High-contrast ink panels with halftone depth |

## License & Trademarks

Source code is licensed under the [MIT License](./LICENSE).

The **MFS Atomic Technology** and **MFS Theme** names, logos (including `public/logo.svg`), and brand assets are proprietary to **MFS Atomic Technology** (not open-source) and are **excluded from the MIT License** (all rights reserved). They may not be used to imply endorsement or as your own brand without prior written permission.
