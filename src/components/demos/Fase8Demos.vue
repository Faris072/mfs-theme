<template>
  <!-- SplitButton -->
  <ComponentPreview
    v-if="activeSlug === 'split-button'"
    title="SplitButton"
    description="Primary action button paired with a dropdown menu of secondary actions."
    :code="splitButtonCode"
    :api="splitButtonApi"
  >
    <div class="demo-stack">
      <div class="demo-row">
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
      <div class="demo-readout">
        <span class="demo-readout-label">last event:</span>
        <code>{{ lastSplitEvent }}</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- SpeedDial -->
  <ComponentPreview
    v-else-if="activeSlug === 'speed-dial'"
    title="SpeedDial"
    description="Floating action button expanding into linear or radial quick actions."
    :code="speedDialCode"
    :api="speedDialApi"
  >
    <div class="demo-stack">
      <div class="demo-row">
        <Button
          size="sm"
          :variant="dialType === 'linear' ? 'primary' : 'surface'"
          @click="dialType = 'linear'"
        >
          Linear
        </Button>
        <Button
          size="sm"
          :variant="dialType === 'radial' ? 'primary' : 'surface'"
          @click="dialType = 'radial'"
        >
          Radial
        </Button>
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

      <div class="demo-dial-stage">
        <SpeedDial
          v-model="dialOpen"
          :items="dialItems"
          :type="dialType"
          :direction="dialDir"
          :radius="72"
          @select="(item) => (lastDialAction = item.label)"
        />
      </div>

      <div class="demo-readout">
        <span class="demo-readout-label">open:</span>
        <code>{{ dialOpen }}</code>
        <span class="demo-readout-label">· selected:</span>
        <code>{{ lastDialAction }}</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- Panel -->
  <ComponentPreview
    v-else-if="activeSlug === 'panel'"
    title="Panel"
    description="Collapsible content container with header, icon actions, and footer slots."
    :code="panelCode"
    :api="panelApi"
  >
    <div class="demo-stack">
      <div class="demo-row">
        <Button size="sm" variant="surface" @click="panelCollapsed = !panelCollapsed">
          {{ panelCollapsed ? 'Expand Panel' : 'Collapse Panel' }}
        </Button>
      </div>

      <Panel v-model:collapsed="panelCollapsed" header="Release Summary" toggleable>
        <template #icons>
          <Badge variant="success">v2.4</Badge>
        </template>
        <p class="demo-copy">
          Panels group related settings or status details and adapt smoothly across Clay, Glass, and Neo themes.
        </p>
        <template #footer>
          <span>Updated 5 minutes ago</span>
        </template>
      </Panel>

      <div class="demo-readout">
        <span class="demo-readout-label">collapsed:</span>
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
    <div class="demo-grid">
      <Fieldset v-model:collapsed="fieldsetCollapsed" legend="Theme Preferences" toggleable>
        <p class="demo-copy">
          Toggleable fieldset content collapses smoothly using CSS grid row transitions.
        </p>
      </Fieldset>

      <Fieldset>
        <template #legend>
          <span>Custom Legend Slot</span>
        </template>
        <p class="demo-copy">
          Static fieldset with custom legend markup and full keyboard accessibility.
        </p>
      </Fieldset>
    </div>
  </ComponentPreview>

  <!-- Splitter -->
  <ComponentPreview
    v-else-if="activeSlug === 'splitter'"
    title="Splitter"
    description="Resizable two-pane container supporting pointer drag and arrow-key resizing."
    :code="splitterCode"
    :api="splitterApi"
  >
    <div class="demo-stack">
      <div class="demo-row">
        <Button
          size="sm"
          :variant="splitLayout === 'horizontal' ? 'primary' : 'surface'"
          @click="splitLayout = 'horizontal'"
        >
          Horizontal
        </Button>
        <Button
          size="sm"
          :variant="splitLayout === 'vertical' ? 'primary' : 'surface'"
          @click="splitLayout = 'vertical'"
        >
          Vertical
        </Button>
      </div>

      <Splitter
        :key="splitLayout"
        :layout="splitLayout"
        :initial-size="45"
        :min-size="20"
        class="demo-splitter"
        @resize="(s) => (splitSize = Math.round(s))"
      >
        <template #first>
          <div class="demo-pane">
            <strong>Pane 1</strong>
            <span>Drag the divider or focus it and use Arrow keys.</span>
          </div>
        </template>
        <template #second>
          <div class="demo-pane">
            <strong>Pane 2</strong>
            <span>Adapts to horizontal and vertical layouts.</span>
          </div>
        </template>
      </Splitter>

      <div class="demo-readout">
        <span class="demo-readout-label">first pane:</span>
        <code>{{ splitSize }}%</code>
      </div>
    </div>
  </ComponentPreview>

  <!-- Toolbar -->
  <ComponentPreview
    v-else-if="activeSlug === 'toolbar'"
    title="Toolbar"
    description="Responsive action bar with start, center, and end slot regions."
    :code="toolbarCode"
    :api="toolbarApi"
  >
    <div class="demo-stack">
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

      <div class="demo-readout">
        <span class="demo-readout-label">last action:</span>
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
      <div class="demo-scroll-list">
        <div v-for="n in 12" :key="n" class="demo-scroll-item">
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
    <div class="demo-stack">
      <div class="demo-row">
        <Button size="sm" :variant="fluidPadded ? 'primary' : 'surface'" @click="fluidPadded = !fluidPadded">
          padded: {{ fluidPadded }}
        </Button>
      </div>
      <Fluid tag="section" :padded="fluidPadded" class="demo-fluid-box">
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
    <div class="demo-stack">
      <div class="demo-row">
        <Button size="sm" variant="surface" @click="resetDeferred">Replay Deferred Load</Button>
      </div>

      <Deferred :key="deferredKey" root-margin="0px" :threshold="0.1" @load="onDeferredLoad">
        <template #placeholder>
          <div class="demo-deferred-box">Waiting for intersection...</div>
        </template>
        <div class="demo-deferred-loaded">
          <strong>Deferred Content Mounted</strong>
          <span>Triggered via IntersectionObserver.</span>
        </div>
      </Deferred>

      <div class="demo-readout">
        <span class="demo-readout-label">loads:</span>
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
import { SplitButton } from 'mfs-theme'

const items = [
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
const dialOpen = ref(false)
const dialType = ref<'linear' | 'radial'>('linear')
const dialDir = ref<'up' | 'down' | 'left' | 'right'>('right')
const lastDialAction = ref('None')
const dialItems: SpeedDialItem[] = [
  { label: 'Edit' },
  { label: 'Share' },
  { label: 'Star' },
  { label: 'Delete' }
]

const speedDialCode = `<script setup lang="ts">
import { ref } from 'vue'
import { SpeedDial } from 'mfs-theme'

const open = ref(false)
const items = [
  { label: 'Edit' },
  { label: 'Share' },
  { label: 'Star' }
]
<\/script>

<template>
  <SpeedDial v-model="open" :items="items" type="linear" direction="right" />
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
import { Panel } from 'mfs-theme'

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
  <Fieldset legend="Theme Preferences" toggleable>
    <p>Fieldset body content</p>
  </Fieldset>
</template>`

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
const splitLayout = ref<'horizontal' | 'vertical'>('horizontal')
const splitSize = ref(45)

const splitterCode = `<template>
  <Splitter layout="horizontal" :initial-size="45" :min-size="20">
    <template #first>Pane 1</template>
    <template #second>Pane 2</template>
  </Splitter>
</template>`

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
    <template #start><Button size="sm">New</Button></template>
    <template #center><Badge>Workspace</Badge></template>
    <template #end><Button size="sm" variant="danger">Delete</Button></template>
  </Toolbar>
</template>`

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
    <p>Scrollable content...</p>
  </ScrollPanel>
</template>`

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
  <Fluid tag="section" padded>
    <Input label="Full-Width Input" />
  </Fluid>
</template>`

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
    <template #placeholder>Loading...</template>
    <div>Mounted when visible</div>
  </Deferred>
</template>`

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
.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 18px;
  align-items: start;
}

.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.demo-copy {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--text);
}

.demo-readout {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm, 10px);
  background: var(--surface-alt);
  border: 1px solid var(--border, transparent);
  font-size: 0.8rem;
  color: var(--text);
}

.demo-readout-label {
  color: var(--text-muted);
  font-weight: 600;
}

.demo-readout code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.demo-dial-stage {
  min-height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: var(--radius-sm, 12px);
  background: var(--surface-alt);
  border: 1px dashed var(--border, rgba(148, 163, 184, 0.35));
}

.demo-splitter {
  min-height: 190px;
}

.demo-pane {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.88rem;
  color: var(--text);
}

.demo-pane span {
  color: var(--text-muted);
}

.demo-scroll-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-scroll-item {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
  padding: 10px 12px;
  border-radius: var(--radius-sm, 10px);
  background: var(--surface-alt);
  font-size: 0.86rem;
  color: var(--text);
}

.demo-scroll-item span {
  color: var(--text-muted);
}

.demo-fluid-box {
  border: 1px dashed var(--border, rgba(148, 163, 184, 0.35));
  border-radius: var(--radius-sm, 12px);
  padding-block: 12px;
}

.demo-deferred-box,
.demo-deferred-loaded {
  padding: 18px;
  border-radius: var(--radius-sm, 12px);
  background: var(--surface-alt);
  border: 1px solid var(--border, transparent);
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.9rem;
  color: var(--text);
}

.demo-deferred-loaded span {
  color: var(--text-muted);
  font-size: 0.82rem;
}
</style>
