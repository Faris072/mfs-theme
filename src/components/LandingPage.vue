<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="landing-hero">
      <div class="landing-hero__content">
        <h1 class="landing-title">
          Multi-theme Vue 3 component library
        </h1>

        <p class="landing-subtitle">
          Switch between tactile clay, translucent glass, and soft neumorphic interfaces instantly.
        </p>

        <!-- CTA Actions -->
        <div class="landing-actions">
          <button class="action-primary" @click="$emit('explore-catalog')">
            <span>Next: Choose Theme</span>
            <ArrowRight class="icon-inline" :size="16" />
          </button>
          <router-link to="/components" class="action-secondary action-link">
            <span>Browse components</span>
          </router-link>
          <button class="action-secondary" @click="scrollToSection('install-guide')">
            <span>Installation guide</span>
          </button>
        </div>
      </div>

      <!-- Live Component Morphing Test (Real UI, No fake OS chrome) -->
      <div class="landing-hero__surface">
        <div class="surface-panel">
          <div class="surface-header">
            <span class="surface-label">Live component state</span>
            <div class="theme-switch-group">
              <button
                v-for="t in themeList"
                :key="t.id"
                class="theme-toggle-btn"
                :class="{ 'is-active': currentTheme === t.id }"
                @click="$emit('select-theme', t.id)"
              >
                <component :is="t.iconComponent" :size="14" class="theme-toggle-icon" />
                <span>{{ t.name }}</span>
              </button>
            </div>
          </div>

          <div class="surface-content">
            <div class="demo-card-inner">
              <div class="demo-card-row">
                <div class="demo-avatar">
                  {{ inputName ? inputName.charAt(0).toUpperCase() : 'U' }}
                </div>
                <div class="demo-user-meta">
                  <span class="demo-user-name">{{ inputName || 'Developer' }}</span>
                  <span class="demo-theme-indicator">Theme: {{ currentThemeName }}</span>
                </div>
              </div>

              <div class="demo-field">
                <label class="demo-label" for="hero-user-input">User handle</label>
                <div class="demo-input-box">
                  <input
                    id="hero-user-input"
                    v-model="inputName"
                    type="text"
                    class="demo-input-element"
                    placeholder="Type name here"
                  />
                </div>
              </div>

              <div class="demo-action-row">
                <button class="demo-button-primary" @click="handleAction">
                  <Sparkles v-if="actionDone" :size="15" class="icon-inline" />
                  <span>{{ actionDone ? 'Saved to state!' : 'Action button' }}</span>
                </button>
                <button class="demo-button-secondary" @click="$emit('open-theme-detail', currentTheme)">
                  <span>View specs</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Architecture Pillars -->
    <section class="pillars-section">
      <div class="section-container">
        <h2 class="section-title">Three distinct aesthetic paradigms</h2>
        <p class="section-caption">
          Single component specification adapted across three visual depth models without changing template markup.
        </p>

        <div class="pillars-grid">
          <div class="pillar-card pillar-card--clay">
            <div class="pillar-header">
              <div class="pillar-icon-box clay-specimen-icon">
                <Layers :size="20" class="pillar-icon" />
              </div>
              <span class="pillar-badge clay-badge">Tactile 3D</span>
            </div>
            <h3 class="pillar-title">Claymorphism</h3>
            <p class="pillar-description">
              Simulates inflated digital surfaces using double inner highlights and soft diffuse exterior drop shadows with rounded curves.
            </p>
            <div class="pillar-mini-specimen clay-mini-specimen">
              <div class="clay-pill-demo">
                <span class="clay-demo-dot"></span>
                <span>Inflated Pill</span>
              </div>
            </div>
          </div>

          <div class="pillar-card pillar-card--glass">
            <div class="pillar-header">
              <div class="pillar-icon-box glass-specimen-icon">
                <Sparkles :size="20" class="pillar-icon" />
              </div>
              <span class="pillar-badge glass-badge">Frosted Glass</span>
            </div>
            <h3 class="pillar-title">Glassmorphism</h3>
            <p class="pillar-description">
              Translucent multi-layer glass panels with intensive backdrop-filter blur, subtle luminous borders, and deep canvas contrast.
            </p>
            <div class="pillar-mini-specimen glass-mini-specimen">
              <div class="glass-pill-demo">
                <span class="glass-demo-dot"></span>
                <span>Translucent Pane</span>
              </div>
            </div>
          </div>

          <div class="pillar-card pillar-card--neo">
            <div class="pillar-header">
              <div class="pillar-icon-box neo-specimen-icon">
                <Circle :size="20" class="pillar-icon" />
              </div>
              <span class="pillar-badge neo-badge">Soft UI Extrusion</span>
            </div>
            <h3 class="pillar-title">Neumorphism</h3>
            <p class="pillar-description">
              Monochromatic tactile material extruded directly from the background canvas with dual opposing light and shadow coordinates.
            </p>
            <div class="pillar-mini-specimen neo-mini-specimen">
              <div class="neo-pill-demo">
                <span class="neo-demo-dot"></span>
                <span>Extruded Surface</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Start Installation -->
    <section id="install-guide" class="install-section">
      <div class="section-container">
        <h2 class="section-title">Getting started</h2>
        <p class="section-caption">
          Install the package and register the plugin with your preferred initial theme.
        </p>

        <div class="code-flow-grid">
          <div class="code-flow-item">
            <span class="code-step-label">1. Terminal</span>
            <div class="code-box">
              <code>npm install mfs-theme</code>
              <button class="btn-copy-code" @click="copyCode('npm install mfs-theme')">
                <Copy v-if="!copied" :size="14" />
                <Check v-else :size="14" />
              </button>
            </div>
          </div>

          <div class="code-flow-item">
            <span class="code-step-label">2. Application setup (main.ts)</span>
            <div class="code-box">
              <pre><code>import { createApp } from 'vue'
import App from './App.vue'
import MfsTheme from 'mfs-theme'
import 'mfs-theme/style.css'

const app = createApp(App)
app.use(MfsTheme, { defaultTheme: 'clay' })
app.mount('#app')</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Action -->
    <section class="closing-action">
      <div class="section-container closing-inner">
        <h2 class="closing-title">Explore theme directory</h2>
        <p class="closing-desc">
          Browse the full component directory, interactive props, and utility styling guides.
        </p>
        <div class="closing-buttons">
          <button class="action-primary" @click="$emit('explore-catalog')">
            <span>Browse themes</span>
            <ArrowRight class="icon-inline" :size="16" />
          </button>
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
  Copy,
  Check
} from 'lucide-vue-next'
import { type ThemeType } from '../lib'

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

const themeList = [
  { id: 'clay' as ThemeType, name: 'Clay', iconComponent: Layers },
  { id: 'glass' as ThemeType, name: 'Glass', iconComponent: Sparkles },
  { id: 'neo' as ThemeType, name: 'Neo', iconComponent: Circle }
]

const currentThemeName = computed(() => {
  const t = themeList.find((item) => item.id === props.currentTheme)
  return t ? t.name : 'Clay'
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

.landing-page {
  width: 100%;
}

.landing-hero {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
  padding: 56px 24px 72px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}

.landing-hero__content {
  display: flex;
  flex-direction: column;
}

.landing-tag {
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 600;
  margin-bottom: 14px;
}

.landing-title {
  font-size: 2.85rem;
  font-weight: 800;
  line-height: 1.15;
  color: var(--text);
  margin: 0 0 16px;
  letter-spacing: -0.02em;
}

.landing-subtitle {
  font-size: 1.1rem;
  line-height: 1.55;
  color: var(--text-muted);
  margin: 0 0 32px;
  max-width: 520px;
}

.landing-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
}

.action-primary {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  border: 1px solid transparent;
  padding: 12px 22px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 12px 20px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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
.landing-hero__surface {
  width: 100%;
}

.surface-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius, 18px);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  overflow: hidden;
}

.surface-header {
  padding: 14px 18px;
  background: var(--surface-subtle);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.surface-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

.theme-switch-group {
  display: flex;
  background: var(--surface);
  padding: 3px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--border);
  gap: 3px;
  box-shadow: var(--input-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.theme-toggle-btn {
  background: transparent;
  border: none;
  padding: 4px 10px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.15s ease, background-color 0.15s ease, box-shadow 0.2s ease;
}

.theme-toggle-btn.is-active {
  background: var(--surface-subtle);
  color: var(--primary);
  box-shadow: var(--clay-shadow);
}

.theme-toggle-icon {
  display: inline-block;
}

.surface-content {
  padding: 24px;
}

.demo-card-inner {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.demo-card-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.demo-avatar {
  width: 46px;
  height: 46px;
  border-radius: var(--radius-md, 14px);
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 800;
  box-shadow: var(--clay-shadow);
}

.demo-user-meta {
  display: flex;
  flex-direction: column;
}

.demo-user-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text);
}

.demo-theme-indicator {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--primary);
}

.demo-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.demo-input-box {
  background: var(--surface-subtle);
  border-radius: var(--radius-sm, 12px);
  box-shadow: var(--input-shadow);
  border: 1px solid var(--border);
  padding: 3px 6px;
  transition: border-color 0.15s ease;
}

.demo-input-box:focus-within {
  border-color: var(--primary);
}

.demo-input-element {
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  color: var(--text);
  font-size: 0.92rem;
  font-weight: 600;
  outline: none;
}

.demo-action-row {
  display: flex;
  gap: 12px;
}

.demo-action-row > * {
  flex: 1;
}

.demo-button-primary {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  border: 1px solid var(--border, transparent);
  padding: 11px 16px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.demo-button-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--clay-shadow-hover);
  filter: brightness(1.05);
}

.demo-button-primary:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: var(--clay-shadow-active);
}

.demo-button-secondary {
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

.demo-button-secondary:hover {
  background: var(--surface-subtle);
  border-color: var(--primary);
  transform: translateY(-2px) scale(1.02);
  box-shadow: var(--clay-shadow-hover);
}

.demo-button-secondary:active {
  transform: translateY(1px) scale(0.98);
  box-shadow: var(--clay-shadow-active);
}

/* Pillars Section */
.pillars-section {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--surface-subtle);
  padding: 72px 24px;
}

.section-container {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}

.section-caption {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 660px;
  margin: 0 0 40px;
  line-height: 1.6;
}

.pillars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 28px;
}

.pillar-card {
  padding: 28px;
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease;
}

.pillar-card:hover {
  transform: translateY(-4px);
}

/* Clay Pillar */
.pillar-card--clay {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 
    14px 22px 36px rgba(109, 40, 217, 0.12),
    inset -4px -4px 10px rgba(109, 40, 217, 0.16),
    inset 4px 4px 10px #ffffff;
  border: 1px solid rgba(139, 92, 246, 0.12);
  color: #241442;
}

.pillar-card--clay .pillar-title {
  color: #241442;
}

.pillar-card--clay .pillar-description {
  color: #645e78;
}

/* Glass Pillar */
.pillar-card--glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 16px 36px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

/* Neo Pillar */
.pillar-card--neo {
  background: #e2e8f0;
  border-radius: 20px;
  box-shadow: 
    8px 8px 18px #bcc5d3,
    -8px -8px 18px #ffffff;
  border: none;
  color: #334155;
}

.pillar-card--neo .pillar-title {
  color: #1e293b;
}

.pillar-card--neo .pillar-description {
  color: #64748b;
}

.pillar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.pillar-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clay-specimen-icon {
  background: #f5f3ff;
  color: #8b5cf6;
  box-shadow: 
    3px 6px 12px rgba(109, 40, 217, 0.12),
    inset 2px 2px 4px #ffffff,
    inset -2px -2px 4px rgba(109, 40, 217, 0.15);
}

.glass-specimen-icon {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.4);
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.35);
}

.neo-specimen-icon {
  background: #e2e8f0;
  color: #4f46e5;
  box-shadow: 
    inset 3px 3px 6px #bcc5d3,
    inset -3px -3px 6px #ffffff;
}

.pillar-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: var(--radius-pill, 9999px);
}

.clay-badge {
  background: #f5f3ff;
  color: #8b5cf6;
  box-shadow: inset 1px 1px 2px #ffffff;
}

.glass-badge {
  background: rgba(56, 189, 248, 0.15);
  color: #0284c7;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.neo-badge {
  background: #e2e8f0;
  color: #4f46e5;
  box-shadow: 2px 2px 5px #bcc5d3, -2px -2px 5px #ffffff;
}

.pillar-title {
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0 0 10px;
  letter-spacing: -0.01em;
}

.pillar-description {
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0 0 20px;
  flex: 1;
}

/* Pillar Mini Specimens */
.pillar-mini-specimen {
  margin-top: auto;
  padding-top: 14px;
}

.clay-pill-demo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #8b5cf6;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 
    4px 8px 16px rgba(124, 58, 237, 0.35),
    inset -2px -2px 5px rgba(46, 16, 101, 0.4),
    inset 2px 2px 5px rgba(255, 255, 255, 0.6);
}

.clay-demo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
}

.glass-pill-demo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  color: #0369a1;
  padding: 8px 16px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.8rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.glass-demo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 6px #38bdf8;
}

.neo-pill-demo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #e2e8f0;
  color: #334155;
  padding: 8px 16px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 
    4px 4px 8px #bcc5d3,
    -4px -4px 8px #ffffff;
}

.neo-demo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4f46e5;
}

/* Install Section */
.install-section {
  padding: 64px 24px;
}

.code-flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.code-flow-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.code-step-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.code-box {
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius, 12px);
  box-shadow: var(--input-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  padding: 16px;
  position: relative;
  font-family: var(--font-mono, monospace);
  font-size: 0.85rem;
  color: var(--text);
  overflow-x: auto;
}

.code-box pre {
  margin: 0;
}

.btn-copy-code {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill, 9999px);
  color: var(--text-muted);
  padding: 4px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  border-top: 1px solid var(--border);
  padding: 56px 24px 64px;
}

.closing-inner {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.closing-title {
  font-size: 1.85rem;
  font-weight: 800;
  color: var(--text);
  margin: 0 0 8px;
}

.closing-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin: 0 0 24px;
}

.closing-buttons {
  display: flex;
  gap: 12px;
}

/* Responsive */
@media (max-width: 840px) {
  .landing-hero {
    grid-template-columns: 1fr;
    gap: 36px;
    padding-top: 36px;
  }
  .landing-title {
    font-size: 2.2rem;
  }
}
</style>
