<template>
  <button
    v-liquid-glass
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      'mfs-shadow',
      'mfs-focus-ring',
      variant === 'surface' ? 'mfs-surface' : `mfs-bg-${variant}`,
      {
        'mfs-pill': pill,
        'mfs-rounded': !pill,
        'btn--block': block,
        'btn--loading': loading,
        'btn--disabled mfs-disabled': disabled || loading
      }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" class="btn__spinner"></span>
    <span v-if="$slots.prepend && !loading" class="btn__icon btn__icon--prepend">
      <slot name="prepend" />
    </span>
    <span class="btn__content">
      <slot />
    </span>
    <span v-if="$slots.append && !loading" class="btn__icon btn__icon--append">
      <slot name="append" />
    </span>
  </button>
</template>

<script setup lang="ts">
import { vLiquidGlass } from '../composables/useLiquidGlass'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'surface' | 'success' | 'warning' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    pill?: boolean
    block?: boolean
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    pill: true,
    block: false,
    loading: false,
    disabled: false,
    type: 'button'
  }
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  font-weight: 600;
  border: var(--border-width, 1px) solid var(--border, transparent);
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1), border-color 0.2s cubic-bezier(0.2, 0, 0, 1), color 0.2s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1), opacity 0.2s cubic-bezier(0.2, 0, 0, 1), transform 0.2s cubic-bezier(0.2, 0, 0, 1);
  user-select: none;
  text-decoration: none;
  backdrop-filter: var(--backdrop-blur, none);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

/* Sizes */
.btn--sm {
  padding: 6px 14px;
  font-size: 0.85rem;
  letter-spacing: 0.01em;
}

.btn--md {
  padding: 10px 22px;
  font-size: 0.95rem;
}

.btn--lg {
  padding: 14px 30px;
  font-size: 1.1rem;
}

.btn--block {
  display: flex;
  width: 100%;
}

/* Variants */
.btn--primary {
  color: var(--primary-text, #ffffff);
}

.btn--secondary {
  color: var(--secondary-text, #ffffff);
}

.btn--success {
  color: var(--success-text, #ffffff);
}

.btn--warning {
  color: var(--warning-text, #1e293b);
}

.btn--danger {
  color: var(--danger-text, #ffffff);
}

[data-theme="clay"] .btn--primary {
  box-shadow:
    0 5px 12px color-mix(in srgb, var(--primary) 22%, transparent),
    inset -2px -2px 5px rgba(46, 16, 101, 0.22),
    inset 2px 2px 5px rgba(255, 255, 255, 0.48);
}

[data-theme="clay"] .btn--primary:hover:not(:disabled) {
  box-shadow:
    0 8px 18px color-mix(in srgb, var(--primary) 28%, transparent),
    inset -3px -3px 6px rgba(46, 16, 101, 0.26),
    inset 3px 3px 6px rgba(255, 255, 255, 0.58);
}

[data-theme="clay"] .btn--primary:active:not(:disabled) {
  box-shadow:
    0 2px 6px color-mix(in srgb, var(--primary) 20%, transparent),
    inset 2px 2px 5px rgba(46, 16, 101, 0.34),
    inset -2px -2px 5px rgba(255, 255, 255, 0.35);
}

[data-theme="clay"] .btn--secondary {
  box-shadow:
    0 5px 12px rgba(6, 182, 212, 0.22),
    inset -2px -2px 5px rgba(8, 51, 68, 0.22),
    inset 2px 2px 5px rgba(255, 255, 255, 0.48);
}

[data-theme="clay"] .btn--secondary:hover:not(:disabled) {
  box-shadow:
    0 8px 18px rgba(6, 182, 212, 0.28),
    inset -3px -3px 6px rgba(8, 51, 68, 0.26),
    inset 3px 3px 6px rgba(255, 255, 255, 0.58);
}

[data-theme="clay"] .btn--secondary:active:not(:disabled) {
  box-shadow:
    0 2px 6px rgba(6, 182, 212, 0.2),
    inset 2px 2px 5px rgba(8, 51, 68, 0.34),
    inset -2px -2px 5px rgba(255, 255, 255, 0.35);
}

[data-theme="clay"] .btn--success {
  box-shadow:
    0 5px 12px rgba(4, 120, 87, 0.22),
    inset -2px -2px 5px rgba(2, 44, 34, 0.22),
    inset 2px 2px 5px rgba(255, 255, 255, 0.48);
}

[data-theme="clay"] .btn--success:hover:not(:disabled) {
  box-shadow:
    0 8px 18px rgba(4, 120, 87, 0.28),
    inset -3px -3px 6px rgba(2, 44, 34, 0.26),
    inset 3px 3px 6px rgba(255, 255, 255, 0.58);
}

[data-theme="clay"] .btn--success:active:not(:disabled) {
  box-shadow:
    0 2px 6px rgba(4, 120, 87, 0.2),
    inset 2px 2px 5px rgba(2, 44, 34, 0.34),
    inset -2px -2px 5px rgba(255, 255, 255, 0.35);
}

[data-theme="clay"] .btn--warning {
  box-shadow:
    0 5px 12px rgba(245, 158, 11, 0.22),
    inset -2px -2px 5px rgba(120, 53, 15, 0.22),
    inset 2px 2px 5px rgba(255, 255, 255, 0.48);
}

[data-theme="clay"] .btn--warning:hover:not(:disabled) {
  box-shadow:
    0 8px 18px rgba(245, 158, 11, 0.28),
    inset -3px -3px 6px rgba(120, 53, 15, 0.26),
    inset 3px 3px 6px rgba(255, 255, 255, 0.58);
}

[data-theme="clay"] .btn--warning:active:not(:disabled) {
  box-shadow:
    0 2px 6px rgba(245, 158, 11, 0.2),
    inset 2px 2px 5px rgba(120, 53, 15, 0.34),
    inset -2px -2px 5px rgba(255, 255, 255, 0.35);
}

[data-theme="clay"] .btn--danger {
  box-shadow:
    0 5px 12px rgba(244, 63, 94, 0.22),
    inset -2px -2px 5px rgba(136, 19, 55, 0.22),
    inset 2px 2px 5px rgba(255, 255, 255, 0.48);
}

[data-theme="clay"] .btn--danger:hover:not(:disabled) {
  box-shadow:
    0 8px 18px rgba(244, 63, 94, 0.28),
    inset -3px -3px 6px rgba(136, 19, 55, 0.26),
    inset 3px 3px 6px rgba(255, 255, 255, 0.58);
}

[data-theme="clay"] .btn--danger:active:not(:disabled) {
  box-shadow:
    0 2px 6px rgba(244, 63, 94, 0.2),
    inset 2px 2px 5px rgba(136, 19, 55, 0.34),
    inset -2px -2px 5px rgba(255, 255, 255, 0.35);
}

[data-theme="glass"] .btn--primary {
  box-shadow: 0 4px 20px color-mix(in srgb, var(--primary) 35%, transparent);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

[data-theme="neo"] .btn--primary {
  box-shadow: 4px 4px 10px #bcc5d3, -4px -4px 10px #ffffff;
}

/* Hover & Active tactile feedback */
.btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: var(--clay-shadow-hover);
  filter: brightness(1.05);
}

.btn:not(:disabled):active {
  transform: translateY(1px) scale(0.98);
  box-shadow: var(--clay-shadow-active);
}

.btn:disabled,
.btn--disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

/* Spinner */
.btn__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: btn-spin 0.7s linear infinite;
}

@keyframes btn-spin {
  to { transform: rotate(360deg); }
}

.btn__icon {
  display: inline-flex;
  align-items: center;
  font-size: 1.1em;
}
</style>
