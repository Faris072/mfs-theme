<template>
  <div class="order-list mfs-surface mfs-rounded mfs-shadow-card">
    <div v-if="header || $slots.header" class="order-list__header">
      <slot name="header">
        <span class="order-list__title mfs-text">{{ header }}</span>
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
        <li
          v-for="(item, index) in modelValue"
          :key="getItemKey(item, index)"
          class="order-list__item mfs-rounded-sm"
          :class="{ 'order-list__item--selected': selectedIndex === index }"
          role="option"
          :aria-selected="selectedIndex === index"
          tabindex="0"
          @click="selectedIndex = index"
          @keydown.enter.prevent="selectedIndex = index"
          @keydown.space.prevent="selectedIndex = index"
        >
          <slot name="item" :item="item" :index="index" :selected="selectedIndex === index">
            <span class="mfs-text">{{ item }}</span>
          </slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: any[]
    itemKey?: string
    header?: string
  }>(),
  {
    itemKey: 'id',
    header: ''
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
  reorder: [value: any[]]
}>()

defineSlots<{
  header?: () => any
  item?: (props: { item: any; index: number; selected: boolean }) => any
}>()

const selectedIndex = ref<number | null>(null)

const canMoveUp = computed(
  () => selectedIndex.value !== null && selectedIndex.value > 0
)

const canMoveDown = computed(
  () => selectedIndex.value !== null && selectedIndex.value < props.modelValue.length - 1
)

function getItemKey(item: any, index: number): string | number {
  if (item && typeof item === 'object' && props.itemKey in item) {
    return item[props.itemKey]
  }
  return index
}

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
</script>

<style scoped>
.order-list {
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
  gap: 4px;
}

.order-list__item {
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
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
