# MFS Theme

Adaptive multi-theme Vue 3 UI component library with runtime theme switching, 21 built-in visual themes, 91+ components, and zero runtime dependencies.

## Features

- **21 Built-in Themes**: Switch between 21 distinct design systems at runtime (`clay`, `glass`, `neo`, `cyberpunk`, `liquid-glass`, `3d-glassmorphism`, and more).
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

## Highlighted & Newly Added Components

| Category | Components |
| --- | --- |
| **Forms & Validation** | `Form`, `FormField`, `Mentions`, `SignaturePad`, `CodeEditor` |
| **Overlays & Portals** | `CommandPalette`, `DynamicDialog`, `Portal`, `OverlayBadge` |
| **Media & Visuals** | `ImageCropper`, `ImageCompare`, `AvatarGroup` |
| **Data & Lists** | `DataTable`, `InfiniteScroll`, `Select`, `AutoComplete` |

## Local Filter vs Remote Search & Server-Side Data

Choose the data mode based on dataset size:

- **Local filtering (default)**: Best for small, in-memory datasets (< 200 items). Leave `remote` / `lazy` off and pass the full `options`, `items`, or `value` array; the component filters/sorts/paginates on the client.
- **Remote search (`remote` + `@search` + `loading`)**: Best for large or server-backed lists in `CommandPalette`, `Mentions`, `Select`, and `AutoComplete`. Setting `remote` disables built-in client filtering so your `@search` handler can fetch and update options while `loading` displays a spinner.
- **Server-side pagination & scrolling (`lazy`)**: Best for unbounded tables and feeds. Use `DataTable` with `lazy` (`@page`, `@sort`, `@filter`) or `InfiniteScroll` (`@load`, `hasMore`, `loading`).

```vue
<!-- Remote Search (CommandPalette / Mentions / Select / AutoComplete) -->
<CommandPalette
  v-model:open="isOpen"
  :items="remoteItems"
  remote
  :loading="isSearching"
  @search="fetchCommands"
/>

<Mentions
  v-model="comment"
  :options="userSuggestions"
  remote
  :loading="isSearchingUsers"
  @search="({ trigger, query }) => fetchMentions(trigger, query)"
/>

<!-- Server-Side DataTable & InfiniteScroll -->
<DataTable
  :value="rows"
  :columns="columns"
  lazy
  paginator
  :loading="isLoadingTable"
  @page="onPage"
  @sort="onSort"
  @filter="onFilter"
/>

<InfiniteScroll :loading="isLoadingMore" :has-more="hasNextPage" @load="loadNextPage">
  <div v-for="item in feed" :key="item.id">{{ item.title }}</div>
</InfiniteScroll>
```

## XSS-Safe `CodeEditor`

`CodeEditor` tokenizes source code into plain-text `<span>` elements (`{{ tok.text }}`) rather than `v-html`, preventing XSS injection even when rendering untrusted user input.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { CodeEditor } from '@mfs-atomic/ui'

const code = ref(`<script setup>\nconst msg = 'Safe by default'\n<\/script>`)
</script>

<template>
  <CodeEditor
    v-model="code"
    language="vue"
    filename="Example.vue"
    :line-numbers="true"
    :copyable="true"
  />
</template>
```

## `v-animate-on-scroll` Zero-CSS Presets

Animate elements on viewport entry without writing custom keyframes. Supports 5 built-in presets (`fade-up`, `fade-down`, `fade-left`, `fade-right`, `zoom-in`), respects `prefers-reduced-motion`, and also accepts custom `enterClass` / `leaveClass` options.

```vue
<script setup lang="ts">
import { vAnimateOnScroll } from '@mfs-atomic/ui'
</script>

<template>
  <!-- Default preset ('fade-up') -->
  <Card v-animate-on-scroll title="Fade Up" />

  <!-- Shorthand preset string -->
  <Card v-animate-on-scroll="'fade-left'" title="Slide Left" />

  <!-- Full options object -->
  <Card
    v-animate-on-scroll="{ animation: 'zoom-in', duration: 600, delay: 150, once: false }"
    title="Zoom In"
  />
</template>
```

> When registered globally via `ThemePlugin`, the directive is available as `v-animateonscroll`.

## Presets

Looking for ready-made pages, dashboards, and UI blocks built with `@mfs-atomic/ui`? Explore **[MFS Presets](https://preset-ui.mfstechnology.co.id)** for copy-and-paste templates that adapt automatically to all 21 built-in themes.

## Built-in Themes

All 21 theme IDs supported by `ThemePlugin` (`defaultTheme`) and `setTheme(id)`:

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
| `3d-glassmorphism` | 3D Glassmorphism — Cosmic dark glass with 3D iridescent rim bevels |

## License & Trademarks

Source code is licensed under the [MIT License](./LICENSE).

The **MFS Atomic Technology** and **MFS Theme** names, logos (including `public/logo.svg`), and brand assets are proprietary to **MFS Atomic Technology** (not open-source) and are **excluded from the MIT License** (all rights reserved). They may not be used to imply endorsement or as your own brand without prior written permission.
