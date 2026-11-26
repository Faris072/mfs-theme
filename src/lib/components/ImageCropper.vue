<template>
  <div
    class="mfs-cropper mfs-surface mfs-rounded mfs-shadow-card mfs-p-4 mfs-flex mfs-flex-col mfs-gap-3"
    :class="{ 'mfs-disabled': disabled }"
  >
    <!-- Hidden file input -->
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      class="mfs-sr-only"
      :disabled="disabled"
      @change="onFileChange"
    />

    <!-- Empty / File Picker Fallback -->
    <div
      v-if="!imageSrc"
      class="mfs-cropper__empty mfs-surface-subtle mfs-rounded mfs-border mfs-flex mfs-flex-col mfs-items-center mfs-justify-center mfs-gap-2 mfs-p-6 mfs-text-center mfs-cursor-pointer mfs-focus-ring"
      role="button"
      tabindex="0"
      aria-label="Select an image to crop"
      @click="openFilePicker"
      @keydown.enter.prevent="openFilePicker"
      @keydown.space.prevent="openFilePicker"
      @dragover.prevent="isDraggingFile = true"
      @dragleave.prevent="isDraggingFile = false"
      @drop.prevent="onDropFile"
      :class="{ 'mfs-border-primary': isDraggingFile }"
    >
      <svg
        viewBox="0 0 24 24"
        width="36"
        height="36"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="mfs-text-primary"
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
      <p class="mfs-m-0 mfs-font-semibold mfs-text">
        Click or drop an image to crop
      </p>
      <span class="mfs-caption">PNG, JPG, WEBP supported</span>
    </div>

    <!-- Cropper Stage -->
    <div
      v-else
      ref="stageRef"
      class="mfs-cropper__stage mfs-relative mfs-overflow-hidden mfs-rounded mfs-select-none"
      :class="isPanning ? 'mfs-cropper__stage--grabbing' : 'mfs-cropper__stage--grab'"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @wheel.prevent="onWheel"
    >
      <img
        ref="imgRef"
        :src="imageSrc"
        alt="Crop source"
        draggable="false"
        class="mfs-cropper__img"
        :style="imageStyle"
        @load="onImageLoad"
        @error="onImageError"
      />

      <!-- Crop Viewport & Mask -->
      <div
        v-if="imageLoaded"
        class="mfs-cropper__viewport mfs-absolute"
        :class="{ 'mfs-cropper__viewport--circle': currentShape === 'circle' }"
        :style="viewportStyle"
        aria-hidden="true"
      >
        <div class="mfs-cropper__grid mfs-cropper__grid--h1" />
        <div class="mfs-cropper__grid mfs-cropper__grid--h2" />
        <div class="mfs-cropper__grid mfs-cropper__grid--v1" />
        <div class="mfs-cropper__grid mfs-cropper__grid--v2" />
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mfs-soft-danger mfs-rounded-sm mfs-p-2 mfs-text-sm" role="alert">
      {{ errorMessage }}
    </div>

    <!-- Controls -->
    <div v-if="showControls && imageSrc" class="mfs-cropper__controls mfs-flex mfs-flex-col mfs-gap-3">
      <!-- Zoom & Rotate Row -->
      <div class="mfs-row mfs-justify-between">
        <div class="mfs-flex mfs-items-center mfs-gap-2 mfs-flex-1 mfs-min-w-0">
          <button
            type="button"
            class="mfs-cropper__btn mfs-surface-subtle mfs-rounded-sm mfs-border mfs-text mfs-cursor-pointer mfs-focus-ring mfs-inline-flex mfs-items-center mfs-justify-center"
            aria-label="Zoom out"
            :disabled="disabled || zoom <= 1"
            @click="adjustZoom(-0.15)"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <input
            v-model.number="zoom"
            type="range"
            min="1"
            max="3"
            step="0.05"
            aria-label="Zoom level"
            class="mfs-cropper__slider mfs-flex-1 mfs-min-w-0"
            :disabled="disabled"
          />

          <button
            type="button"
            class="mfs-cropper__btn mfs-surface-subtle mfs-rounded-sm mfs-border mfs-text mfs-cursor-pointer mfs-focus-ring mfs-inline-flex mfs-items-center mfs-justify-center"
            aria-label="Zoom in"
            :disabled="disabled || zoom >= 3"
            @click="adjustZoom(0.15)"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>

        <div class="mfs-flex mfs-items-center mfs-gap-1-5 mfs-shrink-0">
          <button
            type="button"
            class="mfs-cropper__btn mfs-surface-subtle mfs-rounded-sm mfs-border mfs-text mfs-cursor-pointer mfs-focus-ring mfs-inline-flex mfs-items-center mfs-justify-center"
            aria-label="Rotate left 90 degrees"
            title="Rotate -90°"
            :disabled="disabled"
            @click="rotate(-90)"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>

          <button
            type="button"
            class="mfs-cropper__btn mfs-surface-subtle mfs-rounded-sm mfs-border mfs-text mfs-cursor-pointer mfs-focus-ring mfs-inline-flex mfs-items-center mfs-justify-center"
            aria-label="Rotate right 90 degrees"
            title="Rotate +90°"
            :disabled="disabled"
            @click="rotate(90)"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>

          <button
            type="button"
            class="mfs-cropper__btn mfs-surface-subtle mfs-rounded-sm mfs-border mfs-text-muted mfs-cursor-pointer mfs-focus-ring mfs-inline-flex mfs-items-center mfs-justify-center mfs-px-2 mfs-text-xs mfs-font-semibold"
            :disabled="disabled"
            @click="reset"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Action Row -->
      <div class="mfs-row mfs-justify-between mfs-flex-wrap mfs-gap-2">
        <div class="mfs-flex mfs-items-center mfs-gap-2 mfs-flex-wrap">
          <button
            type="button"
            class="mfs-cropper__action mfs-surface-subtle mfs-rounded-sm mfs-border mfs-text mfs-text-sm mfs-font-medium mfs-cursor-pointer mfs-focus-ring mfs-px-3 mfs-py-2"
            :disabled="disabled"
            @click="openFilePicker"
          >
            Change Image
          </button>

          <div
            v-if="allowShapeToggle"
            class="mfs-cropper__shape-toggle mfs-inline-flex mfs-surface-subtle mfs-rounded-sm mfs-border mfs-gap-1"
            role="group"
            aria-label="Crop shape"
          >
            <button
              type="button"
              class="mfs-cropper__shape-btn mfs-rounded-sm mfs-border-none mfs-text-xs mfs-font-semibold mfs-cursor-pointer mfs-focus-ring mfs-inline-flex mfs-items-center mfs-gap-1"
              :class="currentShape === 'rect' ? 'mfs-bg-primary' : 'mfs-bg-transparent mfs-text-muted'"
              :aria-pressed="currentShape === 'rect'"
              :disabled="disabled"
              @click="setShape('rect')"
            >
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
              </svg>
              Square
            </button>
            <button
              type="button"
              class="mfs-cropper__shape-btn mfs-rounded-sm mfs-border-none mfs-text-xs mfs-font-semibold mfs-cursor-pointer mfs-focus-ring mfs-inline-flex mfs-items-center mfs-gap-1"
              :class="currentShape === 'circle' ? 'mfs-bg-primary' : 'mfs-bg-transparent mfs-text-muted'"
              :aria-pressed="currentShape === 'circle'"
              :disabled="disabled"
              @click="setShape('circle')"
            >
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                <circle cx="8" cy="8" r="5.5" />
              </svg>
              Circle
            </button>
          </div>
        </div>

        <div class="mfs-flex mfs-items-center mfs-gap-2">
          <button
            type="button"
            class="mfs-cropper__action mfs-surface-subtle mfs-rounded-sm mfs-border mfs-text mfs-text-sm mfs-font-medium mfs-cursor-pointer mfs-focus-ring mfs-px-3 mfs-py-2"
            :disabled="disabled"
            @click="emit('cancel')"
          >
            Cancel
          </button>

          <button
            type="button"
            class="mfs-cropper__action mfs-bg-primary mfs-rounded-sm mfs-border-none mfs-text-sm mfs-font-semibold mfs-cursor-pointer mfs-focus-ring mfs-px-4 mfs-py-2"
            :disabled="disabled || !imageLoaded || isExporting"
            @click="crop"
          >
            {{ isExporting ? 'Cropping...' : 'Crop' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export interface ImageCropResult {
  blob: Blob
  dataUrl: string
  file: File
}

const props = withDefaults(
  defineProps<{
    modelValue?: File | string | null
    src?: string | null
    aspectRatio?: number
    shape?: 'rect' | 'circle'
    allowShapeToggle?: boolean
    outputType?: 'image/png' | 'image/jpeg' | 'image/webp'
    outputSize?: number
    quality?: number
    fileName?: string
    showControls?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    src: null,
    aspectRatio: 1,
    shape: 'rect',
    allowShapeToggle: true,
    outputType: 'image/png',
    outputSize: 512,
    quality: 0.92,
    fileName: 'cropped-image.png',
    showControls: true,
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: File | string | null): void
  (e: 'update:shape', value: 'rect' | 'circle'): void
  (e: 'crop', result: ImageCropResult): void
  (e: 'cancel'): void
  (e: 'error', message: string): void
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const stageRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)

const internalObjectUrl = ref<string | null>(null)
const pickedSrc = ref<string | null>(null)
const imageLoaded = ref(false)
const errorMessage = ref<string | null>(null)
const isDraggingFile = ref(false)
const isExporting = ref(false)

const natWidth = ref(0)
const natHeight = ref(0)
const stageWidth = ref(320)
const stageHeight = ref(260)

const zoom = ref(1)
const rotation = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)

const isPanning = ref(false)
let panStartX = 0
let panStartY = 0
let panOriginX = 0
let panOriginY = 0
let resizeObserver: ResizeObserver | null = null

const currentShape = ref<'rect' | 'circle'>(props.shape)

watch(
  () => props.shape,
  (val) => {
    currentShape.value = val
  }
)

function setShape(next: 'rect' | 'circle') {
  if (props.disabled || currentShape.value === next) return
  currentShape.value = next
  emit('update:shape', next)
}

const imageSrc = computed(() => {
  if (pickedSrc.value) return pickedSrc.value
  if (props.src) return props.src
  if (typeof props.modelValue === 'string' && props.modelValue) return props.modelValue
  if (internalObjectUrl.value) return internalObjectUrl.value
  return null
})

const effectiveAspect = computed(() => {
  if (currentShape.value === 'circle') return 1
  return props.aspectRatio > 0 ? props.aspectRatio : 1
})

const cropRect = computed(() => {
  const availW = Math.max(80, stageWidth.value * 0.82)
  const availH = Math.max(80, stageHeight.value * 0.82)
  const ratio = effectiveAspect.value

  let width = availW
  let height = width / ratio
  if (height > availH) {
    height = availH
    width = height * ratio
  }
  return { width, height }
})

const isRotated90 = computed(() => Math.abs(rotation.value % 180) === 90)

const baseScale = computed(() => {
  if (!natWidth.value || !natHeight.value) return 1
  const rotW = isRotated90.value ? natHeight.value : natWidth.value
  const rotH = isRotated90.value ? natWidth.value : natHeight.value
  return Math.max(cropRect.value.width / rotW, cropRect.value.height / rotH)
})

const totalScale = computed(() => baseScale.value * zoom.value)

function clamp(val: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, val))
}

function clampOffsets() {
  if (!natWidth.value || !natHeight.value) return
  const rotW = isRotated90.value ? natHeight.value : natWidth.value
  const rotH = isRotated90.value ? natWidth.value : natHeight.value
  const dispW = rotW * totalScale.value
  const dispH = rotH * totalScale.value

  const maxX = Math.max(0, (dispW - cropRect.value.width) / 2)
  const maxY = Math.max(0, (dispH - cropRect.value.height) / 2)

  offsetX.value = clamp(offsetX.value, -maxX, maxX)
  offsetY.value = clamp(offsetY.value, -maxY, maxY)
}

const imageStyle = computed(() => ({
  width: `${natWidth.value}px`,
  height: `${natHeight.value}px`,
  marginLeft: `${-natWidth.value / 2}px`,
  marginTop: `${-natHeight.value / 2}px`,
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) rotate(${rotation.value}deg) scale(${totalScale.value})`
}))

const viewportStyle = computed(() => ({
  width: `${cropRect.value.width}px`,
  height: `${cropRect.value.height}px`
}))

function revokeObjectUrl() {
  if (internalObjectUrl.value) {
    URL.revokeObjectURL(internalObjectUrl.value)
    internalObjectUrl.value = null
  }
}

function loadFile(file: File) {
  const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|svg|avif)$/i.test(file.name)
  if (!isImage) {
    const msg = `Unsupported file type: ${file.name}`
    errorMessage.value = msg
    emit('error', msg)
    return
  }
  revokeObjectUrl()
  errorMessage.value = null
  imageLoaded.value = false
  const url = URL.createObjectURL(file)
  internalObjectUrl.value = url
  pickedSrc.value = url
  reset()
}

function openFilePicker() {
  if (props.disabled) return
  fileInputRef.value?.click()
}

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) loadFile(file)
  input.value = ''
}

function onDropFile(e: DragEvent) {
  isDraggingFile.value = false
  if (props.disabled) return
  const file = e.dataTransfer?.files?.[0]
  if (file) loadFile(file)
}

function onImageLoad() {
  const img = imgRef.value
  if (!img) return
  natWidth.value = img.naturalWidth
  natHeight.value = img.naturalHeight
  imageLoaded.value = true
  errorMessage.value = null
  clampOffsets()
}

function onImageError() {
  imageLoaded.value = false
  const msg = 'Failed to load image'
  errorMessage.value = msg
  emit('error', msg)
}

function onPointerDown(e: PointerEvent) {
  if (props.disabled || !imageLoaded.value) return
  const stage = stageRef.value
  if (!stage) return
  isPanning.value = true
  panStartX = e.clientX
  panStartY = e.clientY
  panOriginX = offsetX.value
  panOriginY = offsetY.value
  stage.setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isPanning.value) return
  offsetX.value = panOriginX + (e.clientX - panStartX)
  offsetY.value = panOriginY + (e.clientY - panStartY)
  clampOffsets()
}

function onPointerUp(e: PointerEvent) {
  if (!isPanning.value) return
  isPanning.value = false
  stageRef.value?.releasePointerCapture(e.pointerId)
}

function onWheel(e: WheelEvent) {
  if (props.disabled || !imageLoaded.value) return
  const delta = e.deltaY < 0 ? 0.1 : -0.1
  adjustZoom(delta)
}

function adjustZoom(delta: number) {
  zoom.value = Number(clamp(zoom.value + delta, 1, 3).toFixed(2))
}

function rotate(deg: number) {
  rotation.value = (rotation.value + deg) % 360
  clampOffsets()
}

function reset() {
  zoom.value = 1
  rotation.value = 0
  offsetX.value = 0
  offsetY.value = 0
  clampOffsets()
}

async function crop(): Promise<ImageCropResult | null> {
  const img = imgRef.value
  if (!img || !imageLoaded.value || isExporting.value) return null

  isExporting.value = true
  errorMessage.value = null

  try {
    const ratio = effectiveAspect.value
    const outW = ratio >= 1 ? props.outputSize : Math.round(props.outputSize * ratio)
    const outH = ratio >= 1 ? Math.round(props.outputSize / ratio) : props.outputSize

    const canvas = document.createElement('canvas')
    canvas.width = outW
    canvas.height = outH

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas 2D context is unavailable')
    }

    if (props.outputType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, outW, outH)
    }

    if (currentShape.value === 'circle') {
      ctx.beginPath()
      ctx.arc(outW / 2, outH / 2, Math.min(outW, outH) / 2, 0, Math.PI * 2)
      ctx.clip()
    }

    const exportScale = outW / cropRect.value.width
    ctx.save()
    ctx.translate(outW / 2 + offsetX.value * exportScale, outH / 2 + offsetY.value * exportScale)
    ctx.rotate((rotation.value * Math.PI) / 180)
    const drawScale = totalScale.value * exportScale
    ctx.scale(drawScale, drawScale)
    ctx.drawImage(img, -natWidth.value / 2, -natHeight.value / 2, natWidth.value, natHeight.value)
    ctx.restore()

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to export cropped image'))),
        props.outputType,
        props.quality
      )
    })

    const dataUrl = canvas.toDataURL(props.outputType, props.quality)
    const file = new File([blob], props.fileName, { type: props.outputType })
    const result: ImageCropResult = { blob, dataUrl, file }

    emit('update:modelValue', file)
    emit('crop', result)
    return result
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to crop image'
    errorMessage.value = msg
    emit('error', msg)
    return null
  } finally {
    isExporting.value = false
  }
}

function updateStageSize() {
  const el = stageRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  if (rect.width > 0 && rect.height > 0) {
    stageWidth.value = rect.width
    stageHeight.value = rect.height
    clampOffsets()
  }
}

function attachStageObserver() {
  resizeObserver?.disconnect()
  if (!stageRef.value || typeof ResizeObserver === 'undefined') return
  resizeObserver = new ResizeObserver(updateStageSize)
  resizeObserver.observe(stageRef.value)
  updateStageSize()
}

watch(
  () => props.modelValue,
  (val) => {
    pickedSrc.value = null
    revokeObjectUrl()
    imageLoaded.value = false
    if (val instanceof File) {
      internalObjectUrl.value = URL.createObjectURL(val)
    }
    reset()
  },
  { immediate: true }
)

watch(
  () => props.src,
  () => {
    pickedSrc.value = null
    imageLoaded.value = false
    reset()
  }
)

watch([zoom, effectiveAspect], () => {
  clampOffsets()
})

watch(stageRef, (el) => {
  if (el) attachStageObserver()
})

onMounted(() => {
  attachStageObserver()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  revokeObjectUrl()
})

defineExpose({
  crop,
  reset
})
</script>

<style scoped>
.mfs-cropper__empty {
  min-height: 220px;
  border-style: dashed;
  border-width: 1.5px;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.mfs-cropper__stage {
  width: 100%;
  aspect-ratio: 4 / 3;
  min-height: 220px;
  max-height: 400px;
  background-color: #0f172a;
  touch-action: none;
}

.mfs-cropper__stage--grab {
  cursor: grab;
}

.mfs-cropper__stage--grabbing {
  cursor: grabbing;
}

.mfs-cropper__img {
  position: absolute;
  left: 50%;
  top: 50%;
  max-width: none;
  max-height: none;
  transform-origin: center center;
  pointer-events: none;
  will-change: transform;
}

.mfs-cropper__viewport {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.52);
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  pointer-events: none;
  overflow: hidden;
}

.mfs-cropper__viewport--circle {
  border-radius: 50%;
}

.mfs-cropper__grid {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.28);
}

.mfs-cropper__grid--h1 {
  left: 0;
  right: 0;
  top: 33.3333%;
  height: 1px;
}

.mfs-cropper__grid--h2 {
  left: 0;
  right: 0;
  top: 66.6667%;
  height: 1px;
}

.mfs-cropper__grid--v1 {
  top: 0;
  bottom: 0;
  left: 33.3333%;
  width: 1px;
}

.mfs-cropper__grid--v2 {
  top: 0;
  bottom: 0;
  left: 66.6667%;
  width: 1px;
}

.mfs-cropper__btn {
  min-width: 32px;
  height: 32px;
  transition: opacity 0.15s ease, transform 0.12s ease;
}

.mfs-cropper__btn:disabled,
.mfs-cropper__action:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.mfs-cropper__slider {
  accent-color: var(--primary);
  cursor: pointer;
}

.mfs-cropper__shape-toggle {
  padding: 2px;
}

.mfs-cropper__shape-btn {
  padding: 4px 10px;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.mfs-cropper__shape-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .mfs-cropper__stage {
    max-height: 55vh;
  }
}
</style>
