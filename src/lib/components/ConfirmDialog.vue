<template>
  <Teleport to="body">
    <Transition name="mfs-confirm-fade">
      <div
        v-if="state.isOpen && state.options"
        class="mfs-confirm-backdrop mfs-backdrop mfs-fixed mfs-inset-0 mfs-flex mfs-items-center mfs-justify-center mfs-p-4"
        @click="reject"
      >
        <div
          class="mfs-confirm mfs-overlay mfs-surface mfs-rounded mfs-shadow-card mfs-blur mfs-w-full"
          role="alertdialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="descId"
          @click.stop
        >
          <div class="mfs-confirm__header">
            <h3 :id="titleId" class="mfs-confirm__title mfs-title mfs-m-0">
              {{ state.options.title }}
            </h3>
          </div>

          <p :id="descId" class="mfs-confirm__message mfs-text-muted">
            {{ state.options.message }}
          </p>

          <div class="mfs-flex mfs-justify-end mfs-gap-2-5 mfs-flex-wrap">
            <button
              type="button"
              class="mfs-confirm__btn mfs-surface-subtle mfs-pill mfs-shadow mfs-focus-ring mfs-cursor-pointer mfs-font-semibold"
              @click="reject"
            >
              {{ state.options.cancelLabel ?? 'Cancel' }}
            </button>
            <button
              type="button"
              class="mfs-confirm__btn mfs-pill mfs-shadow mfs-focus-ring mfs-cursor-pointer mfs-font-semibold"
              :class="[`mfs-bg-${state.options.variant ?? 'primary'}`]"
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
  z-index: 10040;
}

.mfs-confirm {
  max-width: 420px;
  padding: 22px 24px;
}

.mfs-confirm__header {
  margin-bottom: 10px;
}

.mfs-confirm__title {
  font-size: 1.15rem;
}

.mfs-confirm__message {
  margin: 0 0 20px;
  font-size: 0.92rem;
  line-height: 1.5;
}

.mfs-confirm__btn {
  padding: 9px 18px;
  border: var(--border-width, 1px) solid var(--border);
  font-family: inherit;
  font-size: 0.9rem;
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}

.mfs-confirm__btn:hover {
  transform: translateY(-1px);
}

.mfs-confirm__btn:active {
  transform: translateY(0);
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
