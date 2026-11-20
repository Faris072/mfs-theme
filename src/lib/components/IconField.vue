<template>
  <div
    class="icon-field"
    :class="[`icon-field--${iconPosition}`, { 'icon-field--fluid': fluid }]"
  >
    <span v-if="$slots.icon" class="icon-field__icon mfs-text-muted" aria-hidden="true">
      <slot name="icon" />
    </span>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    iconPosition?: 'left' | 'right'
    fluid?: boolean
  }>(),
  {
    iconPosition: 'left',
    fluid: false
  }
)
</script>

<style scoped>
.icon-field {
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
}

.icon-field--fluid {
  display: flex;
  width: 100%;
}

.icon-field__icon,
.icon-field :deep(.input-icon) {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  color: var(--text-muted);
  transition: color 0.2s ease;
  z-index: 2;
}

.icon-field--left .icon-field__icon,
.icon-field--left :deep(.input-icon) {
  left: 14px;
}

.icon-field--right .icon-field__icon,
.icon-field--right :deep(.input-icon) {
  right: 14px;
}

.icon-field--left :deep(input) {
  padding-left: 38px;
}

.icon-field--right :deep(input) {
  padding-right: 38px;
}

.icon-field--left :deep(.input-box) {
  padding-left: 38px;
}

.icon-field--right :deep(.input-box) {
  padding-right: 38px;
}

.icon-field--left :deep(.input-box input),
.icon-field--right :deep(.input-box input) {
  padding-left: 4px;
  padding-right: 4px;
}

.icon-field:focus-within .icon-field__icon,
.icon-field:focus-within :deep(.input-icon) {
  color: var(--primary);
}

[data-theme="clay"] .icon-field__icon {
  filter: drop-shadow(0 1px 1px rgba(255, 255, 255, 0.6));
}

[data-theme="glass"] .icon-field:focus-within .icon-field__icon {
  color: var(--primary);
}

[data-theme="neo"] .icon-field__icon {
  color: var(--text-muted);
}
</style>
