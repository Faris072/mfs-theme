<template>
  <div class="order-list mfs-surface mfs-rounded mfs-shadow-card">
    <div v-if="loading" class="mfs-loading-overlay" role="status" aria-live="polite">
      <slot name="loading">
        <span class="mfs-spinner" aria-label="Loading" />
      </slot>
    </div>

    <div v-if="header || $slots.header" class="order-list__header">
      <slot name="header">
        <span class="order-list__title mfs-title">{{ header }}</span>
      </slot>
    </div>

    <div class="order-list__body">
      <div class="order-list__controls" role="group" aria-label="Reorder controls">
        <button
          type="button"
          class="order-list__btn mfs-surface-subtle mfs-rounded-sm mfs-interactive"
          :disabled="!canMoveUp"
          aria-label="Move to top"
          @click="moveTop"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 3.5H12M8 6V13M5 9L8 6L11 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="order-list__btn mfs-surface-subtle mfs-rounded-sm mfs-interactive"
          :disabled="!canMoveUp"
          aria-label="Move up"
          @click="moveUp"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 10L8 6L12 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="order-list__btn mfs-surface-subtle mfs-rounded-sm mfs-interactive"
          :disabled="!canMoveDown"
          aria-label="Move down"
          @click="moveDown"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          type="button"
          class="order-list__btn mfs-surface-subtle mfs-rounded-sm mfs-interactive"
          :disabled="!canMoveDown"
          aria-label="Move to bottom"
          @click="moveBottom"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 12.5H12M8 10V3M5 7L8 10L11 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <ul class="order-list__list mfs-inset mfs-rounded-md" role="listbox" aria-label="Orderable items">
        <li v-if="!loading && modelValue.length === 0" class="mfs-empty-state">
          <slot name="empty">
            <span>{{ emptyText }}</span>
          </slot>
        </li>
        <li
          v-for="(item, index) in modelValue"
          :key="getItemKey(item, index, itemKey)"
          :ref="(el) => setItemRef(el, index)"
          class="order-list__item mfs-rounded-sm"
          :class="{
            'order-list__item--selected': selectedIndex === index,
            'order-list__item--dragging': draggingIndex === index,
            'order-list__item--drop-before': dropTargetIndex === index && dropPosition === 'before',
            'order-list__item--drop-after': dropTargetIndex === index && dropPosition === 'after'
          }"
          role="option"
          :aria-selected="selectedIndex === index"
          tabindex="0"
          :draggable="draggable"
          @click="selectedIndex = index"
          @keydown.enter.prevent="selectedIndex = index"
          @keydown.space.prevent="selectedIndex = index"
          @keydown="onItemKeyDown($event, index)"
          @dragstart="onDragStart($event, item, index)"
          @dragover="onDragOver($event, index)"
          @drop="onDrop($event, index)"
          @dragend="onDragEnd"
        >
          <span v-if="draggable" class="order-list__grip" aria-hidden="true">⋮⋮</span>
          <slot name="item" :item="item" :index="index" :selected="selectedIndex === index">
            <span class="mfs-text">{{ item }}</span>
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, type ComponentPublicInstance } from 'vue'
import { dragState, endDrag, getDropPosition, reorderArray, startDrag } from '../composables/useDragDrop'
import { getItemKey } from '../utils/itemKey'

let uidCounter = 0

const props = withDefaults(
  defineProps<{
    modelValue: any[]
    itemKey?: string
    header?: string
    loading?: boolean
    emptyText?: string
    draggable?: boolean
  }>(),
  {
    itemKey: 'id',
    header: '',
    loading: false,
    emptyText: 'No items',
    draggable: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
  reorder: [value: any[]]
}>()

defineSlots<{
  header?: () => any
  item?: (props: { item: any; index: number; selected: boolean }) => any
  loading?: () => any
  empty?: () => any
}>()

const listId = `order-list-${++uidCounter}`
const selectedIndex = ref<number | null>(null)
const draggingIndex = ref<number | null>(null)
const dropTargetIndex = ref<number | null>(null)
const dropPosition = ref<'before' | 'after' | null>(null)
const itemRefs = ref<(HTMLElement | null)[]>([])

function setItemRef(el: Element | ComponentPublicInstance | null, index: number) {
  itemRefs.value[index] = el instanceof HTMLElement ? el : null
}

const canMoveUp = computed(
  () => selectedIndex.value !== null && selectedIndex.value > 0
)

const canMoveDown = computed(
  () => selectedIndex.value !== null && selectedIndex.value < props.modelValue.length - 1
)

function updateOrder(next: any[], nextIndex: number) {
  selectedIndex.value = nextIndex
  emit('update:modelValue', next)
  emit('reorder', next)
}

function moveUp() {
  if (!canMoveUp.value || selectedIndex.value === null) return
  const idx = selectedIndex.value
  const next = [...props.modelValue]
  ;[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]]
  updateOrder(next, idx - 1)
}

function moveDown() {
  if (!canMoveDown.value || selectedIndex.value === null) return
  const idx = selectedIndex.value
  const next = [...props.modelValue]
  ;[next[idx + 1], next[idx]] = [next[idx], next[idx + 1]]
  updateOrder(next, idx + 1)
}

function moveTop() {
  if (!canMoveUp.value || selectedIndex.value === null) return
  const idx = selectedIndex.value
  const next = [...props.modelValue]
  const [item] = next.splice(idx, 1)
  next.unshift(item)
  updateOrder(next, 0)
}

function moveBottom() {
  if (!canMoveDown.value || selectedIndex.value === null) return
  const idx = selectedIndex.value
  const next = [...props.modelValue]
  const [item] = next.splice(idx, 1)
  next.push(item)
  updateOrder(next, next.length - 1)
}

function onDragStart(e: DragEvent, item: any, index: number) {
  if (!props.draggable) {
    e.preventDefault()
    return
  }
  draggingIndex.value = index
  startDrag(e, {
    sourceId: listId,
    group: '',
    index,
    item
  })
}

function onDragOver(e: DragEvent, index: number) {
  if (!props.draggable || !dragState.value || dragState.value.sourceId !== listId) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dropTargetIndex.value = index
  dropPosition.value = getDropPosition(e, e.currentTarget as HTMLElement, 'vertical')
}

function onDrop(e: DragEvent, index: number) {
  e.preventDefault()
  if (!props.draggable || !dragState.value || dragState.value.sourceId !== listId) {
    onDragEnd()
    return
  }
  const fromIndex = dragState.value.index
  const pos = dropPosition.value ?? getDropPosition(e, e.currentTarget as HTMLElement, 'vertical')
  let targetIndex = pos === 'after' ? index + 1 : index
  if (fromIndex < targetIndex) targetIndex -= 1
  if (targetIndex !== fromIndex) {
    const next = reorderArray(props.modelValue, fromIndex, targetIndex)
    updateOrder(next, targetIndex)
  }
  onDragEnd()
}

function onDragEnd() {
  draggingIndex.value = null
  dropTargetIndex.value = null
  dropPosition.value = null
  endDrag()
}

function onItemKeyDown(e: KeyboardEvent, index: number) {
  if (!props.draggable || !e.altKey) return
  if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
  const target = e.target as HTMLElement | null
  if (target?.closest('input, textarea, select, button, a')) return

  e.preventDefault()
  const delta = e.key === 'ArrowUp' ? -1 : 1
  const toIndex = index + delta
  if (toIndex < 0 || toIndex >= props.modelValue.length) return
  const next = reorderArray(props.modelValue, index, toIndex)
  updateOrder(next, toIndex)
  nextTick(() => {
    itemRefs.value[toIndex]?.focus()
  })
}
</script>

<style scoped>
.order-list {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.order-list__header {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.06));
}

.order-list__title {
  font-weight: 700;
  font-size: 1rem;
}

.order-list__body {
  display: flex;
  gap: 14px;
  padding: 16px;
}

.order-list__controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}

.order-list__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--text);
}

.order-list__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.order-list__btn svg {
  width: 16px;
  height: 16px;
}

.order-list__list {
  flex: 1 1 auto;
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.order-list__item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.order-list__grip {
  font-size: 0.75rem;
  line-height: 1;
  color: var(--text-muted, #94a3b8);
  cursor: grab;
  user-select: none;
  flex-shrink: 0;
}

.order-list__item--dragging {
  opacity: 0.45;
}

.order-list__item--drop-before::before,
.order-list__item--drop-after::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 4px;
  height: 2px;
  background: var(--primary);
  border-radius: 2px;
  pointer-events: none;
}

.order-list__item--drop-before::before {
  top: -2px;
}

.order-list__item--drop-after::after {
  bottom: -2px;
}

.order-list__item:not(:last-child) {
  border-bottom: 1px solid color-mix(in srgb, var(--text-muted, #94a3b8) 16%, transparent);
}

.order-list__item:hover {
  background: var(--surface);
}

.order-list__item--selected {
  background: color-mix(in srgb, var(--primary) 16%, transparent);
  color: var(--primary);
  font-weight: 600;
}

[data-theme="clay"] .order-list__btn:not(:disabled) {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .order-list__item:hover {
  background: rgba(255, 255, 255, 0.08);
}

[data-theme="neo"] .order-list__btn:not(:disabled) {
  box-shadow: var(--clay-shadow);
}

@media (max-width: 640px) {
  .order-list__body {
    flex-direction: column;
  }

  .order-list__controls {
    flex-direction: row;
  }
}
</style>
