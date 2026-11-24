<template>
  <!-- Navbar -->
  <ComponentPreview
    v-if="activeSlug === 'navbar'"
    title="Navbar"
    description="Responsive top navigation bar with brand, links, actions, and mobile drawer."
    :code="navbarCode"
    :api="navbarApi"
  >
    <div class="mfs-stack mfs-w-full">
      <Navbar :items="navItems" :sticky="false" @navigate="onNavbarNavigate">
        <template #brand>
          <span class="mfs-inline-flex mfs-items-center mfs-gap-2">
            <span class="demo-brand__dot" aria-hidden="true" />
            <span>MFS UI</span>
          </span>
        </template>
        <template #actions>
          <Button size="sm" variant="primary" @click="lastNavLabel = 'Get Started'">
            Get Started
          </Button>
        </template>
      </Navbar>

      <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
        Active route: <strong>{{ lastNavLabel }}</strong>
      </p>
    </div>
  </ComponentPreview>

  <!-- Tabs -->
  <ComponentPreview
    v-else-if="activeSlug === 'tabs'"
    title="Tabs"
    description="Accessible tab switcher with animated active indicator and arrow-key navigation."
    :code="tabsCode"
    :api="tabsApi"
  >
    <Tabs v-model="activeTab" :items="tabItems">
      <template #default="{ activeKey }">
        <div class="mfs-p-4 mfs-rounded-md mfs-surface-subtle">
          <template v-if="activeKey === 'overview'">
            <h4 class="mfs-mt-0 mfs-mb-1 mfs-text-base mfs-font-bold mfs-text">Overview</h4>
            <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
              Switch between Claymorphism, Glassmorphism, and Neumorphism without changing component markup.
            </p>
          </template>
          <template v-else-if="activeKey === 'tokens'">
            <h4 class="mfs-mt-0 mfs-mb-1 mfs-text-base mfs-font-bold mfs-text">Design Tokens</h4>
            <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
              Powered by CSS custom properties for surfaces, shadows, borders, and blur effects.
            </p>
          </template>
          <template v-else-if="activeKey === 'accessibility'">
            <h4 class="mfs-mt-0 mfs-mb-1 mfs-text-base mfs-font-bold mfs-text">Accessibility</h4>
            <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
              Full keyboard support with ArrowLeft, ArrowRight, Home, and End keys plus ARIA roles.
            </p>
          </template>
        </div>
      </template>
    </Tabs>
  </ComponentPreview>

  <!-- Breadcrumb -->
  <ComponentPreview
    v-else-if="activeSlug === 'breadcrumb'"
    title="Breadcrumb"
    description="Hierarchical path trail with chevron or slash separators and clickable ancestors."
    :code="breadcrumbCode"
    :api="breadcrumbApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-flex mfs-flex-col mfs-gap-2">
        <span class="mfs-caption mfs-font-semibold">Chevron (default)</span>
        <Breadcrumb :items="breadcrumbItems" @navigate="onBreadcrumbNavigate" />
      </div>

      <div class="mfs-flex mfs-flex-col mfs-gap-2">
        <span class="mfs-caption mfs-font-semibold">Slash separator</span>
        <Breadcrumb :items="breadcrumbItems" separator="slash" @navigate="onBreadcrumbNavigate" />
      </div>

      <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
        Last clicked: <strong>{{ lastBreadcrumb }}</strong>
      </p>
    </div>
  </ComponentPreview>

  <!-- Pagination -->
  <ComponentPreview
    v-else-if="activeSlug === 'pagination'"
    title="Pagination"
    description="Page navigation with boundary controls, page-size selector, and optional jump input."
    :code="paginationCode"
    :api="paginationApi"
  >
    <div class="mfs-stack mfs-w-full">
      <Pagination
        v-model="currentPage"
        v-model:per-page="perPage"
        :total="240"
        :per-page-options="[10, 20, 50]"
        show-jump-to
      />
      <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
        Showing page <strong>{{ currentPage }}</strong> of <strong>{{ totalPages }}</strong> ({{ perPage }} items / page)
      </p>
    </div>
  </ComponentPreview>

  <!-- Steps -->
  <ComponentPreview
    v-else-if="activeSlug === 'steps'"
    title="Steps"
    description="Multi-step progress indicator for wizards and sequential workflows."
    :code="stepsCode"
    :api="stepsApi"
  >
    <div class="mfs-stack mfs-w-full">
      <Steps v-model="currentStep" :items="stepItems" clickable />

      <div class="mfs-p-4 mfs-rounded-md mfs-surface-subtle mfs-row mfs-justify-between">
        <div>
          <h4 class="mfs-mt-0 mfs-mb-1 mfs-text-base mfs-font-bold mfs-text">
            Step {{ currentStep + 1 }}: {{ stepItems[currentStep]?.label }}
          </h4>
          <p class="mfs-m-0 mfs-text-sm mfs-text-muted">{{ stepItems[currentStep]?.description }}</p>
        </div>

        <div class="mfs-inline-flex mfs-gap-2">
          <Button
            size="sm"
            variant="secondary"
            :disabled="currentStep === 0"
            @click="currentStep = Math.max(0, currentStep - 1)"
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="primary"
            :disabled="currentStep >= stepItems.length - 1"
            @click="currentStep = Math.min(stepItems.length - 1, currentStep + 1)"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  </ComponentPreview>

  <!-- ContextMenu -->
  <ComponentPreview
    v-else-if="activeSlug === 'context-menu'"
    title="ContextMenu"
    description="Right-click or trigger-bound contextual menu with viewport clamping and keyboard navigation."
    :code="contextMenuCode"
    :api="contextMenuApi"
  >
    <div class="mfs-stack mfs-w-full">
      <ContextMenu ref="contextMenuRef" :items="contextItems" @select="onContextSelect">
        <div class="mfs-flex mfs-flex-col mfs-items-center mfs-justify-center mfs-gap-2 mfs-p-5 mfs-text-center mfs-rounded-md mfs-surface-subtle demo-context-zone" tabindex="0">
          <p class="mfs-m-0 mfs-font-semibold mfs-text">Right-click anywhere in this zone</p>
          <p class="mfs-m-0 mfs-caption">
            Or use the button below on touch devices.
          </p>
          <Button size="sm" variant="secondary" @click="openContextAtButton">
            Open Menu
          </Button>
        </div>
      </ContextMenu>

      <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
        Last action: <strong>{{ lastContextAction }}</strong>
      </p>
    </div>
  </ComponentPreview>

  <!-- ScrollTop -->
  <ComponentPreview
    v-else-if="activeSlug === 'scroll-top'"
    title="ScrollTop"
    description="Floating back-to-top button that appears once scroll offset passes the threshold."
    :code="scrollTopCode"
    :api="scrollTopApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div id="scroll-top-demo-box" ref="scrollBoxRef" class="mfs-p-3 mfs-rounded-md mfs-surface-subtle demo-scroll-box">
        <div class="mfs-row mfs-justify-between mfs-gap-2 mfs-py-2 mfs-mb-2 mfs-border-b mfs-text-sm mfs-font-semibold mfs-text">
          <span>Scroll inside this container (threshold: 80px)</span>
          <Button size="sm" variant="secondary" @click="scrollDemoDown">
            Scroll Down
          </Button>
        </div>
        <p v-for="n in 12" :key="n" class="mfs-mt-0 mfs-mb-3 mfs-text-sm mfs-text-muted">
          Line {{ n }} — Scroll down past 80px to reveal the floating ScrollTop button at bottom-right.
        </p>
      </div>

      <ScrollTop target="#scroll-top-demo-box" :threshold="80" />
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import {
  Breadcrumb,
  Button,
  ContextMenu,
  Navbar,
  Pagination,
  ScrollTop,
  Steps,
  Tabs
} from '../../lib'
import type { NavItem } from '../../lib/components/Navbar.vue'
import type { TabItem } from '../../lib/components/Tabs.vue'
import type { BreadcrumbItem } from '../../lib/components/Breadcrumb.vue'
import type { StepItem } from '../../lib/components/Steps.vue'
import type { ContextMenuItem } from '../../lib/components/ContextMenu.vue'

defineProps<{ activeSlug: string }>()

/* ---------- Navbar ---------- */
const lastNavLabel = ref('Home')
const navItems = computed<NavItem[]>(() => [
  { label: 'Home', active: lastNavLabel.value === 'Home' },
  { label: 'Components', active: lastNavLabel.value === 'Components' },
  { label: 'Themes', active: lastNavLabel.value === 'Themes' },
  { label: 'Docs', active: lastNavLabel.value === 'Docs' }
])

const onNavbarNavigate = (item: NavItem) => {
  lastNavLabel.value = item.label
}

const navbarCode = `<template>
  <Navbar :items="navItems" @navigate="onNavigate">
    <template #brand>
      <strong>MFS UI</strong>
    </template>
    <template #actions>
      <Button size="sm" variant="primary">Get Started</Button>
    </template>
  </Navbar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Navbar, Button } from '@mfs-atomic/theme'

const active = ref('Home')
const navItems = [
  { label: 'Home', active: true },
  { label: 'Components' },
  { label: 'Themes' }
]
const onNavigate = (item: { label: string }) => {
  active.value = item.label
}
<\/script>`

const navbarApi = {
  props: [
    { name: 'items', type: 'NavItem[]', default: '[]', description: 'Navigation link definitions ({ label, to, href, active }).' },
    { name: 'sticky', type: 'boolean', default: 'true', description: 'Pins the navbar to the top of the viewport on scroll.' },
    { name: 'bordered', type: 'boolean', default: 'true', description: 'Applies theme border around the navbar container.' }
  ],
  events: [
    { name: 'navigate', type: '(item: NavItem, event: MouseEvent) => void', description: 'Emitted when a desktop or mobile navigation item is clicked.' }
  ],
  slots: [
    { name: 'brand', description: 'Left-aligned brand logo or title.' },
    { name: 'links', description: 'Custom navigation links list; receives { items, navigate }.' },
    { name: 'actions', description: 'Right-aligned action buttons next to the mobile menu toggle.' }
  ]
}

/* ---------- Tabs ---------- */
const activeTab = ref('overview')
const tabItems: TabItem[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'tokens', label: 'Tokens' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'disabled', label: 'Disabled', disabled: true }
]

const tabsCode = `<template>
  <Tabs v-model="activeTab" :items="tabItems">
    <template #default="{ activeKey }">
      <p>Active panel: {{ activeKey }}</p>
    </template>
  </Tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Tabs } from '@mfs-atomic/theme'

const activeTab = ref('overview')
const tabItems = [
  { key: 'overview', label: 'Overview' },
  { key: 'tokens', label: 'Tokens' },
  { key: 'accessibility', label: 'Accessibility' },
  { key: 'disabled', label: 'Disabled', disabled: true }
]
<\/script>`

const tabsApi = {
  props: [
    { name: 'items', type: 'TabItem[]', default: '—', description: 'Required array of tab definitions ({ key, label, disabled }).' },
    { name: 'modelValue', type: 'string', default: 'undefined', description: 'Active tab key for v-model binding.' },
    { name: 'scrollable', type: 'boolean', default: 'true', description: 'Allows horizontal scrolling on narrow viewports.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(key: string) => void', description: 'Emitted when the active tab changes.' },
    { name: 'change', type: '(key: string) => void', description: 'Emitted alongside update:modelValue when a tab is selected.' }
  ],
  slots: [
    { name: 'default', description: 'Tab panel content; receives { activeKey }.' },
    { name: 'tab', description: 'Custom tab button label; receives { item, active }.' }
  ]
}

/* ---------- Breadcrumb ---------- */
const lastBreadcrumb = ref('None yet')
const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home' },
  { label: 'Components' },
  { label: 'Navigation' },
  { label: 'Breadcrumb' }
]

const onBreadcrumbNavigate = (item: BreadcrumbItem) => {
  lastBreadcrumb.value = item.label
}

const breadcrumbCode = `<template>
  <Breadcrumb :items="items" separator="chevron" @navigate="onNavigate" />
</template>

<script setup lang="ts">
import { Breadcrumb } from '@mfs-atomic/theme'

const items = [
  { label: 'Home' },
  { label: 'Components' },
  { label: 'Breadcrumb' }
]
const onNavigate = (item: { label: string }) => console.log(item.label)
<\/script>`

const breadcrumbApi = {
  props: [
    { name: 'items', type: 'BreadcrumbItem[]', default: '—', description: 'Required ordered path items ({ label, href, to, disabled }).' },
    { name: 'separator', type: "'slash' | 'chevron'", default: "'chevron'", description: 'Built-in separator style between items.' }
  ],
  events: [
    { name: 'navigate', type: '(item: BreadcrumbItem, event: MouseEvent) => void', description: 'Emitted when a non-leaf ancestor item is clicked.' }
  ],
  slots: [
    { name: 'separator', description: 'Custom separator element between breadcrumb items.' },
    { name: 'item', description: 'Custom item renderer; receives { item, isLast }.' }
  ]
}

/* ---------- Pagination ---------- */
const currentPage = ref(1)
const perPage = ref(10)
const totalPages = computed(() => Math.max(1, Math.ceil(240 / perPage.value)))

const paginationCode = `<template>
  <Pagination
    v-model="page"
    v-model:per-page="perPage"
    :total="240"
    :per-page-options="[10, 20, 50]"
    show-jump-to
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from '@mfs-atomic/theme'

const page = ref(1)
const perPage = ref(10)
<\/script>`

const paginationApi = {
  props: [
    { name: 'modelValue', type: 'number', default: '—', description: 'Required current 1-based page number.' },
    { name: 'total', type: 'number', default: '—', description: 'Required total number of items.' },
    { name: 'perPage', type: 'number', default: '10', description: 'Number of items displayed per page.' },
    { name: 'perPageOptions', type: 'number[]', default: '[10, 20, 50, 100]', description: 'Selectable page-size options; pass [] to hide selector.' },
    { name: 'showJumpTo', type: 'boolean', default: 'false', description: 'Shows numeric input form to jump directly to a page.' },
    { name: 'siblingCount', type: 'number', default: '1', description: 'Number of sibling page buttons shown around the current page.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(page: number) => void', description: 'Emitted when the active page changes.' },
    { name: 'update:perPage', type: '(perPage: number) => void', description: 'Emitted when the per-page selector changes.' },
    { name: 'change', type: '(payload: { page: number; perPage: number }) => void', description: 'Emitted whenever page or perPage updates.' }
  ]
}

/* ---------- Steps ---------- */
const currentStep = ref(1)
const stepItems: StepItem[] = [
  { label: 'Account', description: 'Create your credentials' },
  { label: 'Profile', description: 'Add display name & theme' },
  { label: 'Preferences', description: 'Configure notifications' },
  { label: 'Confirm', description: 'Review and finish' }
]

const stepsCode = `<template>
  <Steps v-model="currentStep" :items="stepItems" clickable />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Steps } from '@mfs-atomic/theme'

const currentStep = ref(1)
const stepItems = [
  { label: 'Account', description: 'Create your credentials' },
  { label: 'Profile', description: 'Add display name & theme' },
  { label: 'Confirm', description: 'Review and finish' }
]
<\/script>`

const stepsApi = {
  props: [
    { name: 'items', type: 'StepItem[]', default: '—', description: 'Required step definitions ({ label, description, status }).' },
    { name: 'modelValue', type: 'number', default: '0', description: 'Zero-based index of the active step.' },
    { name: 'clickable', type: 'boolean', default: 'false', description: 'Allows clicking steps to jump directly.' },
    { name: 'direction', type: "'horizontal' | 'vertical' | 'responsive'", default: "'responsive'", description: 'Layout orientation; responsive stacks on mobile.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(index: number) => void', description: 'Emitted when a clickable step is selected.' },
    { name: 'change', type: '(index: number) => void', description: 'Emitted alongside update:modelValue on step click.' }
  ]
}

/* ---------- ContextMenu ---------- */
const contextMenuRef = ref<InstanceType<typeof ContextMenu> | null>(null)
const lastContextAction = ref('None yet')
const contextItems: ContextMenuItem[] = [
  { label: 'Edit Item' },
  { label: 'Duplicate' },
  { label: 'Share Link', disabled: true },
  { divider: true },
  { label: 'Delete', danger: true }
]

const onContextSelect = (item: ContextMenuItem) => {
  lastContextAction.value = item.label ?? 'Action'
}

const openContextAtButton = (event: MouseEvent) => {
  contextMenuRef.value?.open(event)
}

const contextMenuCode = `<template>
  <ContextMenu :items="items" @select="onSelect">
    <div class="target-zone">Right-click anywhere here</div>
  </ContextMenu>
</template>

<script setup lang="ts">
import { ContextMenu } from '@mfs-atomic/theme'

const items = [
  { label: 'Edit Item' },
  { label: 'Duplicate' },
  { divider: true },
  { label: 'Delete', danger: true }
]
const onSelect = (item: { label?: string }) => console.log(item.label)
<\/script>`

const contextMenuApi = {
  props: [
    { name: 'items', type: 'ContextMenuItem[]', default: '—', description: 'Required menu entries ({ label, icon, disabled, divider, danger, action }).' }
  ],
  events: [
    { name: 'select', type: '(item: ContextMenuItem) => void', description: 'Emitted when an enabled menu item is activated.' },
    { name: 'open', type: '() => void', description: 'Emitted when the context menu opens.' },
    { name: 'close', type: '() => void', description: 'Emitted when the context menu closes.' }
  ],
  slots: [
    { name: 'default', description: 'Trigger area that listens for contextmenu events.' },
    { name: 'item', description: 'Custom menu item template; receives { item }.' }
  ]
}

/* ---------- ScrollTop ---------- */
const scrollBoxRef = ref<HTMLElement | null>(null)

const scrollDemoDown = () => {
  scrollBoxRef.value?.scrollTo({ top: 180, behavior: 'smooth' })
}

const scrollTopCode = `<template>
  <div id="scroll-container" style="height: 220px; overflow-y: auto">
    <!-- Long scrollable content -->
  </div>
  <ScrollTop target="#scroll-container" :threshold="80" />
</template>

<script setup lang="ts">
import { ScrollTop } from '@mfs-atomic/theme'
<\/script>`

const scrollTopApi = {
  props: [
    { name: 'threshold', type: 'number', default: '200', description: 'Scroll offset in pixels required before the button appears.' },
    { name: 'behavior', type: "'smooth' | 'auto'", default: "'smooth'", description: 'Scroll behavior passed to scrollTo().' },
    { name: 'target', type: 'string | HTMLElement | null', default: 'null', description: 'Scrollable container selector or element; defaults to window.' }
  ],
  events: [
    { name: 'click', type: '(event: MouseEvent) => void', description: 'Emitted when the scroll-to-top button is clicked.' }
  ],
  slots: [
    { name: 'default', description: 'Custom icon or label inside the floating button.' }
  ]
}
</script>

<style scoped>
.demo-status strong {
  color: var(--text);
}

.demo-brand__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 0 3px var(--surface-subtle);
}

.demo-context-zone {
  min-height: 150px;
  border: 2px dashed var(--border);
  user-select: none;
}

.demo-scroll-box {
  height: 220px;
  overflow-y: auto;
}
</style>
