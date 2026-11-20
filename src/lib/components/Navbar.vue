<template>
  <header class="navbar mfs-surface mfs-shadow mfs-rounded" :class="{ 'navbar--sticky': sticky, 'navbar--bordered': bordered }">
    <div class="navbar__inner">
      <div class="navbar__brand">
        <slot name="brand" />
      </div>

      <nav class="navbar__nav" aria-label="Main navigation">
        <slot name="links" :items="items" :navigate="handleNavigate">
          <ul class="navbar__list">
            <li v-for="(item, idx) in items" :key="idx" class="navbar__item">
              <component
                :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
                :to="item.to"
                :href="item.href"
                :type="!item.to && !item.href ? 'button' : undefined"
                class="navbar__link mfs-pill"
                :class="{ 'navbar__link--active': item.active }"
                :aria-current="item.active ? 'page' : undefined"
                @click="handleNavigate(item, $event)"
              >
                {{ item.label }}
              </component>
            </li>
          </ul>
        </slot>
      </nav>

      <div class="navbar__actions">
        <slot name="actions" />
        <button
          type="button"
          class="navbar__toggle mfs-surface-subtle mfs-shadow mfs-rounded-md mfs-interactive"
          :aria-expanded="mobileOpen"
          aria-controls="navbar-mobile-drawer"
          aria-label="Toggle navigation menu"
          @click="mobileOpen = !mobileOpen"
        >
          <svg
            v-if="!mobileOpen"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <svg
            v-else
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <Transition name="navbar-drawer">
      <div
        v-if="mobileOpen"
        id="navbar-mobile-drawer"
        class="navbar__drawer"
        role="region"
        aria-label="Mobile navigation"
      >
        <slot name="links" :items="items" :navigate="handleMobileNavigate">
          <ul class="navbar__mobile-list">
            <li v-for="(item, idx) in items" :key="idx">
              <component
                :is="item.to ? 'router-link' : item.href ? 'a' : 'button'"
                :to="item.to"
                :href="item.href"
                :type="!item.to && !item.href ? 'button' : undefined"
                class="navbar__mobile-link mfs-rounded-md"
                :class="{ 'navbar__mobile-link--active': item.active }"
                :aria-current="item.active ? 'page' : undefined"
                @click="handleMobileNavigate(item, $event)"
              >
                {{ item.label }}
              </component>
            </li>
          </ul>
        </slot>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

export interface NavItem {
  label: string
  to?: string | Record<string, unknown>
  href?: string
  active?: boolean
}

withDefaults(
  defineProps<{
    items?: NavItem[]
    sticky?: boolean
    bordered?: boolean
  }>(),
  {
    items: () => [],
    sticky: true,
    bordered: true
  }
)

const emit = defineEmits<{
  (e: 'navigate', item: NavItem, event: MouseEvent): void
}>()

const mobileOpen = ref(false)

const handleNavigate = (item: NavItem, event: MouseEvent) => {
  emit('navigate', item, event)
}

const handleMobileNavigate = (item: NavItem, event: MouseEvent) => {
  mobileOpen.value = false
  emit('navigate', item, event)
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && mobileOpen.value) {
    mobileOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.navbar {
  width: 100%;
  background-color: var(--surface);
  color: var(--text);
  border-radius: var(--radius, 18px);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  z-index: 100;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.navbar--sticky {
  position: sticky;
  top: 12px;
}

.navbar--bordered {
  border: 1px solid var(--border, transparent);
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 10px 20px;
  min-height: 58px;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.05rem;
  flex-shrink: 0;
}

.navbar__nav {
  display: none;
  flex: 1;
  justify-content: center;
}

.navbar__list {
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
}

.navbar__link,
.navbar__mobile-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: var(--radius-pill, 9999px);
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.navbar__link:hover,
.navbar__mobile-link:hover {
  color: var(--text);
  background-color: var(--surface-subtle);
}

.navbar__link--active,
.navbar__mobile-link--active {
  color: var(--primary-text, #ffffff);
  background-color: var(--primary);
  box-shadow: var(--clay-shadow-active);
}

.navbar__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.navbar__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border, transparent);
  background-color: var(--surface-subtle);
  color: var(--text);
  box-shadow: var(--clay-shadow);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.navbar__toggle:active {
  transform: scale(0.95);
  box-shadow: var(--clay-shadow-active);
}

.navbar__drawer {
  padding: 8px 16px 16px;
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.06));
}

.navbar__mobile-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  list-style: none;
}

.navbar__mobile-link {
  width: 100%;
  min-height: 42px;
  justify-content: flex-start;
  border-radius: var(--radius-md, 12px);
}

.navbar-drawer-enter-active,
.navbar-drawer-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.navbar-drawer-enter-from,
.navbar-drawer-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (min-width: 768px) {
  .navbar__nav {
    display: flex;
  }

  .navbar__toggle,
  .navbar__drawer {
    display: none;
  }
}

[data-theme="glass"] .navbar {
  background-color: rgba(15, 23, 42, 0.65);
}

[data-theme="neo"] .navbar__link--active,
[data-theme="neo"] .navbar__mobile-link--active {
  box-shadow: var(--clay-shadow);
}
</style>
