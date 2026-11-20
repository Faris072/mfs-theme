<template>
  <div class="app">
    <!-- Navbar -->
    <header class="navbar">
      <div class="navbar__container">
        <!-- Brand -->
        <router-link to="/" class="navbar__brand">
          <div class="brand-logo">
            <Palette :size="20" class="brand-icon" />
          </div>
          <div>
            <span class="brand-title">MFS Theme</span>
            <span class="brand-badge">Vue 3 UI Library</span>
          </div>
        </router-link>

        <!-- Desktop Navigation & Theme Switcher -->
        <div class="navbar__actions">
          <template v-if="isLanding">
            <router-link to="/components" class="nav-simple-link">
              Components
            </router-link>
            <router-link to="/catalog" class="nav-cta-btn">
              <span>Next: Choose Theme</span>
              <ArrowRight :size="15" />
            </router-link>
          </template>

          <template v-else>
            <!-- View switcher tabs -->
            <nav class="nav-links" aria-label="Main Navigation">
              <router-link
                to="/catalog"
                class="nav-tab"
                :class="{ 'is-active': route.path === '/catalog' || route.path.startsWith('/themes') }"
              >
                Themes
              </router-link>
              <router-link
                to="/components"
                class="nav-tab"
                :class="{ 'is-active': route.path.startsWith('/components') }"
              >
                Components
              </router-link>
            </nav>

            <!-- Active Theme Selector Dropdown -->
            <div class="theme-selector-bar">
              <label for="navbar-theme-select" class="theme-selector-label">Theme:</label>
              <select
                id="navbar-theme-select"
                class="theme-select"
                :value="currentTheme"
                aria-label="Select active theme"
                @change="onThemeSelect"
              >
                <option
                  v-for="item in themeOptions"
                  :key="item.id"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
          </template>

          <a
            href="https://www.npmjs.com/package/mfs-theme"
            target="_blank"
            class="npm-link"
          >
            <span>npm v0.9.0</span>
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="mobile-menu-btn"
          aria-label="Toggle navigation"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <Menu v-if="!mobileMenuOpen" :size="20" />
          <X v-else :size="20" />
        </button>
      </div>

      <!-- Mobile Dropdown Drawer -->
      <div v-if="mobileMenuOpen" class="mobile-drawer">
        <template v-if="isLanding">
          <div class="mobile-nav-row">
            <router-link
              to="/components"
              class="nav-tab mobile-outline-tab"
              @click="mobileMenuOpen = false"
            >
              Components
            </router-link>
            <router-link
              to="/catalog"
              class="nav-cta-btn mobile-cta-fill"
              @click="mobileMenuOpen = false"
            >
              <span>Next: Choose Theme</span>
              <ArrowRight :size="15" />
            </router-link>
          </div>
        </template>

        <template v-else>
          <div class="mobile-nav-row">
            <router-link
              to="/catalog"
              class="nav-tab"
              :class="{ 'is-active': route.path === '/catalog' || route.path.startsWith('/themes') }"
              @click="mobileMenuOpen = false"
            >
              Themes
            </router-link>
            <router-link
              to="/components"
              class="nav-tab"
              :class="{ 'is-active': route.path.startsWith('/components') }"
              @click="mobileMenuOpen = false"
            >
              Components
            </router-link>
          </div>

          <p class="drawer-label">Active theme</p>
          <div class="mobile-theme-grid">
            <button
              v-for="item in themeOptions"
              :key="item.id"
              type="button"
              class="mobile-theme-chip"
              :class="{ 'is-active': currentTheme === item.id }"
              @click="handleSelectTheme(item.id); mobileMenuOpen = false"
            >
              <component :is="getThemeIcon(item.id)" :size="15" class="theme-pill-icon" />
              <span>{{ item.name }}</span>
            </button>
          </div>
        </template>
      </div>
    </header>

    <!-- Main Content Routed View -->
    <main class="app-main-content">
      <router-view />
    </main>

    <Toast />
    <ConfirmDialog />

    <!-- Footer -->
    <footer class="footer">
      <div class="footer__container">
        <p>MFS Theme, adaptive multi-theme Vue 3 component library.</p>
        <p class="footer-sub">
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
  Palette,
  Menu,
  X,
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
  ArrowRight
} from 'lucide-vue-next'
import { useTheme, Toast, ConfirmDialog, type ThemeType } from './lib'

const route = useRoute()
const router = useRouter()
const { currentTheme, themeOptions, setTheme } = useTheme()

const isLanding = computed(() => route.path === '/')
const mobileMenuOpen = ref(false)

const iconMap: Record<ThemeType, any> = {
  clay: Layers,
  glass: Sparkles,
  neo: Circle,
  minimalism: Minus,
  brutalism: Square,
  bento: LayoutGrid,
  cyberpunk: Zap,
  retro: Monitor,
  swiss: Grid,
  skeuomorphism: Box
}

const getThemeIcon = (id: ThemeType) => iconMap[id] ?? Layers

const handleSelectTheme = (themeId: ThemeType) => {
  setTheme(themeId)
  if (route.path.startsWith('/themes/')) {
    router.push(`/themes/${themeId}`)
  }
}

const onThemeSelect = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value as ThemeType
  if (val) handleSelectTheme(val)
}
</script>

<style>
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
  display: flex;
  flex-direction: column;
}

.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--surface);
  border-bottom: 1px solid var(--border);
  backdrop-filter: var(--backdrop-blur, blur(12px));
}

.navbar__container {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.brand-logo {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius-md, 12px);
  color: var(--primary);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.brand-icon {
  display: block;
}

.brand-title {
  display: block;
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
  line-height: 1.1;
}

.brand-badge {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Nav links tabs */
.nav-links {
  display: flex;
  background: var(--surface-subtle);
  padding: 3px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--border);
  gap: 2px;
  box-shadow: var(--input-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.nav-tab {
  border: none;
  background: transparent;
  padding: 6px 14px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease, background-color 0.15s ease, box-shadow 0.2s ease;
}

.nav-tab.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  box-shadow: var(--clay-shadow);
}

.nav-simple-link {
  padding: 6px 12px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  transition: color 0.15s ease;
}

.nav-simple-link:hover {
  color: var(--primary);
}

.nav-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: var(--radius-pill, 9999px);
  background: var(--primary);
  color: var(--primary-text, #ffffff);
  font-size: 0.82rem;
  font-weight: 600;
  text-decoration: none;
  box-shadow: var(--clay-shadow);
  transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.15s ease;
}

.nav-cta-btn:hover {
  transform: translateY(-1px);
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
  display: flex;
  align-items: center;
  background-color: var(--surface-subtle);
  padding: 3px 4px 3px 12px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--border);
  gap: 3px;
  box-shadow: var(--input-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.theme-selector-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-right: 2px;
  user-select: none;
}

.theme-select {
  border: none;
  background: var(--surface);
  color: var(--primary);
  font-size: 0.82rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: var(--radius-pill, 9999px);
  cursor: pointer;
  box-shadow: var(--clay-shadow);
}

.mobile-theme-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.mobile-theme-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 11px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border);
  background: var(--surface-subtle);
  color: var(--text);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}

.mobile-theme-chip.is-active {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--surface);
}

.theme-pill-btn {
  border: none;
  background: transparent;
  padding: 5px 12px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.theme-pill-btn:hover {
  color: var(--text);
}

.theme-pill-btn.is-active {
  background-color: var(--surface);
  color: var(--primary);
  font-weight: 700;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.theme-pill-icon {
  display: inline-block;
}

.npm-link {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: var(--radius-pill, 9999px);
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 0.78rem;
  font-weight: 500;
  text-decoration: none;
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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
  background: var(--surface-subtle);
  border: 1px solid var(--border);
  color: var(--text);
  padding: 6px;
  border-radius: var(--radius-sm, 8px);
  cursor: pointer;
}

.mobile-drawer {
  padding: 16px 20px;
  background: var(--surface);
  border-top: 1px solid var(--border);
}

.mobile-nav-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.mobile-nav-row .nav-tab {
  flex: 1;
}

.drawer-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.mobile-theme-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-theme-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border);
  background: var(--surface-subtle);
  color: var(--text);
  cursor: pointer;
  text-align: left;
}

.mobile-theme-item.is-active {
  border-color: var(--primary);
}

.mobile-arrow {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--primary);
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 3px 8px;
  border-radius: var(--radius-sm, 6px);
  text-decoration: none;
}

.mobile-theme-item p {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

.app-main-content {
  width: 100%;
  flex: 1;
}

/* Footer */
.footer {
  margin-top: auto;
  border-top: 1px solid var(--border);
  background-color: var(--surface);
  padding: 32px 24px;
  text-align: center;
}

.footer__container {
  max-width: var(--container-max, 1200px);
  margin: 0 auto;
  color: var(--text);
  font-size: 0.9rem;
}

.footer-sub {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 4px;
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
