<template>
  <div class="mfs-w-full">
    <!-- Header -->
    <section class="catalog-header mfs-surface mfs-border-none mfs-border-b">
      <div class="mfs-container">
        <div class="mfs-flex mfs-items-center mfs-justify-between mfs-flex-wrap mfs-gap-3 mfs-mb-2">
          <h1 class="catalog-title mfs-text mfs-m-0">Theme specifications</h1>
          <span class="mfs-surface-subtle mfs-pill mfs-text-xs mfs-font-bold mfs-text-primary mfs-px-3 mfs-py-1">
            {{ allThemes.length }} Themes
          </span>
        </div>
        <p class="catalog-caption mfs-text-muted">
          Select an aesthetic paradigm for your application. Each theme manages visual depth, shadows, borders, and interactive elevations.
        </p>

        <!-- Search & Filter bar -->
        <div class="mfs-flex mfs-items-center mfs-justify-between mfs-flex-wrap mfs-gap-3">
          <div class="mfs-flex mfs-gap-2 mfs-flex-wrap mfs-min-w-0">
            <button
              v-for="cat in filterOptions"
              :key="cat"
              class="filter-pill mfs-surface-subtle mfs-pill mfs-font-medium mfs-shadow mfs-cursor-pointer mfs-whitespace-nowrap mfs-transition"
              :class="{ 'is-active': activeFilter === cat }"
              @click="activeFilter = cat"
            >
              {{ cat }}
            </button>
          </div>

          <div class="catalog-search-box mfs-inset mfs-flex mfs-items-center mfs-gap-2 mfs-px-3 mfs-py-1-5">
            <Search :size="14" class="mfs-text-muted mfs-shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search themes..."
              aria-label="Search themes"
              class="catalog-search-input mfs-w-full mfs-border-none mfs-bg-transparent mfs-text mfs-text-sm mfs-outline-none"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Theme Cards Grid -->
    <section class="catalog-grid-section">
      <div class="mfs-container">
        <div v-if="filteredThemes.length === 0" class="mfs-surface mfs-rounded-lg mfs-p-6 mfs-text-center">
          <p class="mfs-text-muted mfs-m-0">No themes match "{{ searchQuery }}" in {{ activeFilter }}.</p>
        </div>

        <div v-else class="theme-cards-grid mfs-gap-6">
          <div
            v-for="t in filteredThemes"
            :key="t.id"
            class="theme-card-item mfs-surface mfs-rounded-lg mfs-shadow-card mfs-overflow-hidden mfs-flex mfs-flex-col mfs-h-full"
            :class="{ 'is-selected': activeThemeId === t.id }"
          >
            <!-- Card Header Preview using real [data-theme] -->
            <div
              class="card-hero-preview mfs-relative mfs-flex mfs-items-center mfs-justify-center mfs-overflow-hidden mfs-p-4"
              :data-theme="t.id"
              :style="{ background: t.previewBg }"
            >
              <div class="specimen-pill mfs-surface mfs-pill mfs-shadow mfs-inline-flex mfs-items-center mfs-gap-2-5 mfs-transition">
                <div class="specimen-icon mfs-bg-primary mfs-flex mfs-items-center mfs-justify-center mfs-rounded-full mfs-shrink-0">
                  <component :is="getThemeIcon(t)" :size="18" />
                </div>
                <div class="mfs-flex mfs-flex-col mfs-min-w-0">
                  <span class="specimen-label mfs-text mfs-font-bold mfs-truncate">{{ t.name }}</span>
                  <span class="specimen-badge mfs-text-primary mfs-text-xs mfs-font-semibold mfs-truncate">{{ t.badge }}</span>
                </div>
              </div>

              <span
                v-if="activeThemeId === t.id"
                class="card-active-label mfs-absolute mfs-bg-primary mfs-pill mfs-text-xs mfs-font-bold mfs-inline-flex mfs-items-center mfs-gap-1"
              >
                <Check :size="12" class="icon-inline" />
                <span>Active</span>
              </span>
            </div>

            <!-- Card Body -->
            <div class="mfs-p-6 mfs-flex mfs-flex-col mfs-flex-1">
              <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-2 mfs-mb-2">
                <h2 class="card-theme-name mfs-text mfs-m-0 mfs-truncate">{{ t.name }}</h2>
                <span class="card-category-badge mfs-text-xs mfs-font-bold mfs-text-primary mfs-surface-subtle mfs-pill mfs-border mfs-whitespace-nowrap">
                  {{ getThemeGroup(t.id) }}
                </span>
              </div>

              <p class="card-tagline mfs-font-bold mfs-text-primary mfs-m-0">{{ t.tagline }}</p>
              <p class="card-description mfs-text-muted">{{ t.description }}</p>

              <!-- Key Features -->
              <div class="use-cases-box">
                <span class="use-case-title mfs-font-bold mfs-text-muted mfs-mb-2">Key characteristics</span>
                <div class="mfs-flex mfs-flex-wrap mfs-gap-2">
                  <span
                    v-for="(feature, idx) in t.keyFeatures.slice(0, 3)"
                    :key="idx"
                    class="use-case-tag mfs-surface-subtle mfs-pill mfs-font-medium mfs-text mfs-shadow-inset"
                  >
                    {{ feature }}
                  </span>
                </div>
              </div>

              <!-- Theme Activation Info -->
              <div class="mfs-inset mfs-py-3 mfs-px-4 mfs-mb-6 mfs-flex mfs-flex-col mfs-gap-2">
                <div class="spec-token-row mfs-gap-2">
                  <span class="mfs-text-muted mfs-font-bold mfs-text-xs">THEME ID</span>
                  <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-2 mfs-min-w-0">
                    <code class="spec-token-value mfs-text mfs-font-semibold mfs-font-mono">'{{ t.id }}'</code>
                    <button
                      type="button"
                      class="mfs-surface mfs-pill mfs-text-muted mfs-text-xs mfs-px-2 mfs-py-0 mfs-inline-flex mfs-items-center mfs-gap-1 mfs-interactive mfs-shrink-0"
                      :aria-label="`Copy theme ID ${t.id}`"
                      @click.stop="copyThemeId(t.id)"
                    >
                      <Check v-if="copiedThemeId === t.id" :size="11" class="mfs-text-primary" />
                      <Copy v-else :size="11" />
                      <span>{{ copiedThemeId === t.id ? 'Copied' : 'Copy' }}</span>
                    </button>
                  </div>
                </div>
                <div class="spec-token-row mfs-gap-2">
                  <span class="mfs-text-muted mfs-font-bold mfs-text-xs">PLUGIN</span>
                  <code class="spec-token-value mfs-text mfs-font-semibold mfs-font-mono">defaultTheme: '{{ t.id }}'</code>
                </div>
                <div class="spec-token-row mfs-gap-2">
                  <span class="mfs-text-muted mfs-font-bold mfs-text-xs">COMPOSABLE</span>
                  <code class="spec-token-value mfs-text mfs-font-semibold mfs-font-mono">setTheme('{{ t.id }}')</code>
                </div>
                <div class="spec-token-row mfs-gap-2">
                  <span class="mfs-text-muted mfs-font-bold mfs-text-xs">HTML ATTR</span>
                  <code class="spec-token-value mfs-text mfs-font-semibold mfs-font-mono">data-theme="{{ t.id }}"</code>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="card-actions mfs-flex mfs-gap-2-5">
                <button
                  class="btn-apply-theme mfs-surface-subtle mfs-text mfs-pill mfs-font-bold mfs-shadow mfs-inline-flex mfs-items-center mfs-justify-center mfs-gap-1-5 mfs-cursor-pointer mfs-transition"
                  :class="{ 'btn-selected': activeThemeId === t.id }"
                  @click="$emit('select-theme', t.id)"
                >
                  <Check v-if="activeThemeId === t.id" :size="14" class="icon-inline" />
                  <span>{{ activeThemeId === t.id ? 'Active Theme' : 'Apply Theme' }}</span>
                </button>
                <button
                  class="btn-view-components mfs-surface mfs-text mfs-pill mfs-font-semibold mfs-shadow mfs-inline-flex mfs-items-center mfs-justify-center mfs-gap-1-5 mfs-cursor-pointer mfs-transition"
                  @click="$emit('open-theme-detail', t.id)"
                >
                  <span>Specs</span>
                  <ArrowRight :size="14" class="icon-inline" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Matrix -->
    <section class="comparison-section mfs-border-none mfs-border-t mfs-surface-subtle">
      <div class="mfs-container">
        <h2 class="comparison-heading mfs-text mfs-m-0 mfs-mb-2">Theme specification matrix</h2>
        <p class="comparison-sub mfs-text-muted">
          Comparative overview of structural properties across all {{ allThemes.length }} theme models.
        </p>

        <div class="mfs-surface mfs-rounded-lg mfs-shadow-card mfs-overflow-x-auto">
          <table class="matrix-table mfs-w-full mfs-text-left">
            <thead>
              <tr>
                <th scope="col">Theme</th>
                <th scope="col">Group</th>
                <th scope="col">Badge</th>
                <th scope="col">Accent</th>
                <th scope="col">Primary Token</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="t in allThemes"
                :key="t.id"
                class="mfs-cursor-pointer"
                @click="$emit('select-theme', t.id)"
              >
                <th scope="row">
                  <div class="mfs-flex mfs-items-center mfs-gap-2">
                    <component :is="getThemeIcon(t)" :size="15" class="mfs-text-primary mfs-shrink-0" />
                    <span>{{ t.name }}</span>
                  </div>
                </th>
                <td>{{ getThemeGroup(t.id) }}</td>
                <td>{{ t.badge }}</td>
                <td>
                  <span class="mfs-inline-flex mfs-items-center mfs-gap-1-5 mfs-font-mono mfs-text-xs">
                    <span class="accent-dot mfs-rounded-full" :style="{ backgroundColor: t.accentColor }"></span>
                    {{ t.accentColor }}
                  </span>
                </td>
                <td class="mfs-font-mono mfs-text-xs">{{ t.designTokens[0]?.value || '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import {
  Layers,
  Sparkles,
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
  Cpu,
  Shapes,
  Gamepad2,
  Sun,
  Disc,
  BookOpen,
  ArrowRight,
  Check,
  Copy,
  Search
} from 'lucide-vue-next'
import { THEMES_DATA, type ThemeDetailInfo, type ThemeType } from '../data/themesData'

defineProps<{
  activeThemeId: ThemeType
}>()

defineEmits<{
  (e: 'select-theme', theme: ThemeType): void
  (e: 'open-theme-detail', theme: ThemeType): void
}>()

const activeFilter = ref('All')
const searchQuery = ref('')
const copiedThemeId = ref<string | null>(null)

const copyThemeId = async (id: string) => {
  try {
    await navigator.clipboard.writeText(`'${id}'`)
    copiedThemeId.value = id
    setTimeout(() => {
      if (copiedThemeId.value === id) copiedThemeId.value = null
    }, 1800)
  } catch (e) {
    console.error(e)
  }
}

const filterOptions = [
  'All',
  'Tactile & 3D',
  'Glass & Glow',
  'Minimal & Grid',
  'Dark & Neon',
  'Retro & Playful'
]

const THEME_GROUP_MAP: Record<string, string> = {
  clay: 'Tactile & 3D',
  neo: 'Tactile & 3D',
  skeuomorphism: 'Tactile & 3D',
  'material-you': 'Tactile & 3D',
  glass: 'Glass & Glow',
  'liquid-glass': 'Glass & Glow',
  'aurora-gradient': 'Glass & Glow',
  minimalism: 'Minimal & Grid',
  bento: 'Minimal & Grid',
  swiss: 'Minimal & Grid',
  bauhaus: 'Minimal & Grid',
  cyberpunk: 'Dark & Neon',
  terminal: 'Dark & Neon',
  vaporwave: 'Dark & Neon',
  retro: 'Retro & Playful',
  'y2k-chrome': 'Retro & Playful',
  'pixel-art': 'Retro & Playful',
  'hand-drawn': 'Retro & Playful',
  manga: 'Retro & Playful',
  brutalism: 'Retro & Playful'
}

const ICON_BY_NAME: Record<string, Component> = {
  Layers,
  Sparkles,
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
  Cpu,
  Shapes,
  Gamepad2,
  Sun,
  Disc,
  BookOpen
}

const getThemeGroup = (id: string): string => THEME_GROUP_MAP[id] || 'Other'

const getThemeIcon = (theme: ThemeDetailInfo): Component => {
  return ICON_BY_NAME[theme.icon] || Layers
}

const allThemes = computed<ThemeDetailInfo[]>(() => Object.values(THEMES_DATA))

const filteredThemes = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return allThemes.value.filter((t) => {
    const matchesGroup = activeFilter.value === 'All' || getThemeGroup(t.id) === activeFilter.value
    if (!matchesGroup) return false
    if (!q) return true
    return (
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.badge.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    )
  })
})
</script>

<style scoped>
/* Hallmark · theme: mfs-theme · ThemeCatalogPage.vue */
.mfs-container {
  max-width: 1280px;
  padding-inline: 24px;
}

.catalog-header {
  padding: 48px 0;
}

.catalog-title {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.catalog-caption {
  font-size: 1.05rem;
  max-width: 680px;
  margin: 0 0 24px;
  line-height: 1.55;
}

.filter-pill {
  padding: 7px 16px;
  font-size: 0.85rem;
}

.filter-pill:hover {
  border-color: var(--primary);
  color: var(--text);
  box-shadow: var(--clay-shadow-hover);
}

.filter-pill.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  border-color: var(--primary);
  box-shadow: var(--clay-shadow-active);
}

.catalog-search-box {
  min-width: 220px;
}

.catalog-search-input {
  min-width: 0;
}

/* Grid */
.catalog-grid-section {
  padding: 48px 0;
}

.theme-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 310px), 1fr));
}

.theme-card-item.is-selected {
  border-color: var(--primary);
}

.card-hero-preview {
  height: 150px;
}

.specimen-pill {
  padding: 10px 18px;
  max-width: 90%;
}

.specimen-pill:hover {
  transform: translateY(-2px);
}

.specimen-icon {
  width: 36px;
  height: 36px;
}

.specimen-label {
  font-size: 0.9rem;
}

.specimen-badge {
  font-size: 0.72rem;
}

.card-active-label {
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-theme-name {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.card-category-badge {
  padding: 4px 10px;
}

.card-tagline {
  font-size: 0.88rem;
  margin-bottom: 10px;
}

.card-description {
  font-size: 0.9rem;
  line-height: 1.55;
  margin: 0 0 18px;
}

.use-cases-box {
  margin-bottom: 18px;
}

.use-case-title {
  display: block;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.use-case-tag {
  padding: 4px 10px;
  font-size: 0.78rem;
}

.spec-token-row {
  display: grid;
  grid-template-columns: 95px minmax(0, 1fr);
  align-items: baseline;
  font-size: 0.78rem;
}

.spec-token-value {
  line-height: 1.4;
  word-break: break-word;
}

.card-actions {
  margin-top: auto;
}

.card-actions > * {
  flex: 1;
}

.btn-apply-theme,
.btn-view-components {
  padding: 11px 16px;
  font-size: 0.88rem;
}

.btn-apply-theme:hover {
  background: var(--surface);
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--clay-shadow-hover);
}

.btn-apply-theme:active,
.btn-view-components:active {
  transform: translateY(1px);
  box-shadow: var(--clay-shadow-active);
}

.btn-apply-theme.btn-selected {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  border-color: var(--primary);
  box-shadow: var(--clay-shadow-active);
}

.btn-view-components:hover {
  background: var(--surface-subtle);
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--clay-shadow-hover);
}

.icon-inline {
  display: inline-block;
  vertical-align: middle;
}

/* Comparison section */
.comparison-section {
  padding: 56px 0;
}

.comparison-heading {
  font-size: 1.85rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.comparison-sub {
  font-size: 0.95rem;
  margin: 0 0 28px;
}

.matrix-table {
  border-collapse: collapse;
  font-size: 0.88rem;
}

.matrix-table th,
.matrix-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

.matrix-table th {
  font-weight: 700;
  background: var(--surface-subtle);
}

.matrix-table tr:hover td,
.matrix-table tr:hover th {
  background: var(--surface-subtle);
}

.matrix-table tr:last-child th,
.matrix-table tr:last-child td {
  border-bottom: none;
}

.accent-dot {
  width: 10px;
  height: 10px;
  display: inline-block;
  border: 1px solid var(--border);
}

@media (max-width: 768px) {
  .mfs-container {
    padding-inline: 16px;
  }
  .catalog-search-box {
    min-width: 0;
    width: 100%;
  }
}

@media (max-width: 640px) {
  .catalog-title {
    font-size: 2rem;
  }
  .card-actions {
    flex-direction: column;
  }
}
</style>
