<template>
  <!-- 1. Toast -->
  <ComponentPreview
    v-if="activeSlug === 'toast'"
    title="Toast"
    description="Global non-blocking notifications triggered via useToast(). Hover or focus pauses auto-dismiss."
    :code="toastCode"
    :api="toastApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row">
        <Button
          variant="primary"
          size="sm"
          @click="triggerToast('info', 'Heads up', 'Settings synced across devices.')"
        >
          Info Toast
        </Button>
        <Button
          variant="success"
          size="sm"
          @click="triggerToast('success', 'Saved', 'Your profile changes are live.')"
        >
          Success Toast
        </Button>
        <Button
          variant="warning"
          size="sm"
          @click="triggerToast('warning', 'Low Storage', '85% of your quota is in use.')"
        >
          Warning Toast
        </Button>
        <Button
          variant="danger"
          size="sm"
          @click="triggerToast('danger', 'Upload Failed', 'Network connection was interrupted.')"
        >
          Danger Toast
        </Button>
      </div>
      <div class="mfs-row">
        <Button
          variant="surface"
          size="sm"
          @click="toast.add({ title: 'Pinned Notice', message: 'Stays open until dismissed (duration: 0).', severity: 'info', duration: 0 })"
        >
          Persistent Toast
        </Button>
        <Button variant="secondary" size="sm" @click="toast.clear()">
          Clear All
        </Button>
      </div>
    </div>
  </ComponentPreview>

  <!-- 2. Alert -->
  <ComponentPreview
    v-else-if="activeSlug === 'alert'"
    title="Alert"
    description="Inline contextual feedback banners with severity accents, custom icon slot, and optional close button."
    :code="alertCode"
    :api="alertApi"
  >
    <div class="mfs-stack mfs-w-full">
      <Alert severity="info" title="Information">
        Theme tokens update automatically when switching between Clay, Glass, and Neo.
      </Alert>
      <Alert severity="success" title="Deployment Complete">
        Production build passed all checks with zero warnings.
      </Alert>
      <Alert severity="warning" title="Deprecation Notice">
        Legacy API v1 will be retired at the end of this quarter.
      </Alert>
      <Alert
        v-if="showClosableAlert"
        severity="danger"
        title="Action Required"
        closable
        @close="showClosableAlert = false"
      >
        Your session is about to expire. Click the close icon to dismiss this alert.
      </Alert>
      <div v-else class="mfs-row">
        <Button variant="surface" size="sm" @click="showClosableAlert = true">
          Restore Dismissed Alert
        </Button>
      </div>
    </div>
  </ComponentPreview>

  <!-- 3. Tooltip -->
  <ComponentPreview
    v-else-if="activeSlug === 'tooltip'"
    title="Tooltip"
    description="Lightweight hover and focus hints supporting four directional placements."
    :code="tooltipCode"
    :api="tooltipApi"
  >
    <div class="mfs-row mfs-gap-4">
      <Tooltip content="Appears above trigger" placement="top">
        <Button variant="surface" size="sm">Top</Button>
      </Tooltip>
      <Tooltip content="Appears below trigger" placement="bottom">
        <Button variant="surface" size="sm">Bottom</Button>
      </Tooltip>
      <Tooltip content="Appears to the left" placement="left">
        <Button variant="surface" size="sm">Left</Button>
      </Tooltip>
      <Tooltip content="Appears to the right" placement="right">
        <Button variant="surface" size="sm">Right</Button>
      </Tooltip>
      <Tooltip content="You should not see this" disabled>
        <Button variant="secondary" size="sm">Disabled</Button>
      </Tooltip>
    </div>
  </ComponentPreview>

  <!-- 4. Drawer -->
  <ComponentPreview
    v-else-if="activeSlug === 'drawer'"
    title="Drawer"
    description="Edge-anchored slide-over panel with body scroll lock, Escape-to-close, and header/footer slots."
    :code="drawerCode"
    :api="drawerApi"
  >
    <div class="mfs-row">
      <Button variant="primary" size="sm" @click="openDrawer('right')">Right Drawer</Button>
      <Button variant="surface" size="sm" @click="openDrawer('left')">Left Drawer</Button>
      <Button variant="surface" size="sm" @click="openDrawer('top')">Top Drawer</Button>
      <Button variant="surface" size="sm" @click="openDrawer('bottom')">Bottom Drawer</Button>
    </div>

    <Drawer
      v-model="drawerOpen"
      :position="drawerPosition"
      :size="drawerPosition === 'top' || drawerPosition === 'bottom' ? '240px' : '360px'"
      :title="`Drawer (${drawerPosition})`"
    >
      <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
        This drawer slides in from the <strong>{{ drawerPosition }}</strong> edge. Press
        <kbd>Esc</kbd> or click the backdrop to close it.
      </p>
      <template #footer>
        <div class="mfs-row mfs-justify-end mfs-w-full">
          <Button variant="surface" size="sm" @click="drawerOpen = false">Cancel</Button>
          <Button variant="primary" size="sm" @click="drawerOpen = false">Done</Button>
        </div>
      </template>
    </Drawer>
  </ComponentPreview>

  <!-- 5. Popover -->
  <ComponentPreview
    v-else-if="activeSlug === 'popover'"
    title="Popover"
    description="Click-triggered floating surface with outside-click dismissal and scoped trigger/close helpers."
    :code="popoverCode"
    :api="popoverApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row">
        <button
          v-for="pos in (['bottom', 'top', 'left', 'right'] as const)"
          :key="pos"
          type="button"
          class="mfs-pill mfs-px-3 mfs-py-1 mfs-surface-subtle mfs-text-muted mfs-text-xs mfs-font-semibold mfs-interactive demo-pill-btn"
          :class="{ 'is-active': popoverPlacement === pos }"
          @click="popoverPlacement = pos"
        >
          {{ pos }}
        </button>
      </div>

      <div class="mfs-flex mfs-justify-center mfs-px-4 mfs-py-6">
        <Popover :placement="popoverPlacement">
          <template #trigger="{ open }">
            <Button variant="primary" size="sm">
              {{ open ? 'Close Popover' : `Open (${popoverPlacement})` }}
            </Button>
          </template>
          <template #default="{ close }">
            <div class="mfs-flex mfs-flex-col mfs-gap-2">
              <strong class="mfs-text-sm mfs-text">Quick Actions</strong>
              <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
                Click outside, press Escape, or use the scoped close callback.
              </p>
              <Button variant="surface" size="sm" @click="close">Dismiss</Button>
            </div>
          </template>
        </Popover>
      </div>
    </div>
  </ComponentPreview>

  <!-- 6. Skeleton -->
  <ComponentPreview
    v-else-if="activeSlug === 'skeleton'"
    title="Skeleton"
    description="Theme-matched loading placeholders for text lines, avatars, and media blocks."
    :code="skeletonCode"
    :api="skeletonApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-justify-between">
        <span class="mfs-m-0 mfs-text-sm mfs-font-semibold mfs-text-muted">Shimmer animation: {{ skeletonAnimated ? 'On' : 'Off' }}</span>
        <Button variant="surface" size="sm" @click="skeletonAnimated = !skeletonAnimated">
          Toggle Shimmer
        </Button>
      </div>

      <div class="mfs-surface-subtle mfs-rounded mfs-p-4 mfs-flex mfs-flex-col mfs-gap-3">
        <div class="mfs-flex mfs-items-center mfs-gap-3">
          <Skeleton variant="circle" width="48px" :animated="skeletonAnimated" />
          <div class="mfs-flex-1 mfs-flex mfs-flex-col mfs-gap-2">
            <Skeleton variant="text" width="45%" height="16px" :animated="skeletonAnimated" />
            <Skeleton variant="text" width="30%" height="12px" :animated="skeletonAnimated" />
          </div>
        </div>
        <Skeleton variant="rect" height="110px" :animated="skeletonAnimated" />
        <Skeleton variant="text" :lines="3" :animated="skeletonAnimated" />
      </div>
    </div>
  </ComponentPreview>

  <!-- 7. ProgressBar -->
  <ComponentPreview
    v-else-if="activeSlug === 'progress-bar'"
    title="ProgressBar"
    description="Linear progress indicator supporting determinate percentages, semantic variants, and indeterminate motion."
    :code="progressBarCode"
    :api="progressBarApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-justify-between">
        <span class="mfs-m-0 mfs-text-sm mfs-font-semibold mfs-text-muted">Interactive Value: {{ progressValue }}%</span>
        <div class="mfs-row">
          <Button variant="surface" size="sm" @click="adjustProgress(-15)">-15%</Button>
          <Button variant="primary" size="sm" @click="adjustProgress(15)">+15%</Button>
        </div>
      </div>

      <ProgressBar :value="progressValue" show-value variant="primary" />
      <ProgressBar :value="78" show-value variant="success" />
      <ProgressBar :value="52" show-value variant="warning" />
      <ProgressBar :value="24" show-value variant="danger" height="12px" />
      <ProgressBar indeterminate variant="primary" height="8px" />
    </div>
  </ComponentPreview>

  <!-- 8. ProgressSpinner -->
  <ComponentPreview
    v-else-if="activeSlug === 'progress-spinner'"
    title="ProgressSpinner"
    description="Animated SVG ring spinner with preset sizes, custom stroke width, and theme-aware colors."
    :code="progressSpinnerCode"
    :api="progressSpinnerApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-gap-4">
        <div class="mfs-flex mfs-flex-col mfs-items-center mfs-gap-2 demo-spinner-item">
          <ProgressSpinner size="sm" variant="primary" />
          <span class="mfs-caption mfs-font-semibold">sm</span>
        </div>
        <div class="mfs-flex mfs-flex-col mfs-items-center mfs-gap-2 demo-spinner-item">
          <ProgressSpinner size="md" variant="secondary" />
          <span class="mfs-caption mfs-font-semibold">md</span>
        </div>
        <div class="mfs-flex mfs-flex-col mfs-items-center mfs-gap-2 demo-spinner-item">
          <ProgressSpinner size="lg" variant="success" />
          <span class="mfs-caption mfs-font-semibold">lg</span>
        </div>
        <div class="mfs-flex mfs-flex-col mfs-items-center mfs-gap-2 demo-spinner-item">
          <ProgressSpinner :size="60" :stroke-width="5" variant="warning" />
          <span class="mfs-caption mfs-font-semibold">60px</span>
        </div>
        <div class="mfs-flex mfs-flex-col mfs-items-center mfs-gap-2 demo-spinner-item">
          <ProgressSpinner size="md" variant="danger" />
          <span class="mfs-caption mfs-font-semibold">danger</span>
        </div>
      </div>
    </div>
  </ComponentPreview>

  <!-- 9. ConfirmDialog -->
  <ComponentPreview
    v-else-if="activeSlug === 'confirm-dialog'"
    title="ConfirmDialog"
    description="Promise-based modal confirmation driven by useConfirm(). Globally mounted in App.vue."
    :code="confirmDialogCode"
    :api="confirmDialogApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row">
        <Button variant="primary" size="sm" @click="askConfirm('primary')">
          Confirm Publish
        </Button>
        <Button variant="danger" size="sm" @click="askConfirm('danger')">
          Delete Item
        </Button>
      </div>
      <p class="mfs-m-0 mfs-text-sm mfs-font-semibold mfs-text-muted">
        Last result: <strong>{{ confirmResult }}</strong>
      </p>
    </div>
  </ComponentPreview>

  <!-- 10. Column -->
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
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import type { ApiRow } from '../../data/componentDocs'
import {
  Alert,
  Button,
  Column,
  DataTable,
  Drawer,
  Popover,
  ProgressBar,
  ProgressSpinner,
  Skeleton,
  Tooltip,
  useConfirm,
  useToast
} from '../../lib'

defineProps<{
  activeSlug: string
}>()

// 1. Toast
const toast = useToast()
const triggerToast = (
  severity: 'info' | 'success' | 'warning' | 'danger',
  title: string,
  message: string
) => {
  toast.add({ severity, title, message })
}

// 2. Alert
const showClosableAlert = ref(true)

// 4. Drawer
const drawerOpen = ref(false)
const drawerPosition = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const openDrawer = (pos: 'left' | 'right' | 'top' | 'bottom') => {
  drawerPosition.value = pos
  drawerOpen.value = true
}

// 5. Popover
const popoverPlacement = ref<'top' | 'bottom' | 'left' | 'right'>('bottom')

// 6. Skeleton
const skeletonAnimated = ref(true)

// 7. ProgressBar
const progressValue = ref(45)
const adjustProgress = (delta: number) => {
  progressValue.value = Math.min(100, Math.max(0, progressValue.value + delta))
}

// 9. ConfirmDialog
const { confirm } = useConfirm()
const confirmResult = ref('Waiting for action...')
const askConfirm = async (variant: 'primary' | 'danger') => {
  const accepted = await confirm(
    variant === 'danger'
      ? {
          title: 'Delete Workspace?',
          message: 'This action cannot be undone and removes all saved presets.',
          confirmLabel: 'Delete',
          cancelLabel: 'Keep',
          variant: 'danger'
        }
      : {
          title: 'Publish Changes?',
          message: 'Your updated theme tokens will be visible to all users.',
          confirmLabel: 'Publish',
          cancelLabel: 'Cancel',
          variant: 'primary'
        }
  )
  confirmResult.value = accepted ? `Confirmed (${variant})` : `Cancelled (${variant})`
}

// 10. Column
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

// Code snippets
const toastCode = `<script setup lang="ts">
import { Button, useToast } from 'mfs-theme'

const toast = useToast()
const notify = () => {
  toast.add({
    severity: 'success',
    title: 'Saved',
    message: 'Your profile changes are live.',
    duration: 4000
  })
}
<\/script>

<template>
  <!-- <Toast /> mounted once at app root -->
  <Button variant="success" @click="notify">Success Toast</Button>
</template>`

const alertCode = `<template>
  <Alert severity="info" title="Information">
    Theme tokens update automatically.
  </Alert>

  <Alert
    severity="danger"
    title="Action Required"
    closable
    @close="onClose"
  >
    Your session is about to expire.
  </Alert>
</template>`

const tooltipCode = `<template>
  <Tooltip content="Appears above trigger" placement="top">
    <Button variant="surface">Hover or focus me</Button>
  </Tooltip>
</template>`

const drawerCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Drawer } from 'mfs-theme'

const open = ref(false)
<\/script>

<template>
  <Button @click="open = true">Open Drawer</Button>

  <Drawer v-model="open" position="right" size="360px" title="Details">
    <p>Slide-over content here.</p>
    <template #footer>
      <Button variant="primary" @click="open = false">Done</Button>
    </template>
  </Drawer>
</template>`

const popoverCode = `<template>
  <Popover placement="bottom">
    <template #trigger="{ open }">
      <Button variant="primary">{{ open ? 'Close' : 'Open Popover' }}</Button>
    </template>
    <template #default="{ close }">
      <p>Click outside or press Escape to dismiss.</p>
      <Button variant="surface" size="sm" @click="close">Dismiss</Button>
    </template>
  </Popover>
</template>`

const skeletonCode = `<template>
  <Skeleton variant="circle" width="48px" />
  <Skeleton variant="rect" height="110px" />
  <Skeleton variant="text" :lines="3" animated />
</template>`

const progressBarCode = `<template>
  <ProgressBar :value="78" show-value variant="success" />
  <ProgressBar indeterminate variant="primary" height="8px" />
</template>`

const progressSpinnerCode = `<template>
  <ProgressSpinner size="sm" variant="primary" />
  <ProgressSpinner size="lg" variant="success" />
  <ProgressSpinner :size="60" :stroke-width="5" variant="warning" />
</template>`

const confirmDialogCode = `<script setup lang="ts">
import { Button, useConfirm } from 'mfs-theme'

const { confirm } = useConfirm()

const handleDelete = async () => {
  const ok = await confirm({
    title: 'Delete Workspace?',
    message: 'This action cannot be undone.',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
    variant: 'danger'
  })
  if (ok) {
    // proceed with deletion
  }
}
<\/script>

<template>
  <!-- <ConfirmDialog /> mounted once at app root -->
  <Button variant="danger" @click="handleDelete">Delete Item</Button>
</template>`

// API tables
const toastApi: { props: ApiRow[] } = {
  props: [
    {
      name: 'position',
      type: "'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'",
      default: "'top-right'",
      description: 'Viewport corner or edge where toast stack renders.'
    },
    {
      name: 'max',
      type: 'number',
      description: 'Maximum number of visible toasts at once.'
    },
    {
      name: 'useToast().add(opts)',
      type: 'ToastOptions',
      description: 'Accepts { title?, message, severity?, duration?, closable?, id? }.'
    }
  ]
}

const alertApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    {
      name: 'severity',
      type: "'info' | 'success' | 'warning' | 'danger'",
      default: "'info'",
      description: 'Controls accent border and default status icon.'
    },
    {
      name: 'title',
      type: 'string',
      description: 'Optional bold heading above the alert body.'
    },
    {
      name: 'closable',
      type: 'boolean',
      default: 'false',
      description: 'Renders a dismiss button in the top-right corner.'
    }
  ],
  events: [
    {
      name: 'close',
      type: '() => void',
      description: 'Emitted when the close button is clicked.'
    }
  ],
  slots: [
    {
      name: 'default',
      description: 'Main alert message content.'
    },
    {
      name: 'icon',
      description: 'Custom icon element replacing the default severity SVG.'
    }
  ]
}

const tooltipApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    {
      name: 'content',
      type: 'string',
      default: "''",
      description: 'Text displayed inside the tooltip.'
    },
    {
      name: 'placement',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'top'",
      description: 'Side of the trigger where the tooltip appears.'
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Prevents the tooltip from showing on hover or focus.'
    }
  ],
  slots: [
    {
      name: 'default',
      description: 'Trigger element wrapped by the tooltip.'
    }
  ]
}

const drawerApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    {
      name: 'modelValue',
      type: 'boolean',
      default: 'false',
      description: 'Controls open/closed visibility (v-model).'
    },
    {
      name: 'position',
      type: "'left' | 'right' | 'top' | 'bottom'",
      default: "'right'",
      description: 'Viewport edge from which the drawer slides in.'
    },
    {
      name: 'size',
      type: 'string',
      default: "'360px'",
      description: 'CSS width (left/right) or height (top/bottom) of the panel.'
    },
    {
      name: 'title',
      type: 'string',
      description: 'Header title text and accessible dialog label.'
    },
    {
      name: 'closeOnBackdrop',
      type: 'boolean',
      default: 'true',
      description: 'Closes the drawer when clicking the backdrop overlay.'
    }
  ],
  events: [
    {
      name: 'update:modelValue',
      type: '(value: boolean) => void',
      description: 'Emitted when drawer visibility changes.'
    },
    {
      name: 'close',
      type: '() => void',
      description: 'Emitted when the drawer is dismissed.'
    }
  ],
  slots: [
    {
      name: 'default',
      description: 'Scrollable body content of the drawer.'
    },
    {
      name: 'header',
      description: 'Custom header content replacing the default title.'
    },
    {
      name: 'footer',
      description: 'Optional sticky footer for action buttons.'
    }
  ]
}

const popoverApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    {
      name: 'modelValue',
      type: 'boolean',
      default: 'undefined',
      description: 'Optional controlled visibility state; uncontrolled when omitted.'
    },
    {
      name: 'placement',
      type: "'top' | 'bottom' | 'left' | 'right'",
      default: "'bottom'",
      description: 'Position of the popover relative to the trigger.'
    }
  ],
  events: [
    {
      name: 'update:modelValue',
      type: '(value: boolean) => void',
      description: 'Emitted when popover opens or closes.'
    }
  ],
  slots: [
    {
      name: 'trigger',
      description: 'Trigger element receiving { open, toggle } slot props.'
    },
    {
      name: 'default',
      description: 'Popover body receiving { close } slot prop.'
    }
  ]
}

const skeletonApi: { props: ApiRow[] } = {
  props: [
    {
      name: 'variant',
      type: "'text' | 'circle' | 'rect'",
      default: "'text'",
      description: 'Shape preset of the placeholder.'
    },
    {
      name: 'width',
      type: 'string',
      description: "Custom CSS width (defaults: '48px' circle, '100%' text/rect)."
    },
    {
      name: 'height',
      type: 'string',
      description: "Custom CSS height (defaults: '14px' text, '80px' rect, '48px' circle)."
    },
    {
      name: 'lines',
      type: 'number',
      default: '1',
      description: 'Number of stacked lines when variant is text.'
    },
    {
      name: 'animated',
      type: 'boolean',
      default: 'true',
      description: 'Enables the shimmer sweep animation.'
    }
  ]
}

const progressBarApi: { props: ApiRow[] } = {
  props: [
    {
      name: 'value',
      type: 'number',
      default: '0',
      description: 'Completion percentage clamped between 0 and 100.'
    },
    {
      name: 'indeterminate',
      type: 'boolean',
      default: 'false',
      description: 'Displays a continuous sliding bar when total is unknown.'
    },
    {
      name: 'showValue',
      type: 'boolean',
      default: 'false',
      description: 'Renders the rounded percentage label beside the track.'
    },
    {
      name: 'variant',
      type: "'primary' | 'success' | 'warning' | 'danger'",
      default: "'primary'",
      description: 'Semantic fill color of the progress bar.'
    },
    {
      name: 'height',
      type: 'string',
      default: "'10px'",
      description: 'CSS height of the progress track.'
    }
  ]
}

const progressSpinnerApi: { props: ApiRow[] } = {
  props: [
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg' | number",
      default: "'md'",
      description: 'Preset size token or explicit pixel number.'
    },
    {
      name: 'strokeWidth',
      type: 'number',
      default: '4',
      description: 'SVG ring stroke thickness.'
    },
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'success' | 'warning' | 'danger'",
      default: "'primary'",
      description: 'Semantic stroke color of the spinner.'
    }
  ]
}

const confirmDialogApi: { props: ApiRow[] } = {
  props: [
    {
      name: 'useConfirm().confirm(opts)',
      type: 'ConfirmOptions => Promise<boolean>',
      description: 'Opens dialog with { title, message, confirmLabel?, cancelLabel?, variant?, onAccept?, onReject? }.'
    }
  ]
}

const columnCode = `<template>
  <DataTable :value="rows">
    <Column field="name" header="Member" sortable />
    <Column field="role" header="Role" :hidden="hideRole" />
    <Column field="status" header="Status">
      <template #body="{ data }">
        <span class="mfs-pill mfs-soft-primary">{{ data.status }}</span>
      </template>
    </Column>
  </DataTable>
</template>`

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
</script>

<style scoped>
.demo-pill-btn {
  text-transform: capitalize;
}

.demo-pill-btn.is-active {
  background: var(--primary);
  color: var(--primary-text, #ffffff);
}

.demo-spinner-item {
  min-width: 56px;
}

kbd {
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 0.78rem;
  background: var(--surface-subtle);
  border: 1px solid var(--border, transparent);
}
</style>
