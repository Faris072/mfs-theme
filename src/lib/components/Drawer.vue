<template>
  <Teleport to="body">
    <Transition name="mfs-drawer-fade">
      <div
        v-if="modelValue"
        class="mfs-drawer-backdrop mfs-backdrop mfs-fixed mfs-inset-0 mfs-flex"
        @click="handleBackdropClick"
      >
        <aside
          class="mfs-drawer mfs-surface mfs-overlay mfs-shadow-card mfs-blur mfs-fixed mfs-flex mfs-flex-col mfs-overflow-hidden"
          :class="[`mfs-drawer--${position}`]"
          :style="panelStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="title || 'Drawer'"
          @click.stop
        >
          <div v-if="title || $slots.header" class="mfs-drawer__header mfs-flex mfs-items-center mfs-justify-between mfs-gap-3 mfs-border-b">
            <slot name="header">
              <h3 class="mfs-drawer__title mfs-title mfs-m-0 mfs-font-bold">{{ title }}</h3>
            </slot>
            <button
              type="button"
              class="mfs-drawer__close mfs-surface-subtle mfs-pill mfs-focus-ring mfs-shrink-0 mfs-border-none mfs-text-muted mfs-inline-flex mfs-items-center mfs-justify-center mfs-cursor-pointer"
              aria-label="Close drawer"
              @click="close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div class="mfs-drawer__body mfs-flex-1 mfs-p-5 mfs-overflow-y-auto">
            <slot />
          </div>

          <div v-if="$slots.footer" class="mfs-drawer__footer mfs-border-t mfs-flex mfs-justify-end mfs-gap-2-5">
            <slot name="footer" />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    position?: 'left' | 'right' | 'top' | 'bottom'
    size?: string
    title?: string
    closeOnBackdrop?: boolean
  }>(),
  {
    modelValue: false,
    position: 'right',
    size: '360px',
    closeOnBackdrop: true
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const isHorizontal = computed(() => props.position === 'left' || props.position === 'right')

const panelStyle = computed(() =>
  isHorizontal.value
    ? { width: props.size, maxWidth: '100vw', height: '100%' }
    : { height: props.size, maxHeight: '100vh', width: '100%' }
)

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    close()
  }
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue) {
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
    document.addEventListener('keydown', onKeydown)
    hasLocked = true
  } else if (hasLocked) {
    document.body.style.overflow = prevOverflow
    document.removeEventListener('keydown', onKeydown)
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
.mfs-drawer-backdrop {
  z-index: 10000;
}

.mfs-drawer {
  transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.mfs-drawer--left {
  top: 0;
  bottom: 0;
  left: 0;
  border-radius: 0 var(--radius, 20px) var(--radius, 20px) 0;
}

.mfs-drawer--right {
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: var(--radius, 20px) 0 0 var(--radius, 20px);
}

.mfs-drawer--top {
  top: 0;
  left: 0;
  right: 0;
  border-radius: 0 0 var(--radius, 20px) var(--radius, 20px);
}

.mfs-drawer--bottom {
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: var(--radius, 20px) var(--radius, 20px) 0 0;
}

.mfs-drawer__header {
  padding: 18px 20px 14px;
}

.mfs-drawer__title {
  font-size: 1.15rem;
}

.mfs-drawer__close {
  width: 34px;
  height: 34px;
  transition: transform 0.15s ease, color 0.15s ease;
}

.mfs-drawer__close svg {
  width: 16px;
  height: 16px;
}

.mfs-drawer__close:hover {
  color: var(--text);
  transform: scale(1.08);
}

.mfs-drawer__footer {
  padding: 14px 20px 18px;
}

/* Theme Overrides */
[data-theme="neo"] .mfs-drawer {
  border: none;
}

/* Transitions */
.mfs-drawer-fade-enter-active,
.mfs-drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}

.mfs-drawer-fade-enter-from,
.mfs-drawer-fade-leave-to {
  opacity: 0;
}

.mfs-drawer-fade-enter-from .mfs-drawer--left,
.mfs-drawer-fade-leave-to .mfs-drawer--left {
  transform: translateX(-100%);
}

.mfs-drawer-fade-enter-from .mfs-drawer--right,
.mfs-drawer-fade-leave-to .mfs-drawer--right {
  transform: translateX(100%);
}

.mfs-drawer-fade-enter-from .mfs-drawer--top,
.mfs-drawer-fade-leave-to .mfs-drawer--top {
  transform: translateY(-100%);
}

.mfs-drawer-fade-enter-from .mfs-drawer--bottom,
.mfs-drawer-fade-leave-to .mfs-drawer--bottom {
  transform: translateY(100%);
}

@media (max-width: 640px) {
  .mfs-drawer--left,
  .mfs-drawer--right {
    border-radius: 0;
  }
}
</style>
