<template>
  <Teleport to="body">
    <Transition name="mfs-confirm-fade">
      <div
        v-if="state.isOpen && state.options"
        class="mfs-confirm-backdrop"
        @click="reject"
      >
        <div
          class="mfs-confirm mfs-surface mfs-rounded mfs-shadow-card mfs-blur"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="descId"
          @click.stop
        >
          <div class="mfs-confirm__header">
            <h3 :id="titleId" class="mfs-confirm__title">
              {{ state.options.title }}
            </h3>
          </div>

          <p :id="descId" class="mfs-confirm__message mfs-text-muted">
            {{ state.options.message }}
          </p>

          <div class="mfs-confirm__actions">
            <button
              type="button"
              class="mfs-confirm__btn mfs-confirm__btn--cancel mfs-surface-subtle mfs-pill mfs-shadow"
              @click="reject"
            >
              {{ state.options.cancelLabel ?? 'Cancel' }}
            </button>
            <button
              type="button"
              class="mfs-confirm__btn mfs-confirm__btn--accept mfs-pill mfs-shadow"
              :class="[`mfs-confirm__btn--${state.options.variant ?? 'primary'}`]"
              @click="accept"
            >
              {{ state.options.confirmLabel ?? 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount, useId } from 'vue'
import { useConfirm } from '../composables/useConfirm'

const { state, accept, reject } = useConfirm()
const titleId = useId()
const descId = useId()

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && state.value.isOpen) {
    reject()
  }
}

watch(
  () => state.value.isOpen,
  (open) => {
    if (typeof document === 'undefined') return
    if (open) {
      document.addEventListener('keydown', onKeydown)
    } else {
      document.removeEventListener('keydown', onKeydown)
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('keydown', onKeydown)
  }
})
</script>

<style scoped>
.mfs-confirm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10040;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.mfs-confirm {
  width: 100%;
  max-width: 420px;
  padding: 22px 24px;
  border-radius: var(--radius, 20px);
  background-color: var(--surface);
  color: var(--text);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--card-shadow);
  backdrop-filter: var(--backdrop-blur, none);
}

.mfs-confirm__header {
  margin-bottom: 10px;
}

.mfs-confirm__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
}

.mfs-confirm__message {
  margin: 0 0 20px;
  font-size: 0.92rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.mfs-confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.mfs-confirm__btn {
  padding: 9px 18px;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--border, transparent);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.mfs-confirm__btn:hover {
  transform: translateY(-1px);
}

.mfs-confirm__btn:active {
  transform: translateY(0);
}

.mfs-confirm__btn--cancel {
  background-color: var(--surface-subtle);
  color: var(--text);
  box-shadow: var(--clay-shadow);
}

.mfs-confirm__btn--accept {
  color: var(--primary-text, #ffffff);
  box-shadow: var(--clay-shadow);
}

.mfs-confirm__btn--primary { background-color: var(--primary); }
.mfs-confirm__btn--success { background-color: var(--success); }
.mfs-confirm__btn--warning { background-color: var(--warning); color: #1e293b; }
.mfs-confirm__btn--danger { background-color: var(--danger); }

/* Theme Overrides */
[data-theme="glass"] .mfs-confirm {
  background-color: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(20px);
  border-color: rgba(255, 255, 255, 0.18);
}

[data-theme="neo"] .mfs-confirm {
  border: none;
}

/* Transition */
.mfs-confirm-fade-enter-active,
.mfs-confirm-fade-leave-active {
  transition: opacity 0.2s ease;
}

.mfs-confirm-fade-enter-from,
.mfs-confirm-fade-leave-to {
  opacity: 0;
}
</style>
