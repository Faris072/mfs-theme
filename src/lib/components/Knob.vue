<template>
  <div class="knob-wrapper" :class="{ 'knob-wrapper--disabled mfs-disabled': disabled }">
    <div
      ref="svgBoxRef"
      role="slider"
      tabindex="0"
      class="knob-control mfs-surface mfs-shadow mfs-focus-ring"
      :style="{ width: `${size}px`, height: `${size}px` }"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue"
      :aria-label="label || 'Knob'"
      @pointerdown="startDrag"
      @keydown="onKeydown"
    >
      <svg :viewBox="`0 0 ${size} ${size}`" :width="size" :height="size">
        <path
          :d="trackPath"
          fill="none"
          stroke="var(--surface-subtle, rgba(148,163,184,0.28))"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
        />
        <path
          :d="valuePath"
          fill="none"
          stroke="var(--primary, #8b5cf6)"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
        />
      </svg>
      <span class="knob-value mfs-text mfs-font-mono">{{ formattedValue }}</span>
    </div>
    <span v-if="label" class="knob-label mfs-caption">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    min?: number
    max?: number
    step?: number
    size?: number
    strokeWidth?: number
    valueTemplate?: string
    label?: string
    disabled?: boolean
    readonly?: boolean
  }>(),
  {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    size: 112,
    strokeWidth: 10,
    valueTemplate: '{value}',
    disabled: false,
    readonly: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
  (e: 'change', value: number): void
}>()

const svgBoxRef = ref<HTMLElement | null>(null)
const dragging = ref(false)

const center = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - props.strokeWidth - 4)

const polarToCartesian = (deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return {
    x: center.value + radius.value * Math.cos(rad),
    y: center.value + radius.value * Math.sin(rad)
  }
}

const describeArc = (startAngle: number, endAngle: number) => {
  const start = polarToCartesian(endAngle)
  const end = polarToCartesian(startAngle)
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${start.x} ${start.y} A ${radius.value} ${radius.value} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

const ratio = computed(() => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return Math.max(0, Math.min(1, (props.modelValue - props.min) / span))
})

const trackPath = computed(() => describeArc(225, 495))
const valuePath = computed(() => {
  const end = 225 + ratio.value * 270
  return end <= 225.1 ? '' : describeArc(225, end)
})

const formattedValue = computed(() => props.valueTemplate.replace('{value}', String(props.modelValue)))

const updateFromPointer = (clientX: number, clientY: number) => {
  const rect = svgBoxRef.value?.getBoundingClientRect()
  if (!rect) return
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  let angle = (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI + 90
  if (angle < 0) angle += 360
  // Map 225..360 and 0..135 -> 0..270
  let sweep = angle >= 225 ? angle - 225 : angle <= 135 ? angle + 135 : angle < 180 ? 270 : 0
  sweep = Math.max(0, Math.min(270, sweep))
  const raw = props.min + (sweep / 270) * (props.max - props.min)
  const snapped = Math.round((raw - props.min) / props.step) * props.step + props.min
  const clamped = Math.max(props.min, Math.min(props.max, Number(snapped.toFixed(6))))
  emit('update:modelValue', clamped)
}

const onMove = (e: PointerEvent) => {
  if (dragging.value) updateFromPointer(e.clientX, e.clientY)
}

const stopDrag = () => {
  if (dragging.value) {
    dragging.value = false
    emit('change', props.modelValue)
  }
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', stopDrag)
}

const startDrag = (e: PointerEvent) => {
  if (props.disabled || props.readonly) return
  e.preventDefault()
  dragging.value = true
  updateFromPointer(e.clientX, e.clientY)
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', stopDrag)
}

const onKeydown = (e: KeyboardEvent) => {
  if (props.disabled || props.readonly) return
  const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? props.step : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -props.step : 0
  if (!delta) return
  e.preventDefault()
  const next = Math.max(props.min, Math.min(props.max, props.modelValue + delta))
  emit('update:modelValue', next)
  emit('change', next)
}

onBeforeUnmount(stopDrag)
</script>

<style scoped>
.knob-wrapper { display: inline-flex; flex-direction: column; align-items: center; gap: 8px; }
.knob-wrapper--disabled { opacity: 0.55; pointer-events: none; }
.knob-control { position: relative; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; touch-action: none; user-select: none; }
.knob-control:focus-visible { outline: 2px solid var(--primary); outline-offset: 3px; }
.knob-value { position: absolute; font-size: 1.05rem; font-weight: 700; font-variant-numeric: tabular-nums; pointer-events: none; }
.knob-label { font-size: 0.85rem; font-weight: 600; }

[data-theme="clay"] .knob-control { box-shadow: var(--clay-shadow); }
[data-theme="glass"] .knob-control { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .knob-control { box-shadow: 5px 5px 10px rgba(163, 177, 198, 0.55), -5px -5px 10px rgba(255, 255, 255, 0.85); }
</style>
