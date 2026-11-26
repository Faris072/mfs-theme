<template>
  <!-- ConfirmPopup -->
  <ComponentPreview
    v-if="activeSlug === 'confirm-popup'"
    title="ConfirmPopup"
    description="Target-anchored confirmation popover triggered imperatively via show(event, options) or v-model."
    :code="confirmPopupCode"
    :code-tabs="confirmPopupCodeTabs"
    :api="confirmPopupApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-gap-2">
        <Button size="sm" variant="primary" @click="openConfirm($event, 'primary')">
          Save Changes
        </Button>
        <Button size="sm" variant="danger" @click="openConfirm($event, 'danger')">
          Delete Item
        </Button>
      </div>
      <ConfirmPopup ref="confirmPopupRef" />
      <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
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
    <div class="mfs-row mfs-gap-2">
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
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-gap-2">
        <Button size="sm" variant="primary" @click="isBlocked = !isBlocked">
          {{ isBlocked ? 'Unblock Panel' : 'Block Panel' }}
        </Button>
      </div>

      <BlockUI :blocked="isBlocked" label="Syncing workspace...">
        <div class="mfs-p-4 mfs-rounded-md mfs-surface-subtle">
          <h4 class="mfs-mt-0 mfs-mb-1 mfs-text-base mfs-font-bold mfs-text">Project Settings</h4>
          <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
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
    :code-tabs="galleriaCodeTabs"
    :api="galleriaApi"
  >
    <div class="mfs-stack mfs-w-full">
      <Galleria v-model:active-index="galleriaIndex" :images="galleriaImages" />
      <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
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
    :code-tabs="fileUploadCodeTabs"
    :api="fileUploadApi"
  >
    <div class="mfs-stack mfs-w-full">
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
      <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
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
    :code-tabs="terminalCodeTabs"
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
  <div v-else-if="activeSlug === 'chart'" class="mfs-stack mfs-gap-6">
    <ComponentPreview
      title="Bar Chart"
      description="Zero-dependency SVG bar chart comparing multi-series metrics with hover tooltips."
      :code="barChartCode"
      :code-tabs="chartCodeTabs"
      :api="chartApi"
    >
      <Chart type="bar" :data="barLineChartData" :height="220" />
    </ComponentPreview>

    <ComponentPreview
      title="Line Chart"
      description="Multi-series SVG line chart for tracking trends over time with interactive point tooltips."
      :code="lineChartCode"
    >
      <Chart type="line" :data="barLineChartData" :height="220" />
    </ComponentPreview>

    <ComponentPreview
      title="Pie Chart"
      description="Proportional SVG pie chart with interactive slice hover tooltips."
      :code="pieChartCode"
    >
      <Chart type="pie" :data="pieDoughnutChartData" :height="220" />
    </ComponentPreview>

    <ComponentPreview
      title="Doughnut Chart"
      description="Ring-style SVG doughnut chart highlighting category distribution."
      :code="doughnutChartCode"
    >
      <Chart type="doughnut" :data="pieDoughnutChartData" :height="220" />
    </ComponentPreview>
  </div>

  <!-- v-ripple -->
  <ComponentPreview
    v-else-if="activeSlug === 'v-ripple'"
    title="v-ripple"
    description="Pointer-down radial ripple directive for tactile feedback on interactive surfaces."
    :code="rippleCode"
    :api="rippleApi"
  >
    <div class="mfs-row mfs-gap-2">
      <button v-ripple type="button" class="mfs-px-4 mfs-py-3 mfs-rounded-md mfs-surface-subtle mfs-text-sm mfs-font-semibold mfs-interactive">
        Default Ripple (click me)
      </button>
      <button v-ripple="{ color: 'var(--primary)' }" type="button" class="mfs-px-4 mfs-py-3 mfs-rounded-md mfs-surface-subtle mfs-text-sm mfs-font-semibold mfs-interactive">
        Primary Ripple
      </button>
      <button v-ripple="false" type="button" class="mfs-px-4 mfs-py-3 mfs-rounded-md mfs-surface-subtle mfs-text-sm mfs-font-semibold demo-ripple-box--muted">
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
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-gap-2">
        <Button size="sm" variant="primary" @click="trapActive = !trapActive">
          {{ trapActive ? 'Disable Focus Trap' : 'Enable Focus Trap' }}
        </Button>
      </div>

      <div v-focus-trap="trapActive" class="mfs-p-4 mfs-rounded-md mfs-surface-subtle mfs-flex mfs-flex-col mfs-gap-2">
        <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
          {{ trapActive ? 'Focus is trapped here — press Tab / Shift+Tab.' : 'Enable trap to cycle focus inside this box.' }}
        </p>
        <div class="mfs-row mfs-gap-2">
          <input type="text" class="mfs-px-2 mfs-py-2 mfs-rounded-sm mfs-surface mfs-text-sm" placeholder="Focusable input" />
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
    description="Zero-CSS IntersectionObserver directive with built-in motion presets (fade-up, fade-down, fade-left, fade-right, zoom-in), staggered delays, and custom class support."
    :code="aosCode"
    :api="aosApi"
  >
    <div class="mfs-stack mfs-w-full mfs-gap-3">
      <div class="mfs-row mfs-justify-between mfs-items-center mfs-gap-2">
        <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
          Scroll inside the box or click Replay to re-trigger presets:
        </p>
        <Button size="sm" variant="secondary" @click="replayAos">Replay</Button>
      </div>
      <div
        ref="aosScrollRef"
        :key="aosReplayKey"
        class="mfs-flex mfs-flex-col mfs-gap-4 mfs-p-5 mfs-rounded-md mfs-surface-subtle demo-aos-scroll"
      >
        <div
          v-animate-on-scroll="{ animation: 'fade-up', once: false }"
          class="mfs-px-5 mfs-py-6 mfs-rounded-sm mfs-surface mfs-font-semibold"
        >
          1. Default / fade-up
        </div>
        <div
          v-animate-on-scroll="{ animation: 'fade-down', once: false }"
          class="mfs-px-5 mfs-py-6 mfs-rounded-sm mfs-surface mfs-font-semibold"
        >
          2. fade-down
        </div>
        <div
          v-animate-on-scroll="{ animation: 'fade-left', once: false }"
          class="mfs-px-5 mfs-py-6 mfs-rounded-sm mfs-surface mfs-font-semibold"
        >
          3. fade-left
        </div>
        <div
          v-animate-on-scroll="{ animation: 'zoom-in', once: false }"
          class="mfs-px-5 mfs-py-6 mfs-rounded-sm mfs-surface mfs-font-semibold"
        >
          4. zoom-in
        </div>
        <div class="demo-aos-stagger-grid">
          <div
            v-for="(delayMs, idx) in [0, 120, 240]"
            :key="delayMs"
            v-animate-on-scroll="{ animation: 'fade-up', delay: delayMs, once: false }"
            class="mfs-px-4 mfs-py-5 mfs-rounded-sm mfs-surface mfs-text-sm mfs-font-semibold mfs-text-center"
          >
            Stagger #{{ idx + 1 }} ({{ delayMs }}ms)
          </div>
        </div>
        <div
          v-animate-on-scroll="{ animation: 'fade-right', distance: 36, duration: 650, once: false }"
          class="mfs-px-5 mfs-py-6 mfs-rounded-sm mfs-surface mfs-font-semibold"
        >
          6. fade-right (36px, 650ms)
        </div>
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
    <div class="mfs-stack mfs-w-full">
      <button
        v-style-class="{ selector: '@next', toggleClass: 'demo-style-active' }"
        type="button"
        class="mfs-px-4 mfs-py-3 mfs-rounded-md mfs-surface-subtle mfs-text-sm mfs-font-semibold mfs-interactive"
      >
        Click to toggle @next sibling class
      </button>
      <div class="mfs-p-4 mfs-rounded-md mfs-surface-subtle demo-style-target">
        Target sibling element (`@next`)
      </div>
    </div>
  </ComponentPreview>

  <!-- v-tooltip -->
  <ComponentPreview
    v-else-if="activeSlug === 'v-tooltip'"
    title="v-tooltip"
    description="Directive attaching theme-aware floating tooltips on hover/focus with placement modifiers and disabled option."
    :code="vTooltipCode"
    :api="vTooltipApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-gap-2">
        <Button v-tooltip="'Top placement (default)'" size="sm" variant="surface">Top</Button>
        <Button v-tooltip.bottom="'Bottom placement'" size="sm" variant="surface">Bottom</Button>
        <Button v-tooltip.left="'Left placement'" size="sm" variant="surface">Left</Button>
        <Button
          v-tooltip.right="{ value: 'Right placement', disabled: tooltipDisabled }"
          size="sm"
          variant="primary"
        >
          Right {{ tooltipDisabled ? '(Disabled)' : '' }}
        </Button>
      </div>
      <div class="mfs-row mfs-gap-2">
        <Button size="sm" variant="secondary" @click="tooltipDisabled = !tooltipDisabled">
          {{ tooltipDisabled ? 'Enable Right Tooltip' : 'Disable Right Tooltip' }}
        </Button>
      </div>
    </div>
  </ComponentPreview>

  <!-- Portal -->
  <ComponentPreview
    v-else-if="activeSlug === 'portal'"
    title="Portal"
    description="Declarative Teleport wrapper rendering slot content into a target DOM selector or inline when disabled."
    :code="portalCode"
    :api="portalApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-items-center mfs-gap-2">
        <Button size="sm" variant="primary" @click="portalDisabled = !portalDisabled">
          {{ portalDisabled ? 'Teleport to Target' : 'Render Inline (disabled)' }}
        </Button>
      </div>
      <div class="mfs-p-3 mfs-rounded-md mfs-surface-subtle mfs-text-sm">
        <span class="mfs-text-muted">Source container:</span>
        <Portal append-to="#mfs-portal-demo-target" :disabled="portalDisabled">
          <span class="mfs-inline-flex mfs-px-3 mfs-py-1 mfs-rounded-full mfs-bg-primary mfs-text-xs mfs-font-semibold">
            Portaled Badge ({{ portalDisabled ? 'Inline' : 'Teleported' }})
          </span>
        </Portal>
      </div>
      <div id="mfs-portal-demo-target" class="mfs-p-3 mfs-rounded-md mfs-surface-subtle mfs-text-sm mfs-flex mfs-items-center mfs-gap-2">
        <span class="mfs-text-muted">Target container (#mfs-portal-demo-target):</span>
      </div>
    </div>
  </ComponentPreview>

  <!-- vBadge -->
  <ComponentPreview
    v-else-if="activeSlug === 'v-badge'"
    title="vBadge"
    description="Directive attaching a compact semantic badge directly onto any element without a wrapper component."
    :code="vBadgeCode"
    :api="vBadgeApi"
  >
    <div class="mfs-stack mfs-w-full">
      <div class="mfs-row mfs-items-center mfs-gap-4">
        <Button v-badge="vBadgeCount" size="sm" variant="surface" @click="vBadgeCount++">
          Inbox
        </Button>
        <Button v-badge="{ value: 'NEW', severity: 'success' }" size="sm" variant="surface">
          Updates
        </Button>
        <Button v-badge="{ value: '99+', severity: 'danger' }" size="sm" variant="surface">
          Alerts
        </Button>
      </div>
      <div class="mfs-row mfs-gap-2">
        <Button size="sm" variant="primary" @click="vBadgeCount++">Increment</Button>
        <Button size="sm" variant="surface" @click="vBadgeCount = 0">Set 0</Button>
      </div>
    </div>
  </ComponentPreview>

  <!-- vKeyFilter -->
  <ComponentPreview
    v-else-if="activeSlug === 'v-keyfilter'"
    title="vKeyFilter"
    description="Directive restricting keyboard typing and clipboard paste to preset patterns (int, hex, alpha) or custom RegExp."
    :code="vKeyFilterCode"
    :api="vKeyFilterApi"
  >
    <div class="mfs-grid mfs-w-full">
      <div class="mfs-stack mfs-gap-1">
        <label class="mfs-text-xs mfs-font-semibold mfs-text">Integer only (int)</label>
        <input
          v-model="keyFilterInt"
          v-keyfilter="'int'"
          type="text"
          placeholder="e.g. -42"
          class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-inset mfs-text mfs-text-sm mfs-w-full"
        />
      </div>
      <div class="mfs-stack mfs-gap-1">
        <label class="mfs-text-xs mfs-font-semibold mfs-text">Hexadecimal (hex)</label>
        <input
          v-model="keyFilterHex"
          v-keyfilter="'hex'"
          type="text"
          placeholder="e.g. 1A2F"
          class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-inset mfs-text mfs-text-sm mfs-w-full"
        />
      </div>
      <div class="mfs-stack mfs-gap-1">
        <label class="mfs-text-xs mfs-font-semibold mfs-text">Slug RegExp (/[a-z0-9-]/)</label>
        <input
          v-model="keyFilterSlug"
          v-keyfilter="/[a-z0-9-]/"
          type="text"
          placeholder="e.g. my-slug-1"
          class="mfs-px-3 mfs-py-2 mfs-rounded-sm mfs-inset mfs-text mfs-text-sm mfs-w-full"
        />
      </div>
    </div>
  </ComponentPreview>

  <!-- PageTransition -->
  <div v-else-if="activeSlug === 'page-transition'" class="mfs-stack mfs-gap-6">
    <ComponentPreview
      title="Slide Up (Default)"
      description="Smooth vertical slide-and-fade route transition using the default 'slide-up' preset."
      :code="pageTransitionSlideUpCode"
      :code-tabs="pageTransitionCodeTabs"
      :api="pageTransitionApi"
    >
      <div class="mfs-stack mfs-w-full mfs-gap-3">
        <div class="mfs-row mfs-gap-2">
          <Button size="sm" variant="primary" @click="ptSlideUpView = ptSlideUpView === 'A' ? 'B' : 'A'">
            Switch View ({{ ptSlideUpView }})
          </Button>
        </div>
        <div class="mfs-overflow-hidden mfs-rounded-md">
          <PageTransition>
            <div :key="ptSlideUpView" class="mfs-p-4 mfs-rounded-md mfs-surface-subtle">
              <h4 class="mfs-mt-0 mfs-mb-1 mfs-text-base mfs-font-bold mfs-text">
                View {{ ptSlideUpView }} — Slide Up
              </h4>
              <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
                Content enters upward and fades out smoothly on route or state change.
              </p>
            </div>
          </PageTransition>
        </div>
      </div>
    </ComponentPreview>

    <ComponentPreview
      title="Fade"
      description="Subtle opacity cross-fade transition for minimal layout shifts."
      :code="pageTransitionFadeCode"
    >
      <div class="mfs-stack mfs-w-full mfs-gap-3">
        <div class="mfs-row mfs-gap-2">
          <Button size="sm" variant="primary" @click="ptFadeView = ptFadeView === 'A' ? 'B' : 'A'">
            Switch View ({{ ptFadeView }})
          </Button>
        </div>
        <div class="mfs-overflow-hidden mfs-rounded-md">
          <PageTransition name="fade">
            <div :key="ptFadeView" class="mfs-p-4 mfs-rounded-md mfs-surface-subtle">
              <h4 class="mfs-mt-0 mfs-mb-1 mfs-text-base mfs-font-bold mfs-text">
                View {{ ptFadeView }} — Fade
              </h4>
              <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
                Pure opacity transition ideal for dashboards and detail views.
              </p>
            </div>
          </PageTransition>
        </div>
      </div>
    </ComponentPreview>

    <ComponentPreview
      title="Slide Left"
      description="Directional horizontal slide transition for step-by-step or drill-down navigation."
      :code="pageTransitionSlideLeftCode"
    >
      <div class="mfs-stack mfs-w-full mfs-gap-3">
        <div class="mfs-row mfs-gap-2">
          <Button size="sm" variant="primary" @click="ptSlideLeftView = ptSlideLeftView === 'A' ? 'B' : 'A'">
            Switch View ({{ ptSlideLeftView }})
          </Button>
        </div>
        <div class="mfs-overflow-hidden mfs-rounded-md">
          <PageTransition name="slide-left">
            <div :key="ptSlideLeftView" class="mfs-p-4 mfs-rounded-md mfs-surface-subtle">
              <h4 class="mfs-mt-0 mfs-mb-1 mfs-text-base mfs-font-bold mfs-text">
                View {{ ptSlideLeftView }} — Slide Left
              </h4>
              <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
                Slides horizontally along the X axis while respecting overflow bounds.
              </p>
            </div>
          </PageTransition>
        </div>
      </div>
    </ComponentPreview>

    <ComponentPreview
      title="Scale"
      description="Zoom-and-fade transition for focused modal-like page switches."
      :code="pageTransitionScaleCode"
    >
      <div class="mfs-stack mfs-w-full mfs-gap-3">
        <div class="mfs-row mfs-gap-2">
          <Button size="sm" variant="primary" @click="ptScaleView = ptScaleView === 'A' ? 'B' : 'A'">
            Switch View ({{ ptScaleView }})
          </Button>
        </div>
        <div class="mfs-overflow-hidden mfs-rounded-md">
          <PageTransition name="scale">
            <div :key="ptScaleView" class="mfs-p-4 mfs-rounded-md mfs-surface-subtle">
              <h4 class="mfs-mt-0 mfs-mb-1 mfs-text-base mfs-font-bold mfs-text">
                View {{ ptScaleView }} — Scale
              </h4>
              <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
                Scales gently into view for card or workspace transitions.
              </p>
            </div>
          </PageTransition>
        </div>
      </div>
    </ComponentPreview>
  </div>

  <!-- usePageProgress -->
  <ComponentPreview
    v-else-if="activeSlug === 'use-page-progress'"
    title="usePageProgress"
    description="Top-edge progress bar composable with manual start/set/done controls and one-line Vue Router integration."
    :code="usePageProgressCode"
    :code-tabs="usePageProgressCodeTabs"
    :api="usePageProgressApi"
  >
    <div class="mfs-stack mfs-w-full mfs-gap-3">
      <div class="mfs-row mfs-items-center mfs-flex-wrap mfs-gap-2">
        <Button size="sm" variant="primary" @click="pageProgress.start()">start()</Button>
        <Button size="sm" variant="secondary" @click="pageProgress.set(0.5)">set(0.5)</Button>
        <Button size="sm" variant="surface" @click="pageProgress.done()">done()</Button>
        <Badge :variant="pageProgress.isLoading.value ? 'primary' : 'surface'" size="sm">
          isLoading: {{ pageProgress.isLoading.value }}
        </Badge>
      </div>
      <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-status">
        Trigger <strong>start()</strong> or <strong>set(0.5)</strong> to preview the top viewport progress bar, then <strong>done()</strong> to complete it.
      </p>
    </div>
  </ComponentPreview>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import { Badge, Button } from '../../lib'
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
import { vTooltip } from '../../lib/directives/tooltip'
import Portal from '../../lib/components/Portal.vue'
import { vBadge } from '../../lib/directives/badgeDirective'
import { vKeyFilter as vKeyfilter } from '../../lib/directives/keyFilter'
import PageTransition from '../../lib/components/PageTransition.vue'
import { usePageProgress } from '../../lib/composables/usePageProgress'

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

const confirmPopupCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, ConfirmPopup } from '@mfs-atomic/ui'

const popupRef = ref<InstanceType<typeof ConfirmPopup> | null>(null)
const status = ref('Waiting')

const ask = (e: MouseEvent) => {
  popupRef.value?.show(e, {
    message: 'Delete this item permanently?',
    acceptLabel: 'Delete',
    rejectLabel: 'Cancel',
    variant: 'danger',
    onAccept: () => {
      status.value = 'Deleted'
    },
    onReject: () => {
      status.value = 'Cancelled'
    }
  })
}
<\/script>

<template>
  <Button variant="danger" @click="ask($event)">Delete Item</Button>
  <ConfirmPopup ref="popupRef" />
  <p>Last response: {{ status }}</p>
</template>`

const confirmPopupCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: confirmPopupCode
  },
  {
    label: 'Options',
    filename: 'options.ts',
    code: `export interface ConfirmPopupShowOptions {
  message?: string
  acceptLabel?: string
  rejectLabel?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  onAccept?: () => void
  onReject?: () => void
}

export const deletePopupOptions: ConfirmPopupShowOptions = {
  message: 'Delete this item permanently?',
  acceptLabel: 'Delete',
  rejectLabel: 'Cancel',
  variant: 'danger'
}`
  }
]

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
const inlineMessageCode = `<script setup lang="ts">
import { InlineMessage } from '@mfs-atomic/ui'
<\/script>

<template>
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

const blockUiCode = `<script setup lang="ts">
import { ref } from 'vue'
import { BlockUI, Button } from '@mfs-atomic/ui'

const isBlocked = ref(false)
<\/script>

<template>
  <Button size="sm" variant="primary" @click="isBlocked = !isBlocked">
    {{ isBlocked ? 'Unblock Panel' : 'Block Panel' }}
  </Button>

  <BlockUI :blocked="isBlocked" label="Syncing workspace...">
    <div class="panel">
      <h4>Project Settings</h4>
      <p>Inert and blurred while blocked is true.</p>
    </div>
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

const galleriaCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Galleria, type GalleriaImage } from '@mfs-atomic/ui'

const activeIndex = ref(0)
const images: GalleriaImage[] = [
  { src: '/gallery/clay.jpg', alt: 'Claymorphism', title: 'Claymorphism Surface' },
  { src: '/gallery/glass.jpg', alt: 'Glassmorphism', title: 'Glassmorphism Blur' },
  { src: '/gallery/neo.jpg', alt: 'Neumorphism', title: 'Neumorphism Depth' }
]
<\/script>

<template>
  <Galleria v-model:active-index="activeIndex" :images="images" />
</template>`

const galleriaCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: galleriaCode
  },
  {
    label: 'Data Format',
    filename: 'data.ts',
    code: `import type { GalleriaImage } from '@mfs-atomic/ui'

export const galleryImages: GalleriaImage[] = [
  {
    src: '/gallery/clay.jpg',
    thumbnail: '/gallery/clay-thumb.jpg',
    alt: 'Claymorphism Surface',
    title: 'Claymorphism Surface'
  },
  {
    src: '/gallery/glass.jpg',
    thumbnail: '/gallery/glass-thumb.jpg',
    alt: 'Glassmorphism Blur',
    title: 'Glassmorphism Blur'
  }
]`
  },
  {
    label: 'Fetch API',
    filename: 'api.ts',
    code: `import type { GalleriaImage } from '@mfs-atomic/ui'

export async function fetchGallery(): Promise<GalleriaImage[]> {
  const res = await fetch('/api/gallery')
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return (await res.json()) as GalleriaImage[]
}`
  }
]

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

const fileUploadCode = `<script setup lang="ts">
import { ref } from 'vue'
import { FileUpload } from '@mfs-atomic/ui'

const progress = ref(0)
const status = ref('No files selected')

const onSelect = (files: File[]) => {
  status.value = \`\${files.length} file(s) ready\`
  progress.value = 100
}

const onClear = () => {
  progress.value = 0
  status.value = 'No files selected'
}
<\/script>

<template>
  <FileUpload
    multiple
    accept="image/*,.pdf,.txt"
    :max-file-size="2097152"
    :progress="progress"
    @select="onSelect"
    @remove="status = \`Removed \${$event.name}\`"
    @error="status = $event"
    @clear="onClear"
  />
  <p>Status: {{ status }}</p>
</template>`

const fileUploadCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: fileUploadCode
  },
  {
    label: 'Upload API',
    filename: 'upload.ts',
    code: `export async function uploadFiles(
  files: File[],
  onProgress?: (percent: number) => void
): Promise<void> {
  const formData = new FormData()
  files.forEach((file) => formData.append('files[]', file))

  onProgress?.(25)
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  if (!res.ok) throw new Error(\`Upload failed (\${res.status})\`)
  onProgress?.(100)
}`
  }
]

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

const terminalCode = `<script setup lang="ts">
import { Terminal, type TerminalCommandPayload } from '@mfs-atomic/ui'

const commands: Record<string, (args: string[]) => string> = {
  help: () => 'Available: help, date, echo <text>, clear',
  date: () => new Date().toLocaleString(),
  echo: (args) => args.join(' ') || '(empty)'
}

const onCommand = (payload: TerminalCommandPayload) => {
  payload.respond(\`Command not found: \${payload.command}. Try 'help'.\`)
}
<\/script>

<template>
  <Terminal
    welcome-message="MFS Terminal — type 'help' or 'clear'."
    prompt="mfs $"
    :commands="commands"
    @command="onCommand"
  />
</template>`

const terminalCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: terminalCode
  },
  {
    label: 'Commands',
    filename: 'commands.ts',
    code: `export type TerminalCommandMap = Record<
  string,
  (args: string[]) => string | Promise<string>
>

export const terminalCommands: TerminalCommandMap = {
  help: () => 'Available commands: help, date, echo <text>, status, clear',
  date: () => new Date().toISOString(),
  echo: (args) => args.join(' ') || '(empty)',
  status: async () => {
    const res = await fetch('/api/health')
    return res.ok ? 'API: healthy' : \`API: degraded (\${res.status})\`
  }
}`
  }
]

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
const barLineChartData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    { label: 'Components', data: [18, 28, 36, 44, 52] },
    { label: 'Adoption', data: [12, 20, 29, 38, 46] }
  ]
}

const pieDoughnutChartData: ChartData = {
  labels: ['Clay', 'Glass', 'Neo'],
  datasets: [{ label: 'Themes', data: [48, 32, 20] }]
}

const makeSeriesChartCode = (type: 'bar' | 'line') => `<script setup lang="ts">
import { Chart, type ChartData } from '@mfs-atomic/ui'

const chartData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    { label: 'Components', data: [18, 28, 36, 44, 52] },
    { label: 'Adoption', data: [12, 20, 29, 38, 46] }
  ]
}
<\/script>

<template>
  <Chart type="${type}" :data="chartData" :height="220" />
</template>`

const makePartChartCode = (type: 'pie' | 'doughnut') => `<script setup lang="ts">
import { Chart, type ChartData } from '@mfs-atomic/ui'

const chartData: ChartData = {
  labels: ['Clay', 'Glass', 'Neo'],
  datasets: [{ label: 'Themes', data: [48, 32, 20] }]
}
<\/script>

<template>
  <Chart type="${type}" :data="chartData" :height="220" />
</template>`

const barChartCode = makeSeriesChartCode('bar')
const lineChartCode = makeSeriesChartCode('line')
const pieChartCode = makePartChartCode('pie')
const doughnutChartCode = makePartChartCode('doughnut')

const chartCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: barChartCode
  },
  {
    label: 'Data Format',
    filename: 'data.ts',
    code: `import type { ChartData } from '@mfs-atomic/ui'

export const barLineData: ChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
  datasets: [
    { label: 'Components', data: [18, 28, 36, 44, 52] },
    { label: 'Adoption', data: [12, 20, 29, 38, 46] }
  ]
}

export const pieDoughnutData: ChartData = {
  labels: ['Clay', 'Glass', 'Neo'],
  datasets: [{ label: 'Themes', data: [48, 32, 20] }]
}`
  },
  {
    label: 'Fetch API',
    filename: 'api.ts',
    code: `import type { ChartData } from '@mfs-atomic/ui'

export async function fetchChartMetrics(range: '7d' | '30d'): Promise<ChartData> {
  const res = await fetch(\`/api/analytics/chart?range=\${range}\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return (await res.json()) as ChartData
}`
  }
]

const chartApi = {
  props: [
    { name: 'type', type: "'bar' | 'line' | 'pie' | 'doughnut'", default: "'bar'", description: 'Chart visualization type.' },
    { name: 'data', type: 'ChartData', default: '—', description: 'Required labels and datasets object.' },
    { name: 'height', type: 'number', default: '240', description: 'SVG viewBox height in pixels.' }
  ]
}

/* ---------- Directives ---------- */
const trapActive = ref(false)

const rippleCode = `<script setup lang="ts">
import { vRipple } from '@mfs-atomic/ui'
<\/script>

<template>
  <button v-ripple type="button">Default Ripple</button>
  <button v-ripple="{ color: 'var(--primary)' }" type="button">Primary Ripple</button>
  <button v-ripple="false" type="button">Disabled</button>
</template>`

const rippleApi = {
  props: [
    { name: 'v-ripple', type: 'boolean | { color?: string; disabled?: boolean }', default: 'true', description: 'Directive binding controlling ripple color or disabled state.' }
  ]
}

const focusTrapCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, vFocusTrap } from '@mfs-atomic/ui'

const trapActive = ref(false)
<\/script>

<template>
  <Button size="sm" @click="trapActive = !trapActive">
    {{ trapActive ? 'Disable Focus Trap' : 'Enable Focus Trap' }}
  </Button>

  <div v-focus-trap="trapActive">
    <input type="text" placeholder="Focusable input" />
    <Button size="sm" @click="trapActive = false">Release</Button>
  </div>
</template>`

const focusTrapApi = {
  props: [
    { name: 'v-focus-trap', type: 'boolean | undefined', default: 'true', description: 'Activates or deactivates Tab focus trapping inside the host element.' }
  ]
}

const aosScrollRef = ref<HTMLElement | null>(null)
const aosReplayKey = ref(0)

const replayAos = () => {
  aosReplayKey.value += 1
  requestAnimationFrame(() => {
    if (aosScrollRef.value) {
      aosScrollRef.value.scrollTop = 0
    }
  })
}

const aosCode = `<script setup lang="ts">
import { vAnimateOnScroll } from '@mfs-atomic/ui'
<\/script>

<template>
  <!-- Default preset ('fade-up') with zero CSS -->
  <div v-animate-on-scroll>Fade up on scroll</div>

  <!-- Built-in string presets: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' -->
  <div v-animate-on-scroll="'fade-left'">Slide from right</div>
  <div v-animate-on-scroll="'zoom-in'">Zoom in</div>

  <!-- Staggered delay & custom timing -->
  <div v-animate-on-scroll="{ animation: 'fade-up', delay: 150, duration: 600 }">
    Delayed reveal
  </div>

  <!-- Custom CSS class mode -->
  <div v-animate-on-scroll="{ enterClass: 'fade-in', leaveClass: 'fade-out', once: false }">
    Custom classes
  </div>
</template>`

const aosApi = {
  props: [
    { name: 'v-animate-on-scroll', type: "AnimateOnScrollPreset | string | AnimateOnScrollOptions", default: "'fade-up'", description: "Built-in preset ('fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in'), custom class string, or options object." },
    { name: 'animation', type: "'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in'", default: "'fade-up'", description: 'Built-in inline transition preset when enterClass is not provided.' },
    { name: 'duration', type: 'number', default: '500', description: 'Transition duration in milliseconds (cubic-bezier(0.22, 1, 0.36, 1)).' },
    { name: 'delay', type: 'number', default: '0', description: 'Transition delay in milliseconds (useful for staggered reveals).' },
    { name: 'distance', type: 'number', default: '24', description: 'Translate offset in pixels for fade-* presets.' },
    { name: 'threshold', type: 'number', default: '0.1', description: 'IntersectionObserver visibility threshold (0 to 1).' },
    { name: 'once', type: 'boolean', default: 'true', description: 'Unobserves element after first intersection when true.' },
    { name: 'enterClass', type: 'string', default: 'undefined', description: 'Custom CSS class added on enter; disables inline preset styling when set.' },
    { name: 'leaveClass', type: 'string', default: "''", description: 'Custom CSS class added on leave when once is false.' }
  ]
}

const styleClassCode = `<script setup lang="ts">
import { vStyleClass } from '@mfs-atomic/ui'
<\/script>

<template>
  <button v-style-class="{ selector: '@next', toggleClass: 'is-active' }" type="button">
    Toggle Sibling
  </button>
  <div>Target sibling</div>
</template>`

const styleClassApi = {
  props: [
    { name: 'v-style-class', type: 'string | { selector?: string; toggleClass?: string; enterClass?: string; leaveClass?: string }', default: '—', description: 'Selector (@self, @next, @prev, @parent, @grandparent, or CSS) and classes to toggle on click.' }
  ]
}

/* ---------- v-tooltip ---------- */
const tooltipDisabled = ref(false)

const vTooltipCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, vTooltip } from '@mfs-atomic/ui'

const tooltipDisabled = ref(false)
<\/script>

<template>
  <Button v-tooltip="'Top tooltip'">Top</Button>
  <Button v-tooltip.bottom="'Bottom tooltip'">Bottom</Button>
  <Button v-tooltip.left="'Left tooltip'">Left</Button>
  <Button v-tooltip.right="{ value: 'Right tooltip', disabled: tooltipDisabled }">
    Right
  </Button>
</template>`

const vTooltipApi = {
  props: [
    { name: 'v-tooltip', type: 'string | { value?: string; disabled?: boolean; class?: string }', default: '—', description: 'Tooltip text or options object.' },
    { name: '.top / .bottom / .left / .right', type: 'Directive modifier', default: '.top', description: 'Preferred placement relative to the host element.' }
  ]
}

/* ---------- Portal ---------- */
const portalDisabled = ref(false)

const portalCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Portal } from '@mfs-atomic/ui'

const inline = ref(false)
<\/script>

<template>
  <Button size="sm" @click="inline = !inline">
    {{ inline ? 'Teleport to Target' : 'Render Inline' }}
  </Button>

  <Portal append-to="#target" :disabled="inline">
    <span>Portaled content</span>
  </Portal>
  <div id="target" />
</template>`

const portalApi = {
  props: [
    { name: 'appendTo', type: 'string | HTMLElement', default: "'body'", description: 'Target CSS selector or element passed to Teleport.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Renders content inline in place when true.' }
  ],
  slots: [{ name: 'default', description: 'Content to teleport.' }]
}

/* ---------- vBadge ---------- */
const vBadgeCount = ref(4)

const vBadgeCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, vBadge } from '@mfs-atomic/ui'

const count = ref(4)
<\/script>

<template>
  <Button v-badge="count" @click="count++">Inbox</Button>
  <Button v-badge="{ value: 'NEW', severity: 'success' }">Updates</Button>
  <Button v-badge="{ value: '99+', severity: 'danger' }">Alerts</Button>
</template>`

const vBadgeApi = {
  props: [
    { name: 'v-badge', type: 'string | number | { value: string | number; severity?: BadgeSeverity }', default: '—', description: 'Badge text/number or options object with severity.' }
  ]
}

/* ---------- vKeyFilter ---------- */
const keyFilterInt = ref('2026')
const keyFilterHex = ref('FF8800')
const keyFilterSlug = ref('mfs-theme')

const vKeyFilterCode = `<script setup lang="ts">
import { ref } from 'vue'
import { vKeyFilter as vKeyfilter } from '@mfs-atomic/ui'

const intVal = ref('2026')
const hexVal = ref('FF8800')
const slugVal = ref('mfs-theme')
<\/script>

<template>
  <input v-model="intVal" v-keyfilter="'int'" placeholder="e.g. -42" />
  <input v-model="hexVal" v-keyfilter="'hex'" placeholder="e.g. 1A2F" />
  <input v-model="slugVal" v-keyfilter="/[a-z0-9-]/" placeholder="e.g. my-slug-1" />
</template>`

const vKeyFilterApi = {
  props: [
    { name: 'v-keyfilter', type: "'int' | 'pint' | 'num' | 'pnum' | 'money' | 'hex' | 'alpha' | 'alphanum' | RegExp", default: '—', description: 'Preset character class or RegExp enforced on keypress and paste.' }
  ]
}

/* ---------- PageTransition ---------- */
const ptSlideUpView = ref<'A' | 'B'>('A')
const ptFadeView = ref<'A' | 'B'>('A')
const ptSlideLeftView = ref<'A' | 'B'>('A')
const ptScaleView = ref<'A' | 'B'>('A')

const makePageTransitionCode = (preset?: string) => `<script setup lang="ts">
import { ref } from 'vue'
import { Button, PageTransition } from '@mfs-atomic/ui'

const activeView = ref<'A' | 'B'>('A')
<\/script>

<template>
  <Button size="sm" @click="activeView = activeView === 'A' ? 'B' : 'A'">
    Switch View
  </Button>

  <PageTransition${preset ? ` name="${preset}"` : ''}>
    <div :key="activeView">View {{ activeView }}</div>
  </PageTransition>
</template>`

const pageTransitionSlideUpCode = makePageTransitionCode()
const pageTransitionFadeCode = makePageTransitionCode('fade')
const pageTransitionSlideLeftCode = makePageTransitionCode('slide-left')
const pageTransitionScaleCode = makePageTransitionCode('scale')

const pageTransitionCodeTabs = [
  {
    label: 'Component',
    filename: 'RouterView.vue',
    code: `<script setup lang="ts">
import { PageTransition } from '@mfs-atomic/ui'
<\/script>

<template>
  <RouterView v-slot="{ Component, route }">
    <PageTransition name="slide-up">
      <component :is="Component" :key="route.path" />
    </PageTransition>
  </RouterView>
</template>`
  },
  {
    label: 'Data / TS',
    filename: 'transitions.ts',
    code: `export type PageTransitionPreset = 'slide-up' | 'fade' | 'slide-left' | 'scale'

export const routeTransitions: Record<string, PageTransitionPreset> = {
  '/': 'fade',
  '/dashboard': 'slide-up',
  '/settings': 'slide-left',
  '/preview': 'scale'
}`
  },
  {
    label: 'Full Code',
    filename: 'Example.vue',
    code: pageTransitionSlideUpCode
  }
]

const pageTransitionApi = {
  props: [
    { name: 'name', type: "'slide-up' | 'fade' | 'slide-left' | 'scale' | string", default: "'slide-up'", description: 'Built-in transition preset or custom CSS transition name.' },
    { name: 'mode', type: "'out-in' | 'in-out' | 'default'", default: "'out-in'", description: 'Vue Transition timing mode between leaving and entering views.' },
    { name: 'appear', type: 'boolean', default: 'false', description: 'Applies transition on initial mount.' }
  ],
  slots: [
    { name: 'default', description: 'Route component or keyed element to animate.' }
  ]
}

/* ---------- usePageProgress ---------- */
const pageProgress = usePageProgress()

const usePageProgressCode = `<script setup lang="ts">
import { Badge, Button, usePageProgress } from '@mfs-atomic/ui'

const { isLoading, start, set, done } = usePageProgress()
<\/script>

<template>
  <Button size="sm" @click="start()">start()</Button>
  <Button size="sm" @click="set(0.5)">set(0.5)</Button>
  <Button size="sm" @click="done()">done()</Button>
  <Badge :variant="isLoading ? 'primary' : 'surface'">
    isLoading: {{ isLoading }}
  </Badge>
</template>`

const usePageProgressCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: usePageProgressCode
  },
  {
    label: 'Router Setup',
    filename: 'main.ts',
    code: `import { createApp } from 'vue'
import { MfsTheme } from '@mfs-atomic/ui'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(MfsTheme, { defaultTheme: 'clay', router })
app.mount('#app')`
  }
]

const usePageProgressApi = {
  props: [
    { name: 'isLoading', type: 'Readonly<Ref<boolean>>', default: 'false', description: 'Reactive flag indicating whether progress bar is active.' },
    { name: 'start()', type: '() => void', default: '—', description: 'Starts the top-edge progress bar and increments smoothly.' },
    { name: 'set(value)', type: '(value: number) => void', default: '—', description: 'Sets progress to a specific ratio between 0 and 1.' },
    { name: 'done()', type: '() => void', default: '—', description: 'Completes the bar to 100% and fades it out.' },
    { name: 'MfsTheme ({ router })', type: 'ThemePluginOptions', default: 'undefined', description: 'Pass Vue Router instance to app.use(MfsTheme, { defaultTheme: \'clay\', router }) for automatic route progress.' }
  ]
}
</script>

<style scoped>
.demo-status strong {
  color: var(--text);
}

.demo-ripple-box--muted {
  opacity: 0.65;
  cursor: pointer;
}

.demo-aos-scroll {
  height: 380px;
  overflow-y: auto;
  overflow-x: hidden;
}

.demo-aos-scroll > * {
  flex-shrink: 0;
}

.demo-aos-stagger-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.demo-style-target {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.demo-style-active {
  border-color: var(--primary);
  box-shadow: var(--clay-shadow);
}
</style>
