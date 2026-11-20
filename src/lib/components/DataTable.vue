<template>
  <div class="data-table mfs-surface mfs-rounded mfs-shadow-card" :class="`data-table--${responsiveMode}`">
    <div v-if="searchable || $slots.header" class="data-table__toolbar">
      <slot name="header" />
      <div v-if="searchable" class="data-table__search">
        <svg class="data-table__search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8" />
          <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
        <input
          type="search"
          class="data-table__search-input mfs-inset mfs-rounded-sm"
          :value="activeQuery"
          placeholder="Search..."
          aria-label="Search table"
          @input="onSearchInput"
        />
      </div>
    </div>

    <div class="data-table__wrap">
      <table class="data-table__table">
        <thead class="data-table__head">
          <tr>
            <th v-if="selectionType" class="data-table__th data-table__th--select mfs-text-muted">
              <input
                v-if="selectionType === 'multiple'"
                type="checkbox"
                class="data-table__checkbox"
                :checked="allSelected"
                :indeterminate="someSelected"
                aria-label="Select all rows"
                @change="toggleSelectAll"
              />
            </th>
            <th
              v-for="col in columns"
              :key="col.key"
              class="data-table__th mfs-text-muted"
              :class="[
                col.align ? `data-table__cell--${col.align}` : '',
                { 'data-table__th--sortable': col.sortable }
              ]"
              :style="col.width ? { width: col.width } : undefined"
              :aria-sort="getAriaSort(col)"
            >
              <button
                v-if="col.sortable"
                type="button"
                class="data-table__sort-btn"
                @click="toggleSort(col.key)"
              >
                <span>{{ col.label }}</span>
                <svg class="data-table__sort-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 3L11 6.5H5L8 3Z"
                    :fill="sortKey === col.key && sortOrder === 'asc' ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="1.2"
                  />
                  <path
                    d="M8 13L5 9.5H11L8 13Z"
                    :fill="sortKey === col.key && sortOrder === 'desc' ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="1.2"
                  />
                </svg>
              </button>
              <span v-else>{{ col.label }}</span>
            </th>
          </tr>
        </thead>

        <tbody class="data-table__body">
          <tr v-if="processedRows.length === 0" class="data-table__empty-row">
            <td :colspan="columns.length + (selectionType ? 1 : 0)" class="data-table__empty mfs-text-muted">
              <slot name="empty">
                <div class="data-table__empty-content">
                  <svg class="data-table__empty-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.6" />
                    <path d="M3 10H21" stroke="currentColor" stroke-width="1.6" />
                  </svg>
                  <span>{{ emptyText }}</span>
                </div>
              </slot>
            </td>
          </tr>

          <tr
            v-for="(row, rowIndex) in processedRows"
            v-else
            :key="getRowId(row, rowIndex)"
            class="data-table__row"
            :class="{ 'data-table__row--selected': isRowSelected(row, rowIndex) }"
            :aria-selected="selectionType ? isRowSelected(row, rowIndex) : undefined"
            @click="onRowClick(row, rowIndex)"
          >
            <td
              v-if="selectionType"
              class="data-table__td data-table__td--select"
              data-label="Select"
              @click.stop
            >
              <input
                :type="selectionType === 'single' ? 'radio' : 'checkbox'"
                class="data-table__checkbox"
                :name="selectionType === 'single' ? radioGroupName : undefined"
                :checked="isRowSelected(row, rowIndex)"
                :aria-label="`Select row ${rowIndex + 1}`"
                @change="toggleRowSelection(row, rowIndex)"
              />
            </td>
            <td
              v-for="col in columns"
              :key="col.key"
              class="data-table__td"
              :class="col.align ? `data-table__cell--${col.align}` : ''"
              :data-label="col.label"
            >
              <slot
                :name="`cell-${col.key}`"
                :row="row"
                :value="row[col.key]"
                :column="col"
                :index="rowIndex"
              >
                <span class="data-table__cell-value">{{ row[col.key] ?? '' }}</span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export type SortOrder = 'asc' | 'desc' | null

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[]
    rows: Record<string, any>[]
    rowKey?: string
    searchable?: boolean
    searchQuery?: string
    selectable?: boolean | 'single' | 'multiple'
    selection?: Record<string, any> | Record<string, any>[] | null
    responsiveMode?: 'card' | 'scroll'
    emptyText?: string
  }>(),
  {
    rowKey: 'id',
    searchable: false,
    searchQuery: '',
    selectable: false,
    selection: null,
    responsiveMode: 'card',
    emptyText: 'No data available'
  }
)

const emit = defineEmits<{
  'update:selection': [value: Record<string, any> | Record<string, any>[] | null]
  'update:searchQuery': [value: string]
  sort: [payload: { key: string; order: SortOrder }]
  'row-click': [row: Record<string, any>]
}>()

const radioGroupName = `dt-radio-${useId()}`
const localQuery = ref(props.searchQuery)
const sortKey = ref<string | null>(null)
const sortOrder = ref<SortOrder>(null)

watch(
  () => props.searchQuery,
  (val) => {
    localQuery.value = val
  }
)

const activeQuery = computed(() =>
  props.searchQuery !== '' ? props.searchQuery : localQuery.value
)

const selectionType = computed<'single' | 'multiple' | null>(() => {
  if (props.selectable === true || props.selectable === 'multiple') return 'multiple'
  if (props.selectable === 'single') return 'single'
  return null
})

function getRowId(row: Record<string, any>, index: number): string | number {
  const keyVal = row?.[props.rowKey]
  return keyVal !== undefined && keyVal !== null ? keyVal : index
}

function onSearchInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  localQuery.value = value
  emit('update:searchQuery', value)
}

function toggleSort(key: string) {
  if (sortKey.value !== key) {
    sortKey.value = key
    sortOrder.value = 'asc'
  } else if (sortOrder.value === 'asc') {
    sortOrder.value = 'desc'
  } else {
    sortKey.value = null
    sortOrder.value = null
  }
  emit('sort', { key, order: sortOrder.value })
}

function getAriaSort(col: DataTableColumn): 'ascending' | 'descending' | 'none' | undefined {
  if (!col.sortable) return undefined
  if (sortKey.value !== col.key || !sortOrder.value) return 'none'
  return sortOrder.value === 'asc' ? 'ascending' : 'descending'
}

const processedRows = computed(() => {
  const query = activeQuery.value.trim().toLowerCase()
  let result = props.rows

  if (query) {
    const keys = props.columns.map((c) => c.key)
    result = result.filter((row) =>
      keys.some((k) => String(row[k] ?? '').toLowerCase().includes(query))
    )
  }

  if (sortKey.value && sortOrder.value) {
    const key = sortKey.value
    const dir = sortOrder.value === 'asc' ? 1 : -1
    result = [...result].sort((a, b) => {
      const av = a[key]
      const bv = b[key]
      if (av == null && bv == null) return 0
      if (av == null) return -1 * dir
      if (bv == null) return 1 * dir
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
  }

  return result
})

function isRowSelected(row: Record<string, any>, index: number): boolean {
  if (!selectionType.value || !props.selection) return false
  const id = getRowId(row, index)
  if (selectionType.value === 'single') {
    if (Array.isArray(props.selection)) return false
    return getRowId(props.selection, -1) === id
  }
  return (
    Array.isArray(props.selection) &&
    props.selection.some((item, i) => getRowId(item, i) === id)
  )
}

const allSelected = computed(() => {
  if (selectionType.value !== 'multiple' || processedRows.value.length === 0) return false
  return processedRows.value.every((row, i) => isRowSelected(row, i))
})

const someSelected = computed(() => {
  if (selectionType.value !== 'multiple' || processedRows.value.length === 0) return false
  const count = processedRows.value.filter((row, i) => isRowSelected(row, i)).length
  return count > 0 && count < processedRows.value.length
})

function toggleRowSelection(row: Record<string, any>, index: number) {
  if (!selectionType.value) return
  if (selectionType.value === 'single') {
    emit('update:selection', row)
    return
  }
  const id = getRowId(row, index)
  const current = Array.isArray(props.selection) ? [...props.selection] : []
  const existingIdx = current.findIndex((item, i) => getRowId(item, i) === id)
  if (existingIdx >= 0) {
    current.splice(existingIdx, 1)
  } else {
    current.push(row)
  }
  emit('update:selection', current)
}

function toggleSelectAll() {
  if (selectionType.value !== 'multiple') return
  if (allSelected.value) {
    emit('update:selection', [])
  } else {
    emit('update:selection', [...processedRows.value])
  }
}

function onRowClick(row: Record<string, any>, index: number) {
  emit('row-click', row)
  if (selectionType.value) {
    toggleRowSelection(row, index)
  }
}
</script>

<style scoped>
.data-table {
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius, 16px);
  box-shadow: var(--card-shadow);
  border: 1px solid var(--border, transparent);
  backdrop-filter: var(--backdrop-blur, none);
  overflow: hidden;
}

.data-table__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.06));
}

.data-table__search {
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
  min-width: 200px;
  flex: 1 1 220px;
  max-width: 320px;
}

.data-table__search-icon {
  position: absolute;
  left: 12px;
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  pointer-events: none;
}

.data-table__search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  border-radius: var(--radius-sm, 10px);
  border: 1px solid var(--border, transparent);
  background: var(--surface-subtle);
  color: var(--text);
  box-shadow: var(--input-shadow);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.data-table__search-input:focus {
  border-color: var(--primary);
}

.data-table__wrap {
  width: 100%;
  overflow-x: auto;
}

.data-table__table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.data-table__th {
  padding: 12px 16px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  background: var(--surface-subtle);
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.06));
  white-space: nowrap;
}

.data-table__th--select,
.data-table__td--select {
  width: 44px;
  text-align: center;
}

.data-table__sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
  cursor: pointer;
  padding: 0;
}

.data-table__sort-btn:hover {
  color: var(--primary);
}

.data-table__sort-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.data-table__td {
  padding: 13px 16px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.05));
  vertical-align: middle;
}

.data-table__row {
  transition: background-color 0.15s ease;
}

.data-table__row:hover {
  background: var(--surface-subtle);
}

.data-table__row--selected {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

.data-table__row:last-child .data-table__td {
  border-bottom: none;
}

.data-table__cell--left {
  text-align: left;
}
.data-table__cell--center {
  text-align: center;
}
.data-table__cell--right {
  text-align: right;
}

.data-table__checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}

.data-table__empty {
  padding: 36px 16px;
  text-align: center;
  color: var(--text-muted);
}

.data-table__empty-content {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.data-table__empty-icon {
  width: 28px;
  height: 28px;
  opacity: 0.6;
}

/* Theme overrides */
[data-theme="clay"] .data-table__th {
  background: var(--surface-subtle);
}

[data-theme="glass"] .data-table__row:hover {
  background: rgba(255, 255, 255, 0.06);
}

[data-theme="neo"] .data-table__search-input {
  border-color: transparent;
}

/* Mobile Card Mode */
@media (max-width: 640px) {
  .data-table--card .data-table__head {
    display: none;
  }

  .data-table--card .data-table__table,
  .data-table--card .data-table__body,
  .data-table--card .data-table__row,
  .data-table--card .data-table__td {
    display: block;
    width: 100%;
  }

  .data-table--card .data-table__row {
    margin: 10px 12px;
    width: calc(100% - 24px);
    border-radius: var(--radius-md, 12px);
    background: var(--surface-subtle);
    box-shadow: var(--clay-shadow);
    border: 1px solid var(--border, transparent);
    overflow: hidden;
  }

  .data-table--card .data-table__td {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    text-align: right;
  }

  .data-table--card .data-table__td::before {
    content: attr(data-label);
    font-weight: 700;
    font-size: 0.78rem;
    text-transform: uppercase;
    color: var(--text-muted);
    text-align: left;
  }

  .data-table--card .data-table__td--select {
    width: 100%;
  }
}
</style>
