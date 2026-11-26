<template>
  <div class="app mfs-flex mfs-flex-col">
    <!-- Navbar -->
    <header class="navbar mfs-surface mfs-border-none mfs-border-b">
      <div class="mfs-container mfs-flex mfs-items-center mfs-justify-between mfs-py-3 mfs-px-6">
        <!-- Brand -->
        <router-link to="/" class="navbar__brand mfs-flex mfs-items-center mfs-gap-3">
          <div class="brand-logo mfs-surface-subtle mfs-rounded-md mfs-shadow mfs-flex mfs-items-center mfs-justify-center">
            <img src="/logo.svg" alt="MFS Theme" class="brand-icon" />
          </div>
          <div>
            <span class="brand-title mfs-font-bold mfs-text">MFS Theme</span>
            <span class="brand-badge mfs-text-xs mfs-font-medium mfs-text-muted">Vue 3 UI Library</span>
          </div>
        </router-link>

        <!-- Desktop Navigation & Theme Switcher -->
        <div class="navbar__actions mfs-flex mfs-items-center mfs-gap-4">
          <template v-if="isLanding">
            <router-link to="/components" class="nav-simple-link mfs-pill mfs-font-semibold mfs-text mfs-transition">
              Components
            </router-link>
            <router-link to="/catalog" class="nav-cta-btn mfs-inline-flex mfs-items-center mfs-justify-center mfs-gap-1-5 mfs-pill mfs-bg-primary mfs-shadow mfs-font-semibold mfs-transition">
              <span>Next: Choose Theme</span>
              <ArrowRight :size="15" />
            </router-link>
          </template>

          <template v-else>
            <!-- View switcher tabs -->
            <nav class="nav-links mfs-surface-subtle mfs-pill mfs-shadow-inset mfs-flex" aria-label="Main Navigation">
              <router-link
                to="/catalog"
                class="nav-tab mfs-pill mfs-inline-flex mfs-items-center mfs-justify-center mfs-font-medium mfs-text-muted mfs-border-none mfs-bg-transparent mfs-cursor-pointer mfs-transition"
                :class="{ 'is-active': route.path === '/catalog' || route.path.startsWith('/themes') }"
              >
                Themes
              </router-link>
              <router-link
                to="/components"
                class="nav-tab mfs-pill mfs-inline-flex mfs-items-center mfs-justify-center mfs-font-medium mfs-text-muted mfs-border-none mfs-bg-transparent mfs-cursor-pointer mfs-transition"
                :class="{ 'is-active': route.path.startsWith('/components') }"
              >
                Components
              </router-link>
            </nav>

            <!-- Active Theme Selector Dropdown -->
            <div class="theme-selector-bar mfs-surface-subtle mfs-pill mfs-shadow-inset mfs-flex mfs-items-center">
              <span class="theme-selector-label mfs-font-bold mfs-text-muted mfs-select-none">Theme:</span>
              <Select
                class="navbar-theme-select"
                :model-value="currentTheme"
                :options="themeSelectOptions"
                :searchable="false"
                :clearable="false"
                @update:model-value="onThemeSelect"
              />
            </div>
          </template>

          <a
            :href="presetUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="npm-link mfs-inline-flex mfs-items-center mfs-gap-1 mfs-pill mfs-surface-subtle mfs-shadow mfs-font-medium mfs-transition"
          >
            <span>Presets</span>
            <ExternalLink :size="12" />
          </a>

          <a
            href="https://www.npmjs.com/package/@mfs-atomic/ui"
            target="_blank"
            rel="noopener noreferrer"
            class="npm-link mfs-inline-flex mfs-items-center mfs-pill mfs-surface-subtle mfs-shadow mfs-font-medium mfs-transition"
          >
            <span>npm v1.2.0</span>
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <Button
          variant="surface"
          size="sm"
          :pill="false"
          class="mobile-menu-btn"
          aria-label="Toggle navigation"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Menu v-if="!mobileMenuOpen" :size="20" />
          <X v-else :size="20" />
        </Button>
      </div>

      <!-- Mobile Dropdown Drawer -->
      <div v-if="mobileMenuOpen" class="mfs-surface mfs-border-none mfs-border-t mfs-py-4 mfs-px-5">
        <template v-if="isLanding">
          <div class="mobile-nav-row mfs-flex mfs-gap-2 mfs-mb-3">
            <router-link
              to="/components"
              class="nav-tab mobile-outline-tab mfs-pill mfs-inline-flex mfs-items-center mfs-justify-center mfs-font-medium mfs-cursor-pointer mfs-transition"
              @click="mobileMenuOpen = false"
            >
              Components
            </router-link>
            <router-link
              to="/catalog"
              class="nav-cta-btn mobile-cta-fill mfs-inline-flex mfs-items-center mfs-justify-center mfs-gap-1-5 mfs-pill mfs-bg-primary mfs-shadow mfs-font-semibold mfs-transition"
              @click="mobileMenuOpen = false"
            >
              <span>Next: Choose Theme</span>
              <ArrowRight :size="15" />
            </router-link>
          </div>
        </template>

        <template v-else>
          <div class="mobile-nav-row mfs-flex mfs-gap-2 mfs-mb-3">
            <router-link
              to="/catalog"
              class="nav-tab mfs-pill mfs-inline-flex mfs-items-center mfs-justify-center mfs-font-medium mfs-text-muted mfs-border-none mfs-bg-transparent mfs-cursor-pointer mfs-transition"
              :class="{ 'is-active': route.path === '/catalog' || route.path.startsWith('/themes') }"
              @click="mobileMenuOpen = false"
            >
              Themes
            </router-link>
            <router-link
              to="/components"
              class="nav-tab mfs-pill mfs-inline-flex mfs-items-center mfs-justify-center mfs-font-medium mfs-text-muted mfs-border-none mfs-bg-transparent mfs-cursor-pointer mfs-transition"
              :class="{ 'is-active': route.path.startsWith('/components') }"
              @click="mobileMenuOpen = false"
            >
              Components
            </router-link>
          </div>

          <p class="mfs-text-xs mfs-font-semibold mfs-text-muted mfs-mb-2">Active theme</p>
          <div class="mfs-grid mfs-grid-cols-2 mfs-gap-2">
            <Button
              v-for="item in themeOptions"
              :key="item.id"
              :variant="currentTheme === item.id ? 'primary' : 'surface'"
              size="sm"
              :pill="false"
              class="mobile-theme-chip"
              @click="handleSelectTheme(item.id); mobileMenuOpen = false"
            >
              <template #prepend>
                <component :is="getThemeIcon(item.id)" :size="15" class="theme-pill-icon" />
              </template>
              <span>{{ item.name }}</span>
            </Button>
          </div>
        </template>

        <div class="mfs-mt-3 mfs-pt-3 mfs-border-none mfs-border-t">
          <a
            :href="presetUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="npm-link mfs-inline-flex mfs-items-center mfs-justify-center mfs-gap-1-5 mfs-w-full mfs-pill mfs-surface-subtle mfs-shadow mfs-font-medium mfs-transition"
            @click="mobileMenuOpen = false"
          >
            <span>Presets</span>
            <ExternalLink :size="13" />
          </a>
        </div>
      </div>
    </header>

    <!-- Main Content Routed View -->
    <main class="mfs-w-full mfs-flex-1">
      <router-view v-slot="{ Component, route }">
        <PageTransition>
          <component :is="Component" :key="route.name === 'components' ? 'components' : route.path" />
        </PageTransition>
      </router-view>
    </main>

    <Toast />
    <ConfirmDialog />

    <!-- Footer -->
    <footer class="footer mfs-surface mfs-border-none mfs-border-t mfs-py-8 mfs-px-6 mfs-text-center">
      <div class="mfs-container mfs-text mfs-text-sm">
        <p>MFS Theme, adaptive multi-theme Vue 3 component library.</p>
        <p class="mfs-text-xs mfs-text-muted mfs-mt-1">
          Claymorphism, Glassmorphism, and Neumorphism depth models.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Menu,
  X,
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
  ArrowRight,
  ExternalLink,
  Droplets,
  Palette,
  Terminal,
  PenTool,
  Disc,
  Shapes,
  Gamepad2,
  Waves,
  Sunset,
  BookOpen
} from 'lucide-vue-next'
import { useTheme, Button, Select, Toast, ConfirmDialog, PageTransition, type ThemeType } from './lib'

const route = useRoute()
const router = useRouter()
const presetUrl = import.meta.env.VITE_PRESET_URL || 'https://preset-ui.mfstechnology.co.id'
const { currentTheme, themeOptions, setTheme } = useTheme()

const isLanding = computed(() => route.path === '/')
const mobileMenuOpen = ref(false)

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
  manga: BookOpen
}

const getThemeIcon = (id: ThemeType) => iconMap[id] ?? Layers

const handleSelectTheme = (themeId: ThemeType) => {
  setTheme(themeId)
  if (route.path.startsWith('/themes/')) {
    router.push(`/themes/${themeId}`)
  }
}

const themeSelectOptions = computed(() =>
  themeOptions.map((item) => ({ label: item.name, value: item.id }))
)

const onThemeSelect = (val: string | number | null) => {
  if (val) handleSelectTheme(val as ThemeType)
}
</script>

<style scoped>
/* Hallmark · theme: mfs-theme · App.vue */
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

.app {
  min-height: 100vh;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar__brand {
  text-decoration: none;
}

.brand-logo {
  width: 38px;
  height: 38px;
}

.brand-icon {
  display: block;
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.brand-title {
  display: block;
  font-size: 1.15rem;
  margin: 0;
  line-height: 1.1;
}

.brand-badge {
  display: block;
}

/* Nav links tabs */
.nav-links {
  padding: 3px;
  gap: 2px;
}

.nav-tab {
  padding: 6px 14px;
  font-size: 0.82rem;
  color: var(--text-muted);
  background: transparent;
  text-decoration: none;
}

.nav-tab:hover:not(.is-active) {
  color: var(--text);
}

.nav-tab.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  box-shadow: var(--clay-shadow);
}

.nav-simple-link {
  padding: 6px 12px;
  font-size: 0.84rem;
  text-decoration: none;
}

.nav-simple-link:hover {
  color: var(--primary);
}

.nav-cta-btn {
  padding: 7px 14px;
  font-size: 0.82rem;
  text-decoration: none;
}

.nav-cta-btn:hover {
  box-shadow: var(--clay-shadow-hover);
  opacity: 0.96;
}

.mobile-outline-tab {
  border: 1px solid var(--border);
  background: var(--surface-subtle);
  color: var(--text);
}

.mobile-cta-fill {
  flex: 1.5;
}

.theme-selector-bar {
  padding: 3px 4px 3px 12px;
  gap: 3px;
}

.theme-selector-label {
  font-size: 0.72rem;
  margin-right: 2px;
}

.navbar-theme-select {
  width: 158px;
}

.navbar-theme-select :deep(.select-trigger) {
  padding: 5px 10px;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: var(--radius-pill, 9999px);
}

.navbar-theme-select :deep(.select-dropdown) {
  z-index: 220;
  min-width: 185px;
  right: 0;
  left: auto;
}

.mobile-theme-chip {
  justify-content: flex-start;
  padding: 9px 11px;
  font-size: 0.8rem;
}

.theme-pill-icon {
  display: inline-block;
}

.npm-link {
  padding: 6px 12px;
  font-size: 0.78rem;
  text-decoration: none;
}

.npm-link:hover {
  border-color: var(--primary);
  color: var(--primary);
  box-shadow: var(--clay-shadow-hover);
}

.npm-link:active {
  box-shadow: var(--clay-shadow-active);
}

.mobile-menu-btn {
  display: none;
  padding: 6px;
}

.mobile-nav-row .nav-tab {
  flex: 1;
}

/* Footer */
.footer {
  margin-top: auto;
}

/* Responsiveness */
@media (max-width: 768px) {
  .navbar__actions {
    display: none;
  }
  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
