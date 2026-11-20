<template>
  <div class="fl-wrapper" :class="{ 'fl-wrapper--active': active }">
    <slot />
    <label v-if="label" :for="forId" class="fl-label mfs-text-muted">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  forId?: string
  active?: boolean
}>()
</script>

<style scoped>
.fl-wrapper {
  position: relative;
  display: block;
  width: 100%;
}

.fl-label {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.9rem;
  font-weight: 500;
  pointer-events: none;
  padding: 0 4px;
  border-radius: 4px;
  transition: all 0.18s ease;
}

.fl-wrapper:focus-within .fl-label,
.fl-wrapper--active .fl-label,
.fl-wrapper:has(input:not(:placeholder-shown)) .fl-label,
.fl-wrapper:has(textarea:not(:placeholder-shown)) .fl-label {
  top: 0;
  transform: translateY(-50%) scale(0.84);
  background-color: var(--surface);
  color: var(--primary);
  font-weight: 600;
}

[data-theme="glass"] .fl-wrapper:focus-within .fl-label,
[data-theme="glass"] .fl-wrapper--active .fl-label {
  backdrop-filter: blur(8px);
}
</style>
