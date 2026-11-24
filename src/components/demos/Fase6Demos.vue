<template>
  <!-- DataTable -->
  <ComponentPreview
    v-if="activeSlug === 'data-table'"
    title="Interactive DataTable"
    description="Sort columns, filter rows via live search, select single or multiple rows, and switch mobile responsive mode between stacked cards and horizontal scroll."
    :code="dataTableCode"
    :code-tabs="dataTableCodeTabs"
    :api="dataTableApi"
  >
    <div class="mfs-stack">
      <Alert severity="info" title="Client-Side vs Server-Side (Lazy)">
        <div class="mfs-stack mfs-gap-1 mfs-text-xs">
          <span>
            <strong>Client-Side (default):</strong> Pass the full <code>:rows</code> array; <code>DataTable</code> handles <code>searchable</code>, <code>paginator</code>, and column sorting automatically.
          </span>
          <span>
            <strong>Server-Side (<code>lazy</code>):</strong> Set <code>:lazy="true"</code> and <code>:total-records="total"</code>, then fetch new slices on <code>@page</code>, <code>@sort</code>, and debounced <code>@update:search-query</code> while binding <code>:loading</code>.
          </span>
        </div>
      </Alert>

      <div class="mfs-row mfs-justify-between demo-controls">
        <div class="mfs-inline-flex mfs-flex-wrap mfs-items-center mfs-gap-2" role="group" aria-label="Responsive mode">
          <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">Mobile Mode:</span>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
            :class="{ 'is-active': tableResponsiveMode === 'card' }"
            @click="tableResponsiveMode = 'card'"
          >
            Card
          </button>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
            :class="{ 'is-active': tableResponsiveMode === 'scroll' }"
            @click="tableResponsiveMode = 'scroll'"
          >
            Scroll
          </button>
        </div>

        <div class="mfs-inline-flex mfs-flex-wrap mfs-items-center mfs-gap-2" role="group" aria-label="Selection mode">
          <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">Selection:</span>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
            :class="{ 'is-active': tableSelectionMode === 'multiple' }"
            @click="setTableSelectionMode('multiple')"
          >
            Multiple
          </button>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
            :class="{ 'is-active': tableSelectionMode === 'single' }"
            @click="setTableSelectionMode('single')"
          >
            Single
          </button>
        </div>

        <div class="mfs-inline-flex mfs-flex-wrap mfs-items-center mfs-gap-2" role="group" aria-label="Sort mode">
          <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">Sort Mode:</span>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
            :class="{ 'is-active': tableSortMode === 'single' }"
            @click="setTableSortMode('single')"
          >
            Single
          </button>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
            :class="{ 'is-active': tableSortMode === 'multiple' }"
            @click="setTableSortMode('multiple')"
          >
            Multiple
          </button>
        </div>
      </div>

      <DataTable
        v-model:selection="tableSelection"
        v-model:search-query="tableQuery"
        v-model:page="tablePage"
        v-model:rows-per-page="tableRowsPerPage"
        v-model:multi-sort-meta="tableMultiSortMeta"
        :columns="tableColumns"
        :rows="tableRows"
        :rows-per-page-options="[5, 10, 20]"
        :selectable="tableSelectionMode"
        :responsive-mode="tableResponsiveMode"
        :sort-mode="tableSortMode"
        paginator
        searchable
        @sort="onTableSort"
      >
        <template #header>
          <span class="mfs-text-base mfs-font-bold mfs-text">Team Directory ({{ tableRows.length }})</span>
        </template>
        <template #cell-status="{ value }">
          <Badge :variant="statusVariant(value)">{{ value }}</Badge>
        </template>
      </DataTable>

      <div class="mfs-row mfs-gap-4 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-text-muted demo-status-bar">
        <span>
          <strong>Selected:</strong> {{ selectedSummary }}
        </span>
        <span>
          <strong>Page:</strong> {{ tablePage }} ({{ tableRowsPerPage }}/page)
        </span>
        <span v-if="lastSort">
          <strong>Sort:</strong> {{ lastSort }}
        </span>
      </div>
    </div>
  </ComponentPreview>

  <!-- DataView -->
  <ComponentPreview
    v-else-if="activeSlug === 'data-view'"
    title="Interactive DataView"
    description="Toggle seamlessly between responsive Grid and List layouts using custom #grid and #list slots."
    :code="dataViewCode"
    :code-tabs="dataViewCodeTabs"
    :api="dataViewApi"
  >
    <div class="mfs-stack">
      <DataView
        v-model:layout="viewLayout"
        :items="filteredCatalog"
        :columns="viewLayout === 'grid' ? viewColumns : undefined"
      >
        <template #header>
          <div class="mfs-row mfs-justify-between demo-controls">
            <span class="mfs-text-base mfs-font-bold mfs-text">Theme Presets ({{ filteredCatalog.length }})</span>
            <div v-if="viewLayout === 'grid'" class="mfs-inline-flex mfs-flex-wrap mfs-items-center mfs-gap-2" role="group" aria-label="Grid columns">
              <button
                type="button"
                class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
                :class="{ 'is-active': viewColumns === 2 }"
                @click="viewColumns = 2"
              >
                2 Cols
              </button>
              <button
                type="button"
                class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
                :class="{ 'is-active': viewColumns === 3 }"
                @click="viewColumns = 3"
              >
                3 Cols
              </button>
            </div>
          </div>
        </template>

        <template #grid="{ item }">
          <article class="mfs-p-4 mfs-rounded-md mfs-surface-subtle mfs-interactive mfs-flex mfs-flex-col mfs-gap-3 dv-card--grid">
            <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-2">
              <span class="dv-card__icon" aria-hidden="true">{{ item.icon }}</span>
              <Badge :variant="item.badgeVariant">{{ item.tag }}</Badge>
            </div>
            <h4 class="mfs-m-0 mfs-text-base mfs-font-bold mfs-text">{{ item.name }}</h4>
            <p class="mfs-m-0 mfs-text-sm mfs-text-muted">{{ item.description }}</p>
          </article>
        </template>

        <template #list="{ item }">
          <article class="mfs-p-4 mfs-rounded-md mfs-surface-subtle mfs-interactive mfs-flex mfs-items-start mfs-gap-3">
            <span class="dv-card__icon" aria-hidden="true">{{ item.icon }}</span>
            <div class="mfs-flex-1 mfs-flex mfs-flex-col mfs-gap-1 dv-card__body">
              <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-2">
                <h4 class="mfs-m-0 mfs-text-base mfs-font-bold mfs-text">{{ item.name }}</h4>
                <Badge :variant="item.badgeVariant">{{ item.tag }}</Badge>
              </div>
              <p class="mfs-m-0 mfs-text-sm mfs-text-muted">{{ item.description }}</p>
            </div>
          </article>
        </template>
      </DataView>
    </div>
  </ComponentPreview>

  <!-- Tree -->
  <ComponentPreview
    v-else-if="activeSlug === 'tree'"
    title="Interactive Tree"
    description="Expand or collapse hierarchical nodes, navigate with arrow keys, and switch between checkbox and single selection modes."
    :code="treeCode"
    :code-tabs="treeCodeTabs"
    :api="treeApi"
  >
    <div class="mfs-stack">
      <div class="mfs-row mfs-justify-between demo-controls">
        <div class="mfs-inline-flex mfs-flex-wrap mfs-items-center mfs-gap-2">
          <button type="button" class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill" @click="expandAllTree">Expand All</button>
          <button type="button" class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill" @click="treeExpanded = []">Collapse All</button>
        </div>

        <div class="mfs-inline-flex mfs-flex-wrap mfs-items-center mfs-gap-2" role="group" aria-label="Tree selection mode">
          <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">Mode:</span>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
            :class="{ 'is-active': treeSelectionMode === 'checkbox' }"
            @click="setTreeMode('checkbox')"
          >
            Checkbox
          </button>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
            :class="{ 'is-active': treeSelectionMode === 'single' }"
            @click="setTreeMode('single')"
          >
            Single
          </button>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-shadow-inset mfs-interactive demo-pill"
            :class="{ 'is-active': treeSelectionMode === 'none' }"
            @click="setTreeMode('none')"
          >
            None
          </button>
        </div>
      </div>

      <div class="mfs-p-3 mfs-rounded-md mfs-surface-subtle mfs-shadow-inset">
        <Tree
          v-model:expanded-keys="treeExpanded"
          v-model:selected-keys="treeSelected"
          :nodes="treeNodes"
          :selection-mode="treeSelectionMode"
          @node-click="onTreeNodeClick"
        />
      </div>

      <div class="mfs-row mfs-gap-4 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-text-muted demo-status-bar">
        <span>
          <strong>Selected Keys:</strong>
          {{ treeSelected.length ? treeSelected.join(', ') : 'None' }}
        </span>
        <span v-if="lastClickedNode">
          <strong>Last Clicked:</strong> {{ lastClickedNode }}
        </span>
      </div>
    </div>
  </ComponentPreview>

  <!-- Column -->
  <ComponentPreview
    v-else-if="activeSlug === 'column'"
    title="Column"
    description="Declarative DataTable column definition supporting sorting, custom body/header slots, and visibility toggling."
    :code="columnCode"
    :api="columnApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row">
        <Button size="sm" variant="surface" @click="hideRoleColumn = !hideRoleColumn">
          {{ hideRoleColumn ? 'Show Role Column' : 'Hide Role Column' }}
        </Button>
      </div>
      <DataTable :columns="columnDefs" :rows="columnRows">
        <Column field="name" header="Member" sortable />
        <Column field="role" header="Role" sortable :hidden="hideRoleColumn" />
        <Column field="status" header="Status" />
        <template #cell-status="{ value }">
          <span class="mfs-pill mfs-soft-primary mfs-px-2 mfs-py-1 mfs-text-xs mfs-font-bold">
            {{ value }}
          </span>
        </template>
      </DataTable>
    </div>
  </ComponentPreview>

  <!-- InfiniteScroll -->
  <ComponentPreview
    v-else-if="activeSlug === 'infinite-scroll'"
    title="InfiniteScroll"
    description="IntersectionObserver sentinel container loading incremental batches with retryable error and finished states."
    :code="infiniteScrollCode"
    :code-tabs="infiniteScrollCodeTabs"
    :api="infiniteScrollApi"
  >
    <div class="mfs-stack mfs-w-full">
      <Alert severity="info" title="Cursor / Page Batch Loading">
        <div class="mfs-stack mfs-gap-1 mfs-text-xs">
          <span>
            <strong>Client-Side vs Server-Side:</strong> <code>InfiniteScroll</code> watches a bottom sentinel and emits <code>@load</code> for the next batch. For APIs, track a cursor or page number and bind <code>:has-more</code>, <code>:loading</code> (prevents duplicate calls), and <code>:error</code> (shows inline Retry).
          </span>
        </div>
      </Alert>

      <div class="mfs-row mfs-items-center mfs-justify-between mfs-gap-2 demo-controls">
        <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">
          Loaded {{ infItems.length }} / {{ INF_MAX_ITEMS }} items
        </span>
        <div class="mfs-inline-flex mfs-items-center mfs-gap-2">
          <Button
            size="sm"
            variant="surface"
            @click="infFailNext = !infFailNext"
          >
            {{ infFailNext ? 'Next Load: Error' : 'Next Load: OK' }}
          </Button>
          <Button size="sm" variant="surface" @click="resetInfinite">
            Reset
          </Button>
        </div>
      </div>

      <div class="mfs-surface-subtle mfs-rounded mfs-p-3 inf-scroll-box">
        <InfiniteScroll
          :loading="infLoading"
          :has-more="infItems.length < INF_MAX_ITEMS"
          :error="infError"
          @load="loadMoreInfinite"
        >
          <div class="mfs-stack mfs-gap-2">
            <div
              v-for="item in infItems"
              :key="item.id"
              class="mfs-row mfs-items-center mfs-justify-between mfs-p-3 mfs-rounded-sm mfs-surface"
            >
              <span class="mfs-text-sm mfs-font-semibold mfs-text">{{ item.title }}</span>
              <Badge variant="surface" size="sm">Batch {{ item.batch }}</Badge>
            </div>
          </div>
        </InfiniteScroll>
      </div>
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import type { ApiRow } from '../../data/componentDocs'
import { Alert, Badge, Button, Column, DataTable, DataView, Tree } from '../../lib'
import type { DataTableColumn, DataTableSortMeta, SortOrder } from '../../lib'
import type { DataViewLayout } from '../../lib/components/DataView.vue'
import type { TreeNode } from '../../lib/components/Tree.vue'
import InfiniteScroll from '../../lib/components/InfiniteScroll.vue'

defineProps<{
  activeSlug: string
}>()

// ---------------------------------------------------------------------------
// DataTable Demo State
// ---------------------------------------------------------------------------
const tableColumns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'score', label: 'Score', sortable: true, align: 'right', width: '90px' }
]

const tableRows = [
  { id: 1, name: 'Alya Putri', role: 'Design Lead', status: 'Active', score: 96 },
  { id: 2, name: 'Bima Pratama', role: 'Frontend Engineer', status: 'Active', score: 91 },
  { id: 3, name: 'Citra Lestari', role: 'QA Specialist', status: 'Review', score: 88 },
  { id: 4, name: 'Dimas Wijaya', role: 'Backend Engineer', status: 'Offline', score: 82 },
  { id: 5, name: 'Eka Saputra', role: 'Product Manager', status: 'Active', score: 94 },
  { id: 6, name: 'Fajar Nugroho', role: 'DevOps Engineer', status: 'Active', score: 89 },
  { id: 7, name: 'Gita Permata', role: 'UX Researcher', status: 'Review', score: 85 },
  { id: 8, name: 'Hadi Santoso', role: 'Mobile Engineer', status: 'Offline', score: 79 }
]

const tableQuery = ref('')
const tablePage = ref(1)
const tableRowsPerPage = ref(5)
const tableResponsiveMode = ref<'card' | 'scroll'>('card')
const tableSelectionMode = ref<'single' | 'multiple'>('multiple')
const tableSortMode = ref<'single' | 'multiple'>('multiple')
const tableMultiSortMeta = ref<DataTableSortMeta[]>([
  { key: 'status', order: 'asc' },
  { key: 'score', order: 'desc' }
])
const tableSelection = ref<Record<string, any> | Record<string, any>[] | null>([tableRows[0]])
const lastSort = ref('1. status (asc), 2. score (desc)')

function setTableSelectionMode(mode: 'single' | 'multiple') {
  tableSelectionMode.value = mode
  tableSelection.value = mode === 'multiple' ? [] : null
}

function setTableSortMode(mode: 'single' | 'multiple') {
  tableSortMode.value = mode
  tableMultiSortMeta.value = []
  lastSort.value = ''
}

function onTableSort(payload: { key: string; order: SortOrder; multiSortMeta?: DataTableSortMeta[] }) {
  if (payload.multiSortMeta) {
    lastSort.value = payload.multiSortMeta.length
      ? payload.multiSortMeta.map((m, i) => `${i + 1}. ${m.key} (${m.order})`).join(', ')
      : 'default'
    return
  }
  lastSort.value = payload.order ? `${payload.key} (${payload.order})` : 'default'
}

function statusVariant(status: string): 'success' | 'warning' | 'surface' {
  if (status === 'Active') return 'success'
  if (status === 'Review') return 'warning'
  return 'surface'
}

const selectedSummary = computed(() => {
  if (!tableSelection.value) return 'None'
  if (Array.isArray(tableSelection.value)) {
    return tableSelection.value.length
      ? tableSelection.value.map((r) => r.name).join(', ')
      : 'None'
  }
  return tableSelection.value.name ?? 'None'
})

const dataTableCode = `<template>
  <DataTable
    v-model:selection="selected"
    v-model:search-query="query"
    v-model:page="page"
    v-model:rows-per-page="rowsPerPage"
    v-model:multi-sort-meta="multiSortMeta"
    :columns="columns"
    :rows="rows"
    :total-records="totalRecords"
    :rows-per-page-options="[5, 10, 20]"
    :loading="loading"
    selectable="multiple"
    responsive-mode="card"
    sort-mode="multiple"
    lazy
    paginator
    searchable
    @page="loadTable"
    @sort="loadTable"
    @update:search-query="loadTable"
  >
    <template #cell-status="{ value }">
      <Badge :variant="value === 'Active' ? 'success' : 'surface'">{{ value }}</Badge>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Badge, DataTable, type DataTableSortMeta } from '@mfs-atomic/ui'
import { columns, initialRows, type MemberRow } from './data'
import { fetchMembers } from './fetchApi'

const query = ref('')
const page = ref(1)
const rowsPerPage = ref(5)
const totalRecords = ref(initialRows.length)
const loading = ref(false)
const selected = ref<MemberRow[]>([])
const rows = ref<MemberRow[]>(initialRows)
const multiSortMeta = ref<DataTableSortMeta[]>([
  { key: 'status', order: 'asc' },
  { key: 'score', order: 'desc' }
])

const loadTable = async () => {
  loading.value = true
  try {
    const res = await fetchMembers({
      page: page.value,
      perPage: rowsPerPage.value,
      search: query.value,
      sort: multiSortMeta.value
    })
    rows.value = res.data
    totalRecords.value = res.total
  } finally {
    loading.value = false
  }
}

onMounted(loadTable)
<\/script>`

const dataTableCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: dataTableCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { DataTableColumn } from '@mfs-atomic/ui'

export interface MemberRow {
  id: number
  name: string
  role: string
  status: 'Active' | 'Review' | 'Offline'
  score: number
}

export const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'score', label: 'Score', sortable: true, align: 'right', width: '90px' }
]

export const initialRows: MemberRow[] = [
  { id: 1, name: 'Alya Putri', role: 'Design Lead', status: 'Active', score: 96 },
  { id: 2, name: 'Bima Pratama', role: 'Frontend Engineer', status: 'Active', score: 91 }
]`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { DataTableSortMeta } from '@mfs-atomic/ui'
import type { MemberRow } from './data'

export interface TableQuery {
  page: number
  perPage: number
  search: string
  sort: DataTableSortMeta[]
}

export async function fetchMembers(
  query: TableQuery
): Promise<{ data: MemberRow[]; total: number }> {
  const params = new URLSearchParams({
    page: String(query.page),
    per_page: String(query.perPage),
    q: query.search,
    sort: query.sort.map((s) => \`\${s.key}:\${s.order}\`).join(',')
  })
  const res = await fetch(\`/api/members?\${params.toString()}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

const dataTableApi = {
  props: [
    { name: 'columns', type: 'DataTableColumn[]', description: 'Column definitions ({ key, label, sortable?, width?, align? }).' },
    { name: 'rows', type: 'Record<string, any>[] | number', description: 'Array of row data objects, or rows-per-page count when using :value.' },
    { name: 'value', type: 'Record<string, any>[]', description: 'OpenVue-compatible array of row data objects.' },
    { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique property name used to key and track rows.' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'Shows a built-in search input in the toolbar.' },
    { name: 'searchQuery', type: 'string', default: "''", description: 'Controlled search query (supports v-model:search-query).' },
    { name: 'selectable', type: "boolean | 'single' | 'multiple'", default: 'false', description: 'Enables single-row radio or multi-row checkbox selection.' },
    { name: 'selection', type: 'Record<string, any> | Record<string, any>[] | null', default: 'null', description: 'Selected row or array of rows (supports v-model:selection).' },
    { name: 'responsiveMode', type: "'card' | 'scroll'", default: "'card'", description: 'Mobile layout mode: stacked cards or horizontal scroll.' },
    { name: 'emptyText', type: 'string', default: "'No data available'", description: 'Fallback text when rows or search results are empty.' },
    { name: 'paginator', type: 'boolean', default: 'false', description: 'Renders integrated footer with rows-per-page selector and page controls.' },
    { name: 'rowsPerPage', type: 'number', default: '10', description: 'Number of rows displayed per page (supports v-model:rows-per-page).' },
    { name: 'rowsPerPageOptions', type: 'number[]', default: '[5, 10, 20, 50]', description: 'Selectable page size options in the paginator footer.' },
    { name: 'page', type: 'number', default: '1', description: 'Active 1-based page number (supports v-model:page).' },
    { name: 'first', type: 'number', default: '0', description: 'Zero-based index of the first row on the active page.' },
    { name: 'totalRecords', type: 'number', description: 'Total number of records (required in lazy/server mode).' },
    { name: 'lazy', type: 'boolean', default: 'false', description: 'Disables client-side slicing/filtering/sorting for server-driven pagination.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Displays loading overlay and disables pagination controls.' },
    { name: 'sortMode', type: "'single' | 'multiple'", default: "'single'", description: 'Enables single-column sorting or prioritized multi-column sorting.' },
    { name: 'multiSortMeta', type: 'DataTableSortMeta[]', default: '[]', description: 'Ordered array of active sort descriptors ({ key, order }) for multiple sort mode (supports v-model:multi-sort-meta).' }
  ],
  events: [
    { name: 'update:selection', type: '(value: Record<string, any> | Record<string, any>[] | null) => void', description: 'Emitted when row selection changes.' },
    { name: 'update:searchQuery', type: '(value: string) => void', description: 'Emitted when the search input value changes.' },
    { name: 'update:page', type: '(page: number) => void', description: 'Emitted when the active page changes.' },
    { name: 'update:rows', type: '(rows: number) => void', description: 'Emitted when rows per page changes (OpenVue alias).' },
    { name: 'update:rowsPerPage', type: '(rowsPerPage: number) => void', description: 'Emitted when rows per page changes.' },
    { name: 'update:first', type: '(first: number) => void', description: 'Emitted with the new zero-based first row index.' },
    { name: 'update:multiSortMeta', type: '(meta: DataTableSortMeta[]) => void', description: 'Emitted when the active multi-column sort stack changes.' },
    { name: 'page', type: '(payload: { page: number; first: number; rows: number; pageCount: number }) => void', description: 'Emitted on page or page-size changes.' },
    { name: 'sort', type: "(payload: { key: string; order: 'asc' | 'desc' | null; multiSortMeta?: DataTableSortMeta[] }) => void", description: 'Emitted when a sortable column header is clicked.' },
    { name: 'row-click', type: '(row: Record<string, any>) => void', description: 'Emitted when a table row is clicked.' }
  ],
  slots: [
    { name: 'header', description: 'Custom toolbar content placed before the search input.' },
    { name: 'cell-[key]', description: 'Custom cell template receiving { row, value, column, index }.' },
    { name: 'empty', description: 'Custom empty state content when no rows are displayed.' }
  ]
}

// ---------------------------------------------------------------------------
// DataView Demo State
// ---------------------------------------------------------------------------
const viewLayout = ref<DataViewLayout>('grid')
const viewColumns = ref<number>(2)

const filteredCatalog = [
  {
    id: 'clay',
    name: 'Claymorphism',
    tag: 'Soft 3D',
    badgeVariant: 'primary' as const,
    description: 'Puffy tactile surfaces with dual inner and outer shadows.'
  },
  {
    id: 'glass',
    name: 'Glassmorphism',
    tag: 'Frosted',
    badgeVariant: 'secondary' as const,
    description: 'Translucent backdrop-blur layers over vibrant gradients.'
  },
  {
    id: 'neo',
    name: 'Neumorphism',
    tag: 'Extruded',
    badgeVariant: 'success' as const,
    description: 'Monochrome soft UI sculpted with light and dark offsets.'
  },
  {
    id: 'tokens',
    name: 'CSS Variables',
    tag: 'Runtime',
    badgeVariant: 'warning' as const,
    description: 'Instant theme switching via [data-theme] custom properties.'
  }
]

const dataViewCode = `<template>
  <DataView v-model:layout="layout" :items="items" :columns="2">
    <template #header>
      <strong>Theme Presets</strong>
    </template>
    <template #grid="{ item }">
      <div class="card">{{ item.name }}</div>
    </template>
    <template #list="{ item }">
      <div class="row">{{ item.name }} — {{ item.description }}</div>
    </template>
  </DataView>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DataView, type DataViewLayout } from '@mfs-atomic/ui'
import { presetItems, type PresetItem } from './data'
import { fetchPresets } from './fetchApi'

const layout = ref<DataViewLayout>('grid')
const items = ref<PresetItem[]>(presetItems)

onMounted(async () => {
  items.value = await fetchPresets()
})
<\/script>`

const dataViewCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: dataViewCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `export interface PresetItem {
  id: string
  name: string
  tag: string
  description: string
}

export const presetItems: PresetItem[] = [
  { id: 'clay', name: 'Claymorphism', tag: 'Soft 3D', description: 'Soft 3D tactile surfaces' },
  { id: 'glass', name: 'Glassmorphism', tag: 'Frosted', description: 'Frosted translucent layers' }
]`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { PresetItem } from './data'

export async function fetchPresets(): Promise<PresetItem[]> {
  const res = await fetch('/api/presets')
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

const dataViewApi = {
  props: [
    { name: 'items', type: 'any[]', description: 'Array of data items to render.' },
    { name: 'layout', type: "'grid' | 'list'", default: "'grid'", description: 'Active layout mode (supports v-model:layout).' },
    { name: 'itemKey', type: 'string', default: "'id'", description: 'Property name used as v-for key for object items.' },
    { name: 'columns', type: 'number', default: 'undefined', description: 'Explicit grid column count when layout is grid.' },
    { name: 'emptyText', type: 'string', default: "'No items found'", description: 'Fallback text displayed when items is empty.' }
  ],
  events: [
    { name: 'update:layout', type: "(value: 'grid' | 'list') => void", description: 'Emitted when the user toggles between grid and list.' }
  ],
  slots: [
    { name: 'default', description: 'Fallback item slot receiving { item, index, layout }.' },
    { name: 'grid', description: 'Custom item template for grid layout receiving { item, index }.' },
    { name: 'list', description: 'Custom item template for list layout receiving { item, index }.' },
    { name: 'header', description: 'Custom header content placed beside the layout toggle.' },
    { name: 'empty', description: 'Custom empty state content when items is empty.' }
  ]
}

// ---------------------------------------------------------------------------
// Tree Demo State
// ---------------------------------------------------------------------------
const treeNodes: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    children: [
      {
        key: 'components',
        label: 'components',
        children: [
          { key: 'DataTable.vue', label: 'DataTable.vue' },
          { key: 'DataView.vue', label: 'DataView.vue' },
          { key: 'Tree.vue', label: 'Tree.vue' }
        ]
      },
      {
        key: 'composables',
        label: 'composables',
        children: [
          { key: 'useTheme.ts', label: 'useTheme.ts' },
          { key: 'useToast.ts', label: 'useToast.ts' }
        ]
      }
    ]
  },
  {
    key: 'docs',
    label: 'docs (archived)',
    disabled: true
  },
  {
    key: 'package.json',
    label: 'package.json'
  }
]

const treeExpanded = ref<string[]>(['src', 'components'])
const treeSelected = ref<string[]>(['Tree.vue'])
const treeSelectionMode = ref<'none' | 'single' | 'checkbox'>('checkbox')
const lastClickedNode = ref('')

function expandAllTree() {
  treeExpanded.value = ['src', 'components', 'composables']
}

function setTreeMode(mode: 'none' | 'single' | 'checkbox') {
  treeSelectionMode.value = mode
  treeSelected.value = []
}

function onTreeNodeClick(node: TreeNode) {
  lastClickedNode.value = node.label
}

const treeCode = `<template>
  <Tree
    v-model:expanded-keys="expanded"
    v-model:selected-keys="selected"
    :nodes="nodes"
    selection-mode="checkbox"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tree } from '@mfs-atomic/ui'
import { nodes } from './data'

const expanded = ref<string[]>(['src', 'components'])
const selected = ref<string[]>(['Tree.vue'])
<\/script>`

const treeCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: treeCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { TreeNode } from '@mfs-atomic/ui'

export const nodes: TreeNode[] = [
  {
    key: 'src',
    label: 'src',
    children: [
      {
        key: 'components',
        label: 'components',
        children: [
          { key: 'DataTable.vue', label: 'DataTable.vue' },
          { key: 'Tree.vue', label: 'Tree.vue' }
        ]
      }
    ]
  },
  { key: 'docs', label: 'docs (archived)', disabled: true },
  { key: 'package.json', label: 'package.json' }
]`
  }
]

const treeApi = {
  props: [
    { name: 'nodes', type: 'TreeNode[]', description: 'Hierarchical node array ({ key, label, children?, disabled?, icon? }).' },
    { name: 'expandedKeys', type: 'string[]', default: '[]', description: 'Keys of currently expanded nodes (supports v-model:expanded-keys).' },
    { name: 'selectionMode', type: "'none' | 'single' | 'checkbox'", default: "'none'", description: 'Node selection behavior.' },
    { name: 'selectedKeys', type: 'string[]', default: '[]', description: 'Keys of currently selected nodes (supports v-model:selected-keys).' },
    { name: 'level', type: 'number', default: '0', description: 'Internal nesting depth for indentation.' }
  ],
  events: [
    { name: 'update:expandedKeys', type: '(keys: string[]) => void', description: 'Emitted when nodes are expanded or collapsed.' },
    { name: 'update:selectedKeys', type: '(keys: string[]) => void', description: 'Emitted when node selection changes.' },
    { name: 'node-click', type: '(node: TreeNode) => void', description: 'Emitted when an enabled node row is clicked.' },
    { name: 'node-toggle', type: '(node: TreeNode, expanded: boolean) => void', description: 'Emitted when a parent node expands or collapses.' }
  ],
  slots: [
    { name: 'node', description: 'Custom node content receiving { node, expanded, selected, level }.' }
  ]
}

// ---------------------------------------------------------------------------
// Column Demo State
// ---------------------------------------------------------------------------
const hideRoleColumn = ref(false)
const columnDefs = computed(() => [
  { key: 'name', label: 'Member', sortable: true },
  ...(hideRoleColumn.value ? [] : [{ key: 'role', label: 'Role', sortable: true }]),
  { key: 'status', label: 'Status' }
])
const columnRows = [
  { name: 'Ari Pratama', role: 'Maintainer', status: 'Active' },
  { name: 'Nadia Kusuma', role: 'Designer', status: 'Active' },
  { name: 'Raka Putra', role: 'Reviewer', status: 'Idle' }
]

const columnCode = `<template>
  <Button size="sm" variant="surface" @click="hideRole = !hideRole">
    {{ hideRole ? 'Show Role' : 'Hide Role' }}
  </Button>

  <DataTable :value="rows">
    <Column field="name" header="Member" sortable />
    <Column field="role" header="Role" :hidden="hideRole" />
    <Column field="status" header="Status">
      <template #body="{ data }">
        <span class="mfs-pill mfs-soft-primary">{{ data.status }}</span>
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Column, DataTable } from '@mfs-atomic/ui'

const hideRole = ref(false)
const rows = [
  { name: 'Ari Pratama', role: 'Maintainer', status: 'Active' },
  { name: 'Nadia Kusuma', role: 'Designer', status: 'Active' },
  { name: 'Raka Putra', role: 'Reviewer', status: 'Idle' }
]
<\/script>`

const columnApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'field', type: 'string', description: 'Property key in each row object.' },
    { name: 'header', type: 'string', description: 'Column header label.' },
    { name: 'sortable', type: 'boolean', default: 'false', description: 'Enables column sorting.' },
    { name: 'frozen', type: 'boolean', default: 'false', description: 'Pins the column horizontally.' },
    { name: 'alignFrozen', type: "'left' | 'right'", default: "'left'", description: 'Side to pin when frozen.' },
    { name: 'hidden', type: 'boolean', default: 'false', description: 'Hides column from rendering.' }
  ],
  slots: [
    { name: 'header', description: 'Custom column header template.' },
    { name: 'body', description: 'Cell template receiving { data, field, index }.' },
    { name: 'filter', description: 'Custom column filter input.' },
    { name: 'editor', description: 'Inline cell editor template.' },
    { name: 'footer', description: 'Custom column footer template.' }
  ]
}

// ---------------------------------------------------------------------------
// InfiniteScroll Demo State & Docs
// ---------------------------------------------------------------------------
const INF_MAX_ITEMS = 18
const infItems = ref(
  Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Activity Event #${i + 1}`,
    batch: 1
  }))
)
const infLoading = ref(false)
const infError = ref<string | undefined>(undefined)
const infFailNext = ref(false)

function loadMoreInfinite() {
  if (infLoading.value || infItems.value.length >= INF_MAX_ITEMS) return
  infLoading.value = true
  infError.value = undefined
  setTimeout(() => {
    infLoading.value = false
    if (infFailNext.value) {
      infFailNext.value = false
      infError.value = 'Network timeout while fetching batch. Click Retry.'
      return
    }
    const nextBatch = Math.floor(infItems.value.length / 6) + 1
    const start = infItems.value.length
    const more = Array.from({ length: 6 }, (_, i) => ({
      id: start + i + 1,
      title: `Activity Event #${start + i + 1}`,
      batch: nextBatch
    }))
    infItems.value = [...infItems.value, ...more]
  }, 350)
}

function resetInfinite() {
  infLoading.value = false
  infError.value = undefined
  infItems.value = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Activity Event #${i + 1}`,
    batch: 1
  }))
}

const infiniteScrollCode = `<template>
  <InfiniteScroll :loading="loading" :has-more="hasMore" :error="error" @load="loadMore">
    <div v-for="item in items" :key="item.id">{{ item.title }}</div>
  </InfiniteScroll>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { InfiniteScroll } from '@mfs-atomic/ui'
import { initialEvents, type ActivityItem } from './data'
import { fetchActivityPage } from './fetchApi'

const items = ref<ActivityItem[]>(initialEvents)
const cursor = ref<string | null>('cursor_1')
const loading = ref(false)
const hasMore = ref(true)
const error = ref<string | undefined>(undefined)

const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  error.value = undefined
  try {
    const res = await fetchActivityPage(cursor.value)
    items.value = [...items.value, ...res.items]
    cursor.value = res.nextCursor
    hasMore.value = res.nextCursor !== null
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load batch'
  } finally {
    loading.value = false
  }
}
<\/script>`

const infiniteScrollCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: infiniteScrollCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `export interface ActivityItem {
  id: number
  title: string
  batch: number
}

export interface CursorPage<T> {
  items: T[]
  nextCursor: string | null
}

export const initialEvents: ActivityItem[] = [
  { id: 1, title: 'Activity Event #1', batch: 1 },
  { id: 2, title: 'Activity Event #2', batch: 1 }
]`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { ActivityItem, CursorPage } from './data'

export async function fetchActivityPage(
  cursor: string | null
): Promise<CursorPage<ActivityItem>> {
  const params = new URLSearchParams()
  if (cursor) params.set('cursor', cursor)
  const res = await fetch(\`/api/activity?\${params.toString()}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

const infiniteScrollApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner and pauses new @load triggers.' },
    { name: 'hasMore', type: 'boolean', default: 'true', description: 'Whether more batches remain to be loaded.' },
    { name: 'error', type: 'string', description: 'Error message displaying inline Retry button.' },
    { name: 'isEmpty', type: 'boolean', default: 'false', description: 'Renders empty state slot when true.' },
    { name: 'rootMargin', type: 'string', default: "'120px'", description: 'IntersectionObserver rootMargin for preloading.' }
  ],
  events: [
    { name: 'load', type: '() => void', description: 'Emitted when sentinel intersects or Retry is clicked.' }
  ],
  slots: [
    { name: 'default', description: 'Rendered list items.' },
    { name: 'loading', description: 'Custom loading indicator.' },
    { name: 'error', description: 'Custom error UI receiving { error, retry }.' },
    { name: 'finished', description: 'Shown when hasMore is false.' }
  ]
}
</script>

<style scoped>
.demo-pill:hover {
  color: var(--text);
}

.demo-pill.is-active {
  background: var(--primary);
  color: var(--primary-text);
  border-color: transparent;
}

.demo-status-bar strong {
  color: var(--text);
}

.dv-card--grid {
  height: 100%;
}

.dv-card__body {
  min-width: 0;
}

.dv-card__icon {
  font-size: 1.5rem;
  line-height: 1;
}

.inf-scroll-box {
  max-height: 280px;
  overflow-y: auto;
}

@media (max-width: 640px) {
  .demo-controls {
    align-items: flex-start;
  }

  .demo-pill {
    min-height: 36px;
  }
}
</style>
