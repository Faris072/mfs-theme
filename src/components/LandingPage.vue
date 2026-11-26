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
              <Button variant="primary" size="md" @click="$emit('explore-catalog')">
                <span>Explore themes</span>
                <template #append>
                  <ArrowRight class="icon-inline" :size="16" />
                </template>
              </Button>
              <Button variant="surface" size="md" @click="router.push('/components')">
                Browse components
              </Button>
              <Button variant="surface" size="md" @click="scrollToSection('install-guide')">
                Installation guide
              </Button>
            </div>
          </div>

          <!-- Live Component Morphing Test (Real UI, No fake OS chrome) -->
          <div class="mfs-w-full mfs-min-w-0">
            <Card bordered class="preview-card mfs-overflow-hidden">
              <template #header>
                <div class="mfs-flex mfs-flex-col mfs-gap-2">
                  <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-2">
                    <span class="surface-label mfs-font-semibold mfs-text-muted">Live component state</span>
                    <span class="demo-theme-indicator mfs-font-semibold mfs-text-primary">{{ currentThemeName }}</span>
                  </div>
                  <div class="theme-switch-group mfs-flex mfs-overflow-x-auto">
                    <Chip
                      v-for="t in allThemes"
                      :key="t.id"
                      clickable
                      :active="currentTheme === t.id"
                      :variant="currentTheme === t.id ? 'primary' : 'surface'"
                      class="theme-chip mfs-whitespace-nowrap mfs-shrink-0"
                      @click="$emit('select-theme', t.id)"
                    >
                      <template #prepend>
                        <component :is="getThemeIcon(t)" :size="13" class="theme-toggle-icon" />
                      </template>
                      {{ t.name }}
                    </Chip>
                  </div>
                </div>
              </template>

              <div class="demo-card-inner mfs-flex mfs-flex-col">
                <div class="demo-card-row mfs-flex mfs-items-center">
                  <Avatar :label="inputName || 'A'" size="lg" shape="rounded" />
                  <div class="mfs-flex mfs-flex-col mfs-min-w-0">
                    <span class="demo-user-name mfs-text mfs-truncate">{{ inputName || 'Amina Chen' }}</span>
                    <span class="demo-theme-indicator mfs-font-semibold mfs-text-primary">Theme: {{ currentThemeName }}</span>
                  </div>
                </div>

                <Input
                  id="hero-user-input"
                  v-model="inputName"
                  label="User handle"
                  placeholder="Type name here"
                />

                <div class="demo-action-row mfs-flex mfs-flex-wrap mfs-gap-3">
                  <Button variant="primary" size="md" @click="handleAction">
                    <template v-if="actionDone" #prepend>
                      <Check :size="15" class="icon-inline" />
                    </template>
                    <span>{{ actionDone ? 'Saved to state' : 'Action button' }}</span>
                  </Button>
                  <Button variant="surface" size="md" @click="$emit('open-theme-detail', currentTheme)">
                    View specs
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <Divider class="section-divider" />

    <!-- Theme Showcase Grid -->
    <section class="pillars-section mfs-surface-subtle">
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
            class="pillar-card-wrap"
            :style="isDarkTheme(t.id) ? { background: t.previewBg, borderRadius: 'var(--radius, 20px)' } : undefined"
          >
            <Card
              bordered
              hoverable
              class="pillar-card mfs-h-full mfs-cursor-pointer"
              :class="{ 'is-selected': currentTheme === t.id }"
              @click="$emit('select-theme', t.id)"
            >
            <div class="mfs-flex mfs-flex-col mfs-h-full">
              <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-2 mfs-mb-4">
                <div class="pillar-icon-box mfs-surface-subtle mfs-shadow-inset mfs-flex mfs-items-center mfs-justify-center mfs-text-primary">
                  <component :is="getThemeIcon(t)" :size="20" />
                </div>
                <Badge variant="surface" size="sm">
                  {{ t.badge }}
                </Badge>
              </div>
              <h3 class="pillar-title mfs-text">{{ t.name }}</h3>
              <p class="pillar-description mfs-text-muted mfs-flex-1">{{ t.tagline }}</p>
              <div class="pillar-mini-specimen mfs-flex mfs-items-center mfs-justify-between mfs-gap-2">
                <Badge :variant="currentTheme === t.id ? 'primary' : 'surface'" size="sm">
                  {{ currentTheme === t.id ? 'Active' : 'Preview' }}
                </Badge>
                <Button
                  variant="surface"
                  size="sm"
                  @click.stop="$emit('open-theme-detail', t.id)"
                >
                  Specs
                </Button>
              </div>
            </div>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <Divider class="section-divider" />

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
            <Card bordered class="code-card">
              <div class="code-box mfs-relative mfs-overflow-x-auto mfs-font-mono mfs-text">
                <code>npm install @mfs-atomic/ui</code>
                <Button
                  variant="surface"
                  size="sm"
                  class="btn-copy-code mfs-absolute"
                  aria-label="Copy install command"
                  @click="copyCode('npm install @mfs-atomic/ui')"
                >
                  <Copy v-if="!copied" :size="14" />
                  <Check v-else :size="14" />
                </Button>
              </div>
            </Card>
          </div>

          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <span class="code-step-label mfs-font-semibold mfs-text">2. Application setup (main.ts)</span>
            <Card bordered class="code-card">
              <div class="code-box mfs-relative mfs-overflow-x-auto mfs-font-mono mfs-text">
                <pre class="mfs-m-0"><code>import { createApp } from 'vue'
import App from './App.vue'
import MfsTheme from '@mfs-atomic/ui'
import '@mfs-atomic/ui/style.css'

const app = createApp(App)
app.use(MfsTheme, { defaultTheme: 'clay' })
app.mount('#app')</code></pre>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>

    <Divider class="section-divider" />

    <!-- Footer Action -->
    <section class="closing-action">
      <div class="mfs-container mfs-text-center mfs-flex mfs-flex-col mfs-items-center">
        <h2 class="closing-title mfs-text mfs-m-0 mfs-mb-2">Explore theme directory</h2>
        <p class="closing-desc mfs-text-muted mfs-m-0 mfs-mb-6">
          Browse the full component directory, interactive props, utility styling guides, or jump into ready-made layouts with
          <a
            :href="presetUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="mfs-text-primary mfs-font-semibold"
          >MFS Presets</a>.
        </p>
        <div class="mfs-flex mfs-flex-wrap mfs-justify-center mfs-gap-3">
          <Button variant="primary" size="lg" @click="$emit('explore-catalog')">
            <span>Browse themes</span>
            <template #append>
              <ArrowRight class="icon-inline" :size="16" />
            </template>
          </Button>
          <Button variant="surface" size="lg" @click="openPresets">
            <span>Explore Presets</span>
            <template #append>
              <ExternalLink class="icon-inline" :size="16" />
            </template>
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type Component } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Chip, Avatar, Input, Badge, Divider } from '../lib'
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
  ExternalLink,
  Copy,
  Check
} from 'lucide-vue-next'
import { isDarkTheme, THEMES_DATA, type ThemeDetailInfo, type ThemeType } from '../data/themesData'

const presetUrl = import.meta.env.VITE_PRESET_URL || 'https://preset-ui.mfstechnology.co.id'

const openPresets = () => {
  window.open(presetUrl, '_blank', 'noopener,noreferrer')
}

const props = defineProps<{
  currentTheme: ThemeType
}>()

defineEmits<{
  (e: 'explore-catalog'): void
  (e: 'select-theme', theme: ThemeType): void
  (e: 'open-theme-detail', theme: ThemeType): void
}>()

const router = useRouter()
const inputName = ref('Amina Chen')
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
  font-weight: 600;
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
  gap: 12px;
}

.icon-inline {
  display: inline-block;
  vertical-align: middle;
}

/* Surface Panel */
.surface-label {
  font-size: 0.8rem;
}

.theme-switch-group {
  padding: 4px;
  gap: 8px;
  max-width: 100%;
}

.theme-chip {
  font-size: 0.76rem;
}

.theme-toggle-icon {
  display: inline-block;
}

.demo-card-inner {
  gap: 16px;
}

.demo-card-row {
  gap: 12px;
}

.demo-user-name {
  font-size: 1.05rem;
  font-weight: 600;
}

.demo-theme-indicator {
  font-size: 0.78rem;
}

.demo-action-row > * {
  flex: 1;
}

/* Override button transform-based hover/active in scoped context */
:deep(.btn) {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

:deep(.btn:hover),
:deep(.btn:active) {
  transform: none;
}

.section-divider {
  margin: 0;
}

/* Pillars / Showcase Section */
.pillars-section {
  padding: 64px 0;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 600;
  margin: 0 0 12px;
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

.pillar-card-wrap {
  height: 100%;
}

.pillar-card.is-selected {
  border-color: var(--primary);
}

.pillar-icon-box {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md, 12px);
}

.pillar-title {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 8px;
}

.pillar-description {
  font-size: 0.86rem;
  line-height: 1.5;
  margin: 0 0 16px;
}

.pillar-mini-specimen {
  margin-top: auto;
  padding-top: 12px;
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
  min-height: 36px;
  display: flex;
  align-items: center;
}

.btn-copy-code {
  top: 0;
  right: 0;
}

/* Closing Action */
.closing-action {
  padding: 56px 0;
}

.closing-title {
  font-size: 1.85rem;
  font-weight: 600;
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
