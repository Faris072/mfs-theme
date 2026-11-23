<template>
  <div class="mfs-stack mfs-w-full">
    <!-- BUTTON -->
    <template v-if="activeSlug === 'button'">
      <ComponentPreview
        title="Variants"
        description="Semantic color variants adapting to Clay, Glass, and Neo themes."
        :code="buttonVariantsCode"
      >
        <div class="mfs-row mfs-w-full">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="surface">Surface</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
        </div>
      </ComponentPreview>

      <ComponentPreview
        title="Sizes & Shape"
        description="Control padding with size and toggle pill vs. rounded corners."
        :code="buttonSizesCode"
      >
        <div class="mfs-row mfs-w-full">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button :pill="false" variant="surface">Rounded</Button>
        </div>
      </ComponentPreview>

      <ComponentPreview
        title="Icons, States & Block"
        description="Use prepend/append slots, interactive loading toggle, disabled state, and full-width block."
        :code="buttonStatesCode"
        :api="buttonApi"
      >
        <div class="mfs-stack mfs-w-full">
          <div class="mfs-row mfs-w-full">
            <Button @click="triggerButtonLoad" :loading="buttonLoading">
              <template #prepend><Sparkles :size="16" /></template>
              {{ buttonLoading ? 'Saving...' : 'Click to Load' }}
            </Button>
            <Button variant="surface">
              Continue
              <template #append><ArrowRight :size="16" /></template>
            </Button>
            <Button disabled>Disabled</Button>
          </div>
          <Button block variant="secondary">Full-Width Block Button</Button>
        </div>
      </ComponentPreview>
    </template>

    <!-- INPUT -->
    <template v-else-if="activeSlug === 'input'">
      <ComponentPreview
        title="Basic & Helper Text"
        description="Two-way v-model binding with label, placeholder, required mark, and hint."
        :code="inputBasicCode"
      >
        <div class="mfs-grid mfs-w-full">
          <Input
            id="demo-name"
            v-model="inputName"
            label="Full Name"
            placeholder="Jane Doe"
            hint="Used on your public profile."
            required
          />
          <Input
            id="demo-email"
            v-model="inputEmail"
            type="email"
            label="Email Address"
            placeholder="jane@example.com"
          >
            <template #prepend><Mail :size="16" /></template>
          </Input>
        </div>
      </ComponentPreview>

      <ComponentPreview
        title="Affixes & Validation States"
        description="Prepend/append slots, error feedback, readonly, and disabled states."
        :code="inputStatesCode"
        :api="inputApi"
      >
        <div class="mfs-grid mfs-w-full">
          <Input
            id="demo-search"
            v-model="inputSearch"
            label="Search"
            placeholder="Filter components..."
          >
            <template #prepend><Search :size="16" /></template>
            <template #append>
              <Badge v-if="inputSearch" size="sm" variant="primary">{{ inputSearch.length }}</Badge>
            </template>
          </Input>
          <Input
            id="demo-error"
            v-model="inputErrorVal"
            label="Username"
            placeholder="admin"
            :error="inputErrorVal.length < 3 ? 'Must be at least 3 characters.' : ''"
          />
          <Input
            id="demo-readonly"
            model-value="MFS-2026-KEY"
            label="API Token (Readonly)"
            readonly
          />
          <Input
            id="demo-disabled"
            model-value="Locked field"
            label="Disabled Input"
            disabled
          />
        </div>
      </ComponentPreview>
    </template>

    <!-- CARD -->
    <template v-else-if="activeSlug === 'card'">
      <ComponentPreview
        title="Basic & Hoverable Cards"
        description="Structured surface container with title, subtitle, body, and hover elevation."
        :code="cardBasicCode"
      >
        <div class="mfs-grid mfs-w-full">
          <Card title="Project Overview" subtitle="Updated 5 mins ago" hoverable>
            <p class="mfs-m-0 mfs-text-sm mfs-text">
              Adaptive surface container that inherits Clay, Glass, or Neo depth automatically.
            </p>
            <template #footer>
              <Button size="sm" variant="surface">Details</Button>
              <Button size="sm">Open</Button>
            </template>
          </Card>

          <Card bordered>
            <template #header>
              <div class="mfs-flex mfs-items-center mfs-justify-between mfs-gap-3 mfs-w-full">
                <span class="mfs-inline-flex mfs-items-center mfs-gap-2 mfs-font-bold mfs-text">
                  <Layers :size="18" />
                  Custom Header Slot
                </span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>
            </template>
            <p class="mfs-m-0 mfs-text-sm mfs-text">
              Use the <code>header</code> and <code>footer</code> slots for full layout control.
            </p>
            <template #footer>
              <span class="mfs-caption">v1.0.0</span>
            </template>
          </Card>
        </div>
      </ComponentPreview>

      <ComponentPreview
        title="Interactive Card"
        description="Combine Card with form controls inside a responsive layout."
        :code="cardInteractiveCode"
        :api="cardApi"
      >
        <div class="mfs-stack mfs-w-full">
          <Card title="Quick Preferences" subtitle="Changes apply immediately">
            <div class="mfs-flex mfs-flex-col mfs-gap-3 mfs-w-full">
              <Switch v-model="cardNotify" label="Email notifications" />
              <Switch v-model="cardCompact" label="Compact density" />
            </div>
            <template #footer>
              <Badge variant="surface" size="sm">
                {{ cardNotify ? 'Alerts On' : 'Alerts Off' }}
              </Badge>
            </template>
          </Card>
        </div>
      </ComponentPreview>
    </template>

    <!-- BADGE -->
    <template v-else-if="activeSlug === 'badge'">
      <ComponentPreview
        title="Variants & Sizes"
        description="Semantic status pills in small and medium sizes."
        :code="badgeVariantsCode"
      >
        <div class="mfs-stack mfs-w-full">
          <div class="mfs-row mfs-w-full">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="surface">Surface</Badge>
          </div>
          <div class="mfs-row mfs-w-full">
            <Badge size="sm" variant="primary">Small</Badge>
            <Badge size="md" variant="primary">Medium</Badge>
          </div>
        </div>
      </ComponentPreview>

      <ComponentPreview
        title="With Icons & Counter"
        description="Use the prepend slot for icons or status indicators."
        :code="badgeSlotsCode"
        :api="badgeApi"
      >
        <div class="mfs-row mfs-w-full">
          <Badge variant="success">
            <template #prepend><CheckCircle2 :size="13" /></template>
            Verified
          </Badge>
          <Badge variant="warning">
            <template #prepend><Bell :size="13" /></template>
            3 Pending
          </Badge>
          <Button size="sm" variant="surface" @click="badgeCount++">
            Notifications
            <template #append>
              <Badge size="sm" variant="danger">{{ badgeCount }}</Badge>
            </template>
          </Button>
        </div>
      </ComponentPreview>
    </template>

    <!-- SWITCH -->
    <template v-else-if="activeSlug === 'switch'">
      <ComponentPreview
        title="Basic & States"
        description="Accessible boolean toggle with v-model, label prop, and disabled state."
        :code="switchBasicCode"
      >
        <div class="mfs-flex mfs-flex-col mfs-gap-3 mfs-w-full">
          <Switch v-model="switchAutoSave" label="Enable auto-save" />
          <Switch v-model="switchAnalytics" label="Share anonymous usage" />
          <Switch :model-value="true" label="Locked enabled" disabled />
          <Switch :model-value="false" label="Locked disabled" disabled />
        </div>
      </ComponentPreview>

      <ComponentPreview
        title="Custom Label Slot & Change Event"
        description="Pass rich content via default slot and react to @change."
        :code="switchSlotCode"
        :api="switchApi"
      >
        <div class="mfs-row mfs-w-full">
          <Switch v-model="switchBeta" @change="onSwitchChange">
            <span class="mfs-inline-flex mfs-items-center mfs-gap-2">
              Beta features
              <Badge size="sm" :variant="switchBeta ? 'success' : 'surface'">
                {{ switchBeta ? 'Enabled' : 'Off' }}
              </Badge>
            </span>
          </Switch>
          <span class="mfs-caption">Last change: {{ switchLastEvent }}</span>
        </div>
      </ComponentPreview>
    </template>

    <!-- MODAL -->
    <template v-else-if="activeSlug === 'modal'">
      <ComponentPreview
        title="Sizes & Backdrop Behavior"
        description="Teleported dialog with sm/md/lg sizes, body scroll lock, and footer slot."
        :code="modalBasicCode"
        :api="modalApi"
      >
        <div class="mfs-row mfs-w-full">
          <Button size="sm" @click="openModal('sm')">Small Modal</Button>
          <Button size="md" variant="secondary" @click="openModal('md')">Medium Modal</Button>
          <Button size="md" variant="surface" @click="openModal('lg')">Large Modal</Button>
          <Button size="md" variant="warning" @click="persistentModalOpen = true">
            Persistent (No Backdrop Close)
          </Button>
        </div>

        <Modal v-model="modalOpen" :size="modalSize" :title="`Modal (${modalSize.toUpperCase()})`">
          <p class="mfs-m-0 mfs-text-sm mfs-text">
            This dialog adapts to the active theme and locks background scrolling while open.
          </p>
          <template #footer>
            <Button size="sm" variant="surface" @click="modalOpen = false">Cancel</Button>
            <Button size="sm" @click="modalOpen = false">Confirm</Button>
          </template>
        </Modal>

        <Modal
          v-model="persistentModalOpen"
          title="Confirm Action"
          size="sm"
          :close-on-backdrop="false"
        >
          <p class="mfs-m-0 mfs-text-sm mfs-text">
            Clicking outside will not dismiss this modal. Use the close button or footer actions.
          </p>
          <template #footer>
            <Button size="sm" variant="danger" @click="persistentModalOpen = false">
              Acknowledge
            </Button>
          </template>
        </Modal>
      </ComponentPreview>
    </template>

    <!-- BUTTON GROUP -->
    <template v-else-if="activeSlug === 'button-group'">
      <ComponentPreview
        title="Segmented ButtonGroup"
        description="Joins adjacent Button components into a unified horizontal action group with shared borders and radii."
        :code="buttonGroupCode"
        :api="buttonGroupApi"
      >
        <div class="mfs-stack mfs-w-full">
          <div class="mfs-row mfs-items-center">
            <ButtonGroup>
              <Button
                v-for="opt in ['Left', 'Center', 'Right']"
                :key="opt"
                size="sm"
                :variant="groupAlign === opt ? 'primary' : 'surface'"
                @click="groupAlign = opt"
              >
                {{ opt }}
              </Button>
            </ButtonGroup>
            <span class="mfs-text-sm mfs-text-muted">Active: <strong class="mfs-text">{{ groupAlign }}</strong></span>
          </div>
        </div>
      </ComponentPreview>
    </template>

    <!-- INPUT ICON -->
    <template v-else-if="activeSlug === 'input-icon'">
      <ComponentPreview
        title="InputIcon Wrapper"
        description="Semantic inline icon slot wrapper with muted contrast and aria-hidden for input fields."
        :code="inputIconCode"
        :api="inputIconApi"
      >
        <div class="mfs-grid mfs-w-full">
          <Input v-model="iconQuery" label="Search with InputIcon" placeholder="Search...">
            <template #prepend>
              <InputIcon><Search :size="16" /></InputIcon>
            </template>
          </Input>
          <Input v-model="iconEmail" label="Email with InputIcon" placeholder="you@domain.com">
            <template #prepend>
              <InputIcon><Mail :size="16" /></InputIcon>
            </template>
          </Input>
        </div>
      </ComponentPreview>
    </template>

    <!-- INPUT GROUP ADDON -->
    <template v-else-if="activeSlug === 'input-group-addon'">
      <ComponentPreview
        title="InputGroupAddon"
        description="Prefix and suffix text/unit addons paired inside InputGroup."
        :code="inputGroupAddonCode"
        :api="inputGroupAddonApi"
      >
        <div class="mfs-stack mfs-w-full">
          <InputGroup>
            <InputGroupAddon>https://</InputGroupAddon>
            <Input v-model="addonDomain" placeholder="example" />
            <InputGroupAddon>.com</InputGroupAddon>
          </InputGroup>
          <p class="mfs-m-0 mfs-text-sm mfs-text-muted">
            Preview URL: <code class="mfs-font-mono mfs-text-primary">https://{{ addonDomain || 'example' }}.com</code>
          </p>
        </div>
      </ComponentPreview>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Bell, CheckCircle2, Layers, Mail, Search, Sparkles } from 'lucide-vue-next'
import ComponentPreview from '../ComponentPreview.vue'
import type { ApiRow } from '../../data/componentDocs'
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Input,
  InputGroup,
  InputGroupAddon,
  InputIcon,
  Modal,
  Switch
} from '../../lib'

defineProps<{ activeSlug: string }>()

// Button demo state
const buttonLoading = ref(false)
const triggerButtonLoad = () => {
  buttonLoading.value = true
  setTimeout(() => {
    buttonLoading.value = false
  }, 1200)
}

// Input demo state
const inputName = ref('')
const inputEmail = ref('')
const inputSearch = ref('clay')
const inputErrorVal = ref('ab')

// Card demo state
const cardNotify = ref(true)
const cardCompact = ref(false)

// Badge demo state
const badgeCount = ref(4)

// Switch demo state
const switchAutoSave = ref(true)
const switchAnalytics = ref(false)
const switchBeta = ref(false)
const switchLastEvent = ref('none')
const onSwitchChange = (val: boolean) => {
  switchLastEvent.value = val ? 'turned on' : 'turned off'
}

// ButtonGroup / InputIcon / InputGroupAddon demo state
const groupAlign = ref('Left')
const iconQuery = ref('')
const iconEmail = ref('')
const addonDomain = ref('mfs-theme')

// Modal demo state
const modalOpen = ref(false)
const modalSize = ref<'sm' | 'md' | 'lg'>('md')
const persistentModalOpen = ref(false)
const openModal = (size: 'sm' | 'md' | 'lg') => {
  modalSize.value = size
  modalOpen.value = true
}

// Code snippets
const buttonVariantsCode = `<template>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="surface">Surface</Button>
  <Button variant="success">Success</Button>
  <Button variant="warning">Warning</Button>
  <Button variant="danger">Danger</Button>
</template>

<script setup lang="ts">
import { Button } from '@/lib'
<\/script>`

const buttonSizesCode = `<template>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
  <Button :pill="false" variant="surface">Rounded</Button>
</template>

<script setup lang="ts">
import { Button } from '@/lib'
<\/script>`

const buttonStatesCode = `<template>
  <Button :loading="loading" @click="handleLoad">
    <template #prepend><Sparkles :size="16" /></template>
    {{ loading ? 'Saving...' : 'Click to Load' }}
  </Button>
  <Button variant="surface">
    Continue
    <template #append><ArrowRight :size="16" /></template>
  </Button>
  <Button disabled>Disabled</Button>
  <Button block variant="secondary">Full-Width Block Button</Button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Sparkles } from 'lucide-vue-next'
import { Button } from '@/lib'

const loading = ref(false)
const handleLoad = () => {
  loading.value = true
  setTimeout(() => (loading.value = false), 1200)
}
<\/script>`

const inputBasicCode = `<template>
  <Input
    id="demo-name"
    v-model="name"
    label="Full Name"
    placeholder="Jane Doe"
    hint="Used on your public profile."
    required
  />
  <Input id="demo-email" v-model="email" type="email" label="Email Address" placeholder="jane@example.com">
    <template #prepend><Mail :size="16" /></template>
  </Input>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail } from 'lucide-vue-next'
import { Input } from '@/lib'

const name = ref('')
const email = ref('')
<\/script>`

const inputStatesCode = `<template>
  <Input id="demo-search" v-model="search" label="Search" placeholder="Filter components...">
    <template #prepend><Search :size="16" /></template>
    <template #append>
      <Badge v-if="search" size="sm" variant="primary">{{ search.length }}</Badge>
    </template>
  </Input>
  <Input
    id="demo-error"
    v-model="username"
    label="Username"
    :error="username.length < 3 ? 'Must be at least 3 characters.' : ''"
  />
  <Input id="demo-readonly" model-value="MFS-2026-KEY" label="API Token" readonly />
  <Input id="demo-disabled" model-value="Locked field" label="Disabled Input" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search } from 'lucide-vue-next'
import { Badge, Input } from '@/lib'

const search = ref('clay')
const username = ref('ab')
<\/script>`

const cardBasicCode = `<template>
  <Card title="Project Overview" subtitle="Updated 5 mins ago" hoverable>
    <p>Adaptive surface container that inherits Clay, Glass, or Neo depth.</p>
    <template #footer>
      <Button size="sm" variant="surface">Details</Button>
      <Button size="sm">Open</Button>
    </template>
  </Card>

  <Card bordered>
    <template #header>
      <div class="header-row">
        <span>Custom Header Slot</span>
        <Badge variant="success" size="sm">Active</Badge>
      </div>
    </template>
    <p>Use header and footer slots for full layout control.</p>
  </Card>
</template>

<script setup lang="ts">
import { Badge, Button, Card } from '@/lib'
<\/script>`

const cardInteractiveCode = `<template>
  <Card title="Quick Preferences" subtitle="Changes apply immediately">
    <Switch v-model="notify" label="Email notifications" />
    <Switch v-model="compact" label="Compact density" />
    <template #footer>
      <Badge variant="surface" size="sm">{{ notify ? 'Alerts On' : 'Alerts Off' }}</Badge>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Card, Switch } from '@/lib'

const notify = ref(true)
const compact = ref(false)
<\/script>`

const badgeVariantsCode = `<template>
  <Badge variant="primary">Primary</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="success">Success</Badge>
  <Badge variant="warning">Warning</Badge>
  <Badge variant="danger">Danger</Badge>
  <Badge variant="surface">Surface</Badge>
  <Badge size="sm" variant="primary">Small</Badge>
  <Badge size="md" variant="primary">Medium</Badge>
</template>

<script setup lang="ts">
import { Badge } from '@/lib'
<\/script>`

const badgeSlotsCode = `<template>
  <Badge variant="success">
    <template #prepend><CheckCircle2 :size="13" /></template>
    Verified
  </Badge>
  <Button size="sm" variant="surface" @click="count++">
    Notifications
    <template #append>
      <Badge size="sm" variant="danger">{{ count }}</Badge>
    </template>
  </Button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle2 } from 'lucide-vue-next'
import { Badge, Button } from '@/lib'

const count = ref(4)
<\/script>`

const switchBasicCode = `<template>
  <Switch v-model="autoSave" label="Enable auto-save" />
  <Switch v-model="analytics" label="Share anonymous usage" />
  <Switch :model-value="true" label="Locked enabled" disabled />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Switch } from '@/lib'

const autoSave = ref(true)
const analytics = ref(false)
<\/script>`

const switchSlotCode = `<template>
  <Switch v-model="beta" @change="onChange">
    Beta features
    <Badge size="sm" :variant="beta ? 'success' : 'surface'">
      {{ beta ? 'Enabled' : 'Off' }}
    </Badge>
  </Switch>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Badge, Switch } from '@/lib'

const beta = ref(false)
const onChange = (val: boolean) => console.log('Changed:', val)
<\/script>`

const modalBasicCode = `<template>
  <Button @click="open = true">Open Modal</Button>

  <Modal v-model="open" size="md" title="Modal (MD)" :close-on-backdrop="true">
    <p>This dialog adapts to the active theme and locks background scrolling.</p>
    <template #footer>
      <Button size="sm" variant="surface" @click="open = false">Cancel</Button>
      <Button size="sm" @click="open = false">Confirm</Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button, Modal } from '@/lib'

const open = ref(false)
<\/script>`

// API tables (matched 1:1 with src/lib/components/*.vue)
const buttonApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'surface' | 'success' | 'warning' | 'danger'",
      default: "'primary'",
      description: 'Visual color style of the button.'
    },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Padding and font size preset.' },
    { name: 'pill', type: 'boolean', default: 'true', description: 'Applies full pill border radius.' },
    { name: 'block', type: 'boolean', default: 'false', description: 'Stretches button to 100% container width.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Shows spinner and disables interaction.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables click interaction.' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native HTML button type.' }
  ],
  events: [{ name: 'click', type: 'MouseEvent', description: 'Emitted when the button is clicked.' }],
  slots: [
    { name: 'default', description: 'Main button label content.' },
    { name: 'prepend', description: 'Leading icon or element (hidden while loading).' },
    { name: 'append', description: 'Trailing icon or element (hidden while loading).' }
  ]
}

const inputApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'string | number', default: "''", description: 'Bound input value.' },
    { name: 'id', type: 'string', description: 'HTML id attribute for the input element.' },
    { name: 'type', type: 'string', default: "'text'", description: 'Native input type.' },
    { name: 'label', type: 'string', description: 'Label text rendered above the input.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder text.' },
    { name: 'hint', type: 'string', description: 'Helper text shown when no error is present.' },
    { name: 'error', type: 'string', description: 'Validation error message and error styling.' },
    { name: 'required', type: 'boolean', default: 'false', description: 'Displays a required asterisk on the label.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input field.' },
    { name: 'readonly', type: 'boolean', default: 'false', description: 'Makes the input read-only.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'string', description: 'Emitted on input for v-model.' },
    { name: 'focus', type: 'FocusEvent', description: 'Emitted when input gains focus.' },
    { name: 'blur', type: 'FocusEvent', description: 'Emitted when input loses focus.' }
  ],
  slots: [
    { name: 'prepend', description: 'Leading icon or prefix inside the input box.' },
    { name: 'append', description: 'Trailing icon or suffix inside the input box.' }
  ]
}

const cardApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'title', type: 'string', description: 'Heading text in the default header.' },
    { name: 'subtitle', type: 'string', description: 'Secondary text below the title.' },
    { name: 'hoverable', type: 'boolean', default: 'false', description: 'Adds lift animation and hover shadow.' },
    { name: 'bordered', type: 'boolean', default: 'false', description: 'Applies bordered modifier class.' }
  ],
  slots: [
    { name: 'header', description: 'Custom header content (replaces title/subtitle).' },
    { name: 'default', description: 'Main card body content.' },
    { name: 'footer', description: 'Footer area for actions or metadata.' }
  ]
}

const badgeApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'surface'",
      default: "'primary'",
      description: 'Semantic color variant.'
    },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Badge size preset.' }
  ],
  slots: [
    { name: 'default', description: 'Badge label or counter text.' },
    { name: 'prepend', description: 'Leading icon or indicator.' }
  ]
}

const switchApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Checked state for v-model.' },
    { name: 'label', type: 'string', description: 'Text label beside the switch.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables toggle interaction.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'boolean', description: 'Emitted when toggled.' },
    { name: 'change', type: 'boolean', description: 'Emitted with the new boolean state.' }
  ],
  slots: [{ name: 'default', description: 'Custom label content (overrides label prop).' }]
}

const modalApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'modelValue', type: 'boolean', default: 'false', description: 'Controls modal visibility.' },
    { name: 'title', type: 'string', description: 'Dialog title in the default header.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Max-width preset (400px / 560px / 780px).' },
    { name: 'closeOnBackdrop', type: 'boolean', default: 'true', description: 'Closes modal when clicking the backdrop.' }
  ],
  events: [
    { name: 'update:modelValue', type: 'boolean', description: 'Emitted with false when closed.' },
    { name: 'close', type: 'void', description: 'Emitted when dismissed via close button or backdrop.' }
  ],
  slots: [
    { name: 'header', description: 'Custom header content (replaces title heading).' },
    { name: 'default', description: 'Main scrollable modal body.' },
    { name: 'footer', description: 'Footer action bar.' }
  ]
}

const buttonGroupCode = `<template>
  <ButtonGroup>
    <Button variant="primary">Left</Button>
    <Button variant="surface">Center</Button>
    <Button variant="surface">Right</Button>
  </ButtonGroup>
</template>`

const buttonGroupApi: { slots: ApiRow[] } = {
  slots: [{ name: 'default', description: 'Adjacent Button elements rendered with role="group".' }]
}

const inputIconCode = `<template>
  <Input v-model="query" label="Search">
    <template #prepend>
      <InputIcon><Search :size="16" /></InputIcon>
    </template>
  </Input>
</template>`

const inputIconApi: { slots: ApiRow[] } = {
  slots: [{ name: 'default', description: 'Icon element (e.g. Lucide icon) wrapped with aria-hidden="true".' }]
}

const inputGroupAddonCode = `<template>
  <InputGroup>
    <InputGroupAddon>https://</InputGroupAddon>
    <Input v-model="domain" placeholder="example" />
    <InputGroupAddon>.com</InputGroupAddon>
  </InputGroup>
</template>`

const inputGroupAddonApi: { slots: ApiRow[] } = {
  slots: [{ name: 'default', description: 'Static text, unit, or symbol addon rendered inside InputGroup.' }]
}
</script>

