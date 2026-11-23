<template>
  <nav
    ref="rootRef"
    class="mega-menu mfs-surface mfs-rounded mfs-blur mfs-relative mfs-w-full"
    :class="`mega-menu--${orientation}`"
    aria-label="Mega menu"
  >
    <div class="mega-menu__bar mfs-flex mfs-flex-col mfs-gap-2">
      <button
        type="button"
        class="mega-menu__mobile-btn mfs-surface-subtle mfs-rounded-md mfs-interactive mfs-text mfs-inline-flex mfs-items-center mfs-gap-2 mfs-py-2 mfs-px-3 mfs-border-none mfs-bg-transparent mfs-font-semibold"
        :aria-expanded="mobileOpen"
        aria-label="Toggle mega menu"
        @click="mobileOpen = !mobileOpen"
      >
        <svg v-if="!mobileOpen" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <span>Menu</span>
      </button>

      <ul class="mega-menu__list mfs-flex-col mfs-gap-1-5" :class="{ 'mega-menu__list--open': mobileOpen }" role="menubar">
        <li
          v-for="(item, idx) in items"
          :key="idx"
          class="mega-menu__root mfs-relative"
          role="none"
          @mouseenter="onHover(idx)"
          @mouseleave="onLeave"
        >
          <component
            :is="item.columns?.length ? 'button' : item.to ? 'router-link' : item.href ? 'a' : 'button'"
            :to="!item.columns?.length ? item.to : undefined"
            :href="!item.columns?.length ? item.href : undefined"
            :type="item.columns?.length || (!item.to && !item.href) ? 'button' : undefined"
            role="menuitem"
            class="mega-menu__trigger mfs-rounded-sm mfs-text mfs-inline-flex mfs-items-center mfs-gap-2 mfs-border-none mfs-bg-transparent mfs-font-semibold mfs-cursor-pointer"
            :class="{
              'mega-menu__trigger--active': activeIndex === idx,
              'mega-menu__trigger--disabled mfs-disabled': item.disabled
            }"
            :aria-haspopup="item.columns?.length ? 'true' : undefined"
            :aria-expanded="item.columns?.length ? activeIndex === idx : undefined"
            :disabled="item.disabled"
            @click="onTriggerClick(item, idx)"
          >
            <span v-if="item.icon" aria-hidden="true">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
            <svg
              v-if="item.columns?.length"
              class="mega-menu__chevron"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </component>

          <Transition name="mega-fade">
            <div
              v-if="item.columns?.length && activeIndex === idx"
              class="mega-menu__panel mfs-card mfs-overlay mfs-blur mfs-p-4"
              role="menu"
            >
              <div class="mega-menu__columns">
                <div v-for="(col, cIdx) in item.columns" :key="cIdx" class="mega-menu__col">
                  <div v-if="col.title" class="mega-menu__col-title mfs-text-muted mfs-font-bold mfs-mb-2 mfs-px-2">{{ col.title }}</div>
                  <ul class="mega-menu__col-list mfs-flex mfs-flex-col mfs-gap-1">
                    <li v-for="(link, lIdx) in col.items" :key="lIdx" role="none">
                      <component
                        :is="link.to ? 'router-link' : link.href ? 'a' : 'button'"
                        :to="link.to"
                        :href="link.href"
                        :type="!link.to && !link.href ? 'button' : undefined"
                        role="menuitem"
                        class="mega-menu__link mfs-rounded-sm mfs-text mfs-w-full mfs-flex mfs-flex-col mfs-p-2 mfs-border-none mfs-bg-transparent mfs-text-left mfs-cursor-pointer"
                        @click="onLinkClick(link)"
                      >
                        <span class="mega-menu__link-label mfs-font-semibold">{{ link.label }}</span>
                        <span v-if="link.description" class="mega-menu__link-desc mfs-text-muted">
                          {{ link.description }}
                        </span>
                      </component>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </Transition>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

export interface MegaMenuLink {
  label: string
  description?: string
  to?: string | Record<string, unknown>
  href?: string
  command?: () => void
}

export interface MegaMenuColumn {
  title?: string
  items: MegaMenuLink[]
}

export interface MegaMenuItem {
  label: string
  icon?: string
  to?: string | Record<string, unknown>
  href?: string
  disabled?: boolean
  command?: () => void
  columns?: MegaMenuColumn[]
}

withDefaults(
  defineProps<{
    items: MegaMenuItem[]
    orientation?: 'horizontal' | 'vertical'
  }>(),
  {
    orientation: 'horizontal'
  }
)

const emit = defineEmits<{
  (e: 'select', item: MegaMenuItem | MegaMenuLink): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const activeIndex = ref<number | null>(null)
const mobileOpen = ref(false)

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768

const onHover = (idx: number) => {
  if (!isMobile()) activeIndex.value = idx
}

const onLeave = () => {
  if (!isMobile()) activeIndex.value = null
}

const onTriggerClick = (item: MegaMenuItem, idx: number) => {
  if (item.disabled) return
  if (item.columns?.length) {
    activeIndex.value = activeIndex.value === idx ? null : idx
    return
  }
  item.command?.()
  emit('select', item)
  activeIndex.value = null
  mobileOpen.value = false
}

const onLinkClick = (link: MegaMenuLink) => {
  link.command?.()
  emit('select', link)
  activeIndex.value = null
  mobileOpen.value = false
}

const onPointerDown = (e: PointerEvent) => {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    activeIndex.value = null
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    activeIndex.value = null
    mobileOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.mega-menu {
  padding: 8px 14px;
  z-index: 90;
}

.mega-menu__mobile-btn {
  align-self: flex-start;
  font-family: inherit;
  font-size: 0.9rem;
}

.mega-menu__list {
  display: none;
  list-style: none;
}

.mega-menu__list--open {
  display: flex;
}

.mega-menu__trigger {
  padding: 8px 14px;
  min-height: 38px;
  font-family: inherit;
  font-size: 0.92rem;
  text-decoration: none;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.mega-menu__trigger:hover:not(.mega-menu__trigger--disabled),
.mega-menu__trigger--active {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.mega-menu__trigger--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.mega-menu__panel {
  margin-top: 6px;
  z-index: 200;
}

.mega-menu__columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 18px;
}

.mega-menu__col-title {
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mega-menu__col-list {
  list-style: none;
}

.mega-menu__link {
  gap: 2px;
  font-family: inherit;
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.mega-menu__link:hover {
  background-color: var(--surface-subtle);
}

.mega-menu__link-label {
  font-size: 0.9rem;
}

.mega-menu__link-desc {
  font-size: 0.78rem;
}

.mega-fade-enter-active,
.mega-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.mega-fade-enter-from,
.mega-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (min-width: 768px) {
  .mega-menu__mobile-btn {
    display: none;
  }

  .mega-menu--horizontal .mega-menu__list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .mega-menu--vertical .mega-menu__list {
    display: flex;
    flex-direction: column;
  }

  .mega-menu--horizontal .mega-menu__panel {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 480px;
    max-width: min(760px, 90vw);
  }
}

</style>
