<template>
  <div class="fase9-demos">
    <!-- Menu -->
    <ComponentPreview
      v-if="activeSlug === 'menu'"
      title="Menu"
      description="Vertical action menu supporting grouped sections, separators, icons, keyboard Escape, and inline or popup mode."
      :code="menuCode"
      :api="menuApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row mfs-gap-2">
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-font-semibold mfs-interactive demo-toggle-btn"
            @click="popupMenuRef?.toggle($event)"
          >
            Toggle Popup Menu
          </button>
          <span class="mfs-caption">Selected: {{ menuSelected }}</span>
        </div>

        <div class="mfs-w-full demo-menu-wrap">
          <Menu :items="menuItems" @select="onMenuSelect" />
        </div>

        <Menu ref="popupMenuRef" :items="menuItems" popup @select="onMenuSelect" />
      </div>
    </ComponentPreview>

    <!-- TieredMenu -->
    <ComponentPreview
      v-else-if="activeSlug === 'tiered-menu'"
      title="TieredMenu"
      description="Multi-level cascading menu with hover/click submenus, separators, icons, and mobile-friendly nested collapse."
      :code="tieredMenuCode"
      :api="tieredMenuApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row mfs-gap-2">
          <span class="mfs-caption">Selected: {{ tieredSelected }}</span>
        </div>

        <div class="demo-tiered-stage">
          <TieredMenu :items="tieredItems" @select="(item) => (tieredSelected = item.label || '—')" />
        </div>
      </div>
    </ComponentPreview>

    <!-- SlideMenu -->
    <ComponentPreview
      v-else-if="activeSlug === 'slide-menu'"
      title="SlideMenu"
      description="Drill-down navigation menu with smooth forward/back slide transitions and automatic breadcrumb header."
      :code="slideMenuCode"
      :api="slideMenuApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row mfs-gap-2">
          <span class="mfs-caption">Selected: {{ slideSelected }}</span>
        </div>

        <SlideMenu
          :items="slideItems"
          back-label="Back"
          menu-width="280px"
          @select="(item) => (slideSelected = item.label)"
        />
      </div>
    </ComponentPreview>

    <!-- PanelMenu -->
    <ComponentPreview
      v-else-if="activeSlug === 'panel-menu'"
      title="PanelMenu"
      description="Collapsible accordion-style navigation panels supporting single or multiple expanded groups and controlled keys."
      :code="panelMenuCode"
      :api="panelMenuApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row mfs-gap-2">
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-font-semibold mfs-interactive demo-toggle-btn"
            :class="{ 'is-active': panelMultiple }"
            :aria-pressed="panelMultiple"
            @click="togglePanelMultiple"
          >
            Multiple: {{ panelMultiple ? 'On' : 'Off' }}
          </button>
          <span class="mfs-caption">
            Expanded: {{ panelExpanded.length ? panelExpanded.join(', ') : 'None' }}
          </span>
          <span class="mfs-caption">· Selected: {{ panelSelected }}</span>
        </div>

        <div class="mfs-w-full demo-menu-wrap">
          <PanelMenu
            v-model:expanded-keys="panelExpanded"
            :items="panelItems"
            :multiple="panelMultiple"
            @select="(item) => (panelSelected = item.label)"
          />
        </div>
      </div>
    </ComponentPreview>

    <!-- MegaMenu -->
    <ComponentPreview
      v-else-if="activeSlug === 'mega-menu'"
      title="MegaMenu"
      description="Responsive multi-column dropdown navigation supporting horizontal and vertical orientations plus mobile drawer toggle."
      :code="megaMenuCode"
      :api="megaMenuApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row mfs-gap-2">
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-font-semibold mfs-interactive demo-toggle-btn"
            :class="{ 'is-active': megaOrientation === 'horizontal' }"
            @click="megaOrientation = 'horizontal'"
          >
            Horizontal
          </button>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-font-semibold mfs-interactive demo-toggle-btn"
            :class="{ 'is-active': megaOrientation === 'vertical' }"
            @click="megaOrientation = 'vertical'"
          >
            Vertical
          </button>
          <span class="mfs-caption">Selected: {{ megaSelected }}</span>
        </div>

        <div class="demo-mega-stage">
          <MegaMenu
            :items="megaItems"
            :orientation="megaOrientation"
            @select="(item) => (megaSelected = item.label)"
          />
        </div>
      </div>
    </ComponentPreview>

    <!-- Dock -->
    <ComponentPreview
      v-else-if="activeSlug === 'dock'"
      title="Dock"
      description="macOS-inspired floating icon dock with proximity magnification, active indicator dot, tooltips, and 4 edge positions."
      :code="dockCode"
      :api="dockApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row mfs-gap-2">
          <button
            v-for="pos in dockPositions"
            :key="pos"
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-font-semibold mfs-interactive demo-toggle-btn"
            :class="{ 'is-active': dockPosition === pos }"
            @click="dockPosition = pos"
          >
            {{ pos }}
          </button>
          <button
            type="button"
            class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-surface-subtle mfs-text-xs mfs-font-semibold mfs-interactive demo-toggle-btn"
            :class="{ 'is-active': dockMagnify }"
            :aria-pressed="dockMagnify"
            @click="dockMagnify = !dockMagnify"
          >
            Magnify: {{ dockMagnify ? 'On' : 'Off' }}
          </button>
        </div>

        <div class="mfs-p-4 mfs-rounded mfs-surface-subtle mfs-flex demo-dock-stage" :class="`demo-dock-stage--${dockPosition}`">
          <Dock
            :items="dockItems"
            :position="dockPosition"
            :magnification="dockMagnify"
            @select="onDockSelect"
          />
        </div>
      </div>
    </ComponentPreview>

    <!-- TabMenu -->
    <ComponentPreview
      v-else-if="activeSlug === 'tab-menu'"
      title="TabMenu"
      description="Animated sliding-indicator tab bar with keyboard arrow navigation, disabled states, and horizontal scroll."
      :code="tabMenuCode"
      :api="tabMenuApi"
    >
      <div class="mfs-stack">
        <TabMenu v-model="activeTab" :items="tabItems" />

        <div class="mfs-p-4 mfs-rounded mfs-surface-subtle">
          <strong>{{ tabItems[activeTab]?.label }}</strong>
          <p class="mfs-mt-2 mfs-mb-0 mfs-text-sm mfs-text-muted">{{ tabDescriptions[activeTab] }}</p>
        </div>
      </div>
    </ComponentPreview>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import Menu, { type MenuItem } from '../../lib/components/Menu.vue'
import TieredMenu, { type TieredMenuItem } from '../../lib/components/TieredMenu.vue'
import SlideMenu, { type SlideMenuItem } from '../../lib/components/SlideMenu.vue'
import PanelMenu, { type PanelMenuItem } from '../../lib/components/PanelMenu.vue'
import MegaMenu, { type MegaMenuItem } from '../../lib/components/MegaMenu.vue'
import Dock, { type DockItem } from '../../lib/components/Dock.vue'
import TabMenu, { type TabMenuItem } from '../../lib/components/TabMenu.vue'
import type { ApiRow } from '../../data/componentDocs'

defineProps<{
  activeSlug: string
}>()

// Menu state
const popupMenuRef = ref<InstanceType<typeof Menu> | null>(null)
const menuSelected = ref('None')
const menuItems: MenuItem[] = [
  {
    label: 'Documents',
    items: [
      { label: 'New File' },
      { label: 'Search' }
    ]
  },
  { separator: true },
  {
    label: 'Account',
    items: [
      { label: 'Profile' },
      { label: 'Settings' },
      { label: 'Billing (Locked)', disabled: true }
    ]
  }
]
const onMenuSelect = (item: MenuItem) => {
  menuSelected.value = item.label || '—'
}

// TieredMenu state
const tieredSelected = ref('None')
const tieredItems: TieredMenuItem[] = [
  {
    label: 'File',
    items: [
      {
        label: 'New',
        items: [
          { label: 'Project' },
          { label: 'Component' }
        ]
      },
      { label: 'Open Recent' },
      { separator: true },
      { label: 'Save' }
    ]
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo' },
      { label: 'Redo' }
    ]
  },
  { separator: true },
  { label: 'Archive', disabled: true },
  { label: 'Quit' }
]

// SlideMenu state
const slideSelected = ref('None')
const slideItems: SlideMenuItem[] = [
  {
    label: 'Workspace',
    items: [
      {
        label: 'Design System',
        items: [
          { label: 'Tokens' },
          { label: 'Typography' }
        ]
      },
      { label: 'Components' }
    ]
  },
  {
    label: 'Team',
    items: [
      { label: 'Members' },
      { label: 'Permissions' }
    ]
  },
  { label: 'Billing', disabled: true }
]

// PanelMenu state
const panelMultiple = ref(true)
const panelExpanded = ref<string[]>(['files'])
const panelSelected = ref('None')
const panelItems: PanelMenuItem[] = [
  {
    key: 'files',
    label: 'Files',
    items: [
      { label: 'New Document' },
      { label: 'Shared Drives' }
    ]
  },
  {
    key: 'analytics',
    label: 'Analytics',
    items: [
      { label: 'Traffic' },
      { label: 'Conversions' }
    ]
  },
  {
    key: 'security',
    label: 'Security',
    disabled: true
  }
]
const togglePanelMultiple = () => {
  panelMultiple.value = !panelMultiple.value
  if (!panelMultiple.value && panelExpanded.value.length > 1) {
    panelExpanded.value = [panelExpanded.value[0]]
  }
}

// MegaMenu state
const megaOrientation = ref<'horizontal' | 'vertical'>('horizontal')
const megaSelected = ref('None')
const megaItems: MegaMenuItem[] = [
  {
    label: 'Products',
    columns: [
      {
        title: 'UI Kits',
        items: [
          { label: 'Clay Theme', description: 'Soft tactile surfaces' },
          { label: 'Glass Theme', description: 'Frosted translucent layers' },
          { label: 'Neo Theme', description: 'Extruded dual shadows' }
        ]
      },
      {
        title: 'Tooling',
        items: [
          { label: 'Token Studio', description: 'Live CSS variable editor' },
          { label: 'CLI Scaffold', description: 'Generate Vue 3 starters' }
        ]
      }
    ]
  },
  {
    label: 'Resources',
    columns: [
      {
        title: 'Learn',
        items: [
          { label: 'Documentation', description: 'Guides & API reference' },
          { label: 'Changelog', description: 'Latest releases' }
        ]
      }
    ]
  },
  { label: 'Pricing' }
]

// Dock state
const dockPositions = ['bottom', 'top', 'left', 'right'] as const
const dockPosition = ref<'bottom' | 'top' | 'left' | 'right'>('bottom')
const dockMagnify = ref(true)
const dockActiveIndex = ref(0)
const dockItems = ref<DockItem[]>([
  { label: 'Finder', active: true },
  { label: 'Terminal', active: false },
  { label: 'Browser', active: false },
  { label: 'Music', active: false },
  { label: 'Settings', active: false }
])
const onDockSelect = (_item: DockItem, index: number) => {
  dockActiveIndex.value = index
  dockItems.value = dockItems.value.map((d, i) => ({ ...d, active: i === index }))
}

// TabMenu state
const activeTab = ref(0)
const tabItems: TabMenuItem[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'components', label: 'Components' },
  { key: 'themes', label: 'Themes' },
  { key: 'locked', label: 'Archive', disabled: true }
]
const tabDescriptions = [
  'Unified multi-theme dashboard summary and quick links.',
  'Browse 40+ responsive Vue 3 components with accessible keyboard navigation.',
  'Switch seamlessly between Claymorphism, Glassmorphism, and Neumorphism.'
]

// Code snippets
const menuCode = `<template>
  <Menu :items="items" @select="onSelect" />
  <button @click="popupRef?.toggle($event)">Open Popup</button>
  <Menu ref="popupRef" :items="items" popup @select="onSelect" />
</template>`

const tieredMenuCode = `<template>
  <TieredMenu :items="items" @select="onSelect" />
</template>`

const slideMenuCode = `<template>
  <SlideMenu :items="items" back-label="Back" menu-width="280px" @select="onSelect" />
</template>`

const panelMenuCode = `<template>
  <PanelMenu v-model:expanded-keys="expanded" :items="items" multiple @select="onSelect" />
</template>`

const megaMenuCode = `<template>
  <MegaMenu :items="items" orientation="horizontal" @select="onSelect" />
</template>`

const dockCode = `<template>
  <Dock :items="items" position="bottom" magnification @select="onSelect" />
</template>`

const tabMenuCode = `<template>
  <TabMenu v-model="activeIndex" :items="items" scrollable />
</template>`

// API Docs
const menuApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'items', type: 'MenuItem[]', description: 'Array of menu items, groups, or separators (required).' },
    { name: 'popup', type: 'boolean', default: 'false', description: 'Renders as a teleported floating popup controlled via open/close/toggle.' }
  ],
  events: [
    { name: 'select', type: '(item: MenuItem) => void', description: 'Emitted when an enabled menu item is activated.' }
  ],
  slots: [
    { name: 'item', description: 'Scoped slot ({ item }) for custom item content.' }
  ]
}

const tieredMenuApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'items', type: 'TieredMenuItem[]', description: 'Hierarchical menu items with optional nested items arrays (required).' }
  ],
  events: [
    { name: 'select', type: '(item: TieredMenuItem) => void', description: 'Emitted when a leaf item is clicked.' }
  ]
}

const slideMenuApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'items', type: 'SlideMenuItem[]', description: 'Nested menu items for drill-down navigation (required).' },
    { name: 'backLabel', type: 'string', default: "'Back'", description: 'Label displayed on the back navigation button.' },
    { name: 'menuWidth', type: 'string', default: "'260px'", description: 'CSS width of the slide menu container.' }
  ],
  events: [
    { name: 'select', type: '(item: SlideMenuItem) => void', description: 'Emitted when a leaf item is selected.' }
  ]
}

const panelMenuApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'items', type: 'PanelMenuItem[]', description: 'Accordion panel items with optional nested sub-items (required).' },
    { name: 'multiple', type: 'boolean', default: 'true', description: 'Allows multiple panels to remain expanded simultaneously.' },
    { name: 'expandedKeys', type: 'string[]', description: 'Controlled array of expanded panel keys.' }
  ],
  events: [
    { name: 'update:expandedKeys', type: '(keys: string[]) => void', description: 'Emitted when expanded panels change.' },
    { name: 'select', type: '(item: PanelMenuItem) => void', description: 'Emitted when a leaf item or header without children is clicked.' }
  ]
}

const megaMenuApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'items', type: 'MegaMenuItem[]', description: 'Top-level items with optional multi-column mega panels (required).' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Menu bar layout orientation.' }
  ],
  events: [
    { name: 'select', type: '(item: MegaMenuItem | MegaMenuLink) => void', description: 'Emitted when a top-level link or panel link is selected.' }
  ]
}

const dockApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'items', type: 'DockItem[]', description: 'Dock items with label, icon, active, and disabled flags (required).' },
    { name: 'position', type: "'bottom' | 'top' | 'left' | 'right'", default: "'bottom'", description: 'Edge alignment and tooltip direction.' },
    { name: 'magnification', type: 'boolean', default: 'true', description: 'Enables proximity hover scaling on dock icons.' }
  ],
  events: [
    { name: 'select', type: '(item: DockItem, index: number) => void', description: 'Emitted when a dock item is clicked.' }
  ],
  slots: [
    { name: 'item', description: 'Scoped slot ({ item, index, active }) for custom dock item icon.' }
  ]
}

const tabMenuApi: { props: ApiRow[]; events: ApiRow[] } = {
  props: [
    { name: 'items', type: 'TabMenuItem[]', description: 'Tab items with label, icon, and optional disabled state (required).' },
    { name: 'modelValue', type: 'number', default: '0', description: 'Active tab index.' },
    { name: 'scrollable', type: 'boolean', default: 'true', description: 'Enables horizontal touch scrolling when tabs overflow.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(index: number) => void', description: 'Emitted when active tab index changes.' },
    { name: 'change', type: '(payload: { index: number; item: TabMenuItem }) => void', description: 'Emitted with index and item on tab selection.' }
  ]
}
</script>

<style scoped>
.demo-toggle-btn {
  text-transform: capitalize;
}

.demo-toggle-btn:hover {
  border-color: var(--primary);
}

.demo-toggle-btn.is-active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.demo-menu-wrap {
  max-width: 300px;
}

.demo-tiered-stage {
  min-height: 220px;
}

.demo-mega-stage {
  min-height: 210px;
}

.demo-dock-stage {
  min-height: 150px;
  border-style: dashed;
}

.demo-dock-stage--bottom {
  align-items: flex-end;
  justify-content: center;
}

.demo-dock-stage--top {
  align-items: flex-start;
  justify-content: center;
}

.demo-dock-stage--left {
  align-items: center;
  justify-content: flex-start;
  min-height: 280px;
}

.demo-dock-stage--right {
  align-items: center;
  justify-content: flex-end;
  min-height: 280px;
}
</style>
