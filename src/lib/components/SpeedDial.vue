<template>
  <div :class="['speed-dial', `speed-dial--${direction}`, 'mfs-relative', 'mfs-inline-flex', 'mfs-items-center', 'mfs-justify-center']">
    <button
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

    <ul v-if="isOpen" class="speed-dial__list mfs-absolute mfs-m-0 mfs-p-0 mfs-list-none mfs-flex mfs-gap-2-5" role="menu">
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

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

const internalOpen = ref(false)
watch(
  () => props.modelValue,
  (v) => {
    if (v !== undefined) internalOpen.value = v
  }
)

const isOpen = computed(() => (props.modelValue !== undefined ? props.modelValue : internalOpen.value))

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
  transition: transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.speed-dial__plus.is-open {
  transform: rotate(45deg);
}

.speed-dial__list {
  z-index: 2;
}

.speed-dial--up .speed-dial__list {
  bottom: calc(100% + 12px);
  flex-direction: column-reverse;
}

.speed-dial--down .speed-dial__list {
  top: calc(100% + 12px);
  flex-direction: column;
}

.speed-dial--left .speed-dial__list {
  right: calc(100% + 12px);
  flex-direction: row-reverse;
}

.speed-dial--right .speed-dial__list {
  left: calc(100% + 12px);
  flex-direction: row;
}

.speed-dial__item {
  width: 42px;
  height: 42px;
}
</style>
