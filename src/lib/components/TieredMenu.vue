<template>
  <nav ref="rootRef" class="tiered-menu mfs-surface mfs-rounded-md mfs-blur" aria-label="Tiered menu">
    <ul class="tiered-menu__list" role="menubar">
      <template v-for="(item, idx) in items" :key="idx">
        <li v-if="item.separator" class="tiered-menu__separator mfs-divider" role="separator" />
        <li
          v-else
          :ref="(el) => setLevel1NodeRef(idx, el as HTMLElement | null)"
          class="tiered-menu__node"
          role="none"
          @mouseenter="onEnterLevel1(idx)"
          @mouseleave="onLeaveLevel1"
        >
          <button
            v-if="item.items?.length || (!item.to && !item.href)"
            type="button"
            role="menuitem"
            class="tiered-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
            :class="{
              'tiered-menu__item--active': openLevel1 === idx,
              'tiered-menu__item--disabled mfs-disabled': item.disabled
            }"
            :aria-haspopup="item.items?.length ? 'true' : undefined"
            :aria-expanded="item.items?.length ? openLevel1 === idx : undefined"
            :disabled="item.disabled"
            @click="onClickItem(item, 1, idx)"
          >
            <span v-if="item.icon" class="tiered-menu__icon" aria-hidden="true">{{ item.icon }}</span>
            <span class="tiered-menu__label">{{ item.label }}</span>
            <svg
              v-if="item.items?.length"
              class="tiered-menu__chevron"
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
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <component
            :is="item.to ? 'router-link' : 'a'"
            v-else
            :to="item.to"
            :href="sanitizeHref(item.href)"
            role="menuitem"
            class="tiered-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
            :class="{
              'tiered-menu__item--active': openLevel1 === idx,
              'tiered-menu__item--disabled mfs-disabled': item.disabled
            }"
            :disabled="item.disabled"
            @click="onClickItem(item, 1, idx)"
          >
            <span v-if="item.icon" class="tiered-menu__icon" aria-hidden="true">{{ item.icon }}</span>
            <span class="tiered-menu__label">{{ item.label }}</span>
          </component>
        </li>
      </template>
    </ul>

    <Teleport to="body">
      <ul
        v-if="activeLevel1Item?.items?.length"
        ref="submenu1Ref"
        class="tiered-menu__submenu mfs-surface mfs-overlay mfs-shadow-card mfs-rounded-md mfs-blur"
        :style="submenu1Style"
        role="menu"
        @mouseenter="onEnterSubmenu1"
        @mouseleave="onLeaveSubmenu1"
      >
        <template v-for="(sub, sIdx) in activeLevel1Item.items" :key="sIdx">
          <li v-if="sub.separator" class="tiered-menu__separator mfs-divider" role="separator" />
          <li
            v-else
            :ref="(el) => setLevel2NodeRef(sIdx, el as HTMLElement | null)"
            class="tiered-menu__node"
            role="none"
            @mouseenter="onEnterLevel2(sIdx)"
            @mouseleave="onLeaveLevel2"
          >
            <button
              v-if="sub.items?.length || (!sub.to && !sub.href)"
              type="button"
              role="menuitem"
              class="tiered-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
              :class="{
                'tiered-menu__item--active': openLevel2 === sIdx,
                'tiered-menu__item--disabled mfs-disabled': sub.disabled
              }"
              :aria-haspopup="sub.items?.length ? 'true' : undefined"
              :aria-expanded="sub.items?.length ? openLevel2 === sIdx : undefined"
              :disabled="sub.disabled"
              @click="onClickItem(sub, 2, sIdx)"
            >
              <span v-if="sub.icon" class="tiered-menu__icon" aria-hidden="true">{{ sub.icon }}</span>
              <span class="tiered-menu__label">{{ sub.label }}</span>
              <svg
                v-if="sub.items?.length"
                class="tiered-menu__chevron"
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
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            <component
              :is="sub.to ? 'router-link' : 'a'"
              v-else
              :to="sub.to"
              :href="sanitizeHref(sub.href)"
              role="menuitem"
              class="tiered-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
              :class="{
                'tiered-menu__item--active': openLevel2 === sIdx,
                'tiered-menu__item--disabled mfs-disabled': sub.disabled
              }"
              :disabled="sub.disabled"
              @click="onClickItem(sub, 2, sIdx)"
            >
              <span v-if="sub.icon" class="tiered-menu__icon" aria-hidden="true">{{ sub.icon }}</span>
              <span class="tiered-menu__label">{{ sub.label }}</span>
            </component>
          </li>
        </template>
      </ul>
    </Teleport>

    <Teleport to="body">
      <ul
        v-if="activeLevel2Item?.items?.length"
        ref="submenu2Ref"
        class="tiered-menu__submenu mfs-surface mfs-overlay mfs-shadow-card mfs-rounded-md mfs-blur"
        :style="submenu2Style"
        role="menu"
        @mouseenter="onEnterSubmenu2"
        @mouseleave="onLeaveSubmenu2"
      >
        <template v-for="(leaf, lIdx) in activeLevel2Item.items" :key="lIdx">
          <li v-if="leaf.separator" class="tiered-menu__separator mfs-divider" role="separator" />
          <li v-else role="none">
            <button
              v-if="!leaf.to && !leaf.href"
              type="button"
              role="menuitem"
              class="tiered-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
              :class="{ 'tiered-menu__item--disabled mfs-disabled': leaf.disabled }"
              :disabled="leaf.disabled"
              @click="onClickItem(leaf, 3, lIdx)"
            >
              <span v-if="leaf.icon" class="tiered-menu__icon" aria-hidden="true">{{ leaf.icon }}</span>
              <span class="tiered-menu__label">{{ leaf.label }}</span>
            </button>

            <component
              :is="leaf.to ? 'router-link' : 'a'"
              v-else
              :to="leaf.to"
              :href="sanitizeHref(leaf.href)"
              role="menuitem"
              class="tiered-menu__item mfs-rounded-sm mfs-text mfs-focus-ring"
              :class="{ 'tiered-menu__item--disabled mfs-disabled': leaf.disabled }"
              :disabled="leaf.disabled"
              @click="onClickItem(leaf, 3, lIdx)"
            >
              <span v-if="leaf.icon" class="tiered-menu__icon" aria-hidden="true">{{ leaf.icon }}</span>
              <span class="tiered-menu__label">{{ leaf.label }}</span>
            </component>
          </li>
        </template>
      </ul>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue'
import { sanitizeHref } from '../utils/sanitize'

export interface TieredMenuItem {
  label?: string
  icon?: string
  to?: string | Record<string, unknown>
  href?: string
  disabled?: boolean
  separator?: boolean
  command?: () => void
  items?: TieredMenuItem[]
}

const props = defineProps<{
  items: TieredMenuItem[]
}>()

const emit = defineEmits<{
  (e: 'select', item: TieredMenuItem): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const submenu1Ref = ref<HTMLElement | null>(null)
const submenu2Ref = ref<HTMLElement | null>(null)
const level1NodeRefs = ref<Record<number, HTMLElement | null>>({})
const level2NodeRefs = ref<Record<number, HTMLElement | null>>({})

const openLevel1 = ref<number | null>(null)
const openLevel2 = ref<number | null>(null)
const submenu1Pos = ref({ top: 0, left: 0 })
const submenu2Pos = ref({ top: 0, left: 0 })

let closeTimer: ReturnType<typeof setTimeout> | null = null
let closeLevel2Timer: ReturnType<typeof setTimeout> | null = null

const setLevel1NodeRef = (idx: number, el: HTMLElement | null) => {
  level1NodeRefs.value[idx] = el
}

const setLevel2NodeRef = (idx: number, el: HTMLElement | null) => {
  level2NodeRefs.value[idx] = el
}

const activeLevel1Item = computed(() =>
  openLevel1.value !== null ? props.items[openLevel1.value] ?? null : null
)

const activeLevel2Item = computed(() => {
  if (openLevel2.value === null || !activeLevel1Item.value?.items) return null
  return activeLevel1Item.value.items[openLevel2.value] ?? null
})

const computeSubmenuPos = (anchorEl: HTMLElement | null | undefined, menuEl: HTMLElement | null) => {
  if (typeof window === 'undefined' || !anchorEl) return { top: 0, left: 0 }
  const rect = anchorEl.getBoundingClientRect()
  const menuRect = menuEl?.getBoundingClientRect()
  const menuW = menuRect?.width || 200
  const menuH = menuRect?.height || 0
  const pad = 8
  const gap = 6

  let left = rect.right + gap
  if (left + menuW > window.innerWidth - pad) {
    left = rect.left - menuW - gap
  }
  left = Math.min(Math.max(pad, left), Math.max(pad, window.innerWidth - menuW - pad))

  let top = rect.top
  if (menuH > 0 && top + menuH > window.innerHeight - pad) {
    top = Math.max(pad, window.innerHeight - menuH - pad)
  }

  return { top, left }
}

const updateSubmenu1Pos = () => {
  if (openLevel1.value === null) return
  submenu1Pos.value = computeSubmenuPos(level1NodeRefs.value[openLevel1.value], submenu1Ref.value)
}

const updateSubmenu2Pos = () => {
  if (openLevel2.value === null) return
  submenu2Pos.value = computeSubmenuPos(level2NodeRefs.value[openLevel2.value], submenu2Ref.value)
}

const submenu1Style = computed<CSSProperties>(() => ({
  position: 'fixed',
  top: `${submenu1Pos.value.top}px`,
  left: `${submenu1Pos.value.left}px`,
  zIndex: 9999
}))

const submenu2Style = computed<CSSProperties>(() => ({
  position: 'fixed',
  top: `${submenu2Pos.value.top}px`,
  left: `${submenu2Pos.value.left}px`,
  zIndex: 9999
}))

const clearCloseTimers = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  if (closeLevel2Timer) {
    clearTimeout(closeLevel2Timer)
    closeLevel2Timer = null
  }
}

const scheduleCloseAll = () => {
  if (closeTimer) clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    openLevel1.value = null
    openLevel2.value = null
  }, 120)
}

const scheduleCloseLevel2 = () => {
  if (closeLevel2Timer) clearTimeout(closeLevel2Timer)
  closeLevel2Timer = setTimeout(() => {
    openLevel2.value = null
  }, 120)
}

const onEnterLevel1 = (idx: number) => {
  clearCloseTimers()
  if (openLevel1.value !== idx) {
    openLevel2.value = null
  }
  openLevel1.value = idx
}

const onLeaveLevel1 = () => {
  scheduleCloseAll()
}

const onEnterSubmenu1 = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

const onLeaveSubmenu1 = () => {
  scheduleCloseAll()
}

const onEnterLevel2 = (sIdx: number) => {
  clearCloseTimers()
  openLevel2.value = sIdx
}

const onLeaveLevel2 = () => {
  scheduleCloseLevel2()
}

const onEnterSubmenu2 = () => {
  clearCloseTimers()
}

const onLeaveSubmenu2 = () => {
  scheduleCloseLevel2()
  scheduleCloseAll()
}

const onClickItem = (item: TieredMenuItem, level: number, idx: number) => {
  if (item.disabled) return
  if (item.items?.length) {
    clearCloseTimers()
    if (level === 1) {
      openLevel1.value = openLevel1.value === idx ? null : idx
      openLevel2.value = null
    } else if (level === 2) {
      openLevel2.value = openLevel2.value === idx ? null : idx
    }
    return
  }
  item.command?.()
  emit('select', item)
  openLevel1.value = null
  openLevel2.value = null
}

const onPointerDown = (e: PointerEvent) => {
  const target = e.target as Node | null
  if (!target) return
  if (
    rootRef.value?.contains(target) ||
    submenu1Ref.value?.contains(target) ||
    submenu2Ref.value?.contains(target)
  ) {
    return
  }
  openLevel1.value = null
  openLevel2.value = null
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    openLevel1.value = null
    openLevel2.value = null
  }
}

const onViewportChange = () => {
  if (openLevel1.value !== null) updateSubmenu1Pos()
  if (openLevel2.value !== null) updateSubmenu2Pos()
}

watch(openLevel1, (idx) => {
  if (idx !== null) {
    updateSubmenu1Pos()
    nextTick(updateSubmenu1Pos)
  }
})

watch(submenu1Ref, (el) => {
  if (el && openLevel1.value !== null) updateSubmenu1Pos()
})

watch(openLevel2, (idx) => {
  if (idx !== null) {
    updateSubmenu2Pos()
    nextTick(updateSubmenu2Pos)
  }
})

watch(submenu2Ref, (el) => {
  if (el && openLevel2.value !== null) updateSubmenu2Pos()
})

onMounted(() => {
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('scroll', onViewportChange, true)
  window.addEventListener('resize', onViewportChange)
})

onUnmounted(() => {
  clearCloseTimers()
  window.removeEventListener('pointerdown', onPointerDown)
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('scroll', onViewportChange, true)
  window.removeEventListener('resize', onViewportChange)
})
</script>

<style scoped>
.tiered-menu {
  width: 220px;
  padding: 6px;
}

.tiered-menu__list,
.tiered-menu__submenu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tiered-menu__node {
  position: relative;
}

.tiered-menu__submenu {
  min-width: 200px;
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 16px);
  overflow-y: auto;
  padding: 6px;
}

.tiered-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  min-height: 38px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  color: var(--text);
  background: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.tiered-menu__item:hover:not(.tiered-menu__item--disabled),
.tiered-menu__item--active {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.tiered-menu__item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.tiered-menu__label {
  flex: 1;
}

.tiered-menu__chevron {
  flex-shrink: 0;
}

.tiered-menu__separator {
  height: 1px;
  margin: 5px 8px;
  background-color: var(--border, rgba(0, 0, 0, 0.08));
}

@media (max-width: 640px) {
  .tiered-menu {
    width: 100%;
  }
}

</style>
