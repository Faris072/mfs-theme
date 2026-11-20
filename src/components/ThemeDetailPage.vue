<template>
  <div class="theme-detail">
    <!-- Breadcrumb Top Bar -->
    <div class="detail-topbar">
      <div class="detail-topbar__inner">
        <nav class="detail-breadcrumb" aria-label="Breadcrumb">
          <button class="btn-back" @click="$emit('back')">
            <ArrowLeft :size="15" class="icon-inline" />
            <span>Themes</span>
          </button>
          <span class="breadcrumb-separator">/</span>
          <span class="breadcrumb-current">{{ theme.name }}</span>
        </nav>
      </div>
    </div>

    <!-- Theme Hero Banner -->
    <section
      :class="['detail-hero', `detail-hero--${themeId}`]"
      :style="{ background: theme.previewBg }"
    >
      <div class="detail-hero__content">
        <div class="hero-header-row">
          <component :is="currentIconComponent" :size="32" class="hero-icon" />
          <span class="hero-badge">{{ theme.badge }}</span>
          <span v-if="isCurrentActive" class="active-tag">
            Active
          </span>
        </div>

        <h1 class="hero-heading">{{ theme.name }}</h1>
        <p class="hero-tagline">{{ theme.tagline }}</p>
        <p class="hero-desc">{{ theme.description }}</p>

        <!-- Actions -->
        <div class="hero-actions">
          <button class="btn-primary" @click="activateTheme">
            {{ isCurrentActive ? 'Active theme' : 'Apply this theme' }}
          </button>
          <button class="btn-outline" @click="copyThemeImport">
            <Copy v-if="!copiedImport" :size="14" class="icon-inline" />
            <Check v-else :size="14" class="icon-inline" />
            <span>{{ copiedImport ? 'Copied' : 'Copy setup code' }}</span>
          </button>
        </div>

        <!-- Key features list -->
        <div class="features-list">
          <div
            v-for="(feature, idx) in theme.keyFeatures"
            :key="idx"
            class="feature-chip"
          >
            <Check :size="14" class="chip-check" />
            <span>{{ feature }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content Body -->
    <div class="detail-body">
      <!-- Section 1: Components List -->
      <section class="section-components">
        <div class="section-header">
          <div>
            <h2 class="section-title">Components directory</h2>
            <p class="section-desc">
              Vue 3 components conforming to the {{ theme.name }} depth specification.
            </p>
          </div>
          <div class="search-box">
            <Search :size="16" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Filter components (e.g. Button, Input)..."
              class="search-input"
            />
          </div>
        </div>

        <!-- Filter Categories -->
        <div class="filter-pills-row">
          <button
            v-for="cat in categories"
            :key="cat"
            class="cat-pill"
            :class="{ 'is-selected': selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
            <span class="cat-count">({{ getCategoryCount(cat) }})</span>
          </button>
        </div>

        <!-- Component Cards Grid -->
        <div v-if="filteredComponents.length > 0" class="components-grid">
          <div
            v-for="comp in filteredComponents"
            :key="comp.id"
            class="comp-card"
          >
            <div class="comp-header">
              <div class="comp-title-group">
                <h3 class="comp-name">{{ comp.name }}</h3>
                <span class="comp-cat">{{ comp.category }}</span>
              </div>
              <span
                class="status-tag"
                :class="`status-${comp.status.toLowerCase().replace(' ', '-')}`"
              >
                {{ comp.status }}
              </span>
            </div>

            <p class="comp-desc">{{ comp.description }}</p>

            <!-- Code snippet -->
            <div class="snippet-box">
              <div class="snippet-header">
                <span>Usage</span>
                <button
                  class="btn-copy-snippet"
                  @click="copySnippet(comp.snippet, comp.id)"
                >
                  <Copy v-if="copiedSnippetId !== comp.id" :size="12" class="icon-inline" />
                  <Check v-else :size="12" class="icon-inline" />
                  <span>{{ copiedSnippetId === comp.id ? 'Copied' : 'Copy' }}</span>
                </button>
              </div>
              <pre class="snippet-code"><code>{{ comp.snippet }}</code></pre>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>No components match the filter "<strong>{{ searchQuery }}</strong>"</p>
          <button class="btn-outline" @click="searchQuery = ''; selectedCategory = 'All'">
            Reset filter
          </button>
        </div>
      </section>

      <!-- Section 2: Design Tokens -->
      <section class="section-tokens">
        <h2 class="section-title">Design tokens</h2>
        <p class="section-desc">
          CSS variables structuring {{ theme.name }} visual tokens.
        </p>

        <div class="tokens-grid">
          <div
            v-for="token in theme.designTokens"
            :key="token.name"
            class="token-card"
          >
            <div class="token-header">
              <code class="token-name">{{ token.name }}</code>
            </div>
            <div class="token-value-box">
              <span class="token-val">{{ token.value }}</span>
            </div>
            <p class="token-desc">{{ token.description }}</p>
          </div>
        </div>
      </section>

      <!-- Section 3: Utility Classes -->
      <section class="section-utilities">
        <h2 class="section-title">Utility classes</h2>
        <p class="section-desc">
          CSS classes provided for custom containers matching {{ theme.name }}.
        </p>

        <div class="utilities-table">
          <div
            v-for="util in theme.utilityClasses"
            :key="util.className"
            class="util-row"
          >
            <div class="util-info">
              <code class="util-class">{{ util.className }}</code>
              <p class="util-desc">{{ util.description }}</p>
            </div>
            <div class="util-example">
              <code>{{ util.example }}</code>
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
  Sparkles,
  Circle,
  ArrowLeft,
  Copy,
  Check,
  Search
} from 'lucide-vue-next'
import {
  type ThemeType,
  type ThemeDetailInfo,
  THEMES_DATA
} from '../data/themesData'

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

const currentIconComponent = computed(() => {
  if (props.themeId === 'glass') return Sparkles
  if (props.themeId === 'neo') return Circle
  return Layers
})

const categories = computed(() => {
  const set = new Set(theme.value.components.map((c) => c.category))
  return ['All', ...Array.from(set)]
})

const getCategoryCount = (category: string) => {
  if (category === 'All') return theme.value.components.length
  return theme.value.components.filter((c) => c.category === category).length
}

const filteredComponents = computed(() => {
  let list = theme.value.components
  if (selectedCategory.value !== 'All') {
    list = list.filter((c) => c.category === selectedCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    )
  }
  return list
})

const activateTheme = () => {
  emit('set-active-theme', props.themeId)
}

const copyThemeImport = async () => {
  const code = `import MfsTheme from 'mfs-theme'\nimport 'mfs-theme/style.css'\n\napp.use(MfsTheme, { defaultTheme: '${props.themeId}' })`
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
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

.theme-detail {
  width: 100%;
}

.detail-topbar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 10px 24px;
  position: sticky;
  top: 60px;
  z-index: 40;
  backdrop-filter: var(--backdrop-blur, blur(10px));
}

.detail-topbar__inner {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  padding: 6px 14px;
  border-radius: var(--radius-pill, 9999px);
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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

.detail-breadcrumb {
  display: flex;
  align-items: center;
  gap: 10px;
}

.breadcrumb-separator {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.breadcrumb-current {
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 600;
}

/* Hero */
.detail-hero {
  padding: 48px 24px;
  border-bottom: 1px solid var(--border);
}

.detail-hero--glass {
  background: radial-gradient(circle at 20% 20%, #312e81 0%, #0f172a 65%, #020617 100%) !important;
  color: #f8fafc;
}

.detail-hero--glass .hero-heading,
.detail-hero--glass .hero-icon {
  color: #f8fafc !important;
}

.detail-hero--glass .hero-tagline {
  color: #94a3b8 !important;
}

.detail-hero--glass .hero-desc {
  color: #cbd5e1 !important;
}

.detail-hero--glass .hero-badge {
  background: rgba(255, 255, 255, 0.12) !important;
  color: #38bdf8 !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
}

.detail-hero__content {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
}

.hero-header-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.hero-icon {
  color: var(--text);
}

.hero-badge {
  display: inline-block;
  padding: 3px 10px;
  background: var(--surface);
  color: var(--primary);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.8rem;
  font-weight: 600;
}

.active-tag {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  padding: 3px 10px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.8rem;
  font-weight: 600;
}

.hero-heading {
  font-size: 2.6rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 8px;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.hero-tagline {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-muted);
  margin: 0 0 14px;
}

.hero-desc {
  max-width: 800px;
  font-size: 0.96rem;
  line-height: 1.6;
  color: var(--text);
  margin: 0 0 24px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.btn-primary {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  border: none;
  padding: 10px 20px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-primary:hover {
  opacity: 0.92;
  transform: translateY(-1px);
  box-shadow: var(--clay-shadow-hover);
}

.btn-primary:active {
  transform: translateY(1px);
  box-shadow: var(--clay-shadow-active);
}

.btn-outline {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 10px 18px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-outline:hover {
  background: var(--surface-subtle);
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--clay-shadow-hover);
}

.btn-outline:active {
  transform: translateY(1px);
  box-shadow: var(--clay-shadow-active);
}

.features-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.feature-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: var(--radius-sm, 8px);
  font-size: 0.8rem;
  color: var(--text);
}

.chip-check {
  color: var(--primary);
}

/* Detail Body */
.detail-body {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
  padding: 48px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 6px;
}

.section-desc {
  font-size: 0.92rem;
  color: var(--text-muted);
  margin: 0;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 8px 14px;
  border-radius: var(--radius-pill, 9999px);
  min-width: 280px;
  box-shadow: var(--input-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.search-icon {
  color: var(--text-muted);
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.88rem;
  color: var(--text);
  width: 100%;
}

.filter-pills-row {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 12px;
  margin-bottom: 20px;
}

.cat-pill {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 6px 14px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 14px);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.comp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.comp-name {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}

.comp-cat {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

.status-tag {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-pill, 9999px);
}

.status-ready {
  background: var(--surface-subtle);
  color: var(--primary);
  border: 1px solid var(--border);
}

.status-in-progress, .status-planned {
  background: var(--surface-subtle);
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.comp-desc {
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--text-muted);
  margin: 0 0 16px;
  flex-grow: 1;
}

.snippet-box {
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm, 8px);
  box-shadow: var(--input-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  overflow: hidden;
}

.snippet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
}

.btn-copy-snippet {
  background: transparent;
  border: none;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.snippet-code {
  margin: 0;
  padding: 10px 12px;
  font-family: var(--font-mono, monospace);
  font-size: 0.8rem;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text);
}

/* Tokens */
.tokens-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.token-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 12px);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  padding: 16px;
}

.token-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--primary);
  font-family: var(--font-mono, monospace);
}

.token-value-box {
  margin: 8px 0;
  padding: 6px 10px;
  background: var(--surface-subtle);
  border-radius: var(--radius-sm, 6px);
  font-family: var(--font-mono, monospace);
  font-size: 0.78rem;
  color: var(--text);
  overflow-x: auto;
}

.token-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

/* Utilities Table */
.utilities-table {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 12px);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  overflow: hidden;
  margin-top: 18px;
}

.util-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 12px;
}

.util-row:last-child {
  border-bottom: none;
}

.util-class {
  font-size: 0.88rem;
  color: var(--primary);
  font-family: var(--font-mono, monospace);
}

.util-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 4px 0 0;
}

.util-example code {
  background: var(--surface-subtle);
  padding: 4px 8px;
  border-radius: var(--radius-sm, 6px);
  font-size: 0.8rem;
  color: var(--text);
  font-family: var(--font-mono, monospace);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: var(--surface);
  border-radius: var(--radius-md, 12px);
  border: 1px dashed var(--border);
}
</style>
