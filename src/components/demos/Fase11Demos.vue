<template>
  <!-- ConfirmPopup -->
  <ComponentPreview
    v-if="activeSlug === 'confirm-popup'"
    title="ConfirmPopup"
    description="Target-anchored confirmation popover triggered imperatively via show(event, options) or v-model."
    :code="confirmPopupCode"
    :api="confirmPopupApi"
  >
    <div class="demo-stack">
      <div class="demo-row-wrap">
        <Button size="sm" variant="primary" @click="openConfirm($event, 'primary')">
          Save Changes
        </Button>
        <Button size="sm" variant="danger" @click="openConfirm($event, 'danger')">
          Delete Item
        </Button>
      </div>
      <ConfirmPopup ref="confirmPopupRef" />
      <p class="demo-status">
        Last response: <strong>{{ confirmStatus }}</strong>
      </p>
    </div>
  </ComponentPreview>

  <!-- InlineMessage -->
  <ComponentPreview
    v-else-if="activeSlug === 'inline-message'"
    title="InlineMessage"
    description="Compact inline status message in semantic info, success, warning, and danger variants."
    :code="inlineMessageCode"
    :api="inlineMessageApi"
  >
    <div class="demo-row-wrap">
      <InlineMessage severity="info" text="Theme tokens synced" />
      <InlineMessage severity="success" text="Build passed" />
      <InlineMessage severity="warning" text="Unsaved changes" />
      <InlineMessage severity="danger" text="Validation failed" />
    </div>
  </ComponentPreview>

  <!-- BlockUI -->
  <ComponentPreview
    v-else-if="activeSlug === 'block-ui'"
    title="BlockUI"
    description="Loading overlay that blocks interaction over a target region or the full viewport."
    :code="blockUiCode"
    :api="blockUiApi"
  >
    <div class="demo-stack">
      <div class="demo-row-wrap">
        <Button size="sm" variant="primary" @click="isBlocked = !isBlocked">
          {{ isBlocked ? 'Unblock Panel' : 'Block Panel' }}
        </Button>
      </div>

      <BlockUI :blocked="isBlocked" label="Syncing workspace...">
        <div class="demo-panel">
          <h4 class="demo-panel__title">Project Settings</h4>
          <p class="demo-panel__text">
            This region becomes inert and displays a blurred spinner overlay while blocked is true.
          </p>
        </div>
      </BlockUI>
    </div>
  </ComponentPreview>

  <!-- Galleria -->
  <ComponentPreview
    v-else-if="activeSlug === 'galleria'"
    title="Galleria"
    description="Media gallery with thumbnail strip, keyboard arrow navigation, captions, and fullscreen mode."
    :code="galleriaCode"
    :api="galleriaApi"
  >
    <div class="demo-stack">
      <Galleria v-model:active-index="galleriaIndex" :images="galleriaImages" />
      <p class="demo-status">
        Active slide: <strong>{{ galleriaIndex + 1 }} / {{ galleriaImages.length }}</strong>
      </p>
    </div>
  </ComponentPreview>

  <!-- FileUpload -->
  <ComponentPreview
    v-else-if="activeSlug === 'file-upload'"
    title="FileUpload"
    description="Drag-and-drop and click-to-browse file uploader with type/size validation and progress bar."
    :code="fileUploadCode"
    :api="fileUploadApi"
  >
    <div class="demo-stack">
      <FileUpload
        multiple
        accept="image/*,.pdf,.txt"
        :max-file-size="2097152"
        :progress="uploadProgress"
        @select="onFilesSelected"
        @remove="uploadStatus = `Removed ${$event.name}`"
        @error="uploadStatus = $event"
        @clear="onFilesCleared"
      />
      <p class="demo-status">
        Status: <strong>{{ uploadStatus }}</strong>
      </p>
    </div>
  </ComponentPreview>

  <!-- Terminal -->
  <ComponentPreview
    v-else-if="activeSlug === 'terminal'"
    title="Terminal"
    description="Interactive command prompt with built-in command handlers, history navigation, and clear support."
    :code="terminalCode"
    :api="terminalApi"
  >
    <Terminal
      welcome-message="MFS Terminal — type 'help', 'date', 'echo <text>', or 'clear'."
      prompt="mfs $"
      :commands="terminalCommands"
      @command="onUnknownCommand"
    />
  </ComponentPreview>

  <!-- Chart -->
  <ComponentPreview
    v-else-if="activeSlug === 'chart'"
    title="Chart"
    description="Zero-dependency SVG chart supporting bar, line, pie, and doughnut visualizations with hover tooltips."
    :code="chartCode"
    :api="chartApi"
  >
    <div class="demo-stack">
      <div class="demo-row-wrap">
        <Button
          v-for="kind in chartKinds"
          :key="kind"
          size="sm"
          :variant="chartType === kind ? 'primary' : 'secondary'"
          @click="chartType = kind"
        >
          {{ kind }}
        </Button>
      </div>
      <Chart :type="chartType" :data="activeChartData" :height="220" />
    </div>
  </ComponentPreview>

  <!-- v-ripple -->
  <ComponentPreview
    v-else-if="activeSlug === 'v-ripple'"
    title="v-ripple"
    description="Pointer-down radial ripple directive for tactile feedback on interactive surfaces."
    :code="rippleCode"
    :api="rippleApi"
  >
    <div class="demo-row-wrap">
      <button v-ripple type="button" class="demo-ripple-box">
        Default Ripple (click me)
      </button>
      <button v-ripple="{ color: 'var(--primary)' }" type="button" class="demo-ripple-box">
        Primary Ripple
      </button>
      <button v-ripple="false" type="button" class="demo-ripple-box demo-ripple-box--muted">
        Disabled Ripple
      </button>
    </div>
  </ComponentPreview>

  <!-- v-focus-trap -->
  <ComponentPreview
    v-else-if="activeSlug === 'v-focus-trap'"
    title="v-focus-trap"
    description="Constrains Tab and Shift+Tab keyboard focus within an active container."
    :code="focusTrapCode"
    :api="focusTrapApi"
  >
    <div class="demo-stack">
      <div class="demo-row-wrap">
        <Button size="sm" variant="primary" @click="trapActive = !trapActive">
          {{ trapActive ? 'Disable Focus Trap' : 'Enable Focus Trap' }}
        </Button>
      </div>

      <div v-focus-trap="trapActive" class="demo-panel demo-trap-box">
        <p class="demo-panel__text">
          {{ trapActive ? 'Focus is trapped here — press Tab / Shift+Tab.' : 'Enable trap to cycle focus inside this box.' }}
        </p>
        <div class="demo-row-wrap">
          <input type="text" class="demo-mini-input" placeholder="Focusable input" />
          <Button size="sm" variant="secondary">Action A</Button>
          <Button size="sm" variant="secondary" @click="trapActive = false">Release</Button>
        </div>
      </div>
    </div>
  </ComponentPreview>

  <!-- v-animate-on-scroll -->
  <ComponentPreview
    v-else-if="activeSlug === 'v-animate-on-scroll'"
    title="v-animate-on-scroll"
    description="IntersectionObserver directive that toggles enter/leave classes when elements enter the viewport."
    :code="aosCode"
    :api="aosApi"
  >
    <div class="demo-aos-scroll">
      <p class="demo-status">Scroll inside this box to trigger enter/leave animations:</p>
      <div
        v-for="n in 4"
        :key="n"
        v-animate-on-scroll="{ enterClass: 'demo-aos-in', leaveClass: 'demo-aos-out', once: false, threshold: 0.25 }"
        class="demo-aos-card"
      >
        Animated Card #{{ n }}
      </div>
    </div>
  </ComponentPreview>

  <!-- v-style-class -->
  <ComponentPreview
    v-else-if="activeSlug === 'v-style-class'"
    title="v-style-class"
    description="Declarative click directive to toggle or swap CSS classes on self or relative DOM targets."
    :code="styleClassCode"
    :api="styleClassApi"
  >
    <div class="demo-stack">
      <button
        v-style-class="{ selector: '@next', toggleClass: 'demo-style-active' }"
        type="button"
        class="demo-ripple-box"
      >
        Click to toggle @next sibling class
      </button>
      <div class="demo-panel demo-style-target">
        Target sibling element (`@next`)
      </div>
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import { Button } from '../../lib'
import ConfirmPopup from '../../lib/components/ConfirmPopup.vue'
import InlineMessage from '../../lib/components/InlineMessage.vue'
import BlockUI from '../../lib/components/BlockUI.vue'
import Galleria, { type GalleriaImage } from '../../lib/components/Galleria.vue'
import FileUpload from '../../lib/components/FileUpload.vue'
import Terminal, { type TerminalCommandPayload } from '../../lib/components/Terminal.vue'
import Chart, { type ChartData } from '../../lib/components/Chart.vue'
import vRipple from '../../lib/directives/ripple'
import vFocusTrap from '../../lib/directives/focusTrap'
import vAnimateOnScroll from '../../lib/directives/animateOnScroll'
import vStyleClass from '../../lib/directives/styleClass'

defineProps<{ activeSlug: string }>()

/* ---------- ConfirmPopup ---------- */
const confirmPopupRef = ref<InstanceType<typeof ConfirmPopup> | null>(null)
const confirmStatus = ref('Waiting for trigger')

const openConfirm = (event: MouseEvent, variant: 'primary' | 'danger') => {
  confirmPopupRef.value?.show(event, {
    message: variant === 'danger' ? 'Delete this item permanently?' : 'Save your changes now?',
    acceptLabel: variant === 'danger' ? 'Delete' : 'Save',
    rejectLabel: 'Cancel',
    variant,
    onAccept: () => {
      confirmStatus.value = variant === 'danger' ? 'Deleted' : 'Saved'
    },
    onReject: () => {
      confirmStatus.value = 'Cancelled'
    }
  })
}

const confirmPopupCode = `<template>
  <Button @click="ask($event)">Delete</Button>
  <ConfirmPopup ref="popupRef" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, ConfirmPopup } from 'mfs-theme'

const popupRef = ref<InstanceType<typeof ConfirmPopup> | null>(null)
const ask = (e: MouseEvent) => {
  popupRef.value?.show(e, {
    message: 'Delete this item?',
    variant: 'danger',
    onAccept: () => console.log('Accepted')
  })
}
<\/script>`

const confirmPopupApi = {
  props: [
    { name: 'modelValue', type: 'boolean', default: 'undefined', description: 'Controlled open state.' },
    { name: 'target', type: 'HTMLElement | MouseEvent | null', default: 'null', description: 'Anchor element for popup positioning.' },
    { name: 'message', type: 'string', default: "'Are you sure you want to proceed?'", description: 'Confirmation message text.' },
    { name: 'acceptLabel', type: 'string', default: "'Yes'", description: 'Accept button label.' },
    { name: 'rejectLabel', type: 'string', default: "'No'", description: 'Reject button label.' },
    { name: 'variant', type: "'primary' | 'success' | 'warning' | 'danger'", default: "'primary'", description: 'Accent color variant.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: boolean) => void', description: 'Emitted when open state changes.' },
    { name: 'accept', type: '() => void', description: 'Emitted when accept button is clicked.' },
    { name: 'reject', type: '() => void', description: 'Emitted when reject button is clicked.' }
  ]
}

/* ---------- InlineMessage ---------- */
const inlineMessageCode = `<template>
  <InlineMessage severity="info" text="Theme tokens synced" />
  <InlineMessage severity="success" text="Build passed" />
  <InlineMessage severity="warning" text="Unsaved changes" />
  <InlineMessage severity="danger" text="Validation failed" />
</template>`

const inlineMessageApi = {
  props: [
    { name: 'severity', type: "'info' | 'success' | 'warning' | 'danger'", default: "'info'", description: 'Semantic color and icon variant.' },
    { name: 'text', type: 'string', default: "''", description: 'Message text when default slot is not provided.' }
  ],
  slots: [
    { name: 'default', description: 'Custom inline message content.' }
  ]
}

/* ---------- BlockUI ---------- */
const isBlocked = ref(false)

const blockUiCode = `<template>
  <BlockUI :blocked="isBlocked" label="Syncing workspace...">
    <div class="panel">Protected content</div>
  </BlockUI>
</template>`

const blockUiApi = {
  props: [
    { name: 'blocked', type: 'boolean', default: 'false', description: 'Displays the blocking overlay when true.' },
    { name: 'fullScreen', type: 'boolean', default: 'false', description: 'Teleports overlay to body covering the full viewport.' },
    { name: 'label', type: 'string', default: "''", description: 'Optional loading text next to the spinner.' }
  ],
  slots: [
    { name: 'default', description: 'Content to be blocked.' },
    { name: 'overlay', description: 'Custom overlay content replacing the default spinner box.' }
  ]
}

/* ---------- Galleria ---------- */
const galleriaIndex = ref(0)
const makeSlideSvg = (title: string, c1: string, c2: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}"/></linearGradient></defs><rect width="800" height="450" fill="url(#g)"/><text x="50%" y="50%" fill="#fff" font-family="sans-serif" font-size="38" font-weight="700" text-anchor="middle" dominant-baseline="middle">${title}</text></svg>`
  )}`

const galleriaImages: GalleriaImage[] = [
  { src: makeSlideSvg('Claymorphism', '#6366f1', '#ec4899'), title: 'Claymorphism Surface' },
  { src: makeSlideSvg('Glassmorphism', '#0ea5e9', '#8b5cf6'), title: 'Glassmorphism Blur' },
  { src: makeSlideSvg('Neumorphism', '#10b981', '#06b6d4'), title: 'Neumorphism Depth' }
]

const galleriaCode = `<template>
  <Galleria v-model:active-index="activeIndex" :images="images" />
</template>`

const galleriaApi = {
  props: [
    { name: 'images', type: 'GalleriaImage[]', default: '—', description: 'Required array of image objects ({ src, alt, title, thumbnail }).' },
    { name: 'activeIndex', type: 'number', default: '0', description: 'Zero-based active slide index.' },
    { name: 'showThumbnails', type: 'boolean', default: 'true', description: 'Displays thumbnail strip below the stage.' },
    { name: 'fullscreen', type: 'boolean', default: 'false', description: 'Initial fullscreen state.' }
  ],
  events: [
    { name: 'update:activeIndex', type: '(index: number) => void', description: 'Emitted when the active slide changes.' }
  ]
}

/* ---------- FileUpload ---------- */
const uploadProgress = ref(0)
const uploadStatus = ref('No files selected')

const onFilesSelected = (selected: File[]) => {
  uploadStatus.value = `${selected.length} file(s) ready`
  uploadProgress.value = 100
}

const onFilesCleared = () => {
  uploadProgress.value = 0
  uploadStatus.value = 'No files selected'
}

const fileUploadCode = `<template>
  <FileUpload
    multiple
    accept="image/*,.pdf"
    :max-file-size="2097152"
    :progress="progress"
    @select="onSelect"
  />
</template>`

const fileUploadApi = {
  props: [
    { name: 'accept', type: 'string', default: 'undefined', description: 'Comma-separated MIME types or file extensions.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows selecting multiple files.' },
    { name: 'maxFileSize', type: 'number', default: 'undefined', description: 'Maximum file size in bytes.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables file picker and dropzone.' },
    { name: 'progress', type: 'number', default: 'undefined', description: 'Upload progress percentage (0-100).' }
  ],
  events: [
    { name: 'select', type: '(files: File[]) => void', description: 'Emitted when valid files are added.' },
    { name: 'remove', type: '(file: File) => void', description: 'Emitted when a file is removed.' },
    { name: 'error', type: '(message: string) => void', description: 'Emitted on invalid file type or size.' },
    { name: 'clear', type: '() => void', description: 'Emitted when all files are removed.' }
  ]
}

/* ---------- Terminal ---------- */
const terminalCommands: Record<string, (args: string[]) => string> = {
  help: () => 'Available commands: help, date, echo <text>, clear',
  date: () => new Date().toLocaleString(),
  echo: (args) => args.join(' ') || '(empty)'
}

const onUnknownCommand = (payload: TerminalCommandPayload) => {
  payload.respond(`Command not found: ${payload.command}. Try 'help'.`)
}

const terminalCode = `<template>
  <Terminal
    welcome-message="MFS Terminal — type 'help' or 'clear'."
    prompt="mfs $"
    :commands="commands"
    @command="onCommand"
  />
</template>`

const terminalApi = {
  props: [
    { name: 'welcomeMessage', type: 'string', default: "''", description: 'Header text displayed above command history.' },
    { name: 'prompt', type: 'string', default: "'$'", description: 'Command prompt prefix.' },
    { name: 'commands', type: 'Record<string, (args: string[]) => string | Promise<string>>', default: 'undefined', description: 'Built-in command handler map.' }
  ],
  events: [
    { name: 'command', type: '(payload: TerminalCommandPayload) => void', description: 'Emitted for commands not matched in the commands prop.' }
  ]
}

/* ---------- Chart ---------- */
const chartKinds = ['bar', 'line', 'pie', 'doughnut'] as const
const chartType = ref<'bar' | 'line' | 'pie' | 'doughnut'>('bar')

const activeChartData = computed<ChartData>(() => {
  if (chartType.value === 'pie' || chartType.value === 'doughnut') {
    return {
      labels: ['Clay', 'Glass', 'Neo'],
      datasets: [{ label: 'Themes', data: [48, 32, 20] }]
    }
  }
  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      { label: 'Components', data: [18, 28, 36, 44, 52] },
      { label: 'Adoption', data: [12, 20, 29, 38, 46] }
    ]
  }
})

const chartCode = `<template>
  <Chart type="bar" :data="chartData" :height="220" />
</template>`

const chartApi = {
  props: [
    { name: 'type', type: "'bar' | 'line' | 'pie' | 'doughnut'", default: "'bar'", description: 'Chart visualization type.' },
    { name: 'data', type: 'ChartData', default: '—', description: 'Required labels and datasets object.' },
    { name: 'height', type: 'number', default: '240', description: 'SVG viewBox height in pixels.' }
  ]
}

/* ---------- Directives ---------- */
const trapActive = ref(false)

const rippleCode = `<template>
  <button v-ripple>Default Ripple</button>
  <button v-ripple="{ color: 'var(--primary)' }">Primary Ripple</button>
  <button v-ripple="false">Disabled</button>
</template>`

const rippleApi = {
  props: [
    { name: 'v-ripple', type: 'boolean | { color?: string; disabled?: boolean }', default: 'true', description: 'Directive binding controlling ripple color or disabled state.' }
  ]
}

const focusTrapCode = `<template>
  <div v-focus-trap="trapActive">
    <input type="text" />
    <button @click="trapActive = false">Close</button>
  </div>
</template>`

const focusTrapApi = {
  props: [
    { name: 'v-focus-trap', type: 'boolean | undefined', default: 'true', description: 'Activates or deactivates Tab focus trapping inside the host element.' }
  ]
}

const aosCode = `<template>
  <div v-animate-on-scroll="{ enterClass: 'fade-in', leaveClass: 'fade-out', once: false }">
    Animated content
  </div>
</template>`

const aosApi = {
  props: [
    { name: 'v-animate-on-scroll', type: 'string | { enterClass?: string; leaveClass?: string; threshold?: number; once?: boolean }', default: "'mfs-aos-enter'", description: 'Class or options applied via IntersectionObserver.' }
  ]
}

const styleClassCode = `<template>
  <button v-style-class="{ selector: '@next', toggleClass: 'is-active' }">
    Toggle Sibling
  </button>
  <div>Target sibling</div>
</template>`

const styleClassApi = {
  props: [
    { name: 'v-style-class', type: 'string | { selector?: string; toggleClass?: string; enterClass?: string; leaveClass?: string }', default: '—', description: 'Selector (@self, @next, @prev, @parent, @grandparent, or CSS) and classes to toggle on click.' }
  ]
}
</script>

<style scoped>
.demo-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

.demo-row-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.demo-status {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.demo-status strong {
  color: var(--text);
}

.demo-panel {
  padding: 16px;
  border-radius: var(--radius-md, 14px);
  background: var(--surface-subtle);
  border: 1px solid var(--border);
}

.demo-panel__title {
  margin: 0 0 4px;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text);
}

.demo-panel__text {
  margin: 0;
  font-size: 0.86rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.demo-ripple-box {
  padding: 12px 18px;
  border-radius: var(--radius-md, 12px);
  border: 1px solid var(--border);
  background: var(--surface-subtle);
  color: var(--text);
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
}

.demo-ripple-box--muted {
  opacity: 0.65;
}

.demo-trap-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-mini-input {
  padding: 7px 10px;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-family: inherit;
  font-size: 0.86rem;
}

.demo-aos-scroll {
  height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border-radius: var(--radius-md, 14px);
  border: 1px solid var(--border);
  background: var(--surface-subtle);
}

.demo-aos-card {
  padding: 24px 16px;
  border-radius: var(--radius-sm, 10px);
  background: var(--surface);
  border: 1px solid var(--border);
  font-weight: 600;
  color: var(--text);
  transition: transform 0.35s ease, opacity 0.35s ease, border-color 0.35s ease;
}

.demo-aos-in {
  opacity: 1;
  transform: translateY(0);
  border-color: var(--primary);
}

.demo-aos-out {
  opacity: 0.35;
  transform: translateY(10px);
}

.demo-style-target {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.demo-style-active {
  border-color: var(--primary);
  transform: scale(1.02);
  box-shadow: var(--clay-shadow);
}
</style>
