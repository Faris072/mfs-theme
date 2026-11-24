<template>
  <div class="mfs-w-full">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="mfs-container">
        <div class="landing-hero mfs-items-center">
          <div class="mfs-flex mfs-flex-col mfs-min-w-0">
            <h1 class="landing-title mfs-text mfs-mb-4">
              Multi-theme Vue 3 component library
            </h1>

            <p class="landing-subtitle mfs-text-muted">
              Switch between {{ allThemes.length }} distinct aesthetic themes—from tactile clay and frosted glass to cyberpunk, terminal, and brutalism—instantly.
            </p>

            <!-- CTA Actions -->
            <div class="landing-actions mfs-flex mfs-items-center mfs-flex-wrap">
              <button class="action-primary mfs-bg-primary mfs-pill mfs-font-semibold mfs-inline-flex mfs-items-center mfs-gap-2 mfs-shadow mfs-cursor-pointer mfs-transition" @click="$emit('explore-catalog')">
                <span>Next: Choose Theme</span>
                <ArrowRight class="icon-inline" :size="16" />
              </button>
              <router-link to="/components" class="action-secondary mfs-surface mfs-text mfs-pill mfs-font-medium mfs-inline-flex mfs-items-center mfs-justify-center mfs-shadow mfs-cursor-pointer mfs-transition">
                <span>Browse components</span>
              </router-link>
              <button class="action-secondary mfs-surface mfs-text mfs-pill mfs-font-medium mfs-inline-flex mfs-items-center mfs-justify-center mfs-shadow mfs-cursor-pointer mfs-transition" @click="scrollToSection('install-guide')">
                <span>Installation guide</span>
              </button>
            </div>
          </div>

          <!-- Live Component Morphing Test (Real UI, No fake OS chrome) -->
          <div class="mfs-w-full mfs-min-w-0">
            <div class="mfs-surface mfs-rounded-lg mfs-shadow-card mfs-overflow-hidden">
              <div class="surface-header mfs-surface-subtle mfs-border-none mfs-border-b mfs-flex mfs-flex-col mfs-gap-2">
                <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-2">
                  <span class="surface-label mfs-font-semibold mfs-text-muted">Live component state</span>
                  <span class="demo-theme-indicator mfs-font-semibold mfs-text-primary">{{ currentThemeName }}</span>
                </div>
                <div class="theme-switch-group mfs-flex mfs-surface mfs-pill mfs-shadow-inset mfs-overflow-x-auto">
                  <button
                    v-for="t in allThemes"
                    :key="t.id"
                    class="theme-toggle-btn mfs-border-none mfs-pill mfs-font-semibold mfs-text-muted mfs-flex mfs-items-center mfs-bg-transparent mfs-cursor-pointer mfs-whitespace-nowrap mfs-shrink-0 mfs-transition"
                    :class="{ 'is-active': currentTheme === t.id }"
                    @click="$emit('select-theme', t.id)"
                  >
                    <component :is="getThemeIcon(t)" :size="13" class="theme-toggle-icon" />
                    <span>{{ t.name }}</span>
                  </button>
                </div>
              </div>

              <div class="mfs-p-6">
                <div class="demo-card-inner mfs-flex mfs-flex-col">
                  <div class="demo-card-row mfs-flex mfs-items-center">
                    <div class="demo-avatar mfs-rounded-md mfs-bg-primary mfs-flex mfs-items-center mfs-justify-center mfs-shadow mfs-shrink-0">
                      {{ inputName ? inputName.charAt(0).toUpperCase() : 'U' }}
                    </div>
                    <div class="mfs-flex mfs-flex-col mfs-min-w-0">
                      <span class="demo-user-name mfs-text mfs-truncate">{{ inputName || 'Developer' }}</span>
                      <span class="demo-theme-indicator mfs-font-semibold mfs-text-primary">Theme: {{ currentThemeName }}</span>
                    </div>
                  </div>

                  <div class="mfs-flex mfs-flex-col mfs-gap-1-5">
                    <label class="demo-label mfs-font-bold mfs-text-muted" for="hero-user-input">User handle</label>
                    <div class="demo-input-box mfs-surface-subtle mfs-rounded-sm mfs-shadow-inset mfs-transition">
                      <input
                        id="hero-user-input"
                        v-model="inputName"
                        type="text"
                        class="demo-input-element mfs-w-full mfs-border-none mfs-text mfs-font-semibold mfs-bg-transparent mfs-outline-none"
                        placeholder="Type name here"
                      />
                    </div>
                  </div>

                  <div class="demo-action-row mfs-flex mfs-flex-wrap mfs-gap-3">
                    <button class="demo-button-primary mfs-bg-primary mfs-pill mfs-font-bold mfs-shadow mfs-inline-flex mfs-items-center mfs-justify-center mfs-gap-1-5 mfs-cursor-pointer mfs-transition" @click="handleAction">
                      <Sparkles v-if="actionDone" :size="15" class="icon-inline" />
                      <span>{{ actionDone ? 'Saved to state!' : 'Action button' }}</span>
                    </button>
                    <button class="demo-button-secondary mfs-surface mfs-text mfs-pill mfs-font-semibold mfs-shadow mfs-inline-flex mfs-items-center mfs-justify-center mfs-gap-1-5 mfs-cursor-pointer mfs-transition" @click="$emit('open-theme-detail', currentTheme)">
                      <span>View specs</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Theme Showcase Grid -->
    <section class="pillars-section mfs-border-none mfs-border-t mfs-border-b mfs-surface-subtle">
      <div class="mfs-container">
        <h2 class="section-title mfs-text">{{ allThemes.length }} distinct aesthetic paradigms</h2>
        <p class="section-caption mfs-text-muted">
          Single component specification adapted across {{ allThemes.length }} visual depth models without changing template markup. Click any theme card to preview it live.
        </p>

        <div class="pillars-grid mfs-gap-6">
          <div
            v-for="t in allThemes"
            :key="t.id"
            :data-theme="t.id"
            class="pillar-card mfs-card mfs-p-6 mfs-h-full mfs-flex mfs-flex-col mfs-cursor-pointer mfs-transition"
            :class="{ 'is-selected': currentTheme === t.id }"
            @click="$emit('select-theme', t.id)"
          >
            <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-2 mfs-mb-4">
              <div class="pillar-icon-box mfs-surface-subtle mfs-shadow-inset mfs-flex mfs-items-center mfs-justify-center mfs-text-primary">
                <component :is="getThemeIcon(t)" :size="20" />
              </div>
              <span class="pillar-badge mfs-surface-subtle mfs-text-primary mfs-font-bold mfs-pill mfs-border">
                {{ t.badge }}
              </span>
            </div>
            <h3 class="pillar-title mfs-text">{{ t.name }}</h3>
            <p class="pillar-description mfs-text-muted mfs-flex-1">{{ t.tagline }}</p>
            <div class="pillar-mini-specimen mfs-flex mfs-items-center mfs-justify-between mfs-gap-2">
              <div class="mfs-bg-primary mfs-inline-flex mfs-items-center mfs-gap-2 mfs-pill mfs-font-bold mfs-px-3 mfs-py-1-5 mfs-text-xs mfs-shadow">
                <span class="demo-dot mfs-rounded-full"></span>
                <span>{{ currentTheme === t.id ? 'Active' : 'Preview' }}</span>
              </div>
              <button
                class="mfs-surface-subtle mfs-text mfs-pill mfs-text-xs mfs-font-semibold mfs-px-3 mfs-py-1-5 mfs-cursor-pointer mfs-transition"
                @click.stop="$emit('open-theme-detail', t.id)"
              >
                Specs
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Start Installation -->
    <section id="install-guide" class="install-section">
      <div class="mfs-container">
        <h2 class="section-title mfs-text">Getting started</h2>
        <p class="section-caption mfs-text-muted">
          Install the package and register the plugin with your preferred initial theme.
        </p>

        <div class="code-flow-grid mfs-gap-6">
          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <span class="code-step-label mfs-font-semibold mfs-text">1. Terminal</span>
            <div class="code-box mfs-relative mfs-overflow-x-auto mfs-surface-subtle mfs-rounded-md mfs-shadow-inset mfs-p-4 mfs-font-mono mfs-text">
              <code>npm install @mfs-atomic/theme</code>
              <button class="btn-copy-code mfs-absolute mfs-cursor-pointer mfs-transition mfs-surface mfs-pill mfs-text-muted mfs-py-1 mfs-px-2 mfs-flex mfs-items-center mfs-justify-center mfs-shadow" @click="copyCode('npm install @mfs-atomic/theme')">
                <Copy v-if="!copied" :size="14" />
                <Check v-else :size="14" />
              </button>
            </div>
          </div>

          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <span class="code-step-label mfs-font-semibold mfs-text">2. Application setup (main.ts)</span>
            <div class="code-box mfs-relative mfs-overflow-x-auto mfs-surface-subtle mfs-rounded-md mfs-shadow-inset mfs-p-4 mfs-font-mono mfs-text">
              <pre class="mfs-m-0"><code>import { createApp } from 'vue'
import App from './App.vue'
import MfsTheme from '@mfs-atomic/theme'
import '@mfs-atomic/theme/style.css'

const app = createApp(App)
app.use(MfsTheme, { defaultTheme: 'clay' })
app.mount('#app')</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Action -->
    <section class="closing-action mfs-border-none mfs-border-t">
      <div class="mfs-container mfs-text-center mfs-flex mfs-flex-col mfs-items-center">
        <h2 class="closing-title mfs-text mfs-m-0 mfs-mb-2">Explore theme directory</h2>
        <p class="closing-desc mfs-text-muted mfs-m-0 mfs-mb-6">
          Browse the full component directory, interactive props, and utility styling guides.
        </p>
        <div class="mfs-flex mfs-gap-3">
          <button class="action-primary mfs-bg-primary mfs-pill mfs-font-semibold mfs-inline-flex mfs-items-center mfs-gap-2 mfs-shadow mfs-cursor-pointer mfs-transition" @click="$emit('explore-catalog')">
            <span>Browse themes</span>
            <ArrowRight class="icon-inline" :size="16" />
          </button>
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
  Copy,
  Check
} from 'lucide-vue-next'
import { THEMES_DATA, type ThemeDetailInfo, type ThemeType } from '../data/themesData'

const props = defineProps<{
  currentTheme: ThemeType
}>()

defineEmits<{
  (e: 'explore-catalog'): void
  (e: 'select-theme', theme: ThemeType): void
  (e: 'open-theme-detail', theme: ThemeType): void
}>()

const inputName = ref('Faris Developer')
const actionDone = ref(false)
const copied = ref(false)

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

const allThemes = computed<ThemeDetailInfo[]>(() => Object.values(THEMES_DATA))

const getThemeIcon = (theme: ThemeDetailInfo): Component => {
  return ICON_BY_NAME[theme.icon] || Layers
}

const currentThemeName = computed(() => {
  return THEMES_DATA[props.currentTheme]?.name || props.currentTheme
})

const handleAction = () => {
  actionDone.value = true
  setTimeout(() => {
    actionDone.value = false
  }, 1800)
}

const copyCode = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (e) {
    console.error(e)
  }
}

const scrollToSection = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Hallmark · theme: mfs-theme · LandingPage.vue */
.mfs-container {
  max-width: 1280px;
  padding-inline: 24px;
}

.hero-section {
  padding: 56px 0 64px;
}

.landing-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
}

.landing-title {
  font-size: 2.85rem;
  font-weight: 800;
  line-height: 1.15;
  margin-top: 0;
  letter-spacing: -0.02em;
}

.landing-subtitle {
  font-size: 1.1rem;
  line-height: 1.55;
  margin: 0 0 32px;
  max-width: 520px;
}

.landing-actions {
  gap: 14px;
}

.action-primary {
  border: 1px solid transparent;
  padding: 12px 22px;
  font-size: 0.95rem;
}

.action-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--clay-shadow-hover);
  opacity: 0.96;
}

.action-primary:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: var(--clay-shadow-active);
}

.icon-inline {
  display: inline-block;
  vertical-align: middle;
}

.action-secondary {
  padding: 12px 20px;
  font-size: 0.95rem;
  text-decoration: none;
}

.action-secondary:hover {
  background: var(--surface-subtle);
  border-color: var(--primary);
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--clay-shadow-hover);
}

.action-secondary:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: var(--clay-shadow-active);
}

/* Surface Panel */
.surface-header {
  padding: 14px 18px;
}

.surface-label {
  font-size: 0.8rem;
}

.theme-switch-group {
  padding: 4px;
  gap: 4px;
  max-width: 100%;
}

.theme-toggle-btn {
  padding: 5px 10px;
  font-size: 0.76rem;
  gap: 5px;
}

.theme-toggle-btn.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  box-shadow: var(--clay-shadow);
}

.theme-toggle-icon {
  display: inline-block;
}

.demo-card-inner {
  gap: 18px;
}

.demo-card-row {
  gap: 14px;
}

.demo-avatar {
  width: 46px;
  height: 46px;
  font-size: 1.25rem;
  font-weight: 800;
}

.demo-user-name {
  font-size: 1.05rem;
  font-weight: 800;
}

.demo-theme-indicator {
  font-size: 0.78rem;
}

.demo-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.demo-input-box {
  padding: 3px 6px;
}

.demo-input-box:focus-within {
  border-color: var(--primary);
}

.demo-input-element {
  padding: 8px 10px;
  font-size: 0.92rem;
}

.demo-action-row > * {
  flex: 1;
}

.demo-button-primary,
.demo-button-secondary {
  padding: 11px 16px;
  font-size: 0.88rem;
}

.demo-button-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--clay-shadow-hover);
  filter: brightness(1.05);
}

.demo-button-primary:active,
.demo-button-secondary:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: var(--clay-shadow-active);
}

.demo-button-secondary:hover {
  background: var(--surface-subtle);
  border-color: var(--primary);
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--clay-shadow-hover);
}

/* Pillars / Showcase Section */
.pillars-section {
  padding: 64px 0;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}

.section-caption {
  font-size: 1rem;
  max-width: 660px;
  margin: 0 0 32px;
  line-height: 1.6;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
}

.pillar-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--clay-shadow-hover);
}

.pillar-card.is-selected {
  border-color: var(--primary);
}

.pillar-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md, 12px);
}

.pillar-badge {
  font-size: 0.72rem;
  padding: 4px 10px;
}

.pillar-title {
  font-size: 1.15rem;
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.pillar-description {
  font-size: 0.86rem;
  line-height: 1.5;
  margin: 0 0 18px;
}

.pillar-mini-specimen {
  margin-top: auto;
  padding-top: 10px;
}

.demo-dot {
  width: 7px;
  height: 7px;
  background: currentColor;
}

/* Install Section */
.install-section {
  padding: 64px 0;
}

.code-flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
}

.code-step-label {
  font-size: 0.85rem;
}

.code-box {
  font-size: 0.85rem;
  padding-right: 48px;
}

.btn-copy-code {
  top: 10px;
  right: 10px;
}

.btn-copy-code:hover {
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: var(--clay-shadow-hover);
}

.btn-copy-code:active {
  box-shadow: var(--clay-shadow-active);
}

/* Closing Action */
.closing-action {
  padding: 56px 0;
}

.closing-title {
  font-size: 1.85rem;
  font-weight: 800;
}

.closing-desc {
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 840px) {
  .landing-hero {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .landing-title {
    font-size: 2.2rem;
  }
}

@media (max-width: 768px) {
  .mfs-container {
    padding-inline: 16px;
  }
  .hero-section,
  .pillars-section,
  .install-section,
  .closing-action {
    padding: 48px 0;
  }
}
</style>
