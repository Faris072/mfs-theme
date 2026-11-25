<template>
  <div class="fase3-demos">
    <!-- Avatar -->
    <ComponentPreview
      v-if="activeSlug === 'avatar'"
      title="Avatar"
      description="User profile avatar supporting image src, automatic initials fallback, sizes, shapes, and status indicators."
      :code="avatarCode"
      :api="avatarApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row">
          <Avatar :src="avatarSvg" alt="Alex Rivera" size="sm" status="online" />
          <Avatar :src="avatarSvg" alt="Alex Rivera" size="md" status="away" />
          <Avatar label="Maya Lin" size="lg" status="busy" />
          <Avatar label="Kai Sato" size="xl" shape="rounded" status="offline" />
          <Avatar size="md" shape="rounded" aria-label="Star user">★</Avatar>
        </div>
      </div>
    </ComponentPreview>

    <!-- Chip -->
    <ComponentPreview
      v-else-if="activeSlug === 'chip'"
      title="Chip"
      description="Compact tag and filter pill supporting semantic variants, prepend slot, clickable toggle, and removable action."
      :code="chipCode"
      :api="chipApi"
    >
      <div class="mfs-stack">
        <div class="mfs-flex mfs-flex-col mfs-gap-3">
          <span class="mfs-text-xs mfs-font-bold mfs-text-muted demo-label">Clickable Filters ({{ activeFilter }})</span>
          <div class="mfs-row">
            <Chip
              v-for="filter in filters"
              :key="filter"
              :label="filter"
              clickable
              :active="activeFilter === filter"
              :variant="activeFilter === filter ? 'primary' : 'surface'"
              @click="activeFilter = filter"
            />
          </div>
        </div>

        <div class="mfs-flex mfs-flex-col mfs-gap-3">
          <div class="mfs-row mfs-gap-2">
            <span class="mfs-text-xs mfs-font-bold mfs-text-muted demo-label">Removable &amp; Semantic Variants</span>
            <Button
              v-if="tags.length < initialTags.length"
              size="sm"
              variant="surface"
              @click="tags = [...initialTags]"
            >
              Reset tags
            </Button>
          </div>
          <div class="mfs-row">
            <Chip
              v-for="tag in tags"
              :key="tag.label"
              :label="tag.label"
              :variant="tag.variant"
              removable
              @remove="removeTag(tag.label)"
            >
              <template v-if="tag.icon" #prepend>
                <span aria-hidden="true">{{ tag.icon }}</span>
              </template>
            </Chip>
            <span v-if="!tags.length" class="mfs-caption">All tags removed.</span>
          </div>
        </div>
      </div>
    </ComponentPreview>

    <!-- Divider -->
    <ComponentPreview
      v-else-if="activeSlug === 'divider'"
      title="Divider"
      description="Visual separator supporting horizontal and vertical orientations, dashed style, and aligned text labels."
      :code="dividerCode"
      :api="dividerApi"
    >
      <div class="mfs-stack">
        <div class="mfs-flex mfs-flex-col">
          <p class="mfs-m-0 mfs-text-sm mfs-text">Default horizontal divider</p>
          <Divider />
          <p class="mfs-m-0 mfs-text-sm mfs-text">Left-aligned &amp; dashed label</p>
          <Divider align="left" dashed>Section A</Divider>
          <Divider align="center">OR</Divider>
          <Divider align="right" dashed>End</Divider>
        </div>

        <div class="mfs-row mfs-gap-1 mfs-text-sm mfs-font-semibold mfs-text">
          <span>Overview</span>
          <Divider orientation="vertical" />
          <span>Analytics</span>
          <Divider orientation="vertical" dashed />
          <span>Settings</span>
        </div>
      </div>
    </ComponentPreview>

    <!-- Accordion -->
    <ComponentPreview
      v-else-if="activeSlug === 'accordion'"
      title="Accordion"
      description="Collapsible content panels with single or multiple expansion, keyboard accessibility, and disabled items."
      :code="accordionCode"
      :code-tabs="accordionCodeTabs"
      :api="accordionApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row mfs-gap-2">
          <Button
            size="sm"
            :variant="allowMultiple ? 'primary' : 'surface'"
            :aria-pressed="allowMultiple"
            @click="toggleMultipleMode"
          >
            Multiple: {{ allowMultiple ? 'On' : 'Off' }}
          </Button>
          <span class="mfs-caption">Open: {{ openLabel }}</span>
        </div>

        <Accordion
          v-model="accordionValue"
          :items="accordionItems"
          :multiple="allowMultiple"
        />
      </div>
    </ComponentPreview>

    <!-- Timeline -->
    <ComponentPreview
      v-else-if="activeSlug === 'timeline'"
      title="Timeline"
      description="Chronological event list with semantic status dots, timestamps, icons, and responsive vertical or horizontal layout."
      :code="timelineCode"
      :code-tabs="timelineCodeTabs"
      :api="timelineApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row mfs-gap-2">
          <Button
            size="sm"
            :variant="timelineLayout === 'vertical' ? 'primary' : 'surface'"
            @click="timelineLayout = 'vertical'"
          >
            Vertical
          </Button>
          <Button
            size="sm"
            :variant="timelineLayout === 'horizontal' ? 'primary' : 'surface'"
            @click="timelineLayout = 'horizontal'"
          >
            Horizontal
          </Button>
        </div>

        <Timeline :items="timelineItems" :layout="timelineLayout" />
      </div>
    </ComponentPreview>

    <!-- Carousel -->
    <ComponentPreview
      v-else-if="activeSlug === 'carousel'"
      title="Carousel"
      description="Touch-swipeable slide deck with arrow controls, indicator dots, loop, and optional autoplay."
      :code="carouselCode"
      :code-tabs="carouselCodeTabs"
      :api="carouselApi"
    >
      <div class="mfs-stack">
        <div class="mfs-row mfs-gap-2">
          <Button
            size="sm"
            :variant="carouselAutoplay ? 'primary' : 'surface'"
            :aria-pressed="carouselAutoplay"
            @click="carouselAutoplay = !carouselAutoplay"
          >
            Autoplay: {{ carouselAutoplay ? 'On' : 'Off' }}
          </Button>
          <Button
            size="sm"
            :variant="carouselLoop ? 'primary' : 'surface'"
            :aria-pressed="carouselLoop"
            @click="carouselLoop = !carouselLoop"
          >
            Loop: {{ carouselLoop ? 'On' : 'Off' }}
          </Button>
          <span class="mfs-caption">Slide {{ carouselIndex + 1 }} / {{ carouselSlides.length }}</span>
        </div>

        <Carousel
          v-model="carouselIndex"
          :items="carouselSlides"
          :autoplay="carouselAutoplay"
          :loop="carouselLoop"
        >
          <template #default="{ item }">
            <div class="mfs-flex mfs-flex-col mfs-justify-center mfs-items-center mfs-text-center mfs-gap-2 demo-slide" :style="{ background: item.bg }">
              <span class="mfs-pill mfs-surface mfs-text-xs mfs-font-bold mfs-text-primary mfs-px-3 mfs-py-1 demo-slide__badge">{{ item.badge }}</span>
              <h4 class="mfs-title mfs-text-lg mfs-m-0">{{ item.title }}</h4>
              <p class="mfs-m-0 mfs-text-sm mfs-text-muted demo-slide__desc">{{ item.description }}</p>
            </div>
          </template>
        </Carousel>
      </div>
    </ComponentPreview>

    <!-- Image -->
    <ComponentPreview
      v-else-if="activeSlug === 'image'"
      title="Image"
      description="Progressive image container with shimmer placeholder, error fallback, object-fit modes, and fullscreen modal preview."
      :code="imageCode"
      :api="imageApi"
    >
      <div class="mfs-stack">
        <div class="mfs-grid">
          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <Image
              :src="previewSvg"
              alt="Geometric landscape preview"
              width="100%"
              :height="180"
              fit="cover"
              preview
            />
            <span class="mfs-caption">Click image for fullscreen preview (cover)</span>
          </div>

          <div class="mfs-flex mfs-flex-col mfs-gap-2">
            <Image
              :src="containSvg"
              alt="Contained badge graphic"
              width="100%"
              :height="180"
              fit="contain"
              preview
            />
            <span class="mfs-caption">Contained fit with fullscreen preview</span>
          </div>
        </div>
      </div>
    </ComponentPreview>

    <!-- AVATAR GROUP -->
    <ComponentPreview
      v-else-if="activeSlug === 'avatar-group'"
      title="AvatarGroup"
      description="Overlapping avatar stack with configurable max count and +N overflow pill."
      :code="avatarGroupCode"
      :code-tabs="avatarGroupCodeTabs"
      :api="avatarGroupApi"
    >
      <div class="mfs-stack mfs-w-full">
        <div class="mfs-row mfs-items-center mfs-gap-4">
          <AvatarGroup :items="avatarGroupItems" :max="avatarGroupMax" size="md" />
          <AvatarGroup :items="avatarGroupItems" :max="avatarGroupMax" size="sm" />
        </div>
        <div class="mfs-row mfs-items-center mfs-gap-2">
          <Button
            v-for="limit in [2, 3, 5]"
            :key="limit"
            size="sm"
            :variant="avatarGroupMax === limit ? 'primary' : 'surface'"
            @click="avatarGroupMax = limit"
          >
            max: {{ limit }}
          </Button>
        </div>
      </div>
    </ComponentPreview>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ComponentPreview from '../ComponentPreview.vue'
import { Avatar, Button, Chip, Divider, Accordion, Timeline, Carousel, Image } from '../../lib'
import AvatarGroup from '../../lib/components/AvatarGroup.vue'
import type { ApiRow } from '../../data/componentDocs'

defineProps<{
  activeSlug: string
}>()

// Inline SVG data-URIs (offline-safe, crisp across themes)
const avatarSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" fill="url(#g)"/>
      <circle cx="60" cy="46" r="20" fill="#fff" fill-opacity="0.92"/>
      <path d="M26 106c4-20 18-30 34-30s30 10 34 30" fill="#fff" fill-opacity="0.92"/>
    </svg>`
  )

const previewSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#4f46e5"/>
          <stop offset="55%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#22d3ee"/>
        </linearGradient>
      </defs>
      <rect width="640" height="360" fill="url(#sky)"/>
      <circle cx="490" cy="95" r="46" fill="#fef08a" fill-opacity="0.9"/>
      <path d="M0 265 L170 155 L320 245 L465 130 L640 260 L640 360 L0 360 Z" fill="#1e1b4b" fill-opacity="0.45"/>
      <path d="M0 305 L210 215 L390 295 L535 205 L640 290 L640 360 L0 360 Z" fill="#0f172a" fill-opacity="0.65"/>
    </svg>`
  )

const containSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200">
      <defs>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="280" height="160" rx="24" fill="url(#cardGrad)"/>
      <circle cx="95" cy="100" r="34" fill="#ffffff" fill-opacity="0.24"/>
      <rect x="148" y="76" width="115" height="16" rx="8" fill="#ffffff" fill-opacity="0.9"/>
      <rect x="148" y="106" width="82" height="12" rx="6" fill="#ffffff" fill-opacity="0.65"/>
    </svg>`
  )

// Chip state
const filters = ['All', 'Design', 'Engineering', 'Release']
const activeFilter = ref('All')

interface TagItem {
  label: string
  variant: 'primary' | 'secondary' | 'surface' | 'success' | 'warning' | 'danger'
  icon?: string
}

const initialTags: TagItem[] = [
  { label: 'Vue 3', variant: 'primary' },
  { label: 'Clay', variant: 'secondary' },
  { label: 'Accessible', variant: 'success' },
  { label: 'Beta', variant: 'warning' },
  { label: 'Deprecated', variant: 'danger' }
]
const tags = ref<TagItem[]>([...initialTags])
const removeTag = (label: string) => {
  tags.value = tags.value.filter((t) => t.label !== label)
}

// Accordion state
const allowMultiple = ref(false)
const accordionValue = ref<string | number | (string | number)[] | null>('tokens')
const accordionItems = [
  {
    key: 'tokens',
    title: 'How do theme tokens work?',
    content: 'All components read CSS custom properties (--surface, --primary, --clay-shadow) so switching themes updates every surface automatically.'
  },
  {
    key: 'a11y',
    title: 'Is keyboard navigation supported?',
    content: 'Yes. Triggers use native buttons with aria-expanded and aria-controls linked to each region panel.'
  },
  {
    key: 'locked',
    title: 'Disabled section',
    content: 'This panel cannot be toggled.',
    disabled: true
  }
]

const toggleMultipleMode = () => {
  allowMultiple.value = !allowMultiple.value
  accordionValue.value = allowMultiple.value ? ['tokens'] : 'tokens'
}

const openLabel = computed(() => {
  if (Array.isArray(accordionValue.value)) {
    return accordionValue.value.length ? accordionValue.value.join(', ') : 'None'
  }
  return accordionValue.value ?? 'None'
})

// Timeline state
const timelineLayout = ref<'vertical' | 'horizontal'>('vertical')
const timelineItems = [
  {
    title: 'Design Tokens',
    timestamp: '09:00',
    description: 'Defined clay, glass, and neo CSS variables.',
    status: 'success' as const,
    icon: '✓'
  },
  {
    title: 'Component Build',
    timestamp: '13:30',
    description: 'Implemented accessible Vue 3 display primitives.',
    status: 'primary' as const,
    icon: '2'
  },
  {
    title: 'QA Review',
    timestamp: '16:45',
    description: 'Verifying mobile touch targets and theme contrast.',
    status: 'warning' as const,
    icon: '!'
  }
]

// Carousel state
const carouselIndex = ref(0)
const carouselAutoplay = ref(false)
const carouselLoop = ref(true)
const carouselSlides = [
  {
    badge: 'Claymorphism',
    title: 'Soft Tactile Depth',
    description: 'Layered highlights and pillowy shadows that respond to touch.',
    bg: 'var(--mfs-surface-subtle)'
  },
  {
    badge: 'Glassmorphism',
    title: 'Frosted Translucency',
    description: 'Backdrop blur with crisp hairline borders over vibrant canvases.',
    bg: 'var(--mfs-surface-elevated)'
  },
  {
    badge: 'Neumorphism',
    title: 'Extruded Surfaces',
    description: 'Dual directional shadows carved cleanly from the base surface.',
    bg: 'var(--mfs-surface-subtle)'
  }
]

// Code snippets
const avatarCode = `<script setup lang="ts">
import { Avatar } from '@mfs-atomic/ui'

const avatarUrl = 'https://i.pravatar.cc/120?img=12'
<\/script>

<template>
  <Avatar :src="avatarUrl" alt="Alex Rivera" size="md" status="online" />
  <Avatar label="Maya Lin" size="lg" status="busy" />
  <Avatar label="Kai Sato" size="xl" shape="rounded" status="offline" />
</template>`

const chipCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Chip } from '@mfs-atomic/ui'

const selected = ref('Design')
const tags = ref(['Vue 3', 'TypeScript', 'Clay'])

const onRemove = (label: string) => {
  tags.value = tags.value.filter((item) => item !== label)
}
<\/script>

<template>
  <Chip
    label="Design"
    clickable
    :active="selected === 'Design'"
    @click="selected = 'Design'"
  />
  <Chip
    v-for="tag in tags"
    :key="tag"
    :label="tag"
    variant="primary"
    removable
    @remove="onRemove(tag)"
  >
    <template #prepend>•</template>
  </Chip>
</template>`

const dividerCode = `<script setup lang="ts">
import { Divider } from '@mfs-atomic/ui'
<\/script>

<template>
  <p>Default horizontal divider</p>
  <Divider />

  <p>Left-aligned &amp; dashed label</p>
  <Divider align="left" dashed>Section A</Divider>

  <div class="inline-bar">
    <span>Overview</span>
    <Divider orientation="vertical" />
    <span>Analytics</span>
    <Divider orientation="vertical" dashed />
    <span>Settings</span>
  </div>
</template>`

const accordionCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Accordion, type AccordionItem } from '@mfs-atomic/ui'

const openKey = ref<string | number | null>('tokens')
const items: AccordionItem[] = [
  { key: 'tokens', title: 'How do theme tokens work?', content: 'CSS custom properties update every surface automatically.' },
  { key: 'a11y', title: 'Is keyboard navigation supported?', content: 'Native button triggers with aria-expanded and aria-controls.' },
  { key: 'locked', title: 'Disabled section', content: 'Cannot be toggled.', disabled: true }
]
<\/script>

<template>
  <Accordion v-model="openKey" :items="items" :multiple="false" />
</template>`

const accordionCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: accordionCode
  },
  {
    label: 'Data Format',
    filename: 'data.ts',
    code: `import type { AccordionItem } from '@mfs-atomic/ui'

export const accordionItems: AccordionItem[] = [
  {
    key: 'tokens',
    title: 'How do theme tokens work?',
    content: 'All components read CSS custom properties (--surface, --primary).'
  },
  {
    key: 'a11y',
    title: 'Is keyboard navigation supported?',
    content: 'Triggers use native buttons with aria-expanded.'
  },
  {
    key: 'locked',
    title: 'Disabled section',
    content: 'This panel cannot be toggled.',
    disabled: true
  }
]`
  }
]

const timelineCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Button, Timeline, type TimelineItem } from '@mfs-atomic/ui'

const layout = ref<'vertical' | 'horizontal'>('vertical')
const items = ref<TimelineItem[]>([
  { title: 'Design Tokens', timestamp: '09:00', description: 'Defined clay, glass, and neo CSS variables.', status: 'success', icon: '✓' },
  { title: 'Component Build', timestamp: '13:30', description: 'Implemented accessible Vue 3 primitives.', status: 'primary', icon: '2' },
  { title: 'QA Review', timestamp: '16:45', description: 'Verifying mobile touch targets and contrast.', status: 'warning', icon: '!' }
])
<\/script>

<template>
  <Button size="sm" @click="layout = layout === 'vertical' ? 'horizontal' : 'vertical'">
    Layout: {{ layout }}
  </Button>
  <Timeline :items="items" :layout="layout" />
</template>`

const timelineCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: timelineCode
  },
  {
    label: 'Data Format',
    filename: 'data.ts',
    code: `import type { TimelineItem } from '@mfs-atomic/ui'

export const timelineEvents: TimelineItem[] = [
  {
    title: 'Order Placed',
    timestamp: '09:00',
    description: 'Customer completed checkout (#ORD-4821).',
    status: 'success',
    icon: '✓'
  },
  {
    title: 'Packed & Labeled',
    timestamp: '13:30',
    description: 'Warehouse prepared parcel for courier pickup.',
    status: 'primary',
    icon: '2'
  },
  {
    title: 'Out for Delivery',
    timestamp: '16:45',
    description: 'Courier en route to destination.',
    status: 'warning',
    icon: '!'
  }
]`
  },
  {
    label: 'Fetch API',
    filename: 'api.ts',
    code: `import type { TimelineItem } from '@mfs-atomic/ui'

export async function fetchTimelineEvents(orderId: string): Promise<TimelineItem[]> {
  const res = await fetch(\`/api/orders/\${encodeURIComponent(orderId)}/timeline\`)
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
  return (await res.json()) as TimelineItem[]
}`
  }
]

const carouselCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Carousel } from '@mfs-atomic/ui'

interface CarouselSlide {
  badge: string
  title: string
  description: string
}

const slide = ref(0)
const slides: CarouselSlide[] = [
  { badge: 'Claymorphism', title: 'Soft Tactile Depth', description: 'Layered highlights and pillowy shadows.' },
  { badge: 'Glassmorphism', title: 'Frosted Translucency', description: 'Backdrop blur with crisp hairline borders.' },
  { badge: 'Neumorphism', title: 'Extruded Surfaces', description: 'Dual directional shadows carved from base.' }
]
<\/script>

<template>
  <Carousel v-model="slide" :items="slides" autoplay loop>
    <template #default="{ item }">
      <div class="slide">
        <span>{{ item.badge }}</span>
        <h4>{{ item.title }}</h4>
        <p>{{ item.description }}</p>
      </div>
    </template>
  </Carousel>
</template>`

const carouselCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: carouselCode
  },
  {
    label: 'Data Format',
    filename: 'data.ts',
    code: `export interface CarouselSlide {
  badge: string
  title: string
  description: string
  bg?: string
}

export const carouselSlides: CarouselSlide[] = [
  {
    badge: 'Claymorphism',
    title: 'Soft Tactile Depth',
    description: 'Layered highlights and pillowy shadows that respond to touch.',
    bg: 'var(--mfs-surface-subtle)'
  },
  {
    badge: 'Glassmorphism',
    title: 'Frosted Translucency',
    description: 'Backdrop blur with crisp hairline borders over vibrant canvases.'
  }
]`
  }
]

const imageCode = `<script setup lang="ts">
import { ref } from 'vue'
import { Image } from '@mfs-atomic/ui'

const imageUrl = ref('/landscape.png')
const fit = ref<'cover' | 'contain'>('cover')
<\/script>

<template>
  <Image
    :src="imageUrl"
    alt="Geometric landscape"
    width="100%"
    :height="180"
    :fit="fit"
    preview
  />
</template>`

// API Docs
const avatarApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'src', type: 'string', description: 'Image URL for the avatar.' },
    { name: 'alt', type: 'string', description: 'Accessible alt text for the image.' },
    { name: 'label', type: 'string', description: 'Full name used to derive fallback initials.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Avatar dimensions.' },
    { name: 'shape', type: "'circle' | 'rounded'", default: "'circle'", description: 'Corner radius style.' },
    { name: 'status', type: "'online' | 'offline' | 'busy' | 'away'", description: 'Optional presence dot indicator.' }
  ],
  slots: [
    { name: 'default', description: 'Custom fallback content when no image is rendered.' }
  ]
}

const chipApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'label', type: 'string', description: 'Text label rendered inside the chip.' },
    { name: 'removable', type: 'boolean', default: 'false', description: 'Shows a remove button inside the chip.' },
    { name: 'clickable', type: 'boolean', default: 'false', description: 'Enables button role, keyboard activation, and hover lift.' },
    { name: 'active', type: 'boolean', default: 'false', description: 'Applies active pressed state styling.' },
    {
      name: 'variant',
      type: "'primary' | 'secondary' | 'surface' | 'success' | 'warning' | 'danger'",
      default: "'surface'",
      description: 'Semantic color variant.'
    }
  ],
  events: [
    { name: 'click', type: '(event: Event) => void', description: 'Emitted when clickable is true and chip is activated.' },
    { name: 'remove', type: '() => void', description: 'Emitted when the remove button is clicked.' }
  ],
  slots: [
    { name: 'default', description: 'Custom label content (overrides label prop).' },
    { name: 'prepend', description: 'Leading icon or element before the label.' }
  ]
}

const dividerApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Axis of the separator.' },
    { name: 'align', type: "'left' | 'center' | 'right'", default: "'center'", description: 'Label alignment on horizontal dividers.' },
    { name: 'dashed', type: 'boolean', default: 'false', description: 'Renders a dashed border line.' }
  ],
  slots: [
    { name: 'default', description: 'Optional text label for horizontal dividers.' }
  ]
}

const accordionApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'items', type: 'AccordionItem[]', default: '[]', description: 'Array of { key, title, content?, disabled? }.' },
    { name: 'multiple', type: 'boolean', default: 'false', description: 'Allows multiple panels to stay open simultaneously.' },
    { name: 'modelValue', type: 'string | number | (string | number)[] | null', description: 'Controlled active key or array of keys.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(value: Key | Key[] | null) => void', description: 'Emitted when open item(s) change.' },
    { name: 'change', type: '(value: Key | Key[] | null) => void', description: 'Emitted alongside update:modelValue on toggle.' }
  ],
  slots: [
    { name: 'default', description: 'Fallback content when items array is empty.' },
    { name: 'item', description: 'Scoped slot ({ item, open }) for custom panel body.' }
  ]
}

const timelineApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'items', type: 'TimelineItem[]', default: '[]', description: 'Array of { title, description?, timestamp?, status?, icon? }.' },
    { name: 'layout', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Timeline orientation (collapses to vertical on mobile).' }
  ],
  slots: [
    { name: 'icon', description: 'Scoped slot ({ item, index }) to customize the status dot.' },
    { name: 'item', description: 'Scoped slot ({ item, index }) to customize the item card.' }
  ]
}

const carouselApi: { props: ApiRow[]; events: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'items', type: 'T[]', default: '[]', description: 'Slide data array.' },
    { name: 'modelValue', type: 'number', default: '0', description: 'Controlled active slide index.' },
    { name: 'autoplay', type: 'boolean', default: 'false', description: 'Automatically advances slides on an interval.' },
    { name: 'interval', type: 'number', default: '4000', description: 'Autoplay delay in milliseconds.' },
    { name: 'loop', type: 'boolean', default: 'true', description: 'Wraps navigation from last slide back to first.' }
  ],
  events: [
    { name: 'update:modelValue', type: '(index: number) => void', description: 'Emitted when the active slide index changes.' },
    { name: 'change', type: '(index: number) => void', description: 'Emitted when navigating to another slide.' }
  ],
  slots: [
    { name: 'default', description: 'Scoped slot ({ item, index }) for rendering each slide.' }
  ]
}

const imageApi: { props: ApiRow[] } = {
  props: [
    { name: 'src', type: 'string', description: 'Image source URL (required).' },
    { name: 'alt', type: 'string', default: "''", description: 'Accessible alt text.' },
    { name: 'width', type: 'string | number', description: 'Container width (number converts to px).' },
    { name: 'height', type: 'string | number', description: 'Container height (number converts to px).' },
    { name: 'preview', type: 'boolean', default: 'false', description: 'Enables click-to-zoom fullscreen modal preview.' },
    { name: 'fit', type: "'cover' | 'contain' | 'fill' | 'none'", default: "'cover'", description: 'CSS object-fit mode.' }
  ]
}

const avatarGroupMax = ref(3)
const avatarGroupItems = [
  { label: 'AL', src: avatarSvg },
  { label: 'BK' },
  { label: 'CM' },
  { label: 'DN' },
  { label: 'ER' }
]

const avatarGroupCode = `<script setup lang="ts">
import { ref } from 'vue'
import { AvatarGroup, type AvatarGroupItem } from '@mfs-atomic/ui'

const maxVisible = ref(3)
const members: AvatarGroupItem[] = [
  { label: 'AL', src: '/avatars/alex.png' },
  { label: 'BK' },
  { label: 'CM' },
  { label: 'DN' },
  { label: 'ER' }
]
<\/script>

<template>
  <AvatarGroup :items="members" :max="maxVisible" size="md" />
</template>`

const avatarGroupCodeTabs = [
  {
    label: 'Example.vue',
    filename: 'Example.vue',
    code: avatarGroupCode
  },
  {
    label: 'Data Format',
    filename: 'data.ts',
    code: `import type { AvatarGroupItem } from '@mfs-atomic/ui'

export const teamMembers: AvatarGroupItem[] = [
  { label: 'Alex Rivera', src: '/avatars/alex.png' },
  { label: 'Bella Kim' },
  { label: 'Carlos Mendez' },
  { label: 'Dana Ng' },
  { label: 'Elena Rostova' }
]`
  }
]

const avatarGroupApi: { props: ApiRow[]; slots: ApiRow[] } = {
  props: [
    { name: 'items', type: 'AvatarGroupItem[]', description: 'Array of { label?, src? } rendered as Avatars.' },
    { name: 'max', type: 'number', description: 'Maximum visible avatars before showing +N overflow.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size applied to grouped Avatars.' }
  ],
  slots: [{ name: 'default', description: 'Manual Avatar children when items prop is omitted.' }]
}
</script>

<style scoped>
.demo-label,
.demo-slide__badge {
  letter-spacing: 0.05em;
}

.demo-toggle-btn:hover {
  border-color: var(--primary);
}

.demo-toggle-btn.is-active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.demo-slide {
  padding: 40px 48px 48px;
  min-height: 180px;
}

.demo-slide__desc {
  max-width: 420px;
}
</style>
