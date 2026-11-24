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

  <!-- 8. ImageCropper -->
  <ComponentPreview
    v-else-if="activeSlug === 'image-cropper'"
    title="ImageCropper"
    description="Interactive client-side image cropper with pan, zoom, rotation, and circle/rect output before upload."
    :code="imageCropperCode"
    :api="imageCropperApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-justify-between">
        <div class="mfs-row">
          <input
            ref="cropperFileInputRef"
            type="file"
            accept="image/*"
            class="mfs-sr-only"
            @change="onCropperFileSelect"
          />
          <Button variant="surface" size="sm" @click="cropperFileInputRef?.click()">
            Choose Image
          </Button>
          <Button
            v-if="cropperSrc !== sampleCropperImage"
            variant="surface"
            size="sm"
            @click="resetSampleImage"
          >
            Reset Sample
          </Button>
        </div>

        <div class="mfs-row">
          <div class="mfs-flex mfs-items-center mfs-gap-2">
            <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">Shape:</span>
            <Button
              :variant="cropShape === 'rect' ? 'primary' : 'surface'"
              size="sm"
              @click="cropShape = 'rect'"
            >
              Rect
            </Button>
            <Button
              :variant="cropShape === 'circle' ? 'primary' : 'surface'"
              size="sm"
              @click="cropShape = 'circle'"
            >
              Circle
            </Button>
          </div>

          <div class="mfs-flex mfs-items-center mfs-gap-2">
            <span class="mfs-text-xs mfs-font-semibold mfs-text-muted">Ratio:</span>
            <Button
              :variant="cropAspectRatio === 1 ? 'primary' : 'surface'"
              size="sm"
              @click="cropAspectRatio = 1"
            >
              1:1
            </Button>
            <Button
              :variant="cropAspectRatio === 16 / 9 ? 'primary' : 'surface'"
              size="sm"
              @click="cropAspectRatio = 16 / 9"
            >
              16:9
            </Button>
          </div>
        </div>
      </div>

      <ImageCropper
        :src="cropperSrc"
        v-model:shape="cropShape"
        :aspect-ratio="cropAspectRatio"
        file-name="avatar-crop.png"
        @crop="onCropComplete"
        @cancel="croppedOutput = null"
      />

      <div class="mfs-surface-subtle mfs-border mfs-rounded-md mfs-p-4 mfs-stack">
        <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-3">
          <span class="mfs-text-sm mfs-font-semibold mfs-text">Pick Image → Instant Crop (Square / Circle)</span>
          <Badge variant="primary" size="sm">FileUpload crop</Badge>
        </div>
        <FileUpload
          crop
          :crop-shape="cropShape"
          :crop-aspect-ratio="cropAspectRatio"
          accept="image/*"
          @select="onCroppedUploadSelect"
          @clear="croppedUploadStatus = 'No cropped image yet'"
        />
        <p class="mfs-m-0 mfs-text-xs mfs-text-muted">
          {{ croppedUploadStatus }}
        </p>
      </div>

      <div class="mfs-surface-subtle mfs-border mfs-rounded-md mfs-p-4 mfs-stack">
        <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-3">
          <span class="mfs-text-sm mfs-font-semibold mfs-text">Cropped Output Preview</span>
          <Badge v-if="croppedOutput" variant="success" size="sm">Ready to Upload</Badge>
          <Badge v-else variant="surface" size="sm">Waiting</Badge>
        </div>

        <div v-if="croppedOutput" class="mfs-flex mfs-flex-wrap mfs-items-center mfs-gap-4">
          <img
            :src="croppedOutput.dataUrl"
            alt="Cropped output preview"
            class="mfs-border mfs-surface"
            :class="cropShape === 'circle' ? 'mfs-rounded-full' : 'mfs-rounded-md'"
            style="width: 96px; height: 96px; object-fit: cover;"
          />
          <div class="mfs-flex mfs-flex-col mfs-gap-1">
            <span class="mfs-text-sm mfs-font-semibold mfs-font-mono mfs-text">
              {{ croppedOutput.file.name }}
            </span>
            <span class="mfs-text-xs mfs-text-muted">
              Size: {{ formatFileSize(croppedOutput.file.size) }} · Type: {{ croppedOutput.file.type }}
            </span>
          </div>
        </div>

        <p v-else class="mfs-m-0 mfs-text-sm mfs-text-muted">
          Pan, zoom, or rotate the image above, then click Apply Crop to inspect the resulting File.
        </p>
      </div>
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import type { ApiRow } from '../../data/componentDocs'
import { Badge, Button, Input, ImageCropper, type ImageCropResult } from '../../lib'
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
import FileUpload from '../../lib/components/FileUpload.vue'

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

// 8. ImageCropper & FileUpload instant crop
const croppedUploadStatus = ref('No cropped image yet')

const onCroppedUploadSelect = (selected: File[]) => {
  const latest = selected[selected.length - 1]
  croppedUploadStatus.value = latest
    ? `Cropped & ready: ${latest.name} (${Math.round(latest.size / 1024)} KB)`
    : 'No cropped image yet'
}

// 8. ImageCropper
const sampleCropperImage =
  'data:image/svg+xml;charset=utf-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4f46e5"/>
          <stop offset="55%" stop-color="#06b6d4"/>
          <stop offset="100%" stop-color="#10b981"/>
        </linearGradient>
      </defs>
      <rect width="640" height="480" fill="url(#sky)"/>
      <circle cx="480" cy="120" r="56" fill="#fde047" opacity="0.92"/>
      <path d="M0 360 L180 210 L320 310 L460 185 L640 330 L640 480 L0 480 Z" fill="#1e293b" opacity="0.72"/>
      <path d="M0 400 L140 295 L290 385 L430 270 L640 400 L640 480 L0 480 Z" fill="#0f172a" opacity="0.88"/>
      <text x="36" y="64" fill="#ffffff" font-family="system-ui, sans-serif" font-size="28" font-weight="700">MFS Theme Sample</text>
    </svg>`
  )

const cropperFileInputRef = ref<HTMLInputElement | null>(null)
const cropperSrc = ref<string>(sampleCropperImage)
const cropShape = ref<'rect' | 'circle'>('rect')
const cropAspectRatio = ref<number>(1)
const croppedOutput = ref<ImageCropResult | null>(null)

const onCropperFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result === 'string') {
      cropperSrc.value = reader.result
      croppedOutput.value = null
    }
  }
  reader.readAsDataURL(file)
}

const resetSampleImage = () => {
  cropperSrc.value = sampleCropperImage
  croppedOutput.value = null
  if (cropperFileInputRef.value) {
    cropperFileInputRef.value.value = ''
  }
}

const onCropComplete = (result: ImageCropResult) => {
  croppedOutput.value = result
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

// Code snippets
const orderListCode = `<script setup lang="ts">
import { ref } from 'vue'
import { OrderList } from '@mfs-atomic/theme'

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

const imageCropperCode = `<script setup lang="ts">
import { ref } from 'vue'
import { ImageCropper, type ImageCropResult } from '@mfs-atomic/theme'

const cropped = ref<ImageCropResult | null>(null)
<\/script>

<template>
  <ImageCropper
    :src="imageSrc"
    shape="circle"
    :aspect-ratio="1"
    file-name="avatar.png"
    @crop="(result) => (cropped = result)"
  />
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

const imageCropperApi: { props: ApiRow[]; events: ApiRow[]; exposed: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'File | string | null', default: 'null', description: 'Bound source or cropped File/data URL (v-model).' },
    { name: 'src', type: 'string | null', default: 'null', description: 'Source image URL or data URL to load into the cropper.' },
    { name: 'aspectRatio', type: 'number', default: '1', description: 'Crop frame width-to-height ratio (e.g. 1 or 16 / 9).' },
    { name: 'shape', type: "'rect' | 'circle'", default: "'rect'", description: 'Crop mask and output clipping shape (v-model:shape).' },
    { name: 'allowShapeToggle', type: 'boolean', default: 'true', description: 'Shows Square / Circle toggle buttons in cropper controls.' },
    { name: 'outputType', type: "'image/png' | 'image/jpeg' | 'image/webp'", default: "'image/png'", description: 'MIME type used when exporting the cropped canvas.' },
    { name: 'outputSize', type: 'number', default: '512', description: 'Target output width in pixels.' },
    { name: 'quality', type: 'number', default: '0.92', description: 'Compression quality (0-1) for JPEG/WebP exports.' },
    { name: 'fileName', type: 'string', default: "'cropped-image.png'", description: 'Filename assigned to the emitted File object.' },
    { name: 'showControls', type: 'boolean', default: 'true', description: 'Displays zoom slider, rotation, reset, and apply buttons.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables panning, zooming, and file selection.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: File | string | null) => void', description: 'Emitted with the cropped File on apply or null on reset.' },
    { name: 'update:shape', type: "(value: 'rect' | 'circle') => void", description: 'Emitted when the Square / Circle toggle changes.' },
    { name: 'crop', type: '(result: ImageCropResult) => void', description: 'Emitted with { blob, dataUrl, file } when crop is applied.' },
    { name: 'cancel', type: '() => void', description: 'Emitted when the crop operation is cancelled or reset.' },
    { name: 'error', type: '(message: string) => void', description: 'Emitted when an image fails to load or export.' }
  ],
  exposed: [
    { name: 'crop', type: '() => Promise<ImageCropResult | null>', description: 'Programmatically exports the current crop region.' },
    { name: 'reset', type: '() => void', description: 'Resets pan, zoom, and rotation back to defaults.' }
  ]
}
</script>

