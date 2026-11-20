<template>
  <div class="tabs">
    <div
      ref="listRef"
      class="tabs__list mfs-surface-subtle mfs-pill mfs-shadow-inset"
      :class="{ 'tabs__list--scrollable': scrollable }"
      role="tablist"
      @keydown="handleKeydown"
    >
      <span class="tabs__indicator mfs-pill mfs-shadow" :style="indicatorStyle" aria-hidden="true" />
      <button
        v-for="(item, index) in items"
        :key="item.key"
        :ref="(el) => setTabRef(item.key, el as HTMLButtonElement | null)"
        type="button"
        role="tab"
        class="tabs__tab mfs-pill"
        :class="{
          'tabs__tab--active': item.key === activeKey,
          'tabs__tab--disabled': item.disabled
        }"
        :aria-selected="item.key === activeKey"
        :aria-disabled="item.disabled || undefined"
        :disabled="item.disabled"
        :tabindex="item.key === activeKey ? 0 : -1"
        @click="selectTab(item, index)"
      >
        <slot name="tab" :item="item" :active="item.key === activeKey">
          {{ item.label }}
        </slot>
      </button>
    </div>

    <div v-if="$slots.default" class="tabs__panel" role="tabpanel">
      <slot :active-key="activeKey" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

export interface TabItem {
  key: string
  label: string
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    items: TabItem[]
    modelValue?: string
    scrollable?: boolean
  }>(),
  {
    scrollable: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', key: string): void
  (e: 'change', key: string): void
}>()

const listRef = ref<HTMLElement | null>(null)
const tabRefs = new Map<string, HTMLButtonElement>()
const indicator = ref({ left: 0, width: 0, ready: false })

const activeKey = computed(() => {
  if (props.modelValue !== undefined) return props.modelValue
  const firstEnabled = props.items.find((i) => !i.disabled)
  return firstEnabled?.key ?? props.items[0]?.key ?? ''
})

const indicatorStyle = computed(() => ({
  transform: `translateX(${indicator.value.left}px)`,
  width: `${indicator.value.width}px`,
  opacity: indicator.value.ready && indicator.value.width > 0 ? 1 : 0
}))

const setTabRef = (key: string, el: HTMLButtonElement | null) => {
  if (el) {
    tabRefs.set(key, el)
  } else {
    tabRefs.delete(key)
  }
}

const updateIndicator = async (scrollIntoView = false) => {
  await nextTick()
  const activeEl = tabRefs.get(activeKey.value)
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

const selectTab = (item: TabItem, _index?: number) => {
  if (item.disabled || item.key === activeKey.value) return
  emit('update:modelValue', item.key)
  emit('change', item.key)
}

const handleKeydown = (e: KeyboardEvent) => {
  const enabled = props.items.filter((i) => !i.disabled)
  if (!enabled.length) return
  const currentIdx = enabled.findIndex((i) => i.key === activeKey.value)
  let nextIdx = -1

  if (e.key === 'ArrowRight') {
    nextIdx = (currentIdx + 1) % enabled.length
  } else if (e.key === 'ArrowLeft') {
    nextIdx = (currentIdx - 1 + enabled.length) % enabled.length
  } else if (e.key === 'Home') {
    nextIdx = 0
  } else if (e.key === 'End') {
    nextIdx = enabled.length - 1
  }

  if (nextIdx >= 0) {
    e.preventDefault()
    const target = enabled[nextIdx]
    selectTab(target)
    tabRefs.get(target.key)?.focus()
  }
}

let resizeObserver: ResizeObserver | null = null

watch(
  () => [activeKey.value, props.items],
  () => updateIndicator(true),
  { deep: true }
)

const onResize = () => updateIndicator(false)

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
.tabs {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tabs__list {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  background-color: var(--surface-subtle);
  border: 1px solid var(--border, transparent);
  border-radius: var(--radius-pill, 9999px);
  box-shadow: var(--input-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  max-width: 100%;
}

.tabs__list--scrollable {
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.tabs__list--scrollable::-webkit-scrollbar {
  display: none;
}

.tabs__indicator {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 0;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--primary);
  box-shadow: var(--clay-shadow);
  transition: transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.15s ease;
  pointer-events: none;
  z-index: 0;
}

.tabs__tab {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  padding: 8px 18px;
  min-height: 36px;
  border: none;
  border-radius: var(--radius-pill, 9999px);
  background: transparent;
  color: var(--text-muted);
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease;
  user-select: none;
}

.tabs__tab:hover:not(.tabs__tab--disabled):not(.tabs__tab--active) {
  color: var(--text);
}

.tabs__tab--active {
  color: var(--primary-text, #ffffff);
}

.tabs__tab--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.tabs__panel {
  width: 100%;
}

[data-theme="neo"] .tabs__list {
  background-color: var(--surface);
}
</style>
