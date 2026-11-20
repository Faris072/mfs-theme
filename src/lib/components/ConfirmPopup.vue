<template>
  <Teleport to="body">
    <Transition name="mfs-confirm-popup">
      <div
        v-if="isOpen"
        ref="popupRef"
        class="mfs-confirm-popup mfs-surface mfs-rounded mfs-shadow-card mfs-blur"
        :style="positionStyle"
        role="alertdialog"
        aria-modal="false"
      >
        <div class="mfs-confirm-popup__body">
          <span class="mfs-confirm-popup__icon" :class="[`mfs-confirm-popup__icon--${activeVariant}`]" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </span>
          <p class="mfs-confirm-popup__message mfs-text">{{ activeMessage }}</p>
        </div>

        <div class="mfs-confirm-popup__actions">
          <button
            type="button"
            class="mfs-confirm-popup__btn mfs-confirm-popup__btn--reject mfs-surface-subtle mfs-pill mfs-focus-ring"
            @click="onReject"
          >
            {{ activeRejectLabel }}
          </button>
          <button
            type="button"
            class="mfs-confirm-popup__btn mfs-confirm-popup__btn--accept mfs-pill mfs-shadow mfs-focus-ring"
            :class="[`mfs-confirm-popup__btn--${activeVariant}`]"
            @click="onAccept"
          >
            {{ activeAcceptLabel }}
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, nextTick } from 'vue'

export interface ConfirmPopupShowOptions {
  message?: string
  acceptLabel?: string
  rejectLabel?: string
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  onAccept?: () => void
  onReject?: () => void
}

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    target?: HTMLElement | MouseEvent | null
    message?: string
    acceptLabel?: string
    rejectLabel?: string
    variant?: 'primary' | 'success' | 'warning' | 'danger'
  }>(),
  {
    modelValue: undefined,
    target: null,
    message: 'Are you sure you want to proceed?',
    acceptLabel: 'Yes',
    rejectLabel: 'No',
    variant: 'primary'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'accept'): void
  (e: 'reject'): void
}>()

const popupRef = ref<HTMLElement | null>(null)
const internalOpen = ref(false)
const internalTarget = ref<HTMLElement | null>(null)
const runtimeOpts = ref<ConfirmPopupShowOptions>({})
const coords = ref({ top: 0, left: 0 })

const isControlled = computed(() => props.modelValue !== undefined)
const isOpen = computed(() => (isControlled.value ? Boolean(props.modelValue) : internalOpen.value))

const activeMessage = computed(() => runtimeOpts.value.message ?? props.message)
const activeAcceptLabel = computed(() => runtimeOpts.value.acceptLabel ?? props.acceptLabel)
const activeRejectLabel = computed(() => runtimeOpts.value.rejectLabel ?? props.rejectLabel)
const activeVariant = computed(() => runtimeOpts.value.variant ?? props.variant)

const positionStyle = computed(() => ({
  top: `${coords.value.top}px`,
  left: `${coords.value.left}px`
}))

function resolveEl(t: HTMLElement | MouseEvent | null | undefined): HTMLElement | null {
  if (!t) return null
  if (t instanceof HTMLElement) return t
  return (t.currentTarget as HTMLElement | null) ?? (t.target as HTMLElement | null)
}

async function updatePosition() {
  await nextTick()
  const targetEl = internalTarget.value ?? resolveEl(props.target)
  if (!targetEl || typeof window === 'undefined') return
  const rect = targetEl.getBoundingClientRect()
  const popupWidth = popupRef.value?.offsetWidth ?? 260
  const left = Math.min(
    Math.max(12, rect.left + rect.width / 2 - popupWidth / 2),
    window.innerWidth - popupWidth - 12
  )
  const top = rect.bottom + 10
  coords.value = { top, left }
}

function setOpen(next: boolean) {
  if (!isControlled.value) internalOpen.value = next
  emit('update:modelValue', next)
}

function show(targetOrEvent: HTMLElement | MouseEvent, opts: ConfirmPopupShowOptions = {}) {
  internalTarget.value = resolveEl(targetOrEvent)
  runtimeOpts.value = opts
  setOpen(true)
  void updatePosition()
}

function hide() {
  setOpen(false)
}

function onAccept() {
  runtimeOpts.value.onAccept?.()
  emit('accept')
  hide()
}

function onReject() {
  runtimeOpts.value.onReject?.()
  emit('reject')
  hide()
}

const onPointerDown = (e: PointerEvent) => {
  const target = e.target as Node
  const anchor = internalTarget.value ?? resolveEl(props.target)
  if (popupRef.value?.contains(target) || anchor?.contains(target)) return
  hide()
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') hide()
}

watch(isOpen, (open) => {
  if (typeof document === 'undefined') return
  if (open) {
    void updatePosition()
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeydown)
  } else {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('pointerdown', onPointerDown)
    document.removeEventListener('keydown', onKeydown)
  }
})

defineExpose({ show, hide })
</script>

<style scoped>
.mfs-confirm-popup {
  position: fixed;
  z-index: 10030;
  width: min(290px, calc(100vw - 24px));
  padding: 14px 16px;
}

.mfs-confirm-popup__body {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.mfs-confirm-popup__icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 1px;
}

.mfs-confirm-popup__icon svg {
  width: 100%;
  height: 100%;
}

.mfs-confirm-popup__icon--primary { color: var(--primary); }
.mfs-confirm-popup__icon--success { color: var(--success); }
.mfs-confirm-popup__icon--warning { color: var(--warning); }
.mfs-confirm-popup__icon--danger { color: var(--danger); }

.mfs-confirm-popup__message {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.45;
}

.mfs-confirm-popup__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.mfs-confirm-popup__btn {
  padding: 6px 14px;
  border: 1px solid var(--border, transparent);
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.mfs-confirm-popup__btn:hover {
  transform: translateY(-1px);
}

.mfs-confirm-popup__btn--accept {
  color: var(--primary-text, #ffffff);
}

.mfs-confirm-popup__btn--primary { background-color: var(--primary); }
.mfs-confirm-popup__btn--success { background-color: var(--success); }
.mfs-confirm-popup__btn--warning { background-color: var(--warning); color: #1e293b; }
.mfs-confirm-popup__btn--danger { background-color: var(--danger); }

[data-theme="glass"] .mfs-confirm-popup {
  background-color: rgba(15, 23, 42, 0.9);
  border-color: rgba(255, 255, 255, 0.18);
}

[data-theme="neo"] .mfs-confirm-popup {
  border: none;
}

.mfs-confirm-popup-enter-active,
.mfs-confirm-popup-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.mfs-confirm-popup-enter-from,
.mfs-confirm-popup-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.96);
}
</style>
