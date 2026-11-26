<template>
  <div :class="['speed-dial', `speed-dial--${direction}`, 'mfs-relative', 'mfs-inline-flex', 'mfs-items-center', 'mfs-justify-center']">
    <button
      ref="triggerRef"
      type="button"
      class="speed-dial__fab mfs-inline-flex mfs-items-center mfs-justify-center mfs-border-none mfs-bg-primary mfs-pill mfs-shadow mfs-interactive mfs-focus-ring"
      :aria-expanded="isOpen"
      aria-label="Toggle quick actions"
      @click="toggle"
    >
      <svg
        :class="['speed-dial__plus', { 'is-open': isOpen }]"
        viewBox="0 0 24 24"
        width="22"
        height="22"
        fill="none"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
      </svg>
    </button>

    <Teleport to="body">
      <ul
        v-if="isOpen"
        ref="listRef"
        :class="[
          'speed-dial__list',
          `speed-dial__list--${direction}`,
          `speed-dial__list--${type}`,
          'mfs-m-0',
          'mfs-p-0',
          'mfs-list-none',
          'mfs-flex',
          'mfs-gap-2-5'
        ]"
        :style="listStyle"
        role="menu"
      >
        <li
          v-for="(item, idx) in items"
          :key="idx"
          class="speed-dial__entry"
          :style="itemStyle(idx)"
          role="none"
        >
          <button
            type="button"
            role="menuitem"
            :class="['speed-dial__item', 'mfs-inline-flex', 'mfs-items-center', 'mfs-justify-center', 'mfs-text-xs', 'mfs-font-bold', 'mfs-surface', 'mfs-pill', 'mfs-shadow', 'mfs-interactive', 'mfs-focus-ring', { 'mfs-disabled': item.disabled }]"
            :title="item.label"
            :aria-label="item.label"
            :disabled="item.disabled"
            @click="onSelect(item)"
          >
            <slot name="item" :item="item" :index="idx">
              <span>{{ item.icon || item.label.slice(0, 2) }}</span>
            </slot>
          </button>
        </li>
      </ul>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue'

export interface SpeedDialItem {
  label: string
  icon?: string
  disabled?: boolean
  action?: () => void
}

const props = withDefaults(
  defineProps<{
    items?: SpeedDialItem[]
    direction?: 'up' | 'down' | 'left' | 'right'
    type?: 'linear' | 'radial'
    radius?: number
    modelValue?: boolean
  }>(),
  {
    items: () => [],
    direction: 'up',
    type: 'linear',
    radius: 76,
    modelValue: undefined
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', open: boolean): void
  (e: 'select', item: SpeedDialItem): void
}>()

const triggerRef = ref<HTMLElement | null>(null)
const listRef = ref<HTMLElement | null>(null)
const triggerRect = ref<{ top: number; left: number; right: number; bottom: number; width: number; height: number }>({
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
})

const updatePosition = () => {
  if (typeof window === 'undefined' || !triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  triggerRect.value = {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height
  }
}

const internalOpen = ref(false)
watch(
  () => props.modelValue,
  (v) => {
    if (v !== undefined) internalOpen.value = v
  }
)

const isOpen = computed(() => (props.modelValue !== undefined ? props.modelValue : internalOpen.value))

watch(isOpen, (open) => {
  if (open) {
    updatePosition()
    nextTick(updatePosition)
  }
})

const handleViewportChange = () => {
  if (isOpen.value) {
    updatePosition()
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('scroll', handleViewportChange, true)
  window.addEventListener('resize', handleViewportChange)
  if (isOpen.value) {
    updatePosition()
  }
})

onBeforeUnmount(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('scroll', handleViewportChange, true)
  window.removeEventListener('resize', handleViewportChange)
})

const listStyle = computed<CSSProperties>(() => {
  const r = triggerRect.value
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  const gap = 12

  if (props.type === 'radial') {
    return {
      position: 'fixed',
      left: `${cx}px`,
      top: `${cy}px`,
      width: '0px',
      height: '0px',
      zIndex: 9500
    }
  }

  if (props.direction === 'up') {
    return {
      position: 'fixed',
      left: `${cx}px`,
      top: `${r.top - gap}px`,
      transform: 'translate(-50%, -100%)',
      zIndex: 9500
    }
  }
  if (props.direction === 'down') {
    return {
      position: 'fixed',
      left: `${cx}px`,
      top: `${r.bottom + gap}px`,
      transform: 'translate(-50%, 0)',
      zIndex: 9500
    }
  }
  if (props.direction === 'left') {
    return {
      position: 'fixed',
      left: `${r.left - gap}px`,
      top: `${cy}px`,
      transform: 'translate(-100%, -50%)',
      zIndex: 9500
    }
  }
  return {
    position: 'fixed',
    left: `${r.right + gap}px`,
    top: `${cy}px`,
    transform: 'translate(0, -50%)',
    zIndex: 9500
  }
})

const toggle = () => {
  const next = !isOpen.value
  internalOpen.value = next
  emit('update:modelValue', next)
}

const onSelect = (item: SpeedDialItem) => {
  if (item.disabled) return
  item.action?.()
  emit('select', item)
  internalOpen.value = false
  emit('update:modelValue', false)
}

const itemStyle = (idx: number) => {
  if (props.type !== 'radial' || !props.items.length) return undefined
  const total = props.items.length
  const baseAngle =
    props.direction === 'up' ? -90 : props.direction === 'down' ? 90 : props.direction === 'left' ? 180 : 0
  const spread = 120
  const step = total > 1 ? spread / (total - 1) : 0
  const angleDeg = baseAngle - spread / 2 + idx * step
  const rad = (angleDeg * Math.PI) / 180
  const x = Math.round(Math.cos(rad) * props.radius)
  const y = Math.round(Math.sin(rad) * props.radius)
  return {
    position: 'absolute' as const,
    left: '-21px',
    top: '-21px',
    transform: `translate(${x}px, ${y}px)`
  }
}
</script>

<style scoped>
.speed-dial__fab {
  width: 52px;
  height: 52px;
  z-index: 3;
}

.speed-dial__plus {
  transition: transform 0.24s cubic-bezier(0.2, 0, 0, 1);
}

.speed-dial__plus.is-open {
  transform: rotate(45deg);
}

.speed-dial__list {
  z-index: 9500;
}

.speed-dial__list--up {
  flex-direction: column-reverse;
}

.speed-dial__list--down {
  flex-direction: column;
}

.speed-dial__list--left {
  flex-direction: row-reverse;
}

.speed-dial__list--right {
  flex-direction: row;
}

.speed-dial__item {
  width: 42px;
  height: 42px;
}
</style>
