<template>
  <div
    ref="containerRef"
    class="mfs-image-compare mfs-relative mfs-overflow-hidden mfs-rounded mfs-select-none mfs-surface mfs-shadow"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <img
      :src="rightSrc"
      :alt="rightAlt"
      class="mfs-image-compare__img mfs-w-full mfs-h-full"
      draggable="false"
    />

    <img
      :src="leftSrc"
      :alt="leftAlt"
      class="mfs-image-compare__img mfs-image-compare__img--left mfs-absolute mfs-inset-0 mfs-w-full mfs-h-full"
      :style="{ clipPath: `inset(0 ${100 - position}% 0 0)` }"
      draggable="false"
    />

    <div
      class="mfs-image-compare__divider mfs-absolute"
      :style="{ left: `${position}%` }"
      aria-hidden="true"
    >
      <div class="mfs-image-compare__line" />
      <div class="mfs-image-compare__handle mfs-surface mfs-pill mfs-shadow mfs-flex mfs-items-center mfs-justify-center">
        <span class="mfs-image-compare__arrows">‹ ›</span>
      </div>
    </div>

    <input
      type="range"
      min="0"
      max="100"
      step="1"
      :value="position"
      class="mfs-image-compare__range mfs-sr-only"
      aria-label="Image comparison slider"
      @input="onRangeInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    leftSrc: string
    rightSrc: string
    leftAlt?: string
    rightAlt?: string
    modelValue?: number
  }>(),
  {
    leftAlt: 'Before image',
    rightAlt: 'After image',
    modelValue: 50
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const clamp = (val: number) => Math.min(100, Math.max(0, val))

const containerRef = ref<HTMLElement | null>(null)
const position = ref(clamp(props.modelValue))
const isDragging = ref(false)

watch(
  () => props.modelValue,
  (val) => {
    position.value = clamp(val)
  }
)

const updatePosition = (val: number) => {
  const next = Math.round(clamp(val) * 10) / 10
  position.value = next
  emit('update:modelValue', next)
}

const updateFromClientX = (clientX: number) => {
  const el = containerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0) return
  const ratio = ((clientX - rect.left) / rect.width) * 100
  updatePosition(ratio)
}

const onPointerDown = (e: PointerEvent) => {
  isDragging.value = true
  ;(e.currentTarget as HTMLElement)?.setPointerCapture?.(e.pointerId)
  updateFromClientX(e.clientX)
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging.value) return
  updateFromClientX(e.clientX)
}

const onPointerUp = (e: PointerEvent) => {
  if (!isDragging.value) return
  isDragging.value = false
  ;(e.currentTarget as HTMLElement)?.releasePointerCapture?.(e.pointerId)
}

const onRangeInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  updatePosition(Number(target.value))
}
</script>

<style scoped>
.mfs-image-compare {
  display: block;
  touch-action: none;
  cursor: ew-resize;
}

.mfs-image-compare__img {
  display: block;
  object-fit: cover;
  pointer-events: none;
}

.mfs-image-compare__divider {
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
  pointer-events: none;
  z-index: 2;
}

.mfs-image-compare__line {
  width: 2px;
  height: 100%;
  background: var(--surface, #ffffff);
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.35);
}

.mfs-image-compare__handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border: 2px solid var(--primary, #6366f1);
  color: var(--text);
  font-weight: 700;
  font-size: 0.9rem;
}

.mfs-image-compare__arrows {
  line-height: 1;
  letter-spacing: 2px;
}

.mfs-image-compare:has(.mfs-image-compare__range:focus-visible) .mfs-image-compare__handle {
  outline: 2px solid var(--primary, #6366f1);
  outline-offset: 2px;
}
</style>
