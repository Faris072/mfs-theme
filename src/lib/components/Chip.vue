<template>
  <span
    :class="[
      'chip',
      'mfs-pill',
      'mfs-shadow',
      variant === 'surface' ? 'mfs-surface' : `mfs-bg-${variant}`,
      `chip--${variant}`,
      { 'chip--clickable mfs-interactive mfs-focus-ring': clickable, 'chip--active': active }
    ]"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-pressed="clickable ? active : undefined"
    @click="handleClick"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <span v-if="$slots.prepend" class="chip__prepend">
      <slot name="prepend" />
    </span>
    <span class="chip__label">
      <slot>{{ label }}</slot>
    </span>
    <button
      v-if="removable"
      type="button"
      class="chip__remove"
      aria-label="Remove"
      @click.stop="emit('remove')"
    >
      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" aria-hidden="true">
        <path
          d="M4 4l8 8M12 4l-8 8"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
    </button>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    removable?: boolean
    clickable?: boolean
    active?: boolean
    variant?: 'primary' | 'secondary' | 'surface' | 'success' | 'warning' | 'danger'
  }>(),
  {
    removable: false,
    clickable: false,
    active: false,
    variant: 'surface'
  }
)

const emit = defineEmits<{
  (e: 'click', event: Event): void
  (e: 'remove'): void
}>()

const handleClick = (event: Event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.2;
  border-radius: var(--radius-pill, 9999px);
  border: 1px solid var(--border, transparent);
  box-shadow: var(--clay-shadow);
  backdrop-filter: var(--backdrop-blur, none);
  user-select: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
}

.chip--clickable {
  cursor: pointer;
}

.chip--clickable:hover {
  transform: translateY(-1px);
}

.chip--clickable:active {
  transform: scale(0.97);
}

.chip--surface {
  background-color: var(--surface);
  color: var(--text);
}

.chip--primary {
  background-color: var(--primary);
  color: var(--primary-text, #ffffff);
}

.chip--secondary {
  background-color: var(--secondary);
  color: var(--secondary-text, #ffffff);
}

.chip--success {
  background-color: var(--success);
  color: var(--success-text, #ffffff);
}

.chip--warning {
  background-color: var(--warning);
  color: var(--warning-text, #1e293b);
}

.chip--danger {
  background-color: var(--danger);
  color: var(--danger-text, #ffffff);
}

.chip--active {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

.chip__prepend {
  display: inline-flex;
  align-items: center;
}

.chip__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.12);
  color: inherit;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.chip__remove:hover {
  background: rgba(0, 0, 0, 0.24);
  transform: scale(1.1);
}

[data-theme="glass"] .chip {
  border: 1px solid rgba(255, 255, 255, 0.28);
}

[data-theme="neo"] .chip--active {
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.15), inset -3px -3px 6px rgba(255, 255, 255, 0.7);
  outline: none;
}
</style>
