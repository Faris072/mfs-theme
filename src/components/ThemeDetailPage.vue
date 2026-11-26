<template>
  <div class="mfs-w-full">
    <!-- Breadcrumb Top Bar -->
    <div class="detail-topbar mfs-surface mfs-border-none mfs-border-b">
      <div class="detail-topbar__inner mfs-flex mfs-items-center mfs-justify-between mfs-flex-wrap mfs-gap-3">
        <nav class="mfs-flex mfs-items-center mfs-gap-2-5" aria-label="Breadcrumb">
          <Button variant="surface" size="sm" @click="$emit('back')">
            <template #prepend>
              <ArrowLeft :size="15" class="icon-inline" />
            </template>
            <span>Themes</span>
          </Button>
          <span class="breadcrumb-separator mfs-text-muted">/</span>
          <span class="breadcrumb-current mfs-text mfs-font-semibold">{{ theme.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Theme Hero Banner -->
    <section
      :class="[
        'detail-hero mfs-border-none mfs-border-b',
        `detail-hero--${themeId}`,
        { 'detail-hero--dark': isDarkHero }
      ]"
      :style="{ background: theme.previewBg }"
    >
      <div class="detail-hero__content">
        <div class="mfs-flex mfs-items-center mfs-flex-wrap mfs-gap-2-5 mfs-mb-3">
          <component :is="currentIconComponent" :size="32" class="hero-icon mfs-text" />
          <Badge variant="surface" size="sm" class="hero-badge">{{ theme.badge }}</Badge>
          <Badge v-if="isCurrentActive" variant="primary" size="sm">
            Active
          </Badge>
        </div>

        <h1 class="hero-heading mfs-text">{{ theme.name }}</h1>
        <p class="hero-tagline mfs-font-medium mfs-text-muted">{{ theme.tagline }}</p>
        <p class="hero-desc mfs-text mfs-mb-6">{{ theme.description }}</p>

        <!-- Actions -->
        <div class="mfs-flex mfs-items-center mfs-gap-3 mfs-flex-wrap mfs-mb-6">
          <Button variant="primary" size="md" @click="activateTheme">
            {{ isCurrentActive ? 'Active theme' : 'Apply this theme' }}
          </Button>
          <Button variant="surface" size="md" @click="copyThemeImport">
            <template #prepend>
              <Copy v-if="!copiedImport" :size="14" class="icon-inline" />
              <Check v-else :size="14" class="icon-inline" />
            </template>
            <span>{{ copiedImport ? 'Copied' : 'Copy setup code' }}</span>
          </Button>
        </div>

        <!-- Key features list -->
        <div class="mfs-flex mfs-flex-wrap mfs-gap-2">
          <Chip
            v-for="(feature, idx) in theme.keyFeatures"
            :key="idx"
            :label="feature"
          >
            <template #prepend>
              <Check :size="14" class="mfs-text-primary" />
            </template>
          </Chip>
        </div>
      </div>
    </section>

    <!-- Main Content Body -->
    <div class="detail-body mfs-flex mfs-flex-col">
      <!-- Section 1: Components List -->
      <section>
        <div class="section-header mfs-flex mfs-items-end mfs-justify-between mfs-gap-4 mfs-flex-wrap">
          <div>
            <h2 class="section-title mfs-font-bold mfs-text">Components directory</h2>
            <p class="section-desc mfs-text-muted mfs-m-0">
              Vue 3 components conforming to the {{ theme.name }} depth specification.
            </p>
          </div>
          <IconField class="search-box">
            <InputIcon>
              <Search :size="16" />
            </InputIcon>
            <Input
              v-model="searchQuery"
              type="text"
              placeholder="Filter components (e.g. Button, Input)..."
            />
          </IconField>
        </div>

        <!-- Filter Categories -->
        <div class="filter-pills-row mfs-flex mfs-flex-wrap mfs-items-center mfs-gap-2 mfs-pb-3">
          <Button
            v-for="cat in categories"
            :key="cat"
            :variant="selectedCategory === cat ? 'primary' : 'surface'"
            size="sm"
            class="mfs-whitespace-nowrap mfs-shrink-0"
            @click="selectedCategory = cat"
          >
            {{ cat }}
            <span class="cat-count">({{ getCategoryCount(cat) }})</span>
          </Button>
        </div>

        <!-- Component Cards Grid -->
        <div v-if="filteredComponents.length > 0" class="components-grid">
          <router-link
            v-for="comp in filteredComponents"
            :key="comp.slug"
            :to="`/components/${comp.slug}`"
            class="comp-card"
            @click="activateTheme"
          >
            <Card hoverable class="mfs-h-full">
              <div class="mfs-flex mfs-items-start mfs-justify-between mfs-gap-3 mfs-mb-2">
                <div>
                  <h3 class="comp-name mfs-font-bold mfs-m-0 mfs-text">{{ comp.name }}</h3>
                  <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">{{ comp.category }}</span>
                </div>
                <Badge variant="surface" size="sm" class="status-ready">
                  {{ comp.status ?? 'Ready' }}
                </Badge>
              </div>

              <p class="comp-desc mfs-text-muted mfs-flex-1">{{ comp.summary }}</p>

              <!-- Import snippet -->
              <div class="mfs-mb-3 mfs-min-w-0">
                <CodeEditor readonly :model-value="getImportSnippet(comp)" filename="main.ts" language="ts" />
              </div>

              <div class="mfs-flex mfs-items-center mfs-justify-end">
                <span class="mfs-text-xs mfs-font-semibold mfs-text-primary">Live Preview &amp; API →</span>
              </div>
            </Card>
          </router-link>
        </div>

        <div v-else class="empty-state mfs-text-center mfs-surface mfs-rounded-md">
          <p>No components match the filter "<strong>{{ searchQuery }}</strong>"</p>
          <Button variant="surface" size="sm" @click="searchQuery = ''; selectedCategory = 'All'">
            Reset filter
          </Button>
        </div>
      </section>

      <!-- Section 2: Design Tokens -->
      <section>
        <h2 class="section-title mfs-font-bold mfs-text">Design tokens</h2>
        <p class="section-desc mfs-text-muted mfs-m-0">
          CSS variables structuring {{ theme.name }} visual tokens.
        </p>

        <div class="tokens-grid">
          <Card
            v-for="token in theme.designTokens"
            :key="token.name"
          >
            <div>
              <code class="token-name mfs-font-semibold mfs-text-primary mfs-font-mono">{{ token.name }}</code>
            </div>
            <div class="token-value-box mfs-mt-2 mfs-mb-2 mfs-surface-subtle mfs-rounded-sm mfs-font-mono mfs-text mfs-overflow-x-auto">
              <span>{{ token.value }}</span>
            </div>
            <p class="token-desc mfs-text-muted mfs-m-0">{{ token.description }}</p>
          </Card>
        </div>
      </section>

      <!-- Section 3: Utility Classes -->
      <section>
        <h2 class="section-title mfs-font-bold mfs-text">Utility classes</h2>
        <p class="section-desc mfs-text-muted mfs-m-0">
          CSS classes provided for custom containers matching {{ theme.name }}.
        </p>

        <div class="utilities-table mfs-surface mfs-rounded-md mfs-shadow-card mfs-overflow-hidden">
          <div
            v-for="util in theme.utilityClasses"
            :key="util.className"
            class="util-row mfs-flex mfs-items-center mfs-justify-between mfs-border-none mfs-border-b mfs-flex-wrap mfs-gap-3"
          >
            <div>
              <code class="util-class mfs-text-primary mfs-font-mono">{{ util.className }}</code>
              <p class="util-desc mfs-text-muted mfs-mt-1">{{ util.description }}</p>
            </div>
            <div class="util-example">
              <code class="mfs-surface-subtle mfs-py-1 mfs-px-2 mfs-rounded-sm mfs-text mfs-font-mono">{{ util.example }}</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Layers,
  Gem,
  Circle,
  Minus,
  Square,
  LayoutGrid,
  Zap,
  Monitor,
  Grid,
  Box,
  Droplets,
  Palette,
  Terminal,
  PenTool,
  Disc,
  Shapes,
  Gamepad2,
  Waves,
  Sunset,
  BookOpen,
  ArrowLeft,
  Copy,
  Check,
  Search
} from 'lucide-vue-next'
import {
  type ThemeType,
  type ThemeDetailInfo,
  THEMES_DATA,
  isDarkTheme
} from '../data/themesData'
import { COMPONENT_NAV, type ComponentNavItem } from '../data/componentDocs'
import { Badge, Button, Card, Chip, CodeEditor, IconField, Input, InputIcon } from '../lib'

const props = defineProps<{
  themeId: ThemeType
  activeThemeId: ThemeType
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'change-theme', id: ThemeType): void
  (e: 'set-active-theme', id: ThemeType): void
}>()

const searchQuery = ref('')
const selectedCategory = ref('All')
const copiedImport = ref(false)
const copiedSnippetId = ref<string | null>(null)

const theme = computed<ThemeDetailInfo>(() => {
  return THEMES_DATA[props.themeId] || THEMES_DATA.clay
})

const isCurrentActive = computed(() => {
  return props.activeThemeId === props.themeId
})

const iconMap: Record<ThemeType, any> = {
  clay: Layers,
  glass: Gem,
  neo: Circle,
  minimalism: Minus,
  brutalism: Square,
  bento: LayoutGrid,
  cyberpunk: Zap,
  retro: Monitor,
  swiss: Grid,
  skeuomorphism: Box,
  'liquid-glass': Droplets,
  'material-you': Palette,
  terminal: Terminal,
  'hand-drawn': PenTool,
  'y2k-chrome': Disc,
  bauhaus: Shapes,
  'pixel-art': Gamepad2,
  'aurora-gradient': Waves,
  vaporwave: Sunset,
  manga: BookOpen,
  '3d-glassmorphism': Box
}

const currentIconComponent = computed(() => {
  return iconMap[props.themeId] ?? Layers
})

const isDarkHero = computed(() => isDarkTheme(props.themeId))

const shippedComponents = computed<ComponentNavItem[]>(() => {
  return COMPONENT_NAV.filter((c) => c.phase > 0)
})

const categories = computed(() => {
  const set = new Set(shippedComponents.value.map((c) => c.category))
  return ['All', ...Array.from(set)]
})

const getCategoryCount = (category: string) => {
  if (category === 'All') return shippedComponents.value.length
  return shippedComponents.value.filter((c) => c.category === category).length
}

const filteredComponents = computed(() => {
  let list = shippedComponents.value
  if (selectedCategory.value !== 'All') {
    list = list.filter((c) => c.category === selectedCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
  }
  return list
})

const getImportSnippet = (comp: ComponentNavItem) => {
  return `import { ${comp.importSymbol ?? comp.name} } from '@mfs-atomic/ui'`
}

const activateTheme = () => {
  emit('set-active-theme', props.themeId)
}

const copyThemeImport = async () => {
  const code = `import MfsTheme from '@mfs-atomic/ui'\nimport '@mfs-atomic/ui/style.css'\n\napp.use(MfsTheme, { defaultTheme: '${props.themeId}' })`
  try {
    await navigator.clipboard.writeText(code)
    copiedImport.value = true
    setTimeout(() => {
      copiedImport.value = false
    }, 2000)
  } catch (e) {
    console.error(e)
  }
}

const copySnippet = async (snippet: string, id: string) => {
  try {
    await navigator.clipboard.writeText(snippet)
    copiedSnippetId.value = id
    setTimeout(() => {
      if (copiedSnippetId.value === id) {
        copiedSnippetId.value = null
      }
    }, 2000)
  } catch (e) {
    console.error(e)
  }
}
</script>

<style scoped>
/* Hallmark · theme: mfs-theme · ThemeDetailPage.vue */
.detail-topbar {
  padding: 10px 24px;
  position: sticky;
  top: 60px;
  z-index: 40;
  backdrop-filter: var(--backdrop-blur, blur(10px));
}

.detail-topbar__inner {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
}

.btn-back {
  padding: 6px 14px;
  font-size: 0.85rem;
}

.btn-back:hover {
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: var(--clay-shadow-hover);
}

.btn-back:active {
  box-shadow: var(--clay-shadow-active);
}

.icon-inline {
  display: inline-block;
  vertical-align: middle;
}

.breadcrumb-separator,
.breadcrumb-current {
  font-size: 0.85rem;
}

/* Hero */
.detail-hero {
  padding: 48px 24px;
}

.detail-hero--dark {
  color: #f8fafc;
}

.detail-hero--dark .hero-heading,
.detail-hero--dark .hero-icon {
  color: #f8fafc !important;
}

.detail-hero--dark .hero-tagline {
  color: #94a3b8 !important;
}

.detail-hero--dark .hero-desc {
  color: #cbd5e1 !important;
}

.detail-hero--dark .hero-badge {
  background: rgba(255, 255, 255, 0.12) !important;
  color: v-bind('theme.accentColor') !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
}

.detail-hero__content {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
}

.hero-badge,
.active-tag {
  padding: 3px 10px;
  font-size: 0.8rem;
}

.hero-heading {
  font-size: 2.6rem;
  font-weight: 600;
  margin: 0 0 8px;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.hero-tagline {
  font-size: 1.1rem;
  margin: 0 0 14px;
}

.hero-desc {
  max-width: 800px;
  font-size: 0.96rem;
  line-height: 1.6;
}

.btn-primary {
  padding: 10px 20px;
  font-size: 0.9rem;
}

.btn-primary:hover {
  opacity: 0.92;
  box-shadow: var(--clay-shadow-hover);
}

.btn-primary:active {
  transform: translateY(1px);
  box-shadow: var(--clay-shadow-active);
}

.btn-outline {
  padding: 10px 18px;
  font-size: 0.9rem;
}

.btn-outline:hover {
  background: var(--surface-subtle);
  border-color: var(--primary);
  box-shadow: var(--clay-shadow-hover);
}

.btn-outline:active {
  transform: translateY(1px);
  box-shadow: var(--clay-shadow-active);
}

.feature-chip {
  padding: 6px 12px;
  font-size: 0.8rem;
}

/* Detail Body */
.detail-body {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
  padding: 48px 24px 64px;
  gap: 48px;
}

.section-title {
  font-size: 1.6rem;
  margin: 0 0 6px;
}

.section-desc {
  font-size: 0.92rem;
}

.section-header {
  margin-bottom: 20px;
}

.search-box {
  min-width: 320px;
  width: 100%;
  max-width: 360px;
}

.search-input {
  font-size: 0.88rem;
}

.filter-pills-row {
  margin-bottom: 20px;
}

.cat-pill {
  padding: 6px 14px;
  font-size: 0.82rem;
}

.cat-pill:hover {
  border-color: var(--primary);
  color: var(--text);
  box-shadow: var(--clay-shadow-hover);
}

.cat-pill.is-selected {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  border-color: var(--primary);
  box-shadow: var(--clay-shadow-active);
}

.cat-count {
  opacity: 0.8;
  font-size: 0.75rem;
}

/* Components Grid */
.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.comp-card {
  display: block;
  min-width: 0;
  text-decoration: none;
}

.comp-card :deep(.card),
.comp-card :deep(.card__body) {
  min-width: 0;
}

.comp-name {
  font-size: 1.15rem;
}

.status-tag {
  font-size: 0.72rem;
  padding: 2px 8px;
}

.status-ready {
  color: var(--primary);
}

.comp-desc {
  font-size: 0.88rem;
  line-height: 1.5;
  margin: 0 0 16px;
}

.snippet-header {
  padding: 6px 12px;
  font-size: 0.72rem;
}

.btn-copy-snippet {
  font-size: 0.72rem;
}

.snippet-code {
  padding: 10px 12px;
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Tokens */
.tokens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.token-name {
  font-size: 0.82rem;
}

.token-value-box {
  margin: 8px 0;
  padding: 6px 10px;
  font-size: 0.78rem;
}

.token-desc {
  font-size: 0.8rem;
}

/* Utilities Table */
.utilities-table {
  margin-top: 18px;
}

.util-row {
  padding: 14px 18px;
}

.util-row:last-child {
  border-bottom: none;
}

.util-class {
  font-size: 0.88rem;
}

.util-desc {
  font-size: 0.85rem;
  margin-bottom: 0;
}

.util-example code {
  font-size: 0.8rem;
}

.empty-state {
  padding: 40px 20px;
  border-style: dashed;
}
</style>
