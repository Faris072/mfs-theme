<template>
  <div class="mfs-popover-wrapper">
    <div
      ref="triggerRef"
      class="mfs-popover__trigger"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      @click="toggle"
    >
      <slot name="trigger" :open="isOpen" :toggle="toggle" />
    </div>

    <Teleport to="body">
      <Transition name="mfs-popover">
        <div
          v-if="isOpen"
          ref="overlayRef"
          :style="overlayStyle"
          class="mfs-popover mfs-surface mfs-overlay mfs-popover-responsive mfs-rounded mfs-shadow-card mfs-blur"
          :class="[`mfs-popover--${placement}`]"
          role="dialog"
        >
          <slot :close="close" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useFloatingOverlay } from '../composables/useFloatingOverlay'

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

const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const internalOpen = ref(false)

const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => (isControlled.value ? Boolean(props.modelValue) : internalOpen.value))

const { overlayStyle, containsTarget } = useFloatingOverlay(triggerRef, overlayRef, isOpen, {
  offset: 10,
  align: 'center'
})

const setOpen = (next: boolean) => {
  if (!isControlled.value) {
    internalOpen.value = next
  }
  emit('update:modelValue', next)
}

const toggle = () => setOpen(!isOpen.value)
const close = () => setOpen(false)

const onDocumentPointerDown = (e: PointerEvent) => {
  if (!containsTarget(e.target)) {
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
  z-index: 10010;
  min-width: 200px;
  max-width: min(340px, 90vw);
  padding: 14px 16px;
  border-radius: var(--radius, 16px);
  background-color: var(--surface);
  color: var(--text);
  border: var(--border-width, 1px) solid var(--border, transparent);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

/* Theme Overrides */
[data-theme="neo"] .mfs-popover {
  border: none;
  box-shadow: var(--clay-shadow);
}

/* Transition */
.mfs-popover-enter-active,
.mfs-popover-leave-active {
  transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.2, 0, 0, 1);
}

.mfs-popover-enter-from,
.mfs-popover-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
