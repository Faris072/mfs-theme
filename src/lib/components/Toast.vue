<template>
  <Teleport to="body">
    <div
      class="mfs-toast-container"
      :class="[`mfs-toast-container--${position}`]"
      role="region"
      aria-label="Notifications"
    >
      <TransitionGroup name="mfs-toast" tag="div" class="mfs-toast-list">
        <div
          v-for="item in visibleToasts"
          :key="item.id"
          class="mfs-toast mfs-surface mfs-rounded mfs-shadow-card mfs-blur"
          :class="[`mfs-toast--${item.severity}`]"
          :role="item.severity === 'danger' || item.severity === 'warning' ? 'alert' : 'status'"
          aria-live="polite"
          @mouseenter="pause(item.id)"
          @mouseleave="resume(item.id)"
          @focusin="pause(item.id)"
          @focusout="resume(item.id)"
        >
          <span class="mfs-toast__icon" aria-hidden="true">
            <svg v-if="item.severity === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <svg v-else-if="item.severity === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <svg v-else-if="item.severity === 'danger'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </span>

          <div class="mfs-toast__body">
            <div v-if="item.title" class="mfs-toast__title">{{ item.title }}</div>
            <div class="mfs-toast__message mfs-text-muted">{{ item.message }}</div>
          </div>

          <button
            v-if="item.closable"
            type="button"
            class="mfs-toast__close mfs-surface-subtle mfs-pill"
            aria-label="Close notification"
            @click="remove(item.id)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast, type ToastPosition } from '../composables/useToast'

const props = withDefaults(
  defineProps<{
    position?: ToastPosition
    max?: number
  }>(),
  {
    position: 'top-right'
  }
)

const { toasts, remove, pause, resume } = useToast()

const visibleToasts = computed(() => {
  if (props.max && props.max > 0) {
    return toasts.value.slice(-props.max)
  }
  return toasts.value
})
</script>

<style scoped>
.mfs-toast-container {
  position: fixed;
  z-index: 10050;
  pointer-events: none;
  padding: 16px;
  max-width: 100vw;
  width: min(400px, 100vw);
}

.mfs-toast-container--top-right { top: 0; right: 0; }
.mfs-toast-container--top-left { top: 0; left: 0; }
.mfs-toast-container--bottom-right { bottom: 0; right: 0; }
.mfs-toast-container--bottom-left { bottom: 0; left: 0; }
.mfs-toast-container--top-center { top: 0; left: 50%; transform: translateX(-50%); }
.mfs-toast-container--bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); }

.mfs-toast-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mfs-toast {
  --toast-accent: var(--primary);
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background-color: var(--surface);
  color: var(--text);
  border-radius: var(--radius, 16px);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  border-left: 4px solid var(--toast-accent);
  position: relative;
}

.mfs-toast--info { --toast-accent: var(--primary); }
.mfs-toast--success { --toast-accent: var(--success); }
.mfs-toast--warning { --toast-accent: var(--warning); }
.mfs-toast--danger { --toast-accent: var(--danger); }

.mfs-toast__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--toast-accent);
  margin-top: 2px;
}

.mfs-toast__icon svg {
  width: 100%;
  height: 100%;
}

.mfs-toast__body {
  flex: 1;
  min-width: 0;
}

.mfs-toast__title {
  font-weight: 700;
  font-size: 0.95rem;
  margin-bottom: 2px;
  line-height: 1.3;
}

.mfs-toast__message {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.4;
  word-break: break-word;
}

.mfs-toast__close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
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

.mfs-toast__close svg {
  width: 15px;
  height: 15px;
}

.mfs-toast__close:hover {
  color: var(--text);
  transform: scale(1.08);
}

/* Theme Overrides */
[data-theme="clay"] .mfs-toast {
  box-shadow: var(--clay-shadow);
}

[data-theme="glass"] .mfs-toast {
  background-color: rgba(15, 23, 42, 0.78);
  backdrop-filter: blur(18px);
  border-color: rgba(255, 255, 255, 0.18);
  border-left: 4px solid var(--toast-accent);
}

[data-theme="neo"] .mfs-toast {
  box-shadow: var(--clay-shadow);
  border: none;
  border-left: 4px solid var(--toast-accent);
}

/* Transitions */
.mfs-toast-enter-active,
.mfs-toast-leave-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.mfs-toast-enter-from,
.mfs-toast-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.mfs-toast-move {
  transition: transform 0.25s ease;
}

@media (max-width: 640px) {
  .mfs-toast-container {
    width: 100vw;
    left: 0 !important;
    right: 0 !important;
    transform: none !important;
    padding: 12px;
  }
}
</style>
