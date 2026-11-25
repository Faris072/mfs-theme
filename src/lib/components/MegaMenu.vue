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
          :ref="(el) => setRootItemRef(idx, el as HTMLElement | null)"
          class="mega-menu__root mfs-relative"
          role="none"
          @mouseenter="onHover(idx)"
          @mouseleave="onLeave"
        >
          <button
            v-if="item.columns?.length || (!item.to && !item.href)"
            type="button"
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
          </button>

          <component
            :is="item.to ? 'router-link' : 'a'"
            v-else
            :to="item.to"
            :href="sanitizeHref(item.href)"
            role="menuitem"
            class="mega-menu__trigger mfs-rounded-sm mfs-text mfs-inline-flex mfs-items-center mfs-gap-2 mfs-border-none mfs-bg-transparent mfs-font-semibold mfs-cursor-pointer"
            :class="{
              'mega-menu__trigger--active': activeIndex === idx,
              'mega-menu__trigger--disabled mfs-disabled': item.disabled
            }"
            :disabled="item.disabled"
            @click="onTriggerClick(item, idx)"
          >
            <span v-if="item.icon" aria-hidden="true">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </component>
        </li>
      </ul>
    </div>

    <Teleport to="body">
      <Transition name="mega-fade">
        <div
          v-if="activeItem?.columns?.length"
          ref="panelRef"
          class="mega-menu__panel mfs-card mfs-overlay mfs-blur mfs-p-4"
          :style="panelStyle"
          role="menu"
          @mouseenter="cancelClose"
          @mouseleave="onLeave"
        >
          <div class="mega-menu__columns">
            <div v-for="(col, cIdx) in activeItem.columns" :key="cIdx" class="mega-menu__col">
              <div v-if="col.title" class="mega-menu__col-title mfs-text-muted mfs-font-bold mfs-mb-2 mfs-px-2">{{ col.title }}</div>
              <ul class="mega-menu__col-list mfs-flex mfs-flex-col mfs-gap-1">
                <li v-for="(link, lIdx) in col.items" :key="lIdx" role="none">
                  <button
                    v-if="!link.to && !link.href"
                    type="button"
                    role="menuitem"
                    class="mega-menu__link mfs-rounded-sm mfs-text mfs-w-full mfs-flex mfs-flex-col mfs-p-2 mfs-border-none mfs-bg-transparent mfs-text-left mfs-cursor-pointer"
                    @click="onLinkClick(link)"
                  >
                    <span class="mega-menu__link-label mfs-font-semibold">{{ link.label }}</span>
                    <span v-if="link.description" class="mega-menu__link-desc mfs-text-muted">
                      {{ link.description }}
                    </span>
                  </button>

                  <component
                    :is="link.to ? 'router-link' : 'a'"
                    v-else
                    :to="link.to"
                    :href="sanitizeHref(link.href)"
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
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue'
import { sanitizeHref } from '../utils/sanitize'

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

const props = withDefaults(
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
const panelRef = ref<HTMLElement | null>(null)
const rootItemRefs = ref<Record<number, HTMLElement | null>>({})
const activeIndex = ref<number | null>(null)
const mobileOpen = ref(false)
const panelTop = ref(0)
const panelLeft = ref(0)
let closeTimer: ReturnType<typeof setTimeout> | null = null

const setRootItemRef = (idx: number, el: HTMLElement | null) => {
  rootItemRefs.value[idx] = el
}

const activeItem = computed(() =>
  activeIndex.value !== null ? props.items[activeIndex.value] ?? null : null
)

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768

const cancelClose = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

const updatePanelPosition = () => {
  if (typeof window === 'undefined' || activeIndex.value === null) return
  const anchorEl = rootItemRefs.value[activeIndex.value] ?? rootRef.value
  if (!anchorEl) return

  const anchorRect = anchorEl.getBoundingClientRect()
  const panelRect = panelRef.value?.getBoundingClientRect()
  const panelWidth = panelRect?.width || Math.min(480, window.innerWidth - 16)
  const panelHeight = panelRect?.height || 0
  const pad = 8
  const gap = 6

  let nextLeft = anchorRect.left
  let nextTop = anchorRect.bottom + gap

  if (props.orientation === 'vertical' && !isMobile()) {
    nextLeft = anchorRect.right + gap
    nextTop = anchorRect.top
    if (nextLeft + panelWidth > window.innerWidth - pad) {
      nextLeft = anchorRect.left - panelWidth - gap
    }
  }

  const maxLeft = Math.max(pad, window.innerWidth - panelWidth - pad)
  nextLeft = Math.min(Math.max(pad, nextLeft), maxLeft)

  if (panelHeight > 0 && nextTop + panelHeight > window.innerHeight - pad) {
    if (props.orientation === 'horizontal' || isMobile()) {
      const spaceAbove = anchorRect.top - pad - gap
      const spaceBelow = window.innerHeight - anchorRect.bottom - pad - gap
      if (spaceAbove > spaceBelow) {
        nextTop = Math.max(pad, anchorRect.top - panelHeight - gap)
      } else {
        nextTop = Math.max(pad, window.innerHeight - panelHeight - pad)
      }
    } else {
      nextTop = Math.max(pad, window.innerHeight - panelHeight - pad)
    }
  }

  panelTop.value = nextTop
  panelLeft.value = nextLeft
}

const panelStyle = computed<CSSProperties>(() => ({
  position: 'fixed',
  top: `${panelTop.value}px`,
  left: `${panelLeft.value}px`,
  zIndex: 9999
}))

const onHover = (idx: number) => {
  if (!isMobile()) {
    cancelClose()
    activeIndex.value = idx
  }
}

const onLeave = () => {
  if (!isMobile()) {
    cancelClose()
    closeTimer = setTimeout(() => {
      activeIndex.value = null
    }, 120)
  }
}

const onTriggerClick = (item: MegaMenuItem, idx: number) => {
  if (item.disabled) return
  if (item.columns?.length) {
    cancelClose()
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
  const target = e.target as Node | null
  if (!target) return
  if (rootRef.value?.contains(target) || panelRef.value?.contains(target)) {
    return
  }
  activeIndex.value = null
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    activeIndex.value = null
    mobileOpen.value = false
  }
}

const onViewportChange = () => {
  if (activeIndex.value !== null) {
    updatePanelPosition()
  }
}

watch(activeIndex, (idx) => {
  if (idx !== null) {
    updatePanelPosition()
    nextTick(updatePanelPosition)
  }
})

watch(panelRef, (el) => {
  if (el && activeIndex.value !== null) {
    updatePanelPosition()
  }
})

onMounted(() => {
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('scroll', onViewportChange, true)
  window.addEventListener('resize', onViewportChange)
})

onUnmounted(() => {
  cancelClose()
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
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
  min-width: min(480px, calc(100vw - 16px));
  max-width: min(760px, calc(100vw - 16px));
  max-height: calc(100vh - 16px);
  overflow-y: auto;
}

.mega-menu__columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 18px;
}

.mega-menu__col-title {
  font-size: 0.76rem;
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
}

</style>
