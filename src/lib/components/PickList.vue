<template>
  <div class="pick-list">
    <div v-if="loading" class="mfs-loading-overlay" role="status" aria-live="polite">
      <slot name="loading">
        <span class="mfs-spinner" aria-label="Loading" />
      </slot>
    </div>

    <div class="pick-list__panel mfs-surface mfs-rounded mfs-shadow-card">
      <div v-if="sourceHeader" class="pick-list__header mfs-text">{{ sourceHeader }}</div>
      <ul
        class="pick-list__list mfs-inset mfs-rounded-md"
        :class="{ 'pick-list__list--drag-over': dragOverList === 'source' }"
        role="listbox"
        aria-label="Source items"
        @dragover="onListDragOver($event, 'source')"
        @dragleave="onListDragLeave($event, 'source')"
        @drop="onListDrop($event, 'source')"
      >
        <li v-if="!loading && source.length === 0" class="mfs-empty-state">
          <slot name="empty-source">
            <span>{{ emptySourceText }}</span>
          </slot>
        </li>
        <li
          v-for="(item, index) in source"
          :key="getItemKey(item, index, itemKey)"
          class="pick-list__item mfs-rounded-sm"
          :class="{
            'pick-list__item--selected': isSelected('source', index),
            'pick-list__item--dragging': dragging?.list === 'source' && dragging.index === index,
            'pick-list__item--drop-before': dropTarget?.list === 'source' && dropTarget.index === index && dropTarget.position === 'before',
            'pick-list__item--drop-after': dropTarget?.list === 'source' && dropTarget.index === index && dropTarget.position === 'after'
          }"
          role="option"
          :aria-selected="isSelected('source', index)"
          tabindex="0"
          :draggable="draggable"
          @click="toggleSelection('source', index)"
          @keydown.enter.prevent="toggleSelection('source', index)"
          @keydown.space.prevent="toggleSelection('source', index)"
          @dragstart="onDragStart($event, 'source', item, index)"
          @dragover="onItemDragOver($event, 'source', index)"
          @drop="onItemDrop($event, 'source', index)"
          @dragend="onDragEnd"
        >
          <slot name="item" :item="item" :index="index" list="source">
            <span class="mfs-text">{{ item }}</span>
          </slot>
        </li>
      </ul>
    </div>

    <div class="pick-list__controls" role="group" aria-label="Transfer controls">
      <button
        type="button"
        class="pick-list__btn mfs-surface-subtle mfs-rounded-sm mfs-interactive"
        :disabled="selectedSource.length === 0"
        aria-label="Move selected to target"
        @click="moveToTarget"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        class="pick-list__btn mfs-surface-subtle mfs-rounded-sm mfs-interactive"
        :disabled="source.length === 0"
        aria-label="Move all to target"
        @click="moveAllToTarget"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 4L8 8L4 12M9 4L13 8L9 12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        class="pick-list__btn mfs-surface-subtle mfs-rounded-sm mfs-interactive"
        :disabled="selectedTarget.length === 0"
        aria-label="Move selected to source"
        @click="moveToSource"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 4L6 8L10 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        class="pick-list__btn mfs-surface-subtle mfs-rounded-sm mfs-interactive"
        :disabled="target.length === 0"
        aria-label="Move all to source"
        @click="moveAllToSource"
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M12 4L8 8L12 12M7 4L3 8L7 12" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <div class="pick-list__panel mfs-surface mfs-rounded mfs-shadow-card">
      <div v-if="targetHeader" class="pick-list__header mfs-text">{{ targetHeader }}</div>
      <ul
        class="pick-list__list mfs-inset mfs-rounded-md"
        :class="{ 'pick-list__list--drag-over': dragOverList === 'target' }"
        role="listbox"
        aria-label="Target items"
        @dragover="onListDragOver($event, 'target')"
        @dragleave="onListDragLeave($event, 'target')"
        @drop="onListDrop($event, 'target')"
      >
        <li v-if="!loading && target.length === 0" class="mfs-empty-state">
          <slot name="empty-target">
            <span>{{ emptyTargetText }}</span>
          </slot>
        </li>
        <li
          v-for="(item, index) in target"
          :key="getItemKey(item, index, itemKey)"
          class="pick-list__item mfs-rounded-sm"
          :class="{
            'pick-list__item--selected': isSelected('target', index),
            'pick-list__item--dragging': dragging?.list === 'target' && dragging.index === index,
            'pick-list__item--drop-before': dropTarget?.list === 'target' && dropTarget.index === index && dropTarget.position === 'before',
            'pick-list__item--drop-after': dropTarget?.list === 'target' && dropTarget.index === index && dropTarget.position === 'after'
          }"
          role="option"
          :aria-selected="isSelected('target', index)"
          tabindex="0"
          :draggable="draggable"
          @click="toggleSelection('target', index)"
          @keydown.enter.prevent="toggleSelection('target', index)"
          @keydown.space.prevent="toggleSelection('target', index)"
          @dragstart="onDragStart($event, 'target', item, index)"
          @dragover="onItemDragOver($event, 'target', index)"
          @drop="onItemDrop($event, 'target', index)"
          @dragend="onDragEnd"
        >
          <slot name="item" :item="item" :index="index" list="target">
            <span class="mfs-text">{{ item }}</span>
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { dragState, endDrag, getDropPosition, reorderArray, startDrag } from '../composables/useDragDrop'
import { getItemKey } from '../utils/itemKey'

type ListSide = 'source' | 'target'
let uidCounter = 0

const props = withDefaults(
  defineProps<{
    source: any[]
    target: any[]
    itemKey?: string
    sourceHeader?: string
    targetHeader?: string
    loading?: boolean
    emptySourceText?: string
    emptyTargetText?: string
    draggable?: boolean
  }>(),
  {
    itemKey: 'id',
    sourceHeader: 'Available',
    targetHeader: 'Selected',
    loading: false,
    emptySourceText: 'No items',
    emptyTargetText: 'No items',
    draggable: true
  }
)

const emit = defineEmits<{
  'update:source': [value: any[]]
  'update:target': [value: any[]]
  transfer: [payload: { source: any[]; target: any[] }]
}>()

defineSlots<{
  item?: (props: { item: any; index: number; list: 'source' | 'target' }) => any
  loading?: () => any
  'empty-source'?: () => any
  'empty-target'?: () => any
}>()

const instanceGroup = `pick-list-${++uidCounter}`
const selectedSource = ref<number[]>([])
const selectedTarget = ref<number[]>([])
const dragging = ref<{ list: ListSide; index: number } | null>(null)
const dropTarget = ref<{ list: ListSide; index: number; position: 'before' | 'after' } | null>(null)
const dragOverList = ref<ListSide | null>(null)

function isSelected(list: 'source' | 'target', index: number): boolean {
  const arr = list === 'source' ? selectedSource.value : selectedTarget.value
  return arr.includes(index)
}

function toggleSelection(list: 'source' | 'target', index: number) {
  const targetRef = list === 'source' ? selectedSource : selectedTarget
  const pos = targetRef.value.indexOf(index)
  if (pos >= 0) {
    targetRef.value.splice(pos, 1)
  } else {
    targetRef.value.push(index)
  }
}

function commit(nextSource: any[], nextTarget: any[]) {
  selectedSource.value = []
  selectedTarget.value = []
  emit('update:source', nextSource)
  emit('update:target', nextTarget)
  emit('transfer', { source: nextSource, target: nextTarget })
}

function moveToTarget() {
  const indices = new Set(selectedSource.value)
  const moved = props.source.filter((_, i) => indices.has(i))
  const nextSource = props.source.filter((_, i) => !indices.has(i))
  commit(nextSource, [...props.target, ...moved])
}

function moveAllToTarget() {
  commit([], [...props.target, ...props.source])
}

function moveToSource() {
  const indices = new Set(selectedTarget.value)
  const moved = props.target.filter((_, i) => indices.has(i))
  const nextTarget = props.target.filter((_, i) => !indices.has(i))
  commit([...props.source, ...moved], nextTarget)
}

function moveAllToSource() {
  commit([...props.source, ...props.target], [])
}

function canAcceptDrag(): boolean {
  return Boolean(props.draggable && dragState.value && dragState.value.group === instanceGroup)
}

function getSourceSide(): ListSide | null {
  if (!dragState.value) return null
  return dragState.value.sourceId.endsWith(':source') ? 'source' : 'target'
}

function onDragStart(e: DragEvent, list: ListSide, item: any, index: number) {
  if (!props.draggable) {
    e.preventDefault()
    return
  }
  dragging.value = { list, index }
  startDrag(e, {
    sourceId: `${instanceGroup}:${list}`,
    group: instanceGroup,
    index,
    item
  })
}

function onItemDragOver(e: DragEvent, list: ListSide, index: number) {
  if (!canAcceptDrag()) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  const position = getDropPosition(e, e.currentTarget as HTMLElement, 'vertical')
  dropTarget.value = { list, index, position }
  dragOverList.value = list
}

function applyDrop(toList: ListSide, insertIndex: number | null) {
  const payload = dragState.value
  const fromList = getSourceSide()
  if (!payload || !fromList) return

  if (fromList === toList) {
    const current = toList === 'source' ? props.source : props.target
    let targetIndex = insertIndex === null ? Math.max(0, current.length - 1) : insertIndex
    if (insertIndex !== null && payload.index < targetIndex) {
      targetIndex -= 1
    }
    if (targetIndex !== payload.index) {
      const reordered = reorderArray(current, payload.index, targetIndex)
      if (toList === 'source') {
        commit(reordered, props.target)
      } else {
        commit(props.source, reordered)
      }
    }
    return
  }

  const nextSource = [...props.source]
  const nextTarget = [...props.target]
  if (fromList === 'source') {
    const [moved] = nextSource.splice(payload.index, 1)
    const idx = insertIndex === null ? nextTarget.length : insertIndex
    nextTarget.splice(idx, 0, moved)
  } else {
    const [moved] = nextTarget.splice(payload.index, 1)
    const idx = insertIndex === null ? nextSource.length : insertIndex
    nextSource.splice(idx, 0, moved)
  }
  commit(nextSource, nextTarget)
}

function onItemDrop(e: DragEvent, list: ListSide, index: number) {
  e.preventDefault()
  e.stopPropagation()
  if (!canAcceptDrag()) {
    onDragEnd()
    return
  }
  const pos =
    dropTarget.value?.list === list && dropTarget.value.index === index
      ? dropTarget.value.position
      : getDropPosition(e, e.currentTarget as HTMLElement, 'vertical')
  const insertIndex = pos === 'after' ? index + 1 : index
  applyDrop(list, insertIndex)
  onDragEnd()
}

function onListDragOver(e: DragEvent, list: ListSide) {
  if (!canAcceptDrag()) return
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dragOverList.value = list
}

function onListDragLeave(e: DragEvent, list: ListSide) {
  const current = e.currentTarget as HTMLElement
  if (!current.contains(e.relatedTarget as Node | null) && dragOverList.value === list) {
    dragOverList.value = null
    if (dropTarget.value?.list === list) dropTarget.value = null
  }
}

function onListDrop(e: DragEvent, list: ListSide) {
  e.preventDefault()
  if (!canAcceptDrag()) {
    onDragEnd()
    return
  }
  applyDrop(list, null)
  onDragEnd()
}

function onDragEnd() {
  dragging.value = null
  dropTarget.value = null
  dragOverList.value = null
  endDrag()
}
</script>

<style scoped>
.pick-list {
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: stretch;
}

.pick-list__panel {
  display: flex;
  flex-direction: column;
  padding: 14px;
  gap: 10px;
  min-width: 0;
}

.pick-list__header {
  font-weight: 700;
  font-size: 0.95rem;
}

.pick-list__list {
  list-style: none;
  margin: 0;
  padding: 8px;
  height: 240px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  transition: box-shadow 0.15s ease;
}

.pick-list__list--drag-over {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--primary) 45%, transparent);
}

.pick-list__item {
  position: relative;
  padding: 9px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease, opacity 0.15s ease;
}

.pick-list__item--dragging {
  opacity: 0.45;
}

.pick-list__item--drop-before::before,
.pick-list__item--drop-after::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 4px;
  height: 2px;
  background: var(--primary);
  border-radius: 2px;
  pointer-events: none;
}

.pick-list__item--drop-before::before {
  top: -2px;
}

.pick-list__item--drop-after::after {
  bottom: -2px;
}

.pick-list__item:not(:last-child) {
  border-bottom: 1px solid color-mix(in srgb, var(--text-muted, #94a3b8) 16%, transparent);
}

.pick-list__item:hover {
  background: var(--surface);
}

.pick-list__item--selected {
  background: color-mix(in srgb, var(--primary) 16%, transparent);
  color: var(--primary);
  font-weight: 600;
}

.pick-list__controls {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.pick-list__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: var(--text);
}

.pick-list__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.pick-list__btn svg {
  width: 16px;
  height: 16px;
}

[data-theme="clay"] .pick-list__btn:not(:disabled) {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .pick-list__item:hover {
  background: rgba(255, 255, 255, 0.08);
}

[data-theme="neo"] .pick-list__btn:not(:disabled) {
  box-shadow: var(--clay-shadow);
}

@media (max-width: 640px) {
  .pick-list {
    grid-template-columns: 1fr;
  }

  .pick-list__controls {
    flex-direction: row;
  }

  .pick-list__btn svg {
    transform: rotate(90deg);
  }
}
</style>
