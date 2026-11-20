<template>
  <div class="data-view">
    <div class="data-view__header">
      <div class="data-view__header-left">
        <slot name="header" />
      </div>
      <div class="data-view__toggle mfs-inset mfs-rounded-md" role="group" aria-label="View layout">
        <button
          type="button"
          class="data-view__toggle-btn mfs-rounded-sm"
          :class="{ 'data-view__toggle-btn--active mfs-shadow': activeLayout === 'grid' }"
          :aria-pressed="activeLayout === 'grid'"
          aria-label="Grid layout"
          @click="setLayout('grid')"
        >
          <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6" />
            <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6" />
            <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6" />
            <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.6" />
          </svg>
        </button>
        <button
          type="button"
          class="data-view__toggle-btn mfs-rounded-sm"
          :class="{ 'data-view__toggle-btn--active mfs-shadow': activeLayout === 'list' }"
          :aria-pressed="activeLayout === 'list'"
          aria-label="List layout"
          @click="setLayout('list')"
        >
          <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M3 4.5H15M3 9H15M3 13.5H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="items.length === 0" class="data-view__empty mfs-card mfs-text-muted">
      <slot name="empty">
        <div class="data-view__empty-content">
          <svg class="data-view__empty-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.6" />
            <path d="M8 10H16M8 14H13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
          <span>{{ emptyText }}</span>
        </div>
      </slot>
    </div>

    <div
      v-else
      class="data-view__body"
      :class="`data-view__body--${activeLayout}`"
      :style="gridStyle"
    >
      <div
        v-for="(item, index) in items"
        :key="getItemKey(item, index)"
        class="data-view__item"
      >
        <slot
          v-if="activeLayout === 'grid' && $slots.grid"
          name="grid"
          :item="item"
          :index="index"
        />
        <slot
          v-else-if="activeLayout === 'list' && $slots.list"
          name="list"
          :item="item"
          :index="index"
        />
        <slot
          v-else
          :item="item"
          :index="index"
          :layout="activeLayout"
        >
          <div class="data-view__fallback-card mfs-card">{{ item }}</div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export type DataViewLayout = 'grid' | 'list'

const props = withDefaults(
  defineProps<{
    items: any[]
    layout?: DataViewLayout
    itemKey?: string
    columns?: number
    emptyText?: string
  }>(),
  {
    layout: 'grid',
    itemKey: 'id',
    emptyText: 'No items found'
  }
)

const emit = defineEmits<{
  'update:layout': [value: DataViewLayout]
}>()

const localLayout = ref<DataViewLayout>(props.layout)

watch(
  () => props.layout,
  (val) => {
    localLayout.value = val
  }
)

const activeLayout = computed(() => localLayout.value)

const gridStyle = computed(() => {
  if (activeLayout.value !== 'grid' || !props.columns) return undefined
  return {
    gridTemplateColumns: `repeat(${props.columns}, minmax(0, 1fr))`
  }
})

function setLayout(next: DataViewLayout) {
  if (localLayout.value === next) return
  localLayout.value = next
  emit('update:layout', next)
}

function getItemKey(item: any, index: number): string | number {
  if (item && typeof item === 'object' && props.itemKey in item) {
    return item[props.itemKey]
  }
  return index
}
</script>

<style scoped>
.data-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.data-view__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1 1 auto;
}

.data-view__toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: var(--radius-md, 12px);
  background: var(--surface-subtle);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--input-shadow);
}

.data-view__toggle-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: var(--radius-sm, 8px);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.data-view__toggle-btn svg {
  width: 18px;
  height: 18px;
}

.data-view__toggle-btn:hover {
  color: var(--text);
}

.data-view__toggle-btn--active {
  background: var(--primary);
  color: var(--primary-text);
  box-shadow: var(--clay-shadow);
}

.data-view__body--grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.data-view__body--list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-view__item {
  min-width: 0;
}

.data-view__fallback-card {
  padding: 16px;
  border-radius: var(--radius, 16px);
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border, transparent);
  backdrop-filter: var(--backdrop-blur, none);
}

.data-view__empty {
  padding: 40px 16px;
  text-align: center;
  color: var(--text-muted);
  background: var(--surface);
  border-radius: var(--radius, 16px);
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border, transparent);
  backdrop-filter: var(--backdrop-blur, none);
}

.data-view__empty-content {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.data-view__empty-icon {
  width: 28px;
  height: 28px;
  opacity: 0.6;
}

/* Theme overrides */
[data-theme="clay"] .data-view__toggle-btn--active {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .data-view__toggle {
  backdrop-filter: var(--backdrop-blur, blur(16px));
}

[data-theme="neo"] .data-view__toggle {
  box-shadow: var(--input-shadow);
}

[data-theme="neo"] .data-view__toggle-btn--active {
  box-shadow: var(--clay-shadow);
}

@media (max-width: 640px) {
  .data-view__body--grid {
    grid-template-columns: 1fr;
  }
}
</style>
