<template>
  <div
    class="sortable-list mfs-inset mfs-rounded-md mfs-p-2 mfs-flex mfs-gap-2"
    :class="[
      orientation === 'horizontal' ? 'sortable-list--horizontal' : 'mfs-flex-col sortable-list--vertical',
      {
        'sortable-list--drag-over': isContainerDragOver,
        'sortable-list--disabled': disabled
      }
    ]"
    :data-sortable-id="listId"
    role="list"
  >
    <span class="sortable-list__sr-only" aria-live="polite">{{ liveAnnouncement }}</span>

    <div v-if="modelValue.length === 0" class="mfs-empty-state mfs-text-muted">
      <slot name="empty">
        <span>{{ emptyText }}</span>
      </slot>
    </div>

    <div
      v-for="(item, index) in modelValue"
      :key="getItemKey(item, index, itemKey)"
      :ref="(el) => setItemRef(el, index)"
      class="sortable-list__item mfs-surface mfs-rounded-sm mfs-text"
      :class="{
        'sortable-list__item--no-handle': !handle && !disabled,
        'sortable-list__item--dragging': draggingIndex === index,
        'sortable-list__item--grabbed': grabbedIndex === index,
        'sortable-list__item--drop-before': dropTargetIndex === index && dropPosition === 'before',
        'sortable-list__item--drop-after': dropTargetIndex === index && dropPosition === 'after'
      }"
      :data-sortable-index="index"
      role="listitem"
      aria-roledescription="sortable item"
      :aria-grabbed="grabbedIndex === index"
      :tabindex="disabled ? -1 : 0"
      @pointerdown="onItemPointerDown($event, item, index)"
      @keydown="onKeyDown($event, index)"
    >
      <slot
        name="item"
        :item="item"
        :index="index"
        :dragging="draggingIndex === index"
        :grabbed="grabbedIndex === index"
      >
        <span>{{ item }}</span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, type ComponentPublicInstance } from 'vue'
import {
  getPointDropPosition,
  getSortableList,
  registerSortableList,
  reorderArray,
  unregisterSortableList
} from '../composables/useDragDrop'
import { getItemKey } from '../utils/itemKey'

interface ActivePointerDrag {
  item: any
  index: number
  itemEl: HTMLElement
  rect: DOMRect
  startX: number
  startY: number
  offsetX: number
  offsetY: number
  started: boolean
  previewEl: HTMLElement | null
}

let uidCounter = 0

const props = withDefaults(
  defineProps<{
    modelValue: any[]
    itemKey?: string
    group?: string
    handle?: string
    disabled?: boolean
    orientation?: 'vertical' | 'horizontal'
    emptyText?: string
  }>(),
  {
    itemKey: 'id',
    group: '',
    handle: '',
    disabled: false,
    orientation: 'vertical',
    emptyText: 'Drop items here'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
  reorder: [payload: { value: any[]; fromIndex: number; toIndex: number }]
  transfer: [payload: { item: any; fromIndex: number; toIndex: number; fromGroup: string }]
}>()

defineSlots<{
  item?: (props: { item: any; index: number; dragging: boolean; grabbed: boolean }) => any
  empty?: () => any
}>()

const listId = `sortable-${++uidCounter}`
const draggingIndex = ref<number | null>(null)
const grabbedIndex = ref<number | null>(null)
const dropTargetIndex = ref<number | null>(null)
const dropPosition = ref<'before' | 'after' | null>(null)
const isContainerDragOver = ref(false)
const liveAnnouncement = ref('')
const itemRefs = ref<(HTMLElement | null)[]>([])

let activeDrag: ActivePointerDrag | null = null
let hoveredListId: string | null = null
let hoveredIndex: number | null = null
let hoveredPos: 'before' | 'after' | null = null

function setItemRef(el: Element | ComponentPublicInstance | null, index: number) {
  itemRefs.value[index] = el instanceof HTMLElement ? el : null
}

function setDropIndicator(
  index: number | null,
  position: 'before' | 'after' | null,
  containerOver: boolean
) {
  dropTargetIndex.value = index
  dropPosition.value = position
  isContainerDragOver.value = containerOver
}

function handleReorder(fromIndex: number, toIndex: number) {
  const next = reorderArray(props.modelValue, fromIndex, toIndex)
  emit('update:modelValue', next)
  emit('reorder', { value: next, fromIndex, toIndex })
}

function handleRemove(index: number) {
  const next = [...props.modelValue]
  next.splice(index, 1)
  emit('update:modelValue', next)
}

function handleReceive(item: unknown, fromIndex: number, toIndex: number, fromGroup: string) {
  const next = [...props.modelValue]
  const insertAt = toIndex < 0 || toIndex > next.length ? next.length : toIndex
  next.splice(insertAt, 0, item)
  emit('update:modelValue', next)
  emit('transfer', {
    item,
    fromIndex,
    toIndex: insertAt,
    fromGroup
  })
}

onMounted(() => {
  registerSortableList({
    listId,
    getGroup: () => props.group,
    getOrientation: () => props.orientation,
    isDisabled: () => props.disabled,
    setDropIndicator,
    onReorder: handleReorder,
    onReceive: handleReceive,
    onRemove: handleRemove
  })
})

onUnmounted(() => {
  cleanupPointerDrag()
  unregisterSortableList(listId)
})

function createFloatingPreview(itemEl: HTMLElement, rect: DOMRect): HTMLElement {
  const clone = itemEl.cloneNode(true) as HTMLElement
  clone.classList.add('sortable-list__floating-preview')
  clone.style.width = `${rect.width}px`
  clone.style.height = `${rect.height}px`
  clone.style.position = 'fixed'
  clone.style.top = '0'
  clone.style.left = '0'
  clone.style.margin = '0'
  clone.style.pointerEvents = 'none'
  clone.style.zIndex = '9999'
  document.body.appendChild(clone)
  return clone
}

function updateFloatingPosition(previewEl: HTMLElement | null, clientX: number, clientY: number) {
  if (!previewEl || !activeDrag) return
  const x = clientX - activeDrag.offsetX
  const y = clientY - activeDrag.offsetY
  previewEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.02) rotate(0.75deg)`
}

function onItemPointerDown(e: PointerEvent, item: any, index: number) {
  if (props.disabled || e.button !== 0) return
  const target = e.target as HTMLElement | null

  if (props.handle) {
    if (!target?.closest(props.handle)) return
  } else if (target?.closest('input, textarea, select, button, a')) {
    return
  }

  cleanupPointerDrag()
  const itemEl = e.currentTarget as HTMLElement
  const rect = itemEl.getBoundingClientRect()
  activeDrag = {
    item,
    index,
    itemEl,
    rect,
    startX: e.clientX,
    startY: e.clientY,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
    started: false,
    previewEl: null
  }

  window.addEventListener('pointermove', onWindowPointerMove)
  window.addEventListener('pointerup', onWindowPointerUp)
  window.addEventListener('pointercancel', onWindowPointerCancel)
}

function onWindowPointerMove(e: PointerEvent) {
  if (!activeDrag) return

  if (!activeDrag.started) {
    const dx = e.clientX - activeDrag.startX
    const dy = e.clientY - activeDrag.startY
    if (Math.hypot(dx, dy) <= 4) return

    activeDrag.started = true
    draggingIndex.value = activeDrag.index
    activeDrag.previewEl = createFloatingPreview(activeDrag.itemEl, activeDrag.rect)
  }

  updateFloatingPosition(activeDrag.previewEl, e.clientX, e.clientY)

  const hitEl = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
  const listEl = hitEl?.closest('[data-sortable-id]') as HTMLElement | null
  const targetListId = listEl?.dataset.sortableId ?? null
  const targetHandler = targetListId ? getSortableList(targetListId) : undefined

  const canAccept = Boolean(
    targetHandler &&
      !targetHandler.isDisabled() &&
      (targetHandler.listId === listId || (props.group && targetHandler.getGroup() === props.group))
  )

  if (hoveredListId && hoveredListId !== (canAccept ? targetListId : null)) {
    getSortableList(hoveredListId)?.setDropIndicator(null, null, false)
  }

  if (!canAccept || !targetHandler) {
    hoveredListId = null
    hoveredIndex = null
    hoveredPos = null
    return
  }

  hoveredListId = targetHandler.listId
  const itemEl = hitEl?.closest('[data-sortable-index]') as HTMLElement | null
  if (itemEl && listEl?.contains(itemEl)) {
    const idx = Number(itemEl.dataset.sortableIndex)
    const pos = getPointDropPosition(e.clientX, e.clientY, itemEl, targetHandler.getOrientation())
    hoveredIndex = idx
    hoveredPos = pos
    targetHandler.setDropIndicator(idx, pos, true)
  } else {
    hoveredIndex = null
    hoveredPos = null
    targetHandler.setDropIndicator(null, null, true)
  }
}

function onWindowPointerUp() {
  if (activeDrag?.started && hoveredListId) {
    const targetHandler = getSortableList(hoveredListId)
    if (targetHandler) {
      if (targetHandler.listId === listId) {
        let toIndex =
          hoveredIndex !== null && hoveredPos !== null
            ? hoveredPos === 'after'
              ? hoveredIndex + 1
              : hoveredIndex
            : Math.max(0, props.modelValue.length - 1)
        if (hoveredIndex !== null && activeDrag.index < toIndex) {
          toIndex -= 1
        }
        if (toIndex !== activeDrag.index) {
          targetHandler.onReorder(activeDrag.index, toIndex)
        }
      } else {
        const toIndex =
          hoveredIndex !== null && hoveredPos !== null
            ? hoveredPos === 'after'
              ? hoveredIndex + 1
              : hoveredIndex
            : -1
        handleRemove(activeDrag.index)
        targetHandler.onReceive(activeDrag.item, activeDrag.index, toIndex, props.group)
      }
    }
  }
  cleanupPointerDrag()
}

function onWindowPointerCancel() {
  cleanupPointerDrag()
}

function cleanupPointerDrag() {
  window.removeEventListener('pointermove', onWindowPointerMove)
  window.removeEventListener('pointerup', onWindowPointerUp)
  window.removeEventListener('pointercancel', onWindowPointerCancel)

  if (hoveredListId) {
    getSortableList(hoveredListId)?.setDropIndicator(null, null, false)
  }
  if (activeDrag?.previewEl) {
    activeDrag.previewEl.remove()
  }

  activeDrag = null
  hoveredListId = null
  hoveredIndex = null
  hoveredPos = null
  draggingIndex.value = null
  setDropIndicator(null, null, false)
}

function onKeyDown(e: KeyboardEvent, index: number) {
  if (props.disabled) return
  const target = e.target as HTMLElement | null
  if (target?.closest('input, textarea, select, button, a')) return

  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault()
    if (grabbedIndex.value === index) {
      grabbedIndex.value = null
      liveAnnouncement.value = `Item dropped at position ${index + 1}`
    } else {
      grabbedIndex.value = index
      liveAnnouncement.value = `Item grabbed at position ${index + 1} of ${props.modelValue.length}`
    }
    return
  }

  if (e.key === 'Escape' && grabbedIndex.value !== null) {
    e.preventDefault()
    grabbedIndex.value = null
    liveAnnouncement.value = 'Reorder cancelled'
    return
  }

  const prevKey = props.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = props.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown'

  if ((e.key === prevKey || e.key === nextKey) && (grabbedIndex.value === index || e.altKey)) {
    e.preventDefault()
    const delta = e.key === prevKey ? -1 : 1
    const toIndex = index + delta
    if (toIndex < 0 || toIndex >= props.modelValue.length) return

    const next = reorderArray(props.modelValue, index, toIndex)
    if (grabbedIndex.value === index) {
      grabbedIndex.value = toIndex
    }
    emit('update:modelValue', next)
    emit('reorder', { value: next, fromIndex: index, toIndex })
    liveAnnouncement.value = `Moved item to position ${toIndex + 1} of ${next.length}`
    nextTick(() => {
      itemRefs.value[toIndex]?.focus()
    })
  }
}
</script>

<style scoped>
.sortable-list {
  position: relative;
  min-height: 56px;
  transition: box-shadow 0.15s ease, background-color 0.15s ease;
}

.sortable-list--horizontal {
  flex-direction: row;
  flex-wrap: wrap;
}

.sortable-list--drag-over {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--primary) 45%, transparent);
}

.sortable-list--disabled {
  opacity: 0.6;
  pointer-events: none;
}

.sortable-list__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.sortable-list__item {
  position: relative;
  padding: 10px 12px;
  user-select: none;
  transition: opacity 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
}

.sortable-list__item--no-handle {
  cursor: grab;
  touch-action: none;
}

.sortable-list__item--no-handle:active {
  cursor: grabbing;
}

.sortable-list--disabled .sortable-list__item {
  cursor: not-allowed;
}

.sortable-list__item--dragging {
  opacity: 0.32;
  border-style: dashed;
  border-color: var(--primary);
}

.sortable-list__item--grabbed {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

:global(.sortable-list__floating-preview) {
  box-shadow: 0 18px 38px rgba(15, 23, 42, 0.22);
  border: 1px solid color-mix(in srgb, var(--primary) 45%, var(--border, transparent));
  opacity: 0.96;
  will-change: transform;
}

.sortable-list--vertical .sortable-list__item--drop-before::before,
.sortable-list--vertical .sortable-list__item--drop-after::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 4px;
  height: 2px;
  background: var(--primary);
  border-radius: 2px;
  pointer-events: none;
}

.sortable-list--vertical .sortable-list__item--drop-before::before {
  top: -5px;
}

.sortable-list--vertical .sortable-list__item--drop-after::after {
  bottom: -5px;
}

.sortable-list--horizontal .sortable-list__item--drop-before::before,
.sortable-list--horizontal .sortable-list__item--drop-after::after {
  content: '';
  position: absolute;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: var(--primary);
  border-radius: 2px;
  pointer-events: none;
}

.sortable-list--horizontal .sortable-list__item--drop-before::before {
  left: -5px;
}

.sortable-list--horizontal .sortable-list__item--drop-after::after {
  right: -5px;
}

[data-theme="clay"] .sortable-list__item,
[data-theme="neo"] .sortable-list__item {
  box-shadow: var(--clay-shadow);
}

[data-theme="brutalism"] .sortable-list__item,
[data-theme="brutalism"] :global(.sortable-list__floating-preview) {
  border: var(--border-width, 3px) solid var(--border);
  box-shadow: var(--clay-shadow);
  border-radius: var(--radius, 0px);
}

[data-theme="glass"] .sortable-list__item:hover,
[data-theme="glass"] .sortable-list--drag-over {
  background: rgba(255, 255, 255, 0.08);
}
</style>
