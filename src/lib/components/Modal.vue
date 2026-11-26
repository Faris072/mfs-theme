<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop mfs-backdrop mfs-flex mfs-items-center mfs-justify-center mfs-p-4" @click="handleBackdropClick">
        <div
          v-liquid-glass
          class="modal-dialog mfs-card mfs-overlay mfs-dialog-responsive mfs-flex mfs-flex-col mfs-overflow-hidden mfs-p-0"
          :class="[`modal--${size}`]"
          role="dialog"
          aria-modal="true"
          @click.stop
        >
          <div v-if="title || $slots.header" class="modal-header mfs-flex mfs-items-center mfs-justify-between">
            <slot name="header">
              <h3 class="modal-title mfs-title">{{ title }}</h3>
            </slot>
            <button class="modal-close mfs-flex mfs-items-center mfs-justify-center mfs-border-none mfs-text-muted mfs-focus-ring" @click="close" aria-label="Close modal">
              ✕
            </button>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal-footer mfs-flex mfs-flex-wrap mfs-items-center mfs-justify-end mfs-gap-3">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onMounted, onBeforeUnmount } from 'vue'
import { vLiquidGlass } from '../composables/useLiquidGlass'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    title?: string
    size?: 'sm' | 'md' | 'lg'
    closeOnBackdrop?: boolean
  }>(),
  {
    modelValue: false,
    size: 'md',
    closeOnBackdrop: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

let prevOverflow = ''
let hasLocked = false

const lockBody = (lock: boolean) => {
  if (typeof document === 'undefined') return
  if (lock) {
    if (hasLocked) return
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    hasLocked = true
  } else if (hasLocked) {
    document.body.style.overflow = prevOverflow
    hasLocked = false
  }
}

onMounted(() => {
  if (props.modelValue) {
    lockBody(true)
  }
})

watch(
  () => props.modelValue,
  (open) => lockBody(open)
)

onBeforeUnmount(() => {
  lockBody(false)
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
}

.modal-dialog {
  max-height: 90vh;
  animation: modal-pop 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.modal--sm { max-width: 400px; }
.modal--md { max-width: 560px; }
.modal--lg { max-width: 780px; }

.modal-header {
  padding: 20px 24px 14px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.05));
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.modal-close {
  background: var(--surface-subtle);
  font-size: 1rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.modal-close:hover {
  color: var(--text);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.05));
  background-color: var(--surface-subtle);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-pop {
  0% { transform: scale(0.92); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 640px) {
  .modal-header {
    padding: 16px 16px 12px;
  }

  .modal-body {
    padding: 16px;
  }

  .modal-footer {
    padding: 12px 16px;
  }
}
</style>
