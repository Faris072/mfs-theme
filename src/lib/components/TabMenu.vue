<template>
  <nav class="tab-menu" aria-label="Tab navigation">
    <div
      ref="listRef"
      class="tab-menu__list mfs-surface-subtle mfs-pill mfs-shadow-inset"
      :class="{ 'tab-menu__list--scrollable': scrollable }"
      role="tablist"
      @keydown="handleKeydown"
    >
      <span class="tab-menu__indicator" :style="indicatorStyle" aria-hidden="true" />
      <template v-for="(item, idx) in items" :key="item.key ?? idx">
        <button
          v-if="!item.to && !item.href"
          :ref="(el: unknown) => setItemRef(idx, el)"
          type="button"
          role="tab"
          class="tab-menu__item mfs-text"
          :class="{
            'tab-menu__item--active': idx === modelValue,
            'tab-menu__item--disabled mfs-disabled': item.disabled
          }"
          :aria-selected="idx === modelValue"
          :aria-disabled="item.disabled || undefined"
          :tabindex="idx === modelValue ? 0 : -1"
          @click="selectItem(item, idx, $event)"
        >
          <span v-if="item.icon" class="tab-menu__icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>

        <component
          :is="item.to ? 'router-link' : 'a'"
          v-else
          :ref="(el: unknown) => setItemRef(idx, el)"
          :to="item.to"
          :href="sanitizeHref(item.href)"
          role="tab"
          class="tab-menu__item mfs-text"
          :class="{
            'tab-menu__item--active': idx === modelValue,
            'tab-menu__item--disabled mfs-disabled': item.disabled
          }"
          :aria-selected="idx === modelValue"
          :aria-disabled="item.disabled || undefined"
          :tabindex="idx === modelValue ? 0 : -1"
          @click="selectItem(item, idx, $event)"
        >
          <span v-if="item.icon" class="tab-menu__icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </component>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { sanitizeHref } from '../utils/sanitize'

export interface TabMenuItem {
  key?: string
  label: string
  icon?: string
  to?: string | Record<string, unknown>
  href?: string
  disabled?: boolean
  command?: () => void
}

const props = withDefaults(
  defineProps<{
    items: TabMenuItem[]
    modelValue?: number
    scrollable?: boolean
  }>(),
  {
    modelValue: 0,
    scrollable: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', index: number): void
  (e: 'change', payload: { index: number; item: TabMenuItem }): void
}>()

const listRef = ref<HTMLElement | null>(null)
const itemEls = new Map<number, HTMLElement>()
const indicator = ref({ left: 0, width: 0, ready: false })

const setItemRef = (idx: number, el: unknown) => {
  const domEl = (el as { $el?: HTMLElement } | null)?.$el ?? (el as HTMLElement | null)
  if (domEl instanceof HTMLElement) itemEls.set(idx, domEl)
  else itemEls.delete(idx)
}

const indicatorStyle = computed(() => ({
  transform: `translateX(${indicator.value.left}px)`,
  width: `${indicator.value.width}px`,
  opacity: indicator.value.ready && indicator.value.width > 0 ? 1 : 0
}))

const updateIndicator = async (scrollIntoView = false) => {
  await nextTick()
  const activeEl = itemEls.get(props.modelValue)
  if (!activeEl) {
    indicator.value = { left: 0, width: 0, ready: false }
    return
  }
  indicator.value = {
    left: activeEl.offsetLeft,
    width: activeEl.offsetWidth,
    ready: true
  }
  if (scrollIntoView && props.scrollable) {
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }
}

const selectItem = (item: TabMenuItem, idx: number, event: MouseEvent) => {
  if (item.disabled) {
    event.preventDefault()
    return
  }
  item.command?.()
  if (idx !== props.modelValue) {
    emit('update:modelValue', idx)
    emit('change', { index: idx, item })
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  const enabled = props.items
    .map((item, i) => (!item.disabled ? i : -1))
    .filter((i) => i >= 0)
  if (!enabled.length) return
  const pos = enabled.indexOf(props.modelValue)
  let nextIdx = -1
  if (e.key === 'ArrowRight') nextIdx = enabled[(pos + 1) % enabled.length]
  else if (e.key === 'ArrowLeft') nextIdx = enabled[(pos - 1 + enabled.length) % enabled.length]
  else if (e.key === 'Home') nextIdx = enabled[0]
  else if (e.key === 'End') nextIdx = enabled[enabled.length - 1]

  if (nextIdx >= 0) {
    e.preventDefault()
    const target = props.items[nextIdx]
    emit('update:modelValue', nextIdx)
    emit('change', { index: nextIdx, item: target })
    itemEls.get(nextIdx)?.focus()
  }
}

const onResize = () => updateIndicator(false)
let resizeObserver: ResizeObserver | null = null

watch(
  () => [props.modelValue, props.items],
  () => updateIndicator(true),
  { deep: true }
)

onMounted(() => {
  updateIndicator(false)
  if (typeof ResizeObserver !== 'undefined' && listRef.value) {
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(listRef.value)
  }
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.tab-menu {
  width: 100%;
}

.tab-menu__list {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  max-width: 100%;
}

.tab-menu__list--scrollable {
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.tab-menu__list--scrollable::-webkit-scrollbar {
  display: none;
}

.tab-menu__indicator {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 0;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--primary);
  transition: transform 0.28s cubic-bezier(0.2, 0, 0, 1), width 0.28s cubic-bezier(0.2, 0, 0, 1), opacity 0.15s ease;
  pointer-events: none;
  z-index: 0;
}

.tab-menu__item {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  min-height: 36px;
  border: none;
  border-radius: var(--radius-pill, 9999px);
  background: transparent;
  color: var(--text);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease;
}

.tab-menu__item:hover:not(.tab-menu__item--disabled):not(.tab-menu__item--active) {
  color: var(--text);
}

.tab-menu__item--active {
  color: var(--primary-text, #ffffff);
}

.tab-menu__item--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

[data-theme="neo"] .tab-menu__list {
  background-color: var(--surface);
}

[data-theme="clay"] .tab-menu__indicator {
  box-shadow: 0 4px 12px color-mix(in srgb, var(--primary) 35%, transparent), inset -3px -3px 6px rgba(15, 23, 42, 0.2), inset 3px 3px 6px rgba(255, 255, 255, 0.45);
}

[data-theme="neo"] .tab-menu__indicator {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .tab-menu__indicator {
  box-shadow: var(--glow);
}

[data-theme="brutalism"] .tab-menu__indicator {
  border: 2px solid var(--border);
  box-shadow: 2px 2px 0 var(--border);
  border-radius: var(--radius, 4px);
}

[data-theme="brutalism"] .tab-menu__item {
  border-radius: var(--radius, 4px);
}

@media (max-width: 640px) {
  .tab-menu__item {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
</style>
