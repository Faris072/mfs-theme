<template>
  <Teleport to="body">
    <Transition name="mfs-drawer-fade">
      <div
        v-if="modelValue"
        class="mfs-drawer-backdrop"
        @click="handleBackdropClick"
      >
        <aside
          class="mfs-drawer mfs-surface mfs-shadow-card mfs-blur"
          :class="[`mfs-drawer--${position}`]"
          :style="panelStyle"
          role="dialog"
          aria-modal="true"
          :aria-label="title || 'Drawer'"
          @click.stop
        >
          <div v-if="title || $slots.header" class="mfs-drawer__header">
            <slot name="header">
              <h3 class="mfs-drawer__title">{{ title }}</h3>
            </slot>
            <button
              type="button"
              class="mfs-drawer__close mfs-surface-subtle mfs-pill"
              aria-label="Close drawer"
              @click="close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <div class="mfs-drawer__body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="mfs-drawer__footer">
            <slot name="footer" />
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeUnmount } from 'vue'

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

const lockBody = (lock: boolean) => {
  if (typeof document === 'undefined') return
  if (lock) {
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeydown)
  } else {
    document.body.style.overflow = prevOverflow
    document.removeEventListener('keydown', onKeydown)
  }
}

watch(
  () => props.modelValue,
  (open) => lockBody(open),
  { immediate: true }
)

onBeforeUnmount(() => {
  if (props.modelValue) {
    lockBody(false)
  }
})
</script>

<style scoped>
.mfs-drawer-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
}

.mfs-drawer {
  position: fixed;
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid var(--border, rgba(0, 0, 0, 0.06));
}

.mfs-drawer__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
}

.mfs-drawer__close {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: var(--surface-subtle);
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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

.mfs-drawer__body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.mfs-drawer__footer {
  padding: 14px 20px 18px;
  border-top: 1px solid var(--border, rgba(0, 0, 0, 0.06));
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* Theme Overrides */
[data-theme="glass"] .mfs-drawer {
  background-color: rgba(15, 23, 42, 0.86);
  backdrop-filter: blur(20px);
  border-color: rgba(255, 255, 255, 0.16);
}

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
