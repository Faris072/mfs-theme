<template>
  <div class="catalog-page">
    <!-- Header -->
    <section class="catalog-header">
      <div class="catalog-container">
        <h1 class="catalog-title">Theme specifications</h1>
        <p class="catalog-caption">
          Select an aesthetic paradigm for your application. Each theme manages visual depth, shadows, and interactive elevations.
        </p>

        <!-- Filter tabs -->
        <div class="filter-tabs-row">
          <button
            v-for="cat in filterOptions"
            :key="cat"
            class="filter-pill"
            :class="{ 'is-active': activeFilter === cat }"
            @click="activeFilter = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <!-- Theme Cards Grid -->
    <section class="catalog-grid-section">
      <div class="catalog-container">
        <div class="theme-cards-grid">
          <div
            v-for="t in filteredThemes"
            :key="t.id"
            class="theme-card-item"
            :class="{ 'is-selected': activeThemeId === t.id }"
          >
            <!-- Card Header Preview -->
            <div class="card-hero-preview" :class="`preview-theme-${t.id}`">
              <div class="specimen-container">
                <div v-if="t.id === 'clay'" class="specimen-clay">
                  <div class="clay-pill-icon">
                    <component :is="t.iconComponent" :size="24" />
                  </div>
                  <span class="clay-specimen-label">Tactile 3D Volume</span>
                </div>

                <div v-else-if="t.id === 'glass'" class="specimen-glass">
                  <div class="glass-pill-icon">
                    <component :is="t.iconComponent" :size="24" />
                  </div>
                  <span class="glass-specimen-label">Frosted Translucency</span>
                </div>

                <div v-else-if="t.id === 'neo'" class="specimen-neo">
                  <div class="neo-pill-icon">
                    <component :is="t.iconComponent" :size="24" />
                  </div>
                  <span class="neo-specimen-label">Dual Extrusion</span>
                </div>
              </div>

              <span v-if="activeThemeId === t.id" class="card-active-label">
                <Check :size="12" class="icon-inline" />
                <span>Active</span>
              </span>
            </div>

            <!-- Card Body -->
            <div class="card-body">
              <div class="card-title-row">
                <h2 class="card-theme-name">{{ t.name }}</h2>
                <span class="card-category-badge">{{ t.category }}</span>
              </div>

              <p class="card-tagline">{{ t.tagline }}</p>
              <p class="card-description">{{ t.description }}</p>

              <!-- Use cases -->
              <div class="use-cases-box">
                <span class="use-case-title">Target interfaces</span>
                <div class="use-case-list">
                  <span v-for="(useCase, idx) in t.useCases" :key="idx" class="use-case-tag">
                    {{ useCase }}
                  </span>
                </div>
              </div>

              <!-- Tokens Specs -->
              <div class="spec-tokens-grid">
                <div class="spec-token-row">
                  <span class="spec-token-label">Elevation</span>
                  <span class="spec-token-value">{{ t.elevation }}</span>
                </div>
                <div class="spec-token-row">
                  <span class="spec-token-label">Radius</span>
                  <span class="spec-token-value">{{ t.radius }}</span>
                </div>
                <div class="spec-token-row">
                  <span class="spec-token-label">Surface</span>
                  <span class="spec-token-value">{{ t.surface }}</span>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="card-actions">
                <button
                  class="btn-apply-theme"
                  :class="{ 'btn-selected': activeThemeId === t.id }"
                  @click="$emit('select-theme', t.id)"
                >
                  <Check v-if="activeThemeId === t.id" :size="14" class="icon-inline" />
                  <span>{{ activeThemeId === t.id ? 'Active Theme' : 'Apply Theme' }}</span>
                </button>
                <button
                  class="btn-view-components"
                  @click="$emit('open-theme-detail', t.id)"
                >
                  <span>Components</span>
                  <ArrowRight :size="14" class="icon-inline" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison Matrix -->
    <section class="comparison-section">
      <div class="catalog-container">
        <h2 class="comparison-heading">Theme specification matrix</h2>
        <p class="comparison-sub">Comparative overview of structural properties across all three models.</p>

        <div class="matrix-table-wrap">
          <table class="matrix-table">
            <thead>
              <tr>
                <th scope="col">Dimension</th>
                <th scope="col">Claymorphism</th>
                <th scope="col">Glassmorphism</th>
                <th scope="col">Neumorphism</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Depth model</th>
                <td>Dual-layer inner highlights and diffuse drops</td>
                <td>Translucent layered panels with backdrop blur</td>
                <td>Dual directional opposing shadows (extruded/inset)</td>
              </tr>
              <tr>
                <th scope="row">Surface opacity</th>
                <td>Opaque pastel matte</td>
                <td>Translucent (blur 16px to 24px)</td>
                <td>Monochromatic canvas integration</td>
              </tr>
              <tr>
                <th scope="row">Corner radius</th>
                <td>20px to 32px (rounded)</td>
                <td>12px to 16px (structured)</td>
                <td>14px to 20px (soft geometric)</td>
              </tr>
              <tr>
                <th scope="row">Component parity</th>
                <td>100% API identical</td>
                <td>100% API identical</td>
                <td>100% API identical</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Layers,
  Sparkles,
  Circle,
  ArrowRight,
  Check
} from 'lucide-vue-next'
import { type ThemeType } from '../lib'

defineProps<{
  activeThemeId: ThemeType
}>()

defineEmits<{
  (e: 'select-theme', theme: ThemeType): void
  (e: 'open-theme-detail', theme: ThemeType): void
}>()

const activeFilter = ref('All')
const filterOptions = ['All', 'Tactile', 'Translucent', 'Soft UI']

interface ThemeItem {
  id: ThemeType
  name: string
  category: string
  iconComponent: unknown
  tagline: string
  description: string
  previewBg: string
  useCases: string[]
  elevation: string
  radius: string
  surface: string
}

const themeCatalog: ThemeItem[] = [
  {
    id: 'clay',
    name: 'Claymorphism',
    category: 'Tactile',
    iconComponent: Layers,
    tagline: 'Inflated soft volume with tactile curves',
    description: 'Constructs playful 3D digital surfaces with multi-layer inner white highlights and diffuse outer drops.',
    previewBg: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 50%, #fce7f3 100%)',
    useCases: ['Educational tools', 'Creative suites', 'Consumer applications'],
    elevation: 'Inner top-left white + diffuse outer',
    radius: 'Large curves (20px to 32px)',
    surface: 'Opaque matte'
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    category: 'Translucent',
    iconComponent: Sparkles,
    tagline: 'Frosted translucent panels with edge reflection',
    description: 'Modern translucent panels utilizing CSS backdrop-filter blur and subtle luminous borders over dark canvas.',
    previewBg: 'radial-gradient(circle at 20% 20%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
    useCases: ['Dark dashboards', 'Technical consoles', 'Data monitoring'],
    elevation: 'Translucent border + backdrop blur',
    radius: 'Medium geometric (12px to 16px)',
    surface: 'Translucent glass'
  },
  {
    id: 'neo',
    name: 'Neumorphism',
    category: 'Soft UI',
    iconComponent: Circle,
    tagline: 'Minimalist surface relief and extruded forms',
    description: 'Monochromatic canvas interface using opposing directional shadows for physical extruded or sunken states.',
    previewBg: 'linear-gradient(135deg, #e6ecf5 0%, #e2e8f0 100%)',
    useCases: ['Hardware controllers', 'Audio tools', 'Minimal dashboards'],
    elevation: 'Dual opposing directional light/shadow',
    radius: 'Soft rounded (14px to 20px)',
    surface: 'Monochromatic unified'
  }
]

const filteredThemes = computed(() => {
  if (activeFilter.value === 'All') return themeCatalog
  return themeCatalog.filter((t) => t.category === activeFilter.value)
})
</script>

<style scoped>
/* Hallmark · theme: mfs-theme · ThemeCatalogPage.vue */
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

.catalog-page {
  width: 100%;
}

.catalog-container {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
}

.catalog-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 48px 24px 32px;
}

.catalog-tag {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 12px;
  display: inline-block;
}

.catalog-title {
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}

.catalog-caption {
  font-size: 1.05rem;
  color: var(--text-muted);
  max-width: 680px;
  margin: 0 0 28px;
  line-height: 1.55;
}

.filter-tabs-row {
  display: flex;
  gap: 8px;
  overflow-x: auto;
}

.filter-pill {
  background: var(--surface-subtle);
  color: var(--text-muted);
  border: 1px solid var(--border);
  padding: 7px 16px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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

/* Grid */
.catalog-grid-section {
  padding: 48px 24px;
}

.theme-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 28px;
}

.theme-card-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 18px);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.theme-card-item.is-selected {
  border-color: var(--primary);
}

.card-hero-preview {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.specimen-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

/* Clay Specimen */
.preview-theme-clay {
  background: linear-gradient(135deg, #e4e7ff 0%, #ede8ff 50%, #fde7f3 100%);
}

.specimen-clay {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: #ffffff;
  border-radius: var(--radius-pill, 9999px);
  box-shadow: 
    8px 14px 24px rgba(109, 40, 217, 0.16),
    inset -3px -3px 7px rgba(109, 40, 217, 0.2),
    inset 3px 3px 7px #ffffff;
  transition: transform 0.25s ease;
}

.specimen-clay:hover {
  transform: translateY(-2px);
}

.clay-pill-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #f5f3ff;
  color: #8b5cf6;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    3px 6px 12px rgba(109, 40, 217, 0.12),
    inset 2px 2px 4px #ffffff,
    inset -2px -2px 4px rgba(109, 40, 217, 0.15);
}

.clay-specimen-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #241442;
}

/* Glass Specimen */
.preview-theme-glass {
  background: radial-gradient(circle at 20% 20%, #312e81 0%, #0f172a 65%, #020617 100%);
}

.specimen-glass {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: var(--radius-pill, 9999px);
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  transition: transform 0.25s ease;
}

.specimen-glass:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.16);
}

.glass-pill-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(56, 189, 248, 0.4);
  box-shadow: 0 0 14px rgba(56, 189, 248, 0.4);
}

.glass-specimen-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.4);
}

/* Neo Specimen */
.preview-theme-neo {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
}

.specimen-neo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: #e2e8f0;
  border-radius: var(--radius-pill, 9999px);
  box-shadow: 
    6px 6px 14px #bcc5d3,
    -6px -6px 14px #ffffff;
  transition: transform 0.25s ease;
}

.specimen-neo:hover {
  transform: translateY(-2px);
}

.neo-pill-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    inset 3px 3px 6px #bcc5d3,
    inset -3px -3px 6px #ffffff;
}

.neo-specimen-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #334155;
}

.card-active-label {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  padding: 4px 12px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-theme-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
  margin: 0;
  letter-spacing: -0.01em;
}

.card-category-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  background: var(--surface-subtle);
  padding: 4px 10px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--border);
}

.card-tagline {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--primary);
  margin: 0 0 10px;
}

.card-description {
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin: 0 0 18px;
}

.use-cases-box {
  margin-bottom: 18px;
}

.use-case-title {
  display: block;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.use-case-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.use-case-tag {
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  padding: 4px 10px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text);
  box-shadow: var(--input-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.spec-tokens-grid {
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius, 12px);
  box-shadow: var(--input-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  padding: 12px 14px;
  margin-bottom: 22px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.spec-token-row {
  display: grid;
  grid-template-columns: 75px 1fr;
  align-items: baseline;
  gap: 8px;
  font-size: 0.82rem;
}

.spec-token-label {
  color: var(--text-muted);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.spec-token-value {
  color: var(--text);
  font-weight: 600;
  line-height: 1.4;
  word-break: break-word;
}

.card-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.card-actions > * {
  flex: 1;
}

.btn-apply-theme {
  background: var(--surface-subtle);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 11px 16px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-apply-theme:hover {
  background: var(--surface);
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--clay-shadow-hover);
}

.btn-apply-theme:active {
  transform: translateY(1px);
  box-shadow: var(--clay-shadow-active);
}

.btn-apply-theme.btn-selected {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  border-color: var(--primary);
  box-shadow: var(--clay-shadow-active);
}

.btn-view-components {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 11px 16px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.btn-view-components:hover {
  background: var(--surface-subtle);
  border-color: var(--primary);
  transform: translateY(-1px);
  box-shadow: var(--clay-shadow-hover);
}

.btn-view-components:active {
  transform: translateY(1px);
  box-shadow: var(--clay-shadow-active);
}

.icon-inline {
  display: inline-block;
  vertical-align: middle;
}

/* Comparison section */
.comparison-section {
  border-top: 1px solid var(--border);
  background: var(--surface-subtle);
  padding: 60px 24px;
}

.comparison-heading {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.comparison-sub {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0 0 28px;
}

.matrix-table-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 18px);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  overflow-x: auto;
}

.matrix-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
  text-align: left;
}

.matrix-table th, .matrix-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

.matrix-table th {
  font-weight: 700;
  background: var(--surface-subtle);
}

.matrix-table tr:hover td {
  background: var(--surface-subtle);
}

.matrix-table tr:last-child th,
.matrix-table tr:last-child td {
  border-bottom: none;
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
