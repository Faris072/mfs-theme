<template>
  <div class="docs-shell">
    <!-- Mobile component switcher -->
    <div class="mobile-switcher">
      <label class="mobile-switcher-label" for="mobile-comp-select">Component</label>
      <div class="mobile-switcher-row">
        <select
          id="mobile-comp-select"
          class="mobile-select"
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

    <div class="docs-layout">
      <!-- Desktop sticky sidebar -->
      <aside class="docs-sidebar" aria-label="Components navigation">
        <div class="sidebar-search-wrap">
          <Search :size="15" class="sidebar-search-icon" />
          <input
            v-model="searchQuery"
            type="search"
            class="sidebar-search"
            placeholder="Filter components..."
            aria-label="Filter components"
          />
        </div>

        <nav class="sidebar-groups">
          <div
            v-for="group in filteredGroups"
            :key="group.phase"
            class="sidebar-group"
          >
            <p class="sidebar-group-title">{{ group.title }}</p>
            <ul class="sidebar-list">
              <li v-for="item in group.items" :key="item.slug">
                <button
                  type="button"
                  class="sidebar-link"
                  :class="{ 'is-active': item.slug === activeItem.slug }"
                  :aria-current="item.slug === activeItem.slug ? 'page' : undefined"
                  @click="emit('select', item.slug)"
                >
                  <span>{{ item.name }}</span>
                  <span class="sidebar-cat">{{ item.category }}</span>
                </button>
              </li>
            </ul>
          </div>

          <p v-if="filteredGroups.length === 0" class="sidebar-empty">
            No components match "{{ searchQuery }}".
          </p>
        </nav>
      </aside>

      <!-- Main documentation content -->
      <div class="docs-main">
        <header class="docs-header">
          <div class="docs-header-top">
            <div class="docs-title-row">
              <h1 class="docs-title">{{ activeItem.name }}</h1>
              <span class="docs-category-badge">{{ activeItem.category }}</span>
            </div>

            <!-- Inline quick theme switcher -->
            <div class="docs-theme-switcher">
              <span class="docs-theme-label">Theme:</span>
              <Select
                class="docs-theme-select-comp"
                :model-value="currentTheme"
                :options="themeSelectOptions"
                :searchable="false"
                :clearable="false"
                @update:model-value="onThemeSelect"
              />
            </div>
          </div>

          <p class="docs-summary">{{ activeItem.summary }}</p>
        </header>

        <div class="docs-body">
          <component :is="activePhaseDemo" :active-slug="activeItem.slug" />
        </div>

        <footer class="docs-pager" aria-label="Component pagination">
          <button
            v-if="prevItem"
            type="button"
            class="pager-btn pager-prev"
            @click="emit('select', prevItem.slug)"
          >
            <ChevronLeft :size="16" />
            <div class="pager-meta">
              <span class="pager-dir">Previous</span>
              <strong class="pager-name">{{ prevItem.name }}</strong>
            </div>
          </button>
          <span v-else />

          <button
            v-if="nextItem"
            type="button"
            class="pager-btn pager-next"
            @click="emit('select', nextItem.slug)"
          >
            <div class="pager-meta">
              <span class="pager-dir">Next</span>
              <strong class="pager-name">{{ nextItem.name }}</strong>
            </div>
            <ChevronRight :size="16" />
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { ChevronLeft, ChevronRight, Circle, Layers, Search, Sparkles } from 'lucide-vue-next'
import { Select, useTheme, type ThemeType } from '../lib'
import {
  COMPONENT_NAV,
  PHASE_TITLES,
  getComponentBySlug,
  type ComponentNavItem
} from '../data/componentDocs'

const props = defineProps<{
  activeSlug: string
}>()

const emit = defineEmits<{
  (e: 'select', slug: string): void
}>()

const { currentTheme, themeOptions, setTheme } = useTheme()
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

const getThemeIcon = (id: ThemeType) => {
  if (id === 'glass') return Sparkles
  if (id === 'neo') return Circle
  return Layers
}

const themeSelectOptions = computed(() =>
  themeOptions.map((opt) => ({ label: opt.name, value: opt.id }))
)

const onThemeSelect = (val: string | number | null) => {
  if (val) {
    setTheme(val as ThemeType)
  }
}

const onMobileSelect = (e: Event) => {
  const target = e.target as HTMLSelectElement
  if (target.value) {
    emit('select', target.value)
  }
}
</script>

<style scoped>
.docs-shell {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
  padding: 24px 24px 48px;
}

.mobile-switcher {
  display: none;
  margin-bottom: 16px;
  padding: 12px 14px;
  border-radius: var(--radius-md, 12px);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--clay-shadow);
}

.mobile-switcher-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.mobile-select {
  width: 100%;
  padding: 9px 12px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border);
  background: var(--surface-subtle);
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 600;
}

.docs-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
}

.docs-sidebar {
  position: sticky;
  top: 84px;
  max-height: calc(100vh - 108px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: var(--radius-lg, 18px);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.sidebar-search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.sidebar-search-icon {
  position: absolute;
  left: 10px;
  color: var(--text-muted);
  pointer-events: none;
}

.sidebar-search {
  width: 100%;
  padding: 8px 10px 8px 32px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border);
  background: var(--surface-subtle);
  color: var(--text);
  font-size: 0.84rem;
  box-shadow: var(--input-shadow);
}

.sidebar-search::placeholder {
  color: var(--text-muted);
}

.sidebar-groups {
  overflow-y: auto;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.sidebar-group-title {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin: 0 0 6px;
  padding: 0 6px;
}

.sidebar-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-link {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 7px 10px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: transparent;
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.sidebar-link:hover {
  background: var(--surface-subtle);
}

.sidebar-link.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  font-weight: 600;
}

.sidebar-cat {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.sidebar-link.is-active .sidebar-cat {
  color: var(--primary-text, #ffffff);
  opacity: 0.85;
}

.sidebar-empty {
  font-size: 0.82rem;
  color: var(--text-muted);
  padding: 8px 6px;
}

.docs-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.docs-header {
  padding: 22px 24px;
  border-radius: var(--radius-lg, 18px);
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.docs-header-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.docs-title-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.docs-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: var(--text);
  margin: 0;
  line-height: 1.2;
}

.docs-category-badge,
.docs-phase-badge {
  font-size: 0.74rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--border);
}

.docs-category-badge {
  background: var(--surface-subtle);
  color: var(--primary);
}

.docs-phase-badge {
  background: var(--surface-subtle);
  color: var(--text-muted);
}

.docs-theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px 4px 12px;
  border-radius: var(--radius-pill, 9999px);
  background: var(--surface-subtle);
  border: 1px solid var(--border);
}

.docs-theme-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.docs-theme-select-comp {
  width: 162px;
}

.docs-theme-select-comp :deep(.select-trigger) {
  padding: 5px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: var(--radius-pill, 9999px);
}

.docs-theme-select-comp :deep(.select-dropdown) {
  z-index: 180;
  min-width: 185px;
  right: 0;
  left: auto;
}

.docs-theme-pills {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px;
  border-radius: var(--radius-pill, 9999px);
  background: var(--surface-subtle);
  border: 1px solid var(--border);
}

.docs-theme-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 5px 11px;
  border-radius: var(--radius-pill, 9999px);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.docs-theme-pill:hover {
  color: var(--text);
}

.docs-theme-pill.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
}

.docs-summary {
  margin: 10px 0 0;
  font-size: 0.96rem;
  color: var(--text-muted);
}

.docs-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.docs-pager {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
}

.pager-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
  box-shadow: var(--clay-shadow);
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.pager-btn:hover {
  border-color: var(--primary);
  transform: translateY(-1px);
}

.pager-meta {
  display: flex;
  flex-direction: column;
}

.pager-prev .pager-meta {
  text-align: left;
}

.pager-next .pager-meta {
  text-align: right;
}

.pager-dir {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.pager-name {
  font-size: 0.92rem;
  font-weight: 700;
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
