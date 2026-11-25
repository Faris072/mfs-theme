<template>
  <div class="data-table mfs-relative mfs-surface mfs-rounded mfs-shadow-card mfs-overflow-hidden" :class="`data-table--${responsiveMode}`">
    <div
      v-if="searchable || columnToggle || $slots.header"
      class="data-table__toolbar mfs-flex mfs-flex-wrap mfs-items-center mfs-justify-between mfs-gap-3 mfs-border-b"
    >
      <slot name="header" />
      <div
        v-if="searchable || columnToggle"
        class="data-table__toolbar-actions"
      >
        <div v-if="searchable" class="data-table__search mfs-relative mfs-flex mfs-items-center">
          <svg class="data-table__search-icon mfs-absolute mfs-text-muted" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.8" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
          </svg>
          <input
            type="search"
            class="data-table__search-input mfs-inset mfs-rounded-sm mfs-w-full mfs-text-sm mfs-outline-none"
            :value="activeQuery"
            placeholder="Search..."
            aria-label="Search table"
            @input="onSearchInput"
          />
        </div>

        <button
          v-if="columnToggle"
          ref="columnToggleBtnRef"
          type="button"
          class="data-table__col-btn mfs-focus-ring mfs-surface-subtle mfs-rounded-sm mfs-shadow-inset mfs-text-sm mfs-font-semibold mfs-cursor-pointer mfs-inline-flex mfs-items-center mfs-gap-2"
          :aria-expanded="columnMenuOpen"
          aria-haspopup="true"
          @click="toggleColumnMenu"
        >
          <svg class="data-table__col-icon" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <rect x="2.5" y="3.5" width="3.5" height="11" rx="1" stroke="currentColor" stroke-width="1.5" />
            <rect x="7.25" y="3.5" width="3.5" height="11" rx="1" stroke="currentColor" stroke-width="1.5" />
            <rect x="12" y="3.5" width="3.5" height="11" rx="1" stroke="currentColor" stroke-width="1.5" />
          </svg>
          <span>Columns</span>
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="columnToggle && columnMenuOpen"
        ref="columnMenuRef"
        class="data-table__col-menu mfs-surface mfs-rounded-md mfs-shadow-card"
        :style="columnMenuStyle"
        role="menu"
        aria-label="Toggle columns"
      >
        <div class="data-table__col-menu-title mfs-text-xs mfs-font-bold mfs-text-muted">
          Visible Columns
        </div>
        <label
          v-for="col in columns"
          :key="col.key"
          class="data-table__col-item mfs-flex mfs-items-center mfs-gap-2 mfs-text-sm mfs-cursor-pointer"
          :class="{ 'data-table__col-item--disabled': isColumnVisible(col.key) && activeVisibleKeys.length <= 1 }"
        >
          <Checkbox
            :model-value="isColumnVisible(col.key)"
            :disabled="isColumnVisible(col.key) && activeVisibleKeys.length <= 1"
            @update:model-value="toggleColumnVisibility(col.key)"
          />
          <span>{{ col.label }}</span>
        </label>
      </div>
    </Teleport>

    <div class="data-table__wrap mfs-w-full mfs-overflow-x-auto">
      <table class="data-table__table mfs-w-full mfs-text-left">
        <thead class="data-table__head">
          <tr>
            <th v-if="expandable" class="data-table__th data-table__th--expand mfs-text-muted" aria-label="Expand row" />
            <th v-if="selectionType" class="data-table__th data-table__th--select mfs-text-muted mfs-whitespace-nowrap">
              <Checkbox
                v-if="selectionType === 'multiple'"
                class="data-table__checkbox"
                :model-value="allSelected"
                :indeterminate="someSelected"
                aria-label="Select all rows"
                @click.stop
                @update:model-value="toggleSelectAll"
              />
            </th>
            <th
              v-for="col in displayedColumns"
              :key="col.key"
              class="data-table__th mfs-text-muted mfs-whitespace-nowrap"
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
                class="data-table__sort-btn mfs-focus-ring mfs-inline-flex mfs-items-center mfs-bg-transparent mfs-border-none mfs-cursor-pointer mfs-p-0"
                :class="{ 'data-table__sort-btn--active': getColumnSortOrder(col.key) !== null }"
                @click="toggleSort(col.key)"
              >
                <span>{{ col.label }}</span>
                <svg class="data-table__sort-icon mfs-shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 3L11 6.5H5L8 3Z"
                    :fill="getColumnSortOrder(col.key) === 'asc' ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="1.2"
                  />
                  <path
                    d="M8 13L5 9.5H11L8 13Z"
                    :fill="getColumnSortOrder(col.key) === 'desc' ? 'currentColor' : 'none'"
                    stroke="currentColor"
                    stroke-width="1.2"
                  />
                </svg>
                <span
                  v-if="sortMode === 'multiple' && getColumnSortPriority(col.key) !== null"
                  class="data-table__sort-badge"
                >
                  {{ getColumnSortPriority(col.key) }}
                </span>
              </button>
              <span v-else>{{ col.label }}</span>
            </th>
          </tr>
        </thead>

        <tbody class="data-table__body">
          <tr v-if="processedRows.length === 0" class="data-table__empty-row">
            <td :colspan="totalColCount" class="data-table__empty mfs-text-muted mfs-text-center">
              <slot name="empty">
                <div class="data-table__empty-content mfs-inline-flex mfs-flex-col mfs-items-center mfs-gap-2">
                  <svg class="data-table__empty-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.6" />
                    <path d="M3 10H21" stroke="currentColor" stroke-width="1.6" />
                  </svg>
                  <span>{{ emptyText }}</span>
                </div>
              </slot>
            </td>
          </tr>

          <template
            v-for="(row, rowIndex) in processedRows"
            v-else
            :key="getRowId(row, rowIndex)"
          >
            <tr
              class="data-table__row"
              :class="{
                'data-table__row--selected': isRowSelected(row, rowIndex),
                'data-table__row--expanded': expandable && isRowExpanded(row, rowIndex)
              }"
              :aria-selected="selectionType ? isRowSelected(row, rowIndex) : undefined"
              @click="onRowClick(row, rowIndex)"
            >
              <td
                v-if="expandable"
                class="data-table__td data-table__td--expand"
                data-label="Details"
                @click.stop
              >
                <button
                  type="button"
                  class="data-table__expand-btn mfs-focus-ring mfs-inline-flex mfs-items-center mfs-justify-center mfs-bg-transparent mfs-border-none mfs-cursor-pointer"
                  :aria-expanded="isRowExpanded(row, rowIndex)"
                  :aria-label="isRowExpanded(row, rowIndex) ? `Collapse row ${rowIndex + 1}` : `Expand row ${rowIndex + 1}`"
                  @click="toggleRowExpansion(row, rowIndex)"
                >
                  <svg
                    class="data-table__expand-icon"
                    :class="{ 'data-table__expand-icon--open': isRowExpanded(row, rowIndex) }"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </td>
              <td
                v-if="selectionType"
                class="data-table__td data-table__td--select"
                data-label="Select"
                @click.stop
              >
                <input
                  v-if="selectionType === 'single'"
                  type="radio"
                  class="data-table__checkbox mfs-cursor-pointer"
                  :name="radioGroupName"
                  :checked="isRowSelected(row, rowIndex)"
                  :aria-label="`Select row ${rowIndex + 1}`"
                  @change="toggleRowSelection(row, rowIndex)"
                />
                <Checkbox
                  v-else
                  class="data-table__checkbox"
                  :model-value="isRowSelected(row, rowIndex)"
                  :aria-label="`Select row ${rowIndex + 1}`"
                  @click.stop
                  @update:model-value="toggleRowSelection(row, rowIndex)"
                />
              </td>
              <td
                v-for="col in displayedColumns"
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

            <tr v-if="expandable && isRowExpanded(row, rowIndex)" class="data-table__expansion-row">
              <td :colspan="totalColCount" class="data-table__expansion-cell">
                <slot name="expansion" :row="row" :index="rowIndex" />
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      v-if="paginator"
      class="data-table__paginator mfs-flex mfs-items-center mfs-justify-between mfs-flex-wrap mfs-gap-3 mfs-pt-3 mfs-border-t"
    >
      <label
        v-if="rowsPerPageOptions.length"
        class="data-table__per-page mfs-inline-flex mfs-items-center mfs-gap-2 mfs-text-sm mfs-text-muted"
      >
        <span>Show</span>
        <select
          class="data-table__per-page-select mfs-surface mfs-rounded-md mfs-shadow-inset mfs-text"
          :value="effectiveRowsPerPage"
          :disabled="loading"
          aria-label="Rows per page"
          @change="onRowsPerPageChange"
        >
          <option v-for="opt in rowsPerPageOptions" :key="opt" :value="opt">
            {{ opt }}
          </option>
        </select>
        <span>per page</span>
      </label>

      <Pagination
        :model-value="currentPage"
        :total="effectiveTotalRecords"
        :per-page="effectiveRowsPerPage"
        :per-page-options="[]"
        :loading="loading"
        @update:model-value="onPageChange"
      />
    </div>

    <div v-if="loading" class="mfs-loading-overlay" aria-busy="true">
      <slot name="loading">
        <span class="mfs-spinner" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'
import Checkbox from './Checkbox.vue'
import Pagination from './Pagination.vue'

export interface DataTableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export type SortOrder = 'asc' | 'desc' | null

export interface DataTableSortMeta {
  key: string
  order: 'asc' | 'desc'
}

const props = withDefaults(
  defineProps<{
    columns: DataTableColumn[]
    rows?: Record<string, any>[] | number
    value?: Record<string, any>[]
    rowKey?: string
    searchable?: boolean
    searchQuery?: string
    selectable?: boolean | 'single' | 'multiple'
    selection?: Record<string, unknown> | Record<string, unknown>[] | null
    responsiveMode?: 'card' | 'scroll'
    emptyText?: string
    loading?: boolean
    lazy?: boolean
    paginator?: boolean
    totalRecords?: number
    rowsPerPage?: number
    rowsPerPageOptions?: number[]
    page?: number
    first?: number
    sortMode?: 'single' | 'multiple'
    multiSortMeta?: DataTableSortMeta[]
    expandable?: boolean
    expandedRows?: Record<string, unknown>[]
    columnToggle?: boolean
    visibleColumns?: string[]
  }>(),
  {
    rowKey: 'id',
    searchable: false,
    searchQuery: '',
    selectable: false,
    selection: null,
    responsiveMode: 'card',
    emptyText: 'No data available',
    loading: false,
    lazy: false,
    paginator: false,
    rowsPerPageOptions: () => [5, 10, 20, 50],
    first: 0,
    sortMode: 'single',
    expandable: false,
    columnToggle: false
  }
)

const emit = defineEmits<{
  'update:selection': [value: Record<string, unknown> | Record<string, unknown>[] | null]
  'update:searchQuery': [value: string]
  'update:page': [page: number]
  'update:rows': [rows: number]
  'update:rowsPerPage': [rowsPerPage: number]
  'update:first': [first: number]
  'update:multiSortMeta': [meta: DataTableSortMeta[]]
  'update:expandedRows': [rows: Record<string, unknown>[]]
  'update:visibleColumns': [keys: string[]]
  page: [payload: { page: number; first: number; rows: number; pageCount: number; rowsPerPage?: number }]
  sort: [payload: { key: string; order: SortOrder; multiSortMeta?: DataTableSortMeta[] }]
  filter: [query: string]
  'row-click': [row: Record<string, unknown>]
  'row-expand': [row: Record<string, unknown>]
  'row-collapse': [row: Record<string, unknown>]
}>()

const radioGroupName = `dt-radio-${useId()}`
const localQuery = ref(props.searchQuery)
const sortKey = ref<string | null>(null)
const sortOrder = ref<SortOrder>(null)
const internalMultiSort = ref<DataTableSortMeta[]>(
  props.multiSortMeta ? props.multiSortMeta.map((item) => ({ ...item })) : []
)

watch(
  () => props.multiSortMeta,
  (val) => {
    internalMultiSort.value = val ? val.map((item) => ({ ...item })) : []
  },
  { deep: true }
)

const activeMultiSort = computed<DataTableSortMeta[]>(() =>
  props.multiSortMeta ?? internalMultiSort.value
)

const sourceRows = computed<Record<string, any>[]>(() =>
  props.value ?? (Array.isArray(props.rows) ? props.rows : [])
)

const localRowsPerPage = ref<number>(
  typeof props.rows === 'number' ? props.rows : (props.rowsPerPage ?? 10)
)

watch(
  () => props.rows,
  (val) => {
    if (typeof val === 'number') {
      localRowsPerPage.value = val
    }
  }
)

watch(
  () => props.rowsPerPage,
  (val) => {
    if (val !== undefined) {
      localRowsPerPage.value = val
    }
  }
)

const effectiveRowsPerPage = computed<number>(() =>
  Math.max(1, typeof props.rows === 'number' ? props.rows : (props.rowsPerPage ?? localRowsPerPage.value))
)

const localPage = ref<number>(
  props.page !== undefined
    ? Math.max(1, props.page)
    : props.first > 0
      ? Math.floor(props.first / effectiveRowsPerPage.value) + 1
      : 1
)

watch(
  () => props.page,
  (val) => {
    if (val !== undefined) {
      localPage.value = Math.max(1, val)
    }
  }
)

watch(
  () => props.first,
  (val) => {
    if (val !== undefined && props.page === undefined) {
      localPage.value = Math.floor(Math.max(0, val) / effectiveRowsPerPage.value) + 1
    }
  }
)

watch(
  () => props.searchQuery,
  (val) => {
    localQuery.value = val
  }
)

const activeQuery = computed(() =>
  props.searchQuery !== '' ? props.searchQuery : localQuery.value
)

watch(activeQuery, () => {
  if (!props.lazy && props.paginator && currentPage.value !== 1) {
    localPage.value = 1
    emit('update:page', 1)
    emit('update:first', 0)
  }
})

const selectionType = computed<'single' | 'multiple' | null>(() => {
  if (props.selectable === true || props.selectable === 'multiple') return 'multiple'
  if (props.selectable === 'single') return 'single'
  return null
})

function getRowId(row: Record<string, unknown>, index: number): string | number {
  const keyVal = row?.[props.rowKey]
  return typeof keyVal === 'string' || typeof keyVal === 'number' ? keyVal : index
}

function onSearchInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  localQuery.value = value
  emit('update:searchQuery', value)
  emit('filter', value)
}

function getColumnSortOrder(key: string): SortOrder {
  if (props.sortMode === 'multiple') {
    const entry = activeMultiSort.value.find((item) => item.key === key)
    return entry ? entry.order : null
  }
  return sortKey.value === key ? sortOrder.value : null
}

function getColumnSortPriority(key: string): number | null {
  if (props.sortMode !== 'multiple' || activeMultiSort.value.length === 0) return null
  const idx = activeMultiSort.value.findIndex((item) => item.key === key)
  return idx >= 0 ? idx + 1 : null
}

function toggleSort(key: string) {
  if (props.sortMode === 'multiple') {
    const nextMeta = activeMultiSort.value.map((item) => ({ ...item }))
    const existingIdx = nextMeta.findIndex((item) => item.key === key)
    let nextOrder: SortOrder = 'asc'

    if (existingIdx === -1) {
      nextMeta.push({ key, order: 'asc' })
      nextOrder = 'asc'
    } else if (nextMeta[existingIdx].order === 'asc') {
      nextMeta[existingIdx].order = 'desc'
      nextOrder = 'desc'
    } else {
      nextMeta.splice(existingIdx, 1)
      nextOrder = null
    }

    internalMultiSort.value = nextMeta
    emit('update:multiSortMeta', nextMeta)
    emit('sort', { key, order: nextOrder, multiSortMeta: nextMeta })
    return
  }

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
  const order = getColumnSortOrder(col.key)
  if (!order) return 'none'
  return order === 'asc' ? 'ascending' : 'descending'
}

function compareValues(av: unknown, bv: unknown, dir: 1 | -1): number {
  if (av == null && bv == null) return 0
  if (av == null) return -1 * dir
  if (bv == null) return 1 * dir
  if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
  return String(av).localeCompare(String(bv)) * dir
}

const filteredAndSortedRows = computed(() => {
  if (props.lazy) {
    return sourceRows.value
  }

  const query = activeQuery.value.trim().toLowerCase()
  let result = sourceRows.value

  if (query) {
    const keys = props.columns.map((c) => c.key)
    result = result.filter((row) =>
      keys.some((k) => String(row[k] ?? '').toLowerCase().includes(query))
    )
  }

  if (props.sortMode === 'multiple') {
    if (activeMultiSort.value.length > 0) {
      const metas = activeMultiSort.value
      result = [...result].sort((a, b) => {
        for (const meta of metas) {
          const dir: 1 | -1 = meta.order === 'asc' ? 1 : -1
          const cmp = compareValues(a[meta.key], b[meta.key], dir)
          if (cmp !== 0) return cmp
        }
        return 0
      })
    }
  } else if (sortKey.value && sortOrder.value) {
    const key = sortKey.value
    const dir: 1 | -1 = sortOrder.value === 'asc' ? 1 : -1
    result = [...result].sort((a, b) => compareValues(a[key], b[key], dir))
  }

  return result
})

const effectiveTotalRecords = computed(() =>
  props.lazy
    ? (props.totalRecords ?? sourceRows.value.length)
    : (props.totalRecords ?? filteredAndSortedRows.value.length)
)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(effectiveTotalRecords.value / effectiveRowsPerPage.value))
)

const currentPage = computed(() => {
  const raw = props.page !== undefined ? props.page : localPage.value
  return Math.min(Math.max(1, raw), totalPages.value)
})

const processedRows = computed(() => {
  if (props.lazy || !props.paginator) {
    return filteredAndSortedRows.value
  }
  const start = (currentPage.value - 1) * effectiveRowsPerPage.value
  return filteredAndSortedRows.value.slice(start, start + effectiveRowsPerPage.value)
})

function onPageChange(nextPage: number) {
  const rows = effectiveRowsPerPage.value
  const pageCount = totalPages.value
  const clamped = Math.min(Math.max(1, nextPage), pageCount)
  const first = (clamped - 1) * rows
  localPage.value = clamped
  emit('update:page', clamped)
  emit('update:first', first)
  emit('page', { page: clamped, first, rows, pageCount, rowsPerPage: rows })
}

function onRowsPerPageChange(e: Event) {
  if (props.loading) return
  const nextRows = Number((e.target as HTMLSelectElement).value)
  if (!Number.isFinite(nextRows) || nextRows <= 0) return
  localRowsPerPage.value = nextRows
  const nextPageCount = Math.max(1, Math.ceil(effectiveTotalRecords.value / nextRows))
  const nextPage = Math.min(currentPage.value, nextPageCount)
  const nextFirst = (nextPage - 1) * nextRows
  localPage.value = nextPage
  emit('update:rows', nextRows)
  emit('update:rowsPerPage', nextRows)
  emit('update:page', nextPage)
  emit('update:first', nextFirst)
  emit('page', {
    page: nextPage,
    first: nextFirst,
    rows: nextRows,
    pageCount: nextPageCount,
    rowsPerPage: nextRows
  })
}

function isRowSelected(row: Record<string, unknown>, index: number): boolean {
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

function toggleRowSelection(row: Record<string, unknown>, index: number) {
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

function onRowClick(row: Record<string, unknown>, index: number) {
  emit('row-click', row)
  if (selectionType.value) {
    toggleRowSelection(row, index)
  }
}

// ---------------------------------------------------------------------------
// Row Expansion
// ---------------------------------------------------------------------------
const internalExpandedRows = ref<Record<string, unknown>[]>(
  props.expandedRows ? [...props.expandedRows] : []
)

watch(
  () => props.expandedRows,
  (val) => {
    internalExpandedRows.value = val ? [...val] : []
  },
  { deep: true }
)

const activeExpandedRows = computed<Record<string, unknown>[]>(() =>
  props.expandedRows ?? internalExpandedRows.value
)

function isRowExpanded(row: Record<string, unknown>, index: number): boolean {
  if (!props.expandable) return false
  const id = getRowId(row, index)
  return activeExpandedRows.value.some((item, i) => getRowId(item, i) === id)
}

function toggleRowExpansion(row: Record<string, unknown>, index: number) {
  if (!props.expandable) return
  const id = getRowId(row, index)
  const next = [...activeExpandedRows.value]
  const existingIdx = next.findIndex((item, i) => getRowId(item, i) === id)
  if (existingIdx >= 0) {
    next.splice(existingIdx, 1)
    internalExpandedRows.value = next
    emit('update:expandedRows', next)
    emit('row-collapse', row)
  } else {
    next.push(row)
    internalExpandedRows.value = next
    emit('update:expandedRows', next)
    emit('row-expand', row)
  }
}

// ---------------------------------------------------------------------------
// Column Visibility Toggle
// ---------------------------------------------------------------------------
const internalVisibleColumns = ref<string[]>(
  props.visibleColumns ? [...props.visibleColumns] : props.columns.map((c) => c.key)
)

watch(
  () => props.visibleColumns,
  (val) => {
    if (val !== undefined) {
      internalVisibleColumns.value = [...val]
    }
  },
  { deep: true }
)

watch(
  () => props.columns,
  (cols) => {
    if (props.visibleColumns === undefined) {
      internalVisibleColumns.value = cols.map((c) => c.key)
    }
  }
)

const activeVisibleKeys = computed<string[]>(() =>
  props.visibleColumns ?? internalVisibleColumns.value
)

const displayedColumns = computed<DataTableColumn[]>(() => {
  if (!props.columnToggle) return props.columns
  const visibleSet = new Set(activeVisibleKeys.value)
  return props.columns.filter((col) => visibleSet.has(col.key))
})

const totalColCount = computed(() =>
  displayedColumns.value.length + (selectionType.value ? 1 : 0) + (props.expandable ? 1 : 0)
)

function isColumnVisible(key: string): boolean {
  return activeVisibleKeys.value.includes(key)
}

function toggleColumnVisibility(key: string) {
  const current = [...activeVisibleKeys.value]
  const idx = current.indexOf(key)
  if (idx >= 0) {
    if (current.length <= 1) return
    current.splice(idx, 1)
  } else {
    const orderedKeys = props.columns.map((c) => c.key)
    current.push(key)
    current.sort((a, b) => orderedKeys.indexOf(a) - orderedKeys.indexOf(b))
  }
  internalVisibleColumns.value = current
  emit('update:visibleColumns', current)
}

const columnMenuOpen = ref(false)
const columnToggleBtnRef = ref<HTMLElement | null>(null)
const columnMenuRef = ref<HTMLElement | null>(null)
const columnMenuPos = ref({ top: 0, left: 0 })

const columnMenuStyle = computed(() => ({
  position: 'fixed' as const,
  top: `${columnMenuPos.value.top}px`,
  left: `${columnMenuPos.value.left}px`,
  zIndex: 9999
}))

function updateColumnMenuPosition() {
  const btn = columnToggleBtnRef.value
  if (!btn) return
  const rect = btn.getBoundingClientRect()
  const menuWidth = columnMenuRef.value?.offsetWidth || 190
  const left = Math.max(8, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8))
  const top = rect.bottom + 6
  columnMenuPos.value = { top, left }
}

function onDocumentClick(e: MouseEvent) {
  const target = e.target as Node | null
  if (!target) return
  if (columnToggleBtnRef.value?.contains(target) || columnMenuRef.value?.contains(target)) {
    return
  }
  closeColumnMenu()
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeColumnMenu()
  }
}

function openColumnMenu() {
  columnMenuOpen.value = true
  nextTick(() => {
    updateColumnMenuPosition()
    document.addEventListener('mousedown', onDocumentClick)
    document.addEventListener('keydown', onDocumentKeydown)
    window.addEventListener('resize', updateColumnMenuPosition)
    window.addEventListener('scroll', updateColumnMenuPosition, true)
  })
}

function closeColumnMenu() {
  columnMenuOpen.value = false
  document.removeEventListener('mousedown', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
  window.removeEventListener('resize', updateColumnMenuPosition)
  window.removeEventListener('scroll', updateColumnMenuPosition, true)
}

function toggleColumnMenu() {
  if (columnMenuOpen.value) {
    closeColumnMenu()
  } else {
    openColumnMenu()
  }
}

onBeforeUnmount(() => {
  closeColumnMenu()
})
</script>

<style scoped>
.data-table__toolbar {
  padding: 14px 18px;
}

.data-table__toolbar-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: nowrap;
}

.data-table__search {
  width: 220px;
  flex: 0 0 auto;
}

.data-table__col-btn {
  flex-shrink: 0;
  white-space: nowrap;
  padding: 8px 12px;
  border: var(--border-width, 1px) solid var(--border, transparent);
  color: var(--text);
  transition: border-color 0.2s ease, color 0.2s ease;
}

.data-table__col-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.data-table__col-icon {
  width: 16px;
  height: 16px;
}

.data-table__col-menu {
  min-width: 190px;
  padding: 8px;
  border: var(--border-width, 1px) solid var(--border, rgba(0, 0, 0, 0.08));
  background: var(--surface);
  color: var(--text);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.data-table__col-menu-title {
  padding: 4px 8px 6px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.06));
  margin-bottom: 4px;
}

.data-table__col-item {
  padding: 6px 8px;
  border-radius: var(--radius-sm, 8px);
  transition: background-color 0.15s ease;
}

.data-table__col-item:hover {
  background: var(--surface-subtle);
}

.data-table__col-item--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.data-table__search-icon {
  left: 12px;
  width: 16px;
  height: 16px;
  pointer-events: none;
}

.data-table__search-input {
  padding: 9px 12px 9px 36px;
  transition: border-color 0.2s ease;
}

.data-table__search-input:focus {
  border-color: var(--primary);
}

.data-table__table {
  border-collapse: collapse;
  font-size: 0.9rem;
}

.data-table__th {
  padding: 12px 16px;
  font-weight: 700;
  font-size: 0.8rem;
  background: var(--surface-subtle);
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.06));
}

.data-table__th--expand,
.data-table__td--expand {
  width: 44px;
  text-align: center;
}

.data-table__expand-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm, 8px);
  color: var(--text-muted);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.data-table__expand-btn:hover {
  background: var(--surface-subtle);
  color: var(--primary);
}

.data-table__expand-icon {
  width: 15px;
  height: 15px;
  transition: transform 0.2s ease;
}

.data-table__expand-icon--open {
  transform: rotate(90deg);
}

.data-table__expansion-row {
  background: var(--surface-subtle);
}

.data-table__expansion-cell {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.06));
}

.data-table__th--select,
.data-table__td--select {
  width: 44px;
  text-align: center;
}

.data-table__sort-btn {
  gap: 6px;
  color: inherit;
  font: inherit;
  text-transform: inherit;
  letter-spacing: inherit;
}

.data-table__sort-btn:hover,
.data-table__sort-btn--active {
  color: var(--primary);
}

.data-table__sort-icon {
  width: 14px;
  height: 14px;
}

.data-table__sort-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 9999px;
  background: var(--primary);
  color: var(--primary-contrast, #fff);
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
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
  vertical-align: middle;
}

input.data-table__checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
}

.data-table__empty {
  padding: 36px 16px;
}

.data-table__empty-icon {
  width: 28px;
  height: 28px;
  opacity: 0.6;
}

.data-table__paginator {
  padding: 12px 18px 14px;
}

.data-table__per-page-select {
  height: 36px;
  padding: 0 10px;
  border: var(--border-width, 1px) solid var(--border, transparent);
  font-family: inherit;
  font-size: 0.88rem;
  outline: none;
  cursor: pointer;
}

.data-table__per-page-select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  .data-table__toolbar-actions {
    width: 100%;
    flex-wrap: wrap;
  }

  .data-table__search {
    width: auto;
    min-width: 160px;
    flex: 1 1 180px;
  }

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
    border: var(--border-width, 1px) solid var(--border, transparent);
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
    color: var(--text-muted);
    text-align: left;
  }

  .data-table--card .data-table__td--select,
  .data-table--card .data-table__td--expand {
    width: 100%;
  }

  .data-table--card .data-table__expansion-row {
    display: block;
    margin: -6px 12px 10px;
    width: calc(100% - 24px);
    border-radius: var(--radius-md, 12px);
    background: var(--surface-subtle);
    border: var(--border-width, 1px) solid var(--border, transparent);
    overflow: hidden;
  }

  .data-table--card .data-table__expansion-cell {
    display: block;
    width: 100%;
    padding: 12px 14px;
    text-align: left;
    border-bottom: none;
  }
}
</style>
