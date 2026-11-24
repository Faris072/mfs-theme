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
    :code-tabs="breadcrumbCodeTabs"
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
    :code-tabs="paginationCodeTabs"
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
    :code-tabs="stepsCodeTabs"
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

  <!-- CommandPalette -->
  <ComponentPreview
    v-else-if="activeSlug === 'command-palette'"
    title="CommandPalette"
    description="Global ⌘K / Ctrl+K command modal with grouped actions, keyboard navigation, and optional remote search."
    :code="commandPaletteCode"
    :code-tabs="commandPaletteCodeTabs"
    :api="commandPaletteApi"
  >
    <div class="mfs-stack mfs-w-full">
      <Alert severity="info" title="Local Filter vs Remote Search">
        <div class="mfs-stack mfs-gap-1 mfs-text-xs">
          <span>
            <strong>Local Filter (default):</strong> Pass all <code>:items</code> once and let <code>CommandPalette</code> filter by label, group, and description client-side — best for static navigation and small command lists.
          </span>
          <span>
            <strong>Remote Search (<code>:remote="true"</code>):</strong> Disables local filtering so you can debounce <code>@search</code>, toggle <code>:loading</code>, and stream results from a server or API.
          </span>
        </div>
      </Alert>

      <div class="mfs-row mfs-items-center mfs-justify-between mfs-gap-3">
        <div class="mfs-inline-flex mfs-items-center mfs-gap-2">
          <Button variant="primary" size="sm" @click="cmdOpen = true">
            Open Command Palette (⌘K)
          </Button>
          <Button
            variant="surface"
            size="sm"
            @click="cmdRemoteMode = !cmdRemoteMode"
          >
            Mode: {{ cmdRemoteMode ? 'Remote Search' : 'Local Filter' }}
          </Button>
        </div>
        <span class="mfs-text-xs mfs-text-muted">
          Shortcut: <kbd class="mfs-px-2 mfs-py-1 mfs-rounded-sm mfs-surface-subtle">⌘K</kbd> / <kbd class="mfs-px-2 mfs-py-1 mfs-rounded-sm mfs-surface-subtle">Ctrl+K</kbd>
        </span>
      </div>

      <CommandPalette
        v-model="cmdOpen"
        :items="cmdRemoteMode ? cmdRemoteItems : cmdAllItems"
        :remote="cmdRemoteMode"
        :loading="cmdLoading"
        placeholder="Search commands, pages, or actions..."
        @search="onCmdSearch"
        @select="onCmdSelect"
      />

      <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
        Last executed: <strong>{{ lastCmdLabel }}</strong>
      </p>
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import {
  Alert,
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
import CommandPalette, { type CommandItem } from '../../lib/components/CommandPalette.vue'

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
import { Navbar, Button } from '@mfs-atomic/ui'

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
import { Tabs } from '@mfs-atomic/ui'

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
import { Breadcrumb } from '@mfs-atomic/ui'
import { items } from './data'

const onNavigate = (item: { label: string }) => console.log(item.label)
<\/script>`

const breadcrumbCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: breadcrumbCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { BreadcrumbItem } from '@mfs-atomic/ui'

export const items: BreadcrumbItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Components', to: '/components' },
  { label: 'Navigation', to: '/components/navigation' },
  { label: 'Breadcrumb' }
]`
  }
]

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
    :total="total"
    :per-page-options="[10, 20, 50]"
    show-jump-to
    @change="loadPage"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from '@mfs-atomic/ui'
import { fetchUsersPage } from './fetchApi'

const page = ref(1)
const perPage = ref(10)
const total = ref(240)

const loadPage = async (payload: { page: number; perPage: number }) => {
  const res = await fetchUsersPage(payload.page, payload.perPage)
  total.value = res.total
}
<\/script>`

const paginationCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: paginationCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `export interface PaginationParams {
  page: number
  perPage: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  perPage: number
}`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { PaginatedResponse } from './data'

export async function fetchUsersPage<T = Record<string, unknown>>(
  page: number,
  perPage: number
): Promise<PaginatedResponse<T>> {
  const params = new URLSearchParams({
    page: String(page),
    per_page: String(perPage)
  })
  const res = await fetch(\`/api/users?\${params.toString()}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

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
import { Steps } from '@mfs-atomic/ui'
import { stepItems } from './data'

const currentStep = ref(1)
<\/script>`

const stepsCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: stepsCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { StepItem } from '@mfs-atomic/ui'

export const stepItems: StepItem[] = [
  { label: 'Account', description: 'Create your credentials', status: 'finish' },
  { label: 'Profile', description: 'Add display name & theme', status: 'process' },
  { label: 'Preferences', description: 'Configure notifications' },
  { label: 'Confirm', description: 'Review and finish' }
]`
  }
]

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
import { ContextMenu } from '@mfs-atomic/ui'

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
  <div id="scroll-container" ref="scrollBoxRef" style="height: 220px; overflow-y: auto">
    <button type="button" @click="scrollDown">Scroll Down</button>
    <p v-for="n in 12" :key="n">Line {{ n }} — Scroll past 80px to reveal ScrollTop.</p>
  </div>
  <ScrollTop target="#scroll-container" :threshold="80" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ScrollTop } from '@mfs-atomic/ui'

const scrollBoxRef = ref<HTMLElement | null>(null)
const scrollDown = () => {
  scrollBoxRef.value?.scrollTo({ top: 180, behavior: 'smooth' })
}
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

/* ---------- CommandPalette ---------- */
const cmdOpen = ref(false)
const cmdRemoteMode = ref(false)
const cmdLoading = ref(false)
const lastCmdLabel = ref('None')

const cmdAllItems: CommandItem[] = [
  { id: 'new-doc', label: 'New Document', group: 'Actions', description: 'Create a blank workspace page', shortcut: '⌘N' },
  { id: 'toggle-theme', label: 'Switch Theme', group: 'Actions', description: 'Cycle Clay, Glass, and Neo', shortcut: '⌘T' },
  { id: 'go-users', label: 'Team Directory', group: 'Navigation', description: 'Jump to DataTable demo' },
  { id: 'go-settings', label: 'Workspace Settings', group: 'Navigation', description: 'Configure API & billing', disabled: true }
]
const cmdRemoteItems = ref<CommandItem[]>(cmdAllItems)
let cmdTimer: ReturnType<typeof setTimeout> | null = null

const onCmdSearch = (q: string) => {
  if (!cmdRemoteMode.value) return
  if (cmdTimer) clearTimeout(cmdTimer)
  cmdLoading.value = true
  const query = q.trim().toLowerCase()
  cmdTimer = setTimeout(() => {
    cmdRemoteItems.value = query
      ? cmdAllItems.filter((item) => item.label.toLowerCase().includes(query))
      : cmdAllItems
    cmdLoading.value = false
  }, 240)
}

const onCmdSelect = (item: CommandItem) => {
  lastCmdLabel.value = `${item.label} (${item.id})`
}

const commandPaletteCode = `<template>
  <Button @click="open = true">Open (⌘K)</Button>

  <CommandPalette
    v-model="open"
    :items="items"
    :loading="loading"
    remote
    @search="onSearch"
    @select="onSelect"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, CommandPalette, type CommandItem } from '@mfs-atomic/ui'
import { initialCommands } from './data'
import { searchCommands } from './fetchApi'

const open = ref(false)
const loading = ref(false)
const items = ref<CommandItem[]>(initialCommands)
let timer: ReturnType<typeof setTimeout> | undefined

const onSearch = (query: string) => {
  clearTimeout(timer)
  loading.value = true
  timer = setTimeout(async () => {
    items.value = await searchCommands(query)
    loading.value = false
  }, 250)
}

const onSelect = (item: CommandItem) => console.log(item)
<\/script>`

const commandPaletteCodeTabs = [
  { label: 'Example.vue', language: 'vue', code: commandPaletteCode },
  {
    label: 'data.ts',
    language: 'ts',
    code: `import type { CommandItem } from '@mfs-atomic/ui'

export const initialCommands: CommandItem[] = [
  { id: 'new-doc', label: 'New Document', group: 'Actions', description: 'Create a blank page', shortcut: '⌘N' },
  { id: 'toggle-theme', label: 'Switch Theme', group: 'Actions', description: 'Cycle Clay, Glass, and Neo', shortcut: '⌘T' },
  { id: 'go-users', label: 'Team Directory', group: 'Navigation', description: 'Jump to DataTable' },
  { id: 'go-settings', label: 'Workspace Settings', group: 'Navigation', disabled: true }
]`
  },
  {
    label: 'fetchApi.ts',
    language: 'ts',
    code: `import type { CommandItem } from '@mfs-atomic/ui'

export async function searchCommands(query: string): Promise<CommandItem[]> {
  const params = new URLSearchParams({ q: query })
  const res = await fetch(\`/api/commands?\${params.toString()}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return res.json()
}`
  }
]

const commandPaletteApi = {
  props: [
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Controls open/closed visibility.' },
    { name: 'items', type: 'CommandItem[]', default: '[]', description: 'Command entries ({ id, label, group?, description?, shortcut?, disabled? }).' },
    { name: 'remote', type: 'boolean', default: 'false', description: 'Delegates filtering to parent via @search.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Displays spinner during async search.' },
    { name: 'placeholder', type: 'string', default: "'Type a command or search...'", description: 'Search input placeholder.' },
    { name: 'shortcut', type: 'boolean', default: 'true', description: 'Registers global ⌘K / Ctrl+K toggle.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: boolean) => void', description: 'Emitted when opened or closed.' },
    { name: 'search', type: '(query: string) => void', description: 'Emitted on search input.' },
    { name: 'select', type: '(item: CommandItem) => void', description: 'Emitted when a command is chosen.' }
  ],
  slots: [
    { name: 'empty', description: 'Custom empty state when no items match.' }
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
