<template>
  <div class="ifta-wrapper mfs-surface mfs-rounded mfs-shadow-inset">
    <label v-if="label" :for="forId" class="ifta-label mfs-text-muted">{{ label }}</label>
    <div class="ifta-control">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string
  forId?: string
}>()
</script>

<style scoped>
.ifta-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 14px 6px;
  width: 100%;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ifta-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 25%, transparent), var(--input-shadow);
}

.ifta-wrapper:focus-within .ifta-label {
  color: var(--primary);
}

.ifta-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.ifta-control :deep(input),
.ifta-control :deep(textarea),
.ifta-control :deep(select) {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: 2px 0;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text);
}

[data-theme="glass"] .ifta-wrapper { border-color: rgba(255, 255, 255, 0.25); }
[data-theme="neo"] .ifta-wrapper { box-shadow: inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8); }
</style>
