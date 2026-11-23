<template>
  <!-- 1. OrderList -->
  <ComponentPreview
    v-if="activeSlug === 'order-list'"
    title="OrderList"
    description="Reorderable list with keyboard-accessible selection and move-to-top/up/down/bottom controls."
    :code="orderListCode"
    :api="orderListApi"
  >
    <div class="mfs-stack mfs-w-full">
      <OrderList v-model="roadmapItems" header="Release Priorities" item-key="id">
        <template #item="{ item }">
          <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-3 mfs-w-full">
            <span class="mfs-text-sm mfs-font-semibold mfs-text">{{ item.name }}</span>
            <Badge variant="surface" size="sm">{{ item.priority }}</Badge>
          </div>
        </template>
      </OrderList>
      <p class="mfs-m-0 mfs-text-sm mfs-font-semibold mfs-text-muted">
        Current order: {{ roadmapItems.map((i) => i.name).join(' → ') }}
      </p>
    </div>
  </ComponentPreview>

  <!-- 2. PickList -->
  <ComponentPreview
    v-else-if="activeSlug === 'pick-list'"
    title="PickList"
    description="Dual-list transfer control for moving single or all items between source and target lists."
    :code="pickListCode"
    :api="pickListApi"
  >
    <div class="mfs-stack mfs-w-full">
      <PickList
        v-model:source="availablePermissions"
        v-model:target="assignedPermissions"
        source-header="Available Roles"
        target-header="Assigned Roles"
        item-key="id"
      >
        <template #item="{ item }">
          <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-3 mfs-w-full">
            <span class="mfs-text-sm mfs-font-semibold mfs-text">{{ item.label }}</span>
            <span class="mfs-text-xs mfs-text-muted">{{ item.scope }}</span>
          </div>
        </template>
      </PickList>
    </div>
  </ComponentPreview>

  <!-- 3. TreeTable -->
  <ComponentPreview
    v-else-if="activeSlug === 'tree-table'"
    title="TreeTable"
    description="Hierarchical data table with expandable nested rows, custom cell slots, and column alignment."
    :code="treeTableCode"
    :api="treeTableApi"
  >
    <div class="mfs-stack mfs-w-full">
      <TreeTable
        v-model:expanded-keys="treeExpandedKeys"
        :columns="treeColumns"
        :nodes="treeNodes"
      >
        <template #cell-type="{ value }">
          <Badge :variant="value === 'Folder' ? 'primary' : 'surface'" size="sm">
            {{ value }}
          </Badge>
        </template>
      </TreeTable>
    </div>
  </ComponentPreview>

  <!-- 4. OrganizationChart -->
  <ComponentPreview
    v-else-if="activeSlug === 'organization-chart'"
    title="OrganizationChart"
    description="Recursive hierarchy tree with collapsible branches, node-click events, and custom node slots."
    :code="orgChartCode"
    :api="orgChartApi"
  >
    <div class="mfs-stack mfs-w-full">
      <OrganizationChart
        :value="orgTree"
        @node-click="(node) => (selectedOrgNode = `${node.label} (${node.title ?? 'Member'})`)"
      />
      <p class="mfs-m-0 mfs-text-sm mfs-font-semibold mfs-text-muted">Selected node: <strong>{{ selectedOrgNode }}</strong></p>
    </div>
  </ComponentPreview>

  <!-- 5. VirtualScroller -->
  <ComponentPreview
    v-else-if="activeSlug === 'virtual-scroller'"
    title="VirtualScroller"
    description="Windowed list renderer that mounts only visible rows + buffer for smooth scrolling over large datasets."
    :code="virtualScrollerCode"
    :api="virtualScrollerApi"
  >
    <div class="mfs-stack mfs-w-full">
      <p class="mfs-m-0 mfs-text-sm mfs-font-semibold mfs-text-muted">Rendering {{ virtualItems.length.toLocaleString() }} items (itemSize: 44px)</p>
      <VirtualScroller :items="virtualItems" :item-size="44" height="260px" item-key="id">
        <template #item="{ item, index }">
          <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-3 mfs-w-full">
            <span class="mfs-text-sm mfs-font-semibold mfs-text">#{{ index + 1 }} · {{ item.title }}</span>
            <Badge variant="surface" size="sm">{{ item.status }}</Badge>
          </div>
        </template>
      </VirtualScroller>
    </div>
  </ComponentPreview>

  <!-- 6. MeterGroup -->
  <ComponentPreview
    v-else-if="activeSlug === 'meter-group'"
    title="MeterGroup"
    description="Multi-segment proportional progress bar with automatic palette colors and optional legend."
    :code="meterGroupCode"
    :api="meterGroupApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-justify-between">
        <span class="mfs-m-0 mfs-text-sm mfs-font-semibold mfs-text-muted">Storage Breakdown (100 GB total)</span>
        <div class="mfs-row">
          <Button variant="surface" size="sm" @click="bumpAppsMeter(-10)">-10 GB Apps</Button>
          <Button variant="primary" size="sm" @click="bumpAppsMeter(10)">+10 GB Apps</Button>
        </div>
      </div>
      <MeterGroup :values="meterValues" :max="100" show-legend />
    </div>
  </ComponentPreview>

  <!-- 7. Inplace -->
  <ComponentPreview
    v-else-if="activeSlug === 'inplace'"
    title="Inplace"
    description="Click-to-edit inline container switching between a read-only display slot and an interactive content slot."
    :code="inplaceCode"
    :api="inplaceApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row">
        <span class="mfs-m-0 mfs-text-sm mfs-font-semibold mfs-text-muted">Project Name:</span>
        <Inplace v-model:active="inplaceEditing">
          <template #display>
            <span class="mfs-text-sm mfs-font-semibold mfs-text">{{ projectTitle }} (click to edit)</span>
          </template>
          <template #content>
            <Input v-model="projectTitle" placeholder="Project name" />
            <Button variant="primary" size="sm" @click="inplaceEditing = false">Save</Button>
          </template>
        </Inplace>
      </div>
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import type { ApiRow } from '../../data/componentDocs'
import { Badge, Button, Input } from '../../lib'
import OrderList from '../../lib/components/OrderList.vue'
import PickList from '../../lib/components/PickList.vue'
import TreeTable, {
  type TreeTableColumn,
  type TreeTableNode
} from '../../lib/components/TreeTable.vue'
import OrganizationChart, { type OrgChartNode } from '../../lib/components/OrganizationChart.vue'
import VirtualScroller from '../../lib/components/VirtualScroller.vue'
import MeterGroup, { type MeterItem } from '../../lib/components/MeterGroup.vue'
import Inplace from '../../lib/components/Inplace.vue'

defineProps<{
  activeSlug: string
}>()

// 1. OrderList
const roadmapItems = ref([
  { id: 1, name: 'Theme Tokens', priority: 'P0' },
  { id: 2, name: 'Form Controls', priority: 'P1' },
  { id: 3, name: 'Data Tables', priority: 'P1' },
  { id: 4, name: 'Virtual Scroll', priority: 'P2' }
])

// 2. PickList
const availablePermissions = ref([
  { id: 'read', label: 'Viewer', scope: 'Read-only' },
  { id: 'write', label: 'Editor', scope: 'Read & Write' },
  { id: 'billing', label: 'Billing', scope: 'Invoices' }
])
const assignedPermissions = ref([
  { id: 'admin', label: 'Admin', scope: 'Full access' }
])

// 3. TreeTable
const treeExpandedKeys = ref<string[]>(['src'])
const treeColumns: TreeTableColumn[] = [
  { key: 'name', label: 'Name' },
  { key: 'size', label: 'Size', align: 'right', width: '90px' },
  { key: 'type', label: 'Type', align: 'center', width: '110px' }
]
const treeNodes: TreeTableNode[] = [
  {
    key: 'src',
    data: { name: 'src', size: '124 KB', type: 'Folder' },
    children: [
      {
        key: 'src-components',
        data: { name: 'components', size: '86 KB', type: 'Folder' },
        children: [
          { key: 'btn', data: { name: 'Button.vue', size: '4.2 KB', type: 'File' } },
          { key: 'card', data: { name: 'Card.vue', size: '3.1 KB', type: 'File' } }
        ]
      },
      { key: 'main', data: { name: 'main.ts', size: '1.4 KB', type: 'File' } }
    ]
  },
  {
    key: 'pkg',
    data: { name: 'package.json', size: '1.8 KB', type: 'File' }
  }
]

// 4. OrganizationChart
const selectedOrgNode = ref('None')
const orgTree: OrgChartNode = {
  key: 'ceo',
  label: 'Maya Lin',
  title: 'CEO',
  children: [
    {
      key: 'eng',
      label: 'Aria Patel',
      title: 'VP Engineering',
      children: [
        { key: 'fe', label: 'Liam Chen', title: 'Frontend Lead' },
        { key: 'be', label: 'Noah Kim', title: 'Platform Lead' }
      ]
    },
    {
      key: 'des',
      label: 'Elena Rossi',
      title: 'Design Director'
    }
  ]
}

// 5. VirtualScroller
const virtualItems = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  title: `Log Entry ${String(i + 1).padStart(4, '0')}`,
  status: i % 3 === 0 ? 'Synced' : 'Queued'
}))

// 6. MeterGroup
const meterValues = ref<MeterItem[]>([
  { label: 'Apps', value: 28 },
  { label: 'Media', value: 22 },
  { label: 'System', value: 16 },
  { label: 'Backups', value: 12 }
])
const bumpAppsMeter = (delta: number) => {
  const next = Math.min(50, Math.max(5, meterValues.value[0].value + delta))
  meterValues.value = [
    { ...meterValues.value[0], value: next },
    ...meterValues.value.slice(1)
  ]
}

// 7. Inplace
const inplaceEditing = ref(false)
const projectTitle = ref('MFS Design System')

// Code snippets
const orderListCode = `<script setup lang="ts">
import { ref } from 'vue'
import OrderList from 'mfs-theme/components/OrderList.vue'

const items = ref([
  { id: 1, name: 'Theme Tokens' },
  { id: 2, name: 'Form Controls' }
])
<\/script>

<template>
  <OrderList v-model="items" header="Release Priorities" item-key="id">
    <template #item="{ item }">{{ item.name }}</template>
  </OrderList>
</template>`

const pickListCode = `<template>
  <PickList
    v-model:source="available"
    v-model:target="assigned"
    source-header="Available"
    target-header="Selected"
    item-key="id"
  >
    <template #item="{ item }">{{ item.label }}</template>
  </PickList>
</template>`

const treeTableCode = `<template>
  <TreeTable
    v-model:expanded-keys="expandedKeys"
    :columns="columns"
    :nodes="nodes"
  >
    <template #cell-type="{ value }">
      <Badge size="sm">{{ value }}</Badge>
    </template>
  </TreeTable>
</template>`

const orgChartCode = `<template>
  <OrganizationChart :value="orgTree" @node-click="onSelect" />
</template>`

const virtualScrollerCode = `<template>
  <VirtualScroller :items="items" :item-size="44" height="260px" item-key="id">
    <template #item="{ item, index }">
      <span>#{{ index + 1 }} · {{ item.title }}</span>
    </template>
  </VirtualScroller>
</template>`

const meterGroupCode = `<template>
  <MeterGroup
    :values="[
      { label: 'Apps', value: 28 },
      { label: 'Media', value: 22 },
      { label: 'System', value: 16 }
    ]"
    :max="100"
    show-legend
  />
</template>`

const inplaceCode = `<template>
  <Inplace v-model:active="editing">
    <template #display>
      <span>{{ title }} (click to edit)</span>
    </template>
    <template #content>
      <Input v-model="title" />
      <Button size="sm" @click="editing = false">Save</Button>
    </template>
  </Inplace>
</template>`

// API tables
const orderListApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'any[]', description: 'Ordered array of items (v-model).' },
    { name: 'itemKey', type: 'string', default: "'id'", description: 'Property used as unique key for object items.' },
    { name: 'header', type: 'string', default: "''", description: 'Optional header text above the list.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: any[]) => void', description: 'Emitted when items are reordered.' },
    { name: 'reorder', type: '(value: any[]) => void', description: 'Emitted alongside update:modelValue after move.' }
  ],
  slots: [
    { name: 'header', description: 'Custom header content replacing header prop.' },
    { name: 'item', description: 'Item row receiving { item, index, selected }.' }
  ]
}

const pickListApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'source', type: 'any[]', description: 'Source list items (v-model:source).' },
    { name: 'target', type: 'any[]', description: 'Target list items (v-model:target).' },
    { name: 'itemKey', type: 'string', default: "'id'", description: 'Unique key property for object items.' },
    { name: 'sourceHeader', type: 'string', default: "'Available'", description: 'Heading for source panel.' },
    { name: 'targetHeader', type: 'string', default: "'Selected'", description: 'Heading for target panel.' }
  ],
  events: [
    { name: 'update:source', type: '(value: any[]) => void', description: 'Emitted when source list changes.' },
    { name: 'update:target', type: '(value: any[]) => void', description: 'Emitted when target list changes.' },
    { name: 'transfer', type: '(payload: { source: any[]; target: any[] }) => void', description: 'Emitted after any transfer action.' }
  ],
  slots: [
    { name: 'item', description: "Item row receiving { item, index, list: 'source' | 'target' }." }
  ]
}

const treeTableApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'columns', type: 'TreeTableColumn[]', description: 'Column definitions ({ key, label, width?, align? }).' },
    { name: 'nodes', type: 'TreeTableNode[]', description: 'Hierarchical node list ({ key, data, children? }).' },
    { name: 'expandedKeys', type: 'string[]', default: '[]', description: 'Expanded node keys (v-model:expandedKeys).' },
    { name: 'emptyText', type: 'string', default: "'No data available'", description: 'Fallback text when nodes is empty.' }
  ],
  events: [
    { name: 'update:expandedKeys', type: '(keys: string[]) => void', description: 'Emitted when a row expands or collapses.' },
    { name: 'node-toggle', type: '(node: TreeTableNode, expanded: boolean) => void', description: 'Emitted with toggled node and new state.' }
  ],
  slots: [
    { name: 'cell-[key]', description: 'Custom cell renderer receiving { node, value, depth }.' },
    { name: 'empty', description: 'Custom empty state content.' }
  ]
}

const orgChartApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'value', type: 'OrgChartNode', description: 'Root node ({ key, label, title?, children? }).' },
    { name: 'collapsible', type: 'boolean', default: 'true', description: 'Allows toggling child branches.' },
    { name: 'expandedKeys', type: 'string[]', description: 'Optional controlled expanded keys (v-model:expandedKeys).' },
    { name: 'level', type: 'number', default: '0', description: 'Internal recursion depth.' }
  ],
  events: [
    { name: 'update:expandedKeys', type: '(keys: string[]) => void', description: 'Emitted when controlled expandedKeys changes.' },
    { name: 'node-click', type: '(node: OrgChartNode) => void', description: 'Emitted when a node card is clicked or activated.' }
  ],
  slots: [
    { name: 'node', description: 'Custom node card receiving { node, expanded }.' }
  ]
}

const virtualScrollerApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'items', type: 'any[]', description: 'Full dataset array.' },
    { name: 'itemSize', type: 'number', description: 'Fixed pixel height of each row.' },
    { name: 'height', type: 'string', default: "'300px'", description: 'CSS height of the scroll viewport.' },
    { name: 'buffer', type: 'number', default: '3', description: 'Extra items rendered above and below viewport.' },
    { name: 'itemKey', type: 'string', default: "'id'", description: 'Unique key property for object items.' }
  ],
  slots: [
    { name: 'item', description: 'Row template receiving { item, index }.' }
  ]
}

const meterGroupApi: { props: ApiRow[] } = {
  props: [
    { name: 'values', type: 'MeterItem[]', description: 'Array of segments ({ label, value, color? }).' },
    { name: 'max', type: 'number', default: '100', description: 'Maximum total scale value.' },
    { name: 'showLegend', type: 'boolean', default: 'true', description: 'Displays color-coded legend below the bar.' }
  ]
}

const inplaceApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'active', type: 'boolean', default: 'false', description: 'Controls active edit state (v-model:active).' },
    { name: 'closable', type: 'boolean', default: 'true', description: 'Shows built-in close button when active.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents activating the display trigger.' }
  ],
  events: [
    { name: 'update:active', type: '(value: boolean) => void', description: 'Emitted when active state toggles.' },
    { name: 'open', type: '() => void', description: 'Emitted when entering active content mode.' },
    { name: 'close', type: '() => void', description: 'Emitted when returning to display mode.' }
  ],
  slots: [
    { name: 'display', description: 'Read-only trigger content.' },
    { name: 'content', description: 'Interactive edit content shown when active.' }
  ]
}
</script>

