<template>
  <span
    :class="[
      'badge',
      `badge--${variant}`,
      `badge--${size}`,
      'mfs-pill',
      'mfs-shadow',
      variant === 'surface' ? 'mfs-surface' : `mfs-bg-${variant}`
    ]"
  >
    <slot name="prepend" />
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'surface'
    size?: 'sm' | 'md'
  }>(),
  {
    variant: 'primary',
    size: 'md'
  }
)
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  border: 1px solid var(--border, transparent);
  backdrop-filter: var(--backdrop-blur, none);
  text-transform: capitalize;
  user-select: none;
}

.badge--sm {
  padding: 2px 8px;
  font-size: 0.75rem;
}

.badge--md {
  padding: 4px 12px;
  font-size: 0.85rem;
}
</style>
