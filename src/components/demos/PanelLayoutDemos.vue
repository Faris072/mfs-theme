<template>
  <!-- SplitButton -->
  <ComponentPreview
    v-if="activeSlug === 'split-button'"
    title="SplitButton"
    description="Primary action button paired with a dropdown menu of secondary actions."
    :code="splitButtonCode"
    :api="splitButtonApi"
  >
    <div class="mfs-stack">
      <div class="mfs-row">
        <SplitButton
          label="Deploy"
          variant="primary"
          :items="deployItems"
          @click="lastSplitEvent = 'Clicked primary: Deploy'"
          @select="(item) => (lastSplitEvent = `Selected: ${item.label}`)"
        />
        <SplitButton
          label="Export"
          variant="surface"
          size="md"
          :items="exportItems"
          @click="lastSplitEvent = 'Clicked primary: Export'"
          @select="(item) => (lastSplitEvent = `Selected: ${item.label}`)"
        />
        <SplitButton
          label="Publish"
          variant="success"
          size="sm"
          :items="deployItems"
          @click="lastSplitEvent = 'Clicked primary: Publish'"
          @select="(item) => (lastSplitEvent = `Selected: ${item.label}`)"
        />
        <SplitButton label="Disabled" variant="danger" :items="deployItems" disabled />
      </div>
      <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs">
        <span class="mfs-text-muted mfs-font-semibold">last event:</span>
        <code>{{ lastSplitEvent }}</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- SpeedDial -->
  <div v-else-if="activeSlug === 'speed-dial'" class="mfs-stack mfs-gap-6">
    <!-- 1. Linear SpeedDial -->
    <ComponentPreview
      title="Linear SpeedDial"
      description="Floating action button expanding linearly along up, right, down, or left."
      :code="speedDialLinearCode"
      :api="speedDialApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row">
          <Button
            v-for="dir in (['up', 'right', 'down', 'left'] as const)"
            :key="dir"
            size="sm"
            :variant="dialDir === dir ? 'secondary' : 'surface'"
            @click="dialDir = dir"
          >
            {{ dir }}
          </Button>
        </div>

        <div class="mfs-flex mfs-items-center mfs-justify-center mfs-p-6 mfs-rounded-sm mfs-surface-subtle demo-dial-stage">
          <SpeedDial
            v-model="dialLinearOpen"
            :items="dialItems"
            type="linear"
            :direction="dialDir"
            @select="(item) => (lastDialLinearAction = item.label)"
          />
        </div>

        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs">
          <span class="mfs-text-muted mfs-font-semibold">open:</span>
          <code>{{ dialLinearOpen }}</code>
          <span class="mfs-text-muted mfs-font-semibold">· selected:</span>
          <code>{{ lastDialLinearAction }}</code>
        </div>
      </div>
    </ComponentPreview>

    <!-- 2. Radial SpeedDial -->
    <ComponentPreview
      title="Radial SpeedDial"
      description="Floating action button fanning items in a radial arc around the trigger."
      :code="speedDialRadialCode"
    >
      <div class="mfs-stack">
        <div class="mfs-flex mfs-items-center mfs-justify-center mfs-p-6 mfs-rounded-sm mfs-surface-subtle demo-dial-stage">
          <SpeedDial
            v-model="dialRadialOpen"
            :items="dialItems"
            type="radial"
            :radius="72"
            @select="(item) => (lastDialRadialAction = item.label)"
          />
        </div>

        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs">
          <span class="mfs-text-muted mfs-font-semibold">open:</span>
          <code>{{ dialRadialOpen }}</code>
          <span class="mfs-text-muted mfs-font-semibold">· selected:</span>
          <code>{{ lastDialRadialAction }}</code>
        </div>
      </div>
    </ComponentPreview>
  </div>

  <!-- Panel -->
  <ComponentPreview
    v-else-if="activeSlug === 'panel'"
    title="Panel"
    description="Collapsible content container with header, icon actions, and footer slots."
    :code="panelCode"
    :api="panelApi"
  >
    <div class="mfs-stack">
      <div class="mfs-row">
        <Button size="sm" variant="surface" @click="panelCollapsed = !panelCollapsed">
          {{ panelCollapsed ? 'Expand Panel' : 'Collapse Panel' }}
        </Button>
      </div>

      <Panel v-model:collapsed="panelCollapsed" header="Release Summary" toggleable>
        <template #icons>
          <Badge variant="success">v2.4</Badge>
        </template>
        <p class="mfs-m-0 mfs-text-sm mfs-text">
          Panels group related settings or status details and adapt smoothly across Clay, Glass, and Neo themes.
        </p>
        <template #footer>
          <span>Updated 5 minutes ago</span>
        </template>
      </Panel>

      <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs">
        <span class="mfs-text-muted mfs-font-semibold">collapsed:</span>
        <code>{{ panelCollapsed }}</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- Fieldset -->
  <ComponentPreview
    v-else-if="activeSlug === 'fieldset'"
    title="Fieldset"
    description="Semantic fieldset with pill legend and optional collapsible body."
    :code="fieldsetCode"
    :api="fieldsetApi"
  >
    <div class="mfs-grid mfs-items-start">
      <Fieldset v-model:collapsed="fieldsetCollapsed" legend="Theme Preferences" toggleable>
        <p class="mfs-m-0 mfs-text-sm mfs-text">
          Toggleable fieldset content collapses smoothly using CSS grid row transitions.
        </p>
      </Fieldset>

      <Fieldset>
        <template #legend>
          <span>Custom Legend Slot</span>
        </template>
        <p class="mfs-m-0 mfs-text-sm mfs-text">
          Static fieldset with custom legend markup and full keyboard accessibility.
        </p>
      </Fieldset>
    </div>
  </ComponentPreview>

  <!-- Splitter -->
  <div v-else-if="activeSlug === 'splitter'" class="mfs-stack mfs-gap-6">
    <!-- 1. Horizontal Splitter -->
    <ComponentPreview
      title="Horizontal Splitter"
      description="Side-by-side resizable panes supporting pointer drag and arrow-key resizing."
      :code="splitterHorizontalCode"
      :api="splitterApi"
    >
      <div class="mfs-stack">
        <Splitter
          layout="horizontal"
          :initial-size="45"
          :min-size="20"
          class="demo-splitter"
          @resize="(s) => (splitHorizontalSize = Math.round(s))"
        >
          <template #first>
            <div class="mfs-p-4 mfs-flex mfs-flex-col mfs-gap-1 mfs-text-sm mfs-text demo-pane">
              <strong>Pane 1</strong>
              <span>Drag the divider or focus it and use Arrow keys.</span>
            </div>
          </template>
          <template #second>
            <div class="mfs-p-4 mfs-flex mfs-flex-col mfs-gap-1 mfs-text-sm mfs-text demo-pane">
              <strong>Pane 2</strong>
              <span>Side-by-side horizontal split layout.</span>
            </div>
          </template>
        </Splitter>

        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs">
          <span class="mfs-text-muted mfs-font-semibold">first pane:</span>
          <code>{{ splitHorizontalSize }}%</code>
        </div>
      </div>
    </ComponentPreview>

    <!-- 2. Vertical Splitter -->
    <ComponentPreview
      title="Vertical Splitter"
      description="Stacked top-and-bottom resizable panes using layout='vertical'."
      :code="splitterVerticalCode"
    >
      <div class="mfs-stack">
        <Splitter
          layout="vertical"
          :initial-size="45"
          :min-size="20"
          class="demo-splitter"
          @resize="(s) => (splitVerticalSize = Math.round(s))"
        >
          <template #first>
            <div class="mfs-p-4 mfs-flex mfs-flex-col mfs-gap-1 mfs-text-sm mfs-text demo-pane">
              <strong>Top Pane</strong>
              <span>Drag the divider or focus it and use Arrow keys.</span>
            </div>
          </template>
          <template #second>
            <div class="mfs-p-4 mfs-flex mfs-flex-col mfs-gap-1 mfs-text-sm mfs-text demo-pane">
              <strong>Bottom Pane</strong>
              <span>Stacked vertical split layout.</span>
            </div>
          </template>
        </Splitter>

        <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs">
          <span class="mfs-text-muted mfs-font-semibold">first pane:</span>
          <code>{{ splitVerticalSize }}%</code>
        </div>
      </div>
    </ComponentPreview>
  </div>

  <!-- Toolbar -->
  <ComponentPreview
    v-else-if="activeSlug === 'toolbar'"
    title="Toolbar"
    description="Responsive action bar with start, center, and end slot regions."
    :code="toolbarCode"
    :api="toolbarApi"
  >
    <div class="mfs-stack">
      <Toolbar>
        <template #start>
          <Button size="sm" variant="primary" @click="toolbarAction = 'New File'">New</Button>
          <Button size="sm" variant="surface" @click="toolbarAction = 'Saved'">Save</Button>
        </template>
        <template #center>
          <Badge variant="primary">Workspace</Badge>
        </template>
        <template #end>
          <Button size="sm" variant="danger" @click="toolbarAction = 'Deleted'">Delete</Button>
        </template>
      </Toolbar>

      <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs">
        <span class="mfs-text-muted mfs-font-semibold">last action:</span>
        <code>{{ toolbarAction }}</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- ScrollPanel -->
  <ComponentPreview
    v-else-if="activeSlug === 'scroll-panel'"
    title="ScrollPanel"
    description="Scrollable container with themed thin scrollbar and configurable dimensions."
    :code="scrollPanelCode"
    :api="scrollPanelApi"
  >
    <ScrollPanel max-height="190px" width="100%">
      <div class="mfs-flex mfs-flex-col mfs-gap-2">
        <div v-for="n in 12" :key="n" class="mfs-row mfs-justify-between mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-sm mfs-text demo-scroll-item">
          <strong>Entry #{{ n }}</strong>
          <span>Theme-aware scrollable surface item</span>
        </div>
      </div>
    </ScrollPanel>
  </ComponentPreview>

  <!-- Fluid -->
  <ComponentPreview
    v-else-if="activeSlug === 'fluid'"
    title="Fluid"
    description="Full-width responsive wrapper with configurable semantic tag and optional horizontal padding."
    :code="fluidCode"
    :api="fluidApi"
  >
    <div class="mfs-stack">
      <div class="mfs-row">
        <Button size="sm" :variant="fluidPadded ? 'primary' : 'surface'" @click="fluidPadded = !fluidPadded">
          padded: {{ fluidPadded }}
        </Button>
      </div>
      <Fluid tag="section" :padded="fluidPadded" class="mfs-rounded-sm mfs-py-3 demo-fluid-box">
        <Input v-model="fluidText" label="Full-Width Input" placeholder="Stretches to 100% of container" />
      </Fluid>
    </div>
  </ComponentPreview>

  <!-- Deferred -->
  <ComponentPreview
    v-else-if="activeSlug === 'deferred'"
    title="Deferred"
    description="IntersectionObserver wrapper that defers rendering heavy content until visible in the viewport."
    :code="deferredCode"
    :api="deferredApi"
  >
    <div class="mfs-stack">
      <div class="mfs-row">
        <Button size="sm" variant="surface" @click="resetDeferred">Replay Deferred Load</Button>
      </div>

      <Deferred :key="deferredKey" root-margin="0px" :threshold="0.1" @load="onDeferredLoad">
        <template #placeholder>
          <div class="mfs-p-4 mfs-rounded-sm mfs-surface-subtle mfs-flex mfs-flex-col mfs-gap-1 mfs-text-sm mfs-text">Waiting for intersection...</div>
        </template>
        <div class="mfs-p-4 mfs-rounded-sm mfs-surface-subtle mfs-flex mfs-flex-col mfs-gap-1 mfs-text-sm mfs-text demo-deferred-loaded">
          <strong>Deferred Content Mounted</strong>
          <span>Triggered via IntersectionObserver.</span>
        </div>
      </Deferred>

      <div class="mfs-row mfs-gap-2 mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs">
        <span class="mfs-text-muted mfs-font-semibold">loads:</span>
        <code>{{ deferredLoads }}</code>
      </div>
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import type { ApiRow } from '../../data/componentDocs'
import {
  Badge,
  Button,
  Input,
  SplitButton,
  SpeedDial,
  Panel,
  Fieldset,
  Splitter,
  Toolbar,
  ScrollPanel,
  Fluid,
  Deferred
} from '../../lib'
import type { SplitButtonItem } from '../../lib/components/SplitButton.vue'
import type { SpeedDialItem } from '../../lib/components/SpeedDial.vue'

defineProps<{ activeSlug: string }>()

type ApiSpec = {
  props?: ApiRow[]
  events?: ApiRow[]
  slots?: ApiRow[]
}

// ── SplitButton ────────────────────────────────────────────────────────
const lastSplitEvent = ref('None')
const deployItems: SplitButtonItem[] = [
  { label: 'Deploy to Staging', value: 'staging' },
  { label: 'Schedule Release', value: 'schedule' },
  { label: 'Rollback (Disabled)', value: 'rollback', disabled: true }
]
const exportItems: SplitButtonItem[] = [
  { label: 'Export JSON', value: 'json' },
  { label: 'Export CSV', value: 'csv' }
]

const splitButtonCode = `<script setup lang="ts">
import { SplitButton } from '@mfs-atomic/ui'

interface MenuAction {
  label: string
  value: string
}

const items: MenuAction[] = [
  { label: 'Deploy to Staging', value: 'staging' },
  { label: 'Schedule Release', value: 'schedule' }
]
<\/script>

<template>
  <SplitButton label="Deploy" variant="primary" :items="items" />
</template>`

const splitButtonApi: ApiSpec = {
  props: [
    { name: 'label', type: 'string', default: "'Action'", description: 'Primary button label.' },
    { name: 'items', type: 'SplitButtonItem[]', default: '[]', description: 'Dropdown menu items ({ label, value?, icon?, disabled? }).' },
    { name: 'variant', type: "'primary' | 'secondary' | 'surface' | 'success' | 'warning' | 'danger'", default: "'primary'", description: 'Button color variant.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both primary and toggle buttons.' }
  ],
  events: [
    { name: 'click', type: '(event: MouseEvent)', description: 'Emitted when primary button is clicked.' },
    { name: 'select', type: '(item: SplitButtonItem)', description: 'Emitted when a menu item is selected.' }
  ],
  slots: [{ name: 'default', description: 'Custom primary button content (overrides label).' }]
}

// ── SpeedDial ──────────────────────────────────────────────────────────
const dialLinearOpen = ref(false)
const dialRadialOpen = ref(false)
const dialDir = ref<'up' | 'down' | 'left' | 'right'>('right')
const lastDialLinearAction = ref('None')
const lastDialRadialAction = ref('None')
const dialItems: SpeedDialItem[] = [
  { label: 'Edit' },
  { label: 'Share' },
  { label: 'Star' },
  { label: 'Delete' }
]

const speedDialLinearCode = `<script setup lang="ts">
import { ref } from 'vue'
import { SpeedDial } from '@mfs-atomic/ui'

interface SpeedDialItem {
  label: string
}

const open = ref(false)
const items: SpeedDialItem[] = [
  { label: 'Edit' },
  { label: 'Share' },
  { label: 'Star' }
]
<\/script>

<template>
  <SpeedDial v-model="open" :items="items" type="linear" direction="right" />
</template>`

const speedDialRadialCode = `<script setup lang="ts">
import { ref } from 'vue'
import { SpeedDial } from '@mfs-atomic/ui'

interface SpeedDialItem {
  label: string
}

const open = ref(false)
const items: SpeedDialItem[] = [
  { label: 'Edit' },
  { label: 'Share' },
  { label: 'Star' },
  { label: 'Delete' }
]
<\/script>

<template>
  <SpeedDial v-model="open" :items="items" type="radial" :radius="72" />
</template>`

const speedDialApi: ApiSpec = {
  props: [
    { name: 'items', type: 'SpeedDialItem[]', default: '[]', description: 'Action items ({ label, icon?, disabled?, action? }).' },
    { name: 'direction', type: "'up' | 'down' | 'left' | 'right'", default: "'up'", description: 'Expansion direction.' },
    { name: 'type', type: "'linear' | 'radial'", default: "'linear'", description: 'Layout arrangement of action items.' },
    { name: 'radius', type: 'number', default: '76', description: 'Pixel radius when type is radial.' },
    { name: 'modelValue', type: 'boolean', default: 'undefined', description: 'Controlled open state.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(open: boolean)', description: 'Emitted when open state toggles.' },
    { name: 'select', type: '(item: SpeedDialItem)', description: 'Emitted when an action item is clicked.' }
  ],
  slots: [{ name: 'item', description: 'Custom item template receiving { item, index }.' }]
}

// ── Panel ──────────────────────────────────────────────────────────────
const panelCollapsed = ref(false)

const panelCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Panel } from '@mfs-atomic/ui'

const collapsed = ref(false)
<\/script>

<template>
  <Panel v-model:collapsed="collapsed" header="Release Summary" toggleable>
    <p>Panel content</p>
    <template #footer>Updated 5m ago</template>
  </Panel>
</template>`

const panelApi: ApiSpec = {
  props: [
    { name: 'header', type: 'string', description: 'Header title text.' },
    { name: 'toggleable', type: 'boolean', default: 'false', description: 'Shows collapse/expand button.' },
    { name: 'collapsed', type: 'boolean', default: 'undefined', description: 'Controlled collapsed state.' }
  ],
  events: [
    { name: 'update:collapsed', type: '(value: boolean)', description: 'Emitted when collapsed state changes.' },
    { name: 'toggle', type: '(value: boolean)', description: 'Emitted on toggle click.' }
  ],
  slots: [
    { name: 'header', description: 'Custom header title content.' },
    { name: 'icons', description: 'Extra action elements next to the toggle button.' },
    { name: 'default', description: 'Main panel body.' },
    { name: 'footer', description: 'Optional footer region.' }
  ]
}

// ── Fieldset ───────────────────────────────────────────────────────────
const fieldsetCollapsed = ref(false)

const fieldsetCode = `<template>
  <Fieldset v-model:collapsed="collapsed" legend="Theme Preferences" toggleable>
    <p>Toggleable fieldset content collapses smoothly using CSS grid row transitions.</p>
  </Fieldset>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Fieldset } from '@mfs-atomic/ui'

const collapsed = ref(false)
<\/script>`

const fieldsetApi: ApiSpec = {
  props: [
    { name: 'legend', type: 'string', description: 'Legend label text.' },
    { name: 'toggleable', type: 'boolean', default: 'false', description: 'Makes legend clickable to collapse body.' },
    { name: 'collapsed', type: 'boolean', default: 'undefined', description: 'Controlled collapsed state.' }
  ],
  events: [
    { name: 'update:collapsed', type: '(value: boolean)', description: 'Emitted when collapsed state changes.' },
    { name: 'toggle', type: '(value: boolean)', description: 'Emitted on legend toggle.' }
  ],
  slots: [
    { name: 'legend', description: 'Custom legend content.' },
    { name: 'default', description: 'Fieldset body content.' }
  ]
}

// ── Splitter ───────────────────────────────────────────────────────────
const splitHorizontalSize = ref(45)
const splitVerticalSize = ref(45)

const splitterHorizontalCode = `<template>
  <Splitter
    layout="horizontal"
    :initial-size="45"
    :min-size="20"
    @resize="(s) => (size = Math.round(s))"
  >
    <template #first>
      <div>Pane 1 ({{ size }}%)</div>
    </template>
    <template #second>
      <div>Pane 2 ({{ 100 - size }}%)</div>
    </template>
  </Splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Splitter } from '@mfs-atomic/ui'

const size = ref(45)
<\/script>`

const splitterVerticalCode = `<template>
  <Splitter
    layout="vertical"
    :initial-size="45"
    :min-size="20"
    @resize="(s) => (size = Math.round(s))"
  >
    <template #first>
      <div>Top Pane ({{ size }}%)</div>
    </template>
    <template #second>
      <div>Bottom Pane ({{ 100 - size }}%)</div>
    </template>
  </Splitter>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Splitter } from '@mfs-atomic/ui'

const size = ref(45)
<\/script>`

const splitterApi: ApiSpec = {
  props: [
    { name: 'layout', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Split axis orientation.' },
    { name: 'initialSize', type: 'number', default: '50', description: 'Initial percentage size of first pane.' },
    { name: 'minSize', type: 'number', default: '15', description: 'Minimum pane percentage.' }
  ],
  events: [{ name: 'resize', type: '(size: number)', description: 'Emitted when divider moves.' }],
  slots: [
    { name: 'first', description: 'First resizable pane.' },
    { name: 'second', description: 'Second resizable pane.' }
  ]
}

// ── Toolbar ────────────────────────────────────────────────────────────
const toolbarAction = ref('Ready')

const toolbarCode = `<template>
  <Toolbar>
    <template #start>
      <Button size="sm" variant="primary" @click="lastAction = 'New File'">New</Button>
      <Button size="sm" variant="surface" @click="lastAction = 'Saved'">Save</Button>
    </template>
    <template #center>
      <Badge variant="primary">{{ lastAction }}</Badge>
    </template>
    <template #end>
      <Button size="sm" variant="danger" @click="lastAction = 'Deleted'">Delete</Button>
    </template>
  </Toolbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Button, Toolbar } from '@mfs-atomic/ui'

const lastAction = ref('Workspace')
<\/script>`

const toolbarApi: ApiSpec = {
  slots: [
    { name: 'start', description: 'Leading action group.' },
    { name: 'default', description: 'Fallback content inside start group.' },
    { name: 'center', description: 'Centered group.' },
    { name: 'end', description: 'Trailing action group.' }
  ]
}

// ── ScrollPanel ────────────────────────────────────────────────────────
const scrollPanelCode = `<template>
  <ScrollPanel max-height="190px" width="100%">
    <div v-for="n in items" :key="n">Entry #{{ n }}</div>
  </ScrollPanel>
</template>

<script setup lang="ts">
import { ScrollPanel } from '@mfs-atomic/ui'

const items = Array.from({ length: 12 }, (_, i) => i + 1)
<\/script>`

const scrollPanelApi: ApiSpec = {
  props: [
    { name: 'maxHeight', type: 'string | number', default: "'300px'", description: 'Maximum height before scrolling.' },
    { name: 'width', type: 'string | number', description: 'Optional container width.' }
  ],
  slots: [{ name: 'default', description: 'Scrollable inner content.' }]
}

// ── Fluid ──────────────────────────────────────────────────────────────
const fluidPadded = ref(true)
const fluidText = ref('')

const fluidCode = `<template>
  <Fluid tag="section" :padded="padded">
    <Input v-model="text" label="Full-Width Input" placeholder="Stretches to 100% of container" />
  </Fluid>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Fluid, Input } from '@mfs-atomic/ui'

const padded = ref(true)
const text = ref('')
<\/script>`

const fluidApi: ApiSpec = {
  props: [
    { name: 'tag', type: 'string', default: "'div'", description: 'Rendered HTML element tag.' },
    { name: 'padded', type: 'boolean', default: 'false', description: 'Adds 16px inline padding.' }
  ],
  slots: [{ name: 'default', description: 'Full-width child content.' }]
}

// ── Deferred ───────────────────────────────────────────────────────────
const deferredKey = ref(0)
const deferredLoads = ref(0)
const onDeferredLoad = () => {
  deferredLoads.value++
}
const resetDeferred = () => {
  deferredKey.value++
}

const deferredCode = `<template>
  <Deferred root-margin="0px" :threshold="0.1" @load="onLoad">
    <template #placeholder>Waiting for intersection...</template>
    <div>Mounted when visible ({{ loads }} loads)</div>
  </Deferred>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Deferred } from '@mfs-atomic/ui'

const loads = ref(0)
const onLoad = () => {
  loads.value++
}
<\/script>`

const deferredApi: ApiSpec = {
  props: [
    { name: 'rootMargin', type: 'string', default: "'0px'", description: 'IntersectionObserver rootMargin.' },
    { name: 'threshold', type: 'number', default: '0', description: 'IntersectionObserver visibility threshold.' },
    { name: 'once', type: 'boolean', default: 'true', description: 'Disconnects observer after first intersection.' }
  ],
  events: [{ name: 'load', type: '() => void', description: 'Emitted when content becomes visible and mounts.' }],
  slots: [
    { name: 'default', description: 'Deferred content rendered after intersection.' },
    { name: 'placeholder', description: 'Fallback content shown before intersection.' }
  ]
}
</script>

<style scoped>
.demo-dial-stage {
  min-height: 190px;
  border-style: dashed;
}

.demo-splitter {
  min-height: 190px;
}

.demo-pane span,
.demo-scroll-item span {
  color: var(--text-muted);
}

.demo-fluid-box {
  border: 1px dashed var(--border, rgba(148, 163, 184, 0.35));
}

.demo-deferred-loaded span {
  color: var(--text-muted);
  font-size: 0.82rem;
}
</style>
