<template>
  <div class="pick-list">
    <div class="pick-list__panel mfs-surface mfs-rounded mfs-shadow-card">
      <div v-if="sourceHeader" class="pick-list__header mfs-text">{{ sourceHeader }}</div>
      <ul class="pick-list__list mfs-inset mfs-rounded-md" role="listbox" aria-label="Source items">
        <li
          v-for="(item, index) in source"
          :key="getItemKey(item, index)"
          class="pick-list__item mfs-rounded-sm"
          :class="{ 'pick-list__item--selected': isSelected('source', index) }"
          role="option"
          :aria-selected="isSelected('source', index)"
          tabindex="0"
          @click="toggleSelection('source', index)"
          @keydown.enter.prevent="toggleSelection('source', index)"
          @keydown.space.prevent="toggleSelection('source', index)"
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
      <ul class="pick-list__list mfs-inset mfs-rounded-md" role="listbox" aria-label="Target items">
        <li
          v-for="(item, index) in target"
          :key="getItemKey(item, index)"
          class="pick-list__item mfs-rounded-sm"
          :class="{ 'pick-list__item--selected': isSelected('target', index) }"
          role="option"
          :aria-selected="isSelected('target', index)"
          tabindex="0"
          @click="toggleSelection('target', index)"
          @keydown.enter.prevent="toggleSelection('target', index)"
          @keydown.space.prevent="toggleSelection('target', index)"
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

const props = withDefaults(
  defineProps<{
    source: any[]
    target: any[]
    itemKey?: string
    sourceHeader?: string
    targetHeader?: string
  }>(),
  {
    itemKey: 'id',
    sourceHeader: 'Available',
    targetHeader: 'Selected'
  }
)

const emit = defineEmits<{
  'update:source': [value: any[]]
  'update:target': [value: any[]]
  transfer: [payload: { source: any[]; target: any[] }]
}>()

defineSlots<{
  item?: (props: { item: any; index: number; list: 'source' | 'target' }) => any
}>()

const selectedSource = ref<number[]>([])
const selectedTarget = ref<number[]>([])

function getItemKey(item: any, index: number): string | number {
  if (item && typeof item === 'object' && props.itemKey in item) {
    return item[props.itemKey]
  }
  return index
}

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
</script>

<style scoped>
.pick-list {
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
  gap: 4px;
}

.pick-list__item {
  padding: 9px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
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
