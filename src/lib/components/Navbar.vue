<template>
  <header class="navbar mfs-w-full mfs-surface mfs-shadow mfs-rounded" :class="{ 'navbar--sticky': sticky, 'mfs-border-none': !bordered }">
    <div class="navbar__inner mfs-flex mfs-items-center mfs-justify-between mfs-gap-4">
      <div class="navbar__brand mfs-flex mfs-items-center mfs-font-bold">
        <slot name="brand" />
      </div>

      <nav class="navbar__nav" aria-label="Main navigation">
        <slot name="links" :items="items" :navigate="handleNavigate">
          <ul class="navbar__list mfs-flex mfs-items-center">
            <li v-for="(item, idx) in items" :key="idx" class="navbar__item">
              <button
                v-if="!item.to && !item.href"
                type="button"
                class="navbar__link mfs-inline-flex mfs-items-center mfs-font-medium mfs-border-none mfs-pill"
                :class="{ 'navbar__link--active': item.active }"
                :aria-current="item.active ? 'page' : undefined"
                @click="handleNavigate(item, $event)"
              >
                {{ item.label }}
              </button>

              <component
                :is="item.to ? 'router-link' : 'a'"
                v-else
                :to="item.to"
                :href="sanitizeHref(item.href)"
                class="navbar__link mfs-inline-flex mfs-items-center mfs-font-medium mfs-border-none mfs-pill"
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

      <div class="navbar__actions mfs-flex mfs-items-center">
        <slot name="actions" />
        <button
          type="button"
          class="navbar__toggle mfs-inline-flex mfs-items-center mfs-justify-center mfs-surface-subtle mfs-shadow mfs-rounded-md mfs-interactive"
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
          <ul class="navbar__mobile-list mfs-flex mfs-flex-col">
            <li v-for="(item, idx) in items" :key="idx">
              <button
                v-if="!item.to && !item.href"
                type="button"
                class="navbar__mobile-link mfs-inline-flex mfs-items-center mfs-font-medium mfs-border-none mfs-w-full mfs-rounded-md"
                :class="{ 'navbar__mobile-link--active': item.active }"
                :aria-current="item.active ? 'page' : undefined"
                @click="handleMobileNavigate(item, $event)"
              >
                {{ item.label }}
              </button>

              <component
                :is="item.to ? 'router-link' : 'a'"
                v-else
                :to="item.to"
                :href="sanitizeHref(item.href)"
                class="navbar__mobile-link mfs-inline-flex mfs-items-center mfs-font-medium mfs-border-none mfs-w-full mfs-rounded-md"
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
import { sanitizeHref } from '../utils/sanitize'

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
  z-index: 100;
  transition: background-color 0.25s ease, box-shadow 0.25s ease;
}

.navbar--sticky {
  position: sticky;
  top: 12px;
}

.navbar__inner {
  padding: 10px 20px;
  min-height: 58px;
}

.navbar__brand {
  gap: 10px;
  font-size: 1.05rem;
  flex-shrink: 0;
}

.navbar__nav {
  display: none;
  flex: 1;
  justify-content: center;
}

.navbar__list {
  gap: 6px;
  list-style: none;
}

.navbar__link,
.navbar__mobile-link {
  gap: 6px;
  padding: 8px 14px;
  font-family: inherit;
  font-size: 0.92rem;
  color: var(--text-muted);
  background: transparent;
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
  gap: 10px;
  flex-shrink: 0;
}

.navbar__toggle {
  width: 40px;
  height: 40px;
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
  gap: 6px;
  list-style: none;
}

.navbar__mobile-link {
  min-height: 42px;
  justify-content: flex-start;
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
