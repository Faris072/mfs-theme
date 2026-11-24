<template>
  <div class="mfs-stack mfs-gap-6">
    <ComponentPreview
      title="Theme-Adaptive .mfs-* Utilities"
      description="Compose custom cards, inset inputs, interactive surfaces, and semantic badges without writing theme-specific CSS."
      :code="snippetCode"
    >
      <div class="mfs-stack">
        <div class="mfs-grid">
          <div class="mfs-card mfs-stack">
            <div class="mfs-row mfs-justify-between">
              <strong class="mfs-text">Surface Card</strong>
              <span class="mfs-pill mfs-bg-primary mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Primary</span>
            </div>
            <p class="mfs-text-muted mfs-text-sm mfs-m-0">
              Adapts shadow, border, radius, and blur across Clay, Glass, and Neo.
            </p>
            <div class="mfs-row">
              <span class="mfs-pill mfs-bg-secondary mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Secondary</span>
              <span class="mfs-pill mfs-bg-success mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Success</span>
              <span class="mfs-pill mfs-bg-warning mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Warning</span>
              <span class="mfs-pill mfs-bg-danger mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Danger</span>
            </div>
          </div>

          <div class="mfs-surface mfs-rounded-lg mfs-shadow mfs-stack mfs-p-5">
            <label class="mfs-text mfs-text-sm mfs-font-semibold" for="mfs-util-input">Inset Input Surface</label>
            <input
              id="mfs-util-input"
              v-model="sampleText"
              type="text"
              class="mfs-inset mfs-w-full mfs-px-3 mfs-py-2 mfs-text-sm mfs-focus-ring"
              placeholder="Type to test..."
            />
            <div class="mfs-row">
              <button
                type="button"
                class="mfs-surface-subtle mfs-rounded-md mfs-shadow mfs-interactive mfs-px-3 mfs-py-2 mfs-text-sm mfs-font-semibold"
                @click="clicks++"
              >
                Interactive ({{ clicks }})
              </button>
              <span class="mfs-text-primary mfs-text-sm mfs-font-semibold">{{ sampleText || 'Ready' }}</span>
            </div>
          </div>
        </div>
      </div>
    </ComponentPreview>

    <ComponentPreview
      title="Typography, Effects, Soft Tints & States"
      description="Extended .mfs-* utilities for display/mono fonts, theme glow/bevel effects, soft semantic tints, focus rings, dividers, and disabled states."
      :code="extendedSnippetCode"
    >
      <div class="mfs-stack">
        <div class="mfs-grid">
          <div class="mfs-card mfs-glow mfs-border-primary mfs-stack">
            <h4 class="mfs-title mfs-font-display mfs-m-0">Display Title</h4>
            <p class="mfs-caption mfs-m-0">Caption text paired with <code class="mfs-font-mono">.mfs-font-mono</code></p>
            <hr class="mfs-divider mfs-m-0" />
            <div class="mfs-row">
              <span class="mfs-pill mfs-soft-primary mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Primary</span>
              <span class="mfs-pill mfs-soft-secondary mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Secondary</span>
              <span class="mfs-pill mfs-soft-success mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Success</span>
              <span class="mfs-pill mfs-soft-warning mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Warning</span>
              <span class="mfs-pill mfs-soft-danger mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Danger</span>
            </div>
          </div>

          <div class="mfs-surface mfs-bevel mfs-backdrop mfs-rounded-lg mfs-stack mfs-p-5">
            <span class="mfs-title">Bevel &amp; Interactive States</span>
            <p class="mfs-caption mfs-m-0">Focus the button below to test <code class="mfs-font-mono">.mfs-focus-ring</code>.</p>
            <div class="mfs-row">
              <button
                type="button"
                class="mfs-surface-subtle mfs-rounded-md mfs-bevel mfs-focus-ring mfs-interactive mfs-px-3 mfs-py-2 mfs-text-sm mfs-font-semibold"
              >
                Focus Ring
              </button>
              <button
                type="button"
                class="mfs-surface-subtle mfs-rounded-md mfs-disabled mfs-px-3 mfs-py-2 mfs-text-sm mfs-font-semibold"
                disabled
              >
                Disabled
              </button>
            </div>
          </div>
        </div>
      </div>
    </ComponentPreview>

    <ComponentPreview
      title="Spacing, Flex, Borders & Typography Scale"
      description="Compose layouts with 4px-scale spacing, flex alignment, directional/semantic borders, radii, and typography scale."
      :code="layoutSnippetCode"
    >
      <div class="mfs-grid">
        <div class="mfs-card mfs-stack mfs-gap-3">
          <div class="mfs-flex mfs-items-center mfs-justify-between mfs-border-b mfs-py-2">
            <span class="mfs-text-sm mfs-font-semibold">Flex &amp; Directional Borders</span>
            <span class="mfs-text-xs mfs-text-muted mfs-font-mono">.mfs-border-b</span>
          </div>
          <div class="mfs-row-nowrap mfs-gap-2">
            <div class="mfs-flex-1 mfs-p-2 mfs-rounded-sm mfs-border-secondary mfs-text-xs mfs-truncate">
              Truncated flex-1 item with .mfs-border-secondary
            </div>
            <div class="mfs-divider-vertical" />
            <span class="mfs-text-xs mfs-font-bold mfs-text-secondary">Right</span>
          </div>
          <div class="mfs-row mfs-gap-2">
            <span class="mfs-px-2 mfs-py-1 mfs-rounded-none mfs-border-success mfs-text-xs mfs-text-success">Success</span>
            <span class="mfs-px-2 mfs-py-1 mfs-rounded-sm mfs-border-warning mfs-text-xs mfs-text-warning">Warning</span>
            <span class="mfs-px-2 mfs-py-1 mfs-rounded-md mfs-border-danger mfs-text-xs mfs-text-danger">Danger</span>
          </div>
        </div>

        <div class="mfs-surface mfs-rounded-lg mfs-shadow-none mfs-p-5 mfs-stack mfs-gap-2">
          <div class="mfs-text-lg mfs-font-bold mfs-font-sans">Heading (.mfs-text-lg)</div>
          <div class="mfs-text-base mfs-font-medium">Body (.mfs-text-base .mfs-font-medium)</div>
          <div class="mfs-text-sm mfs-text-muted">Muted (.mfs-text-sm .mfs-text-muted)</div>
          <div class="mfs-text-xs mfs-text-right mfs-font-mono mfs-text-primary">.mfs-text-right .mfs-shadow-none</div>
        </div>
      </div>
    </ComponentPreview>

    <ComponentPreview
      title="Positioning, Grid Columns &amp; Interaction"
      description="Compose fixed-column grids, circular badges, relative/absolute overlays, cursor states, and fine gaps without custom CSS."
      :code="interactionSnippetCode"
    >
      <div class="mfs-grid">
        <div class="mfs-card mfs-relative mfs-stack mfs-gap-2-5">
          <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-1-5">
            <span class="mfs-text-sm mfs-font-semibold mfs-whitespace-nowrap">3-Column Grid</span>
            <span class="mfs-rounded-full mfs-bg-primary mfs-px-2 mfs-py-1 mfs-text-xs mfs-font-bold mfs-select-none">3</span>
          </div>
          <div class="mfs-grid mfs-grid-cols-3 mfs-gap-1-5">
            <div class="mfs-inset mfs-p-2 mfs-text-xs mfs-text-center mfs-font-mono">1</div>
            <div class="mfs-inset mfs-p-2 mfs-text-xs mfs-text-center mfs-font-mono">2</div>
            <div class="mfs-inset mfs-p-2 mfs-text-xs mfs-text-center mfs-font-mono">3</div>
          </div>
          <div class="mfs-flex mfs-items-center mfs-gap-2 mfs-pt-1">
            <button
              type="button"
              class="mfs-surface-subtle mfs-rounded-sm mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-semibold mfs-cursor-pointer mfs-transition"
            >
              .mfs-cursor-pointer
            </button>
            <button
              type="button"
              class="mfs-surface-subtle mfs-rounded-sm mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-semibold mfs-cursor-not-allowed mfs-text-muted"
              disabled
            >
              .mfs-cursor-not-allowed
            </button>
          </div>
        </div>

        <div class="mfs-surface mfs-rounded-lg mfs-p-5 mfs-stack mfs-gap-2">
          <div class="mfs-flex mfs-items-end mfs-justify-between mfs-border-b mfs-pb-2">
            <span class="mfs-text-sm mfs-font-semibold mfs-text-left">.mfs-items-end</span>
            <span class="mfs-text-xs mfs-text-muted mfs-font-mono mfs-shrink-0">.mfs-shrink-0</span>
          </div>
          <div class="mfs-overflow-x-auto mfs-inset mfs-p-2 mfs-text-xs mfs-font-mono mfs-whitespace-nowrap">
            .mfs-overflow-x-auto .mfs-whitespace-nowrap — horizontal scroll container without wrapping
          </div>
          <div class="mfs-flex mfs-items-center mfs-gap-2">
            <input
              type="text"
              readonly
              value=".mfs-bg-transparent .mfs-outline-none"
              class="mfs-bg-transparent mfs-outline-none mfs-border mfs-rounded-sm mfs-px-2 mfs-py-1 mfs-text-xs mfs-font-mono mfs-w-full"
            />
          </div>
        </div>
      </div>
    </ComponentPreview>

    <section class="mfs-surface mfs-rounded-lg mfs-shadow mfs-overflow-hidden">
      <header class="mfs-px-5 mfs-py-4 mfs-border-b">
        <h3 class="mfs-title mfs-text-base mfs-m-0">Utility Class Cheat Sheet</h3>
        <p class="mfs-caption mfs-mt-1 mfs-mb-0">All {{ utilityRows.length }} `.mfs-*` classes included in `@mfs-atomic/ui`.</p>
      </header>

      <div class="mfs-overflow-x-auto">
        <table class="cheatsheet-table mfs-w-full mfs-text-sm mfs-text-left">
          <thead>
            <tr>
              <th>Class</th>
              <th>Category</th>
              <th>Purpose</th>
              <th>Copy</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in utilityRows" :key="row.name">
              <td><code class="mfs-font-mono mfs-text-xs mfs-font-semibold mfs-text-primary">.{{ row.name }}</code></td>
              <td><span class="mfs-pill mfs-surface-subtle mfs-text-xs mfs-font-semibold mfs-text-muted mfs-px-2 mfs-py-1">{{ row.category }}</span></td>
              <td class="mfs-text-muted">{{ row.purpose }}</td>
              <td>
                <button
                  type="button"
                  class="mini-copy-btn mfs-inline-flex mfs-items-center mfs-gap-1 mfs-px-2 mfs-py-1 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-font-semibold mfs-interactive"
                  :class="{ 'is-copied': copiedClass === row.name }"
                  :aria-label="`Copy ${row.name}`"
                  @click="copyClass(row.name)"
                >
                  <Check v-if="copiedClass === row.name" :size="13" />
                  <Copy v-else :size="13" />
                  <span>{{ copiedClass === row.name ? 'Copied' : 'Copy' }}</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import ComponentPreview from '../ComponentPreview.vue'

defineProps<{
  activeSlug?: string
}>()

const sampleText = ref('MFS Utilities')
const clicks = ref(0)
const copiedClass = ref<string | null>(null)
let timer: ReturnType<typeof setTimeout> | null = null

const copyClass = async (name: string) => {
  try {
    await navigator.clipboard.writeText(name)
    copiedClass.value = name
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      copiedClass.value = null
    }, 1400)
  } catch {
    // Ignore clipboard errors in restricted environments
  }
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})

const snippetCode = `<div class="mfs-grid">
  <div class="mfs-card mfs-stack">
    <div class="mfs-row">
      <strong class="mfs-text">Surface Card</strong>
      <span class="mfs-pill mfs-bg-primary">Primary</span>
    </div>
    <p class="mfs-text-muted">Adapts to Clay, Glass, and Neo.</p>
  </div>

  <div class="mfs-surface mfs-rounded-lg mfs-shadow mfs-stack">
    <input class="mfs-inset" placeholder="Inset input..." />
    <button class="mfs-surface-subtle mfs-rounded-md mfs-shadow mfs-interactive">
      Interactive
    </button>
  </div>
</div>`

const extendedSnippetCode = `<div class="mfs-card mfs-glow mfs-border-primary mfs-stack">
  <h4 class="mfs-title mfs-font-display mfs-m-0">Display Title</h4>
  <p class="mfs-caption mfs-m-0">Monospace: <code class="mfs-font-mono">v0.1.0</code></p>
  <hr class="mfs-divider mfs-m-0" />
  <div class="mfs-row">
    <span class="mfs-pill mfs-soft-primary mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Primary</span>
    <span class="mfs-pill mfs-soft-secondary mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Secondary</span>
    <span class="mfs-pill mfs-soft-success mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Success</span>
    <span class="mfs-pill mfs-soft-warning mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Warning</span>
    <span class="mfs-pill mfs-soft-danger mfs-px-3 mfs-py-1 mfs-text-xs mfs-font-bold">Soft Danger</span>
  </div>
</div>

<div class="mfs-surface mfs-bevel mfs-backdrop mfs-rounded-lg mfs-p-5 mfs-row">
  <button class="mfs-bevel mfs-focus-ring mfs-interactive mfs-px-3 mfs-py-2">Focus Ring</button>
  <button class="mfs-disabled mfs-px-3 mfs-py-2" disabled>Disabled</button>
</div>`

const layoutSnippetCode = `<div class="mfs-card mfs-stack mfs-gap-3">
  <div class="mfs-flex mfs-items-center mfs-justify-between mfs-border-b mfs-py-2">
    <span class="mfs-text-sm mfs-font-semibold">Flex & Directional Borders</span>
    <span class="mfs-text-xs mfs-text-muted mfs-font-mono">.mfs-border-b</span>
  </div>
  <div class="mfs-row-nowrap mfs-gap-2">
    <div class="mfs-flex-1 mfs-p-2 mfs-rounded-sm mfs-border-secondary mfs-truncate">
      Truncated flex-1 item
    </div>
    <div class="mfs-divider-vertical" />
    <span class="mfs-text-xs mfs-font-bold mfs-text-secondary">Right</span>
  </div>
</div>`

const interactionSnippetCode = `<div class="mfs-card mfs-relative mfs-stack mfs-gap-2-5">
  <div class="mfs-grid mfs-grid-cols-3 mfs-gap-1-5">
    <div class="mfs-inset mfs-p-2 mfs-text-center">1</div>
    <div class="mfs-inset mfs-p-2 mfs-text-center">2</div>
    <div class="mfs-inset mfs-p-2 mfs-text-center">3</div>
  </div>
  <button class="mfs-cursor-pointer mfs-transition mfs-select-none">Interactive</button>
</div>`

const spacingRows = [
  ...[0, 1, 2, 3, 4, 5, 6, 8].map((n) => ({ name: `mfs-p-${n}`, category: 'Spacing', purpose: `All-sides padding (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 5, 6, 8].map((n) => ({ name: `mfs-px-${n}`, category: 'Spacing', purpose: `Horizontal inline padding (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 5, 6, 8].map((n) => ({ name: `mfs-py-${n}`, category: 'Spacing', purpose: `Vertical block padding (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-pt-${n}`, category: 'Spacing', purpose: `Top padding (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-pb-${n}`, category: 'Spacing', purpose: `Bottom padding (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-pl-${n}`, category: 'Spacing', purpose: `Left padding (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-pr-${n}`, category: 'Spacing', purpose: `Right padding (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-m-${n}`, category: 'Spacing', purpose: `All-sides margin (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-mt-${n}`, category: 'Spacing', purpose: `Top margin (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-mb-${n}`, category: 'Spacing', purpose: `Bottom margin (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-ml-${n}`, category: 'Spacing', purpose: `Left margin (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-mr-${n}`, category: 'Spacing', purpose: `Right margin (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-mx-${n}`, category: 'Spacing', purpose: `Horizontal inline margin (${n * 4}px)` })),
  ...[0, 1, 2, 3, 4, 6].map((n) => ({ name: `mfs-my-${n}`, category: 'Spacing', purpose: `Vertical block margin (${n * 4}px)` })),
  { name: 'mfs-gap-1', category: 'Spacing', purpose: 'Flex/grid gap (4px)' },
  { name: 'mfs-gap-1-5', category: 'Spacing', purpose: 'Flex/grid gap (6px)' },
  { name: 'mfs-gap-2', category: 'Spacing', purpose: 'Flex/grid gap (8px)' },
  { name: 'mfs-gap-2-5', category: 'Spacing', purpose: 'Flex/grid gap (10px)' },
  { name: 'mfs-gap-3', category: 'Spacing', purpose: 'Flex/grid gap (12px)' },
  { name: 'mfs-gap-4', category: 'Spacing', purpose: 'Flex/grid gap (16px)' },
  { name: 'mfs-gap-6', category: 'Spacing', purpose: 'Flex/grid gap (24px)' }
]

const utilityRows = [
  { name: 'mfs-bg', category: 'Surface', purpose: 'Theme page background gradient and base text color' },
  { name: 'mfs-surface', category: 'Surface', purpose: 'Primary surface background, border, and backdrop blur' },
  { name: 'mfs-surface-subtle', category: 'Surface', purpose: 'Subtle secondary surface with theme border' },
  { name: 'mfs-card', category: 'Surface', purpose: 'Full card surface with radius, card shadow, and padding' },
  { name: 'mfs-inset', category: 'Surface', purpose: 'Recessed input/well surface with inset shadow' },
  { name: 'mfs-shadow', category: 'Shadow', purpose: 'Standard theme elevation shadow (--clay-shadow)' },
  { name: 'mfs-shadow-card', category: 'Shadow', purpose: 'Card-level elevation shadow (--card-shadow)' },
  { name: 'mfs-shadow-inset', category: 'Shadow', purpose: 'Recessed inset shadow (--input-shadow)' },
  { name: 'mfs-shadow-none', category: 'Shadow', purpose: 'Remove box-shadow (box-shadow: none)' },
  { name: 'mfs-blur', category: 'Shadow', purpose: 'Theme backdrop blur filter' },
  { name: 'mfs-interactive', category: 'Shadow', purpose: 'Hover lift and active press tactile shadow feedback' },
  { name: 'mfs-transition', category: 'Interaction', purpose: 'Standard 0.2s ease transition across properties' },
  { name: 'mfs-cursor-pointer', category: 'Interaction', purpose: 'Pointer cursor for interactive elements' },
  { name: 'mfs-cursor-not-allowed', category: 'Interaction', purpose: 'Not-allowed cursor for disabled/blocked elements' },
  { name: 'mfs-select-none', category: 'Interaction', purpose: 'Disable text selection (user-select: none)' },
  { name: 'mfs-rounded', category: 'Radius', purpose: 'Theme default border radius (--radius)' },
  { name: 'mfs-rounded-sm', category: 'Radius', purpose: 'Small border radius (--radius-sm)' },
  { name: 'mfs-rounded-md', category: 'Radius', purpose: 'Medium border radius (--radius-md)' },
  { name: 'mfs-rounded-lg', category: 'Radius', purpose: 'Large border radius (--radius-lg)' },
  { name: 'mfs-rounded-none', category: 'Radius', purpose: 'Zero border radius (border-radius: 0)' },
  { name: 'mfs-rounded-full', category: 'Radius', purpose: 'Circular border radius (50%)' },
  { name: 'mfs-pill', category: 'Radius', purpose: 'Full pill border radius (9999px)' },
  { name: 'mfs-border', category: 'Border', purpose: 'All-sides theme border (--border)' },
  { name: 'mfs-border-t', category: 'Border', purpose: 'Top theme border (--border)' },
  { name: 'mfs-border-b', category: 'Border', purpose: 'Bottom theme border (--border)' },
  { name: 'mfs-border-l', category: 'Border', purpose: 'Left theme border (--border)' },
  { name: 'mfs-border-r', category: 'Border', purpose: 'Right theme border (--border)' },
  { name: 'mfs-border-none', category: 'Border', purpose: 'Remove border (border: 0)' },
  { name: 'mfs-border-primary', category: 'Border', purpose: 'Semantic primary accent border' },
  { name: 'mfs-border-secondary', category: 'Border', purpose: 'Semantic secondary accent border' },
  { name: 'mfs-border-success', category: 'Border', purpose: 'Semantic success accent border' },
  { name: 'mfs-border-warning', category: 'Border', purpose: 'Semantic warning accent border' },
  { name: 'mfs-border-danger', category: 'Border', purpose: 'Semantic danger accent border' },
  { name: 'mfs-text', category: 'Color', purpose: 'Primary theme text color' },
  { name: 'mfs-text-muted', category: 'Color', purpose: 'Muted secondary text color' },
  { name: 'mfs-text-primary', category: 'Color', purpose: 'Primary accent text color' },
  { name: 'mfs-text-secondary', category: 'Color', purpose: 'Secondary accent text color' },
  { name: 'mfs-text-success', category: 'Color', purpose: 'Success semantic text color' },
  { name: 'mfs-text-warning', category: 'Color', purpose: 'Warning semantic text color' },
  { name: 'mfs-text-danger', category: 'Color', purpose: 'Danger semantic text color' },
  { name: 'mfs-bg-primary', category: 'Color', purpose: 'Primary accent background + contrast text' },
  { name: 'mfs-bg-secondary', category: 'Color', purpose: 'Secondary accent background + contrast text' },
  { name: 'mfs-bg-success', category: 'Color', purpose: 'Success background + contrast text' },
  { name: 'mfs-bg-warning', category: 'Color', purpose: 'Warning background + contrast text' },
  { name: 'mfs-bg-danger', category: 'Color', purpose: 'Danger background + contrast text' },
  { name: 'mfs-bg-transparent', category: 'Color', purpose: 'Transparent background color' },
  { name: 'mfs-soft-primary', category: 'Color', purpose: 'Soft tinted primary background + primary text' },
  { name: 'mfs-soft-secondary', category: 'Color', purpose: 'Soft tinted secondary background + secondary text' },
  { name: 'mfs-soft-success', category: 'Color', purpose: 'Soft tinted success background + success text' },
  { name: 'mfs-soft-warning', category: 'Color', purpose: 'Soft tinted warning background + warning text' },
  { name: 'mfs-soft-danger', category: 'Color', purpose: 'Soft tinted danger background + danger text' },
  { name: 'mfs-relative', category: 'Position', purpose: 'Relative positioning context (position: relative)' },
  { name: 'mfs-absolute', category: 'Position', purpose: 'Absolute positioning (position: absolute)' },
  { name: 'mfs-fixed', category: 'Position', purpose: 'Viewport-fixed positioning (position: fixed)' },
  { name: 'mfs-inset-0', category: 'Position', purpose: 'Pin all four edges to zero (inset: 0)' },
  { name: 'mfs-container', category: 'Layout', purpose: 'Centered max-width container with inline padding' },
  { name: 'mfs-stack', category: 'Layout', purpose: 'Vertical flex column with 16px gap' },
  { name: 'mfs-row', category: 'Layout', purpose: 'Horizontal wrapping flex row with 12px gap' },
  { name: 'mfs-row-nowrap', category: 'Layout', purpose: 'Horizontal non-wrapping flex row with 12px gap' },
  { name: 'mfs-flex', category: 'Layout', purpose: 'Display flex container' },
  { name: 'mfs-inline-flex', category: 'Layout', purpose: 'Display inline-flex container' },
  { name: 'mfs-flex-col', category: 'Layout', purpose: 'Flex direction column' },
  { name: 'mfs-flex-wrap', category: 'Layout', purpose: 'Allow flex items to wrap' },
  { name: 'mfs-items-center', category: 'Layout', purpose: 'Align flex items vertically centered' },
  { name: 'mfs-items-start', category: 'Layout', purpose: 'Align flex items to start' },
  { name: 'mfs-items-end', category: 'Layout', purpose: 'Align flex items to flex-end' },
  { name: 'mfs-justify-start', category: 'Layout', purpose: 'Justify flex items to flex-start' },
  { name: 'mfs-justify-between', category: 'Layout', purpose: 'Justify flex items with space-between' },
  { name: 'mfs-justify-center', category: 'Layout', purpose: 'Justify flex items centered' },
  { name: 'mfs-justify-end', category: 'Layout', purpose: 'Justify flex items to flex-end' },
  { name: 'mfs-flex-1', category: 'Layout', purpose: 'Flexible grow/shrink item (flex: 1 1 0%)' },
  { name: 'mfs-shrink-0', category: 'Layout', purpose: 'Prevent flex item shrinking (flex-shrink: 0)' },
  { name: 'mfs-min-w-0', category: 'Layout', purpose: 'Allow flex/grid item to shrink below content width' },
  { name: 'mfs-w-full', category: 'Layout', purpose: 'Full width (width: 100%)' },
  { name: 'mfs-h-full', category: 'Layout', purpose: 'Full height (height: 100%)' },
  { name: 'mfs-grid', category: 'Layout', purpose: 'Responsive auto-fit CSS grid (min 220px)' },
  { name: 'mfs-grid-cols-2', category: 'Layout', purpose: 'Fixed 2-column CSS grid template' },
  { name: 'mfs-grid-cols-3', category: 'Layout', purpose: 'Fixed 3-column CSS grid template' },
  { name: 'mfs-grid-cols-4', category: 'Layout', purpose: 'Fixed 4-column CSS grid template' },
  { name: 'mfs-font-sans', category: 'Typography', purpose: 'Theme sans-serif font family (--font-sans)' },
  { name: 'mfs-font-display', category: 'Typography', purpose: 'Theme display font family (--font-display)' },
  { name: 'mfs-font-mono', category: 'Typography', purpose: 'Monospace font family (--font-mono)' },
  { name: 'mfs-text-xs', category: 'Typography', purpose: 'Extra small text (0.75rem)' },
  { name: 'mfs-text-sm', category: 'Typography', purpose: 'Small text (0.875rem)' },
  { name: 'mfs-text-base', category: 'Typography', purpose: 'Base text (1rem)' },
  { name: 'mfs-text-lg', category: 'Typography', purpose: 'Large text (1.125rem)' },
  { name: 'mfs-font-medium', category: 'Typography', purpose: 'Medium font weight (500)' },
  { name: 'mfs-font-semibold', category: 'Typography', purpose: 'Semibold font weight (600)' },
  { name: 'mfs-font-bold', category: 'Typography', purpose: 'Bold font weight (700)' },
  { name: 'mfs-text-left', category: 'Typography', purpose: 'Left-aligned text' },
  { name: 'mfs-text-center', category: 'Typography', purpose: 'Center-aligned text' },
  { name: 'mfs-text-right', category: 'Typography', purpose: 'Right-aligned text' },
  { name: 'mfs-whitespace-nowrap', category: 'Typography', purpose: 'Prevent text line wrapping (white-space: nowrap)' },
  { name: 'mfs-truncate', category: 'Typography', purpose: 'Single-line ellipsis text truncation' },
  { name: 'mfs-title', category: 'Typography', purpose: 'Display heading font, bold weight, and text color' },
  { name: 'mfs-caption', category: 'Typography', purpose: 'Compact muted caption text style' },
  { name: 'mfs-glow', category: 'Effect', purpose: 'Theme-adaptive outer glow shadow (--glow)' },
  { name: 'mfs-bevel', category: 'Effect', purpose: '3D top/bottom specular bevel highlight' },
  { name: 'mfs-backdrop', category: 'Effect', purpose: 'Translucent modal/overlay backdrop blur' },
  { name: 'mfs-outline-none', category: 'State', purpose: 'Remove default focus outline (outline: none)' },
  { name: 'mfs-focus-ring', category: 'State', purpose: 'Accessible :focus-visible outline using --primary' },
  { name: 'mfs-disabled', category: 'State', purpose: 'Muted opacity and pointer-events: none state' },
  { name: 'mfs-divider', category: 'State', purpose: 'Horizontal 1px theme-colored hairline separator' },
  { name: 'mfs-divider-vertical', category: 'State', purpose: 'Vertical 1px theme-colored hairline separator' },
  { name: 'mfs-overflow-hidden', category: 'State', purpose: 'Clip overflowing content (overflow: hidden)' },
  { name: 'mfs-overflow-auto', category: 'State', purpose: 'Scrollable overflow in both axes (overflow: auto)' },
  { name: 'mfs-overflow-x-auto', category: 'State', purpose: 'Horizontal scroll on overflow (overflow-x: auto)' },
  { name: 'mfs-overflow-y-auto', category: 'State', purpose: 'Vertical scroll on overflow (overflow-y: auto)' },
  { name: 'mfs-sr-only', category: 'State', purpose: 'Visually hidden screen-reader-only utility' },
  ...spacingRows
]
</script>

<style scoped>
.cheatsheet-table {
  border-collapse: collapse;
}

.cheatsheet-table th,
.cheatsheet-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  vertical-align: middle;
}

.cheatsheet-table th {
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  background: var(--surface-subtle);
}

.cheatsheet-table tbody tr:last-child td {
  border-bottom: none;
}

.mini-copy-btn:hover,
.mini-copy-btn.is-copied {
  border-color: var(--primary);
  color: var(--primary);
}
</style>
