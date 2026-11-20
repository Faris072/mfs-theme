<template>
  <div class="slider-wrapper" :class="{ 'slider-wrapper--disabled': disabled }">
    <div v-if="label" class="slider-header">
      <span class="slider-label mfs-text">{{ label }}</span>
      <span class="slider-readout">
        {{ range && Array.isArray(modelValue) ? `${modelValue[0]} – ${modelValue[1]}` : currentSingle }}
      </span>
    </div>

    <div
      ref="trackRef"
      class="slider-track mfs-surface mfs-pill mfs-shadow-inset"
      @pointerdown="onTrackPointerDown"
    >
      <div class="slider-fill mfs-pill" :style="fillStyle" />

      <div
        v-if="range"
        role="slider"
        tabindex="0"
        class="slider-thumb mfs-shadow"
        :class="{ 'slider-thumb--active': activeHandle === 0 }"
        :style="{ left: `${pct(lowVal)}%` }"
        :aria-valuemin="min"
        :aria-valuemax="highVal"
        :aria-valuenow="lowVal"
        aria-label="Minimum value"
        @pointerdown.stop="startDrag(0, $event)"
        @keydown="onKeydown(0, $event)"
      >
        <span v-if="showTooltip" class="slider-tooltip">{{ lowVal }}</span>
      </div>

      <div
        role="slider"
        tabindex="0"
        class="slider-thumb mfs-shadow"
        :class="{ 'slider-thumb--active': activeHandle === (range ? 1 : 0) }"
        :style="{ left: `${pct(range ? highVal : currentSingle)}%` }"
        :aria-valuemin="range ? lowVal : min"
        :aria-valuemax="max"
        :aria-valuenow="range ? highVal : currentSingle"
        :aria-label="range ? 'Maximum value' : (label || 'Slider')"
        @pointerdown.stop="startDrag(range ? 1 : 0, $event)"
        @keydown="onKeydown(range ? 1 : 0, $event)"
      >
        <span v-if="showTooltip" class="slider-tooltip">{{ range ? highVal : currentSingle }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number | [number, number]
    range?: boolean
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    label?: string
    showTooltip?: boolean
  }>(),
  {
    modelValue: 0,
    range: false,
    min: 0,
    max: 100,
    step: 1,
    disabled: false,
    showTooltip: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | [number, number]): void
  (e: 'change', value: number | [number, number]): void
}>()

const trackRef = ref<HTMLElement | null>(null)
const activeHandle = ref<0 | 1 | null>(null)

const currentSingle = computed(() => (typeof props.modelValue === 'number' ? props.modelValue : props.min))
const lowVal = computed(() => (Array.isArray(props.modelValue) ? props.modelValue[0] : props.min))
const highVal = computed(() => (Array.isArray(props.modelValue) ? props.modelValue[1] : props.max))

const pct = (val: number) => {
  const span = props.max - props.min
  if (span <= 0) return 0
  return Math.max(0, Math.min(100, ((val - props.min) / span) * 100))
}

const fillStyle = computed(() => {
  if (props.range) {
    const left = pct(lowVal.value)
    const right = pct(highVal.value)
    return { left: `${left}%`, width: `${Math.max(0, right - left)}%` }
  }
  return { left: '0%', width: `${pct(currentSingle.value)}%` }
})

const snap = (raw: number) => {
  const clamped = Math.max(props.min, Math.min(props.max, raw))
  const stepped = Math.round((clamped - props.min) / props.step) * props.step + props.min
  return Math.max(props.min, Math.min(props.max, Number(stepped.toFixed(6))))
}

const valueFromClientX = (clientX: number) => {
  const rect = trackRef.value?.getBoundingClientRect()
  if (!rect || rect.width === 0) return props.min
  const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  return snap(props.min + ratio * (props.max - props.min))
}

const updateHandle = (handle: 0 | 1, val: number) => {
  if (props.range) {
    const pair: [number, number] = [lowVal.value, highVal.value]
    if (handle === 0) pair[0] = Math.min(val, pair[1])
    else pair[1] = Math.max(val, pair[0])
    emit('update:modelValue', pair)
  } else {
    emit('update:modelValue', val)
  }
}

const onPointerMove = (e: PointerEvent) => {
  if (activeHandle.value === null) return
  updateHandle(activeHandle.value, valueFromClientX(e.clientX))
}

const stopDrag = () => {
  if (activeHandle.value !== null) {
    activeHandle.value = null
    emit('change', props.modelValue)
  }
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', stopDrag)
}

const startDrag = (handle: 0 | 1, e: PointerEvent) => {
  if (props.disabled) return
  e.preventDefault()
  activeHandle.value = handle
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', stopDrag)
}

const onTrackPointerDown = (e: PointerEvent) => {
  if (props.disabled) return
  const val = valueFromClientX(e.clientX)
  let handle: 0 | 1 = 0
  if (props.range) {
    handle = Math.abs(val - lowVal.value) <= Math.abs(val - highVal.value) ? 0 : 1
  }
  updateHandle(handle, val)
  startDrag(handle, e)
}

const onKeydown = (handle: 0 | 1, e: KeyboardEvent) => {
  if (props.disabled) return
  const delta = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? props.step : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -props.step : 0
  if (!delta) return
  e.preventDefault()
  const base = props.range ? (handle === 0 ? lowVal.value : highVal.value) : currentSingle.value
  updateHandle(handle, snap(base + delta))
  emit('change', props.modelValue)
}

onBeforeUnmount(stopDrag)
</script>

<style scoped>
.slider-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding: 6px 0;
}

.slider-wrapper--disabled {
  opacity: 0.55;
  pointer-events: none;
}

.slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.slider-label {
  font-weight: 600;
  color: var(--text);
}

.slider-readout {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
}

.slider-track {
  position: relative;
  height: 10px;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--surface);
  box-shadow: var(--input-shadow);
  border: 1px solid var(--border, transparent);
  cursor: pointer;
  touch-action: none;
}

.slider-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  border-radius: var(--radius-pill, 9999px);
  background-color: var(--primary);
}

.slider-thumb {
  position: absolute;
  top: 50%;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #ffffff;
  border: 2px solid var(--primary);
  box-shadow: var(--clay-shadow);
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.slider-thumb:hover,
.slider-thumb--active {
  transform: translate(-50%, -50%) scale(1.14);
  box-shadow: var(--clay-shadow-hover);
}

.slider-thumb:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

.slider-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 7px;
  border-radius: var(--radius-sm, 6px);
  background-color: var(--text);
  color: var(--bg, #ffffff);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}

.slider-thumb:hover .slider-tooltip,
.slider-thumb--active .slider-tooltip {
  opacity: 1;
}

[data-theme="clay"] .slider-thumb {
  box-shadow: 3px 5px 10px rgba(124, 58, 237, 0.3), inset 2px 2px 4px rgba(255, 255, 255, 0.9);
}

[data-theme="glass"] .slider-track {
  border: 1px solid rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .slider-track {
  box-shadow: inset 2px 2px 5px rgba(163, 177, 198, 0.6), inset -2px -2px 5px rgba(255, 255, 255, 0.85);
}

[data-theme="neo"] .slider-thumb {
  box-shadow: 3px 3px 6px rgba(163, 177, 198, 0.6), -3px -3px 6px rgba(255, 255, 255, 0.85);
}
</style>
