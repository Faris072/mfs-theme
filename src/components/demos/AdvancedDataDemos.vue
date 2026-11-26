<template>
  <!-- DataTable -->
  <div v-if="activeSlug === 'data-table'" class="mfs-stack mfs-gap-6">
    <!-- 1. Basic -->
    <ComponentPreview
      title="Basic"
      description="Minimal DataTable displaying structured rows and columns with zero extra chrome."
      :code="basicCode"
      :api="dataTableApi"
    >
      <DataTable :value="basicRows" :columns="basicCols">
        <template #cell-status="{ value }">
          <Badge :variant="statusVariant(value)">{{ value }}</Badge>
        </template>
      </DataTable>
    </ComponentPreview>

    <!-- 2. Search & Pagination -->
    <ComponentPreview
      title="Search & Pagination"
      description="Enable built-in client-side filtering and page-size controls with searchable and paginator."
      :code="searchPaginationCode"
    >
      <DataTable
        :value="teamRows"
        :columns="teamCols"
        searchable
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10]"
      >
        <template #cell-status="{ value }">
          <Badge :variant="statusVariant(value)">{{ value }}</Badge>
        </template>
      </DataTable>
    </ComponentPreview>

    <!-- 3. Sorting (Single & Multiple) -->
    <ComponentPreview
      title="Sorting (Single & Multiple)"
      description="Sort by a single column or stack multiple sort priorities with sort-mode='multiple'."
      :code="multiSortCode"
    >
      <div class="mfs-stack mfs-gap-3">
        <div class="mfs-flex mfs-flex-wrap mfs-items-center mfs-justify-between mfs-gap-3">
          <div class="mfs-inline-flex mfs-items-center mfs-gap-2" role="group" aria-label="Sort mode">
            <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">Sort Mode:</span>
            <Button
              size="sm"
              :variant="tableSortMode === 'single' ? 'primary' : 'surface'"
              @click="setTableSortMode('single')"
            >
              Single
            </Button>
            <Button
              size="sm"
              :variant="tableSortMode === 'multiple' ? 'primary' : 'surface'"
              @click="setTableSortMode('multiple')"
            >
              Multiple
            </Button>
          </div>
          <span v-if="lastSort" class="mfs-text-xs mfs-text-muted">
            <strong>Active Sort:</strong> {{ lastSort }}
          </span>
        </div>

        <DataTable
          v-model:multi-sort-meta="tableMultiSortMeta"
          :value="teamRows.slice(0, 5)"
          :columns="sortableCols"
          :sort-mode="tableSortMode"
          @sort="onTableSort"
        >
          <template #cell-status="{ value }">
            <Badge :variant="statusVariant(value)">{{ value }}</Badge>
          </template>
        </DataTable>
      </div>
    </ComponentPreview>

    <!-- 4. Row Selection -->
    <ComponentPreview
      title="Row Selection"
      description="Bind v-model:selection with selectable='single' (radio) or selectable='multiple' (checkboxes)."
      :code="selectionCode"
    >
      <div class="mfs-stack mfs-gap-3">
        <div class="mfs-flex mfs-flex-wrap mfs-items-center mfs-justify-between mfs-gap-3">
          <div class="mfs-inline-flex mfs-items-center mfs-gap-2" role="group" aria-label="Selection mode">
            <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">Mode:</span>
            <Button
              size="sm"
              :variant="tableSelectionMode === 'multiple' ? 'primary' : 'surface'"
              @click="setTableSelectionMode('multiple')"
            >
              Multiple
            </Button>
            <Button
              size="sm"
              :variant="tableSelectionMode === 'single' ? 'primary' : 'surface'"
              @click="setTableSelectionMode('single')"
            >
              Single
            </Button>
          </div>
          <span class="mfs-text-xs mfs-text-muted">
            <strong>Selected:</strong> {{ selectedSummary }}
          </span>
        </div>

        <DataTable
          v-model:selection="tableSelection"
          :value="teamRows.slice(0, 5)"
          :columns="teamCols"
          :selectable="tableSelectionMode"
        >
          <template #cell-status="{ value }">
            <Badge :variant="statusVariant(value)">{{ value }}</Badge>
          </template>
        </DataTable>
      </div>
    </ComponentPreview>

    <!-- 5. Row Expansion -->
    <ComponentPreview
      title="Row Expansion"
      description="Add expandable and a #expansion slot to reveal per-row detail panels."
      :code="expansionCode"
    >
      <DataTable
        v-model:expanded-rows="tableExpandedRows"
        :value="teamRows.slice(0, 5)"
        :columns="teamCols"
        expandable
      >
        <template #cell-status="{ value }">
          <Badge :variant="statusVariant(value)">{{ value }}</Badge>
        </template>
        <template #expansion="{ row }">
          <div class="mfs-flex mfs-flex-wrap mfs-items-center mfs-justify-between mfs-gap-3">
            <div class="mfs-stack mfs-gap-1">
              <div class="mfs-text-sm mfs-font-bold mfs-text">
                {{ row.name }} — {{ row.role }}
              </div>
              <div class="mfs-text-xs mfs-text-muted">
                Status: <strong>{{ row.status }}</strong> · Performance Score: <strong>{{ row.score }}/100</strong>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              @click="lastInspectedMember = `${row.name} (${row.role})`"
            >
              {{ lastInspectedMember === `${row.name} (${row.role})` ? 'Inspected' : 'Inspect Profile' }}
            </Button>
          </div>
        </template>
      </DataTable>
    </ComponentPreview>

    <!-- 6. Column Toggle -->
    <ComponentPreview
      title="Column Toggle"
      description="Let users show or hide columns dynamically from the toolbar Columns dropdown."
      :code="columnToggleCode"
    >
      <DataTable
        v-model:visible-columns="tableVisibleColumns"
        :value="teamRows.slice(0, 5)"
        :columns="teamCols"
        searchable
        column-toggle
      >
        <template #cell-status="{ value }">
          <Badge :variant="statusVariant(value)">{{ value }}</Badge>
        </template>
      </DataTable>
    </ComponentPreview>

    <!-- 7. Server-Side (Lazy) -->
    <ComponentPreview
      title="Server-Side (Lazy)"
      description="Delegate pagination, sorting, and filtering to your backend API with lazy and :total-records."
      :code="lazyCodeTabs[0].code"
      :code-tabs="lazyCodeTabs"
    >
      <div class="mfs-stack mfs-gap-3">
        <Alert severity="info" title="Server-Side (Lazy) Mode">
          <span class="mfs-text-xs">
            Set <code>lazy</code> and <code>:total-records="total"</code>, then fetch slices on <code>@page</code>, <code>@sort</code>, and debounced <code>@update:search-query</code> while binding <code>:loading</code>.
          </span>
        </Alert>

        <DataTable
          v-model:page="lazyPage"
          v-model:rows-per-page="lazyRowsPerPage"
          v-model:search-query="lazyQuery"
          v-model:multi-sort-meta="lazyMultiSortMeta"
          :value="lazyRows"
          :columns="sortableCols"
          :total-records="lazyTotalRecords"
          :rows-per-page-options="[5, 10]"
          :loading="lazyLoading"
          sort-mode="multiple"
          lazy
          paginator
          searchable
          @page="loadLazyDemo"
          @sort="loadLazyDemo"
          @update:search-query="loadLazyDemo"
        >
          <template #cell-status="{ value }">
            <Badge :variant="statusVariant(value)">{{ value }}</Badge>
          </template>
        </DataTable>
      </div>
    </ComponentPreview>
  </div>

  <!-- DataView -->
  <ComponentPreview
    v-else-if="activeSlug === 'data-view'"
    title="Interactive DataView"
    description="Toggle seamlessly between responsive Grid and List layouts using custom #grid and #list slots."
    :code="dataViewCode"
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
              <Button
                size="sm"
                :variant="viewColumns === 2 ? 'primary' : 'surface'"
                @click="viewColumns = 2"
              >
                2 Cols
              </Button>
              <Button
                size="sm"
                :variant="viewColumns === 3 ? 'primary' : 'surface'"
                @click="viewColumns = 3"
              >
                3 Cols
              </Button>
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
  <div v-else-if="activeSlug === 'tree'" class="mfs-stack mfs-gap-6">
    <!-- 1. Checkbox Selection -->
    <ComponentPreview
      title="Checkbox Selection"
      description="Multi-select hierarchical nodes with checkboxes, plus Expand All and Collapse All controls."
      :code="treeCheckboxCode"
      :api="treeApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row demo-controls">
          <div class="mfs-inline-flex mfs-flex-wrap mfs-items-center mfs-gap-2">
            <Button size="sm" variant="surface" @click="expandAllTree">Expand All</Button>
            <Button size="sm" variant="surface" @click="treeExpanded = []">Collapse All</Button>
          </div>
        </div>

        <div class="mfs-p-3 mfs-rounded-md mfs-surface-subtle mfs-shadow-inset">
          <Tree
            v-model:expanded-keys="treeExpanded"
            v-model:selected-keys="treeCheckboxSelected"
            :nodes="treeNodes"
            selection-mode="checkbox"
            @node-click="(node) => (lastCheckboxNode = node.label)"
          />
        </div>

        <div class="mfs-row mfs-gap-4 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-text-muted demo-status-bar">
          <span>
            <strong>Selected Keys:</strong>
            {{ treeCheckboxSelected.length ? treeCheckboxSelected.join(', ') : 'None' }}
          </span>
          <span v-if="lastCheckboxNode">
            <strong>Last Clicked:</strong> {{ lastCheckboxNode }}
          </span>
        </div>
      </div>
    </ComponentPreview>

    <!-- 2. Single Selection -->
    <ComponentPreview
      title="Single Selection"
      description="Select one node at a time using selection-mode='single'."
      :code="treeSingleCode"
    >
      <div class="mfs-stack">
        <div class="mfs-p-3 mfs-rounded-md mfs-surface-subtle mfs-shadow-inset">
          <Tree
            v-model:expanded-keys="treeSingleExpanded"
            v-model:selected-keys="treeSingleSelected"
            :nodes="treeNodes"
            selection-mode="single"
            @node-click="(node) => (lastSingleNode = node.label)"
          />
        </div>

        <div class="mfs-row mfs-gap-4 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-text-muted demo-status-bar">
          <span>
            <strong>Selected Keys:</strong>
            {{ treeSingleSelected.length ? treeSingleSelected.join(', ') : 'None' }}
          </span>
          <span v-if="lastSingleNode">
            <strong>Last Clicked:</strong> {{ lastSingleNode }}
          </span>
        </div>
      </div>
    </ComponentPreview>

    <!-- 3. Read-Only (None) -->
    <ComponentPreview
      title="Read-Only (None)"
      description="Browse and expand hierarchical nodes without selection using selection-mode='none'."
      :code="treeNoneCode"
    >
      <div class="mfs-stack">
        <div class="mfs-p-3 mfs-rounded-md mfs-surface-subtle mfs-shadow-inset">
          <Tree
            v-model:expanded-keys="treeNoneExpanded"
            :nodes="treeNodes"
            selection-mode="none"
            @node-click="(node) => (lastNoneNode = node.label)"
          />
        </div>

        <div class="mfs-row mfs-gap-4 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-text-muted demo-status-bar">
          <span>
            <strong>Last Clicked:</strong> {{ lastNoneNode || 'None' }}
          </span>
        </div>
      </div>
    </ComponentPreview>
  </div>

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
const basicCols: DataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'score', label: 'Score', align: 'right', width: '90px' }
]

const teamCols: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'score', label: 'Score', sortable: true, align: 'right', width: '90px' }
]

const sortableCols = teamCols

const teamRows = [
  { id: 1, name: 'Alya Putri', role: 'Design Lead', status: 'Active', score: 96 },
  { id: 2, name: 'Bima Pratama', role: 'Frontend Engineer', status: 'Active', score: 91 },
  { id: 3, name: 'Citra Lestari', role: 'QA Specialist', status: 'Review', score: 88 },
  { id: 4, name: 'Dimas Wijaya', role: 'Backend Engineer', status: 'Offline', score: 82 },
  { id: 5, name: 'Eka Saputra', role: 'Product Manager', status: 'Active', score: 94 },
  { id: 6, name: 'Fajar Nugroho', role: 'DevOps Engineer', status: 'Active', score: 89 },
  { id: 7, name: 'Gita Permata', role: 'UX Researcher', status: 'Review', score: 85 },
  { id: 8, name: 'Hadi Santoso', role: 'Mobile Engineer', status: 'Offline', score: 79 }
]

const basicRows = teamRows.slice(0, 4)

const tableSelectionMode = ref<'single' | 'multiple'>('multiple')
const tableSelection = ref<Record<string, any> | Record<string, any>[] | null>([teamRows[0]])
const tableSortMode = ref<'single' | 'multiple'>('multiple')
const tableMultiSortMeta = ref<DataTableSortMeta[]>([
  { key: 'status', order: 'asc' },
  { key: 'score', order: 'desc' }
])
const tableExpandedRows = ref<Record<string, unknown>[]>([])
const tableVisibleColumns = ref<string[]>(teamCols.map((c) => c.key))
const lastSort = ref('1. status (asc), 2. score (desc)')
const lastInspectedMember = ref('')

// Lazy demo state
const lazyPage = ref(1)
const lazyRowsPerPage = ref(5)
const lazyQuery = ref('')
const lazyLoading = ref(false)
const lazyMultiSortMeta = ref<DataTableSortMeta[]>([])
const lazyRows = ref(teamRows.slice(0, 5))
const lazyTotalRecords = ref(teamRows.length)

function loadLazyDemo() {
  lazyLoading.value = true
  setTimeout(() => {
    const q = lazyQuery.value.trim().toLowerCase()
    let filtered = q
      ? teamRows.filter((r) =>
          [r.name, r.role, r.status].some((v) => String(v).toLowerCase().includes(q))
        )
      : [...teamRows]

    if (lazyMultiSortMeta.value.length > 0) {
      const metas = lazyMultiSortMeta.value
      filtered.sort((a, b) => {
        for (const m of metas) {
          const av = a[m.key as keyof typeof a]
          const bv = b[m.key as keyof typeof b]
          const dir = m.order === 'asc' ? 1 : -1
          if (typeof av === 'number' && typeof bv === 'number') {
            if (av !== bv) return (av - bv) * dir
          } else {
            const cmp = String(av).localeCompare(String(bv)) * dir
            if (cmp !== 0) return cmp
          }
        }
        return 0
      })
    }

    lazyTotalRecords.value = filtered.length
    const start = (lazyPage.value - 1) * lazyRowsPerPage.value
    lazyRows.value = filtered.slice(start, start + lazyRowsPerPage.value)
    lazyLoading.value = false
  }, 180)
}

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

const basicCode = `<template>
  <DataTable :value="rows" :columns="columns">
    <template #cell-status="{ value }">
      <Badge :variant="value === 'Active' ? 'success' : 'surface'">{{ value }}</Badge>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { Badge, DataTable, type DataTableColumn } from '@mfs-atomic/ui'

interface MemberRow {
  id: number
  name: string
  role: string
  status: 'Active' | 'Review' | 'Offline'
  score: number
}

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'score', label: 'Score', align: 'right', width: '90px' }
]

const rows: MemberRow[] = [
  { id: 1, name: 'Alya Putri', role: 'Design Lead', status: 'Active', score: 96 },
  { id: 2, name: 'Bima Pratama', role: 'Frontend Engineer', status: 'Active', score: 91 },
  { id: 3, name: 'Citra Lestari', role: 'QA Specialist', status: 'Review', score: 88 }
]
<\/script>`

const searchPaginationCode = `<template>
  <DataTable
    v-model:search-query="search"
    :value="rows"
    :columns="columns"
    searchable
    paginator
    :rows="5"
    :rows-per-page-options="[5, 10]"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DataTable, type DataTableColumn } from '@mfs-atomic/ui'

interface UserRow {
  id: number
  name: string
  role: string
  status: 'Active' | 'Review' | 'Offline'
}

const search = ref('')

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status' }
]

const rows: UserRow[] = [
  { id: 1, name: 'Alya Putri', role: 'Design Lead', status: 'Active' },
  { id: 2, name: 'Bima Pratama', role: 'Frontend Engineer', status: 'Active' },
  { id: 3, name: 'Citra Lestari', role: 'QA Specialist', status: 'Review' },
  { id: 4, name: 'Dimas Wijaya', role: 'Backend Engineer', status: 'Offline' }
]
<\/script>`

const multiSortCode = `<template>
  <DataTable
    v-model:multi-sort-meta="multiSortMeta"
    :value="rows"
    :columns="columns"
    sort-mode="multiple"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DataTable, type DataTableColumn, type DataTableSortMeta } from '@mfs-atomic/ui'

interface MemberRow {
  id: number
  name: string
  status: 'Active' | 'Review' | 'Offline'
  score: number
}

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'score', label: 'Score', align: 'right', sortable: true }
]

const rows: MemberRow[] = [
  { id: 1, name: 'Alya Putri', status: 'Active', score: 96 },
  { id: 2, name: 'Bima Pratama', status: 'Active', score: 91 },
  { id: 3, name: 'Citra Lestari', status: 'Review', score: 88 }
]

const multiSortMeta = ref<DataTableSortMeta[]>([
  { key: 'status', order: 'asc' },
  { key: 'score', order: 'desc' }
])
<\/script>`

const selectionCode = `<template>
  <DataTable
    v-model:selection="selected"
    :value="rows"
    :columns="columns"
    selectable="multiple"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DataTable, type DataTableColumn } from '@mfs-atomic/ui'

interface MemberRow {
  id: number
  name: string
  role: string
  status: 'Active' | 'Review'
}

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' }
]

const rows: MemberRow[] = [
  { id: 1, name: 'Alya Putri', role: 'Design Lead', status: 'Active' },
  { id: 2, name: 'Bima Pratama', role: 'Frontend Engineer', status: 'Active' },
  { id: 3, name: 'Citra Lestari', role: 'QA Specialist', status: 'Review' }
]

const selected = ref<MemberRow[]>([])
<\/script>`

const expansionCode = `<template>
  <DataTable
    v-model:expanded-rows="expandedRows"
    :value="rows"
    :columns="columns"
    expandable
  >
    <template #expansion="{ row }">
      <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-3">
        <span>{{ row.name }} — {{ row.role }} (Score: {{ row.score }})</span>
        <Button size="sm" variant="secondary">Inspect Profile</Button>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, DataTable, type DataTableColumn } from '@mfs-atomic/ui'

interface MemberRow {
  id: number
  name: string
  role: string
  score: number
}

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'score', label: 'Score', align: 'right' }
]

const rows: MemberRow[] = [
  { id: 1, name: 'Alya Putri', role: 'Design Lead', score: 96 },
  { id: 2, name: 'Bima Pratama', role: 'Frontend Engineer', score: 91 },
  { id: 3, name: 'Citra Lestari', role: 'QA Specialist', score: 88 }
]

const expandedRows = ref<MemberRow[]>([])
<\/script>`

const columnToggleCode = `<template>
  <DataTable
    v-model:visible-columns="visibleColumns"
    :value="rows"
    :columns="columns"
    searchable
    column-toggle
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DataTable, type DataTableColumn } from '@mfs-atomic/ui'

interface MemberRow {
  id: number
  name: string
  role: string
  status: 'Active' | 'Review'
  score: number
}

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'score', label: 'Score', align: 'right' }
]

const rows: MemberRow[] = [
  { id: 1, name: 'Alya Putri', role: 'Design Lead', status: 'Active', score: 96 },
  { id: 2, name: 'Bima Pratama', role: 'Frontend Engineer', status: 'Active', score: 91 },
  { id: 3, name: 'Citra Lestari', role: 'QA Specialist', status: 'Review', score: 88 }
]

const visibleColumns = ref<string[]>(['name', 'role', 'status', 'score'])
<\/script>`

const lazyCodeTabs = [
  {
    label: 'LazyTable.vue',
    language: 'vue',
    code: `<template>
  <DataTable
    v-model:page="page"
    v-model:rows-per-page="rowsPerPage"
    v-model:search-query="query"
    v-model:multi-sort-meta="multiSortMeta"
    :value="rows"
    :columns="columns"
    :total-records="totalRecords"
    :loading="loading"
    sort-mode="multiple"
    lazy
    paginator
    searchable
    @page="loadUsers"
    @sort="loadUsers"
    @update:search-query="loadUsers"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DataTable, type DataTableColumn, type DataTableSortMeta } from '@mfs-atomic/ui'
import { fetchUsers, type UserRow } from './fetchUsers'

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'score', label: 'Score', align: 'right', sortable: true }
]

const page = ref(1)
const rowsPerPage = ref(5)
const query = ref('')
const totalRecords = ref(0)
const loading = ref(false)
const rows = ref<UserRow[]>([])
const multiSortMeta = ref<DataTableSortMeta[]>([])

const loadUsers = async () => {
  loading.value = true
  try {
    const res = await fetchUsers({
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

onMounted(loadUsers)
<\/script>`
  },
  {
    label: 'fetchUsers.ts',
    language: 'ts',
    code: `import type { DataTableSortMeta } from '@mfs-atomic/ui'

export interface UserRow {
  id: number
  name: string
  role: string
  status: 'Active' | 'Review' | 'Offline'
  score: number
}

export interface UserQuery {
  page: number
  perPage: number
  search: string
  sort: DataTableSortMeta[]
}

export async function fetchUsers(
  query: UserQuery
): Promise<{ data: UserRow[]; total: number }> {
  const params = new URLSearchParams({
    page: String(query.page),
    per_page: String(query.perPage),
    q: query.search,
    sort: query.sort.map((s) => \`\${s.key}:\${s.order}\`).join(',')
  })
  const res = await fetch(\`/api/users?\${params.toString()}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

const dataTableApi = {
  props: [
    { name: 'columns', type: 'DataTableColumn[]', description: 'Column definitions ({ key, label, sortable?, width?, align? }).' },
    { name: 'rows', type: 'Record<string, any>[] | number', description: 'Array of row data objects, or rows-per-page count when using :value.' },
    { name: 'value', type: 'Record<string, any>[]', description: 'Alias array of row data objects.' },
    { name: 'rowKey', type: 'string', default: "'id'", description: 'Unique property name used to key and track rows.' },
    { name: 'searchable', type: 'boolean', default: 'false', description: 'Shows a built-in search input in the toolbar.' },
    { name: 'searchQuery', type: 'string', default: "''", description: 'Controlled search query (supports v-model:search-query).' },
    { name: 'selectable', type: "false | 'single' | 'multiple'", default: 'false', description: 'Enables single-row radio or multi-row checkbox selection; false disables selection.' },
    { name: 'selection', type: 'Record<string, any> | Record<string, any>[] | null', default: 'null', description: 'Selected row or array of rows (supports v-model:selection).' },
    { name: 'expandable', type: 'boolean', default: 'false', description: 'Renders an expand chevron column to toggle per-row #expansion detail panels.' },
    { name: 'expandedRows', type: 'Record<string, unknown>[]', default: '[]', description: 'Controlled array of currently expanded row objects (supports v-model:expanded-rows).' },
    { name: 'columnToggle', type: 'boolean', default: 'false', description: 'Shows a Columns dropdown button in the toolbar to toggle column visibility.' },
    { name: 'visibleColumns', type: 'string[]', default: 'all column keys', description: 'Controlled array of visible column keys (supports v-model:visible-columns).' },
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
    { name: 'update:expandedRows', type: '(rows: Record<string, unknown>[]) => void', description: 'Emitted when the list of expanded rows changes.' },
    { name: 'update:visibleColumns', type: '(keys: string[]) => void', description: 'Emitted when toggled visible column keys change.' },
    { name: 'update:searchQuery', type: '(value: string) => void', description: 'Emitted when the search input value changes.' },
    { name: 'update:page', type: '(page: number) => void', description: 'Emitted when the active page changes.' },
    { name: 'update:rows', type: '(rows: number) => void', description: 'Emitted when rows per page changes (rowsPerPage alias).' },
    { name: 'update:rowsPerPage', type: '(rowsPerPage: number) => void', description: 'Emitted when rows per page changes.' },
    { name: 'update:first', type: '(first: number) => void', description: 'Emitted with the new zero-based first row index.' },
    { name: 'update:multiSortMeta', type: '(meta: DataTableSortMeta[]) => void', description: 'Emitted when the active multi-column sort stack changes.' },
    { name: 'page', type: '(payload: { page: number; first: number; rows: number; pageCount: number }) => void', description: 'Emitted on page or page-size changes.' },
    { name: 'sort', type: "(payload: { key: string; order: 'asc' | 'desc' | null; multiSortMeta?: DataTableSortMeta[] }) => void", description: 'Emitted when a sortable column header is clicked.' },
    { name: 'row-click', type: '(row: Record<string, any>) => void', description: 'Emitted when a table row is clicked.' },
    { name: 'row-expand', type: '(row: Record<string, unknown>) => void', description: 'Emitted when a row is expanded.' },
    { name: 'row-collapse', type: '(row: Record<string, unknown>) => void', description: 'Emitted when a row is collapsed.' }
  ],
  slots: [
    { name: 'header', description: 'Custom toolbar content placed before the search input.' },
    { name: 'cell-[key]', description: 'Custom cell template receiving { row, value, column, index }.' },
    { name: 'expansion', description: 'Custom expanded row detail template receiving { row, index }.' },
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
import { ref } from 'vue'
import { DataView, type DataViewLayout } from '@mfs-atomic/ui'

interface PresetItem {
  id: string
  name: string
  tag: string
  description: string
}

const layout = ref<DataViewLayout>('grid')

const items = ref<PresetItem[]>([
  { id: 'clay', name: 'Claymorphism', tag: 'Soft 3D', description: 'Soft 3D tactile surfaces' },
  { id: 'glass', name: 'Glassmorphism', tag: 'Frosted', description: 'Frosted translucent layers' },
  { id: 'neo', name: 'Neumorphism', tag: 'Extruded', description: 'Monochrome soft UI surfaces' }
])
<\/script>`

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
const treeCheckboxSelected = ref<string[]>(['Tree.vue'])
const lastCheckboxNode = ref('')
const treeSingleExpanded = ref<string[]>(['src', 'components'])
const treeSingleSelected = ref<string[]>(['DataTable.vue'])
const lastSingleNode = ref('')
const treeNoneExpanded = ref<string[]>(['src', 'components'])
const lastNoneNode = ref('')

function expandAllTree() {
  treeExpanded.value = ['src', 'components', 'composables']
}

const treeCheckboxCode = `<template>
  <Tree
    v-model:expanded-keys="expanded"
    v-model:selected-keys="selected"
    :nodes="nodes"
    selection-mode="checkbox"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tree, type TreeNode } from '@mfs-atomic/ui'

const nodes: TreeNode[] = [
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
]

const expanded = ref<string[]>(['src', 'components'])
const selected = ref<string[]>(['Tree.vue'])
<\/script>`

const treeSingleCode = `<template>
  <Tree
    v-model:expanded-keys="expanded"
    v-model:selected-keys="selected"
    :nodes="nodes"
    selection-mode="single"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tree, type TreeNode } from '@mfs-atomic/ui'

const nodes: TreeNode[] = [
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
  { key: 'package.json', label: 'package.json' }
]

const expanded = ref<string[]>(['src', 'components'])
const selected = ref<string[]>(['DataTable.vue'])
<\/script>`

const treeNoneCode = `<template>
  <Tree
    v-model:expanded-keys="expanded"
    :nodes="nodes"
    selection-mode="none"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tree, type TreeNode } from '@mfs-atomic/ui'

const nodes: TreeNode[] = [
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
  { key: 'package.json', label: 'package.json' }
]

const expanded = ref<string[]>(['src', 'components'])
<\/script>`

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

interface MemberRow {
  name: string
  role: string
  status: 'Active' | 'Idle'
}

const hideRole = ref(false)
const rows: MemberRow[] = [
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

interface ActivityItem {
  id: number
  title: string
  batch: number
}

const items = ref<ActivityItem[]>([
  { id: 1, title: 'Activity Event #1', batch: 1 },
  { id: 2, title: 'Activity Event #2', batch: 1 }
])
const loading = ref(false)
const hasMore = ref(true)
const error = ref<string | undefined>(undefined)

const loadMore = () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  setTimeout(() => {
    const nextId = items.value.length + 1
    items.value.push({ id: nextId, title: \`Activity Event #\${nextId}\`, batch: 2 })
    hasMore.value = items.value.length < 6
    loading.value = false
  }, 300)
}
<\/script>`

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
