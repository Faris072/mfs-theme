<template>
  <div
    ref="containerRef"
    class="virtual-scroller mfs-surface mfs-rounded mfs-shadow-card"
    :style="{ height }"
    @scroll="onScroll"
  >
    <div v-if="loading" class="mfs-loading-overlay" role="status" aria-live="polite">
      <slot name="loading">
        <span class="mfs-spinner" aria-label="Loading" />
      </slot>
    </div>
    <div v-else-if="items.length === 0" class="mfs-empty-state">
      <slot name="empty">
        <span>{{ emptyText }}</span>
      </slot>
    </div>
    <div v-else class="virtual-scroller__spacer" :style="{ height: `${totalHeight}px` }">
      <div
        class="virtual-scroller__content"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div
          v-for="entry in visibleItems"
          :key="getItemKey(entry.item, entry.index, itemKey)"
          class="virtual-scroller__item"
          :style="{ height: `${itemSize}px` }"
        >
          <slot name="item" :item="entry.item" :index="entry.index">
            <span class="mfs-text">{{ entry.item }}</span>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getItemKey } from '../utils/itemKey'

const props = withDefaults(
  defineProps<{
    items: any[]
    itemSize: number
    height?: string
    buffer?: number
    itemKey?: string
    loading?: boolean
    lazy?: boolean
    emptyText?: string
  }>(),
  {
    height: '300px',
    buffer: 3,
    itemKey: 'id',
    loading: false,
    lazy: false,
    emptyText: 'No items'
  }
)

const emit = defineEmits<{
  'lazy-load': [payload: { first: number; last: number }]
}>()

defineSlots<{
  item?: (props: { item: any; index: number }) => any
  loading?: () => any
  empty?: () => any
}>()

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const viewportHeight = ref(300)

onMounted(() => {
  if (containerRef.value) {
    viewportHeight.value = containerRef.value.clientHeight || 300
  }
})

function onScroll() {
  if (!containerRef.value) return
  scrollTop.value = containerRef.value.scrollTop
  viewportHeight.value = containerRef.value.clientHeight || viewportHeight.value
  if (props.lazy) {
    emit('lazy-load', { first: startIndex.value, last: endIndex.value })
  }
}

const totalHeight = computed(() => props.items.length * props.itemSize)

const startIndex = computed(() => {
  const raw = Math.floor(scrollTop.value / props.itemSize) - props.buffer
  return Math.max(0, raw)
})

const endIndex = computed(() => {
  const visibleCount = Math.ceil(viewportHeight.value / props.itemSize)
  const raw = Math.floor(scrollTop.value / props.itemSize) + visibleCount + props.buffer
  return Math.min(props.items.length, raw)
})

const offsetY = computed(() => startIndex.value * props.itemSize)

const visibleItems = computed(() =>
  props.items.slice(startIndex.value, endIndex.value).map((item, idx) => ({
    item,
    index: startIndex.value + idx
  }))
)
</script>

<style scoped>
.virtual-scroller {
  overflow-y: auto;
  position: relative;
}

.virtual-scroller__spacer {
  position: relative;
  width: 100%;
}

.virtual-scroller__content {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  will-change: transform;
}

.virtual-scroller__item {
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.05));
  box-sizing: border-box;
}

.virtual-scroller__item:hover {
  background: var(--surface-subtle);
}

[data-theme="glass"] .virtual-scroller__item:hover {
  background: rgba(255, 255, 255, 0.06);
}
</style>
