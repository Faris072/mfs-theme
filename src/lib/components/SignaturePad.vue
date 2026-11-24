<template>
  <div class="mfs-signature mfs-surface mfs-rounded mfs-shadow-card mfs-flex mfs-flex-col mfs-gap-3" :class="{ 'mfs-disabled': disabled }">
    <div class="mfs-signature__stage mfs-inset mfs-rounded-sm mfs-relative">
      <canvas
        ref="canvasRef"
        :width="width"
        :height="height"
        class="mfs-signature__canvas mfs-w-full"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onPointerUp"
      />
      <span v-if="empty" class="mfs-signature__hint mfs-text-muted mfs-text-sm mfs-select-none">
        Sign here
      </span>
    </div>

    <div class="mfs-signature__actions mfs-flex mfs-items-center mfs-justify-end mfs-gap-2">
      <Button
        variant="surface"
        size="sm"
        :disabled="disabled || empty"
        @click="clear"
      >
        Clear
      </Button>
      <Button
        variant="primary"
        size="sm"
        :disabled="disabled || empty"
        @click="exportSignature"
      >
        Save
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import Button from './Button.vue'

export interface SignatureExportPayload {
  blob: Blob | null
  dataUrl: string | null
  file: File | null
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    width?: number
    height?: number
    penColor?: string
    lineWidth?: number
    outputType?: 'image/png' | 'image/jpeg'
    fileName?: string
    disabled?: boolean
  }>(),
  {
    modelValue: null,
    width: 480,
    height: 180,
    penColor: 'currentColor',
    lineWidth: 2.5,
    outputType: 'image/png',
    fileName: 'signature.png',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', payload: SignatureExportPayload): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const empty = ref(true)

const getContext = (): CanvasRenderingContext2D | null => {
  return canvasRef.value?.getContext('2d') ?? null
}

const resolvePenColor = (canvas: HTMLCanvasElement): string => {
  if (props.penColor && props.penColor !== 'currentColor') {
    return props.penColor
  }
  if (typeof window !== 'undefined') {
    const computedColor = window.getComputedStyle(canvas).color
    if (computedColor) return computedColor
  }
  return '#0f172a'
}

const getPoint = (e: PointerEvent): { x: number; y: number } => {
  const canvas = canvasRef.value!
  const rect = canvas.getBoundingClientRect()
  const scaleX = rect.width > 0 ? canvas.width / rect.width : 1
  const scaleY = rect.height > 0 ? canvas.height / rect.height : 1
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  }
}

const onPointerDown = (e: PointerEvent) => {
  if (props.disabled) return
  const canvas = canvasRef.value
  const ctx = getContext()
  if (!canvas || !ctx) return

  canvas.setPointerCapture?.(e.pointerId)
  const pt = getPoint(e)
  ctx.strokeStyle = resolvePenColor(canvas)
  ctx.lineWidth = props.lineWidth
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(pt.x, pt.y)
  ctx.lineTo(pt.x + 0.01, pt.y + 0.01)
  ctx.stroke()

  isDrawing.value = true
  empty.value = false
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDrawing.value || props.disabled) return
  const ctx = getContext()
  if (!ctx) return

  const pt = getPoint(e)
  ctx.lineTo(pt.x, pt.y)
  ctx.stroke()
}

const onPointerUp = (e: PointerEvent) => {
  if (!isDrawing.value) return
  const canvas = canvasRef.value
  if (canvas?.hasPointerCapture?.(e.pointerId)) {
    canvas.releasePointerCapture(e.pointerId)
  }
  isDrawing.value = false
}

const isEmpty = (): boolean => empty.value

const clear = () => {
  const canvas = canvasRef.value
  const ctx = getContext()
  if (canvas && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }
  isDrawing.value = false
  empty.value = true
  emit('update:modelValue', null)
  emit('change', { blob: null, dataUrl: null, file: null })
}

const exportSignature = (): Promise<SignatureExportPayload> => {
  const canvas = canvasRef.value
  if (!canvas || empty.value) {
    const emptyPayload: SignatureExportPayload = { blob: null, dataUrl: null, file: null }
    emit('update:modelValue', null)
    emit('change', emptyPayload)
    return Promise.resolve(emptyPayload)
  }

  const dataUrl = canvas.toDataURL(props.outputType)
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = blob ? new File([blob], props.fileName, { type: props.outputType }) : null
      const payload: SignatureExportPayload = { blob, dataUrl, file }
      emit('update:modelValue', dataUrl)
      emit('change', payload)
      resolve(payload)
    }, props.outputType)
  })
}

const drawFromDataUrl = (src: string | null | undefined) => {
  const canvas = canvasRef.value
  const ctx = getContext()
  if (!canvas || !ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (!src) {
    empty.value = true
    return
  }

  const img = new Image()
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    empty.value = false
  }
  img.src = src
}

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      const canvas = canvasRef.value
      const ctx = getContext()
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      empty.value = true
    } else if (canvasRef.value && canvasRef.value.toDataURL(props.outputType) !== val) {
      drawFromDataUrl(val)
    }
  }
)

onMounted(() => {
  if (props.modelValue) {
    drawFromDataUrl(props.modelValue)
  }
})

defineExpose({
  clear,
  isEmpty,
  exportSignature
})
</script>

<style scoped>
.mfs-signature {
  padding: 14px;
}

.mfs-signature__stage {
  overflow: hidden;
}

.mfs-signature__canvas {
  display: block;
  height: auto;
  color: var(--text);
  cursor: crosshair;
  touch-action: none;
}

.mfs-signature__hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0.6;
}
</style>
