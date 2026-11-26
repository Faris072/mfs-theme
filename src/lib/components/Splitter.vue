<template>
  <div
    ref="containerRef"
    :class="['splitter', `splitter--${layout}`, 'mfs-flex', 'mfs-w-full', 'mfs-overflow-hidden', 'mfs-surface', 'mfs-rounded', 'mfs-shadow-card']"
  >
    <div class="splitter__pane" :style="firstPaneStyle">
      <slot name="first" />
    </div>

    <div
      class="splitter__gutter mfs-surface-subtle mfs-focus-ring"
      role="separator"
      tabindex="0"
      :aria-orientation="layout === 'horizontal' ? 'vertical' : 'horizontal'"
      :aria-valuenow="Math.round(size)"
      :aria-valuemin="minSize"
      :aria-valuemax="100 - minSize"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @keydown="onKeyDown"
    >
      <span class="splitter__handle mfs-pill" />
    </div>

    <div class="splitter__pane splitter__pane--second">
      <slot name="second" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    layout?: 'horizontal' | 'vertical'
    initialSize?: number
    minSize?: number
  }>(),
  {
    layout: 'horizontal',
    initialSize: 50,
    minSize: 15
  }
)

const emit = defineEmits<{
  (e: 'resize', size: number): void
}>()

const clamp = (val: number) => Math.max(props.minSize, Math.min(100 - props.minSize, val))

const size = ref(clamp(props.initialSize))
const dragging = ref(false)
const containerRef = ref<HTMLElement | null>(null)

const firstPaneStyle = computed(() => ({
  flexBasis: `${size.value}%`
}))

const updateFromPointer = (e: PointerEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const raw =
    props.layout === 'horizontal'
      ? ((e.clientX - rect.left) / rect.width) * 100
      : ((e.clientY - rect.top) / rect.height) * 100
  size.value = clamp(raw)
  emit('resize', size.value)
}

const onPointerDown = (e: PointerEvent) => {
  dragging.value = true
  ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  updateFromPointer(e)
}

const onPointerMove = (e: PointerEvent) => {
  if (!dragging.value) return
  updateFromPointer(e)
}

const onPointerUp = (e: PointerEvent) => {
  if (!dragging.value) return
  dragging.value = false
  if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
  }
}

const onKeyDown = (e: KeyboardEvent) => {
  const step = 5
  const decKey = props.layout === 'horizontal' ? 'ArrowLeft' : 'ArrowUp'
  const incKey = props.layout === 'horizontal' ? 'ArrowRight' : 'ArrowDown'
  if (e.key === decKey) {
    e.preventDefault()
    size.value = clamp(size.value - step)
    emit('resize', size.value)
  } else if (e.key === incKey) {
    e.preventDefault()
    size.value = clamp(size.value + step)
    emit('resize', size.value)
  }
}
</script>

<style scoped>
.splitter {
  display: flex;
  width: 100%;
  min-height: 180px;
  overflow: hidden;
}

.splitter--horizontal {
  flex-direction: row;
}

.splitter--vertical {
  flex-direction: column;
}

.splitter__pane {
  flex-grow: 0;
  flex-shrink: 0;
  overflow: auto;
  padding: 14px;
  min-width: 0;
  min-height: 0;
}

.splitter__pane--second {
  flex: 1 1 0%;
}

.splitter__gutter {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  touch-action: none;
  user-select: none;
}

.splitter--horizontal .splitter__gutter {
  width: 10px;
  cursor: col-resize;
}

.splitter--vertical .splitter__gutter {
  height: 10px;
  cursor: row-resize;
}

.splitter__handle {
  background-color: var(--text-muted);
  opacity: 0.45;
  transition: opacity 0.15s ease, background-color 0.15s ease;
}

.splitter--horizontal .splitter__handle {
  width: 4px;
  height: 28px;
}

.splitter--vertical .splitter__handle {
  width: 28px;
  height: 4px;
}

.splitter__gutter:hover .splitter__handle,
.splitter__gutter:focus-visible .splitter__handle {
  opacity: 0.9;
  background-color: var(--primary);
}

[data-theme="glass"] .splitter {
  border-color: rgba(255, 255, 255, 0.25);
}

[data-theme="neo"] .splitter__gutter {
  box-shadow: inset 1px 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .splitter--horizontal {
    flex-direction: column;
  }

  .splitter--horizontal .splitter__pane {
    flex-basis: auto !important;
    width: 100%;
  }

  .splitter--horizontal .splitter__gutter {
    width: 100%;
    height: 10px;
    cursor: row-resize;
  }

  .splitter--horizontal .splitter__handle {
    width: 28px;
    height: 4px;
  }
}
</style>
