<template>
  <div ref="rootRef" class="mfs-popover-wrapper">
    <div
      class="mfs-popover__trigger"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      @click="toggle"
    >
      <slot name="trigger" :open="isOpen" :toggle="toggle" />
    </div>

    <Transition name="mfs-popover">
      <div
        v-if="isOpen"
        class="mfs-popover mfs-surface mfs-rounded mfs-shadow-card mfs-blur"
        :class="[`mfs-popover--${placement}`]"
        role="dialog"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    placement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    modelValue: undefined,
    placement: 'bottom'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const rootRef = ref<HTMLElement | null>(null)
const internalOpen = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => (isControlled.value ? Boolean(props.modelValue) : internalOpen.value))

const setOpen = (next: boolean) => {
  if (!isControlled.value) {
    internalOpen.value = next
  }
  emit('update:modelValue', next)
}

const toggle = () => setOpen(!isOpen.value)
const close = () => setOpen(false)

const onDocumentPointerDown = (e: PointerEvent) => {
  if (!rootRef.value) return
  if (!rootRef.value.contains(e.target as Node)) {
    close()
  }
}

const onDocumentKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close()
  }
}

const attachListeners = (active: boolean) => {
  if (typeof document === 'undefined') return
  if (active) {
    document.addEventListener('pointerdown', onDocumentPointerDown)
    document.addEventListener('keydown', onDocumentKeydown)
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown)
    document.removeEventListener('keydown', onDocumentKeydown)
  }
}

watch(isOpen, (open) => attachListeners(open), { immediate: true })

onBeforeUnmount(() => {
  attachListeners(false)
})
</script>

<style scoped>
.mfs-popover-wrapper {
  position: relative;
  display: inline-block;
}

.mfs-popover__trigger {
  display: inline-flex;
  cursor: pointer;
}

.mfs-popover {
  position: absolute;
  z-index: 10010;
  min-width: 200px;
  max-width: min(340px, 90vw);
  padding: 14px 16px;
  border-radius: var(--radius, 16px);
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.mfs-popover--bottom {
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
}

.mfs-popover--top {
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
}

.mfs-popover--left {
  right: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
}

.mfs-popover--right {
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
}

/* Theme Overrides */
[data-theme="glass"] .mfs-popover {
  background-color: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(18px);
  border-color: rgba(255, 255, 255, 0.18);
}

[data-theme="neo"] .mfs-popover {
  border: none;
  box-shadow: var(--clay-shadow);
}

/* Transition */
.mfs-popover-enter-active,
.mfs-popover-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mfs-popover-enter-from,
.mfs-popover-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.95);
}

.mfs-popover--left.mfs-popover-enter-from,
.mfs-popover--left.mfs-popover-leave-to,
.mfs-popover--right.mfs-popover-enter-from,
.mfs-popover--right.mfs-popover-leave-to {
  transform: translateY(-50%) scale(0.95);
}
</style>
