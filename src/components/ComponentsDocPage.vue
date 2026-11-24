<template>
  <div class="docs-shell mfs-container">
    <!-- Mobile component switcher -->
    <div class="mobile-switcher mfs-mb-4 mfs-p-3 mfs-rounded-md mfs-surface mfs-shadow">
      <label class="mobile-switcher-label mfs-font-bold mfs-text-muted mfs-mb-2" for="mobile-comp-select">Component</label>
      <div>
        <select
          id="mobile-comp-select"
          class="mobile-select mfs-w-full mfs-rounded-sm mfs-surface-subtle mfs-font-semibold"
          :value="activeItem.slug"
          @change="onMobileSelect"
        >
          <optgroup
            v-for="group in allGroups"
            :key="group.phase"
            :label="group.title"
          >
            <option
              v-for="item in group.items"
              :key="item.slug"
              :value="item.slug"
            >
              {{ item.name }} ({{ item.category }})
            </option>
          </optgroup>
        </select>
      </div>
    </div>

    <div class="docs-layout mfs-items-start">
      <!-- Desktop sticky sidebar -->
      <aside class="docs-sidebar mfs-flex mfs-flex-col mfs-gap-4 mfs-p-5 mfs-rounded-lg mfs-surface mfs-shadow" aria-label="Components navigation">
        <div class="mfs-relative mfs-flex mfs-items-center">
          <Search :size="15" class="sidebar-search-icon mfs-absolute mfs-text-muted" />
          <input
            v-model="searchQuery"
            type="search"
            class="sidebar-search mfs-w-full mfs-rounded-sm mfs-surface-subtle mfs-shadow-inset"
            placeholder="Filter components..."
            aria-label="Filter components"
          />
        </div>

        <nav class="sidebar-groups mfs-flex mfs-flex-col mfs-overflow-y-auto mfs-pr-2">
          <Accordion
            v-if="sidebarAccordionItems.length > 0"
            v-model="openGroupKeys"
            multiple
            :items="sidebarAccordionItems"
          >
            <template #item="{ item }">
              <ul class="sidebar-list mfs-flex mfs-flex-col mfs-p-0 mfs-m-0">
                <li v-for="navItem in groupItemsByKey.get(item.key) ?? []" :key="navItem.slug">
                  <button
                    type="button"
                    class="sidebar-link mfs-w-full mfs-flex mfs-items-center mfs-border-none mfs-rounded-sm mfs-font-medium mfs-bg-transparent mfs-text-left mfs-cursor-pointer mfs-transition"
                    :class="{ 'is-active': navItem.slug === activeItem.slug }"
                    :aria-current="navItem.slug === activeItem.slug ? 'page' : undefined"
                    @click="emit('select', navItem.slug)"
                  >
                    <span class="mfs-truncate">{{ navItem.name }}</span>
                  </button>
                </li>
              </ul>
            </template>
          </Accordion>

          <p v-if="filteredGroups.length === 0" class="sidebar-empty mfs-text-muted">
            No components match "{{ searchQuery }}".
          </p>
        </nav>
      </aside>

      <!-- Main documentation content -->
      <div class="docs-main mfs-min-w-0 mfs-flex mfs-flex-col">
        <header class="docs-header mfs-p-6 mfs-rounded-lg mfs-surface mfs-shadow">
          <div class="mfs-flex mfs-flex-wrap mfs-items-center mfs-gap-3">
            <h1 class="docs-title mfs-text mfs-m-0">{{ activeItem.name }}</h1>
            <span class="docs-category-badge mfs-font-bold mfs-pill mfs-border mfs-surface-subtle mfs-text-primary">{{ activeItem.category }}</span>
            <span class="mfs-font-bold mfs-pill mfs-soft-success mfs-text-xs mfs-px-3 mfs-py-1">Ready</span>
          </div>

          <p class="docs-summary mfs-text-muted mfs-mt-3 mfs-mb-0">{{ activeItem.summary }}</p>

          <!-- OpenVue-style Import Bar -->
          <div class="mfs-mt-4 mfs-px-3 mfs-py-2 mfs-rounded-md mfs-surface-subtle mfs-border mfs-flex mfs-items-center mfs-justify-between mfs-gap-3">
            <div class="mfs-flex mfs-items-center mfs-gap-3 mfs-min-w-0 mfs-flex-1">
              <span class="docs-import-label mfs-text-xs mfs-font-bold mfs-text-muted mfs-surface mfs-border mfs-rounded-sm mfs-px-2 mfs-py-1 mfs-shrink-0">Import</span>
              <code class="mfs-font-mono mfs-text-xs mfs-text mfs-truncate">{{ importStatement }}</code>
            </div>
            <button
              type="button"
              class="import-copy-btn mfs-inline-flex mfs-items-center mfs-gap-1-5 mfs-px-3 mfs-py-1 mfs-rounded-sm mfs-surface mfs-text-xs mfs-font-semibold mfs-cursor-pointer mfs-transition mfs-shrink-0"
              :class="{ 'is-copied': copiedImport }"
              :aria-label="copiedImport ? 'Import copied' : 'Copy import statement'"
              @click="copyImport"
            >
              <Check v-if="copiedImport" :size="13" />
              <Copy v-else :size="13" />
              <span>{{ copiedImport ? 'Copied!' : 'Copy' }}</span>
            </button>
          </div>
        </header>

        <!-- Top-level OpenVue-style Documentation Tabs -->
        <nav
          class="docs-tabs mfs-inline-flex mfs-items-center mfs-gap-1 mfs-p-1 mfs-rounded-md mfs-surface mfs-shadow"
          role="tablist"
          aria-label="Component documentation sections"
        >
          <button
            v-for="tabItem in docTabs"
            :key="tabItem.key"
            type="button"
            role="tab"
            class="docs-tab-btn mfs-border-none mfs-bg-transparent mfs-rounded-sm mfs-font-semibold mfs-text-sm mfs-text-muted mfs-cursor-pointer mfs-transition mfs-inline-flex mfs-items-center mfs-gap-2"
            :class="{ 'is-active': activeTab === tabItem.key }"
            :aria-selected="activeTab === tabItem.key"
            @click="activeTab = tabItem.key"
          >
            <span>{{ tabItem.label }}</span>
            <span
              v-if="tabItem.key === 'api' && apiRowCount > 0"
              class="docs-tab-count mfs-pill mfs-text-xs mfs-font-bold mfs-px-2"
            >
              {{ apiRowCount }}
            </span>
          </button>
        </nav>

        <!-- Features Tab -->
        <div v-show="activeTab === 'features'" class="docs-body mfs-flex mfs-flex-col">
          <component :is="activePhaseDemo" :active-slug="activeItem.slug" />
        </div>

        <!-- Accessibility Card (Features tab) -->
        <section
          v-if="activeTab === 'features' && activeItemA11y && (activeItemA11y.keyboard?.length || activeItemA11y.aria?.length)"
          class="mfs-card mfs-stack mfs-gap-4"
          aria-labelledby="docs-a11y-heading"
        >
          <h2 id="docs-a11y-heading" class="mfs-title mfs-text-base mfs-m-0">Accessibility</h2>
          <div class="mfs-grid mfs-gap-4">
            <div v-if="activeItemA11y.keyboard?.length" class="mfs-surface-subtle mfs-rounded-md mfs-p-4 mfs-stack mfs-gap-2">
              <h3 class="a11y-subhead mfs-font-bold mfs-text-muted mfs-m-0">Keyboard Support</h3>
              <ul class="a11y-list mfs-flex mfs-flex-col mfs-gap-2 mfs-m-0 mfs-p-0">
                <li
                  v-for="(item, idx) in activeItemA11y.keyboard"
                  :key="idx"
                  class="mfs-text-sm mfs-text mfs-flex mfs-items-start mfs-gap-2"
                >
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <div v-if="activeItemA11y.aria?.length" class="mfs-surface-subtle mfs-rounded-md mfs-p-4 mfs-stack mfs-gap-2">
              <h3 class="a11y-subhead mfs-font-bold mfs-text-muted mfs-m-0">ARIA Attributes</h3>
              <ul class="a11y-list mfs-flex mfs-flex-col mfs-gap-2 mfs-m-0 mfs-p-0">
                <li
                  v-for="(attr, idx) in activeItemA11y.aria"
                  :key="idx"
                  class="mfs-text-sm mfs-text"
                >
                  <code class="mfs-font-mono mfs-text-xs mfs-text-primary mfs-font-semibold">{{ attr }}</code>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <!-- API Tab -->
        <section
          v-if="activeTab === 'api'"
          class="mfs-card mfs-stack mfs-gap-6"
          aria-labelledby="docs-api-heading"
        >
          <div class="mfs-flex mfs-flex-wrap mfs-items-center mfs-justify-between mfs-gap-3">
            <div>
              <h2 id="docs-api-heading" class="mfs-title mfs-text-lg mfs-m-0">{{ activeItem.name }} API</h2>
              <p class="mfs-text-sm mfs-text-muted mfs-mt-1 mfs-mb-0">
                Props, emitted events, slots, and accessibility attributes for {{ activeItem.name }}.
              </p>
            </div>
          </div>

          <template v-if="apiSections.length">
            <div
              v-for="section in apiSections"
              :key="section.key"
              class="mfs-stack mfs-gap-3"
            >
              <div class="mfs-flex mfs-items-center mfs-gap-2">
                <h3 class="mfs-title mfs-text-base mfs-m-0">{{ section.label }}</h3>
                <span class="mfs-pill mfs-soft-primary mfs-text-xs mfs-font-bold mfs-px-2 mfs-py-1">
                  {{ section.rows.length }}
                </span>
              </div>

              <div class="mfs-rounded-md mfs-surface-subtle mfs-border mfs-overflow-x-auto">
                <table class="docs-table mfs-w-full mfs-text-left">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th v-if="section.showType">Type</th>
                      <th v-if="section.showDefault">Default</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in section.rows" :key="row.name">
                      <td><code class="mfs-font-mono mfs-text-xs mfs-text-primary mfs-font-semibold">{{ row.name }}</code></td>
                      <td v-if="section.showType">
                        <code v-if="row.type" class="mfs-font-mono mfs-text-xs mfs-text-muted">{{ row.type }}</code>
                        <span v-else class="mfs-text-muted">—</span>
                      </td>
                      <td v-if="section.showDefault">
                        <code v-if="row.default" class="mfs-font-mono mfs-text-xs mfs-text-muted">{{ row.default }}</code>
                        <span v-else class="mfs-text-muted">—</span>
                      </td>
                      <td class="mfs-text-sm mfs-text">{{ row.description }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </template>

          <div
            v-else
            class="mfs-surface-subtle mfs-rounded-md mfs-p-6 mfs-text-center mfs-stack mfs-gap-2"
          >
            <p class="mfs-text-sm mfs-font-semibold mfs-text mfs-m-0">No component API props, events, or slots</p>
            <p class="mfs-text-xs mfs-text-muted mfs-m-0">
              {{ activeItem.name }} is a CSS/utility or presentational feature without reactive component bindings.
            </p>
          </div>

          <div
            v-if="activeItemA11y && (activeItemA11y.keyboard?.length || activeItemA11y.aria?.length)"
            class="mfs-stack mfs-gap-3 mfs-pt-2 mfs-border-none mfs-border-t"
          >
            <h3 class="mfs-title mfs-text-base mfs-m-0">Accessibility</h3>
            <div class="mfs-grid mfs-gap-4">
              <div v-if="activeItemA11y.keyboard?.length" class="mfs-surface-subtle mfs-rounded-md mfs-p-4 mfs-stack mfs-gap-2">
                <h4 class="a11y-subhead mfs-font-bold mfs-text-muted mfs-m-0">Keyboard Support</h4>
                <ul class="a11y-list mfs-flex mfs-flex-col mfs-gap-2 mfs-m-0 mfs-p-0">
                  <li
                    v-for="(item, idx) in activeItemA11y.keyboard"
                    :key="idx"
                    class="mfs-text-sm mfs-text"
                  >
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div v-if="activeItemA11y.aria?.length" class="mfs-surface-subtle mfs-rounded-md mfs-p-4 mfs-stack mfs-gap-2">
                <h4 class="a11y-subhead mfs-font-bold mfs-text-muted mfs-m-0">ARIA Attributes</h4>
                <ul class="a11y-list mfs-flex mfs-flex-col mfs-gap-2 mfs-m-0 mfs-p-0">
                  <li
                    v-for="(attr, idx) in activeItemA11y.aria"
                    :key="idx"
                    class="mfs-text-sm mfs-text"
                  >
                    <code class="mfs-font-mono mfs-text-xs mfs-text-primary mfs-font-semibold">{{ attr }}</code>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Theming Tab -->
        <section
          v-if="activeTab === 'theming'"
          class="mfs-card mfs-stack mfs-gap-6"
          aria-labelledby="docs-theming-heading"
        >
          <div class="mfs-stack mfs-gap-1">
            <h2 id="docs-theming-heading" class="mfs-title mfs-text-lg mfs-m-0">Theming &amp; Design Tokens</h2>
            <p class="mfs-text-sm mfs-text-muted mfs-m-0">
              All components adapt automatically when switching themes via <code class="mfs-font-mono mfs-text-xs mfs-text-primary">useTheme()</code> or the <code class="mfs-font-mono mfs-text-xs mfs-text-primary">[data-theme="..."]</code> attribute.
            </p>
          </div>

          <!-- Theme Switching -->
          <div class="mfs-surface-subtle mfs-rounded-md mfs-p-4 mfs-stack mfs-gap-3">
            <h3 class="mfs-title mfs-text-base mfs-m-0">Runtime Theme Switching</h3>
            <p class="mfs-text-sm mfs-text-muted mfs-m-0">
              Call <code class="mfs-font-mono mfs-text-xs mfs-text-primary">setTheme()</code> from <code class="mfs-font-mono mfs-text-xs mfs-text-primary">useTheme()</code> to toggle between <code class="mfs-font-mono mfs-text-xs">clay</code>, <code class="mfs-font-mono mfs-text-xs">glass</code>, <code class="mfs-font-mono mfs-text-xs">neo</code>, and other built-in themes.
            </p>
            <pre class="theming-code mfs-m-0 mfs-p-4 mfs-rounded-sm mfs-surface mfs-border mfs-font-mono mfs-text-xs mfs-text mfs-overflow-x-auto"><code>{{ themeSwitchSnippet }}</code></pre>
          </div>

          <!-- Semantic CSS Tokens Table -->
          <div class="mfs-stack mfs-gap-3">
            <h3 class="mfs-title mfs-text-base mfs-m-0">Key Semantic CSS Tokens</h3>
            <div class="mfs-rounded-md mfs-surface-subtle mfs-border mfs-overflow-x-auto">
              <table class="docs-table mfs-w-full mfs-text-left">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Preview</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="token in themeTokens" :key="token.name">
                    <td><code class="mfs-font-mono mfs-text-xs mfs-text-primary mfs-font-semibold">{{ token.name }}</code></td>
                    <td>
                      <span
                        class="token-swatch mfs-inline-flex mfs-border mfs-rounded-sm"
                        :style="token.previewStyle"
                        :aria-label="token.name"
                      />
                    </td>
                    <td class="mfs-text-sm mfs-text">{{ token.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- CSS Override Snippet -->
          <div class="mfs-surface-subtle mfs-rounded-md mfs-p-4 mfs-stack mfs-gap-3">
            <h3 class="mfs-title mfs-text-base mfs-m-0">Custom CSS Override</h3>
            <pre class="theming-code mfs-m-0 mfs-p-4 mfs-rounded-sm mfs-surface mfs-border mfs-font-mono mfs-text-xs mfs-text mfs-overflow-x-auto"><code>{{ themeOverrideSnippet }}</code></pre>
          </div>

          <!-- Core .mfs-* Utilities Quick Reference -->
          <div class="mfs-surface-subtle mfs-rounded-md mfs-p-4 mfs-stack mfs-gap-3">
            <div class="mfs-flex mfs-flex-wrap mfs-items-center mfs-justify-between mfs-gap-2">
              <h3 class="mfs-title mfs-text-base mfs-m-0">Core .mfs-* Utility Classes</h3>
              <a
                href="/components/utilities"
                class="mfs-text-xs mfs-font-semibold mfs-text-primary"
                @click.prevent="emit('select', 'utilities')"
              >
                View all Theme Utilities &rarr;
              </a>
            </div>
            <div class="mfs-flex mfs-flex-wrap mfs-gap-2">
              <code
                v-for="util in coreUtilities"
                :key="util"
                class="mfs-font-mono mfs-text-xs mfs-surface mfs-border mfs-rounded-sm mfs-px-2 mfs-py-1 mfs-text"
              >
                {{ util }}
              </code>
            </div>
          </div>
        </section>

        <footer class="mfs-pt-2 mfs-flex mfs-justify-between mfs-gap-3" aria-label="Component pagination">
          <button
            v-if="prevItem"
            type="button"
            class="pager-btn pager-prev mfs-inline-flex mfs-items-center mfs-gap-2-5 mfs-py-3 mfs-px-4 mfs-rounded-md mfs-surface mfs-shadow mfs-cursor-pointer mfs-transition"
            @click="emit('select', prevItem.slug)"
          >
            <ChevronLeft :size="16" />
            <div class="pager-meta mfs-flex mfs-flex-col mfs-text-left">
              <span class="pager-dir mfs-text-muted">Previous</span>
              <strong class="pager-name mfs-font-bold mfs-text">{{ prevItem.name }}</strong>
            </div>
          </button>
          <span v-else />

          <button
            v-if="nextItem"
            type="button"
            class="pager-btn pager-next mfs-inline-flex mfs-items-center mfs-gap-2-5 mfs-py-3 mfs-px-4 mfs-rounded-md mfs-surface mfs-shadow mfs-cursor-pointer mfs-transition"
            @click="emit('select', nextItem.slug)"
          >
            <div class="pager-meta mfs-flex mfs-flex-col mfs-text-right">
              <span class="pager-dir mfs-text-muted">Next</span>
              <strong class="pager-name mfs-font-bold mfs-text">{{ nextItem.name }}</strong>
            </div>
            <ChevronRight :size="16" />
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, provide, ref, watch } from 'vue'
import { Check, ChevronLeft, ChevronRight, Copy, Search } from 'lucide-vue-next'
import Accordion, { type AccordionItem } from '../lib/components/Accordion.vue'
import {
  COMPONENT_NAV,
  PHASE_TITLES,
  getComponentBySlug,
  type ApiRow,
  type ComponentNavItem
} from '../data/componentDocs'
import type { ComponentApiSpec, DocsContext } from './ComponentPreview.vue'

const props = defineProps<{
  activeSlug: string
}>()

const emit = defineEmits<{
  (e: 'select', slug: string): void
}>()

const searchQuery = ref('')

const UtilitiesDemo = defineAsyncComponent(() => import('./demos/UtilitiesDemo.vue'))
const Fase1Demos = defineAsyncComponent(() => import('./demos/Fase1Demos.vue'))
const Fase2Demos = defineAsyncComponent(() => import('./demos/Fase2Demos.vue'))
const Fase3Demos = defineAsyncComponent(() => import('./demos/Fase3Demos.vue'))
const Fase4Demos = defineAsyncComponent(() => import('./demos/Fase4Demos.vue'))
const Fase5Demos = defineAsyncComponent(() => import('./demos/Fase5Demos.vue'))
const Fase6Demos = defineAsyncComponent(() => import('./demos/Fase6Demos.vue'))
const Fase7Demos = defineAsyncComponent(() => import('./demos/Fase7Demos.vue'))
const Fase8Demos = defineAsyncComponent(() => import('./demos/Fase8Demos.vue'))
const Fase9Demos = defineAsyncComponent(() => import('./demos/Fase9Demos.vue'))
const Fase10Demos = defineAsyncComponent(() => import('./demos/Fase10Demos.vue'))
const Fase11Demos = defineAsyncComponent(() => import('./demos/Fase11Demos.vue'))

const phaseDemoMap = {
  0: UtilitiesDemo,
  1: Fase1Demos,
  2: Fase2Demos,
  3: Fase3Demos,
  4: Fase4Demos,
  5: Fase5Demos,
  6: Fase6Demos,
  7: Fase7Demos,
  8: Fase8Demos,
  9: Fase9Demos,
  10: Fase10Demos,
  11: Fase11Demos
} as const

const activeItem = computed(() => getComponentBySlug(props.activeSlug))
const activePhaseDemo = computed(() => phaseDemoMap[activeItem.value.phase])
const activeItemA11y = computed(() => activeItem.value.a11y)

const openGroupKeys = ref<(string | number)[]>([activeItem.value.phase])
let savedKeysBeforeSearch: (string | number)[] | null = null

watch(
  () => activeItem.value.phase,
  (phase) => {
    if (!openGroupKeys.value.includes(phase)) {
      openGroupKeys.value = [...openGroupKeys.value, phase]
    }
  }
)

type DocTabKey = 'features' | 'api' | 'theming'

const docTabs: Array<{ key: DocTabKey; label: string }> = [
  { key: 'features', label: 'Features' },
  { key: 'api', label: 'API' },
  { key: 'theming', label: 'Theming' }
]

const activeTab = ref<DocTabKey>('features')
const registeredApi = ref<ComponentApiSpec | null>(null)

const mergeRows = (existing: ApiRow[] = [], incoming: ApiRow[] = []) => {
  const seen = new Set(existing.map((r) => r.name))
  return [...existing, ...incoming.filter((r) => !seen.has(r.name))]
}

const registerApi = (api: ComponentApiSpec) => {
  const prev = registeredApi.value
  registeredApi.value = {
    props: mergeRows(prev?.props, api.props),
    events: mergeRows(prev?.events, api.events),
    slots: mergeRows(prev?.slots, api.slots)
  }
}

watch(
  () => props.activeSlug,
  () => {
    registeredApi.value = null
  },
  { flush: 'sync' }
)

provide<DocsContext>('docContext', {
  activeTab,
  registerApi
})

const apiSections = computed(() => {
  const sections: Array<{
    key: 'props' | 'events' | 'slots'
    label: string
    rows: ApiRow[]
    showType: boolean
    showDefault: boolean
  }> = []
  if (registeredApi.value?.props?.length) {
    sections.push({ key: 'props', label: 'Props', rows: registeredApi.value.props, showType: true, showDefault: true })
  }
  if (registeredApi.value?.events?.length) {
    sections.push({ key: 'events', label: 'Events', rows: registeredApi.value.events, showType: true, showDefault: false })
  }
  if (registeredApi.value?.slots?.length) {
    sections.push({ key: 'slots', label: 'Slots', rows: registeredApi.value.slots, showType: false, showDefault: false })
  }
  return sections
})

const apiRowCount = computed(() =>
  apiSections.value.reduce((total, section) => total + section.rows.length, 0)
)

const themeSwitchSnippet = `import { useTheme } from '@mfs-atomic/theme'

const { currentTheme, setTheme } = useTheme()
setTheme('glass') // 'clay' | 'glass' | 'neo' | ...`

const themeOverrideSnippet = `[data-theme="clay"] {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --radius-md: 16px;
}`

const themeTokens = [
  { name: '--bg', description: 'Root page background color', previewStyle: 'background: var(--bg)' },
  { name: '--surface', description: 'Elevated card, panel, and container surface', previewStyle: 'background: var(--surface)' },
  { name: '--surface-subtle', description: 'Secondary inset surface for headers and table wells', previewStyle: 'background: var(--surface-subtle)' },
  { name: '--primary', description: 'Primary brand accent and active state color', previewStyle: 'background: var(--primary)' },
  { name: '--text', description: 'Primary body and heading text color', previewStyle: 'background: var(--text)' },
  { name: '--text-muted', description: 'Secondary labels, hints, and captions', previewStyle: 'background: var(--text-muted)' },
  { name: '--border', description: 'Subtle Hairline border token', previewStyle: 'background: var(--border)' },
  { name: '--radius-md', description: 'Default medium corner radius (12px base)', previewStyle: 'background: var(--surface); border-radius: var(--radius-md)' },
  { name: '--clay-shadow', description: 'Theme-adaptive interactive surface shadow', previewStyle: 'background: var(--surface); box-shadow: var(--clay-shadow)' },
  { name: '--backdrop-blur', description: 'Frosted glass blur filter (active in Glassmorphism)', previewStyle: 'background: var(--surface); backdrop-filter: var(--backdrop-blur, blur(12px))' }
]

const coreUtilities = [
  '.mfs-surface',
  '.mfs-surface-subtle',
  '.mfs-card',
  '.mfs-inset',
  '.mfs-shadow',
  '.mfs-pill',
  '.mfs-stack',
  '.mfs-row',
  '.mfs-grid',
  '.mfs-gap-4'
]

const toDirectiveSymbol = (name: string) =>
  name.replace(/-([a-z])/g, (_, ch: string) => ch.toUpperCase())

const importStatement = computed(() => {
  const item = activeItem.value
  if (item.importSymbol) {
    return `import { ${item.importSymbol} } from '@mfs-atomic/theme'`
  }
  if (item.phase === 0) {
    return `import '@mfs-atomic/theme/style.css'`
  }
  const symbol = item.name.startsWith('v-') ? toDirectiveSymbol(item.name) : item.name
  return `import { ${symbol} } from '@mfs-atomic/theme'`
})

const copiedImport = ref(false)
let importCopyTimer: ReturnType<typeof setTimeout> | null = null

const copyImport = async () => {
  try {
    await navigator.clipboard.writeText(importStatement.value)
    copiedImport.value = true
    if (importCopyTimer) clearTimeout(importCopyTimer)
    importCopyTimer = setTimeout(() => {
      copiedImport.value = false
    }, 1500)
  } catch {
    // Clipboard may be unavailable in restricted contexts
  }
}

onBeforeUnmount(() => {
  if (importCopyTimer) clearTimeout(importCopyTimer)
})

const activeIndex = computed(() =>
  COMPONENT_NAV.findIndex((item) => item.slug === activeItem.value.slug)
)

const prevItem = computed(() =>
  activeIndex.value > 0 ? COMPONENT_NAV[activeIndex.value - 1] : null
)

const nextItem = computed(() =>
  activeIndex.value >= 0 && activeIndex.value < COMPONENT_NAV.length - 1
    ? COMPONENT_NAV[activeIndex.value + 1]
    : null
)

const groupByPhase = (items: ComponentNavItem[]) => {
  const phases: Array<ComponentNavItem['phase']> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  return phases
    .map((phase) => ({
      phase,
      title: PHASE_TITLES[phase],
      items: items.filter((item) => item.phase === phase)
    }))
    .filter((group) => group.items.length > 0)
}

const allGroups = computed(() => groupByPhase(COMPONENT_NAV))

const filteredGroups = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return allGroups.value
  const matches = COMPONENT_NAV.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  )
  return groupByPhase(matches)
})

const sidebarAccordionItems = computed<AccordionItem[]>(() =>
  filteredGroups.value.map((group) => ({
    key: group.phase,
    title: `${group.title} (${group.items.length})`
  }))
)

const groupItemsByKey = computed(() => {
  const map = new Map<string | number, ComponentNavItem[]>()
  for (const group of filteredGroups.value) {
    map.set(group.phase, group.items)
  }
  return map
})

watch(
  [() => searchQuery.value.trim(), filteredGroups],
  ([trimmed, groups], [prevTrimmed]) => {
    if (trimmed.length > 0) {
      if (!prevTrimmed) {
        savedKeysBeforeSearch = [...openGroupKeys.value]
      }
      openGroupKeys.value = groups.map((g) => g.phase)
    } else if (prevTrimmed) {
      const restored = savedKeysBeforeSearch ?? []
      savedKeysBeforeSearch = null
      openGroupKeys.value = restored.includes(activeItem.value.phase)
        ? restored
        : [...restored, activeItem.value.phase]
    }
  }
)

const onMobileSelect = (e: Event) => {
  const target = e.target as HTMLSelectElement
  if (target.value) {
    emit('select', target.value)
  }
}
</script>

<style scoped>
.docs-shell {
  max-width: 1440px;
  padding: 28px 32px 56px;
}

.mobile-switcher {
  display: none;
}

.mobile-switcher-label {
  display: block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mobile-select {
  padding: 9px 12px;
  font-size: 0.9rem;
}

.docs-layout {
  display: grid;
  grid-template-columns: 268px minmax(0, 1fr);
  gap: 32px;
}

.docs-sidebar {
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 112px);
}

.sidebar-search-icon {
  left: 10px;
  pointer-events: none;
}

.sidebar-search {
  padding: 8px 10px 8px 32px;
  font-size: 0.84rem;
}

.sidebar-search::placeholder {
  color: var(--text-muted);
}

.sidebar-groups {
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.sidebar-groups::-webkit-scrollbar {
  width: 5px;
}

.sidebar-groups::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-groups::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 9999px;
}

.docs-sidebar :deep(.accordion) {
  gap: 6px;
}

.docs-sidebar :deep(.accordion__trigger) {
  padding: 8px 10px;
  gap: 8px;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.docs-sidebar :deep(.accordion__title) {
  color: inherit;
  font-size: inherit;
  line-height: 1.25;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.docs-sidebar :deep(.accordion__chevron) {
  width: 15px;
  height: 15px;
}

.docs-sidebar :deep(.accordion__body) {
  padding: 0 6px;
  transition: padding 0.28s ease;
}

.docs-sidebar :deep(.accordion__item.is-open .accordion__body) {
  padding: 4px 6px 8px;
}

.sidebar-list {
  list-style: none;
  gap: 4px;
}

.sidebar-link {
  padding: 8px 12px;
  color: var(--text);
  font-size: 0.86rem;
  line-height: 1.35;
}

.sidebar-link:hover {
  background: var(--surface-subtle);
}

.sidebar-link.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  font-weight: 600;
}

.sidebar-empty {
  font-size: 0.82rem;
  padding: 8px 10px;
}

.docs-main,
.docs-body {
  gap: 28px;
}

.docs-title {
  font-size: 1.7rem;
  font-weight: 800;
  line-height: 1.2;
}

.docs-category-badge {
  font-size: 0.74rem;
  padding: 3px 10px;
}

.docs-summary {
  font-size: 0.96rem;
  line-height: 1.55;
}

.docs-import-label,
.a11y-subhead {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  line-height: 1.2;
}

.import-copy-btn:hover,
.import-copy-btn.is-copied {
  border-color: var(--primary);
  color: var(--primary);
}

.a11y-list {
  list-style: none;
}

.docs-tabs {
  align-self: flex-start;
}

.docs-tab-btn {
  padding: 8px 16px;
  color: var(--text-muted);
  background: transparent;
}

.docs-tab-btn:hover {
  color: var(--text);
}

.docs-tab-btn.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
}

.docs-tab-btn.is-active .docs-tab-count {
  background: rgba(255, 255, 255, 0.22);
  color: var(--primary-text, #ffffff);
}

.docs-tab-count {
  background: var(--surface-subtle);
  color: var(--text-muted);
  padding-block: 1px;
}

.docs-table {
  border-collapse: collapse;
  font-size: 0.84rem;
  line-height: 1.5;
}

.docs-table th,
.docs-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  vertical-align: top;
}

.docs-table th {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--surface);
}

.docs-table tbody tr:last-child td {
  border-bottom: none;
}

.token-swatch {
  width: 28px;
  height: 20px;
}

.theming-code {
  line-height: 1.55;
  tab-size: 2;
}

.pager-btn {
  background-color: var(--surface);
  color: var(--text);
}

.pager-btn:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
}

.pager-dir {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.pager-name {
  font-size: 0.92rem;
  color: var(--text);
}

@media (max-width: 900px) {
  .docs-shell {
    padding: 16px 16px 40px;
  }

  .mobile-switcher {
    display: block;
  }

  .docs-layout {
    grid-template-columns: 1fr;
  }

  .docs-sidebar {
    display: none;
  }
}

/* Theme overrides */
:global([data-theme='glass']) .docs-sidebar,
:global([data-theme='glass']) .docs-header,
:global([data-theme='glass']) .pager-btn {
  backdrop-filter: var(--backdrop-blur, blur(14px));
}
</style>
